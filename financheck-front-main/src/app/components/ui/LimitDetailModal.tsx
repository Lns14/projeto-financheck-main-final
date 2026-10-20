import { X, Check, Trash2, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { getLimitStatus, formatBRL, formatDateBR } from '../../utils/limitStatus';

interface LimitDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  limit: {
    id: number;
    name: string;
    category: string;
    limit: number;
    spent: number;
    remaining: number;
    percent: number;
    exceeded: boolean;
    createdAt: string;
    icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  } | null;
  /** Categorias disponíveis para troca (mesma lista do modal de criação). */
  categories: string[];
  onUpdateLimit: (
    limitId: number,
    changes: { name: string; category: string; limit: number }
  ) => void | Promise<void>;
  onDelete?: (limitId: number) => void | Promise<void>;
}

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

const fieldClass =
  'w-full px-4 py-3 mb-4 rounded-[16px] bg-white/60 backdrop-blur-xl border-2 border-white/70 text-[#2E4A7C] placeholder:text-[#7BA8F5]/50 focus:border-[#7BA8F5] focus:outline-none focus:shadow-[0_8px_32px_rgba(123,168,245,0.2),0_2px_12px_rgba(255,255,255,0.6)_inset] transition-all duration-300';

export function LimitDetailModal({ isOpen, onClose, limit, categories, onUpdateLimit, onDelete }: LimitDetailModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // Preenche o formulário com os dados atuais sempre que abrir outro limite ou os dados mudarem
  useEffect(() => {
    if (!limit) return;
    setName(limit.name);
    setCategory(limit.category);
    setCustomCategory('');
    setValue(String(limit.limit));
    setError('');
  }, [limit?.id, limit?.name, limit?.category, limit?.limit]);

  useEffect(() => {
    setSaved(false);
  }, [limit?.id, isOpen]);

  // A categoria atual sempre aparece na lista, mesmo que não esteja entre as padrão
  const options = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    [limit?.category || '', ...categories].forEach((c) => {
      const key = normalize(c);
      if (!key || key === 'outra' || seen.has(key)) return;
      seen.add(key);
      result.push(c);
    });
    return result;
  }, [categories, limit?.category]);

  if (!isOpen || !limit) return null;

  const Icon = limit.icon;
  const status = getLimitStatus(limit.percent, limit.exceeded);

  const finalCategory = (category === 'Outra' ? customCategory : category).trim();
  const numericValue = parseFloat(value);
  const categoryChanged = normalize(finalCategory) !== normalize(limit.category);
  const hasChanges =
    name.trim() !== limit.name || categoryChanged || numericValue !== limit.limit;
  const isValid = name.trim() !== '' && finalCategory !== '' && !isNaN(numericValue) && numericValue > 0;

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || !hasChanges) return;

    setSaving(true);
    setError('');
    setSaved(false);

    try {
      await onUpdateLimit(limit.id, {
        name: name.trim(),
        category: finalCategory,
        limit: numericValue,
      });
      setSaved(true);
    } catch {
      setError('Não foi possível salvar as alterações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-[#5B8FE8]/10 backdrop-blur-2xl"></div>

      <div className="relative w-full max-w-[600px] max-h-[95vh] overflow-y-auto bg-white/75 backdrop-blur-3xl rounded-[32px] p-6 md:p-10 shadow-[0_32px_80px_rgba(91,143,232,0.25),0_0_0_1px_rgba(255,255,255,0.6)_inset] border-2 border-white/70 transition-all duration-300 ease-out">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent rounded-[32px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-[32px] pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-6 bg-gradient-to-b from-[#7BA8F5] to-[#5B8FE8] rounded-full shadow-[0_0_12px_rgba(123,168,245,0.5)]"></div>
              <h2 className="text-[#2E4A7C] font-sans font-semibold text-[24px]">
                Detalhes do Limite
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              title="Fechar"
              className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-xl border-2 border-white/70 hover:bg-white/80 hover:shadow-[0_8px_32px_rgba(123,168,245,0.2),0_2px_12px_rgba(255,255,255,0.6)_inset] transition-all duration-300 flex items-center justify-center group"
            >
              <X size={18} className="text-[#7BA8F5] group-hover:text-[#4A7BD8] transition-colors duration-300" strokeWidth={2.5} />
            </button>
          </div>

          <div className="relative bg-white/60 backdrop-blur-xl rounded-[24px] p-6 md:p-8 mb-8 border-2 border-white/70 shadow-[0_8px_32px_rgba(91,143,232,0.15),0_2px_12px_rgba(255,255,255,0.4)_inset]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-[24px] pointer-events-none"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7BA8F5] to-[#5B8FE8] rounded-full blur-lg opacity-40"></div>
                  <div className="relative w-16 h-16 rounded-full bg-white/60 backdrop-blur-xl flex items-center justify-center border-2 border-white/70 shadow-[0_8px_32px_rgba(123,168,245,0.3),0_2px_8px_rgba(255,255,255,0.4)_inset]">
                    <Icon size={24} className="text-[#4A7BD8]" strokeWidth={2.2} />
                  </div>
                </div>
                <div className="px-6 py-3 rounded-full bg-white/70 backdrop-blur-xl border-2 border-white/70 shadow-[0_4px_20px_rgba(123,168,245,0.25),0_2px_8px_rgba(255,255,255,0.4)_inset]">
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px', color: status.color }}>
                    {Math.round(limit.percent)}%
                  </span>
                </div>
              </div>

              <h3 className="text-[#2E4A7C] mb-1" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '22px', letterSpacing: '-0.3px' }}>
                {limit.name}
              </h3>
              <p className="text-[#7BA8F5] mb-6 text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                {limit.category} · desde {formatDateBR(limit.createdAt)}
              </p>

              <div className="mb-4">
                <div className="h-4 bg-white/50 backdrop-blur-lg rounded-full overflow-hidden border-2 border-white/60 shadow-[0_2px_8px_rgba(91,143,232,0.08)_inset]">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${Math.min(limit.percent, 100)}%`,
                      background: status.gradient,
                      boxShadow: `0 0 24px ${status.glow}`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mb-6 text-sm" style={{ color: status.color, fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>
                {(limit.exceeded || status.level !== 'ok') && <AlertTriangle size={16} strokeWidth={2.5} />}
                {status.label}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-white/60">
                <div>
                  <p className="text-[#7BA8F5] mb-1.5" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', letterSpacing: '0.5px' }}>
                    GASTO
                  </p>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px', color: status.color }}>
                    {formatBRL(limit.spent)}
                  </span>
                </div>
                <div>
                  <p className="text-[#7BA8F5] mb-1.5" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', letterSpacing: '0.5px' }}>
                    LIMITE
                  </p>
                  <span className="text-[#5B8FE8]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px' }}>
                    {formatBRL(limit.limit)}
                  </span>
                </div>
                <div>
                  <p className="text-[#7BA8F5] mb-1.5" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', letterSpacing: '0.5px' }}>
                    {limit.exceeded ? 'EXCEDIDO' : 'RESTANTE'}
                  </p>
                  <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px', color: limit.exceeded ? '#FF6B6B' : '#4A7BD8' }}>
                    {formatBRL(Math.abs(limit.remaining))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="relative bg-white/60 backdrop-blur-xl rounded-[20px] p-6 border-2 border-white/70 shadow-[0_4px_20px_rgba(123,168,245,0.15),0_2px_8px_rgba(255,255,255,0.4)_inset]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-[20px] pointer-events-none"></div>

            <div className="relative z-10">
              <h4 className="text-[#2E4A7C] mb-4" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px' }}>
                Editar limite
              </h4>

              <label htmlFor="edit-limit-name" className="block text-[#2E4A7C] mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px' }}>
                Nome do limite
              </label>
              <input
                id="edit-limit-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={fieldClass}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}
                required
              />

              <label htmlFor="edit-limit-category" className="block text-[#2E4A7C] mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px' }}>
                Categoria
              </label>
              <select
                id="edit-limit-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className={`${fieldClass} appearance-none cursor-pointer`}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}
              >
                {options.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                <option value="Outra">Outra</option>
              </select>

              {category === 'Outra' && (
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Digite o nome da categoria"
                  aria-label="Nome da nova categoria"
                  className={fieldClass}
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}
                  required
                />
              )}

              {categoryChanged && finalCategory !== '' && (
                <p className="mb-4 -mt-2 text-xs text-[#F5A623]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
                  Ao trocar a categoria, o acompanhamento recomeça a partir de hoje.
                </p>
              )}

              <label htmlFor="edit-limit-value" className="block text-[#2E4A7C] mb-2" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '13px' }}>
                Valor do limite (R$)
              </label>
              <input
                id="edit-limit-value"
                type="number"
                step="0.01"
                min="0.01"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className={fieldClass}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}
                required
              />

              {error && (
                <div className="mb-4 rounded-2xl bg-[#FF6B6B]/10 px-4 py-3 text-[#FF6B6B] text-sm">
                  {error}
                </div>
              )}
              {saved && !error && !hasChanges && (
                <div className="mb-4 rounded-2xl bg-[#4A7BD8]/10 px-4 py-3 text-[#4A7BD8] text-sm">
                  Alterações salvas.
                </div>
              )}

              <button
                type="submit"
                disabled={saving || !hasChanges || !isValid}
                className="w-full relative flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#7BA8F5] to-[#5B8FE8] text-white shadow-[0_8px_28px_rgba(123,168,245,0.4)] hover:shadow-[0_10px_32px_rgba(123,168,245,0.5)] hover:translate-y-[-1px] transition-all duration-300 border-2 border-white/30 overflow-hidden group disabled:opacity-50 disabled:hover:translate-y-0"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px' }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Check size={16} strokeWidth={2.5} className="relative" />
                <span className="relative">{saving ? 'Salvando...' : 'Salvar alterações'}</span>
              </button>
            </div>
          </form>

          {onDelete && (
            <button
              type="button"
              onClick={async () => {
                await onDelete(limit.id);
                onClose();
              }}
              className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-[#FF6B6B]/30 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-all"
            >
              <Trash2 size={16} />
              Excluir limite
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
