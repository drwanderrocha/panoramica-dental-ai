import React from 'react';
import type { ImageQualityInfo, ModalityInfo } from '../../types/dental';
import { ShieldCheck, AlertTriangle, Eye } from 'lucide-react';

interface QualityBadgeProps {
  quality: ImageQualityInfo;
  modality: ModalityInfo;
}

export const QualityBadge: React.FC<QualityBadgeProps> = ({ quality, modality }) => {
  const isOptimal = quality.score >= 0.85;
  const isAcceptable = quality.score >= 0.60;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-4 backdrop-blur shadow-lg">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${
          isOptimal
            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
            : isAcceptable
            ? 'bg-amber-950/80 text-amber-400 border border-amber-800/80'
            : 'bg-rose-950/80 text-rose-400 border border-rose-800/80'
        }`}>
          {isOptimal ? (
            <ShieldCheck className="w-5 h-5" />
          ) : (
            <AlertTriangle className="w-5 h-5" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wide">
              {modality.detected === 'panoramic' ? 'Radiografia Panorâmica' : modality.detected}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              Validação: {Math.round(modality.confidence * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
            <span>Score de Qualidade: <strong className="text-slate-200">{Math.round(quality.score * 100)}%</strong></span>
            <span>•</span>
            <span>Resolução: <strong className="text-slate-200">{quality.dimensions.width}x{quality.dimensions.height}</strong></span>
            <span>•</span>
            <span>Nitidez (Laplaciano): <strong className="text-slate-200">{quality.sharpness}</strong></span>
          </div>
        </div>
      </div>

      {/* Alertas ou conformidade */}
      {quality.warnings.length > 0 ? (
        <div className="flex items-center gap-1.5 text-xs text-amber-400/90 bg-amber-950/40 px-2.5 py-1 rounded-lg border border-amber-800/50">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{quality.warnings[0]}</span>
        </div>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/50">
          <Eye className="w-3.5 h-3.5 flex-shrink-0" />
          <span>Contraste e nitidez adequados para leitura radiográfica</span>
        </div>
      )}
    </div>
  );
};
