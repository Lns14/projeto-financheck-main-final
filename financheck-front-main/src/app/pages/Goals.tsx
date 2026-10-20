import { Header } from '../components/ui/Header';
import {
  Target,
  PiggyBank,
  Plus,
  Home as HomeIcon,
  Wallet,
  Plane,
  GraduationCap,
  Heart
} from 'lucide-react';

import { useState, useEffect } from 'react';
import api from "../../services/api";
import { useAuth } from '../context/AuthContext';

import { GoalModal } from '../components/ui/GoalModal';
import { GoalDetailModal } from '../components/ui/GoalDetailModal';

interface Goal {
  id: number;
  name: string;
  current: number;
  target: number;
  icon: React.ComponentType<{
    size?: number;
    className?: string;
    strokeWidth?: number;
  }>;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  'Emergência': Target,
  'Emergencia': Target,
  'Viagem': Plane,
  'Casa': HomeIcon,
  'Poupança': PiggyBank,
  'Poupanca': PiggyBank,
  'Educação': GraduationCap,
  'Educacao': GraduationCap,
  'Saúde': Heart,
  'Saude': Heart,
  'Investimento': Wallet,
};

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { selectedProfile } = useAuth();

  useEffect(() => {
    loadGoals();
  }, [selectedProfile?.id]);

  const loadGoals = async () => {
    if (!selectedProfile) return;

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await api.get('/metas', {
        params: { perfilId: selectedProfile.id }
      });

      const mappedGoals = response.data.map((goal: any) => ({
        id: goal.id,
        name: goal.nome || goal.name || 'Meta',
        category: goal.categoria || goal.category || 'Outra',
        current: Number(goal.valorAcumulado ?? goal.current ?? 0),
        target: Number(goal.valorAlvo ?? goal.target ?? 0),
        icon: iconMap[goal.categoria || goal.category] || Target
      }));

      setGoals(mappedGoals);
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      setErrorMessage('Não foi possível carregar as metas deste perfil.');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (newGoal: any) => {
    if (!selectedProfile) return;

    const prazoDefault = `${new Date().getFullYear()}-12-31`;

    try {
      await api.post('/metas', {
        nome: newGoal.name,
        name: newGoal.name,
        valorAlvo: newGoal.target,
        target: newGoal.target,
        // valor já depositado informado no cadastro
        valorAcumulado: newGoal.current,
        current: newGoal.current,
        prazo: prazoDefault,
        perfilId: selectedProfile.id
      }, {
        params: { perfilId: selectedProfile.id }
      });

      await loadGoals();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao criar meta:', error);
    }
  };

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsDetailModalOpen(true);
  };

  /**
   * GoalDetailModal calcula o novo valor total (atual ± delta) e passa aqui.
   * Comparamos com o valor anterior para saber se é adição ou retirada,
   * e chamamos o endpoint correto: PATCH /metas/{id}/adicionar ou /remover.
   */
  const handleUpdateValue = async (goalId: number, newCurrent: number) => {
    if (!selectedProfile) return;

    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    const diff = newCurrent - goal.current;

    try {
      if (diff > 0) {
        await api.patch(`/metas/${goalId}/adicionar`, null, {
          params: { valor: diff.toFixed(2) }
        });
      } else if (diff < 0) {
        await api.patch(`/metas/${goalId}/remover`, null, {
          params: { valor: Math.abs(diff).toFixed(2) }
        });
      }

      await loadGoals();

      // Atualiza o selectedGoal para o modal refletir imediatamente
      setSelectedGoal(prev =>
        prev && prev.id === goalId ? { ...prev, current: newCurrent } : prev
      );
    } catch (error) {
      console.error('Erro ao atualizar meta:', error);
    }
  };

  const handleDeleteGoal = async (goalId: number) => {
    if (!selectedProfile) return;

    try {
      await api.delete(`/metas/${goalId}`, {
        params: { perfilId: selectedProfile.id }
      });
      await loadGoals();
    } catch (error) {
      console.error('Erro ao excluir meta:', error);
    }
  };

  return (
    <>
      <Header />

      <main className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 pt-6 md:pt-12 pb-24 md:pb-24">

        <div className="mb-8 md:mb-12 flex justify-between items-center">
          <h1 className="text-[#2E4A7C] text-2xl md:text-[32px] font-semibold">
            Metas Financeiras
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-[#5B8FE8] text-white"
          >
            <Plus size={18} />
            Nova meta
          </button>
        </div>

        {errorMessage && (
          <div className="mb-6 rounded-2xl bg-[#FF6B6B]/10 px-4 py-3 text-[#FF6B6B]">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-[#7BA8F5]">
            Carregando metas...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {goals.map((goal) => {
              const Icon = goal.icon;
              const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;

              return (
                <div
                  key={goal.id}
                  onClick={() => handleGoalClick(goal)}
                  className="bg-white rounded-3xl p-8 shadow cursor-pointer"
                >
                  <div className="flex justify-between mb-6">
                    <Icon size={28} className="text-[#4A7BD8]" />
                    <span className="font-bold text-[#4A7BD8]">
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-4">{goal.name}</h3>

                  <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
                    <div
                      className="bg-[#5B8FE8] h-4 rounded-full"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                  <div className="flex justify-between">
                    <span className="font-bold">
                      {goal.current.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span>
                      {goal.target.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <GoalModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleAddGoal}
        />

        <GoalDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          goal={selectedGoal}
          onUpdateValue={handleUpdateValue}
          onDelete={handleDeleteGoal}
        />

      </main>
    </>
  );
}
