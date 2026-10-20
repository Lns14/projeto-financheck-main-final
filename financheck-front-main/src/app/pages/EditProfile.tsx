import { Header } from '../components/ui/Header';
import { Save, Trash2 } from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import api from '../../services/api';
import { useAuth } from '../context/AuthContext';

interface UserData {
  nome: string;
  email: string;
}

export function EditProfile() {
  const navigate = useNavigate();
  const { user, login, logout } = useAuth();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState<UserData>({
    nome: '',
    email: '',
  });

  // Pré-preenche o form com os dados que já estão no AuthContext
  useEffect(() => {
    if (!user) return;
    setFormData({
      nome: user.nome || '',
      email: user.email || '',
    });
  }, [user]);

  const handleChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const response = await api.put(`/usuarios/${user.id}`, {
        nome: formData.nome,
        email: formData.email,
      });

      // Atualiza o AuthContext com os dados novos para refletir na tela
      await login({
        ...user,
        nome: response.data.nome ?? formData.nome,
        email: response.data.email ?? formData.email,
      });

      alert('Perfil salvo com sucesso');
      navigate('/perfil');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      await api.delete(`/usuarios/${user.id}`);
      alert('Conta excluída com sucesso');
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert('Erro ao excluir conta');
    }
  };

  return (
    <>
      <Header />

      <main className="max-w-[1280px] mx-auto px-8 pt-12 pb-24">
        <div className="mb-12">
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-8 bg-gradient-to-b from-[#7BA8F5] to-[#5B8FE8] rounded-full shadow-[0_0_12px_rgba(123,168,245,0.5)]" />
            <h1
              className="text-[#2E4A7C]"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '32px', letterSpacing: '-0.5px' }}
            >
              Editar Perfil
            </h1>
          </div>
        </div>

        <div className="relative bg-white/70 backdrop-blur-3xl rounded-[32px] px-12 py-10 shadow-[0_20px_60px_rgba(91,143,232,0.15)] border-2 border-white/60 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label htmlFor="nome" className="block text-[#2E4A7C] mb-3 font-medium">
                Nome completo
              </label>
              <input
                id="nome"
                type="text"
                value={formData.nome}
                onChange={e => handleChange('nome', e.target.value)}
                className="w-full px-5 py-4 rounded-[18px] bg-white/60 backdrop-blur-xl border-2 border-white/70 text-[#2E4A7C] focus:border-[#7BA8F5] focus:outline-none transition-all duration-300"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[#2E4A7C] mb-3 font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={e => handleChange('email', e.target.value)}
                className="w-full px-5 py-4 rounded-[18px] bg-white/60 backdrop-blur-xl border-2 border-white/70 text-[#2E4A7C] focus:border-[#7BA8F5] focus:outline-none transition-all duration-300"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#7BA8F5] to-[#5B8FE8] text-white shadow-[0_12px_40px_rgba(123,168,245,0.45)] hover:scale-[1.02] transition-all duration-300 disabled:opacity-60"
            >
              <Save size={18} />
              <span>{loading ? 'Salvando...' : 'Salvar alterações'}</span>
            </button>
          </form>
        </div>

        <div className="rounded-[32px] px-12 py-10 border-2 border-[#FF6B6B]/30 bg-white/60 backdrop-blur-2xl">
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-8 py-4 rounded-full border-2 border-[#FF6B6B]/40 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-all"
            >
              <Trash2 size={18} />
              Excluir minha conta
            </button>
          ) : (
            <div className="space-y-4">
              <p className="text-[#FF6B6B] font-medium">
                Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleDeleteAccount}
                  className="flex-1 px-6 py-3 rounded-full bg-[#FF6B6B] text-white hover:opacity-90"
                >
                  Sim, excluir
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-3 rounded-full border-2 border-white/70 text-[#2E4A7C]"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
