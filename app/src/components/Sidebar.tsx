import React from 'react';
import { 
  Home, 
  Users, 
  BookOpen, 
  Folder, 
  Heart, 
  Settings, 
  Sparkles,
  ClipboardList
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  favoritesCount: number;
  profName?: string;
  profTitle?: string;
}

export default function Sidebar({ activeTab, setActiveTab, favoritesCount, profName, profTitle }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'casos', label: 'Casos y Expedientes', icon: Users },
    { id: 'biblioteca', label: 'Guía de Instrumentos', icon: BookOpen },
    { id: 'colecciones', label: 'Carpetas Clínicas', icon: Folder },
    { id: 'favoritos', label: 'Favoritos', icon: Heart },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex w-20 lg:w-64 bg-white border-r-2.5 border-[#1A1A1A] text-slate-800 flex-col h-full shrink-0 z-10 transition-all duration-300">
      {/* Cabecera */}
      <div className="p-4 lg:p-6 border-b-2 border-[#1A1A1A] bg-[#FFF9F7] flex flex-col gap-2">
        <div className="flex items-center justify-center lg:justify-start gap-3">
          <div className="w-10 h-10 bg-[#F5D56E] rounded-xl flex items-center justify-center text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2.5px_2.5px_0px_0px_#1A1A1A] shrink-0 transform hover:rotate-3 transition-transform duration-150">
            <ClipboardList className="w-5 h-5 text-[#1A1A1A]" strokeWidth={2.5} />
          </div>
          <div className="hidden lg:block">
            <h1 className="font-display font-black text-xl tracking-tight text-[#1A1A1A] leading-none">
              Psico<span className="text-neopeach">Plan</span>
            </h1>
          </div>
        </div>
        <p className="text-[9px] uppercase font-black text-slate-500 leading-normal tracking-wide mt-1 hidden lg:block">
          Gabinete Psicopedagógico
        </p>
      </div>

      {/* Navegación por categorías */}
      <nav className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-2.5">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-center lg:justify-between px-2.5 lg:px-4 py-2.5 text-xs rounded-2xl font-black transition-all border-2 relative ${
                isActive
                  ? 'bg-[#F5D56E] border-[#1A1A1A] text-[#1A1A1A] shadow-[2.5px_2.5px_0px_0px_#1A1A1A]'
                  : 'text-slate-700 border-transparent hover:border-[#1A1A1A] hover:bg-white hover:text-[#1A1A1A] hover:shadow-[2px_2px_0px_0px_#1A1A1A]'
              }`}
              title={item.label}
            >
              <div className="flex items-center justify-center lg:justify-start gap-2.5">
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-[#1A1A1A]' : 'text-slate-500'}`} />
                <span className="hidden lg:inline">{item.label}</span>
              </div>
              {item.id === 'favoritos' && favoritesCount > 0 && (
                <>
                  <span className="hidden lg:flex items-center gap-1 bg-[#F79472] text-[10px] text-[#1A1A1A] font-black px-2.5 py-0.5 rounded-full border border-[#1A1A1A]">
                    <Heart className="h-2.5 w-2.5 fill-[#1A1A1A] text-[#1A1A1A]" />
                    {favoritesCount}
                  </span>
                  <span className="lg:hidden absolute -top-1 -right-1 bg-[#F79472] text-[8px] text-[#1A1A1A] font-black w-4.5 h-4.5 rounded-full border border-[#1A1A1A] flex items-center justify-center shadow-sm">
                    {favoritesCount}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Indicador de Profesional */}
      <div className="p-4 border-t-2 border-[#1A1A1A] bg-[#FFF9F7] flex items-center justify-center lg:justify-start gap-3">
        <div className="h-9 w-9 rounded-full bg-[#A9D89F] border-2 border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] font-black text-xs shrink-0">
          {(() => {
            if (!profName) return 'SP';
            const parts = profName.trim().split(/\s+/);
            if (parts.length >= 2) {
              return (parts[0][0] + parts[1][0]).toUpperCase();
            }
            return profName.slice(0, 2).toUpperCase();
          })()}
        </div>
        <div className="overflow-hidden hidden lg:block">
          <h4 className="text-xs font-black text-slate-800 truncate">
            {profName || 'S. Psicopedagogo'}
          </h4>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider block truncate">
            {profTitle || 'Consulta Activa'}
          </span>
        </div>
      </div>
    </aside>
  );
}
