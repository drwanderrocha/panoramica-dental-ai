# Panorâmica & Periapical — Dental AI (PWA) 🦷✨

Plataforma Web / PWA assistiva de ponta a ponta para **leitura, mapeamento anatômico e organização de achados em radiografias odontológicas**, integrando visão computacional real, catalogação avançada e geração de laudos clínicos assistidos.

---

## 🌟 Principais Recursos

### 1. Suporte Multimodal Odontológico
- **Radiografias Panorâmicas (Ortopantomografia)**:
  - Detecção e numeração dos 32 dentes no **Sistema FDI (11 a 48)** via ONNX.
  - Catálogo completo do benchmark **OralXrays-9 (CVPR 2025)**: *Apical Periodontitis, Decay, Wisdom Tooth, Missing Tooth, Dental Filling, Root Canal Filling, Implant, Porcelain Crown, Ceramic Bridge*.
- **Radiografias Periapicais Intraorais**:
  - Pipeline baseado no benchmark **PRAD (MICCAI 2025 / IEEE TMI 2026)**.
  - Segmentação em 9 camadas anatômicas e patológicas: contornos coronários/radiculares, polpa e condutos, crista óssea alveolar, obturação (RCF), lesão periapical (AP), restaurações e cáries.
  - Métricas quantitativas clínicas: **selamento apical (distância em mm ao ápice radiográfico)**, **percentual de perda óssea periodontal** e **diâmetro transversal da lesão**.

### 2. Interface Interativa do Profissional
- **Visualizador Radiológico em Canvas**: Zoom fluido, Pan livre, ajuste de brilho/contraste, modo negativo (inversão) e alternadores de camadas (Dentes, FDI, Achados, Bounding Boxes, Camadas PRAD).
- **Odontograma FDI Integrado**: Mapeamento dos 32 dentes com destaque sincronizado e modo de campo localizado para exames periapicais.
- **Mesa de Revisão Clínica**: Interface para Aceitar (✓), Rejeitar (✕) ou Editar achados sugeridos pela IA, além de inclusão manual de observações.
- **Laudo Estruturado**: Geração de laudo odontológico descritivo formal em Markdown e JSON canônico após validação humana.

### 3. Progressive Web App (PWA)
- Instalável nativamente no Windows, macOS, Android e iOS / iPadOS.
- Service Worker com cache para operação ágil e offline shell.
- Manifest com suporte a ícones temáticos de alta resolução e modo standalone.

---

## 🛠️ Arquitetura e Tecnologias

- **Backend**:
  - [FastAPI](https://fastapi.tiangolo.com/) (Python 3.12)
  - [ONNX Runtime](https://onnxruntime.ai/) para inferência em modelos neurais leves
  - [OpenCV](https://opencv.org/) & [SciPy](https://scipy.org/) para pré-processamento radiográfico avançado (CLAHE, filtros bilaterais e projeções)
  - [Pydantic v2](https://docs.pydantic.dev/) para validação estrita de esquemas
- **Frontend**:
  - [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
  - [Vite 8](https://vite.dev/)
  - [Tailwind CSS v4](https://tailwindcss.com/)
  - [Lucide Icons](https://lucide.dev/)

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- Python 3.10+
- Node.js 18+ e npm

### 1. Clonar o repositório
```bash
git clone https://github.com/drwanderrocha/panoramica-dental-ai.git
cd panoramica-dental-ai
```

### 2. Configurar e Iniciar o Backend
```bash
# Instalar dependências Python
pip install -r backend/requirements.txt

# Iniciar servidor FastAPI na porta 8000
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
A API estará acessível em `http://127.0.0.1:8000` (documentação interativa Swagger em `/docs`).

### 3. Configurar e Iniciar o Frontend
```bash
cd frontend
npm install
npm run dev
```
A aplicação abrirá em `http://localhost:5173/`.

---

## 📱 Instalação como Aplicativo (PWA)

1. **Desktop (Chrome / Edge)**: Clique no botão **"Instalar PWA"** na barra superior ou no ícone de instalação na barra de endereços do navegador.
2. **iPad / iPhone (Safari)**: Toque no botão de compartilhamento e selecione **"Adicionar à Tela de Início"**.
3. **Android (Chrome)**: Toque no banner ou no menu e selecione **"Instalar aplicativo"**.

---

## ⚖️ Diretriz Ética & Regulatória

> **Aviso Importante:** Esta aplicação é estritamente uma ferramenta assistiva para triagem e organização de achados radiográficos. A IA **não emite diagnóstico definitivo** nem substitui a avaliação clínica soberana do cirurgião-dentista responsável.
