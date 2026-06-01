import { Header } from '../components/ui/Header';
import { BalanceCard } from '../components/ui/BalanceCard';
import { TransactionsList } from '../components/ui/TransactionsList';
import { useTransactions } from '../context/TransactionsContext';
import { useAuth } from '../context/AuthContext';

export function Dashboard() {
  const { getMonthlyIncome, getMonthlyExpenses } = useTransactions();
  const { selectedProfile } = useAuth();

  return (
    <>
      <Header />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-12 pb-24 md:pb-24 space-y-6 md:space-y-12">
        <div className="flex flex-col gap-1">
          <p className="text-[#7BA8F5] text-sm">Perfil selecionado</p>
          <h1 className="text-[#2E4A7C] text-2xl md:text-[32px] font-semibold">
            {selectedProfile?.nome}
          </h1>
        </div>

        <BalanceCard />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/70 rounded-3xl px-6 py-5 border-2 border-white/60 shadow">
            <p className="text-[#7BA8F5] text-sm mb-2">Receitas do mês</p>
            <strong className="text-[#4A7BD8] text-2xl">
              {getMonthlyIncome().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </strong>
          </div>

          <div className="bg-white/70 rounded-3xl px-6 py-5 border-2 border-white/60 shadow">
            <p className="text-[#7BA8F5] text-sm mb-2">Despesas do mês</p>
            <strong className="text-[#FF6B6B] text-2xl">
              {getMonthlyExpenses().toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </strong>
          </div>
        </div>

        <TransactionsList />
      </main>
    </>
  );
}
