export type FDIQuadrant = 1 | 2 | 3 | 4;

export type OralXrays9Type =
  | 'apical_periodontitis'
  | 'decay'
  | 'wisdom_tooth'
  | 'missing_tooth'
  | 'dental_filling'
  | 'root_canal_filling'
  | 'implant'
  | 'porcelain_crown'
  | 'ceramic_bridge'
  | 'manual_observation';

export interface SegmentationLayerItem {
  id: string;
  layer: 'tooth' | 'pulp' | 'alveolar_bone' | 'root_canal_filling' | 'apical_periodontitis' | 'dental_filling' | 'denture_crown' | 'decay';
  label: string;
  color: string;
  polygon_normalized: [number, number][]; // [[x1, y1], [x2, y2], ...]
  bbox_normalized: [number, number, number, number]; // [x, y, w, h]
  confidence: number;
  metrics?: Record<string, any>;
}

export interface ModalityInfo {
  detected: string; // "panoramic" | "periapical"
  confidence: number;
  is_panoramic: boolean;
  is_periapical?: boolean;
}

export interface ImageQualityInfo {
  score: number;
  usable: boolean;
  is_panoramic: boolean;
  panoramic_confidence: number;
  is_periapical?: boolean;
  periapical_confidence?: number;
  sharpness: number;
  mean_brightness: number;
  contrast_std: number;
  aspect_ratio: number;
  dimensions: {
    width: number;
    height: number;
  };
  warnings: string[];
}

export interface ToothDetection {
  fdi_number: number;
  presence: 'present' | 'missing' | 'impacted';
  confidence: number;
  bbox_normalized: [number, number, number, number]; // [x, y, width, height]
}

export interface FindingItem {
  id: string;
  fdi_number: number | null;
  category: 'structural' | 'pathology' | 'treatment' | 'device';
  type: string;
  label: string;
  confidence: number;
  confidence_tier: 'high' | 'moderate' | 'low';
  bbox_normalized: [number, number, number, number];
  status: 'pending' | 'accepted' | 'rejected' | 'edited' | 'manual_entry';
  source: 'ai' | 'professional';
  notes?: string | null;
}

export interface AnalysisResponse {
  exam_id: string;
  modality: ModalityInfo;
  image_quality: ImageQualityInfo;
  teeth: ToothDetection[];
  findings: FindingItem[];
  segmentations?: SegmentationLayerItem[] | null;
  image_url: string;
  meta: {
    model_pipeline: string;
    inference_duration_ms: number;
    processed_at: string;
  };
}

export interface SampleItem {
  id: string;
  filename: string;
  modality?: 'panoramic' | 'periapical';
  url: string;
  description: string;
  size_bytes: number;
}

