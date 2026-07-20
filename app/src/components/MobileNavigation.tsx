import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  BookOpen, 
  Folder, 
  Heart, 
  Settings, 
  Menu, 
  X, 
  Sparkles,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  favoritesCount: number;
  professionalInitials?: string;
  professionalName?: string;
}

export default function MobileNavigation({
  activeTab,
  setActiveTab,
  favoritesCount,
  professionalInitials = "SP",
  professionalName = "S. Psicopedagogo"
}: MobileNavigationProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const mainTabs = [
    { id: 'dashboard', label: 'Inicio', icon: Home },
    { id: 'casos', label: 'Casos', icon: Users },
    { id: 'biblioteca', label: 'Guía', icon: BookOpen },
    { id: 'colecciones', label: 'Carpetas', icon: Folder },
  ];

  const secondaryTabs = [
    { id: 'favoritos', label: 'Favoritos', icon: Heart, count: favoritesCount },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsDrawerOpen(false);
  };

  // Determine if active tab is in the secondary list to show visual cue
  const isSecondaryActive = secondaryTabs.some(tab => tab.id === activeTab);

  return (
    <>
      {/* 2. MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t-2.5 border-[#1A1A1A] z-40 flex items-center justify-around px-2 pb-safe">
        {mainTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id && !isDrawerOpen;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              {isActive && (
                <motion.span
                  layoutId="activeTabIndicator"
                  className="absolute top-0 w-10 h-1 bg-[#F5D56E] border-x border-b border-[#1A1A1A] rounded-b-md"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <Icon 
                className={`h-5 w-5 mb-1 transition-all duration-200 ${
                  isActive 
                    ? 'text-[#1A1A1A] scale-110' 
                    : 'text-slate-500'
                }`} 
              />
              <span className={`text-[9px] font-black tracking-wide transition-colors duration-200 ${
                isActive ? 'text-[#1A1A1A] font-extrabold' : 'text-slate-500'
              }`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* MORE / MENÚ BUTTON */}
        <button
          onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          className="flex flex-col items-center justify-center flex-1 h-full relative"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          {isDrawerOpen && (
            <motion.span
              layoutId="activeTabIndicator"
              className="absolute top-0 w-10 h-1 bg-[#F5D56E] border-x border-b border-[#1A1A1A] rounded-b-md"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
          {!isDrawerOpen && isSecondaryActive && (
            <span className="absolute top-1.5 right-6 w-1.5 h-1.5 bg-[#F79472] rounded-full border border-[#1A1A1A]" />
          )}
          {isDrawerOpen ? (
            <X className="h-5 w-5 mb-1 text-[#1A1A1A]" />
          ) : (
            <Menu className={`h-5 w-5 mb-1 transition-all ${isSecondaryActive ? 'text-[#1A1A1A]' : 'text-slate-500'}`} />
          )}
          <span className={`text-[9px] font-black tracking-wide ${
            isDrawerOpen || isSecondaryActive ? 'text-[#1A1A1A] font-extrabold' : 'text-slate-500'
          }`}>
            Más
          </span>
        </button>
      </nav>

      {/* 3. MOBILE MENU DRAWER (Slide Up) */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="md:hidden fixed inset-0 bg-slate-900/40 z-45"
            />

            {/* Bottom Drawer Sheet */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="md:hidden fixed bottom-16 left-0 right-0 bg-white rounded-t-3xl border-t-2.5 border-[#1A1A1A] z-50 p-6 pb-8 shadow-[0_-4px_16px_rgba(0,0,0,0.1)] flex flex-col gap-6 max-h-[80vh] overflow-y-auto"
            >
              {/* Handle Indicator */}
              <div className="w-12 h-1.5 bg-slate-300 rounded-full mx-auto mb-1 border border-[#1A1A1A]" />

              {/* Title & Profile section inside drawer */}
              <div className="flex items-center gap-4 bg-[#FFF9F7] p-4 rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
                <div className="h-11 w-11 rounded-full bg-[#A9D89F] border-2 border-[#1A1A1A] flex items-center justify-center text-[#1A1A1A] font-black text-sm shrink-0">
                  {professionalInitials}
                </div>
                <div>
                  <h4 className="text-xs font-black text-[#1A1A1A]">{professionalName}</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Espacio Clínico</p>
                </div>
              </div>

              {/* Secondary Navigation Options */}
              <div className="flex flex-col gap-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider pl-1 mb-1">Secciones Adicionales</h3>
                
                {secondaryTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-black text-xs transition-all border-2 ${
                        isActive
                          ? 'bg-[#F5D56E] border-[#1A1A1A] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]'
                          : 'bg-transparent border-transparent text-slate-700 hover:border-[#1A1A1A] hover:bg-[#FFF9F7]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-[#1A1A1A]' : 'text-slate-400'}`} />
                        <span>{tab.label}</span>
                      </div>
                      
                      {tab.id === 'favoritos' && tab.count && tab.count > 0 ? (
                        <span className="flex items-center gap-1 bg-[#F79472] text-[10px] text-[#1A1A1A] font-black px-2 py-0.5 rounded-full border border-[#1A1A1A]">
                          <Heart className="h-2.5 w-2.5 fill-[#1A1A1A] text-[#1A1A1A]" />
                          {tab.count}
                        </span>
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Quick Info summary */}
              <div className="text-center py-2">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  PsicoPlan • Gabinete Psicopedagógico
                </span>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
