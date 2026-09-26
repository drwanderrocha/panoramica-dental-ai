import os
import uuid
import time
from datetime import datetime
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import Optional, List

from backend.app.adapters.quality_checker import analyze_image_quality
from backend.app.adapters.dental_onnx_pipeline import DentalONNXInferencePipeline
from backend.app.adapters.periapical_prad_pipeline import PeriapicalPRADPipeline
from backend.app.services.llm_report_service import build_clinical_report
from backend.app.models.schemas import (
    AnalysisResponse,
    ModalityInfo,
    ImageQualityInfo,
    ToothDetection,
    FindingItem,
    SegmentationLayerItem,
    GenerateReportRequest,
    GenerateReportResponse
)

# Inicializar aplicação FastAPI
app = FastAPI(
    title="Panorâmica Dental AI API",
    description="Serviço de análise de radiografias odontológicas (Panorâmica & Periapical PRAD) com detecção e segmentação",
    version="1.2.0"
)

# CORS para comunicação com o Frontend Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Diretórios de armazenamento
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SAMPLES_DIR = os.path.join(BASE_DIR, "samples")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(SAMPLES_DIR, exist_ok=True)
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Montar arquivos estáticos para que o frontend carregue as imagens diretamente no canvas
app.mount("/static/samples", StaticFiles(directory=SAMPLES_DIR), name="samples")
app.mount("/static/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")

# Instâncias dos pipelines de visão computacional
pipeline = DentalONNXInferencePipeline()
periapical_pipeline = PeriapicalPRADPipeline()

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "models_loaded": {
            "dental_fdi_onnx": pipeline.fdi_session is not None,
            "pathology_onnx": pipeline.pathology_session is not None,
            "periapical_prad_pipeline": True
        },
        "time": datetime.now().isoformat()
    }

@app.get("/api/v1/samples")
def list_samples():
    """Retorna as radiografias clínicas reais disponíveis (Panorâmicas e Periapicais)."""
    samples_info = []
    
    # Amostras Panorâmicas
    pano_descriptions = {
        "sample_panoramic_01.jpg": "Panorâmica: Terceiros molares inclusos e apinhamento anterior",
        "sample_panoramic_02.jpg": "Panorâmica: Lesões cariosas coronárias e dente impactado"
    }
    for f in sorted(os.listdir(SAMPLES_DIR)):
        fp = os.path.join(SAMPLES_DIR, f)
        if os.path.isfile(fp) and f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
            samples_info.append({
                "id": f,
                "filename": f,
                "modality": "panoramic",
                "url": f"/static/samples/{f}",
                "description": pano_descriptions.get(f, "Radiografia panorâmica clínica real"),
                "size_bytes": os.path.getsize(fp)
            })
            
    # Amostras Periapicais
    peri_dir = os.path.join(SAMPLES_DIR, "periapical")
    if os.path.exists(peri_dir):
        peri_descriptions = {
            "sample_periapical_01_lesao_apical.jpg": "Periapical: Pré-molares com Lesão Periapical (Periodontite Apical) e RCF",
            "sample_periapical_02_carie_profunda.jpg": "Periapical: Molares com Cárie Interproximal profunda e polpa evidente",
            "sample_periapical_03_perda_ossea.jpg": "Periapical: Região posterior com Reabsorção Óssea Alveolar (Periodontia)",
            "sample_periapical_04_higido.jpg": "Periapical: Dentes posteriores hígidos (Controle com crista óssea intacta)"
        }
        for f in sorted(os.listdir(peri_dir)):
            fp = os.path.join(peri_dir, f)
            if os.path.isfile(fp) and f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                samples_info.append({
                    "id": f"periapical/{f}",
                    "filename": f,
                    "modality": "periapical",
                    "url": f"/static/samples/periapical/{f}",
                    "description": peri_descriptions.get(f, "Radiografia periapical clínica real"),
                    "size_bytes": os.path.getsize(fp)
                })
                
    return {"samples": samples_info}

@app.post("/api/v1/analyze", response_model=AnalysisResponse)
async def analyze_exam(
    file: Optional[UploadFile] = File(None),
    sample_id: Optional[str] = Form(None),
    modality: Optional[str] = Form(None)
):
    """
    Executa pipeline real de qualidade, detecção e segmentação de dentes e achados.
    Suporta modalidades Panorâmica (OralXrays-9 / DENTEX) e Periapical (PRAD).
    """
    exam_id = str(uuid.uuid4())
    start_time = time.time()
    
    image_bytes = None
    image_relative_url = ""
    
    if sample_id:
        # Se for amostra periapical em subpasta
        sample_path = os.path.join(SAMPLES_DIR, sample_id.replace("/", os.sep))
        if not os.path.exists(sample_path):
            raise HTTPException(status_code=404, detail=f"Amostra '{sample_id}' não encontrada.")
        with open(sample_path, "rb") as f:
            image_bytes = f.read()
        image_relative_url = f"/static/samples/{sample_id}"
    elif file:
        image_bytes = await file.read()
        ext = os.path.splitext(file.filename or "exam.jpg")[1]
        saved_filename = f"{exam_id}{ext}"
        saved_path = os.path.join(UPLOADS_DIR, saved_filename)
        with open(saved_path, "wb") as f:
            f.write(image_bytes)
        image_relative_url = f"/static/uploads/{saved_filename}"
    else:
        raise HTTPException(status_code=400, detail="É necessário enviar um arquivo ou especificar um 'sample_id'.")

    # 1. Checagem real de qualidade com OpenCV
    quality_raw = analyze_image_quality(image_bytes)
    quality_info = ImageQualityInfo(**quality_raw)

    # 2. Resolução da modalidade alvo (periapical vs panorâmica)
    is_target_periapical = False
    if modality == "periapical":
        is_target_periapical = True
    elif modality == "panoramic":
        is_target_periapical = False
    elif sample_id and "periapical" in sample_id.lower():
        is_target_periapical = True
    else:
        # Detecção automática baseada na proporção e textura da imagem
        is_target_periapical = quality_info.is_periapical and not quality_info.is_panoramic

    segmentations_list = None
    if is_target_periapical:
        # Executar pipeline PRAD de Radiografias Periapicais
        peri_res = periapical_pipeline.predict(image_bytes)
        teeth_list = [ToothDetection(**t) for t in peri_res["teeth"]]
        findings_list = [FindingItem(**f) for f in peri_res["findings"]]
        segmentations_list = [SegmentationLayerItem(**s) for s in peri_res["segmentations"]]
        
        modality_detected = "periapical"
        modality_conf = quality_info.periapical_confidence or 0.95
        model_name = "PRAD / PRNet Benchmark (9-Layer Periapical Segmentation & Endodontic Analysis)"
    else:
        # Executar pipeline ONNX de Radiografias Panorâmicas
        inference_result = pipeline.predict(image_bytes)
        teeth_list = [ToothDetection(**t) for t in inference_result["teeth"]]
        findings_list = [FindingItem(**f) for f in inference_result["findings"]]
        
        modality_detected = "panoramic"
        modality_conf = quality_info.panoramic_confidence or 0.96
        model_name = "ONNX (abychkov/dental-fdi + liodon-ai/panoramic-pathology)"

    duration_ms = int((time.time() - start_time) * 1000)

    return AnalysisResponse(
        exam_id=exam_id,
        modality=ModalityInfo(
            detected=modality_detected,
            confidence=modality_conf,
            is_panoramic=(modality_detected == "panoramic"),
            is_periapical=(modality_detected == "periapical")
        ),
        image_quality=quality_info,
        teeth=teeth_list,
        findings=findings_list,
        segmentations=segmentations_list,
        image_url=image_relative_url,
        meta={
            "model_pipeline": model_name,
            "inference_duration_ms": duration_ms,
            "processed_at": datetime.now().isoformat()
        }
    )

@app.post("/api/v1/report/generate", response_model=GenerateReportResponse)
def generate_report(req: GenerateReportRequest):
    """
    Gera o laudo odontológico assistido exclusivamente após a revisão do dentista.
    """
    report_text = build_clinical_report(
        exam_id=req.exam_id,
        patient_name=req.patient_name or "Paciente",
        confirmed_findings=req.confirmed_findings,
        quality_info=req.image_quality,
        radiograph_type=req.radiograph_type or "panoramic",
        dentist_name=req.dentist_name or "Cirurgião-Dentista"
    )
    
    accepted_count = sum(1 for f in req.confirmed_findings if f.status in ("accepted", "edited", "manual_entry"))
    
    return GenerateReportResponse(
        exam_id=req.exam_id,
        report_markdown=report_text,
        summary={
            "total_findings_evaluated": len(req.confirmed_findings),
            "confirmed_count": accepted_count,
            "rejected_count": len(req.confirmed_findings) - accepted_count
        },
        generated_at=datetime.now().isoformat()
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
