import React, { useState, useEffect } from 'react';
import { Instrumento, Coleccion } from '../types';
import { AREAS_EVALUAR } from '../utils/areaMapper';
import { 
  Heart, 
  Search, 
  Plus, 
  Tag, 
  Check, 
  Layers, 
  Bookmark, 
  Trash2, 
  Eye, 
  Clock, 
  Compass, 
  Columns, 
  Sliders, 
  PlusCircle, 
  AlertCircle,
  FileText,
  BookmarkPlus,
  LayoutGrid,
  List,
  ChevronDown
} from 'lucide-react';
import InstrumentoDetailPanel from './InstrumentoDetailPanel';
import { motion, AnimatePresence } from 'motion/react';

interface BibliotecaProps {
  instrumentos: Instrumento[];
  favoritos: string[];
  colecciones: Coleccion[];
  onToggleFavorito: (id: string) => void;
  onAddInstrumento: (ins: Omit<Instrumento, 'id'>) => void;
  onDeleteInstrumento?: (id: string) => void;
  onAddColeccion: (nombre: string, descripcion: string) => void;
  onAddInstrumentoToColeccion: (colId: string, insId: string) => void;
  onRemoveInstrumentoFromColeccion: (colId: string, insId: string) => void;
  coleccionItems: { [colId: string]: string[] };
  initialSearch?: string;
  initialArea?: string;
  searchTerm?: string;
  onSearchTermChange?: (term: string) => void;
}

export default function Biblioteca({
  instrumentos,
  favoritos,
  colecciones,
  onToggleFavorito,
  onAddInstrumento,
  onDeleteInstrumento,
  onAddColeccion,
  onAddInstrumentoToColeccion,
  onRemoveInstrumentoFromColeccion,
  coleccionItems,
  initialSearch = '',
  initialArea = 'Todos',
  searchTerm: controlledSearchTerm,
  onSearchTermChange
}: BibliotecaProps) {
  const [internalSearchTerm, setInternalSearchTerm] = useState(initialSearch);
  // El buscador global (arriba, en toda la app) es el único punto de entrada de búsqueda.
  // Si el padre entrega searchTerm/onSearchTermChange, Biblioteca queda 100% controlada por él;
  // si no, cae en su propio estado interno (uso como componente aislado).
  const searchTerm = controlledSearchTerm !== undefined ? controlledSearchTerm : internalSearchTerm;
  const setSearchTerm = onSearchTermChange || setInternalSearchTerm;
  const [selectedArea, setSelectedArea] = useState(initialArea);
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [selectedIns, setSelectedIns] = useState<Instrumento | null>(null);
  
  // Cerrar el dropdown al hacer click afuera
  useEffect(() => {
    if (!showAreaDropdown) return;
    const handleClose = () => setShowAreaDropdown(false);
    window.addEventListener('click', handleClose);
    return () => {
      window.removeEventListener('click', handleClose);
    };
  }, [showAreaDropdown]);
  
  // Custom states
  const [viewMode, setViewMode] = useState<'cuadricula' | 'lista'>('cuadricula');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [showComparisonSheet, setShowComparisonSheet] = useState(false);

  // New Instrument Form States
  const [newNombre, setNewNombre] = useState('');
  const [newAutor, setNewAutor] = useState('');
  const [newAnio, setNewAnio] = useState('');
  const [newEditorial, setNewEditorial] = useState('');
  const [newArea, setNewArea] = useState('Procesos lectores');
  const [newSubarea, setNewSubarea] = useState('');
  const [newEdad, setNewEdad] = useState('');
  const [newTiempo, setNewTiempo] = useState('');
  const [newQueEvalua, setNewQueEvalua] = useState('');
  const [newMateriales, setNewMateriales] = useState('');
  const [newChilena, setNewChilena] = useState<'Sí' | 'No'>('Sí');

  // Areas categories with count of items matching
  const areasList = [
    'Todos',
    ...AREAS_EVALUAR
  ];

  // Areas styled with icons & backgrounds (Spotify style cards)
  const areaCardStyles: { [key: string]: { bg: string, text: string, hover: string } } = {
    'Todos': { bg: 'bg-slate-50 border-slate-200/60', text: 'text-slate-700', hover: 'hover:border-slate-300' },
    'Inteligencia': { bg: 'bg-indigo-50/50 border-indigo-100', text: 'text-indigo-700', hover: 'hover:border-indigo-300' },
    'Funciones ejecutivas': { bg: 'bg-purple-50/50 border-purple-100', text: 'text-purple-700', hover: 'hover:border-purple-300' },
    'Procesos lectores': { bg: 'bg-blue-50/50 border-blue-100', text: 'text-blue-700', hover: 'hover:border-blue-300' },
    'Escritura': { bg: 'bg-emerald-50/50 border-emerald-100', text: 'text-emerald-700', hover: 'hover:border-emerald-300' },
    'Matemáticas': { bg: 'bg-amber-50/50 border-amber-100', text: 'text-amber-700', hover: 'hover:border-amber-300' },
    'Atención': { bg: 'bg-sky-50/50 border-sky-100', text: 'text-sky-700', hover: 'hover:border-sky-300' },
    'Socioemocional': { bg: 'bg-rose-50/50 border-rose-100', text: 'text-rose-700', hover: 'hover:border-rose-300' },
    'Lenguaje': { bg: 'bg-violet-50/50 border-violet-100', text: 'text-violet-700', hover: 'hover:border-violet-300' },
    'Memoria': { bg: 'bg-pink-50/50 border-pink-100', text: 'text-pink-700', hover: 'hover:border-pink-300' },
  };

  const handleCreateInstrument = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNombre) return;

    onAddInstrumento({
      nombre: newNombre,
      autor: newAutor || undefined,
      anio: newAnio || undefined,
      editorial: newEditorial || undefined,
      area: newArea,
      subarea: newSubarea || undefined,
      edad_aplicacion: newEdad || 'Todas las edades',
      tiempo_aproximado: newTiempo || undefined,
      que_evalua: newQueEvalua || undefined,
      materiales_requeridos: newMateriales || undefined,
      adaptacion_chilena: newChilena,
      estado: 'vigente'
    });

    // Reset Form
    setNewNombre('');
    setNewAutor('');
    setNewAnio('');
    setNewEditorial('');
    setNewQueEvalua('');
    setNewMateriales('');
    setShowAddModal(false);
  };

  // Filter clinical catalog
  const filteredInstruments = instrumentos
    .filter(ins => {
      const matchesArea = selectedArea === 'Todos' || ins.area.toLowerCase().includes(selectedArea.toLowerCase()) || selectedArea.toLowerCase().includes(ins.area.toLowerCase());
      const searchString = `${ins.nombre} ${ins.autor || ''} ${ins.que_evalua || ''} ${ins.subarea || ''}`.toLowerCase();
      const matchesSearch = searchString.includes(searchTerm.toLowerCase());
      return matchesArea && matchesSearch;
    })
    .sort((a, b) => {
      const term = searchTerm.toLowerCase().trim();
      if (!term) return 0; // Maintain original order if no search term

      const getScore = (ins: Instrumento) => {
        const nameLower = ins.nombre.toLowerCase().trim();
        let score = 0;

        // Exact match
        if (nameLower === term) {
          score += 10000;
        }
        // Starts with
        else if (nameLower.startsWith(term)) {
          score += 5000;
          score += Math.max(0, 1000 - nameLower.length);
        }
        // Word boundary match
        else {
          const escapedTerm = term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          try {
            const wordBoundaryRegex = new RegExp(`\\b${escapedTerm}\\b`);
            if (wordBoundaryRegex.test(nameLower)) {
              score += 3000;
              score += Math.max(0, 500 - nameLower.length);
            } else if (nameLower.includes(term)) {
              score += 1000;
              score += Math.max(0, 200 - nameLower.length);
            }
          } catch (e) {
            if (nameLower.includes(term)) {
              score += 1000;
            }
          }
        }

        // Other attributes
        if (ins.subarea && ins.subarea.toLowerCase().includes(term)) {
          score += 100;
        }
        if (ins.que_evalua && ins.que_evalua.toLowerCase().includes(term)) {
          score += 50;
        }
        if (ins.autor && ins.autor.toLowerCase().includes(term)) {
          score += 20;
        }

        return score;
      };

      return getScore(b) - getScore(a);
    });

  const handleToggleCompare = (id: string) => {
    if (selectedForComparison.includes(id)) {
      setSelectedForComparison(prev => prev.filter(item => item !== id));
    } else {
      if (selectedForComparison.length >= 2) {
        // Solamente se pueden comparar dos a la vez
        setSelectedForComparison([selectedForComparison[1], id]);
      } else {
        setSelectedForComparison(prev => [...prev, id]);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2.5 border-dashed border-slate-300 pb-6">
        <div>
          <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-wider bg-[#F5D56E] px-3.5 py-1.5 rounded-full border-2 border-[#1A1A1A] shadow-[1.5px_1.5px_0px_0px_#1A1A1A] inline-block">
            Catálogo Clínico
          </span>
          <h1 className="text-3xl font-display font-black text-[#1A1A1A] mt-3 tracking-tight">
            Guía de Instrumentos
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Consulta fichas técnicas, criterios de aplicación y características de los instrumentos de evaluación.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-black text-[#1A1A1A] bg-[#F79472] hover:bg-[#eb7d55] rounded-2xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all self-start md:self-auto"
        >
          <Plus className="h-4.5 w-4.5" />
          Añadir Test Personalizado
        </button>
      </div>

      {/* Search by Area Dropdown Button and Menu */}
      <div className="space-y-3 relative">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Buscar por área</h3>
        <div className="relative inline-block w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowAreaDropdown(!showAreaDropdown);
            }}
            className="flex items-center justify-between gap-3 px-5 py-3 text-xs font-black text-[#1A1A1A] bg-[#F5D56E] hover:bg-[#ebd065] rounded-xl border-2 border-[#1A1A1A] shadow-[2.5px_2.5px_0px_0px_#1A1A1A] transition-all w-full sm:w-72 text-left active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#1A1A1A]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Sliders className="h-4 w-4 text-[#1A1A1A] shrink-0" />
              <span className="truncate">
                {selectedArea === 'Todos' ? 'Todas las áreas' : selectedArea}
              </span>
            </div>
            <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${showAreaDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {showAreaDropdown && (
            <div className="absolute left-0 mt-2 w-full sm:w-72 bg-white border-2 border-[#1A1A1A] rounded-xl shadow-[4px_4px_0px_0px_#1A1A1A] z-40 py-1.5 max-h-[300px] overflow-y-auto divide-y divide-slate-100">
              {areasList.map((area) => {
                const isActive = selectedArea === area;
                const count = area === 'Todos' 
                  ? instrumentos.length 
                  : instrumentos.filter(i => i.area.toLowerCase().includes(area.toLowerCase()) || area.toLowerCase().includes(i.area.toLowerCase())).length;

                return (
                  <button
                    key={area}
                    onClick={() => {
                      setSelectedArea(area);
                      setShowAreaDropdown(false);
                    }}
                    className={`w-full px-4 py-2.5 text-xs text-left font-black transition-colors flex items-center justify-between ${
                      isActive 
                        ? 'bg-[#FFF9F7] text-[#1A1A1A]' 
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate">{area === 'Todos' ? 'Todas las áreas' : area}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200/60 px-1.5 py-0.5 rounded-full">
                        {count}
                      </span>
                      {isActive && <Check className="h-3.5 w-3.5 text-emerald-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Search and comparison info bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-3 border-2 border-[#1A1A1A] rounded-2xl shadow-[2px_2px_0px_0px_#1A1A1A]">
        <div className="relative flex-1 w-full flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Buscar pruebas en ${selectedArea === 'Todos' ? 'todo el catálogo' : selectedArea}...`}
              className="w-full pl-10 pr-4 py-2.5 bg-[#FFF9F7] border-2 border-[#1A1A1A] rounded-xl text-xs focus:outline-none focus:ring-0 placeholder-slate-400 font-medium"
            />
          </div>

          {/* Toggle View Mode */}
          <div className="flex items-center gap-1 border-2 border-[#1A1A1A] bg-[#FFF9F7] p-1 rounded-xl shadow-[1.5px_1.5px_0px_0px_#1A1A1A] shrink-0">
            <button
              type="button"
              onClick={() => setViewMode('cuadricula')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'cuadricula' 
                  ? 'bg-[#F5D56E] text-[#1A1A1A] border border-[#1A1A1A]' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Vista de Cuadrícula"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('lista')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'lista' 
                  ? 'bg-[#F5D56E] text-[#1A1A1A] border border-[#1A1A1A]' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Vista de Lista"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
        {selectedForComparison.length > 0 && (
          <div className="flex items-center gap-2.5 shrink-0 bg-[#FFF9F7] border-2 border-[#1A1A1A] px-3.5 py-2 rounded-xl text-xs font-black text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
            <Columns className="h-4 w-4 text-[#1A1A1A]" />
            <span>{selectedForComparison.length} seleccionados</span>
            <button
              onClick={() => setShowComparisonSheet(true)}
              disabled={selectedForComparison.length < 2}
              className="ml-2 px-3 py-1.5 text-[10px] font-black bg-[#A9D89F] hover:bg-[#97c58e] border-2 border-[#1A1A1A] text-[#1A1A1A] rounded-lg transition-all hover:translate-y-[-0.5px] disabled:opacity-50"
            >
              Comparar ahora
            </button>
            <button
              onClick={() => setSelectedForComparison([])}
              className="text-[10px] text-slate-500 hover:text-rose-500 font-black ml-1.5 underline"
            >
              Limpiar
            </button>
          </div>
        )}
      </div>

      {/* Main instruments list cards layout (Spotify or Notion card tiles) */}
      {filteredInstruments.length > 0 ? (
        viewMode === 'cuadricula' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredInstruments.map((ins) => {
              const isFav = favoritos.includes(ins.id);
              const isComparing = selectedForComparison.includes(ins.id);
              return (
                <div
                  key={ins.id}
                  onClick={() => setSelectedIns(ins)}
                  className="p-5 bg-white border border-slate-200/60 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Visual Area banner band */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500/10 group-hover:bg-indigo-500 transition-colors" />

                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[9px] font-black uppercase text-[#1A1A1A] bg-[#FFF9F7] border-2 border-[#1A1A1A] px-2 py-0.5 rounded-md truncate">
                        {ins.area}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => onToggleFavorito(ins.id)}
                          className={`p-1.5 rounded-lg border-2 border-[#1A1A1A] transition-all hover:scale-105 ${
                            isFav 
                              ? 'bg-[#F79472] text-[#1A1A1A]' 
                              : 'bg-white text-slate-400 hover:text-[#1A1A1A]'
                          }`}
                          title={isFav ? "Quitar de favoritos" : "Marcar favorito"}
                        >
                          <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-[#1A1A1A]' : ''}`} />
                        </button>
                        
                        <button
                          onClick={() => handleToggleCompare(ins.id)}
                          className={`p-1.5 rounded-lg border-2 border-[#1A1A1A] text-xs font-black transition-all hover:scale-105 ${
                            isComparing 
                              ? 'bg-[#A9D89F] text-[#1A1A1A]' 
                              : 'bg-white text-slate-400 hover:text-[#1A1A1A]'
                          }`}
                          title="Seleccionar para comparar"
                        >
                          <Columns className="h-3.5 w-3.5" />
                        </button>

                        {onDeleteInstrumento && ins.id.startsWith('sql_') && (
                          <button
                            onClick={() => onDeleteInstrumento(ins.id)}
                            className="p-1.5 rounded-lg border-2 border-[#1A1A1A] bg-[#FFF9F7] text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                            title="Eliminar test personalizado"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                      {ins.nombre}
                    </h3>
                    {ins.nombres_alternativos && (
                      <p className="text-[10px] text-slate-400 font-medium italic mt-0.5 truncate">
                        ({ins.nombres_alternativos})
                      </p>
                    )}
                    <p className="text-[10px] text-slate-400 font-semibold mt-1 truncate">
                      Por {ins.autor || 'Especialistas'}
                    </p>

                    {ins.que_evalua && (
                      <p className="text-[10px] text-slate-500 leading-normal line-clamp-2 mt-2.5">
                        {ins.que_evalua}
                      </p>
                    )}
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
              );
            })}
          </div>
        ) : (
          <div className="border-2 border-[#1A1A1A] rounded-2xl overflow-hidden bg-white shadow-[3px_3px_0px_0px_#1A1A1A]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#1A1A1A] bg-[#FFF9F7]">
                  <th className="px-4 py-3 text-xs font-black text-[#1A1A1A] uppercase tracking-wider">Prueba</th>
                  <th className="px-4 py-3 text-xs font-black text-[#1A1A1A] uppercase tracking-wider hidden sm:table-cell">Área</th>
                  <th className="px-4 py-3 text-xs font-black text-[#1A1A1A] uppercase tracking-wider hidden md:table-cell">Población / Edad</th>
                  <th className="px-4 py-3 text-xs font-black text-[#1A1A1A] uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredInstruments.map((ins) => {
                  const isFav = favoritos.includes(ins.id);
                  const isComparing = selectedForComparison.includes(ins.id);
                  return (
                    <tr
                      key={ins.id}
                      onClick={() => setSelectedIns(ins)}
                      className="cursor-pointer border-b border-slate-200 last:border-0 hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs">
                        <div className="font-bold text-[#1A1A1A] hover:text-indigo-600 transition-colors">{ins.nombre}</div>
                        {ins.nombres_alternativos && (
                          <div className="text-[10px] text-slate-400 font-medium italic mt-0.5">{ins.nombres_alternativos}</div>
                        )}
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Por {ins.autor || 'Especialistas'}</div>
                      </td>
                      <td className="px-4 py-3 text-xs hidden sm:table-cell">
                        <span className="text-[10px] font-black uppercase text-[#1A1A1A] bg-[#FFF9F7] border-2 border-[#1A1A1A] px-2 py-0.5 rounded-md">
                          {ins.area}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs hidden md:table-cell text-slate-600 font-medium">
                        {ins.edad_aplicacion}
                      </td>
                      <td className="px-4 py-3 text-xs text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onToggleFavorito(ins.id)}
                            className={`p-1.5 rounded-lg border-2 border-[#1A1A1A] transition-all hover:scale-105 ${
                              isFav 
                                ? 'bg-[#F79472] text-[#1A1A1A]' 
                                : 'bg-white text-slate-400 hover:text-[#1A1A1A]'
                            }`}
                            title={isFav ? "Quitar de favoritos" : "Marcar favorito"}
                          >
                            <Heart className={`h-3.5 w-3.5 ${isFav ? 'fill-[#1A1A1A]' : ''}`} />
                          </button>
                          
                          <button
                            onClick={() => handleToggleCompare(ins.id)}
                            className={`p-1.5 rounded-lg border-2 border-[#1A1A1A] text-xs font-black transition-all hover:scale-105 ${
                              isComparing 
                                ? 'bg-[#A9D89F] text-[#1A1A1A]' 
                                : 'bg-white text-slate-400 hover:text-[#1A1A1A]'
                            }`}
                            title="Seleccionar para comparar"
                          >
                            <Columns className="h-3.5 w-3.5" />
                          </button>

                          {onDeleteInstrumento && ins.id.startsWith('sql_') && (
                            <button
                              onClick={() => onDeleteInstrumento(ins.id)}
                              className="p-1.5 rounded-lg border-2 border-[#1A1A1A] bg-[#FFF9F7] text-rose-500 hover:bg-rose-50 hover:text-rose-600"
                              title="Eliminar test personalizado"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
          <Sliders className="h-10 w-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-700">Sin pruebas coincidentes</h3>
          <p className="text-xs text-slate-400 mt-1">
            Ningún instrumento del catálogo clínico coincide con los criterios de búsqueda actuales.
          </p>
        </div>
      )}

      {/* Slide-over specifications drawer (Notion-style) */}
      <InstrumentoDetailPanel
        instrumento={selectedIns}
        onClose={() => setSelectedIns(null)}
        isFavorito={selectedIns ? favoritos.includes(selectedIns.id) : false}
        onToggleFavorito={() => selectedIns && onToggleFavorito(selectedIns.id)}
      />

      {/* Floating Side Comparison Sheet Modal (Only displays when Compare is triggered) */}
      {showComparisonSheet && selectedForComparison.length >= 2 && (
        <div className="fixed inset-x-0 bottom-0 top-16 md:inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] max-w-4xl w-full overflow-hidden flex flex-col max-h-[calc(100dvh-6rem)] md:max-h-[85vh] h-auto">
            <div className="px-6 py-4 border-b-2 border-[#1A1A1A] flex items-center justify-between shrink-0 bg-[#FFF9F7]">
              <div>
                <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider">Comparador Técnico de Instrumentos</h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Analiza contrastes y similitudes diagnósticas entre pruebas recomendadas.</p>
              </div>
              <button
                onClick={() => {
                  setShowComparisonSheet(false);
                  setSelectedForComparison([]);
                }}
                className="text-slate-500 hover:text-slate-800 text-xs font-black underline"
              >
                Cerrar
              </button>
            </div>

            <div className="flex-1 overflow-auto p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-200 md:divide-slate-100 bg-[#FFF9F7]/30">
              {selectedForComparison.slice(0, 2).map((insId, idx) => {
                const ins = instrumentos.find(i => i.id === insId);
                if (!ins) return null;
                return (
                  <div key={ins.id} className={`space-y-4 ${idx === 1 ? 'pt-6 md:pt-0 md:pl-6' : 'pb-6 md:pb-0 md:pr-2'}`}>
                    <div>
                      <span className="text-[9px] font-black text-[#1A1A1A] bg-[#F5D56E] border-2 border-[#1A1A1A] px-2 py-0.5 rounded">
                        {ins.area}
                      </span>
                      <h4 className="text-xs font-black text-[#1A1A1A] mt-2 leading-snug">{ins.nombre}</h4>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">Autor: {ins.autor || 'No especificado'}</p>
                    </div>

                    <div className="bg-white border-2 border-[#1A1A1A] p-4 rounded-xl space-y-3 shadow-[2px_2px_0px_0px_#1A1A1A]">
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">¿Qué evalúa?</span>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{ins.que_evalua || 'Sin detalles sobre dimensiones cognitivas.'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[10px] font-medium text-slate-500">
                        <div>
                          <span className="font-bold text-slate-400 block">Población objetivo</span>
                          <span className="text-slate-700 mt-0.5 block">{ins.edad_aplicacion}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-400 block">Tiempo estimado</span>
                          <span className="text-slate-700 mt-0.5 block">{ins.tiempo_aproximado || 'S/I'}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[10px] font-medium text-slate-500">
                        <div>
                          <span className="font-bold text-slate-400 block">Evidencia científica</span>
                          <span className="text-slate-700 mt-0.5 block">Nivel {ins.nivel_evidencia || 'Medio'}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-400 block">Normativa Chilena</span>
                          <span className="text-slate-700 mt-0.5 block">{ins.adaptacion_chilena === 'Sí' ? 'Estandarizado en CL' : 'No'}</span>
                        </div>
                      </div>

                      {ins.materiales_requeridos && (
                        <div className="pt-2 border-t border-slate-100">
                           <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Materiales requeridos</span>
                           <p className="text-[11px] text-slate-600 mt-1 leading-normal">{ins.materiales_requeridos}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t-2 border-[#1A1A1A] bg-white flex justify-end shrink-0">
              <button
                onClick={() => {
                  setShowComparisonSheet(false);
                  setSelectedForComparison([]);
                }}
                className="px-5 py-2.5 bg-[#A9D89F] hover:bg-[#97c58e] border-2 border-[#1A1A1A] text-[#1A1A1A] font-black text-xs rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A] transition-all active:translate-x-[1px] active:translate-y-[1px]"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: New Custom Instrument Form */}
      {showAddModal && (
        <div className="fixed inset-x-0 bottom-0 top-16 md:inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] max-w-lg w-full overflow-hidden flex flex-col max-h-[calc(100dvh-6rem)]">
            <div className="px-6 py-4 border-b-2 border-[#1A1A1A] flex items-center justify-between bg-[#FFF9F7] shrink-0">
              <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider">Añadir Instrumento</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-500 hover:text-slate-800 text-xs font-black underline"
              >
                Cerrar
              </button>
            </div>
            <form onSubmit={handleCreateInstrument} className="p-6 space-y-4 overflow-y-auto flex-1 bg-[#FFF9F7]/10">
              <div>
                <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Nombre de la Prueba / Test</label>
                <input
                  type="text"
                  required
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  placeholder="Ej. Batería de Lenguaje Oral PLON-R"
                  className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0 placeholder-slate-400 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Autor(es)</label>
                  <input
                    type="text"
                    value={newAutor}
                    onChange={(e) => setNewAutor(e.target.value)}
                    placeholder="Ej. Aguinaga et al."
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0 placeholder-slate-400 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Año de publicación</label>
                  <input
                    type="text"
                    value={newAnio}
                    onChange={(e) => setNewAnio(e.target.value)}
                    placeholder="Ej. 2004"
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0 placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Área Principal</label>
                  <select
                    value={newArea}
                    onChange={(e) => setNewArea(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0 font-medium"
                  >
                    {AREAS_EVALUAR.map((area) => (
                      <option key={area} value={area}>{area}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Subárea / Constructo</label>
                  <input
                    type="text"
                    value={newSubarea}
                    onChange={(e) => setNewSubarea(e.target.value)}
                    placeholder="Ej. Fonología, Sintaxis"
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0 placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Población / Edad</label>
                  <input
                    type="text"
                    value={newEdad}
                    onChange={(e) => setNewEdad(e.target.value)}
                    placeholder="Ej. 3 a 6 años"
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0 placeholder-slate-400 font-medium"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Tiempo de aplicación</label>
                  <input
                    type="text"
                    value={newTiempo}
                    onChange={(e) => setNewTiempo(e.target.value)}
                    placeholder="Ej. 40 minutos"
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0 placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Estandarización Chilena</label>
                  <select
                    value={newChilena}
                    onChange={(e) => setNewChilena(e.target.value as 'Sí' | 'No')}
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none"
                  >
                    <option value="Sí">Sí</option>
                    <option value="No">No</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Editorial / Distribuidor</label>
                  <input
                    type="text"
                    value={newEditorial}
                    onChange={(e) => setNewEditorial(e.target.value)}
                    placeholder="Ej. TEA Ediciones"
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0 placeholder-slate-400 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">¿Qué evalúa exactamente? (Descripción)</label>
                <textarea
                  rows={3}
                  value={newQueEvalua}
                  onChange={(e) => setNewQueEvalua(e.target.value)}
                  placeholder="Ej. Evalúa el desarrollo del lenguaje oral en sus aspectos de forma, contenido y uso..."
                  className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0 resize-none placeholder-slate-400 font-medium"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Materiales requeridos (separados por comas)</label>
                <input
                  type="text"
                  value={newMateriales}
                  onChange={(e) => setNewMateriales(e.target.value)}
                  placeholder="Ej. Manual, Cuadernillo, Fichas de colores"
                  className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0 placeholder-slate-400 font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t-2 border-dashed border-[#1A1A1A]/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-black text-slate-500 hover:text-slate-800 underline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-black text-[#1A1A1A] bg-[#F79472] hover:bg-[#eb7d55] rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all active:translate-x-[1px] active:translate-y-[1px]"
                >
                  Registrar Instrumento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
