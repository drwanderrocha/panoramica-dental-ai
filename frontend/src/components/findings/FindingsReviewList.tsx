import React, { useState } from 'react';
import type { FindingItem } from '../../types/dental';
import { Check, X, Edit3, Plus, Sparkles, FileText, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const ORALXRAYS9_PRESETS = [
  { type: 'apical_periodontitis', category: 'pathology' as const, label: 'Possível periodontite/lesão periapical' },
  { type: 'decay', category: 'pathology' as const, label: 'Suspeita de lesão cariosa' },
  { type: 'wisdom_tooth', category: 'structural' as const, label: 'Terceiro molar / Siso incluso' },
  { type: 'missing_tooth', category: 'structural' as const, label: 'Dente ausente / perda dentária' },
  { type: 'dental_filling', category: 'treatment' as const, label: 'Restauração dentária radiopaca' },
  { type: 'root_canal_filling', category: 'treatment' as const, label: 'Tratamento endodôntico (canal)' },
  { type: 'implant', category: 'device' as const, label: 'Implante osseointegrado' },
  { type: 'porcelain_crown', category: 'device' as const, label: 'Coroa protética unitária' },
  { type: 'ceramic_bridge', category: 'device' as const, label: 'Prótese parcial fixa / Ponte' },
];

const TYPE_CONFIG: Record<string, { bg: string; text: string; border: string; accent: string; label: string }> = {
  apical_periodontitis: { bg: 'bg-rose-950/70', text: 'text-rose-300', border: 'border-rose-800/80', accent: '#f43f5e', label: 'Lesão Periapical' },
  decay: { bg: 'bg-amber-950/70', text: 'text-amber-300', border: 'border-amber-800/80', accent: '#fb923c', label: 'Cárie Dentária' },
  wisdom_tooth: { bg: 'bg-violet-950/70', text: 'text-violet-300', border: 'border-violet-800/80', accent: '#c084fc', label: 'Terceiro Molar' },
  missing_tooth: { bg: 'bg-slate-800/70', text: 'text-slate-300', border: 'border-slate-700/80', accent: '#94a3b8', label: 'Dente Ausente' },
  dental_filling: { bg: 'bg-sky-950/70', text: 'text-sky-300', border: 'border-sky-800/80', accent: '#38bdf8', label: 'Restauração' },
  root_canal_filling: { bg: 'bg-blue-950/70', text: 'text-blue-300', border: 'border-blue-800/80', accent: '#60a5fa', label: 'Endodontia' },
  implant: { bg: 'bg-emerald-950/70', text: 'text-emerald-300', border: 'border-emerald-800/80', accent: '#34d399', label: 'Implante' },
  porcelain_crown: { bg: 'bg-indigo-950/70', text: 'text-indigo-300', border: 'border-indigo-800/80', accent: '#818cf8', label: 'Coroa Protética' },
  ceramic_bridge: { bg: 'bg-pink-950/70', text: 'text-pink-300', border: 'border-pink-800/80', accent: '#f472b6', label: 'Ponte Cerâmica' },
};

interface FindingsReviewListProps {
  findings: FindingItem[];
  selectedFindingId: string | null;
  onSelectFinding: (id: string | null) => void;
  onUpdateFindingStatus: (id: string, status: FindingItem['status'], notes?: string, fdi?: number) => void;
  onAddManualFinding: (finding: Omit<FindingItem, 'id' | 'status' | 'source'>) => void;
  onGenerateReport: () => void;
}

export const FindingsReviewList: React.FC<FindingsReviewListProps> = ({
  findings,
  selectedFindingId,
  onSelectFinding,
  onUpdateFindingStatus,
  onAddManualFinding,
  onGenerateReport,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  
  // Estado para modal de edição de achado
  const [editingFinding, setEditingFinding] = useState<FindingItem | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editTooth, setEditTooth] = useState<number | ''>('');

  // Estado para novo achado manual
  const [isAddingManual, setIsAddingManual] = useState(false);
  const [selectedPresetType, setSelectedPresetType] = useState<string>('decay');
  const [newLabel, setNewLabel] = useState('');
  const [newTooth, setNewTooth] = useState<number | ''>('');

  const pendingCount = findings.filter(f => f.status === 'pending').length;
  const acceptedCount = findings.filter(f => f.status === 'accepted' || f.status === 'edited' || f.status === 'manual_entry').length;
  const rejectedCount = findings.filter(f => f.status === 'rejected').length;

  const filteredFindings = findings.filter(f => {
    if (filter === 'pending') return f.status === 'pending';
    if (filter === 'accepted') return f.status === 'accepted' || f.status === 'edited' || f.status === 'manual_entry';
    if (filter === 'rejected') return f.status === 'rejected';
    return true;
  });

  const handleStartEdit = (f: FindingItem) => {
    setEditingFinding(f);
    setEditNotes(f.notes || '');
    setEditTooth(f.fdi_number || '');
  };

  const handleSaveEdit = () => {
    if (!editingFinding) return;
    onUpdateFindingStatus(
      editingFinding.id,
      'edited',
      editNotes,
      editTooth === '' ? undefined : Number(editTooth)
    );
    setEditingFinding(null);
  };

  const handleCreateManualFinding = (e: React.FormEvent) => {
    e.preventDefault();
    const preset = ORALXRAYS9_PRESETS.find(p => p.type === selectedPresetType) || ORALXRAYS9_PRESETS[0];
    const finalLabel = newLabel.trim() || preset.label;

    onAddManualFinding({
      fdi_number: newTooth === '' ? null : Number(newTooth),
      category: preset.category,
      type: preset.type,
      label: finalLabel + (newTooth ? ` — Dente ${newTooth}` : ''),
      confidence: 1.0,
      confidence_tier: 'high',
      bbox_normalized: [0.45, 0.45, 0.08, 0.1],
      notes: 'Inserido manualmente pelo cirurgião-dentista',
    });

    setNewLabel('');
    setNewTooth('');
    setIsAddingManual(false);
  };

  const reviewProgress = Math.round(((acceptedCount + rejectedCount) / (findings.length || 1)) * 100);

  return (
    <div className="flex flex-col h-full clinical-glass rounded-xl overflow-hidden border border-slate-800/80 shadow-2xl">
      {/* Cabeçalho Clínico da Mesa de Revisão */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/60">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-sky-950 border border-sky-800/60 text-sky-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-100 font-mono">
                Mesa de Revisão IA
              </h2>
              <p className="text-[10px] text-slate-400">
                OralXrays-9 & PRAD Benchmark
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAddingManual(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-sky-950/80 hover:bg-sky-900 text-sky-300 border border-sky-700/60 transition shadow-sm cursor-pointer"
            title="Inserir anotação clínica manual"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Inserir</span>
          </button>
        </div>

        {/* Barra de Progresso e Validação Humana */}
        <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-800/60 space-y-1.5">
          <div className="flex justify-between items-center text-[11px] font-mono">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-slate-500" />
              Conclusão da Revisão:
            </span>
            <span className="font-semibold text-slate-200 font-tabular">
              {reviewProgress}% ({findings.length - pendingCount}/{findings.length})
            </span>
          </div>

          <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${(acceptedCount / (findings.length || 1)) * 100}%` }}
              className="bg-emerald-500 transition-all duration-300"
              title={`${acceptedCount} aceitos`}
            />
            <div
              style={{ width: `${(rejectedCount / (findings.length || 1)) * 100}%` }}
              className="bg-rose-500/80 transition-all duration-300"
              title={`${rejectedCount} rejeitados`}
            />
          </div>
        </div>

        {/* Filtros em Controles Segmentados */}
        <div className="grid grid-cols-4 gap-1 mt-2.5 bg-slate-950/60 p-0.5 rounded-lg border border-slate-800/60 text-[11px] font-mono font-medium">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map(tab => {
            const count = tab === 'all' ? findings.length : tab === 'pending' ? pendingCount : tab === 'accepted' ? acceptedCount : rejectedCount;
            const isActive = filter === tab;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`py-1 rounded-md transition text-center cursor-pointer font-tabular ${
                  isActive
                    ? 'bg-slate-800 text-sky-300 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab === 'all' && `Todos (${count})`}
                {tab === 'pending' && `Pend (${count})`}
                {tab === 'accepted' && `Ok (${count})`}
                {tab === 'rejected' && `Rej (${count})`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Lista com scroll dos achados com cards elevados */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
        {filteredFindings.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            Nenhum achado encontrado neste filtro.
          </div>
        ) : (
          filteredFindings.map(finding => {
            const isSelected = selectedFindingId === finding.id;
            const isPending = finding.status === 'pending';
            const isAccepted = finding.status === 'accepted' || finding.status === 'edited' || finding.status === 'manual_entry';
            const isRejected = finding.status === 'rejected';
            const config = TYPE_CONFIG[finding.type] || {
              bg: 'bg-slate-800/70',
              text: 'text-slate-300',
              border: 'border-slate-700/80',
              accent: '#38bdf8',
              label: finding.type,
            };

            return (
              <div
                key={finding.id}
                onClick={() => onSelectFinding(finding.id)}
                style={{ borderLeftColor: config.accent, borderLeftWidth: '3px' }}
                className={`group p-2.5 rounded-lg border transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/95 border-sky-500/70 shadow-lg shadow-sky-950/50 ring-1 ring-sky-500/40'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/50'
                } ${isRejected ? 'opacity-40 line-through' : ''}`}
              >
                {/* Header do Card */}
                <div className="flex items-center justify-between gap-1.5 mb-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded border ${config.bg} ${config.text} ${config.border}`}>
                      {config.label}
                    </span>
                    {finding.fdi_number && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-tabular">
                        Dente {finding.fdi_number}
                      </span>
                    )}
                  </div>

                  {/* Confiança IA */}
                  <div className="flex items-center gap-1 text-[10px] font-mono font-tabular">
                    <span className="text-slate-500">Score:</span>
                    <span className={`font-semibold ${
                      finding.confidence >= 0.85
                        ? 'text-emerald-400'
                        : finding.confidence >= 0.50
                        ? 'text-amber-400'
                        : 'text-slate-400'
                    }`}>
                      {Math.round(finding.confidence * 100)}%
                    </span>
                  </div>
                </div>

                {/* Descrição do Achado */}
                <div className="text-xs font-medium text-slate-200 mb-1 leading-snug">
                  {finding.label}
                </div>

                {/* Notas adicionais */}
                {finding.notes && (
                  <p className="text-[11px] text-slate-400 italic mb-1.5 bg-slate-950/60 p-1 rounded border border-slate-800/50">
                    "{finding.notes}"
                  </p>
                )}

                {/* Barra de Ações Rápidas do Cirurgião-Dentista */}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/60 mt-1.5">
                  <div className="text-[10px] font-mono">
                    {isPending && (
                      <span className="text-amber-400/90 font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Pendente
                      </span>
                    )}
                    {isAccepted && (
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Validado
                      </span>
                    )}
                    {isRejected && (
                      <span className="text-rose-400/80 font-medium flex items-center gap-1">
                        <X className="w-3 h-3" /> Descartado
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Botão Aceitar */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onUpdateFindingStatus(finding.id, 'accepted');
                      }}
                      className={`px-2 py-0.5 text-[11px] font-medium rounded flex items-center gap-1 transition cursor-pointer ${
                        isAccepted
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-800/70 border border-emerald-800/60'
                      }`}
                      title="Aceitar Achado"
                    >
                      <Check className="w-3 h-3" />
                      <span>Aceitar</span>
                    </button>

                    {/* Botão Rejeitar */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onUpdateFindingStatus(finding.id, 'rejected');
                      }}
                      className={`px-2 py-0.5 text-[11px] font-medium rounded flex items-center gap-1 transition cursor-pointer ${
                        isRejected
                          ? 'bg-rose-600 text-white shadow-sm'
                          : 'bg-rose-950/60 text-rose-300 hover:bg-rose-800/70 border border-rose-800/60'
                      }`}
                      title="Descartar Falso Positivo"
                    >
                      <X className="w-3 h-3" />
                      <span>Rejeitar</span>
                    </button>

                    {/* Botão Editar */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleStartEdit(finding);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
                      title="Editar Dente Associado ou Anotação"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Rodapé Clínico com Geração de Laudo Estruturado */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-900/80 flex flex-col gap-1.5">
        <button
          onClick={onGenerateReport}
          disabled={findings.length === 0 || pendingCount > 0}
          className={`w-full py-2.5 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition shadow-lg cursor-pointer ${
            findings.length > 0 && pendingCount === 0
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-slate-950 font-bold shadow-sky-500/25 active:scale-[0.99]'
              : 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          {pendingCount > 0 ? (
            <span>Valide os {pendingCount} achados pendentes</span>
          ) : (
            <span>Gerar Laudo Clínico Odontológico ({acceptedCount} confirmados)</span>
          )}
        </button>

        <p className="text-[10px] text-center text-slate-500 font-mono">
          Suporte à Decisão Clínica • Requer correlação direta do Cirurgião-Dentista
        </p>
      </div>

      {/* Modal de Edição de Achado */}
      {editingFinding && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="clinical-glass-elevated rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
              <Edit3 className="w-4 h-4 text-sky-400" />
              Editar Achado: {editingFinding.label}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Dente FDI Associado (11 a 48)
              </label>
              <input
                type="number"
                value={editTooth}
                onChange={e => setEditTooth(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 36"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Observações Clínicas do Cirurgião-Dentista
              </label>
              <textarea
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                placeholder="Ex: Lesão radiolúcida periapical compatível com granuloma..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-500 resize-none font-sans"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingFinding(null)}
                className="px-3 py-1.5 text-xs rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white cursor-pointer shadow-md"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Inclusão Manual com os 9 Tipos do OralXrays-9 */}
      {isAddingManual && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateManualFinding} className="clinical-glass-elevated rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 font-mono">
              <Plus className="w-4 h-4 text-sky-400" />
              Inserir Achado Clínico Manual
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Classe Radiográfica (Catálogo OralXrays-9)
              </label>
              <select
                value={selectedPresetType}
                onChange={e => setSelectedPresetType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-sky-500"
              >
                {ORALXRAYS9_PRESETS.map(p => (
                  <option key={p.type} value={p.type}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Dente FDI Associado (opcional)
              </label>
              <input
                type="number"
                value={newTooth}
                onChange={e => setNewTooth(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 46"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-sky-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Descrição Customizada (opcional)
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="Deixe em branco para usar a descrição padrão"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 focus:outline-none focus:border-sky-500 font-sans"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingManual(false)}
                className="px-3 py-1.5 text-xs rounded-lg text-slate-400 hover:bg-slate-800 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 text-white cursor-pointer shadow-md"
              >
                Inserir Achado
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FindingsReviewList;
