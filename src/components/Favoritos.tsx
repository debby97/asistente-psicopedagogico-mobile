import React, { useState } from 'react';
import { 
  Heart, 
  Search, 
  Grid, 
  List, 
  ChevronRight, 
  Trash2, 
  Clock, 
  User, 
  Compass,
  Sparkles,
  Award
} from 'lucide-react';
import { Instrumento } from '../types';
import InstrumentoDetailPanel from './InstrumentoDetailPanel';

interface FavoritosProps {
  instrumentos: Instrumento[];
  favoritos: string[];
  onToggleFavorito: (id: string) => void;
}

export default function Favoritos({
  instrumentos,
  favoritos,
  onToggleFavorito
}: FavoritosProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');
  const [selectedIns, setSelectedIns] = useState<Instrumento | null>(null);

  // Filtrar los favoritos que coinciden con el término de búsqueda
  const favInstruments = instrumentos.filter(ins => favoritos.includes(ins.id));
  const filteredFavs = favInstruments.filter(ins => {
    const searchStr = `${ins.nombre} ${ins.autor || ''} ${ins.area}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <span className="text-xs font-bold text-rose-600 uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-100/40">
          Mis Favoritos
        </span>
        <h1 className="text-2xl font-bold text-slate-800 mt-2 tracking-tight">
          Panel de Pruebas Preferidas
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Accede rápidamente a tus instrumentos psicopedagógicos más recurrentes y recomendados.
        </p>
      </div>

      {/* Filters and Layout controls */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar entre mis pruebas favoritas..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border-2 border-[#1A1A1A] rounded-2xl text-xs focus:outline-none focus:ring-0 placeholder-slate-400 shadow-[2px_2px_0px_0px_#1A1A1A]"
          />
        </div>

        <div className="flex items-center gap-2 border-2 border-[#1A1A1A] bg-white p-1 rounded-xl shrink-0 shadow-[2px_2px_0px_0px_#1A1A1A]">
          <button
            onClick={() => setLayoutMode('grid')}
            className={`p-1.5 rounded-lg transition-colors border ${layoutMode === 'grid' ? 'bg-[#F5D56E] border-[#1A1A1A] text-[#1A1A1A] font-black' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setLayoutMode('list')}
            className={`p-1.5 rounded-lg transition-colors border ${layoutMode === 'list' ? 'bg-[#F5D56E] border-[#1A1A1A] text-[#1A1A1A] font-black' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredFavs.length > 0 ? (
        layoutMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFavs.map((ins) => (
              <div
                key={ins.id}
                onClick={() => setSelectedIns(ins)}
                className="p-5 bg-white rounded-2xl border border-slate-200/60 hover:border-indigo-300 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between relative group overflow-hidden"
              >
                {/* Accent Area line bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500/10 group-hover:bg-indigo-500 transition-colors" />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[9px] font-bold uppercase text-indigo-600 bg-indigo-50 border border-indigo-100/30 px-2 py-0.5 rounded-md">
                      {ins.area}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorito(ins.id);
                      }}
                      className="p-1.5 rounded-lg text-[#1A1A1A] bg-[#F79472] hover:bg-[#eb7d55] border-2 border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A] transition-all hover:translate-x-[-0.5px] hover:translate-y-[-0.5px] active:translate-x-[0.5px] active:translate-y-[0.5px] shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-[#1A1A1A]" />
                    </button>
                  </div>

                  <h3 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {ins.nombre}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold mt-1 truncate">
                    Por: {ins.autor || 'S/A'}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3.5 mt-4 text-[10px]">
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                    <Clock className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                    <span className="truncate">{ins.tiempo_aproximado || 'S/I'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500 font-medium justify-end">
                    <Compass className="h-3.5 w-3.5 text-slate-300 shrink-0" />
                    <span className="truncate">{ins.edad_aplicacion}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden divide-y divide-slate-100 shadow-sm">
            {filteredFavs.map((ins) => (
              <div
                key={ins.id}
                onClick={() => setSelectedIns(ins)}
                className="px-6 py-4 hover:bg-slate-50/50 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold uppercase text-indigo-600 bg-indigo-50 border border-indigo-100/30 px-1.5 py-0.2 rounded">
                      {ins.area}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      {ins.autor || 'S/A'}
                    </span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                    {ins.nombre}
                  </h3>
                </div>

                <div className="flex items-center gap-6 shrink-0 text-[10px] font-medium text-slate-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-slate-300" />
                    {ins.tiempo_aproximado || 'S/I'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Compass className="h-3.5 w-3.5 text-slate-300" />
                    {ins.edad_aplicacion}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorito(ins.id);
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 border border-transparent transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <ChevronRight className="h-4 w-4 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Heart className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Sin Favoritos Coincidentes</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {searchTerm 
              ? 'Ninguno de tus instrumentos favoritos coincide con la búsqueda actual.' 
              : 'Agrega tus instrumentos favoritos para tener acceso directo y rápido a ellos.'
            }
          </p>
        </div>
      )}

      {/* Notion-style detail drawer panel */}
      <InstrumentoDetailPanel
        instrumento={selectedIns}
        onClose={() => setSelectedIns(null)}
        isFavorito={selectedIns ? favoritos.includes(selectedIns.id) : false}
        onToggleFavorito={() => selectedIns && onToggleFavorito(selectedIns.id)}
      />
    </div>
  );
}
