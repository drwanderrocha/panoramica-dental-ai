import React from 'react';
import type { ImageQualityInfo, ModalityInfo } from '../../types/dental';
import { ShieldCheck, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface QualityBadgeProps {
  quality: ImageQualityInfo;
  modality: ModalityInfo;
}

export const QualityBadge: React.FC<QualityBadgeProps> = ({ quality, modality }) => {
  const isOptimal = quality.score >= 0.85;
  const isAcceptable = quality.score >= 0.60;

  const modalityName = modality.is_periapical
    ? 'Radiografia Periapical (PRAD)'
    : modality.detected === 'panoramic'
    ? 'Radiografia Panorâmica (OralXrays-9)'
    : modality.detected;

  return (
    <div className="clinical-glass rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shadow-lg border border-slate-800/80">
      <div className="flex items-center gap-3">
        {/* Ícone de Conformidade Radiológica */}
        <div className={`p-1.5 rounded-lg border flex items-center justify-center ${
          isOptimal
            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/80 shadow-sm shadow-emerald-950/50'
            : isAcceptable
            ? 'bg-amber-950/80 text-amber-400 border-amber-700/80 shadow-sm shadow-amber-950/50'
            : 'bg-rose-950/80 text-rose-400 border-rose-700/80 shadow-sm shadow-rose-950/50'
        }`}>
          {isOptimal ? (
            <ShieldCheck className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
        </div>

        {/* Metadados do Exame */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wide font-mono">
              {modalityName}
            </span>
            <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 font-tabular">
              Confiança: {Math.round(modality.confidence * 100)}%
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-400 mt-0.5 font-mono text-[11px]">
            <span>
              Qualidade: <strong className="text-slate-200 font-tabular">{Math.round(quality.score * 100)}%</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span>
              Dimensões: <strong className="text-slate-200 font-tabular">{quality.dimensions.width}×{quality.dimensions.height}px</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span>
              Nitidez Laplaciana: <strong className="text-slate-200 font-tabular">{quality.sharpness}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Alerta de Qualidade ou Selo de Conformidade */}
      <div>
        {quality.warnings.length > 0 ? (
          <div className="flex items-center gap-1.5 text-xs text-amber-300 bg-amber-950/50 px-2.5 py-1 rounded-lg border border-amber-800/60 font-medium">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>{quality.warnings[0]}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-emerald-300 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/60 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Imagem com nitidez e contraste ótimos para diagnóstico</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityBadge;
