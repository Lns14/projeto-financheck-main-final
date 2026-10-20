import { Header } from '../components/ui/Header';
import {
  User,
  Mail,
  Calendar,
  Edit,
  Shield
} from 'lucide-react';

import { Link } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface InfoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function Profile() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <>
      <Header />

      <main className="max-w-[1280px] mx-auto px-8 pt-12 pb-24">

        <div className="mb-12 flex items-center justify-between">
          <h1 className="text-[#2E4A7C] text-[32px] font-semibold">
            Meu Perfil
          </h1>
          <Link
            to="/perfil/editar"
            className="flex items-center gap-2 px-8 py-3 rounded-full bg-[#5B8FE8] text-white"
          >
            <Edit size={17} />
            Editar perfil
          </Link>
        </div>

        <div className="bg-white rounded-[32px] px-12 py-10 shadow-lg">

          <div className="flex items-center gap-8 mb-12 pb-10 border-b">
            <div className="w-28 h-28 rounded-full bg-[#5B8FE8] flex items-center justify-center">
              <User size={48} className="text-white" />
            </div>
            <div>
              <h2 className="text-[#2E4A7C] text-[28px] font-semibold">
                {user.nome}
              </h2>
              <p className="text-[#7BA8F5]">
                {user.email}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <InfoCard
              icon={<Mail size={20} />}
              label="EMAIL"
              value={user.email}
            />

            <InfoCard
              icon={<Shield size={20} />}
              label="CONTROLE FAMILIAR"
              value={user.controleFamiliar ? 'Ativado' : 'Desativado'}
            />

            <InfoCard
              icon={<Calendar size={20} />}
              label="PERFIS FINANCEIROS"
              value={
                user.perfis && user.perfis.length > 0
                  ? user.perfis.map(p => p.nome).join(', ')
                  : 'Nenhum perfil cadastrado'
              }
            />

          </div>
        </div>

      </main>
    </>
  );
}

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div className="bg-gray-50 rounded-[20px] px-6 py-5 border">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#4A7BD8]">
          {icon}
        </div>
        <div>
          <p className="text-xs text-[#7BA8F5]">{label}</p>
          <p className="font-semibold text-[#2E4A7C]">{value}</p>
        </div>
      </div>
    </div>
  );
}
