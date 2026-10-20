import { Target, PiggyBank, ChevronRight } from 'lucide-react';
import { Link } from 'react-router';
import { useEffect, useState } from 'react';
import { GoalDetailModal } from './GoalDetailModal';
import api from '../../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Goal {
  id: number;
  name: string;
  current: number;
  target: number;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
}

export function GoalsGrid() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { selectedProfile } = useAuth();

  useEffect(() => {
    loadGoals();
  }, [selectedProfile?.id]);

  const loadGoals = async () => {
    if (!selectedProfile) {
      setGoals([]);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const response = await api.get('/metas', {
        params: { perfilId: selectedProfile.id },
      });

      const mappedGoals = (Array.isArray(response.data) ? response.data : []).map((goal: any) => {
        const category = goal.category || goal.categoria || '';

        return {
          id: Number(goal.id),
          name: goal.name || goal.nome || goal.descricao || 'Meta',
          current: Number(goal.current ?? goal.valorAtual ?? goal.progresso ?? 0),
          target: Number(goal.target ?? goal.valorMeta ?? goal.valorAlvo ?? 0),
          icon: category === 'Viagem' ? PiggyBank : Target,
        };
      });

      setGoals(mappedGoals.slice(0, 2));
    } catch (error) {
      console.error('Erro ao buscar metas:', error);
      setErrorMessage('Nao foi possivel carregar as metas.');
      setGoals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGoalClick = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsModalOpen(true);
  };

  const handleUpdateValue = async (goalId: number, newCurrent: number) => {
    if (!selectedProfile) return;

    await api.put(`/metas/${goalId}`, {
      current: newCurrent,
      valorAtual: newCurrent,
      perfilId: selectedProfile.id,
    }, {
      params: { perfilId: selectedProfile.id },
    });

    await loadGoals();
    setSelectedGoal(prev => prev && prev.id === goalId ? { ...prev, current: newCurrent } : prev);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 md:gap-4">
          <div className="w-1 md:w-1.5 h-5 md:h-6 bg-gradient-to-b from-[#7BA8F5] to-[#5B8FE8] rounded-full shadow-[0_0_12px_rgba(123,168,245,0.5)]"></div>
          <h2 className="text-[#2E4A7C] text-xl md:text-2xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}>Metas financeiras</h2>
        </div>
        <Link
          to="/metas"
          className="hidden sm:flex items-center gap-1.5 px-4 md:px-5 py-2 md:py-2.5 rounded-full text-[#7BA8F5] hover:text-[#4A7BD8] hover:bg-white/60 hover:backdrop-blur-xl hover:border-white/70 hover:shadow-[0_4px_20px_rgba(123,168,245,0.15),0_1px_4px_rgba(255,255,255,0.4)_inset] transition-all duration-300 group border-2 border-transparent text-xs md:text-sm"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
        >
          Ver mais
          <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-300 md:hidden" strokeWidth={2.5} />
          <ChevronRight size={16} className="hidden md:block group-hover:translate-x-0.5 transition-transform duration-300" strokeWidth={2.5} />
        </Link>
      </div>

      {errorMessage && (
        <div className="rounded-2xl bg-[#FF6B6B]/10 px-4 py-3 text-[#FF6B6B] text-sm">
          {errorMessage}
        </div>
      )}

      {loading ? (
        <div className="py-10 text-center text-[#7BA8F5]">
          Carregando metas...
        </div>
      ) : goals.length === 0 ? (
        <div className="rounded-3xl bg-white/70 px-6 py-10 text-center text-[#7BA8F5]">
          Nenhuma meta cadastrada para este perfil.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10">
          {goals.map((goal) => {
            const Icon = goal.icon;
            const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;

            return (
              <div
                key={goal.id}
                onClick={() => handleGoalClick(goal)}
                className="relative bg-white/70 backdrop-blur-3xl rounded-3xl md:rounded-[32px] px-6 py-7 md:px-12 md:py-11 shadow-[0_20px_60px_rgba(91,143,232,0.15),0_0_0_1px_rgba(255,255,255,0.5)_inset] hover:shadow-[0_24px_70px_rgba(91,143,232,0.2),0_0_0_1px_rgba(255,255,255,0.6)_inset] hover:translate-y-[-3px] transition-all duration-500 border-2 border-white/60 cursor-pointer group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/20 to-transparent rounded-3xl md:rounded-[32px] pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6 md:mb-9">
                    <div className="relative w-14 h-14 md:w-[68px] md:h-[68px] rounded-full bg-white/60 backdrop-blur-xl flex items-center justify-center border-2 border-white/70 shadow-[0_8px_32px_rgba(123,168,245,0.3),0_2px_8px_rgba(255,255,255,0.4)_inset]">
                      <Icon size={24} className="text-[#4A7BD8]" strokeWidth={2.2} />
                    </div>
                    <div className="px-4 py-2 md:px-6 md:py-3 rounded-full bg-white/70 backdrop-blur-xl border-2 border-white/70 shadow-[0_4px_20px_rgba(123,168,245,0.25),0_2px_8px_rgba(255,255,255,0.4)_inset]">
                      <span className="text-[#4A7BD8] text-sm md:text-[15px]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
                        {Math.round(progress)}%
                      </span>
                    </div>
                  </div>

                  <h3 className="text-[#2E4A7C] mb-5 md:mb-8 text-lg md:text-[21px]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, lineHeight: '1.3', letterSpacing: '-0.3px' }}>
                    {goal.name}
                  </h3>

                  <div className="mb-5 md:mb-8 h-3 md:h-4 bg-white/50 backdrop-blur-lg rounded-full overflow-hidden border-2 border-white/60 shadow-[0_2px_8px_rgba(91,143,232,0.08)_inset]">
                    <div
                      className="h-full bg-gradient-to-r from-[#7BA8F5] via-[#6BA2EE] to-[#5B8FE8] rounded-full transition-all duration-700 ease-out shadow-[0_0_24px_rgba(123,168,245,0.65)]"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-baseline justify-between pt-5 md:pt-7 border-t-2 border-white/60">
                    <span className="text-[#2E4A7C] text-lg md:text-[22px]" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, letterSpacing: '-0.7px' }}>
                      {goal.current.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                    <span className="text-[#5B8FE8] text-xs md:text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, letterSpacing: '-0.2px' }}>
                      {goal.target.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <GoalDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        goal={selectedGoal}
        onUpdateValue={handleUpdateValue}
      />
    </div>
  );
}
