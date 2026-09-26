import cv2
import numpy as np
from typing import Dict, Any, List

def analyze_image_quality(image_bytes: bytes) -> Dict[str, Any]:
    """
    Realiza checagem real de qualidade e adequação de radiografia (Panorâmica ou Periapical)
    utilizando OpenCV e NumPy.
    """
    # Decodificar imagem em memória
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    
    if img is None:
        return {
            "score": 0.0,
            "usable": False,
            "is_panoramic": False,
            "panoramic_confidence": 0.0,
            "is_periapical": False,
            "periapical_confidence": 0.0,
            "sharpness": 0.0,
            "mean_brightness": 0.0,
            "contrast_std": 0.0,
            "aspect_ratio": 0.0,
            "dimensions": {"width": 0, "height": 0},
            "warnings": ["Arquivo não pôde ser decodificado como imagem válida."]
        }
    
    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 1. Proporção e Modalidade
    aspect_ratio = float(w) / float(h)
    warnings: List[str] = []
    
    is_panoramic = 1.45 <= aspect_ratio <= 2.85
    panoramic_confidence = 0.96 if (1.7 <= aspect_ratio <= 2.35) else (0.80 if is_panoramic else 0.15)
    
    is_periapical = 0.65 <= aspect_ratio <= 1.40
    periapical_confidence = 0.95 if (0.75 <= aspect_ratio <= 1.25) else (0.78 if is_periapical else 0.10)
    
    if not is_panoramic and not is_periapical:
        warnings.append(
            f"Proporção da imagem ({aspect_ratio:.2f}) difere dos padrões convencionais (Panorâmica ~2:1 ou Periapical ~1:1)."
        )
    
    # 2. Resolução
    if is_panoramic and (w < 1000 or h < 500):
        warnings.append(f"Resolução baixa para panorâmica ({w}x{h}).")
    elif is_periapical and (w < 250 or h < 250):
        warnings.append(f"Resolução reduzida para radiografia periapical ({w}x{h}).")
    
    # 3. Nitidez (Laplacian variance)
    laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    if laplacian_var < 45.0:
        warnings.append("Possível desfoque ou perda de nitidez detectada no exame.")
    
    # 4. Brilho e Contraste
    mean_brightness = float(np.mean(gray))
    contrast_std = float(np.std(gray))
    
    if mean_brightness < 35:
        warnings.append("Radiografia subexposta (excessivamente escura).")
    elif mean_brightness > 220:
        warnings.append("Radiografia superexposta (excessivamente clara).")
        
    if contrast_std < 22:
        warnings.append("Baixo contraste dinâmico entre estruturas dentárias e osso.")

    # 5. Cálculo do Score Geral de Qualidade (0.0 a 1.0)
    score_components = []
    # Resolução
    target_pixels = (1920.0 * 1080.0) if is_panoramic else (600.0 * 800.0)
    score_components.append(min(1.0, max(0.4, (w * h) / target_pixels)))
    # Nitidez
    score_components.append(min(1.0, max(0.3, laplacian_var / 250.0)))
    # Contraste
    score_components.append(min(1.0, max(0.4, contrast_std / 55.0)))
    # Modalidade reconhecida
    score_components.append(1.0 if (is_panoramic or is_periapical) else 0.5)
    
    overall_score = float(np.clip(np.mean(score_components), 0.1, 0.99))
    usable = overall_score >= 0.45 and (mean_brightness > 15 and mean_brightness < 240)

    return {
        "score": round(overall_score, 2),
        "usable": usable,
        "is_panoramic": is_panoramic,
        "panoramic_confidence": round(panoramic_confidence, 2),
        "is_periapical": is_periapical,
        "periapical_confidence": round(periapical_confidence, 2),
        "sharpness": round(laplacian_var, 1),
        "mean_brightness": round(mean_brightness, 1),
        "contrast_std": round(contrast_std, 1),
        "aspect_ratio": round(aspect_ratio, 2),
        "dimensions": {"width": w, "height": h},
        "warnings": warnings
    }
