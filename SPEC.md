# SPEC.md — Especificação Técnica Detalhada: Panorâmica Dental AI MVP

## 1. Arquitetura Geral do Sistema

O sistema é concebido em arquitetura desacoplada: **Frontend SPA/PWA**, **Backend BaaS (Supabase)** e **AI Inference Engine (FastAPI + Model Adapter)**.

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (PWA / Web)                     │
│               React + Vite + Tailwind + shadcn/ui          │
│               Canvas / SVG Viewport (Zoom/Pan/BBox)         │
└──────────────┬───────────────────────────────┬──────────────┘
               │ (Auth / Direct Upload / RLS)  │ (Trigger Analysis)
               ▼                               ▼
┌───────────────────────────────┐     ┌───────────────────────┐
│           Supabase            │     │   AI Inference API    │
│  - Auth (Dentist Identity)    │◄────┤     (Python/FastAPI)  │
│  - PostgreSQL + RLS           │     │                       │
│  - Storage (Private S3)       │     │  ┌─────────────────┐  │
│  - Edge Functions (Webhooks)  │     │  │  Model Adapter  │  │
└───────────────────────────────┘     │  │  Layer (ONNX/   │  │
                                      │  │  PyTorch/Mock)  │  │
                                      │  └────────┬────────┘  │
                                      │           ▼           │
                                      │   Normalized JSON     │
                                      └───────────────────────┘
```

---

## 2. Estrutura de Diretórios Recomendada

```text
panoramica/
├── PRD.md
├── SPEC.md
├── supabase/
│   ├── migrations/
│   │   └── 20260925000000_init_panoramica_schema.sql
│   └── seed.sql
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── core/
│   │   │   ├── config.py
│   │   │   └── security.py
│   │   ├── models/
│   │   │   ├── schemas.py           # Pydantic models (JSON Schema)
│   │   ├── adapters/
│   │   │   ├── base.py              # Base ModelAdapter
│   │   │   ├── mock_adapter.py      # Mock / Deterministic test adapter
│   │   │   ├── dentex_adapter.py    # DENTEX ONNX / YOLO model adapter
│   │   │   └── quality_checker.py   # Image resolution & contrast validator
│   │   ├── services/
│   │   │   ├── inference_service.py
│   │   │   └── llm_report_service.py # OpenRouter / Ollama post-review report
│   │   └── api/
│   │       ├── v1/
│   │       │   ├── analyze.py
│   │       │   ├── reports.py
│   │       │   └── health.py
│   ├── Dockerfile
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── src/
    │   ├── App.tsx
    │   ├── main.tsx
    │   ├── components/
    │   │   ├── common/              # Button, Modal, Card, Badge, Tooltip
    │   │   ├── viewer/              # Canvas/SVG Viewer: Zoom, Pan, Bounding Box
    │   │   ├── odontogram/          # Mapa FDI interativo dos 32 dentes
    │   │   ├── findings/            # Painel lateral de achados (Aceitar/Rejeitar/Editar)
    │   │   ├── upload/              # Drag-and-drop com pré-validação
    │   │   └── report/              # Visualizador e exportador do laudo
    │   ├── hooks/
    │   │   ├── useSupabaseAuth.ts
    │   │   ├── useExamAnalysis.ts
    │   │   └── useViewerControls.ts
    │   ├── services/
    │   │   ├── supabaseClient.ts
    │   │   └── aiApi.ts
    │   ├── types/
    │   │   └── dental.ts            # Tipagens TypeScript do JSON Clínico
    │   └── utils/
    │       ├── fdiHelper.ts
    │       └── colorCodes.ts
```

---

## 3. Banco de Dados — Supabase Schema & RLS

### Migração SQL Inicial

```sql
-- Habilitar UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Types
CREATE TYPE exam_status AS ENUM ('uploaded', 'processing', 'completed', 'reviewing', 'reviewed', 'error');
CREATE TYPE finding_source AS ENUM ('ai', 'professional');
CREATE TYPE finding_status AS ENUM ('pending', 'accepted', 'rejected', 'edited');
CREATE TYPE tooth_presence AS ENUM ('present', 'missing', 'impacted');

-- 1. Pacientes
CREATE TABLE IF NOT EXISTS public.patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    birth_date DATE,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2. Exames Radiográficos
CREATE TABLE IF NOT EXISTS public.exams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
    modality TEXT DEFAULT 'panoramic' NOT NULL,
    image_storage_path TEXT NOT NULL, -- Ex: exams/{exam_id}/original.png
    thumbnail_path TEXT,
    status exam_status DEFAULT 'uploaded' NOT NULL,
    quality_score NUMERIC(3, 2),
    quality_usable BOOLEAN DEFAULT true,
    quality_metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 3. Análises de IA
CREATE TABLE IF NOT EXISTS public.ai_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
    model_name TEXT NOT NULL,
    model_version TEXT NOT NULL,
    processing_time_ms INTEGER,
    overall_confidence NUMERIC(3, 2),
    raw_result JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4. Dentes Detectados (FDI 11 a 48)
CREATE TABLE IF NOT EXISTS public.teeth (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
    tooth_number INTEGER NOT NULL, -- Código FDI de 11 a 48
    presence tooth_presence DEFAULT 'present' NOT NULL,
    bbox JSONB NOT NULL, -- [x, y, width, height] normalizado (0.0 a 1.0)
    confidence NUMERIC(3, 2) NOT NULL,
    is_confirmed BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 5. Achados Radiográficos (Findings)
CREATE TABLE IF NOT EXISTS public.findings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
    tooth_id UUID REFERENCES public.teeth(id) ON DELETE SET NULL,
    tooth_number INTEGER, -- Número FDI desnormalizado para consultas rápidas
    finding_type TEXT NOT NULL, 
    -- Ex: 'periapical_lesion', 'caries_suspicion', 'bone_loss', 'endodontic_treatment', 'implant', 'crown', 'restoration', 'orthodontic_appliance'
    label_pt TEXT NOT NULL, -- Ex: 'Possível lesão periapical'
    confidence NUMERIC(3, 2) NOT NULL,
    bbox JSONB, -- [x, y, width, height] normalizado
    mask JSONB, -- Opcional: polígono de segmentação
    source finding_source DEFAULT 'ai' NOT NULL,
    status finding_status DEFAULT 'pending' NOT NULL,
    dentist_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 6. Laudos / Relatórios Clínicos Gerados
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    final_clinical_json JSONB NOT NULL,
    generated_text TEXT NOT NULL,
    llm_model TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- RLS (Row Level Security)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teeth ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.findings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Dentist owns patients" ON public.patients
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Dentist owns exams" ON public.exams
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Dentist accesses ai_analyses via exam" ON public.ai_analyses
    FOR ALL USING (EXISTS (SELECT 1 FROM public.exams WHERE exams.id = ai_analyses.exam_id AND exams.user_id = auth.uid()));

CREATE POLICY "Dentist accesses teeth via exam" ON public.teeth
    FOR ALL USING (EXISTS (SELECT 1 FROM public.exams WHERE exams.id = teeth.exam_id AND exams.user_id = auth.uid()));

CREATE POLICY "Dentist accesses findings via exam" ON public.findings
    FOR ALL USING (EXISTS (SELECT 1 FROM public.exams WHERE exams.id = findings.exam_id AND exams.user_id = auth.uid()));

CREATE POLICY "Dentist owns reports" ON public.reports
    FOR ALL USING (auth.uid() = user_id);
```

---

## 4. Contrato de Dados Central: JSON Clínico Normalizado

O formato canônico que transita entre IA $\rightarrow$ UI de Revisão $\rightarrow$ Supabase $\rightarrow$ LLM de Laudo:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "exam_id": "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
  "modality": {
    "detected": "panoramic",
    "confidence": 0.98,
    "is_panoramic": true
  },
  "image_quality": {
    "score": 0.92,
    "usable": true,
    "contrast_ok": true,
    "exposure_status": "optimal",
    "warnings": []
  },
  "teeth": [
    {
      "fdi_number": 36,
      "presence": "present",
      "confidence": 0.97,
      "bbox_normalized": [0.652, 0.584, 0.058, 0.092]
    }
  ],
  "findings": [
    {
      "id": "fnd-36-periapical",
      "fdi_number": 36,
      "category": "pathology",
      "type": "periapical_lesion",
      "label": "Possível lesão periapical",
      "confidence": 0.87,
      "confidence_tier": "moderate",
      "bbox_normalized": [0.655, 0.640, 0.045, 0.040],
      "status": "pending",
      "source": "ai",
      "notes": null
    },
    {
      "id": "fnd-18-impacted",
      "fdi_number": 18,
      "category": "structural",
      "type": "impacted_tooth",
      "label": "Dente incluso / impactado",
      "confidence": 0.95,
      "confidence_tier": "high",
      "bbox_normalized": [0.110, 0.320, 0.060, 0.085],
      "status": "pending",
      "source": "ai",
      "notes": null
    }
  ],
  "meta": {
    "model_adapter": "dentex_yolov8_onnx",
    "inference_duration_ms": 280,
    "timestamp": "2026-09-25T22:00:00Z"
  }
}
```

---

## 5. Model Evaluation Layer (Adapter Pattern em Python)

Para que o backend possa trocar de modelo (DENTEX, OralXrays, YOLOv8/11/ONNX ou Mock sem mudar uma linha do frontend):

```python
from abc import ABC, abstractmethod
from typing import Dict, Any
from pydantic import BaseModel

class QualityResult(BaseModel):
    score: float
    usable: bool
    is_panoramic: bool
    warnings: list[str]

class NormalizedAnalysis(BaseModel):
    quality: QualityResult
    teeth: list[Dict[str, Any]]
    findings: list[Dict[str, Any]]
    model_metadata: Dict[str, Any]

class BaseModelAdapter(ABC):
    @abstractmethod
    def load_model(self):
        """Carrega pesos ou runtime ONNX"""
        pass

    @abstractmethod
    async def predict(self, image_bytes: bytes) -> NormalizedAnalysis:
        """Processa imagem e devolve formato JSON normalizado"""
        pass
```

Implementações:
1. `MockModelAdapter`: Devolve dados realistas e determinísticos para desenvolvimento rápido, testes unitários e CI.
2. `DentexYoloAdapter`: Realiza inferência em pipeline com ONNX Runtime (FDI tooth detection + findings classification).

---

## 6. Endpoints FastAPI

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/api/v1/analyze` | Recebe `exam_id` e `image_url` ou upload direto. Executa quality check + detecção de dentes e achados. Devolve o `NormalizedAnalysis`. |
| `GET` | `/api/v1/health` | Status de saúde da API e modelos carregados em memória. |
| `POST` | `/api/v1/report/generate` | Recebe a lista de achados **confirmados/revisados** pelo dentista e sintetiza o laudo estruturado via LLM assistivo. |

---

## 7. Frontend UI / UX Stack

* **Vite + React + TypeScript + Tailwind CSS**
* **Iconografia:** `lucide-react`
* **Visualizador Radiográfico:** Canvas interativo com suporte a:
  * Zoom por roda do mouse, botões e pinça (touch)
  * Pan arrastando com botão esquerdo/espaço
  * Bounding boxes estilizadas com cores temáticas por categoria:
    * Vermelho/Âmbar: Patologias (cárie, lesão periapical, perda óssea)
    * Azul/Ciano: Tratamentos existentes (canal, coroa, restauração, implante)
    * Roxo/Índigo: Estruturais (incluso, supranumerário)
  * Toggles de visibilidade (Dentes, FDI, Achados, BBoxes)
  * Clique no dente/achado com foco sincronizado entre o painel lateral e a radiografia.
* **Odontograma FDI Interativo:**
  * Diagrama dos 4 quadrantes (11-18, 21-28, 31-38, 41-48) com marcação visual imediata dos dentes com achados.
* **Mesa de Revisão:**
  * Card para cada achado com botão de confirmação em 1 clique:
    * `[ ✓ Aceitar ]`
    * `[ ✕ Rejeitar ]`
    * `[ ✎ Editar ]`
* **Gerador de Laudo:**
  * Ativação habilitada somente após o dentista concluir a triagem dos achados pendentes.
