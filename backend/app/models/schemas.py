from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any, Literal

class ModalityInfo(BaseModel):
    detected: str = "panoramic" # "panoramic" | "periapical"
    confidence: float
    is_panoramic: bool
    is_periapical: bool = False

class ImageQualityInfo(BaseModel):
    score: float
    usable: bool
    is_panoramic: bool
    panoramic_confidence: float
    is_periapical: bool = False
    periapical_confidence: float = 0.0
    sharpness: float
    mean_brightness: float
    contrast_std: float
    aspect_ratio: float
    dimensions: Dict[str, int]
    warnings: List[str] = []

class ToothDetection(BaseModel):
    fdi_number: int
    presence: Literal["present", "missing", "impacted"] = "present"
    confidence: float
    bbox_normalized: List[float] # [x, y, width, height]

class SegmentationLayerItem(BaseModel):
    id: str
    layer: Literal["tooth", "pulp", "alveolar_bone", "root_canal_filling", "apical_periodontitis", "dental_filling", "denture_crown", "decay"]
    label: str
    color: str
    polygon_normalized: List[List[float]] # [[x1, y1], [x2, y2], ...]
    bbox_normalized: List[float] # [x, y, w, h]
    confidence: float
    metrics: Optional[Dict[str, Any]] = None

class FindingItem(BaseModel):
    id: str
    fdi_number: Optional[int] = None
    category: Literal["structural", "pathology", "treatment", "device"]
    type: str
    label: str
    confidence: float
    confidence_tier: Literal["high", "moderate", "low"]
    bbox_normalized: List[float]
    status: Literal["pending", "accepted", "rejected", "edited", "manual_entry"] = "pending"
    source: Literal["ai", "professional"] = "ai"
    notes: Optional[str] = None

class AnalysisResponse(BaseModel):
    exam_id: str
    modality: ModalityInfo
    image_quality: ImageQualityInfo
    teeth: List[ToothDetection]
    findings: List[FindingItem]
    segmentations: Optional[List[SegmentationLayerItem]] = None
    image_url: str
    meta: Dict[str, Any]

class UpdateFindingStatusRequest(BaseModel):
    status: Literal["accepted", "rejected", "edited"]
    fdi_number: Optional[int] = None
    notes: Optional[str] = None

class GenerateReportRequest(BaseModel):
    exam_id: str
    patient_name: Optional[str] = "Paciente"
    confirmed_findings: List[FindingItem]
    image_quality: Optional[ImageQualityInfo] = None
    radiograph_type: Optional[str] = "panoramic"
    dentist_name: Optional[str] = "Cirurgião-Dentista"

class GenerateReportResponse(BaseModel):
    exam_id: str
    report_markdown: str
    summary: Dict[str, Any]
    generated_at: str
