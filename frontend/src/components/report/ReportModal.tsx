import React, { useState } from 'react';
import type { AnalysisResponse, FindingItem } from '../../types/dental';
import { X, Copy, Check, Download, Code, FileText, ShieldCheck } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="clinical-glass-elevated border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden shadow-black/80">
        {/* Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-wide text-slate-100">
                  Laudo Radiográfico & JSON Canônico
                </h2>
                <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                  {analysis.exam_id}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Auditoria clínica validada • {analysis.modality.detected}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Tabs */}
            <div className="flex bg-white/[0.04] border border-white/[0.06] p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('report')}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  activeTab === 'report'
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Laudo Formatado
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1 rounded-md font-medium transition flex items-center gap-1.5 ${
                  activeTab === 'json'
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                JSON Clínico
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-medium text-slate-300 transition"
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

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-xs font-medium text-cyan-300 transition"
              title="Baixar Arquivo"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 transition"
              title="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-black/30 font-sans text-sm text-slate-200 leading-relaxed">
          {activeTab === 'report' ? (
            <div className="max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-slate-300 bg-[#06080d] p-6 rounded-xl border border-white/[0.06] text-xs leading-relaxed shadow-inner">
                {reportMarkdown}
              </pre>
            </div>
          ) : (
            <div className="relative">
              <pre className="font-mono text-xs text-cyan-300 bg-[#06080d] p-6 rounded-xl border border-white/[0.06] overflow-x-auto shadow-inner leading-relaxed">
                {JSON.stringify(clinicalJson, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.08] bg-black/40 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[11px] text-slate-400">Fonte da Verdade: JSON Clínico Normalizado pós-revisão humana.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.12] text-slate-200 font-medium text-xs transition border border-white/[0.06]"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

