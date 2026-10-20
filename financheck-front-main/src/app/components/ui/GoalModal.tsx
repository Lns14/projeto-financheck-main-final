import { X, Check } from 'lucide-react';
import { useState } from 'react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: {
    name: string;
    category: string;
    current: number;
    target: number;
  }) => void | Promise<void>;
}

const categories = [
  'Emergência',
  'Viagem',
  'Casa',
  'Poupança',
  'Educação',
  'Saúde',
  'Investimento',
  'Outra'
];

export function GoalModal({ isOpen, onClose, onSubmit }: GoalModalProps) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [current, setCurrent] = useState('');
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalCategory = category === 'Outra' ? customCategory : category;
    const numericCurrent = parseFloat(current);
    const numericTarget = parseFloat(target);

    if (!name || !finalCategory || isNaN(numericCurrent) || isNaN(numericTarget)) return;

    setLoading(true);

    try {
      await onSubmit({
        name,
        category: finalCategory,
        current: numericCurrent,
        target: numericTarget
      });

      setName('');
      setCategory('');
      setCustomCategory('');
      setCurrent('');
      setTarget('');
      onClose();
    } finally {
      setLoading(false);
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

      <div className="relative w-full max-w-[520px] bg-white/75 backdrop-blur-3xl rounded-[32px] p-10 shadow-[0_32px_80px_rgba(91,143,232,0.25),0_0_0_1px_rgba(255,255,255,0.6)_inset] border-2 border-white/70 transition-all duration-300 ease-out">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent rounded-[32px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-[32px]"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-6 bg-gradient-to-b from-[#7BA8F5] to-[#5B8FE8] rounded-full shadow-[0_0_12px_rgba(123,168,245,0.5)]"></div>
              <h2 className="text-[#2E4A7C]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '24px' }}>
                Nova Meta
              </h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Fechar modal"
              title="Fechar"
              className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-xl border-2 border-white/70 hover:bg-white/80 hover:shadow-[0_8px_32px_rgba(123,168,245,0.2),0_2px_12px_rgba(255,255,255,0.6)_inset] transition-all duration-300 flex items-center justify-center group"
            >
              <X size={18} className="text-[#7BA8F5] group-hover:text-[#4A7BD8] transition-colors duration-300" strokeWidth={2.5} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[#2E4A7C] mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}>
                Nome da meta
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Fundo de Emergência"
                className="w-full px-5 py-4 rounded-[18px] bg-white/60 backdrop-blur-xl border-2 border-white/70 text-[#2E4A7C] placeholder:text-[#7BA8F5]/50 focus:border-[#7BA8F5] focus:outline-none focus:shadow-[0_8px_32px_rgba(123,168,245,0.2),0_2px_12px_rgba(255,255,255,0.6)_inset] transition-all duration-300"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '15px' }}
                required
              />
            </div>

            <div>
              <label htmlFor="goal-category" className="block text-[#2E4A7C] mb-3 font-sans font-medium text-[14px]">
                Categoria
              </label>
              <select
                id="goal-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-5 py-4 rounded-[18px] bg-white/60 backdrop-blur-xl border-2 border-white/70 text-[#2E4A7C] focus:border-[#7BA8F5] focus:outline-none focus:shadow-[0_8px_32px_rgba(123,168,245,0.2),0_2px_12px_rgba(255,255,255,0.6)_inset] transition-all duration-300 appearance-none cursor-pointer"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {category === 'Outra' && (
              <div className="transition-all duration-300 ease-out">
                <label className="block text-[#2E4A7C] mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}>
                  Nome da categoria
                </label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  placeholder="Digite a nova categoria"
                  className="w-full px-5 py-4 rounded-[18px] bg-white/60 backdrop-blur-xl border-2 border-white/70 text-[#2E4A7C] placeholder:text-[#7BA8F5]/50 focus:border-[#7BA8F5] focus:outline-none focus:shadow-[0_8px_32px_rgba(123,168,245,0.2),0_2px_12px_rgba(255,255,255,0.6)_inset] transition-all duration-300"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '15px' }}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-[#2E4A7C] mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}>
                Valor atual (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                placeholder="0,00"
                className="w-full px-5 py-4 rounded-[18px] bg-white/60 backdrop-blur-xl border-2 border-white/70 text-[#2E4A7C] placeholder:text-[#7BA8F5]/50 focus:border-[#7BA8F5] focus:outline-none focus:shadow-[0_8px_32px_rgba(123,168,245,0.2),0_2px_12px_rgba(255,255,255,0.6)_inset] transition-all duration-300"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '15px' }}
                required
              />
            </div>

            <div>
              <label className="block text-[#2E4A7C] mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}>
                Valor da meta (R$)
              </label>
              <input
                type="number"
                step="0.01"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="0,00"
                className="w-full px-5 py-4 rounded-[18px] bg-white/60 backdrop-blur-xl border-2 border-white/70 text-[#2E4A7C] placeholder:text-[#7BA8F5]/50 focus:border-[#7BA8F5] focus:outline-none focus:shadow-[0_8px_32px_rgba(123,168,245,0.2),0_2px_12px_rgba(255,255,255,0.6)_inset] transition-all duration-300"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '15px' }}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="relative w-full flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#7BA8F5] to-[#5B8FE8] text-white shadow-[0_10px_36px_rgba(123,168,245,0.45)] hover:shadow-[0_14px_48px_rgba(123,168,245,0.55)] hover:translate-y-[-2px] hover:scale-[1.02] transition-all duration-300 border-2 border-white/30 overflow-hidden group"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '15px' }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Check size={18} strokeWidth={2.5} className="relative" />
              <span className="relative">{loading ? 'Salvando...' : 'Criar Meta'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
