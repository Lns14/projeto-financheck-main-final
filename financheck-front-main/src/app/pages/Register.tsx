import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { Mail, Lock, User, UserPlus, Eye, EyeOff } from 'lucide-react';
import api from '../../services/api';

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  controleFamiliar: boolean;
};

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    controleFamiliar: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: keyof FormData, value: string | boolean): string => {
    if (name === 'controleFamiliar') return '';
    if (typeof value !== 'string') return '';

    switch (name) {
      case 'name':
        if (!value.trim()) return 'Nome obrigatório';
        if (value.length < 3) return 'Mínimo 3 caracteres';
        return '';
      case 'email':
        if (!value.trim()) return 'Email obrigatório';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email inválido';
        return '';
      case 'password':
        if (!value) return 'Senha obrigatória';
        if (value.length < 6) return 'Mínimo 6 caracteres';
        return '';
      case 'confirmPassword':
        if (!value) return 'Confirmação obrigatória';
        if (value !== formData.password) return 'As senhas não coincidem';
        return '';
      default:
        return '';
    }
  };

  const handleChange = (name: keyof FormData, value: string | boolean) => {
    const updated = { ...formData, [name]: value };
    setFormData(updated);
    if (touched[name]) {
      setErrors(prev => ({ ...prev, [name]: validateField(name, value) }));
    }
    // Revalidar confirmPassword quando a senha muda
    if (name === 'password' && touched['confirmPassword']) {
      setErrors(prev => ({
        ...prev,
        confirmPassword: updated.confirmPassword !== value ? 'As senhas não coincidem' : '',
      }));
    }
  };

  const handleBlur = (name: keyof FormData) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({ ...prev, [name]: validateField(name, formData[name]) }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    (Object.keys(formData) as (keyof FormData)[]).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post('/usuarios/cadastro', {
        nome: formData.name,
        email: formData.email,
        senha: formData.password,
        controleFamiliar: formData.controleFamiliar,
      });

      alert('Conta criada com sucesso!');
      navigate('/login');
    } catch (error) {
      console.error(error);
      alert('Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const isDisabled =
    Object.values(errors).some(Boolean) ||
    !formData.name ||
    !formData.email ||
    !formData.password ||
    !formData.confirmPassword ||
    loading;

  const fields = [
    { name: 'name' as const, label: 'Nome completo', icon: User, type: 'text', placeholder: 'Seu nome' },
    { name: 'email' as const, label: 'Email', icon: Mail, type: 'email', placeholder: 'seu@email.com' },
  ];

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{
        fontFamily: 'Inter, sans-serif',
        background: 'linear-gradient(160deg,#E5EEFB 0%,#F5F9FF 30%,#FAFCFF 60%,#E8F1FC 100%)',
      }}
    >
      <div className="w-full max-w-[520px]">
        <div className="text-center mb-8">
          <h1 className="text-[#2E4A7C] text-3xl font-semibold">Criar conta</h1>
          <p className="text-[#7BA8F5] mt-2">Comece a gerenciar suas finanças</p>
        </div>

        <div className="bg-white/70 backdrop-blur-3xl rounded-[32px] p-10 border-2 border-white/60 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome e Email */}
            {fields.map(field => {
              const Icon = field.icon;
              return (
                <div key={field.name}>
                  <label className="block mb-2 text-sm font-medium text-[#2E4A7C]">
                    {field.label}
                  </label>
                  <div className="relative">
                    <Icon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7BA8F5]" />
                    <input
                      type={field.type}
                      value={formData[field.name] as string}
                      placeholder={field.placeholder}
                      onChange={e => handleChange(field.name, e.target.value)}
                      onBlur={() => handleBlur(field.name)}
                      className="w-full pl-12 pr-5 py-3.5 rounded-[18px] border-2 border-white/70 bg-white/60 focus:border-[#7BA8F5] outline-none"
                    />
                  </div>
                  {errors[field.name] && touched[field.name] && (
                    <p className="text-sm text-red-400 mt-1">{errors[field.name]}</p>
                  )}
                </div>
              );
            })}

            {/* Senha */}
            <div>
              <label className="block mb-2 text-sm font-medium text-[#2E4A7C]">Senha</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7BA8F5]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  placeholder="Mínimo 6 caracteres"
                  onChange={e => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className="w-full pl-12 pr-12 py-3.5 rounded-[18px] border-2 border-white/70 bg-white/60 focus:border-[#7BA8F5] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7BA8F5]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && touched.password && (
                <p className="text-sm text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirmar senha */}
            <div>
              <label className="block mb-2 text-sm font-medium text-[#2E4A7C]">Confirmar senha</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7BA8F5]" />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  placeholder="Repita a senha"
                  onChange={e => handleChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className="w-full pl-12 pr-12 py-3.5 rounded-[18px] border-2 border-white/70 bg-white/60 focus:border-[#7BA8F5] outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#7BA8F5]"
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-sm text-red-400 mt-1">{errors.confirmPassword}</p>
              )}
              {formData.confirmPassword && !errors.confirmPassword && (
                <p className="text-sm text-green-500 mt-1">✓ Senhas coincidem</p>
              )}
            </div>

            {/* Controle familiar */}
            <label className="flex items-start gap-3 rounded-[18px] p-4 border-2 border-white/70 bg-white/60 text-[#2E4A7C] cursor-pointer">
              <input
                type="checkbox"
                checked={formData.controleFamiliar}
                onChange={e => handleChange('controleFamiliar', e.target.checked)}
                className="h-5 w-5 mt-0.5 accent-[#5B8FE8] flex-shrink-0"
              />
              <div>
                <span className="text-sm font-medium block">Controle familiar</span>
                <span className="text-xs text-[#7BA8F5]">
                  Ativa o gerenciamento de múltiplos perfis (ex: pais e filhos)
                </span>
              </div>
            </label>

            <button
              type="submit"
              disabled={isDisabled}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-full text-white font-semibold transition ${
                isDisabled
                  ? 'bg-[#7BA8F5]/40 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#7BA8F5] to-[#5B8FE8] hover:scale-[1.02]'
              }`}
            >
              <UserPlus size={20} />
              {loading ? 'Criando...' : 'Criar conta'}
            </button>
          </form>

          <p className="text-center mt-6 text-[#7BA8F5]">
            Já tem conta?{' '}
            <Link to="/login" className="font-semibold text-[#4A7BD8]">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
