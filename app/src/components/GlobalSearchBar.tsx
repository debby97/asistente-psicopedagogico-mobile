import React, { useState, useRef, useEffect } from 'react';
import { Instrumento } from '../types';
import { Search, X, Heart, ArrowRight, Columns } from 'lucide-react';

interface GlobalSearchBarProps {
  instrumentos: Instrumento[];
  query: string;
  onQueryChange: (q: string) => void;
  favoritos: string[];
  onToggleFavorito: (id: string) => void;
  onOpenInstrumento: (ins: Instrumento) => void;
  onVerTodosEnBiblioteca: (query: string) => void;
}

// Buscador único global: "escribes WISC -> resultado". Vive siempre arriba,
// como en la propuesta de rediseño (estilo Google), y reemplaza los buscadores
// locales/independientes que existían antes (Buscador Avanzado, Biblioteca con
// su propio input desconectado, etc).
export default function GlobalSearchBar({
  instrumentos,
  query,
  onQueryChange,
  favoritos,
  onToggleFavorito,
  onOpenInstrumento,
  onVerTodosEnBiblioteca
}: GlobalSearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const term = query.trim().toLowerCase();
  const results = term.length > 0
    ? instrumentos.filter(ins => {
        const haystack = `${ins.nombre} ${ins.autor || ''} ${ins.area} ${ins.que_evalua || ''} ${ins.nombres_alternativos || ''}`.toLowerCase();
        return haystack.includes(term);
      }).slice(0, 8)
    : [];

  const showDropdown = isFocused && term.length > 0;

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto md:mx-0">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onFocus={() => setIsFocused(true)}
          onChange={(e) => onQueryChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && term.length > 0) {
              onVerTodosEnBiblioteca(query);
              setIsFocused(false);
            }
          }}
          placeholder="Buscar instrumento... (ej: WISC, TDAH, lectura)"
          className="w-full pl-10 pr-9 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 placeholder-slate-400"
        />
        {query.length > 0 && (
          <button
            onClick={() => { onQueryChange(''); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          {results.length === 0 ? (
            <div className="p-4 text-xs text-slate-400 font-medium text-center">
              Sin resultados para "{query}"
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
              {results.map(ins => {
                const isFav = favoritos.includes(ins.id);
                return (
                  <button
                    key={ins.id}
                    onClick={() => {
                      onOpenInstrumento(ins);
                      setIsFocused(false);
                    }}
                    className="w-full flex items-center justify-between gap-3 px-4 py-2.5 hover:bg-indigo-50/60 text-left transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{ins.nombre}</p>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide truncate">
                        {ins.area}{ins.autor ? ` · ${ins.autor}` : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        role="button"
                        onClick={(e) => { e.stopPropagation(); onToggleFavorito(ins.id); }}
                        className={`p-1.5 rounded-lg border-2 border-[#1A1A1A] transition-all hover:scale-105 ${isFav ? 'bg-[#F79472] text-[#1A1A1A]' : 'bg-white text-slate-400'}`}
                      >
                        <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-[#1A1A1A]' : ''}`} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          <button
            onClick={() => { onVerTodosEnBiblioteca(query); setIsFocused(false); }}
            className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-50 hover:bg-slate-100 text-[10px] font-bold text-indigo-600 uppercase tracking-wide"
          >
            Ver todos los resultados en Biblioteca <ArrowRight className="h-3 w-3" />
          </button>
        </div>
      )}
    </div>
  );
}
