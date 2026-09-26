import React, { useState } from 'react';
import type { FindingItem } from '../../types/dental';
import { Check, X, Edit3, Plus, Sparkles, FileText } from 'lucide-react';

const ORALXRAYS9_PRESETS = [
  { type: 'apical_periodontitis', category: 'pathology' as const, label: 'Possível periodontite/lesão periapical' },
  { type: 'decay', category: 'pathology' as const, label: 'Suspeita de lesão cariosa' },
  { type: 'wisdom_tooth', category: 'structural' as const, label: 'Terceiro molar / Siso' },
  { type: 'missing_tooth', category: 'structural' as const, label: 'Dente ausente / perda dentária' },
  { type: 'dental_filling', category: 'treatment' as const, label: 'Restauração dentária radiopaca' },
  { type: 'root_canal_filling', category: 'treatment' as const, label: 'Tratamento endodôntico (canal)' },
  { type: 'implant', category: 'device' as const, label: 'Implante osseointegrado' },
  { type: 'porcelain_crown', category: 'device' as const, label: 'Coroa protética unitária' },
  { type: 'ceramic_bridge', category: 'device' as const, label: 'Prótese parcial fixa / Ponte' },
];

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  apical_periodontitis: { bg: 'bg-red-950/80', text: 'text-red-400', border: 'border-red-800' },
  decay: { bg: 'bg-orange-950/80', text: 'text-orange-400', border: 'border-orange-800' },
  wisdom_tooth: { bg: 'bg-purple-950/80', text: 'text-purple-300', border: 'border-purple-800' },
  missing_tooth: { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' },
  dental_filling: { bg: 'bg-cyan-950/80', text: 'text-cyan-300', border: 'border-cyan-800' },
  root_canal_filling: { bg: 'bg-blue-950/80', text: 'text-blue-300', border: 'border-blue-800' },
  implant: { bg: 'bg-emerald-950/80', text: 'text-emerald-300', border: 'border-emerald-800' },
  porcelain_crown: { bg: 'bg-indigo-950/80', text: 'text-indigo-300', border: 'border-indigo-800' },
  ceramic_bridge: { bg: 'bg-pink-950/80', text: 'text-pink-300', border: 'border-pink-800' },
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

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-2xl backdrop-blur">
      {/* Cabeçalho da Mesa de Revisão */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/95">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-100">
              Mesa de Revisão OralXrays-9
            </h2>
          </div>
          <button
            onClick={() => setIsAddingManual(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border border-cyan-500/40 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Inserir Achado
          </button>
        </div>

        {/* Barra de Progresso da Revisão */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-400 font-medium">
            <span>Validação Humana dos Achados</span>
            <span>
              {findings.length - pendingCount} de {findings.length} avaliados
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${(acceptedCount / (findings.length || 1)) * 100}%` }}
              className="bg-emerald-500 transition-all duration-300"
            />
            <div
              style={{ width: `${(rejectedCount / (findings.length || 1)) * 100}%` }}
              className="bg-rose-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Filtros de Status */}
        <div className="flex gap-1.5 mt-3">
          {(['all', 'pending', 'accepted', 'rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-md transition ${
                filter === tab
                  ? 'bg-slate-700 text-slate-100 shadow'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              {tab === 'all' && `Todos (${findings.length})`}
              {tab === 'pending' && `Pendentes (${pendingCount})`}
              {tab === 'accepted' && `Aceitos (${acceptedCount})`}
              {tab === 'rejected' && `Rejeitados (${rejectedCount})`}
            </button>
          ))}
        </div>
      </div>

      {/* Lista com scroll dos achados */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredFindings.length === 0 ? (
          <div className="p-6 text-center text-slate-500 text-xs">
            Nenhum achado correspondente ao filtro selecionado.
          </div>
        ) : (
          filteredFindings.map(finding => {
            const isSelected = selectedFindingId === finding.id;
            const isPending = finding.status === 'pending';
            const isAccepted = finding.status === 'accepted' || finding.status === 'edited' || finding.status === 'manual_entry';
            const isRejected = finding.status === 'rejected';
            const styleBadge = TYPE_COLORS[finding.type] || { bg: 'bg-slate-800', text: 'text-slate-300', border: 'border-slate-700' };

            return (
              <div
                key={finding.id}
                onClick={() => onSelectFinding(finding.id)}
                className={`p-3 rounded-lg border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/80 ring-1 ring-cyan-500/50 shadow-md'
                    : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                } ${isRejected ? 'opacity-50' : ''}`}
              >
                {/* Cabeçalho do Card */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded border ${styleBadge.bg} ${styleBadge.text} ${styleBadge.border}`}>
                      {finding.type.replace('_', ' ')}
                    </span>
                    {finding.fdi_number && (
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                        FDI {finding.fdi_number}
                      </span>
                    )}
                  </div>

                  {/* Confiança */}
                  <div className="flex items-center gap-1 text-[11px] font-mono">
                    <span className="text-slate-400">IA:</span>
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

                {/* Nome do achado (Terminologia Assistiva) */}
                <div className="text-sm font-semibold text-slate-100 mb-1">
                  {finding.label}
                </div>

                {/* Notas adicionais */}
                {finding.notes && (
                  <p className="text-xs text-slate-400 italic mb-2 bg-slate-950/40 p-1.5 rounded">
                    "{finding.notes}"
                  </p>
                )}

                {/* Botões de Ação Imediata da Mesa de Revisão */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 mt-2">
                  <div className="text-[11px]">
                    {isPending && (
                      <span className="text-amber-400/90 font-medium">Aguardando validação</span>
                    )}
                    {isAccepted && (
                      <span className="text-emerald-400 font-medium flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Confirmado
                      </span>
                    )}
                    {isRejected && (
                      <span className="text-rose-400 font-medium flex items-center gap-1">
                        <X className="w-3.5 h-3.5" /> Descartado
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Botão Aceitar */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onUpdateFindingStatus(finding.id, 'accepted');
                      }}
                      className={`px-2 py-1 text-xs font-semibold rounded flex items-center gap-1 transition ${
                        isAccepted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-emerald-950/70 text-emerald-300 hover:bg-emerald-800/60 border border-emerald-800/80'
                      }`}
                      title="Aceitar Achado"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Aceitar
                    </button>

                    {/* Botão Rejeitar */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        onUpdateFindingStatus(finding.id, 'rejected');
                      }}
                      className={`px-2 py-1 text-xs font-semibold rounded flex items-center gap-1 transition ${
                        isRejected
                          ? 'bg-rose-600 text-white'
                          : 'bg-rose-950/70 text-rose-300 hover:bg-rose-800/60 border border-rose-800/80'
                      }`}
                      title="Rejeitar Achado"
                    >
                      <X className="w-3.5 h-3.5" />
                      Rejeitar
                    </button>

                    {/* Botão Editar */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleStartEdit(finding);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/60 transition"
                      title="Editar Dente / Anotações"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Rodapé com Acionamento do Laudo IA */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-900/95 flex flex-col gap-2">
        <button
          onClick={onGenerateReport}
          disabled={findings.length === 0 || pendingCount > 0}
          className={`w-full py-2.5 px-4 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition shadow-lg ${
            findings.length > 0 && pendingCount === 0
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold shadow-cyan-500/20'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/60'
          }`}
        >
          <FileText className="w-4 h-4" />
          {pendingCount > 0
            ? `Revise os ${pendingCount} achados pendentes para liberar laudo`
            : 'Gerar Laudo Assistido por IA'}
        </button>

        <p className="text-[10px] text-center text-slate-500">
          A IA não emite diagnóstico definitivo. Todos os achados requerem correlação clínica direta.
        </p>
      </div>

      {/* Modal de Edição de Achado */}
      {editingFinding && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100">
              Editar Achado: {editingFinding.label}
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Dente FDI Associado (11 a 48)
              </label>
              <input
                type="number"
                value={editTooth}
                onChange={e => setEditTooth(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 36"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Observações Clínicas do Dentista
              </label>
              <textarea
                value={editNotes}
                onChange={e => setEditNotes(e.target.value)}
                placeholder="Ex: Lesão profunda com provável envolvimento pulpar..."
                rows={3}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditingFinding(null)}
                className="px-3 py-1.5 text-xs rounded-lg text-slate-400 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Inclusão Manual com os 9 Tipos do OralXrays-9 */}
      {isAddingManual && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleCreateManualFinding} className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Plus className="w-4 h-4 text-cyan-400" />
              Inserir Achado Clínico (OralXrays-9)
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Selecione a Classe do Catálogo OralXrays-9
              </label>
              <select
                value={selectedPresetType}
                onChange={e => setSelectedPresetType(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              >
                {ORALXRAYS9_PRESETS.map(p => (
                  <option key={p.type} value={p.type}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Dente FDI (opcional)
              </label>
              <input
                type="number"
                value={newTooth}
                onChange={e => setNewTooth(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder="Ex: 46"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Descrição Customizada (opcional)
              </label>
              <input
                type="text"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                placeholder="Deixe em branco para usar o nome padrão da classe"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingManual(false)}
                className="px-3 py-1.5 text-xs rounded-lg text-slate-400 hover:bg-slate-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white"
              >
                Adicionar Achado
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
