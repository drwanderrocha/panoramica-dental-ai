import React from 'react';
import type { ToothDetection, FindingItem } from '../../types/dental';

interface OdontogramGridProps {
  teeth: ToothDetection[];
  findings: FindingItem[];
  selectedToothNumber: number | null;
  onSelectTooth: (fdi: number | null) => void;
}

export const OdontogramGrid: React.FC<OdontogramGridProps> = ({
  teeth,
  findings,
  selectedToothNumber,
  onSelectTooth,
}) => {
  // Quadrantes anatômicos
  const q1 = [18, 17, 16, 15, 14, 13, 12, 11];
  const q2 = [21, 22, 23, 24, 25, 26, 27, 28];
  const q4 = [48, 47, 46, 45, 44, 43, 42, 41];
  const q3 = [31, 32, 33, 34, 35, 36, 37, 38];

  const teethMap = new Map<number, ToothDetection>();
  teeth.forEach(t => teethMap.set(t.fdi_number, t));

  const findingsMap = new Map<number, FindingItem[]>();
  findings.forEach(f => {
    if (f.fdi_number && f.status !== 'rejected') {
      const list = findingsMap.get(f.fdi_number) || [];
      list.push(f);
      findingsMap.set(f.fdi_number, list);
    }
  });

  const renderToothCell = (fdi: number) => {
    const tooth = teethMap.get(fdi);
    const toothFindings = findingsMap.get(fdi) || [];
    const isSelected = selectedToothNumber === fdi;
    const isDetected = !!tooth;
    const hasPathology = toothFindings.some(f => f.category === 'pathology');
    const hasStructural = toothFindings.some(f => f.category === 'structural');

    return (
      <button
        key={fdi}
        onClick={() => onSelectTooth(isSelected ? null : fdi)}
        className={`relative flex flex-col items-center justify-between p-1.5 rounded-lg border transition-all ${
          isSelected
            ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 ring-2 ring-cyan-500/50 shadow-lg scale-105 z-10'
            : isDetected
            ? 'bg-slate-900/80 border-slate-700/80 text-slate-200 hover:border-slate-500 hover:bg-slate-800'
            : 'bg-slate-950/50 border-dashed border-slate-800 text-slate-500 hover:border-slate-700'
        }`}
        style={{ minWidth: '40px', minHeight: '52px' }}
        title={`Dente FDI ${fdi}${isDetected ? ` (Confiança: ${Math.round((tooth?.confidence || 0) * 100)}%)` : ' (Não detectado)'}`}
      >
        <span className="text-xs font-mono font-bold tracking-tight">
          {fdi}
        </span>

        {/* Ícone de status do dente */}
        <div className="w-5 h-5 flex items-center justify-center">
          {isDetected ? (
            <div className={`w-3.5 h-3.5 rounded-full border ${
              isSelected ? 'bg-cyan-400 border-cyan-200' : 'bg-slate-700 border-slate-500'
            }`} />
          ) : (
            <div className="w-2 h-2 rounded-full bg-slate-800" />
          )}
        </div>

        {/* Indicadores de Achados */}
        <div className="flex gap-1 h-2">
          {hasPathology && (
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Achado patológico" />
          )}
          {hasStructural && (
            <span className="w-2 h-2 rounded-full bg-purple-500" title="Achado estrutural/incluso" />
          )}
          {!hasPathology && !hasStructural && toothFindings.length > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400" title="Achado radiográfico" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-3.5 shadow-xl backdrop-blur">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Odontograma FDI (11 a 48)
          </h3>
          {teeth.length <= 6 && (
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-800">
              Campo Localizado Periapical
            </span>
          )}
        </div>
        <span className="text-xs text-slate-400 font-mono">
          {teeth.length} / 32 dentes identificados
        </span>
      </div>

      {/* Arcada Superior (Quadrantes 1 e 2) */}
      <div className="space-y-2">
        <div className="flex items-center justify-center gap-1.5 pb-2 border-b border-slate-800">
          <div className="flex gap-1">
            {q1.map(renderToothCell)}
          </div>
          <div className="w-px h-10 bg-slate-700/60 mx-1" />
          <div className="flex gap-1">
            {q2.map(renderToothCell)}
          </div>
        </div>

        {/* Arcada Inferior (Quadrantes 4 e 3) */}
        <div className="flex items-center justify-center gap-1.5 pt-1">
          <div className="flex gap-1">
            {q4.map(renderToothCell)}
          </div>
          <div className="w-px h-10 bg-slate-700/60 mx-1" />
          <div className="flex gap-1">
            {q3.map(renderToothCell)}
          </div>
        </div>
      </div>

      {/* Legenda rápida */}
      <div className="flex items-center justify-center gap-4 mt-3 text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" /> Patologias (cárie / lesão)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500" /> Incluso / Retido
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-slate-700" /> Dente íntegro
        </span>
      </div>
    </div>
  );
};
