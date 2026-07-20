import React, { useState } from 'react';
import { EVALUA_BATTERIES, EvaluaBatteryData, getEvaluaAsInstrumento } from '../utils/evaluaData';
import { Instrumento } from '../types';
import { 
  Sparkles, 
  Award, 
  Clock, 
  User, 
  BookOpen, 
  Heart, 
  FileCheck2, 
  AlertCircle, 
  CheckCircle2, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  ListFilter,
  Layers,
  Wrench,
  HelpCircle,
  Dna
} from 'lucide-react';

interface SeccionEvaluaProps {
  instrumentos: Instrumento[];
  favoritos: string[];
  onToggleFavorito: (id: string) => void;
  onSendToConstructor: (bateriaId: string) => void;
  onSendToComparador: (bateriaId: string) => void;
}

export default function SeccionEvalua({
  instrumentos,
  favoritos,
  onToggleFavorito,
  onSendToConstructor,
  onSendToComparador
}: SeccionEvaluaProps) {
  const [selectedId, setSelectedId] = useState<string>('evalua_3'); // default to Evalúa 3
  const [searchSubtestQuery, setSearchSubtestQuery] = useState('');

  const currentBattery = EVALUA_BATTERIES.find(b => b.id === selectedId) || EVALUA_BATTERIES[3];
  const currentAsInstrumento = getEvaluaAsInstrumento(currentBattery);
  const isFav = favoritos.includes(currentBattery.id);

  const getAreaBadgeColor = (area: string) => {
    switch (area.toLowerCase()) {
      case 'cognitiva':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'lectura':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'escritura':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'matemáticas':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'psicomotora':
        return 'bg-pink-50 text-pink-700 border-pink-200';
      case 'lenguaje':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'socioafectiva':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getAreaLabelChilena = (area: string) => {
    switch (area.toLowerCase()) {
      case 'cognitiva': return 'Bases Cognitivas';
      case 'lectura': return 'Procesos Lectores';
      case 'escritura': return 'Procesos Escritos';
      case 'matemáticas': return 'Competencia Matemática';
      case 'psicomotora': return 'Desarrollo Psicomotor';
      case 'lenguaje': return 'Lenguaje y Fonología';
      case 'socioafectiva': return 'Adaptación Socioafectiva';
      default: return area;
    }
  };

  const filteredSubtests = currentBattery.subtests.filter(sub => 
    sub.nombre.toLowerCase().includes(searchSubtestQuery.toLowerCase()) ||
    sub.descripcion.toLowerCase().includes(searchSubtestQuery.toLowerCase()) ||
    sub.area.toLowerCase().includes(searchSubtestQuery.toLowerCase())
  );

  return (
    <div className="space-y-6" id="seccion-evalua-dashboard">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-200 text-[11px] font-bold tracking-wider uppercase border border-indigo-400/20">
              <Award className="h-3.5 w-3.5 text-indigo-300" />
              Sello de Calidad Giunti Psychometrics
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
              Gama Técnica: Baterías EVALÚA
            </h2>
            <p className="text-indigo-200 text-xs sm:text-sm font-medium leading-relaxed">
              Explora las once versiones de las baterías psicopedagógicas más utilizadas en Chile para el diagnóstico psicopedagógico, ingresos y reevaluaciones en el marco de programas PIE (Decreto 170 y 83).
            </p>
          </div>
          <div className="shrink-0 flex flex-col gap-2 bg-white/5 backdrop-blur border border-white/10 p-4 rounded-2xl">
            <span className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest block">Distribuidor Oficial Chile</span>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-base text-white">Giunti Psychometrics</span>
              <a 
                href="https://www.giuntipsy.cl/test/bateria-psicopedagogica-evalua" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-300 hover:text-white transition-colors"
                title="Visitar sitio oficial"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <span className="text-[10px] text-indigo-300 font-semibold block">Versiones actualizadas 4.0 con corrección online</span>
          </div>
        </div>
      </div>

      {/* Selector Grid of Batteries (0 to 10) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-indigo-500" /> Selecciona una Batería Evalúa
          </span>
          <span className="text-[11px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full">
            11 Niveles Disponibles
          </span>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-11 gap-2">
          {EVALUA_BATTERIES.map((bat, idx) => {
            const isSelected = bat.id === selectedId;
            return (
              <button
                key={bat.id}
                id={`btn-select-${bat.id}`}
                onClick={() => setSelectedId(bat.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center relative overflow-hidden group ${
                  isSelected 
                    ? 'bg-gradient-to-b from-indigo-50 to-white border-indigo-500 ring-2 ring-indigo-100 shadow-sm' 
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                {/* Visual marker */}
                {isSelected && (
                  <span className="absolute top-0 inset-x-0 h-1 bg-indigo-600 rounded-full"></span>
                )}
                <span className={`text-base font-display font-black tracking-tight block ${
                  isSelected ? 'text-indigo-700 scale-110' : 'text-slate-800 group-hover:text-indigo-600'
                }`}>
                  EVALÚA {idx}
                </span>
                <span className="text-[9px] text-slate-500 font-bold block truncate w-full mt-1">
                  {idx === 0 ? 'Parvularia' : `${idx}° Básico`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two-Column Technical Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: Technical fact sheet */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-6">
            {/* Battery Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Ficha Técnica Completa
                </span>
                <h3 className="text-xl font-display font-bold text-slate-900">
                  {currentBattery.nombre}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Dirigido a: <strong className="text-slate-700">{currentBattery.destinatarios}</strong>
                </p>
              </div>

              {/* Action bar for current battery */}
              <div className="flex items-center gap-2">
                <button
                  id={`btn-fav-evalua-${currentBattery.id}`}
                  onClick={() => onToggleFavorito(currentBattery.id)}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isFav 
                      ? 'bg-rose-50 border-rose-200 text-rose-500' 
                      : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                  title={isFav ? "Quitar de favoritos" : "Marcar como favorito"}
                >
                  <Heart className={`h-4.5 w-4.5 ${isFav ? 'fill-rose-500' : ''}`} />
                </button>
                <button
                  id={`btn-cmp-evalua-${currentBattery.id}`}
                  onClick={() => onSendToComparador(currentBattery.id)}
                  className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  Comparar
                </button>
                <button
                  id={`btn-bld-evalua-${currentBattery.id}`}
                  onClick={() => onSendToConstructor(currentBattery.id)}
                  className="px-3.5 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-100 transition-colors flex items-center gap-1.5"
                >
                  <Wrench className="h-3.5 w-3.5" />
                  Montar Batería
                </button>
              </div>
            </div>

            {/* Quick specifications grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Autores</span>
                <span className="text-xs text-slate-800 font-bold block truncate" title={currentBattery.autores}>
                  {currentBattery.autores.split(',')[0]} y col.
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Rango Etario</span>
                <span className="text-xs text-slate-800 font-bold block">
                  {currentBattery.edad_rango}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tiempo Estimado</span>
                <span className="text-xs text-slate-800 font-bold block">
                  {currentBattery.tiempo}
                </span>
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Baremos Chilenos</span>
                <span className="text-xs text-emerald-700 font-bold block flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                  Homologado
                </span>
              </div>
            </div>

            {/* General description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-widest block flex items-center gap-1.5">
                <BookOpen className="h-4 w-4 text-indigo-500" /> Descripción General
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-normal bg-indigo-50/20 p-4 rounded-xl border border-indigo-100/30">
                {currentBattery.descripcion_general}
              </p>
            </div>

            {/* Chilean Context & PIE Guidelines Box */}
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
                  <FileCheck2 className="h-4 w-4 text-emerald-600" />
                </div>
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                  Relevancia en Programas de Integración Escolar (PIE) Chile
                </h4>
              </div>
              <div className="space-y-2 text-xs text-emerald-900 font-normal">
                <p className="leading-relaxed">
                  <strong>Decreto 170 / 83:</strong> {currentBattery.enfoque_pie}
                </p>
                <div className="bg-white/80 border border-emerald-100 rounded-lg p-2.5 text-[11px] leading-relaxed text-emerald-950">
                  <span className="font-bold text-emerald-800 block mb-0.5">Normas locales:</span>
                  {currentBattery.baremos}
                </div>
              </div>
            </div>

            {/* Editorial Metadata info */}
            <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] text-slate-600">
              <AlertCircle className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <strong>Nota de Aplicación:</strong> Al ser un test colectivo, puede aplicarse en formato de aula completa (Screening) o de forma individual para diagnóstico diferencial de sospechas específicas. El cuadernillo impreso requiere clave de acceso a la plataforma online de Giunti EOS para la obtención automatizada de perfiles y gráficos psicopedagógicos.
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Interactive Subtests grid */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <h4 className="text-sm font-display font-bold text-slate-900 flex items-center gap-1.5">
                  <Dna className="h-4.5 w-4.5 text-indigo-500 animate-pulse" />
                  Subtests de EVALÚA {selectedId.split('_')[1]}
                </h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  Estructura y Capacidades Evaluadas
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {currentBattery.subtests.length} Pruebas
              </span>
            </div>

            {/* Search filter for subtests */}
            <div className="relative">
              <input
                type="text"
                value={searchSubtestQuery}
                onChange={(e) => setSearchSubtestQuery(e.target.value)}
                placeholder="Filtrar por subtest, área o palabra clave..."
                className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:bg-white transition-all placeholder:text-slate-400"
              />
              <span className="absolute left-2.5 top-2.5 text-slate-400 text-xs">🔍</span>
            </div>

            {/* Subtests Scrollable Area */}
            <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
              {filteredSubtests.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs font-medium space-y-1">
                  <HelpCircle className="h-8 w-8 mx-auto text-slate-300" />
                  <p>No se encontraron subtests con esa descripción.</p>
                </div>
              ) : (
                filteredSubtests.map((sub, sidx) => (
                  <div 
                    key={sidx}
                    className="p-3.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-100 rounded-xl transition-all space-y-1.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 font-display">
                        {sub.nombre}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getAreaBadgeColor(sub.area)}`}>
                        {getAreaLabelChilena(sub.area)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 font-normal leading-relaxed">
                      {sub.descripcion}
                    </p>
                  </div>
                ))
              )}
            </div>

            {/* Footer counts of areas evaluated in the active battery */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block mb-2">Áreas de impacto del nivel</span>
              <div className="flex flex-wrap gap-1.5">
                {currentBattery.areas_principales.map(area => (
                  <span key={area} className="text-[10px] bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md">
                    {area}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
