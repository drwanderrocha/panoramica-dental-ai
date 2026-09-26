# PRD — Dental X-Ray AI MVP (Panorâmica)

## 1. Visão do Produto
Aplicação web/PWA para auxiliar cirurgiões-dentistas na **leitura e organização de achados em radiografias odontológicas**, utilizando visão computacional e IA.

O sistema recebe uma radiografia, identifica dentes e possíveis achados, apresenta as detecções visualmente em tela e permite que o profissional **aceite, rejeite ou edite cada achado**.

> **Diretriz Ética & Regulatória Central:** A IA não emite diagnóstico definitivo nem substitui a avaliação profissional. Atua exclusivamente como ferramenta assistiva de triagem e mapeamento radiográfico.

### MVP Inicial
* **Modalidade foco:** Radiografia panorâmica odontológica (ortopantomografia).
* **Fases futuras:** Periapicais, Bite-wing, Telerradiografia/Cefalometria, CBCT (Tomografia Cone Beam).

---

## 2. Objetivo do MVP
Validar o fluxo ponta a ponta sem atritos:
```text
Radiografia (Upload)
     ↓
Pré-processamento & Quality Check
     ↓
Detecção dos dentes
     ↓
Numeração FDI (11-48)
     ↓
Detecção de achados radiográficos
     ↓
Confidence Score & Bounding Boxes / Overlays
     ↓
Revisão Humana (Aceitar / Rejeitar / Editar)
     ↓
JSON Clínico Estruturado
     ↓
Geração de Relatório Clínico Assistido via LLM
```

**Meta:** Reduzir drasticamente o tempo que o dentista despende para identificar, registrar e documentar os achados radiográficos do exame.

---

## 3. Usuários
* **Principal:** Cirurgião-dentista clínico geral e avaliador.
* **Especialidades futuras:** Radiologistas odontológicos, Endodontistas, Implantodontistas, Periodontistas, Ortodontistas e Clínicas Integradas.

---

## 4. Escopo de Entrada & Validação
* **Formatos:** JPG, JPEG, PNG, WebP (Futuro: DICOM `.dcm`).
* **Canais de captura:** Drag & drop web, seletor de arquivos, câmera/upload mobile (PWA).
* **Classificação de Modalidade:** Verificação se a imagem é de fato uma panorâmica compatível com score de confiança (ex: "Panorâmica - 97%"). Se incompatível, alerta preventivo ao usuário.

---

## 5. Pipeline de IA & Visão Computacional

### Etapa 1 — Quality Check
Avaliação pré-inferência:
* Resolução e nitidez
* Contraste e exposição (subexposta/superexposta)
* Enquadramento e cortes severos
* Artefatos radiográficos
* Score geral de qualidade e avisos (`quality.score`, `usable`, `warnings`).

### Etapa 2 & 3 — Detecção e Numeração Dentária (Sistema FDI)
Mapeamento dos 32 dentes da dentição permanente (quadrantes 1, 2, 3 e 4):
* Quadrante 1 (Superior Direito): 18 a 11
* Quadrante 2 (Superior Esquerdo): 21 a 28
* Quadrante 3 (Inferior Esquerdo): 31 a 38
* Quadrante 4 (Inferior Direito): 41 a 48
* Associação de cada dente a uma `bbox` [x, y, w, h] e score de confiança.

### Etapa 4 — Detecção de Achados Radiográficos (MVP Limitado)
* **Grupo A — Estruturais:** Dente presente, dente ausente, dente incluso/impactado.
* **Grupo B — Patologias/Alterações:** Lesão periapical (radiolucidez periapical), suspeita de cárie, reabsorção/perda óssea periodontal.
* **Grupo C — Tratamentos e Dispositivos:** Tratamento endodôntico (canal tratado), implante osseointegrável, restauração, coroa protética, dispositivo/aparelho ortodôntico.

### Nomenclatura Assistiva & Confidence Score
* **Terminologia obrigatória:** *"Achados sugeridos pela IA"* (nunca *"Diagnóstico"*).
* Exemplo: *"Possível lesão periapical — Dente 36 (Confiança: 87%)"*.
* Faixas visuais de confiança:
  * Alta: $\ge 90\%$
  * Moderada: $70\% - 89\%$
  * Baixa: $< 70\%$

---

## 6. Interface & Experiência do Dentista
* **Visualizador Interativo:**
  * Zoom fluido (+ / - / wheel / double-click / fit-to-screen)
  * Pan / Arraste livre
  * Controles de camada (Toggles): Dentes, Numeração FDI, Achados, Bounding Boxes / Máscaras, Nível de Confiança
  * Filtros de contraste/brilho básicos para leitura radiológica
* **Mesa de Revisão:**
  * Listagem agrupada por dente ou por tipo de achado
  * Ações instantâneas: **Aceitar (✓)**, **Rejeitar (✕)**, **Editar** (alterar dente, descrição ou ajustar caixa)
  * Inclusão manual de achados não detectados pela IA
* **Estados do Achado:**
  * `AI_DETECTED` $\rightarrow$ `PENDING_REVIEW` $\rightarrow$ `ACCEPTED` | `REJECTED` | `EDITED` | `MANUAL_ENTRY`

---

## 7. JSON Clínico Estruturado & Laudo IA
* O **JSON Clínico** consolidado pós-revisão serve como fonte única da verdade do exame.
* O laudo assistido via LLM (OpenRouter / OllamaCloud) só é disparado **após** a validação do profissional, consumindo o JSON estruturado dos achados confirmados.

---

## 8. Segurança & LGPD
* **Tratamento de dados sensíveis de saúde:**
  * Autenticação via Supabase Auth
  * Row Level Security (RLS) estrito por usuário/clínica
  * Bucket de Storage 100% privado com URLs assinadas temporárias
  * Imagem original imutável (nunca sobrescrever `/exams/{id}/original`)
  * Trilha de auditoria completa (quem enviou, quem aceitou/rejeitou, timestamps)
  * Consentimento e anonimização rigorosa para qualquer uso futuro em treino de modelos.
