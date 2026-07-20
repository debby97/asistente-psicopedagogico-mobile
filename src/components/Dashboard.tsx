import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  Users, 
  Folder, 
  Heart, 
  Clock, 
  BookOpen, 
  ChevronRight, 
  Star,
  Zap,
  Activity,
  Layers,
  FileText
} from 'lucide-react';
import { Instrumento, Caso, Bateria, Coleccion } from '../types';
import InstrumentoDetailPanel from './InstrumentoDetailPanel';

interface DashboardProps {
  instrumentos: Instrumento[];
  favoritos: string[];
  casos: Caso[];
  baterias: Bateria[];
  colecciones: Coleccion[];
  onToggleFavorito: (id: string) => void;
  onNavigateToTab: (tab: string, args?: any) => void;
  onAddCaso: (caso: Omit<Caso, 'id' | 'creado_en'>) => void;
}

export default function Dashboard({
  instrumentos,
  favoritos,
  casos,
  baterias,
  colecciones,
  onToggleFavorito,
  onNavigateToTab,
  onAddCaso
}: DashboardProps) {
  const [showNewCasoModal, setShowNewCasoModal] = useState(false);
  const [selectedIns, setSelectedIns] = useState<Instrumento | null>(null);
  
  // Read saved professional name
  const [savedProfName] = useState(() => localStorage.getItem('prof_name') || '');

  // Saludo dinámico según horario
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) {
      return 'Buenos días';
    } else if (hour >= 12 && hour < 20) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  };

  // Formulario nuevo caso
  const [nombre, setNombre] = useState('');
  const [edad, setEdad] = useState<number>(8);
  const [curso, setCurso] = useState('');
  const [establecimiento, setEstablecimiento] = useState('');
  const [apoderado, setApoderado] = useState('');
  const [motivo, setMotivo] = useState('');


  const handleCreateCaso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre) return;
    onAddCaso({
      nombre,
      edad,
      curso,
      estado: 'Pendiente',
      establecimiento_escolar: establecimiento,
      nombre_apoderado: apoderado,
      motivo_consulta: motivo
    });
    setNombre('');
    setEdad(8);
    setCurso('');
    setEstablecimiento('');
    setApoderado('');
    setMotivo('');
    setShowNewCasoModal(false);
    onNavigateToTab('casos');
  };

  // Carpetas o Colecciones principales (Agrupadas por área o colecciones guardadas)
  const mainFolders = [
    { name: 'Inteligencia y Cognición', area: 'Inteligencia', icon: Folder, color: 'text-indigo-500 bg-indigo-50 border-indigo-100', count: instrumentos.filter(i => i.area.toLowerCase().includes('inteli')).length },
    { name: 'Lenguaje y Comunicación', area: 'Lenguaje', icon: Folder, color: 'text-blue-500 bg-blue-50 border-blue-100', count: instrumentos.filter(i => i.area.toLowerCase().includes('lengua')).length },
    { name: 'Atención y Funciones Ejecutivas', area: 'Atención', icon: Folder, color: 'text-emerald-500 bg-emerald-50 border-emerald-100', count: instrumentos.filter(i => i.area.toLowerCase().includes('atenc') || i.area.toLowerCase().includes('ejecut')).length },
    { name: 'Lectoescritura y Aprendizaje', area: 'Procesos lectores', icon: Folder, color: 'text-amber-500 bg-amber-50 border-amber-100', count: instrumentos.filter(i => i.area.toLowerCase().includes('lect') || i.area.toLowerCase().includes('escrit') || i.area.toLowerCase().includes('aprend')).length },
  ];

  // Instrumentos favoritos completos
  const favoriteInstruments = instrumentos.filter(ins => favoritos.includes(ins.id));

  // Instrumentos recomendados / más utilizados (destacados fijos por relevancia)
  const popularInstruments = instrumentos.filter(ins => 
    ['doc_068', 'doc_104', 'doc_012', 'doc_034'].includes(ins.id)
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header section with welcome, date, and clinical task trigger */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b-2.5 border-dashed border-slate-350 pb-6">
        <div>
          <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-wider bg-[#F5D56E] px-3.5 py-1.5 rounded-full border-2 border-[#1A1A1A] shadow-[1.5px_1.5px_0px_0px_#1A1A1A] inline-block">
            Espacio Clínico
          </span>
          <h1 className="text-3xl font-display font-black text-[#1A1A1A] mt-3 tracking-tight">
            {getGreeting()}, {savedProfName || 'Especialista'}
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Revisa tus casos activos, planifica evaluaciones y explora la guía de instrumentos psicopedagógicos.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4.5">
          <button
            onClick={() => setShowNewCasoModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-black text-[#1A1A1A] bg-[#F79472] hover:bg-[#eb7d55] rounded-2xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all shrink-0"
          >
            <Plus className="h-4.5 w-4.5 text-[#1A1A1A]" />
            Nuevo Caso
          </button>
          <button
            onClick={() => onNavigateToTab('casos', { startEval: true })}
            className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-black text-[#1A1A1A] bg-[#A9D89F] hover:bg-[#99c890] rounded-2xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all shrink-0"
          >
            <Sparkles className="h-4.5 w-4.5 text-[#1A1A1A]" />
            Selector Inteligente de Instrumentos
          </button>
        </div>
      </div>

      {/* Nota: el buscador global único vive ahora en el encabezado persistente (App.tsx),
          visible en todas las pantallas — por eso ya no se repite aquí. */}

      {/* Main Grid: Cases, Folders vs. Favorites & Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN (8 cols): Cases & Folder-style Collections */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Recent Patients File Section */}
          <div className="bg-white rounded-2xl border border-slate-200/70 p-4 sm:p-6 shadow-sm space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-indigo-500" />
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">Expedientes de Casos Recientes</h3>
              </div>
              <button
                onClick={() => onNavigateToTab('casos')}
                className="text-[10px] sm:text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-0.5"
              >
                Ver todos
                <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </button>
            </div>

            {/* MOBILE VIEW: Compact table */}
            <div className="block md:hidden border-2 border-[#1A1A1A] rounded-xl overflow-hidden bg-white shadow-[2px_2px_0px_0px_#1A1A1A]">
              <table className="w-full text-left border-collapse table-fixed">
                <thead>
                  <tr className="border-b-2 border-[#1A1A1A] bg-[#FFF9F7]">
                    <th className="w-1/2 px-3 py-2 text-[10px] font-black text-[#1A1A1A] uppercase tracking-wider">Paciente</th>
                    <th className="w-1/5 px-2 py-2 text-[10px] font-black text-[#1A1A1A] uppercase tracking-wider">Curso</th>
                    <th className="w-3/10 px-3 py-2 text-[10px] font-black text-[#1A1A1A] uppercase tracking-wider text-right">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {casos.slice(0, 4).map((caso) => {
                    return (
                      <tr
                        key={caso.id}
                        onClick={() => onNavigateToTab('casos', { casoId: caso.id })}
                        className="cursor-pointer border-b border-slate-150 last:border-0 hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-3 py-2.5 text-xs font-black text-[#1A1A1A] align-middle overflow-hidden">
                          <span className="flex items-center gap-1.5 min-w-0">
                            <span className={`h-2.5 w-2.5 rounded-full shrink-0 border border-black/10 ${
                              caso.estado === 'Finalizado' ? 'bg-emerald-500' : caso.estado === 'En Proceso' ? 'bg-amber-500' : 'bg-slate-400'
                            }`} />
                            <span className="truncate block">{caso.nombre}</span>
                            <span className="text-[10px] text-slate-500 font-bold shrink-0">({caso.edad}a)</span>
                          </span>
                        </td>
                        <td className="px-2 py-2.5 text-[10px] text-slate-600 font-bold align-middle truncate">{caso.curso || 'N/A'}</td>
                        <td className="px-3 py-2.5 text-right align-middle shrink-0">
                          <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full border border-black/15 font-black uppercase tracking-wide whitespace-nowrap ${
                            caso.estado === 'Finalizado' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : caso.estado === 'En Proceso' 
                              ? 'bg-amber-100 text-amber-800' 
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {caso.estado}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* DESKTOP VIEW: Original cards grid */}
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6">
              {casos.slice(0, 4).map((caso, index) => {
                const caseBaterias = baterias.filter(b => b.caso_id === caso.id);
                // Pastel colors for heads matching the reference image
                const headColors = [
                  'bg-[#A9D89F]', // green
                  'bg-[#F79472]', // peach/orange
                  'bg-[#F5D56E]', // yellow
                  'bg-[#95CBE7]'  // blue
                ];
                const headerBg = headColors[index % headColors.length];

                return (
                  <div
                    key={caso.id}
                    onClick={() => onNavigateToTab('casos', { casoId: caso.id })}
                    className="rounded-3xl border-2.5 border-[#1A1A1A] bg-white overflow-hidden shadow-[3px_3px_0px_0px_#1A1A1A] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_0px_#1A1A1A] transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    {/* Colored Card Header representing Task Category/Patient Header */}
                    <div className={`${headerBg} px-4 py-3 border-b-2 border-[#1A1A1A] flex items-center justify-between`}>
                      <h4 className="text-xs font-black text-[#1A1A1A] truncate max-w-[150px]">
                        {caso.nombre}
                      </h4>
                      <span className="text-[9px] px-2.5 py-0.5 font-bold rounded-full bg-white border-1.5 border-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]">
                        {caso.estado}
                      </span>
                    </div>

                    {/* Card Content with description and dashed indicators */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold mb-2">
                          <span className="px-2 py-0.5 border border-[#1A1A1A] rounded bg-slate-50 text-[9px] font-bold">
                            {caso.edad} años
                          </span>
                          <span className="px-2 py-0.5 border border-[#1A1A1A] rounded bg-slate-50 text-[9px] font-bold">
                            {caso.curso || 'N/A'}
                          </span>
                        </div>
                        {caso.motivo && (
                          <p className="text-[10px] text-slate-700 font-medium line-clamp-2 leading-relaxed">
                            {caso.motivo}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between border-t-1.5 border-dashed border-slate-300 pt-3 mt-1.5 text-[10px]">
                        <span className="font-bold text-[#1A1A1A] flex items-center gap-1.5">
                          {/* Dashed micro box for icon count like in design */}
                          <span className="w-5 h-5 flex items-center justify-center border border-dashed border-[#1A1A1A] rounded bg-white font-mono text-[9px]">
                            {caseBaterias.length}
                          </span>
                          {caseBaterias.length === 1 ? 'Batería clínica' : 'Baterías clínicas'}
                        </span>
                        
                        <span className="text-xs font-black text-[#1A1A1A] bg-white group-hover:bg-[#F5D56E] border border-[#1A1A1A] px-2 py-0.5 rounded-md shadow-[1px_1px_0px_0px_#1A1A1A] transition-colors flex items-center gap-0.5">
                          Ver Ficha
                          <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Folder-style Collections Folder */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-indigo-500" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Explorar Colecciones Clínicas</h3>
              </div>
              <button
                onClick={() => onNavigateToTab('colecciones')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                Ver carpetas
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mainFolders.map((folder, idx) => {
                const Icon = folder.icon;
                return (
                  <div
                    key={idx}
                    onClick={() => onNavigateToTab('colecciones', { activeArea: folder.area })}
                    className="p-4 bg-white border border-slate-200/70 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex items-center gap-3.5 group"
                  >
                    <div className={`w-11 h-11 rounded-xl shrink-0 border flex items-center justify-center ${folder.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                        {folder.name}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                        {folder.count} instrumentos catalogados
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (4 cols): Highlights & Favorites */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Favorites widget */}
          <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-rose-500 fill-rose-500" />
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Mis Favoritos ({favoriteInstruments.length})</h3>
              </div>
              {favoriteInstruments.length > 0 && (
                <button
                  onClick={() => onNavigateToTab('favoritos')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Ver todos
                </button>
              )}
            </div>

            {favoriteInstruments.length > 0 ? (
              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {favoriteInstruments.slice(0, 4).map((ins) => (
                  <div
                    key={ins.id}
                    onClick={() => setSelectedIns(ins)}
                    className="p-3 bg-slate-50 hover:bg-slate-100/70 border border-slate-100 rounded-xl cursor-pointer transition-fluent flex items-center justify-between gap-3 group"
                  >
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-700 truncate group-hover:text-indigo-600">
                        {ins.nombre}
                      </h4>
                      <span className="text-[9px] font-semibold text-indigo-600 mt-0.5 block">
                        {ins.area}
                      </span>
                    </div>
                    <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                Aún no tienes instrumentos favoritos. Haz clic en el ícono de corazón de cualquier test para agregarlo aquí.
              </div>
            )}
          </div>

          {/* Quick-add/Most used tests */}
          <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Pruebas Destacadas</h3>
            </div>

            <div className="space-y-3">
              {popularInstruments.map((ins) => (
                <div
                  key={ins.id}
                  onClick={() => setSelectedIns(ins)}
                  className="p-3.5 bg-slate-50/50 hover:bg-white border border-slate-200/50 hover:border-indigo-200 rounded-xl cursor-pointer transition-fluent flex items-start gap-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100/50 flex items-center justify-center text-indigo-600 font-bold text-[10px] shrink-0 mt-0.5">
                    {ins.nombre.slice(0, 3).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                      {ins.nombre}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                      {ins.autor}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[9px] bg-slate-100 text-slate-600 font-semibold px-1.5 py-0.2 rounded">
                        {ins.edad_aplicacion}
                      </span>
                      {ins.adaptacion_chilena === 'Sí' && (
                        <span className="text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.2 rounded">
                          CL
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Slide-over Technical Specification Panel */}
      <InstrumentoDetailPanel
        instrumento={selectedIns}
        onClose={() => setSelectedIns(null)}
        isFavorito={selectedIns ? favoritos.includes(selectedIns.id) : false}
        onToggleFavorito={() => selectedIns && onToggleFavorito(selectedIns.id)}
      />

      {/* Modal: New Patient File */}
      {showNewCasoModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] max-w-lg w-full overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b-2 border-[#1A1A1A] flex items-center justify-between bg-[#FFF9F7] shrink-0">
              <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider">Crear Nuevo Expediente</h3>
              <button
                onClick={() => setShowNewCasoModal(false)}
                className="text-slate-500 hover:text-slate-800 text-xs font-black underline"
              >
                Cerrar
              </button>
            </div>
            <form onSubmit={handleCreateCaso} className="p-6 space-y-4 overflow-y-auto flex-1 bg-[#FFF9F7]/10">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. María Paz Rojas"
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Edad</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    required
                    value={edad}
                    onChange={(e) => setEdad(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Curso / Nivel</label>
                  <input
                    type="text"
                    value={curso}
                    onChange={(e) => setCurso(e.target.value)}
                    placeholder="Ej. 3° Básico"
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Establecimiento</label>
                  <input
                    type="text"
                    value={establecimiento}
                    onChange={(e) => setEstablecimiento(e.target.value)}
                    placeholder="Ej. Colegio San Agustín"
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Nombre del Apoderado / Contacto</label>
                <input
                  type="text"
                  value={apoderado}
                  onChange={(e) => setApoderado(e.target.value)}
                  placeholder="Ej. Felipe Rojas (Padre)"
                  className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Motivo de Consulta Principal</label>
                <textarea
                  required
                  rows={3}
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Ej. Dificultades notables en comprensión de textos y sospecha de déficit atencional."
                  className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0 resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t-2 border-dashed border-[#1A1A1A]/20">
                <button
                  type="button"
                  onClick={() => setShowNewCasoModal(false)}
                  className="px-4 py-2 text-xs font-black text-slate-500 hover:text-slate-800 underline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-black text-[#1A1A1A] bg-[#F79472] hover:bg-[#eb7d55] rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all active:translate-x-[1px] active:translate-y-[1px]"
                >
                  Registrar Caso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
