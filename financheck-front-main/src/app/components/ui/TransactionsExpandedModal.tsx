import { X } from 'lucide-react';

interface Transaction {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
  month: number;
  year: number;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}

interface TransactionsExpandedModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export function TransactionsExpandedModal({ isOpen, onClose, transactions }: TransactionsExpandedModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const totalIncome = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-[#5B8FE8]/10 backdrop-blur-2xl"></div>

      <div className="relative w-full max-w-[780px] max-h-[85vh] bg-white/75 backdrop-blur-3xl rounded-[32px] shadow-[0_32px_80px_rgba(91,143,232,0.25),0_0_0_1px_rgba(255,255,255,0.6)_inset] border-2 border-white/70 transition-all duration-300 ease-out flex flex-col">
        <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent rounded-[32px] pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent rounded-[32px] pointer-events-none"></div>

        <div className="relative z-10 flex-shrink-0 px-10 pt-10 pb-6 border-b-2 border-white/60">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-1.5 h-6 bg-gradient-to-b from-[#7BA8F5] to-[#5B8FE8] rounded-full shadow-[0_0_12px_rgba(123,168,245,0.5)]"></div>
              <h2 className="text-[#2E4A7C]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '26px' }}>
                Todas as Transações
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

          <div className="grid grid-cols-2 gap-4">
            <div className="relative bg-white/60 backdrop-blur-xl rounded-[20px] px-6 py-4 border-2 border-white/70 shadow-[0_4px_20px_rgba(123,168,245,0.15),0_2px_8px_rgba(255,255,255,0.4)_inset]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-[20px]"></div>
              <p className="relative text-[#7BA8F5] mb-1.5" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '12px', letterSpacing: '1px' }}>RECEITAS</p>
              <p className="relative text-[#4A7BD8]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px' }}>
                {totalIncome.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>

            <div className="relative bg-white/60 backdrop-blur-xl rounded-[20px] px-6 py-4 border-2 border-white/70 shadow-[0_4px_20px_rgba(123,168,245,0.15),0_2px_8px_rgba(255,255,255,0.4)_inset]">
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-[20px]"></div>
              <p className="relative text-[#7BA8F5] mb-1.5" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '12px', letterSpacing: '1px' }}>DESPESAS</p>
              <p className="relative text-[#2E4A7C]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px' }}>
                {totalExpenses.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex-1 overflow-y-auto px-10 py-6">
          <div className="space-y-3">
            {transactions.map((transaction) => {
              const Icon = transaction.icon;
              const isPositive = transaction.amount > 0;

              return (
                <div
                  key={transaction.id}
                  className="group relative flex items-center justify-between px-6 py-5 rounded-[20px] hover:bg-white/60 hover:backdrop-blur-2xl transition-all duration-300 border-2 border-transparent hover:border-white/70 hover:shadow-[0_8px_28px_rgba(123,168,245,0.15),0_2px_8px_rgba(255,255,255,0.5)_inset]"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 rounded-[20px] transition-opacity duration-300"></div>

                  <div className="relative flex items-center gap-5">
                    <div className="relative">
                      <div className={`absolute inset-0 rounded-full blur-lg opacity-0 group-hover:opacity-40 transition-opacity duration-300 ${
                        isPositive
                          ? 'bg-gradient-to-br from-[#7BA8F5] to-[#5B8FE8]'
                          : 'bg-gradient-to-br from-[#C5D9F5] to-[#E5EEFB]'
                      }`}></div>
                      <div className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-xl group-hover:scale-105 ${
                        isPositive
                          ? 'bg-white/60 border-2 border-white/70 shadow-[0_6px_24px_rgba(123,168,245,0.25),0_2px_8px_rgba(255,255,255,0.4)_inset]'
                          : 'bg-white/60 border-2 border-white/70 shadow-[0_6px_24px_rgba(197,217,245,0.25),0_2px_8px_rgba(255,255,255,0.4)_inset]'
                      }`}>
                        <Icon size={20} className={isPositive ? 'text-[#4A7BD8]' : 'text-[#5B8FE8]'} strokeWidth={2.5} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[#2E4A7C] mb-1.5" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '16px', lineHeight: '1.3' }}>
                        {transaction.name}
                      </p>
                      <p className="text-[#7BA8F5]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', opacity: 0.85 }}>
                        {transaction.category}
                      </p>
                    </div>
                  </div>

                  <div className="relative text-right">
                    <p className={`mb-1.5 ${isPositive ? 'text-[#4A7BD8]' : 'text-[#2E4A7C]'}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '18px', letterSpacing: '-0.6px' }}>
                      {isPositive ? '+' : ''}{transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <p className="text-[#7BA8F5]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: '13px', opacity: 0.9 }}>
                      {transaction.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 flex-shrink-0 px-10 py-6 border-t-2 border-white/60">
          <div className="flex items-center justify-between">
            <p className="text-[#7BA8F5]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}>
              Total de {transactions.length} transações
            </p>
            <button
              onClick={onClose}
              className="px-6 py-3 rounded-full bg-white/60 backdrop-blur-xl border-2 border-white/70 text-[#7BA8F5] hover:text-[#4A7BD8] hover:bg-white/80 hover:shadow-[0_8px_32px_rgba(123,168,245,0.2),0_2px_12px_rgba(255,255,255,0.6)_inset] transition-all duration-300"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
