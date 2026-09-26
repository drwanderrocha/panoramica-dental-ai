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
    <div className="notion-callout px-3.5 py-2 flex flex-wrap items-center justify-between gap-3 shadow-md border border-white/[0.08] bg-black/20">
      <div className="flex items-center gap-3">
        {/* Ícone de Conformidade Radiológica em Caixa Estilo Notion */}
        <div className={`w-8 h-8 rounded-md border flex items-center justify-center ${
          isOptimal
            ? 'notion-tag-mint'
            : isAcceptable
            ? 'notion-tag-peach'
            : 'notion-tag-rose'
        }`}>
          {isOptimal ? (
            <ShieldCheck className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
        </div>

        {/* Metadados do Exame em Propriedades Notion */}
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-100 tracking-tight">
              {modalityName}
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded notion-tag-purple font-medium">
              Confiança: {Math.round(modality.confidence * 100)}%
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5 font-mono text-[11px]">
            <span>
              Score: <strong className="text-slate-200 font-tabular font-semibold">{Math.round(quality.score * 100)}%</strong>
            </span>
            <span className="text-slate-600">•</span>
            <span>
              {quality.dimensions.width}×{quality.dimensions.height}px
            </span>
            <span className="text-slate-600">•</span>
            <span>
              Laplaciano: <strong className="text-slate-200 font-tabular">{quality.sharpness}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Alerta de Qualidade ou Selo de Conformidade */}
      <div>
        {quality.warnings.length > 0 ? (
          <div className="flex items-center gap-1.5 text-xs notion-tag-peach px-2.5 py-1 rounded-md font-medium">
            <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{quality.warnings[0]}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs notion-tag-mint px-2.5 py-1 rounded-md font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Padrão técnico aprovado para diagnóstico clínico</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default QualityBadge;

