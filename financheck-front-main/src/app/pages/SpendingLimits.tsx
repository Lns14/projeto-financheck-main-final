import { Header } from '../components/ui/Header';
import { Plus, Wallet, AlertTriangle } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { useAuth } from '../context/AuthContext';
import { iconMap } from '../context/TransactionsContext';

import { LimitModal } from '../components/ui/LimitModal';
import { LimitDetailModal } from '../components/ui/LimitDetailModal';
import { getLimitStatus, formatBRL, formatDateBR } from '../utils/limitStatus';

interface SpendingLimit {
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
}

// Mesmas categorias do cadastro de transações (TransactionModal), sem "Receita" pois limite é só para gastos
const DEFAULT_CATEGORIES = ['Alimentação', 'Lazer', 'Serviços', 'Viagem', 'Saúde'];

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();

export function SpendingLimits() {
  const [limits, setLimits] = useState<SpendingLimit[]>([]);
  const [userCategories, setUserCategories] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLimitId, setSelectedLimitId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { selectedProfile, user } = useAuth();

  useEffect(() => {
    loadLimits();
    loadCategories();
  }, [selectedProfile?.id]);

  const loadLimits = async () => {
    if (!selectedProfile) return;

    setLoading(true);
    setErrorMessage('');

    try {
      // O backend já devolve o valor gasto: soma das despesas da categoria do limite
      // lançadas no histórico de transações a partir da data de cadastro do limite.
      const response = await api.get('/limites-gasto', {
        params: { perfilId: selectedProfile.id },
      });

      const mapped: SpendingLimit[] = (Array.isArray(response.data) ? response.data : []).map((item: any) => ({
        id: Number(item.id),
        name: item.nome || 'Limite',
        category: item.categoria || 'Outra',
        limit: Number(item.valorLimite ?? 0),
        spent: Number(item.valorGasto ?? 0),
        remaining: Number(item.valorRestante ?? 0),
        percent: Number(item.percentual ?? 0),
        exceeded: Boolean(item.excedido),
        createdAt: item.dataCadastro || '',
        icon: iconMap[item.categoria] || Wallet,
      }));

      setLimits(mapped);
    } catch (error) {
      console.error('Erro ao buscar limites de gasto:', error);
      setErrorMessage('Não foi possível carregar os limites de gastos deste perfil.');
      setLimits([]);
    } finally {
      setLoading(false);
    }
  };

  // Categorias já cadastradas pelo usuário (inclui as criadas via "Outra" nas transações)
  const loadCategories = async () => {
    if (!user) return;

    try {
      const response = await api.get('/categorias', { params: { usuarioId: user.id } });
      const names = (Array.isArray(response.data) ? response.data : [])
        .map((c: any) => String(c.nome || '').trim())
        .filter(Boolean);
      setUserCategories(names);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      setUserCategories([]);
    }
  };

  const categoryOptions = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];

    [...DEFAULT_CATEGORIES, ...userCategories].forEach((name) => {
      const key = normalize(name);
      // "Receita" não faz sentido para limite de gastos e "Outra" já é uma opção fixa do modal
      if (!key || key === 'receita' || key === 'outra' || seen.has(key)) return;
      seen.add(key);
      result.push(name);
    });

    return result;
  }, [userCategories]);

  const handleAddLimit = async (newLimit: { name: string; category: string; limit: number }) => {
    if (!selectedProfile) return;

    try {
      await api.post('/limites-gasto', {
        nome: newLimit.name,
        categoria: newLimit.category,
        valorLimite: newLimit.limit,
        perfilId: selectedProfile.id,
      });

      await Promise.all([loadLimits(), loadCategories()]);
    } catch (error) {
      console.error('Erro ao criar limite de gasto:', error);
      throw error; // o LimitModal exibe o erro e permanece aberto
    }
  };

  const handleUpdateLimit = async (
    limitId: number,
    changes: { name: string; category: string; limit: number }
  ) => {
    try {
      await api.put(`/limites-gasto/${limitId}`, {
        nome: changes.name,
        categoria: changes.category,
        valorLimite: changes.limit,
      });
      await Promise.all([loadLimits(), loadCategories()]);
    } catch (error) {
      console.error('Erro ao atualizar limite de gasto:', error);
      throw error; // o LimitDetailModal exibe o erro
    }
  };

  const handleDeleteLimit = async (limitId: number) => {
    try {
      await api.delete(`/limites-gasto/${limitId}`);
      await loadLimits();
    } catch (error) {
      console.error('Erro ao excluir limite de gasto:', error);
      setErrorMessage('Não foi possível excluir o limite de gastos.');
    }
  };

  // O modal sempre lê o limite atualizado da lista (reflete mudanças após "Atualizar limite")
  const selectedLimit = limits.find((l) => l.id === selectedLimitId) || null;

  return (
    <>
      <Header />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-12 pb-24 md:pb-24">
        <div className="mb-8 md:mb-12 flex justify-between items-center gap-4">
          <h1 className="text-[#2E4A7C] text-2xl md:text-[32px] font-semibold">
            Limite de Gastos
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 md:px-8 md:py-4 rounded-full bg-[#5B8FE8] text-white whitespace-nowrap"
          >
            <Plus size={18} />
            Novo limite
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-2xl bg-[#FF6B6B]/10 px-4 py-3 text-[#FF6B6B]">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-[#7BA8F5]">
            Carregando limites...
          </div>
        ) : limits.length === 0 ? (
          <div className="rounded-3xl bg-white/70 px-6 py-10 text-center text-[#7BA8F5]">
            Nenhum limite de gastos cadastrado para este perfil.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {limits.map((item) => {
              const Icon = item.icon;
              const status = getLimitStatus(item.percent, item.exceeded);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedLimitId(item.id)}
                  className="bg-white rounded-3xl p-8 shadow cursor-pointer"
                >
                  <div className="flex justify-between mb-6">
                    <Icon size={28} className="text-[#4A7BD8]" />
                    <span className="font-bold" style={{ color: status.color }}>
                      {Math.round(item.percent)}%
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-1">{item.name}</h3>
                  <p className="text-sm text-[#7BA8F5] mb-4">
                    {item.category} · desde {formatDateBR(item.createdAt)}
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                    <div
                      className="h-4 rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(item.percent, 100)}%`,
                        background: status.gradient,
                      }}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 mb-5 text-sm font-semibold" style={{ color: status.color }}>
                    {status.level !== 'ok' && <AlertTriangle size={14} strokeWidth={2.5} />}
                    {status.level === 'exceeded'
                      ? `Excedeu ${formatBRL(Math.abs(item.remaining))}`
                      : `Restam ${formatBRL(item.remaining)}`}
                  </div>

                  <div className="flex justify-between">
                    <span className="font-bold" style={{ color: status.level === 'ok' ? undefined : status.color }}>
                      {formatBRL(item.spent)}
                    </span>
                    <span>{formatBRL(item.limit)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <LimitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          categories={categoryOptions}
          onSubmit={handleAddLimit}
        />

        <LimitDetailModal
          isOpen={selectedLimitId !== null && selectedLimit !== null}
          onClose={() => setSelectedLimitId(null)}
          limit={selectedLimit}
          categories={categoryOptions}
          onUpdateLimit={handleUpdateLimit}
          onDelete={handleDeleteLimit}
        />
      </main>
    </>
  );
}
