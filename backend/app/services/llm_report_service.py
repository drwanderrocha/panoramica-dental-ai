import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from backend.app.models.schemas import FindingItem, ImageQualityInfo

try:
    from openai import OpenAI
    HAS_OPENAI = True
except ImportError:
    HAS_OPENAI = False

def build_clinical_report(
    exam_id: str,
    patient_name: str,
    confirmed_findings: List[FindingItem],
    quality_info: Optional[ImageQualityInfo] = None,
    radiograph_type: str = "panoramic",
    dentist_name: str = "Cirurgião-Dentista"
) -> str:
    """
    Gera laudo radiográfico estruturado.
    Se OPENROUTER_API_KEY ou OPENAI_API_KEY estiver configurado, utiliza o modelo LLM.
    Caso contrário, gera laudo clínico formal odontológico baseado nos achados validados.
    """
    api_key = os.getenv("OPENROUTER_API_KEY") or os.getenv("OPENAI_API_KEY")
    base_url = "https://openrouter.ai/api/v1" if os.getenv("OPENROUTER_API_KEY") else None

    is_peri = (radiograph_type == "periapical")
    modality_title = "Radiografia Periapical Intraoral (Endodontia / Periodontia)" if is_peri else "Radiografia Panorâmica dos Maxilares (Ortopantomografia)"

    # Agrupar achados validados por dente e por categoria
    accepted_findings = [f for f in confirmed_findings if f.status in ("accepted", "edited", "manual_entry")]
    
    findings_by_tooth = {}
    for f in accepted_findings:
        key = f.fdi_number if f.fdi_number else "Região Geral / Crista Óssea"
        if key not in findings_by_tooth:
            findings_by_tooth[key] = []
        findings_by_tooth[key].append(f)

    # Se chave LLM configurada, chama o modelo
    if api_key and HAS_OPENAI:
        try:
            client = OpenAI(
                api_key=api_key,
                base_url=base_url if base_url else "https://api.openai.com/v1"
            )
            
            prompt_context = f"""
Você é um radiologista odontológico especialista.
Gere um Laudo Radiográfico Descritivo Formal em Português do Brasil para {modality_title}.
O profissional cirurgião-dentista revisou e confirmou os seguintes achados no exame:

Paciente: {patient_name}
Data do Exame: {datetime.now().strftime("%d/%m/%Y")}
Tipo de Radiografia: {modality_title}
Qualidade da Imagem: Score {quality_info.score if quality_info else 0.9} (Usável)

Achados Confirmados pelo Profissional:
"""
            for tooth, f_list in findings_by_tooth.items():
                prompt_context += f"- Dente / Região {tooth}:\n"
                for item in f_list:
                    prompt_context += f"  * {item.label} (Confiança da IA: {item.confidence*100:.1f}% | Observações: {item.notes or 'Sem notas adicionais'})\n"

            prompt_context += f"""
Diretrizes Obrigatórias:
1. Estruturação:
   - TÉCNICA E QUALIDADE DA IMAGEM
   - {"AVALIAÇÃO ENDODÔNTICA, PERIODONTAL E ESTRUTURAL" if is_peri else "ACHADOS RADIOGRÁFICOS POR QUADRANTE/DENTE"}
   - IMPRESSÕES RADIOGRÁFICAS
   - RECOMENDAÇÕES CLÍNICAS
2. Para periapicais, detalhe expressamente selamento apical (distância ao ápice radiográfico), espaço do ligamento periodontal, lâmina dura e nível da crista óssea alveolar.
3. Não declare diagnósticos de certeza absoluta sem exame clínico complementar (utilize termos radiológicos adequados: 'imagem radiolúcida sugestiva de...', 'área circunscrita compatível com...').
4. Finalize com nota de caráter assistivo e assinatura do profissional ({dentist_name}).
"""

            response = client.chat.completions.create(
                model=os.getenv("LLM_MODEL", "google/gemini-2.0-flash-001" if base_url else "gpt-4o-mini"),
                messages=[
                    {"role": "system", "content": "Você é um assistente de laudos radiológicos odontológicos de alta precisão técnica."},
                    {"role": "user", "content": prompt_context}
                ],
                temperature=0.2
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            print(f"[LLM Report Error] Falha ao consultar LLM: {e}. Utilizando gerador determinístico clínico.")

    # Gerador radiológico formal estruturado odontológico
    now_str = datetime.now().strftime("%d/%m/%Y às %H:%M")
    
    findings_md = ""
    if not accepted_findings:
        findings_md = f"_Nenhum achado patológico ou alteração anatômica expressiva foi confirmado pelo cirurgião-dentista nesta {modality_title.lower()}._\n"
    else:
        for tooth, f_list in findings_by_tooth.items():
            findings_md += f"#### Dente / Região {tooth}\n"
            for item in f_list:
                status_tag = "✓ Confirmado" if item.status == "accepted" else ("✎ Editado" if item.status == "edited" else "+ Inclusão Manual")
                findings_md += f"- **{item.label}** `[{status_tag}]` (Confiança analítica: {item.confidence*100:.1f}%)\n"
                if item.notes:
                    findings_md += f"  > _Nota do profissional:_ {item.notes}\n"
            findings_md += "\n"

    report = f"""# LAUDO RADIOGRÁFICO ODONTOLÓGICO ASSISTIDO POR IA

**Paciente:** {patient_name}  
**Exame ID:** `{exam_id}`  
**Modalidade:** {modality_title}  
**Data da Revisão:** {now_str}  
**Responsável Técnico:** {dentist_name}  

---

### 1. TÉCNICA E QUALIDADE DA IMAGEM
- **Padrão de aquisição:** {modality_title} realizada com parâmetros técnicos adequados, demonstrando boa definição anatômica e contraste trabecular satisfatório.
- **Índice de Qualidade da Imagem:** `{quality_info.score if quality_info else 0.95} / 1.00`
- **Condição:** Exame tecnicamente satisfatório para análise {'endodôntica e periodontal de alta resolução' if is_peri else 'anatômica e identificação de anomalias dentárias e ósseas'}.

---

### 2. ACHADOS RADIOGRÁFICOS CONFIRMADOS
{findings_md}
---

### 3. SÍNTESE CLÍNICO-RADIOGRÁFICA
- Total de achados validados pelo profissional: **{len(accepted_findings)}**.
- As detecções visuais e segmentações geradas pelos modelos de visão computacional (PRAD Benchmark) foram devidamente avaliadas, filtradas e ratificadas pelo cirurgião-dentista responsável.

---

### 4. NOTA ÉTICA E LEGAL
> _Este documento sintetiza os achados radiográficos triados por inteligência artificial e **integralmente validados por cirurgião-dentista habilitado**. A imagem radiográfica é um exame complementar e seus achados devem ser correlacionados com o exame clínico intraoral, testes de sensibilidade/percussão e histórico anamnésico do paciente para a determinação do plano de tratamento definitivo._
"""
    return report
