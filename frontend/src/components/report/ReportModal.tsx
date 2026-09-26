import React, { useState } from 'react';
import type { AnalysisResponse, FindingItem } from '../../types/dental';
import { X, Copy, Check, Download, Code, ShieldCheck } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportMarkdown: string;
  analysis: AnalysisResponse;
  confirmedFindings: FindingItem[];
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportMarkdown,
  analysis,
  confirmedFindings,
}) => {
  const [activeTab, setActiveTab] = useState<'report' | 'json'>('report');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // JSON Clínico Canônico consolidado pós-revisão humana
  const clinicalJson = {
    exam: {
      id: analysis.exam_id,
      modality: analysis.modality.detected,
      reviewed_at: new Date().toISOString(),
    },
    image_quality: analysis.image_quality,
    teeth_identified: analysis.teeth.map(t => ({
      number: t.fdi_number,
      presence: t.presence,
      confidence: t.confidence,
    })),
    confirmed_findings: confirmedFindings
      .filter(f => f.status === 'accepted' || f.status === 'edited' || f.status === 'manual_entry')
      .map(f => ({
        id: f.id,
        tooth: f.fdi_number,
        category: f.category,
        type: f.type,
        label: f.label,
        ai_confidence: f.confidence,
        status: f.status,
        dentist_notes: f.notes,
      })),
  };

  const handleCopy = () => {
    const textToCopy = activeTab === 'report' ? reportMarkdown : JSON.stringify(clinicalJson, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = activeTab === 'report' ? reportMarkdown : JSON.stringify(clinicalJson, null, 2);
    const filename = activeTab === 'report' ? `laudo_${analysis.exam_id}.md` : `clinico_${analysis.exam_id}.json`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="notion-glass-elevated border border-white/[0.12] rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header Estilo Notion Page */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-base shadow-sm">
              📄
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight text-slate-100">
                  Laudo Radiográfico Odontológico
                </h2>
                <span className="font-mono text-[10px] px-1.5 py-0.5 rounded notion-tag-purple font-medium">
                  {analysis.exam_id.slice(0, 8)}...
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Documento Clínico Canônico • {analysis.modality.detected}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs Estilo Notion */}
            <div className="flex bg-white/[0.05] border border-white/[0.08] p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('report')}
                className={`px-3 py-1 rounded-md font-medium transition cursor-pointer ${
                  activeTab === 'report'
                    ? 'bg-white/[0.14] text-slate-100 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Documento
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1 rounded-md font-medium transition flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'json'
                    ? 'bg-white/[0.14] text-slate-100 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                JSON Canônico
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-slate-300 transition cursor-pointer"
              title="Copiar Conteúdo"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>

            {/* Botão de Download Notion Primary */}
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-notion-primary text-xs font-medium text-white transition cursor-pointer"
              title="Baixar Laudo"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 transition cursor-pointer ml-1"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabela de Propriedades da Página Notion */}
        <div className="px-6 py-2.5 bg-black/20 border-b border-white/[0.06] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-mono">Modalidade</span>
            <span className="font-medium text-slate-200">{analysis.modality.detected}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-mono">Qualidade</span>
            <span className="font-semibold text-emerald-400 font-mono">{(analysis.image_quality.score * 100).toFixed(0)}%</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-mono">Achados Confirmados</span>
            <span className="font-medium text-slate-200">{confirmedFindings.filter(f => f.status === 'accepted' || f.status === 'edited' || f.status === 'manual_entry').length} itens</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase font-mono">Responsável</span>
            <span className="font-medium text-slate-200">Cirurgião-Dentista</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#070f24] font-sans text-sm text-slate-200 leading-relaxed">
          {activeTab === 'report' ? (
            <div className="max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-slate-200 bg-white/[0.02] p-6 rounded-xl border border-white/[0.08] text-xs leading-relaxed shadow-sm">
                {reportMarkdown}
              </pre>
            </div>
          ) : (
            <div className="relative">
              <pre className="font-mono text-xs text-[#d6b6f6] bg-black/50 p-6 rounded-xl border border-white/[0.08] overflow-x-auto shadow-inner leading-relaxed">
                {JSON.stringify(clinicalJson, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-black/30 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-slate-400">Notion Canonical JSON validado para prontuário eletrônico.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 font-medium text-xs transition border border-white/[0.08] cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};


