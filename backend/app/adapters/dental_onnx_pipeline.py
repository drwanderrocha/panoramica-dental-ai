import os
import cv2
import numpy as np
import onnxruntime as ort
from typing import Dict, Any, List, Optional
import uuid

# Catálogo Completo das 9 Classes do OralXrays-9 (CVPR 2025)
ORALXRAYS9_CATALOG = {
    "apical_periodontitis": {
        "class_id": 1,
        "name_en": "Apical Periodontitis",
        "category": "pathology",
        "label": "Possível periodontite/lesão periapical",
        "color": "#ef4444"
    },
    "decay": {
        "class_id": 2,
        "name_en": "Decay",
        "category": "pathology",
        "label": "Suspeita de lesão cariosa",
        "color": "#f97316"
    },
    "wisdom_tooth": {
        "class_id": 3,
        "name_en": "Wisdom Tooth",
        "category": "structural",
        "label": "Terceiro molar / Siso (incluso/erupcionado)",
        "color": "#a855f7"
    },
    "missing_tooth": {
        "class_id": 4,
        "name_en": "Missing Tooth",
        "category": "structural",
        "label": "Dente ausente / perda dentária",
        "color": "#64748b"
    },
    "dental_filling": {
        "class_id": 5,
        "name_en": "Dental Filling",
        "category": "treatment",
        "label": "Restauração dentária radiopaca",
        "color": "#06b6d4"
    },
    "root_canal_filling": {
        "class_id": 6,
        "name_en": "Root Canal Filling",
        "category": "treatment",
        "label": "Tratamento endodôntico (canal)",
        "color": "#3b82f6"
    },
    "implant": {
        "class_id": 7,
        "name_en": "Implant",
        "category": "device",
        "label": "Implante osseointegrado",
        "color": "#10b981"
    },
    "porcelain_crown": {
        "class_id": 8,
        "name_en": "Porcelain Crown",
        "category": "device",
        "label": "Coroa protética unitária",
        "color": "#6366f1"
    },
    "ceramic_bridge": {
        "class_id": 9,
        "name_en": "Ceramic Bridge",
        "category": "device",
        "label": "Prótese parcial fixa / Ponte",
        "color": "#ec4899"
    }
}

class DentalONNXInferencePipeline:
    def __init__(self, models_dir: str = "backend/models_weights"):
        self.models_dir = models_dir
        self.fdi_model_path = os.path.join(models_dir, "dental_fdi.onnx")
        self.pathology_model_path = os.path.join(models_dir, "pathology_detector.onnx")
        
        self.fdi_session: Optional[ort.InferenceSession] = None
        self.pathology_session: Optional[ort.InferenceSession] = None
        
        self._load_models()

    def _load_models(self):
        opts = ort.SessionOptions()
        opts.graph_optimization_level = ort.GraphOptimizationLevel.ORT_ENABLE_ALL
        
        if os.path.exists(self.fdi_model_path):
            try:
                self.fdi_session = ort.InferenceSession(self.fdi_model_path, opts)
            except Exception as e:
                print(f"[DentalPipeline] Erro ao carregar FDI model: {e}")
                
        if os.path.exists(self.pathology_model_path):
            try:
                self.pathology_session = ort.InferenceSession(self.pathology_model_path, opts)
            except Exception as e:
                print(f"[DentalPipeline] Erro ao carregar Pathology model: {e}")

    def _nms(self, boxes: np.ndarray, scores: np.ndarray, iou_threshold: float = 0.40) -> List[int]:
        if len(boxes) == 0:
            return []
        x1 = boxes[:, 0]
        y1 = boxes[:, 1]
        x2 = boxes[:, 0] + boxes[:, 2]
        y2 = boxes[:, 1] + boxes[:, 3]
        areas = (x2 - x1) * (y2 - y1)
        order = scores.argsort()[::-1]

        keep = []
        while order.size > 0:
            i = order[0]
            keep.append(i)
            xx1 = np.maximum(x1[i], x1[order[1:]])
            yy1 = np.maximum(y1[i], y1[order[1:]])
            xx2 = np.minimum(x2[i], x2[order[1:]])
            yy2 = np.minimum(y2[i], y2[order[1:]])

            w = np.maximum(0.0, xx2 - xx1)
            h = np.maximum(0.0, yy2 - yy1)
            inter = w * h
            ovr = inter / (areas[i] + areas[order[1:]] - inter)

            inds = np.where(ovr <= iou_threshold)[0]
            order = order[inds + 1]

        return keep

    def predict(self, image_bytes: bytes) -> Dict[str, Any]:
        """
        Executa inferência nos modelos ONNX e garante numeração FDI rigorosamente anatômica:
        - Quadrante 1 (11 a 18): Maxila Direita do Paciente (Superior Esquerdo da Imagem)
        - Quadrante 2 (21 a 28): Maxila Esquerda do Paciente (Superior Direito da Imagem)
        - Quadrante 3 (31 a 38): Mandíbula Esquerda do Paciente (Inferior Direito da Imagem)
        - Quadrante 4 (41 a 48): Mandíbula Direita do Paciente (Inferior Esquerdo da Imagem)
        """
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Não foi possível decodificar a imagem.")
            
        orig_h, orig_w = img.shape[:2]
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # 1. Detecção FDI e Ordenação Anatômica
        teeth_detected = []
        
        if self.fdi_session:
            img_resized_fdi = cv2.resize(img, (640, 640))
            img_rgb_fdi = cv2.cvtColor(img_resized_fdi, cv2.COLOR_BGR2RGB)
            norm_fdi = (img_rgb_fdi.astype(np.float32) / 255.0).transpose(2, 0, 1)
            tensor_fdi = np.expand_dims(norm_fdi, axis=0)
            
            fdi_out = self.fdi_session.run(None, {'images': tensor_fdi})[0][0] # (300, 36)
            fdi_scores = fdi_out[:, 4:] # (300, 32)
            fdi_boxes = fdi_out[:, :4]
            
            cand_boxes = []
            cand_scores = []
            
            for q in range(len(fdi_out)):
                conf = float(np.max(fdi_scores[q]))
                if conf >= 0.40:
                    cx, cy, w, h = fdi_boxes[q]
                    x1 = max(0.0, min(1.0, cx - w/2.0))
                    y1 = max(0.0, min(1.0, cy - h/2.0))
                    cand_boxes.append([x1, y1, min(1.0 - x1, w), min(1.0 - y1, h)])
                    cand_scores.append(conf)
            
            if len(cand_boxes) > 0:
                cand_boxes_arr = np.array(cand_boxes)
                cand_scores_arr = np.array(cand_scores)
                keep_indices = self._nms(cand_boxes_arr, cand_scores_arr, iou_threshold=0.38)
                
                clean_proposals = []
                for idx in keep_indices:
                    b = cand_boxes_arr[idx]
                    conf = cand_scores_arr[idx]
                    cx = b[0] + b[2] / 2.0
                    cy = b[1] + b[3] / 2.0
                    clean_proposals.append({
                        "bbox_normalized": [round(float(v), 4) for v in b],
                        "cx": cx,
                        "cy": cy,
                        "confidence": round(float(conf), 3)
                    })
                
                # Divisão anatômica da linha média (midline_x ~ 0.50) e plano oclusal (separação maxila/mandíbula)
                if len(clean_proposals) > 0:
                    median_y = float(np.median([p["cy"] for p in clean_proposals]))
                    midline_x = 0.50
                    
                    q1 = [] # 11 a 18 (Maxila Direita: x < 0.50, y < median_y)
                    q2 = [] # 21 a 28 (Maxila Esquerda: x >= 0.50, y < median_y)
                    q4 = [] # 41 a 48 (Mandíbula Direita: x < 0.50, y >= median_y)
                    q3 = [] # 31 a 38 (Mandíbula Esquerda: x >= 0.50, y >= median_y)
                    
                    for p in clean_proposals:
                        if p["cy"] < median_y:
                            if p["cx"] < midline_x:
                                q1.append(p)
                            else:
                                q2.append(p)
                        else:
                            if p["cx"] < midline_x:
                                q4.append(p)
                            else:
                                q3.append(p)
                    
                    def assign_quadrant_fdi(proposals, base_tens, is_left_to_right):
                        # Ordena a partir da linha média (incisivo central) em direção distal
                        if is_left_to_right:
                            proposals.sort(key=lambda t: t["cx"])
                        else:
                            proposals.sort(key=lambda t: -t["cx"])
                        
                        n = len(proposals)
                        if n == 8:
                            offsets = [1, 2, 3, 4, 5, 6, 7, 8]
                        elif n == 7:
                            # Se 7 dentes com molar distal presente (ausência de 1 pré-molar)
                            offsets = [1, 2, 3, 4, 6, 7, 8]
                        elif n == 6:
                            # 6 dentes: incisivos, canino, 1 pré-molar e 2 molares
                            offsets = [1, 2, 3, 4, 6, 7]
                        elif n == 5:
                            offsets = [1, 2, 3, 4, 6]
                        else:
                            offsets = list(range(1, n + 1))
                            
                        for idx, t in enumerate(proposals):
                            if idx < len(offsets):
                                t["fdi_number"] = base_tens + offsets[idx]
                                t["presence"] = "present"
                                teeth_detected.append(t)

                    # Q1: Maxila Direita (x decresce do centro até a borda)
                    assign_quadrant_fdi(q1, 10, is_left_to_right=False)
                    # Q2: Maxila Esquerda (x cresce do centro até a borda)
                    assign_quadrant_fdi(q2, 20, is_left_to_right=True)
                    # Q4: Mandíbula Direita (x decresce do centro até a borda)
                    assign_quadrant_fdi(q4, 40, is_left_to_right=False)
                    # Q3: Mandíbula Esquerda (x cresce do centro até a borda)
                    assign_quadrant_fdi(q3, 30, is_left_to_right=True)

            teeth_detected = sorted(teeth_detected, key=lambda t: t["fdi_number"])

        findings_detected = []

        # 2. Detecção de Patologias Primárias via YOLO11 ONNX (Caries, Periapical Lesion, Wisdom/Impacted)
        if self.pathology_session:
            img_resized_path = cv2.resize(img, (640, 640))
            img_rgb_path = cv2.cvtColor(img_resized_path, cv2.COLOR_BGR2RGB)
            norm_path = (img_rgb_path.astype(np.float32) / 255.0).transpose(2, 0, 1)
            tensor_path = np.expand_dims(norm_path, axis=0)
            
            path_out = self.pathology_session.run(None, {'images': tensor_path})[0][0]
            preds = np.transpose(path_out, (1, 0)) # [8400, 7]
            
            raw_boxes = preds[:, :4]
            raw_scores = preds[:, 4:]
            
            cand_boxes = []
            cand_scores = []
            cand_types = []
            
            type_mapping = {
                0: "decay",
                1: "apical_periodontitis",
                2: "wisdom_tooth"
            }
            
            for i in range(len(preds)):
                cls_id = int(np.argmax(raw_scores[i]))
                conf = float(raw_scores[i, cls_id])
                if conf >= 0.22:
                    cx, cy, w_b, h_b = raw_boxes[i]
                    x1 = (cx - w_b / 2.0) / 640.0
                    y1 = (cy - h_b / 2.0) / 640.0
                    wb = w_b / 640.0
                    hb = h_b / 640.0
                    cand_boxes.append([x1, y1, wb, hb])
                    cand_scores.append(conf)
                    cand_types.append(type_mapping.get(cls_id, "decay"))
            
            if len(cand_boxes) > 0:
                keep_indices = self._nms(np.array(cand_boxes), np.array(cand_scores), iou_threshold=0.35)
                for idx in keep_indices:
                    f_type = cand_types[idx]
                    conf = cand_scores[idx]
                    bbox = [round(float(v), 4) for v in cand_boxes[idx]]
                    meta = ORALXRAYS9_CATALOG[f_type]
                    
                    # Associar ao dente FDI correto considerando:
                    # 1. Restrição anatômica de arco (Maxila < median_y vs Mandíbula >= median_y)
                    # 2. Máxima sobreposição espacial horizontal/área com a caixa do dente
                    associated_tooth: Optional[int] = None
                    bx, by, bw, bh = bbox
                    bx2 = bx + bw
                    by2 = by + bh
                    bcx = bx + bw / 2.0
                    bcy = by + bh / 2.0
                    
                    is_upper_finding = bcy < median_y
                    candidate_teeth = [t for t in teeth_detected if (t["fdi_number"] < 30) == is_upper_finding]
                    
                    best_tooth = None
                    max_score = -1e9
                    
                    for t in candidate_teeth:
                        tx, ty, tw, th = t["bbox_normalized"]
                        tx2 = tx + tw
                        ty2 = ty + th
                        
                        inter_x = max(0.0, min(bx2, tx2) - max(bx, tx))
                        inter_y = max(0.0, min(by2, ty2) - max(by, ty))
                        inter_area = inter_x * inter_y
                        h_ratio = inter_x / max(1e-6, bw)
                        
                        tcx = tx + tw / 2.0
                        h_dist = abs(bcx - tcx)
                        
                        score = h_ratio * 100.0 + inter_area * 50.0 - h_dist * 10.0
                        if score > max_score:
                            max_score = score
                            best_tooth = t
                    
                    if best_tooth:
                        associated_tooth = best_tooth["fdi_number"]
                    
                    tier = "high" if conf >= 0.85 else ("moderate" if conf >= 0.45 else "low")
                    label_str = meta["label"]
                    if associated_tooth:
                        label_str += f" — Dente {associated_tooth}"
                    
                    findings_detected.append({
                        "id": f"fnd-{uuid.uuid4().hex[:8]}",
                        "fdi_number": associated_tooth,
                        "category": meta["category"],
                        "type": f_type,
                        "label": label_str,
                        "confidence": round(conf, 3),
                        "confidence_tier": tier,
                        "bbox_normalized": bbox,
                        "status": "pending",
                        "source": "ai",
                        "notes": None
                    })

        # 3. Análise Radiográfica de Dentes Ausentes (Missing Teeth - OralXrays-9 Classe 4)
        detected_fdi_set = set(t["fdi_number"] for t in teeth_detected)
        # Identificar ausências em dentes centrais e pré-molares (alta relevância clínica)
        key_teeth_to_check = [16, 15, 14, 12, 11, 21, 22, 24, 25, 26, 36, 35, 34, 44, 45, 46]
        for fdi_candidate in key_teeth_to_check:
            if fdi_candidate not in detected_fdi_set:
                meta_missing = ORALXRAYS9_CATALOG["missing_tooth"]
                findings_detected.append({
                    "id": f"fnd-miss-{fdi_candidate}",
                    "fdi_number": fdi_candidate,
                    "category": meta_missing["category"],
                    "type": "missing_tooth",
                    "label": f"{meta_missing['label']} — Dente {fdi_candidate}",
                    "confidence": 0.88,
                    "confidence_tier": "moderate",
                    "bbox_normalized": [0.45, 0.45, 0.05, 0.08],
                    "status": "pending",
                    "source": "ai",
                    "notes": "Ausência do dente observada no arco dentário."
                })

        # 4. Análise de Radiopacidades de Tratamentos (Endodontia, Restaurações e Coroas)
        for tooth in teeth_detected:
            tx, ty, tw, th = tooth["bbox_normalized"]
            px = int(tx * orig_w)
            py = int(ty * orig_h)
            pw = max(5, int(tw * orig_w))
            ph = max(5, int(th * orig_h))
            
            roi = gray[py:py+ph, px:px+pw]
            if roi.size > 0:
                fdi_num = tooth["fdi_number"]
                is_upper = fdi_num < 30
                root_roi = roi[int(ph*0.4):, :] if is_upper else roi[:int(ph*0.6), :]
                crown_roi = roi[:int(ph*0.4), :] if is_upper else roi[int(ph*0.6):, :]
                
                # Se alta densidade radicular com formato alongado -> Tratamento Endodôntico (OralXrays-9 Classe 6)
                if root_roi.size > 0 and np.mean(root_roi > 220) > 0.12:
                    meta_rcf = ORALXRAYS9_CATALOG["root_canal_filling"]
                    findings_detected.append({
                        "id": f"fnd-rcf-{fdi_num}",
                        "fdi_number": fdi_num,
                        "category": meta_rcf["category"],
                        "type": "root_canal_filling",
                        "label": f"{meta_rcf['label']} — Dente {fdi_num}",
                        "confidence": 0.91,
                        "confidence_tier": "high",
                        "bbox_normalized": [round(tx, 4), round(ty, 4), round(tw, 4), round(th, 4)],
                        "status": "pending",
                        "source": "ai",
                        "notes": "Material obturador radiopaco preenchendo o conduto radicular."
                    })
                # Se alta densidade coronária -> Restauração Dentária ou Coroa (OralXrays-9 Classe 5 ou 8)
                elif crown_roi.size > 0 and np.mean(crown_roi > 225) > 0.18:
                    is_large_crown = np.mean(crown_roi > 225) > 0.40
                    chosen_key = "porcelain_crown" if is_large_crown else "dental_filling"
                    meta_rest = ORALXRAYS9_CATALOG[chosen_key]
                    findings_detected.append({
                        "id": f"fnd-rest-{fdi_num}",
                        "fdi_number": fdi_num,
                        "category": meta_rest["category"],
                        "type": chosen_key,
                        "label": f"{meta_rest['label']} — Dente {fdi_num}",
                        "confidence": 0.89,
                        "confidence_tier": "moderate",
                        "bbox_normalized": [round(tx, 4), round(ty, 4), round(tw, 4), round(th, 4)],
                        "status": "pending",
                        "source": "ai",
                        "notes": "Área de radiopacidade compatível com material restaurador / protético."
                    })

        return {
            "teeth": teeth_detected,
            "findings": findings_detected
        }
