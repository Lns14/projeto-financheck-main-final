import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ShoppingBag, Home, Coffee, Smartphone, Plane, Heart, Wallet, CreditCard, ShoppingCart } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from './AuthContext';

type IconComponent = React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;

export interface Transaction {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
  month: number;
  year: number;
  icon: IconComponent;
}

type TransactionInput = {
  name: string;
  category: string;
  amount: number;
  date?: string;
  month?: number;
  year?: number;
};

interface TransactionsContextType {
  transactions: Transaction[];
  loading: boolean;
  errorMessage: string;
  addTransaction: (transaction: TransactionInput) => Promise<void>;
  updateTransaction: (id: number, transaction: TransactionInput) => Promise<void>;
  deleteTransaction: (id: number) => Promise<void>;
  reloadTransactions: () => Promise<void>;
  getTotalBalance: () => number;
  getMonthlyChange: () => number;
  getMonthlyIncome: () => number;
  getMonthlyExpenses: () => number;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(undefined);

export const iconMap: Record<string, IconComponent> = {
  'Alimentacao': ShoppingBag,
  'Alimentação': ShoppingBag,
  'Receita': Home,
  'Lazer': Coffee,
  'Servicos': Smartphone,
  'Serviços': Smartphone,
  'Viagem': Plane,
  'Saude': Heart,
  'Saúde': Heart,
  'Educacao': Wallet,
  'Educação': Wallet,
  'Transporte': CreditCard,
  'Compras': ShoppingCart,
};

const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

function numberFrom(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeTransaction(transaction: any): Transaction {
  const rawDate = transaction.data || transaction.date || transaction.createdAt || new Date().toISOString();
  // Para strings no formato YYYY-MM-DD, parsear localmente para evitar off-by-one de timezone
  let validDate: Date;
  if (typeof rawDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    const [y, m, d] = rawDate.split('-').map(Number);
    validDate = new Date(y, m - 1, d);
  } else {
    const parsedDate = new Date(rawDate);
    validDate = Number.isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }
  const category = transaction.categoria?.nome || transaction.categoria || transaction.category || 'Outra';

  // valor armazenado no banco é sempre positivo; o tipo indica se é receita ou despesa
  const rawValor = numberFrom(transaction.valor ?? transaction.amount);
  const tipo: string = transaction.tipo ?? '';
  const amount = tipo.toUpperCase() === 'DESPESA' ? -Math.abs(rawValor) : Math.abs(rawValor);

  return {
    id: Number(transaction.id),
    name: transaction.nome || transaction.name || transaction.descricao || 'Transacao',
    category,
    amount,
    date: transaction.date || `${validDate.getDate().toString().padStart(2, '0')} ${monthNames[validDate.getMonth()]}`,
    month: transaction.month ?? validDate.getMonth(),
    year: transaction.year ?? validDate.getFullYear(),
    icon: iconMap[category] || Wallet,
  };
}

function toApiPayload(transaction: TransactionInput, perfilId: number) {
  const date = new Date();

  return {
    nome: transaction.name,
    descricao: transaction.name,
    categoria: transaction.category,
    // Envia o valor com sinal; o controller infere RECEITA/DESPESA pelo sinal
    valor: transaction.amount,
    amount: transaction.amount,
    data: date.toISOString().slice(0, 10),
    perfilId,
  };
}

// Retorna inicio=01/01/ano e fim=31/12/ano para buscar todas as transações do ano
function periodoAnoCorrente() {
  const ano = new Date().getFullYear();
  return { inicio: `${ano}-01-01`, fim: `${ano}-12-31` };
}

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const { selectedProfile } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const reloadTransactions = async () => {
    if (!selectedProfile) {
      setTransactions([]);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const { inicio, fim } = periodoAnoCorrente();
      const response = await api.get('/transacoes', {
        params: { perfilId: selectedProfile.id, inicio, fim },
      });

      const data = Array.isArray(response.data) ? response.data : [];
      setTransactions(data.map(normalizeTransaction));
    } catch (error) {
      console.error('Erro ao buscar transacoes:', error);
      setErrorMessage('Nao foi possivel carregar as transacoes deste perfil.');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadTransactions();
  }, [selectedProfile?.id]);

  const addTransaction = async (newTransaction: TransactionInput) => {
    if (!selectedProfile) return;

    await api.post('/transacoes', toApiPayload(newTransaction, selectedProfile.id), {
      params: { perfilId: selectedProfile.id },
    });
    await reloadTransactions();
  };

  const updateTransaction = async (id: number, updatedTransaction: TransactionInput) => {
    if (!selectedProfile) return;

    await api.put(`/transacoes/${id}`, toApiPayload(updatedTransaction, selectedProfile.id), {
      params: { perfilId: selectedProfile.id },
    });
    await reloadTransactions();
  };

  const deleteTransaction = async (id: number) => {
    if (!selectedProfile) return;

    await api.delete(`/transacoes/${id}`, {
      params: { perfilId: selectedProfile.id },
    });
    await reloadTransactions();
  };

  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter(
      (transaction) => transaction.month === now.getMonth() && transaction.year === now.getFullYear()
    );
  }, [transactions]);

  const getTotalBalance = () => {
    return currentMonthTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const getMonthlyIncome = () => {
    return currentMonthTransactions
      .filter((transaction) => transaction.amount > 0)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const getMonthlyExpenses = () => {
    return currentMonthTransactions
      .filter((transaction) => transaction.amount < 0)
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);
  };

  const getMonthlyChange = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    const currentBalance = transactions
      .filter((t) => t.month === currentMonth && t.year === currentYear)
      .reduce((sum, t) => sum + t.amount, 0);

    const previousBalance = transactions
      .filter((t) => t.month === previousMonth && t.year === previousYear)
      .reduce((sum, t) => sum + t.amount, 0);

    if (previousBalance === 0) {
      return currentBalance > 0 ? 100 : currentBalance < 0 ? -100 : 0;
    }

    return ((currentBalance - previousBalance) / Math.abs(previousBalance)) * 100;
  };

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        loading,
        errorMessage,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        reloadTransactions,
        getTotalBalance,
        getMonthlyChange,
        getMonthlyIncome,
        getMonthlyExpenses,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
}
