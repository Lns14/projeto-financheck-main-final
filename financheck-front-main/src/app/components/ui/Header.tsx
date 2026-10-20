import { ChevronDown, User, UserCircle, Settings, LogOut, Repeat } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

export function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedProfile, setSelectedProfile, logout } = useAuth();
  const isDashboard = location.pathname === '/';
  const isMetas = location.pathname === '/metas';
  const isLimites = location.pathname === '/limites';

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsDropdownOpen(false);
  };

  const handleChangeProfile = () => {
    setSelectedProfile(null);
    navigate('/selecionar-perfil');
    setIsDropdownOpen(false);
  };

  return (
    <>
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/70 to-white/65 backdrop-blur-3xl"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#F0F6FF]/30 to-transparent"></div>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-90"></div>
      <div className="absolute inset-0 shadow-[0_1px_0_0_rgba(255,255,255,0.8)_inset,0_16px_48px_rgba(91,143,232,0.15),0_8px_24px_rgba(91,143,232,0.08)] border-b-2 border-white/70"></div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#7BA8F5]/25 to-transparent shadow-[0_2px_12px_rgba(123,168,245,0.2)]"></div>

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8 py-4 md:py-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5 md:gap-3.5 group cursor-pointer">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-[#7BA8F5] to-[#5B8FE8] rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
            <div className="relative w-9 h-9 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-[#7BA8F5] to-[#5B8FE8] flex items-center justify-center shadow-[0_8px_32px_rgba(123,168,245,0.45),0_4px_16px_rgba(91,143,232,0.3)] border-2 border-white/50 group-hover:shadow-[0_12px_40px_rgba(123,168,245,0.55),0_6px_20px_rgba(91,143,232,0.35)] group-hover:scale-105 transition-all duration-300">
              <span className="text-white font-semibold text-sm md:text-lg" style={{ fontFamily: 'Inter, sans-serif' }}>F</span>
            </div>
          </div>
          <span className="text-[#2E4A7C] tracking-tight group-hover:text-[#4A7BD8] transition-colors duration-300 text-base md:text-xl" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, textShadow: '0 1px 2px rgba(46, 74, 124, 0.08)' }}>Finance</span>
        </div>

        {/* Navigation - Desktop only */}
        <nav className="hidden md:flex relative items-center gap-12 bg-white/50 backdrop-blur-xl px-10 py-3.5 rounded-full border-2 border-white/70 shadow-[0_8px_32px_rgba(91,143,232,0.14),0_2px_12px_rgba(255,255,255,0.6)_inset,0_-1px_4px_rgba(123,168,245,0.1)_inset]">
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-transparent rounded-full"></div>
          <Link to="/" className={`relative transition-all duration-300 group py-1.5 px-2 ${isDashboard ? 'text-[#2E4A7C]' : 'text-[#7BA8F5] hover:text-[#2E4A7C]'}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '15px' }}>
            Dashboard
            <span className={`absolute bottom-[-6px] left-0 h-[3px] bg-gradient-to-r from-[#7BA8F5] to-[#5B8FE8] rounded-full shadow-[0_0_24px_rgba(123,168,245,0.8),0_2px_10px_rgba(123,168,245,0.5)] transition-all duration-300 ${isDashboard ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          <Link to="/metas" className={`relative transition-all duration-300 group py-1.5 px-2 ${isMetas ? 'text-[#2E4A7C]' : 'text-[#7BA8F5] hover:text-[#2E4A7C]'}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '15px' }}>
            Metas
            <span className={`absolute bottom-[-6px] left-0 h-[3px] bg-gradient-to-r from-[#7BA8F5] to-[#5B8FE8] rounded-full shadow-[0_0_24px_rgba(123,168,245,0.8),0_2px_10px_rgba(123,168,245,0.5)] transition-all duration-300 ${isMetas ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
          <Link to="/limites" className={`relative transition-all duration-300 group py-1.5 px-2 ${isLimites ? 'text-[#2E4A7C]' : 'text-[#7BA8F5] hover:text-[#2E4A7C]'}`} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '15px' }}>
            Limites
            <span className={`absolute bottom-[-6px] left-0 h-[3px] bg-gradient-to-r from-[#7BA8F5] to-[#5B8FE8] rounded-full shadow-[0_0_24px_rgba(123,168,245,0.8),0_2px_10px_rgba(123,168,245,0.5)] transition-all duration-300 ${isLimites ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
          </Link>
        </nav>

        {/* User Area */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* User Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="group flex items-center gap-2 md:gap-3 pl-1.5 pr-3 md:pl-2.5 md:pr-5 py-2 md:py-2.5 rounded-full bg-white/60 backdrop-blur-xl border-2 border-white/70 hover:bg-white/75 hover:shadow-[0_8px_32px_rgba(123,168,245,0.2),0_2px_12px_rgba(255,255,255,0.6)_inset,0_-1px_4px_rgba(123,168,245,0.08)_inset] shadow-[0_4px_16px_rgba(91,143,232,0.12),0_1px_6px_rgba(255,255,255,0.5)_inset] transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7BA8F5] to-[#5B8FE8] rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-full bg-gradient-to-br from-[#7BA8F5] to-[#5B8FE8] flex items-center justify-center shadow-[0_4px_20px_rgba(123,168,245,0.4),0_2px_8px_rgba(91,143,232,0.25)] border-2 border-white/50 group-hover:shadow-[0_6px_24px_rgba(123,168,245,0.5),0_3px_10px_rgba(91,143,232,0.3)] transition-all duration-300">
                  <User size={15} className="text-white md:hidden" strokeWidth={2.5} />
                  <User size={17} className="text-white hidden md:block" strokeWidth={2.5} />
                </div>
              </div>
              <span className="hidden sm:block text-[#2E4A7C] group-hover:text-[#4A7BD8] transition-colors duration-300 text-xs md:text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>{selectedProfile?.nome || 'Perfil'}</span>
              <ChevronDown size={14} className={`text-[#7BA8F5] group-hover:text-[#4A7BD8] transition-all duration-300 md:hidden ${isDropdownOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} strokeWidth={2.5} />
              <ChevronDown size={16} className={`hidden md:block text-[#7BA8F5] group-hover:text-[#4A7BD8] transition-all duration-300 ${isDropdownOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} strokeWidth={2.5} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white/75 backdrop-blur-3xl rounded-[20px] border-2 border-white/70 shadow-[0_20px_60px_rgba(91,143,232,0.25),0_0_0_1px_rgba(255,255,255,0.6)_inset] overflow-hidden transition-all duration-200 ease-out z-50">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-white/20 to-transparent rounded-[20px]"></div>

                <div className="relative z-10 py-2">
                  <Link
                    to="/perfil"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[#2E4A7C] hover:bg-white/60 hover:text-[#4A7BD8] transition-all duration-200 group"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}
                  >
                    <UserCircle size={18} className="text-[#7BA8F5] group-hover:text-[#4A7BD8] transition-colors duration-200" strokeWidth={2.5} />
                    Ver perfil
                  </Link>

                  <Link
                    to="/perfil/editar"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-[#2E4A7C] hover:bg-white/60 hover:text-[#4A7BD8] transition-all duration-200 group"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}
                  >
                    <Settings size={18} className="text-[#7BA8F5] group-hover:text-[#4A7BD8] transition-colors duration-200" strokeWidth={2.5} />
                    Editar perfil
                  </Link>

                  <button
                    onClick={handleChangeProfile}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[#2E4A7C] hover:bg-white/60 hover:text-[#4A7BD8] transition-all duration-200 group"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}
                  >
                    <Repeat size={18} className="text-[#7BA8F5] group-hover:text-[#4A7BD8] transition-colors duration-200" strokeWidth={2.5} />
                    Trocar Perfil
                  </button>

                  <div className="h-px bg-white/60 my-2 mx-3"></div>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-all duration-200 group"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '14px' }}
                  >
                    <LogOut size={18} className="text-[#FF6B6B]" strokeWidth={2.5} />
                    Sair da conta
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>

    {/* Mobile Navigation */}
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/75 backdrop-blur-3xl border-t-2 border-white/70 shadow-[0_-8px_32px_rgba(91,143,232,0.14),0_-2px_12px_rgba(255,255,255,0.6)_inset]">
      <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent"></div>
      <div className="relative grid grid-cols-3 gap-1 px-4 py-3">
        <Link
          to="/"
          className={`relative flex flex-col items-center gap-1.5 py-2.5 px-4 rounded-2xl transition-all duration-300 ${
            isDashboard
              ? 'bg-white/60 backdrop-blur-xl border-2 border-white/70 shadow-[0_4px_20px_rgba(123,168,245,0.2),0_2px_8px_rgba(255,255,255,0.4)_inset]'
              : 'border-2 border-transparent'
          }`}
        >
          {isDashboard && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-[#7BA8F5] to-[#5B8FE8] rounded-full shadow-[0_0_16px_rgba(123,168,245,0.8)]"></div>
          )}
          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            isDashboard
              ? 'bg-gradient-to-br from-[#7BA8F5] to-[#5B8FE8] shadow-[0_0_8px_rgba(123,168,245,0.6)]'
              : 'bg-[#7BA8F5]/40'
          }`}></div>
          <span
            className={`text-xs transition-colors duration-300 ${
              isDashboard ? 'text-[#2E4A7C]' : 'text-[#7BA8F5]'
            }`}
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
          >
            Dashboard
          </span>
        </Link>

        <Link
          to="/metas"
          className={`relative flex flex-col items-center gap-1.5 py-2.5 px-4 rounded-2xl transition-all duration-300 ${
            isMetas
              ? 'bg-white/60 backdrop-blur-xl border-2 border-white/70 shadow-[0_4px_20px_rgba(123,168,245,0.2),0_2px_8px_rgba(255,255,255,0.4)_inset]'
              : 'border-2 border-transparent'
          }`}
        >
          {isMetas && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-[#7BA8F5] to-[#5B8FE8] rounded-full shadow-[0_0_16px_rgba(123,168,245,0.8)]"></div>
          )}
          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            isMetas
              ? 'bg-gradient-to-br from-[#7BA8F5] to-[#5B8FE8] shadow-[0_0_8px_rgba(123,168,245,0.6)]'
              : 'bg-[#7BA8F5]/40'
          }`}></div>
          <span
            className={`text-xs transition-colors duration-300 ${
              isMetas ? 'text-[#2E4A7C]' : 'text-[#7BA8F5]'
            }`}
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
          >
            Metas
          </span>
        </Link>
        <Link
          to="/limites"
          className={`relative flex flex-col items-center gap-1.5 py-2.5 px-4 rounded-2xl transition-all duration-300 ${
            isLimites
              ? 'bg-white/60 backdrop-blur-xl border-2 border-white/70 shadow-[0_4px_20px_rgba(123,168,245,0.2),0_2px_8px_rgba(255,255,255,0.4)_inset]'
              : 'border-2 border-transparent'
          }`}
        >
          {isLimites && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-[#7BA8F5] to-[#5B8FE8] rounded-full shadow-[0_0_16px_rgba(123,168,245,0.8)]"></div>
          )}
          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
            isLimites
              ? 'bg-gradient-to-br from-[#7BA8F5] to-[#5B8FE8] shadow-[0_0_8px_rgba(123,168,245,0.6)]'
              : 'bg-[#7BA8F5]/40'
          }`}></div>
          <span
            className={`text-xs transition-colors duration-300 ${
              isLimites ? 'text-[#2E4A7C]' : 'text-[#7BA8F5]'
            }`}
            style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}
          >
            Limites
          </span>
        </Link>
      </div>
    </nav>
    </>
  );
}
