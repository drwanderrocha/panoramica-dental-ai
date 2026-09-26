import React from 'react';
import type { ToothDetection, FindingItem } from '../../types/dental';

interface OdontogramGridProps {
  teeth: ToothDetection[];
  findings: FindingItem[];
  selectedToothNumber: number | null;
  onSelectTooth: (fdi: number | null) => void;
}

// Mapeamento anatômico para nomes clínicos de cada dente
const TOOTH_NAMES: Record<number, string> = {
  18: '3º Molar Sup. Dir. (Siso)',
  17: '2º Molar Sup. Direito',
  16: '1º Molar Sup. Direito',
  15: '2º Pré-molar Sup. Dir.',
  14: '1º Pré-molar Sup. Dir.',
  13: 'Canino Superior Direito',
  12: 'Incisivo Lateral Sup. Dir.',
  11: 'Incisivo Central Sup. Dir.',

  21: 'Incisivo Central Sup. Esq.',
  22: 'Incisivo Lateral Sup. Esq.',
  23: 'Canino Superior Esquerdo',
  24: '1º Pré-molar Sup. Esq.',
  25: '2º Pré-molar Sup. Esq.',
  26: '1º Molar Sup. Esquerdo',
  27: '2º Molar Sup. Esquerdo',
  28: '3º Molar Sup. Esq. (Siso)',

  48: '3º Molar Inf. Dir. (Siso)',
  47: '2º Molar Inf. Direito',
  46: '1º Molar Inf. Direito',
  45: '2º Pré-molar Inf. Dir.',
  44: '1º Pré-molar Inf. Dir.',
  43: 'Canino Inferior Direito',
  42: 'Incisivo Lateral Inf. Dir.',
  41: 'Incisivo Central Inf. Dir.',

  31: 'Incisivo Central Inf. Esq.',
  32: 'Incisivo Lateral Inf. Esq.',
  33: 'Canino Inferior Esquerdo',
  34: '1º Pré-molar Inf. Esq.',
  35: '2º Pré-molar Inf. Esq.',
  36: '1º Molar Inf. Esquerdo',
  37: '2º Molar Inf. Esquerdo',
  38: '3º Molar Inf. Esq. (Siso)',
};

// Ícones Anatômicos SVG orientados (Raízes para cima na Maxila, Raízes para baixo na Mandíbula)
const ToothAnatomicalIcon: React.FC<{ fdi: number; isSelected: boolean; isDetected: boolean }> = ({
  fdi,
  isSelected,
  isDetected,
}) => {
  const isUpper = fdi < 30; // Maxila (quadrantes 1 e 2)
  const lastDigit = fdi % 10;
  const isMolar = lastDigit >= 6;
  const isPremolar = lastDigit === 4 || lastDigit === 5;
  const isCanine = lastDigit === 3;
  // const isIncisor = lastDigit === 1 || lastDigit === 2;

  const strokeColor = isSelected ? '#38bdf8' : isDetected ? '#94a3b8' : '#334155';
  const fillColor = isSelected ? 'rgba(56, 189, 248, 0.25)' : isDetected ? 'rgba(148, 163, 184, 0.1)' : 'transparent';

  if (isMolar) {
    // Molar multi-cusp e multi-radicular
    return (
      <svg viewBox="0 0 24 24" className="w-5 h-5 transition-transform duration-150" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {isUpper ? (
          <>
            {/* Raízes superiores */}
            <path d="M7 3v6M12 2v7M17 3v6" />
            {/* Coroa molar superior */}
            <path d="M5 9c0-1 1-2 3-2h8c2 0 3 1 3 2v6c0 3-2 5-4 5H9C7 20 5 18 5 15V9z" />
            {/* Sulco oclusal */}
            <path d="M8 14h8M12 11v6" opacity="0.6" strokeWidth="1.2" />
          </>
        ) : (
          <>
            {/* Coroa molar inferior */}
            <path d="M5 4c0-2 2-3 4-3h6c2 0 4 1 4 3v6c0 1-1 2-2 2H7c-1 0-2-1-2-2V4z" />
            <path d="M8 7h8M12 4v6" opacity="0.6" strokeWidth="1.2" />
            {/* Raízes inferiores */}
            <path d="M7 12v9M17 12v9" />
          </>
        )}
      </svg>
    );
  }

  if (isPremolar) {
    // Pré-molar
    return (
      <svg viewBox="0 0 24 24" className="w-4 h-5 transition-transform duration-150" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {isUpper ? (
          <>
            <path d="M9 3v6M15 3v6" />
            <path d="M6 9c0-1.5 1-2.5 3-2.5h6c2 0 3 1 3 2.5v5c0 3-1.5 5-3 5H9c-1.5 0-3-2-3-5V9z" />
            <path d="M12 10v6" opacity="0.6" strokeWidth="1.2" />
          </>
        ) : (
          <>
            <path d="M6 5c0-1.5 1-2.5 3-2.5h6c2 0 3 1 3 2.5v5c0 1.5-1 2.5-3 2.5H9C7 12.5 6 11.5 6 10V5z" />
            <path d="M12 5v5" opacity="0.6" strokeWidth="1.2" />
            <path d="M9 12.5v8.5M15 12.5v8.5" />
          </>
        )}
      </svg>
    );
  }

  if (isCanine) {
    // Canino (raiz única proeminente, cúspide pontiaguda)
    return (
      <svg viewBox="0 0 24 24" className="w-3.5 h-5 transition-transform duration-150" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        {isUpper ? (
          <>
            <path d="M12 2v7" />
            <path d="M7 9c0-1.5 2-2 5-2s5 0.5 5 2v4c0 3-2 6-5 7-3-1-5-4-5-7V9z" />
          </>
        ) : (
          <>
            <path d="M7 11c0-3 2-6 5-7 3 1 5 4 5 7v4c0 1.5-2 2-5 2s-5-0.5-5-2v-4z" />
            <path d="M12 17v5" />
          </>
        )}
      </svg>
    );
  }

  // Incisivo central / lateral
  return (
    <svg viewBox="0 0 24 24" className="w-3.5 h-5 transition-transform duration-150" fill={fillColor} stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {isUpper ? (
        <>
          <path d="M12 3v6" />
          <path d="M7 9h10v6c0 2.5-2 4-5 4s-5-1.5-5-4V9z" />
        </>
      ) : (
        <>
          <path d="M7 5c0-2 2-3 5-3s5 1 5 3v6H7V5z" />
          <path d="M12 11v10" />
        </>
      )}
    </svg>
  );
};

export const OdontogramGrid: React.FC<OdontogramGridProps> = ({
  teeth,
  findings,
  selectedToothNumber,
  onSelectTooth,
}) => {
  // Quadrantes anatômicos internacionais (FDI)
  const q1 = [18, 17, 16, 15, 14, 13, 12, 11]; // Maxilar Superior Direito
  const q2 = [21, 22, 23, 24, 25, 26, 27, 28]; // Maxilar Superior Esquerdo
  const q4 = [48, 47, 46, 45, 44, 43, 42, 41]; // Mandibular Inferior Direito
  const q3 = [31, 32, 33, 34, 35, 36, 37, 38]; // Mandibular Inferior Esquerdo

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
    const hasTreatment = toothFindings.some(f => f.category === 'treatment');
    const hasDevice = toothFindings.some(f => f.category === 'device');

    const toothTitle = `${fdi}: ${TOOTH_NAMES[fdi] || 'Dente'}${
      isDetected ? ` • Confiança IA: ${Math.round((tooth?.confidence || 0) * 100)}%` : ' • Não detectado'
    }${toothFindings.length > 0 ? ` • ${toothFindings.length} achado(s): ${toothFindings.map(x => x.label).join(', ')}` : ''}`;

    return (
      <button
        key={fdi}
        onClick={() => onSelectTooth(isSelected ? null : fdi)}
        className={`group relative flex flex-col items-center justify-between p-1.5 rounded-lg border transition-all duration-150 cursor-pointer ${
          isSelected
            ? 'bg-sky-950/80 border-sky-400 text-sky-200 ring-2 ring-sky-500/50 shadow-lg shadow-sky-500/20 scale-105 z-10'
            : isDetected
            ? 'bg-slate-900/90 border-slate-700/70 text-slate-200 hover:border-slate-500 hover:bg-slate-800 hover:scale-[1.02]'
            : 'bg-slate-950/40 border-dashed border-slate-800/80 text-slate-600 hover:border-slate-700'
        }`}
        style={{ minWidth: '42px', minHeight: '56px' }}
        title={toothTitle}
        aria-label={toothTitle}
      >
        {/* Número FDI em fonte mono tabular com tracking preciso */}
        <span className={`text-[11px] font-mono font-bold tracking-tight font-tabular ${
          isSelected ? 'text-sky-300 font-extrabold' : isDetected ? 'text-slate-200' : 'text-slate-600'
        }`}>
          {fdi}
        </span>

        {/* Silhueta anatômica do dente */}
        <div className="my-0.5 flex items-center justify-center">
          <ToothAnatomicalIcon fdi={fdi} isSelected={isSelected} isDetected={isDetected} />
        </div>

        {/* Indicadores Clínicos de Achados com Beacons Coloridos */}
        <div className="flex items-center gap-0.5 h-2">
          {hasPathology && (
            <span
              className="w-2 h-2 rounded-full bg-rose-500 ring-1 ring-rose-400/50 animate-pulse"
              title="Achado patológico (Cárie/Lesão periapical)"
            />
          )}
          {hasStructural && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-violet-400 ring-1 ring-violet-300/40"
              title="Achado estrutural (Siso/Impactado)"
            />
          )}
          {hasTreatment && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-blue-400 ring-1 ring-blue-300/40"
              title="Tratamento endodôntico (Canal)"
            />
          )}
          {hasDevice && (
            <span
              className="w-1.5 h-1.5 rounded-full bg-emerald-400 ring-1 ring-emerald-300/40"
              title="Prótese / Implante"
            />
          )}
          {!hasPathology && !hasStructural && !hasTreatment && !hasDevice && isDetected && (
            <span className="w-1 h-1 rounded-full bg-slate-700" />
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="clinical-glass rounded-xl p-3 shadow-xl border border-slate-800/80">
      {/* Header do Odontograma */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-beacon" />
          <h3 className="text-xs font-semibold tracking-wide text-slate-200 uppercase font-mono">
            Odontograma Anatômico FDI
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">
            (32 dentes permanentes)
          </span>
        </div>

        {/* Legenda de cores dos achados clínicos */}
        <div className="hidden sm:flex items-center gap-3 text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            Patologia
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Canal
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            Siso/Incluso
          </span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Implante
          </span>
        </div>
      </div>

      {/* Grid Odontológico Dividido em Maxila e Mandíbula */}
      <div className="flex flex-col gap-1.5">
        {/* Arcada Superior (Maxila) */}
        <div className="relative flex items-center justify-center gap-1 p-1 rounded-lg bg-slate-950/40 border border-slate-800/40">
          <span className="absolute left-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest hidden xl:inline">
            Maxila
          </span>

          {/* Quadrante 1 (Direito do Paciente / Esquerda do Observador) */}
          <div className="flex gap-1">
            {q1.map(fdi => renderToothCell(fdi))}
          </div>

          {/* Divisor Central: Linha Média Dental Superior */}
          <div className="flex flex-col items-center justify-center px-1" title="Linha Média Dental">
            <div className="w-0.5 h-12 bg-sky-500/40 rounded-full" />
            <span className="text-[8px] font-mono text-sky-400/70 mt-0.5">LM</span>
          </div>

          {/* Quadrante 2 (Esquerdo do Paciente / Direita do Observador) */}
          <div className="flex gap-1">
            {q2.map(fdi => renderToothCell(fdi))}
          </div>
        </div>

        {/* Arcada Inferior (Mandíbula) */}
        <div className="relative flex items-center justify-center gap-1 p-1 rounded-lg bg-slate-950/40 border border-slate-800/40">
          <span className="absolute left-2 text-[9px] font-mono text-slate-500 uppercase tracking-widest hidden xl:inline">
            Mandíbula
          </span>

          {/* Quadrante 4 (Direito do Paciente / Esquerda do Observador) */}
          <div className="flex gap-1">
            {q4.map(fdi => renderToothCell(fdi))}
          </div>

          {/* Divisor Central: Linha Média Dental Inferior */}
          <div className="flex flex-col items-center justify-center px-1" title="Linha Média Dental">
            <div className="w-0.5 h-12 bg-sky-500/40 rounded-full" />
            <span className="text-[8px] font-mono text-sky-400/70 mt-0.5">LM</span>
          </div>

          {/* Quadrante 3 (Esquerdo do Paciente / Direita do Observador) */}
          <div className="flex gap-1">
            {q3.map(fdi => renderToothCell(fdi))}
          </div>
        </div>
      </div>

      {/* Barra de Rodapé do Odontograma com Detalhes do Dente Selecionado */}
      <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-xs">
        {selectedToothNumber ? (
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 font-mono font-bold border border-sky-800">
              Dente {selectedToothNumber}
            </span>
            <span className="text-slate-300 font-medium">
              {TOOTH_NAMES[selectedToothNumber] || 'Dente selecionado'}
            </span>
            {teethMap.get(selectedToothNumber) && (
              <span className="text-[11px] text-slate-400 font-mono">
                (Confiança FDI: {Math.round((teethMap.get(selectedToothNumber)?.confidence || 0) * 100)}%)
              </span>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-slate-500">
            Clique em qualquer dente para focalizar na radiografia e filtrar achados.
          </span>
        )}

        {selectedToothNumber && (
          <button
            onClick={() => onSelectTooth(null)}
            className="text-[11px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
          >
            Limpar seleção
          </button>
        )}
      </div>
    </div>
  );
};

export default OdontogramGrid;
