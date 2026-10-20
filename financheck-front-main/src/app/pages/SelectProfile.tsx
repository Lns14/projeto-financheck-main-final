import { useEffect, useState } from 'react';
import { Plus, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAuth, type FinancialProfile } from '../context/AuthContext';

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || '?';
}

export function SelectProfile() {
  const navigate = useNavigate();
  const {
    user,
    profiles,
    loadingProfiles,
    refreshProfiles,
    setSelectedProfile,
    createProfile,
    logout,
  } = useAuth();

  const [isAdding, setIsAdding] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileType, setNewProfileType] = useState('FILHO');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    refreshProfiles();
  }, []);

  const handleSelectProfile = (profile: FinancialProfile) => {
    setSelectedProfile(profile);
    navigate('/');
  };

  const handleCreateProfile = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!newProfileName.trim()) return;

    setErrorMessage('');

    try {
      const profile = await createProfile({
        nome: newProfileName.trim(),
        tipo: newProfileType,
      });

      setNewProfileName('');
      setNewProfileType('FILHO');
      setIsAdding(false);
      handleSelectProfile(profile);
    } catch (error) {
      console.error(error);
      setErrorMessage('Nao foi possivel adicionar o perfil. Tente novamente.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{
        fontFamily: 'Inter, sans-serif',
        background: 'radial-gradient(circle at top, #2E4A7C 0%, #16233D 42%, #090D18 100%)',
      }}
    >
      <div className="w-full max-w-[1040px]">
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-[#9EBDF4] text-sm mb-2">Finance</p>
            <h1 className="text-white text-3xl md:text-5xl font-semibold">
              Quem esta usando?
            </h1>
            {user && (
              <p className="text-white/60 mt-3">
                Conta de {user.nome}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-white/10 text-white hover:bg-white/15 transition"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>

        {loadingProfiles ? (
          <div className="text-white/70 text-center py-20">
            Carregando perfis...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 md:gap-8">
            {profiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                onClick={() => handleSelectProfile(profile)}
                className="group text-center"
              >
                <div className="aspect-square rounded-[8px] bg-gradient-to-br from-[#7BA8F5] to-[#5B8FE8] flex items-center justify-center text-white text-5xl md:text-6xl font-semibold border-4 border-transparent group-hover:border-white transition shadow-2xl">
                  {getInitial(profile.nome)}
                </div>
                <p className="mt-4 text-white text-lg font-semibold truncate">
                  {profile.nome}
                </p>
                <p className="text-white/50 text-sm">
                  {profile.tipo}
                </p>
              </button>
            ))}

            <button
              type="button"
              onClick={() => setIsAdding(true)}
              className="group text-center"
            >
              <div className="aspect-square rounded-[8px] bg-white/10 border-4 border-white/10 group-hover:border-white flex items-center justify-center text-white/70 group-hover:text-white transition">
                <Plus size={56} />
              </div>
              <p className="mt-4 text-white text-lg font-semibold">
                Adicionar Perfil
              </p>
            </button>
          </div>
        )}

        {!loadingProfiles && profiles.length === 0 && (
          <p className="text-white/60 text-center mt-10">
            Nenhum perfil encontrado. Adicione um perfil para continuar.
          </p>
        )}

        {errorMessage && (
          <p className="text-[#FFB4B4] text-center mt-8">
            {errorMessage}
          </p>
        )}
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
          <form
            onSubmit={handleCreateProfile}
            className="w-full max-w-[420px] rounded-[8px] bg-white p-8 shadow-2xl space-y-5"
          >
            <h2 className="text-[#2E4A7C] text-2xl font-semibold">
              Novo perfil
            </h2>

            <div>
              <label className="block text-sm font-medium text-[#2E4A7C] mb-2">
                Nome
              </label>
              <input
                value={newProfileName}
                onChange={(event) => setNewProfileName(event.target.value)}
                className="w-full px-4 py-3 rounded-[8px] border-2 border-[#E5EEFB] outline-none focus:border-[#7BA8F5]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2E4A7C] mb-2">
                Tipo
              </label>
              <select
                value={newProfileType}
                onChange={(event) => setNewProfileType(event.target.value)}
                className="w-full px-4 py-3 rounded-[8px] border-2 border-[#E5EEFB] outline-none focus:border-[#7BA8F5]"
              >
                <option value="FILHO">FILHO</option>
                <option value="RESPONSAVEL">RESPONSAVEL</option>
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="flex-1 px-5 py-3 rounded-full border-2 border-[#E5EEFB] text-[#2E4A7C]"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-5 py-3 rounded-full bg-[#5B8FE8] text-white"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
