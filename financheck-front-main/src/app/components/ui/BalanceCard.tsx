import { TrendingUp, TrendingDown } from 'lucide-react';
import { useTransactions } from '@/app/context/TransactionsContext';

export function BalanceCard() {
  const { getTotalBalance, getMonthlyChange } = useTransactions();

  const balance = getTotalBalance();
  const monthlyChange = getMonthlyChange();
  const isPositiveChange = monthlyChange >= 0;
  return (
    <div className="relative overflow-hidden bg-white/70 backdrop-blur-3xl rounded-3xl md:rounded-[32px] px-6 py-8 md:px-20 md:py-20 shadow-[0_20px_60px_rgba(91,143,232,0.15),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:shadow-[0_24px_70px_rgba(91,143,232,0.2),0_0_0_1px_rgba(255,255,255,0.6)_inset] hover:translate-y-[-2px] transition-all duration-500 border-2 border-white/60 group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent rounded-3xl md:rounded-[32px] pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-3xl md:rounded-[32px] pointer-events-none"></div>

      <div className="absolute top-[-50px] right-[-50px] w-[500px] h-[500px] bg-gradient-to-br from-[#7BA8F5]/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-50px] left-[-50px] w-[450px] h-[450px] bg-gradient-to-tr from-[#C5D9F5]/18 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/3 right-1/3 w-[300px] h-[300px] bg-gradient-to-br from-[#94B3E8]/15 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/4 w-[200px] h-[200px] bg-gradient-to-br from-[#5B8FE8]/12 to-transparent rounded-full blur-2xl"></div>

      <svg className="hidden md:block absolute bottom-14 right-20 w-72 h-36 opacity-40" viewBox="0 0 288 144" fill="none">
        <path d="M0 72 Q72 24, 144 48 T288 72" stroke="url(#gradient)" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
        <path d="M0 80 Q72 32, 144 56 T288 80" stroke="url(#gradient2)" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5"/>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7BA8F5" stopOpacity="0.5"/>
            <stop offset="50%" stopColor="#5B8FE8" stopOpacity="0.7"/>
            <stop offset="100%" stopColor="#7BA8F5" stopOpacity="0.3"/>
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#94B3E8" stopOpacity="0.3"/>
            <stop offset="50%" stopColor="#7BA8F5" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#94B3E8" stopOpacity="0.2"/>
          </linearGradient>
        </defs>
      </svg>

      <div className="relative z-10">
        <div className="absolute top-[-8px] left-0 w-24 md:w-44 h-0.5 md:h-1 bg-gradient-to-r from-[#7BA8F5]/80 via-[#5B8FE8]/50 to-transparent rounded-full shadow-[0_0_16px_rgba(123,168,245,0.4)]"></div>

        <div className="flex items-center gap-3 md:gap-4 mb-5 md:mb-9 mt-3 md:mt-4">
          <div className="w-1 md:w-1.5 h-5 md:h-6 bg-gradient-to-b from-[#7BA8F5] to-[#5B8FE8] rounded-full shadow-[0_0_12px_rgba(123,168,245,0.5)]"></div>
          <p className="text-[#5B8FE8] text-[9px] md:text-[11px]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, letterSpacing: '2.5px' }}>SALDO ATUAL</p>
        </div>

        <div className="mb-8 md:mb-14">
          <h1 className="text-[#4A7BD8] mb-5 md:mb-8 transition-all duration-500 text-[42px] md:text-[84px]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '-3.5px', lineHeight: '1', textShadow: '0 4px 24px rgba(74, 123, 216, 0.12)' }}>
            {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
          </h1>
          <div className="flex items-center gap-3 md:gap-4">
            <div className={`w-10 h-10 md:w-12 md:h-12 rounded-full backdrop-blur-xl flex items-center justify-center border-2 shadow-[0_6px_24px_rgba(123,168,245,0.3)] transition-all duration-500 ${
              isPositiveChange
                ? 'bg-white/60 border-white/60'
                : 'bg-[#FF8A8A]/10 border-[#FF8A8A]/30'
            }`}>
              {isPositiveChange ? (
                <TrendingUp size={17} className="text-[#4A7BD8] md:hidden" strokeWidth={2.5} />
              ) : (
                <TrendingDown size={17} className="text-[#FF6B6B] md:hidden" strokeWidth={2.5} />
              )}
              {isPositiveChange ? (
                <TrendingUp size={19} className="text-[#4A7BD8] hidden md:block" strokeWidth={2.5} />
              ) : (
                <TrendingDown size={19} className="text-[#FF6B6B] hidden md:block" strokeWidth={2.5} />
              )}
            </div>
            <span className={`transition-all duration-500 text-sm md:text-base ${isPositiveChange ? 'text-[#4A7BD8]' : 'text-[#FF6B6B]'}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              {isPositiveChange ? '+' : ''}{Math.abs(monthlyChange).toFixed(1)}% este mês
            </span>
          </div>
        </div>

        <div className="flex items-start gap-3 md:gap-4 pt-6 md:pt-11 border-t border-white/50">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-br from-[#7BA8F5] to-[#5B8FE8] mt-1.5 md:mt-2.5 shadow-[0_0_10px_rgba(123,168,245,0.5)]"></div>
          <p className="text-[#4A7BD8]/90 leading-relaxed text-xs md:text-[15px]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, lineHeight: '1.85' }}>
            {isPositiveChange
              ? 'Você está indo bem este mês! Continue mantendo suas despesas controladas.'
              : 'Atenção às suas despesas este mês. Procure manter o equilíbrio financeiro.'}
          </p>
        </div>
      </div>
    </div>
  );
}