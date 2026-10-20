import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface GoalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  goal: {
    id: number;
    name: string;
    current: number;
    target: number;
    icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  } | null;
  onUpdateValue: (goalId: number, newCurrent: number) => void | Promise<void>;
  onDelete?: (goalId: number) => void | Promise<void>;
}

export function GoalDetailModal({ isOpen, onClose, goal, onUpdateValue, onDelete }: GoalDetailModalProps) {
  const [addAmount, setAddAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  if (!isOpen || !goal) return null;

  const Icon = goal.icon;
  const progress = (goal.current / goal.target) * 100;
  const remaining = goal.target - goal.current;

  const handleAddValue = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(addAmount);
    if (!isNaN(amount) && amount > 0) {
      const newCurrent = Math.min(goal.current + amount, goal.target);
      await onUpdateValue(goal.id, newCurrent);
      setAddAmount('');
    }
  };

  const handleWithdrawValue = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawAmount);
    if (!isNaN(amount) && amount > 0) {
      const newCurrent = Math.max(goal.current - amount, 0);
      await onUpdateValue(goal.id, newCurrent);
      setWithdrawAmount('');
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

      <div className="relative w-full max-w-[600px] bg-white/75 backdrop-blur-3xl rounded-[32px] p-10 shadow-[0_32px_80px_rgba(91,143,232,0.25),0_0_0_1px_rgba(255,255,255,0.6)_inset] border-2 border-white/70 transition-all duration-300 ease-out">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent rounded-[32px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-[32px]"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-6 bg-gradient-to-b from-[#7BA8F5] to-[#5B8FE8] rounded-full shadow-[0_0_12px_rgba(123,168,245,0.5)]"></div>
              <h2 className="text-[#2E4A7C] font-sans font-semibold text-[24px]">
                Detalhes da Meta
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

          <div className="relative bg-white/60 backdrop-blur-xl rounded-[24px] p-8 mb-8 border-2 border-white/70 shadow-[0_8px_32px_rgba(91,143,232,0.15),0_2px_12px_rgba(255,255,255,0.4)_inset]">
            <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-[24px]"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#7BA8F5] to-[#5B8FE8] rounded-full blur-lg opacity-40"></div>
                  <div className="relative w-16 h-16 rounded-full bg-white/60 backdrop-blur-xl flex items-center justify-center border-2 border-white/70 shadow-[0_8px_32px_rgba(123,168,245,0.3),0_2px_8px_rgba(255,255,255,0.4)_inset]">
                    <Icon size={24} className="text-[#4A7BD8]" strokeWidth={2.2} />
                  </div>
                </div>
                <div className="px-6 py-3 rounded-full bg-white/70 backdrop-blur-xl border-2 border-white/70 shadow-[0_4px_20px_rgba(123,168,245,0.25),0_2px_8px_rgba(255,255,255,0.4)_inset]">
                  <span className="text-[#4A7BD8]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '16px' }}>
                    {Math.round(progress)}%
                  </span>
                </div>
              </div>

              <h3 className="text-[#2E4A7C] mb-6" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '22px', letterSpacing: '-0.3px' }}>
                {goal.name}
              </h3>

              <div className="mb-6">
                <div className="h-4 bg-white/50 backdrop-blur-lg rounded-full overflow-hidden border-2 border-white/60 shadow-[0_2px_8px_rgba(91,143,232,0.08)_inset]">
                  <div
                    className="h-full bg-gradient-to-r from-[#7BA8F5] via-[#6BA2EE] to-[#5B8FE8] rounded-full transition-all duration-700 ease-out shadow-[0_0_24px_rgba(123,168,245,0.65)] relative overflow-hidden"
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/35 via-white/45 to-transparent rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-white/25 to-transparent rounded-full"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full animate-pulse" style={{ animationDuration: '3s' }}></div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-white/60">
                <div>
                  <p className="text-[#7BA8F5] mb-1.5" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', letterSpacing: '0.5px' }}>
                    ATUAL
                  </p>
                  <span className="text-[#2E4A7C]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px' }}>
                    {goal.current.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div>
                  <p className="text-[#7BA8F5] mb-1.5" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', letterSpacing: '0.5px' }}>
                    META
                  </p>
                  <span className="text-[#5B8FE8]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px' }}>
                    {goal.target.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
                <div>
                  <p className="text-[#7BA8F5] mb-1.5" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '12px', letterSpacing: '0.5px' }}>
                    FALTAM
                  </p>
                  <span className="text-[#4A7BD8]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.5px' }}>
                    {remaining.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <form onSubmit={handleAddValue} className="relative bg-white/60 backdrop-blur-xl rounded-[20px] p-6 border-2 border-white/70 shadow-[0_4px_20px_rgba(123,168,245,0.15),0_2px_8px_rgba(255,255,255,0.4)_inset]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-[20px]"></div>

              <div className="relative z-10">
                <label className="block text-[#2E4A7C] mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px' }}>
                  Adicionar valor
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-4 py-3 mb-4 rounded-[16px] bg-white/60 backdrop-blur-xl border-2 border-white/70 text-[#2E4A7C] placeholder:text-[#7BA8F5]/50 focus:border-[#7BA8F5] focus:outline-none focus:shadow-[0_8px_32px_rgba(123,168,245,0.2),0_2px_12px_rgba(255,255,255,0.6)_inset] transition-all duration-300"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}
                />
                <button
                  type="submit"
                  className="w-full relative flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#7BA8F5] to-[#5B8FE8] text-white shadow-[0_8px_28px_rgba(123,168,245,0.4)] hover:shadow-[0_10px_32px_rgba(123,168,245,0.5)] hover:translate-y-[-1px] transition-all duration-300 border-2 border-white/30 overflow-hidden group"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px' }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/30 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Plus size={16} strokeWidth={2.5} className="relative" />
                  <span className="relative">Adicionar</span>
                </button>
              </div>
            </form>

            <form onSubmit={handleWithdrawValue} className="relative bg-white/60 backdrop-blur-xl rounded-[20px] p-6 border-2 border-white/70 shadow-[0_4px_20px_rgba(123,168,245,0.15),0_2px_8px_rgba(255,255,255,0.4)_inset]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-[20px]"></div>

              <div className="relative z-10">
                <label className="block text-[#2E4A7C] mb-3" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '14px' }}>
                  Retirar valor
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-4 py-3 mb-4 rounded-[16px] bg-white/60 backdrop-blur-xl border-2 border-white/70 text-[#2E4A7C] placeholder:text-[#7BA8F5]/50 focus:border-[#7BA8F5] focus:outline-none focus:shadow-[0_8px_32px_rgba(123,168,245,0.2),0_2px_12px_rgba(255,255,255,0.6)_inset] transition-all duration-300"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}
                />
                <button
                  type="submit"
                  className="w-full relative flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-white/70 backdrop-blur-xl text-[#5B8FE8] border-2 border-white/70 shadow-[0_4px_20px_rgba(123,168,245,0.15),0_2px_8px_rgba(255,255,255,0.4)_inset] hover:bg-white/80 hover:shadow-[0_8px_28px_rgba(123,168,245,0.2),0_2px_12px_rgba(255,255,255,0.6)_inset] hover:translate-y-[-1px] transition-all duration-300 group"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '13px' }}
                >
                  <Minus size={16} strokeWidth={2.5} className="relative" />
                  <span className="relative">Retirar</span>
                </button>
              </div>
            </form>
          </div>

          {onDelete && (
            <button
              type="button"
              onClick={async () => {
                await onDelete(goal.id);
                onClose();
              }}
              className="mt-5 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-[#FF6B6B]/30 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-all"
            >
              <Trash2 size={16} />
              Excluir meta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
