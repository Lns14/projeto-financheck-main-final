import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock, LogIn } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      const response = await api.post('/usuarios/login', { email, senha: password });
      await login(response.data);

      // Se controle familiar ativado → selecionar perfil; senão → dashboard direto
      if (response.data.controleFamiliar) {
        navigate('/selecionar-perfil');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Email ou senha inválidos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative overflow-hidden flex items-center justify-center"
      style={{
        fontFamily: 'Inter, sans-serif',
        background: 'linear-gradient(160deg,#E5EEFB 0%,#F5F9FF 30%,#FAFCFF 60%,#E8F1FC 100%)',
      }}
    >
      <div className="relative z-10 w-full max-w-[460px] px-6">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-[#5B8FE8] flex items-center justify-center">
              <span className="text-white text-2xl font-semibold">F</span>
            </div>
          </div>
          <h1 className="text-[#2E4A7C] text-3xl font-semibold mb-2">Bem-vindo!</h1>
          <p className="text-[#7BA8F5]">Entre para gerenciar suas finanças</p>
        </div>

        <div className="bg-white rounded-[32px] px-10 py-10 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-3">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7BA8F5]" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full pl-12 pr-5 py-4 rounded-[18px] border-2"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block mb-3">Senha</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7BA8F5]" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-5 py-4 rounded-[18px] border-2"
                  required
                />
              </div>
            </div>

            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-8 py-4 mt-8 rounded-full bg-[#5B8FE8] text-white"
            >
              <LogIn size={20} />
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-[#7BA8F5]">
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="text-[#4A7BD8] font-semibold">
                Criar conta
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center text-[#7BA8F5]/70 text-sm">
          Finance • Gestão Financeira Pessoal
        </div>
      </div>
    </div>
  );
}
