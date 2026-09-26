import React, { useState } from 'react';
import type { AnalysisResponse, FindingItem } from '../../types/dental';
import { X, Copy, Check, Download, Code, FileText } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/95">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100">
              Laudo Radiográfico & JSON Clínico Canônico
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex bg-slate-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => setActiveTab('report')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  activeTab === 'report'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Laudo Formatado
              </button>
              <button
                onClick={() => setActiveTab('json')}
                className={`px-3 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                  activeTab === 'json'
                    ? 'bg-cyan-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                JSON Clínico
              </button>
            </div>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Copiar Conteúdo"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleDownload}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Baixar Arquivo"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-950/80 font-sans text-sm text-slate-200 leading-relaxed">
          {activeTab === 'report' ? (
            <div className="prose prose-invert max-w-none space-y-4">
              <pre className="whitespace-pre-wrap font-sans text-slate-300 bg-slate-900/60 p-5 rounded-xl border border-slate-800 leading-relaxed">
                {reportMarkdown}
              </pre>
            </div>
          ) : (
            <pre className="font-mono text-xs text-cyan-300 bg-slate-900/90 p-5 rounded-xl border border-slate-800 overflow-x-auto">
              {JSON.stringify(clinicalJson, null, 2)}
            </pre>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between text-xs text-slate-400">
          <span>Fonte da Verdade: JSON Clínico Normalizado pós-revisão humana.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
