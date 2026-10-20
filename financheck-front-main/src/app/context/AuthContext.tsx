import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import api from '../../services/api';

export interface FinancialProfile {
  id: number;
  nome: string;
  tipo: string;
}

export interface AuthUser {
  id: number;
  nome: string;
  email: string;
  controleFamiliar?: boolean;
  perfis?: FinancialProfile[];
  token?: string;
  accessToken?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  profiles: FinancialProfile[];
  selectedProfile: FinancialProfile | null;
  loadingProfiles: boolean;
  login: (payload: AuthUser) => Promise<void>;
  logout: () => void;
  setSelectedProfile: (profile: FinancialProfile | null) => void;
  refreshProfiles: () => Promise<FinancialProfile[]>;
  createProfile: (profile: { nome: string; tipo: string }) => Promise<FinancialProfile>;
}

const USER_KEY = 'usuario';
const PROFILE_KEY = 'perfilSelecionado';
const TOKEN_KEY = 'token';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function readStorage<T>(key: string): T | null {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) as T : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

function getUserToken(user: AuthUser | null) {
  return user?.token || user?.accessToken || localStorage.getItem(TOKEN_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readStorage<AuthUser>(USER_KEY));
  const [selectedProfileState, setSelectedProfileState] = useState<FinancialProfile | null>(() => readStorage<FinancialProfile>(PROFILE_KEY));
  const [loadingProfiles, setLoadingProfiles] = useState(false);

  const profiles = user?.perfis || [];

  useEffect(() => {
    const token = getUserToken(user);
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [user]);

  const persistUser = (nextUser: AuthUser | null) => {
    setUser(nextUser);

    if (!nextUser) {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      return;
    }

    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));

    const token = getUserToken(nextUser);
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  };

  const setSelectedProfile = (profile: FinancialProfile | null) => {
    setSelectedProfileState(profile);

    if (profile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    } else {
      localStorage.removeItem(PROFILE_KEY);
    }
  };

  const refreshProfiles = async () => {
    if (!user) return [];

    setLoadingProfiles(true);

    try {
      const response = await api.get(`/usuarios/${user.id}/perfis`);
      const nextProfiles = Array.isArray(response.data) ? response.data : [];
      const nextUser = { ...user, perfis: nextProfiles };

      persistUser(nextUser);

      if (
        selectedProfileState &&
        !nextProfiles.some((profile) => profile.id === selectedProfileState.id)
      ) {
        setSelectedProfile(null);
      }

      return nextProfiles;
    } catch {
      return user.perfis || [];
    } finally {
      setLoadingProfiles(false);
    }
  };

  const login = async (payload: AuthUser) => {
    persistUser(payload);

    // Sem controle familiar: seleciona o primeiro perfil automaticamente
    if (!payload.controleFamiliar && payload.perfis && payload.perfis.length > 0) {
      setSelectedProfile(payload.perfis[0]);
    } else {
      setSelectedProfile(null);
    }
  };

  const logout = () => {
    persistUser(null);
    setSelectedProfile(null);
  };

  const createProfile = async (profile: { nome: string; tipo: string }) => {
    if (!user) throw new Error('Usuario nao autenticado');

    const response = await api.post('/perfis', {
      ...profile,
      usuarioId: user.id,
    });

    const createdProfile = response.data as FinancialProfile;
    const nextUser = {
      ...user,
      perfis: [...profiles, createdProfile],
    };

    persistUser(nextUser);
    return createdProfile;
  };

  const selectedProfile = useMemo(() => {
    if (!selectedProfileState) return null;
    return profiles.find((profile) => profile.id === selectedProfileState.id) || selectedProfileState;
  }, [profiles, selectedProfileState]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profiles,
        selectedProfile,
        loadingProfiles,
        login,
        logout,
        setSelectedProfile,
        refreshProfiles,
        createProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
