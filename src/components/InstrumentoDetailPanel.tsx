import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Heart, 
  User, 
  Calendar, 
  Clock, 
  FileText, 
  Tag, 
  CheckCircle, 
  Award, 
  Compass, 
  ExternalLink, 
  Bookmark,
  Layers,
  BookOpen
} from 'lucide-react';
import { Instrumento } from '../types';

interface InstrumentoDetailPanelProps {
  instrumento: Instrumento | null;
  onClose: () => void;
  isFavorito: boolean;
  onToggleFavorito: () => void;
  onAddToBattery?: (insId: string) => void;
  isInBattery?: boolean;
}

export default function InstrumentoDetailPanel({
  instrumento,
  onClose,
  isFavorito,
  onToggleFavorito,
  onAddToBattery,
  isInBattery = false
}: InstrumentoDetailPanelProps) {
  if (!instrumento) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-x-0 bottom-0 top-16 md:inset-0 z-50 overflow-hidden flex items-end md:items-stretch justify-end p-3 sm:p-4 md:p-0">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/20 backdrop-blur-xs transition-opacity"
        />

        {/* Sliding Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 220 }}
          className="relative w-full max-w-xl bg-white h-auto max-h-full md:h-full shadow-2xl flex flex-col z-10 border-2 md:border-y-0 md:border-r-0 md:border-l-2.5 border-[#1A1A1A] rounded-2xl md:rounded-none md:rounded-l-2xl overflow-hidden"
        >
          {/* Header Action Buttons */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3.5 md:py-4 border-b-2.5 border-[#1A1A1A] shrink-0 bg-[#FFF9F7]">
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleFavorito}
                className={`p-2 rounded-lg border-2 border-[#1A1A1A] transition-all hover:scale-105 ${
                  isFavorito 
                    ? 'bg-[#F79472] text-[#1A1A1A]' 
                    : 'bg-white text-slate-400 hover:text-rose-500 hover:border-[#1A1A1A]'
                }`}
                title={isFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos'}
              >
                <Heart className={`h-4 w-4 ${isFavorito ? 'fill-[#1A1A1A]' : ''}`} />
              </button>
              {onAddToBattery && (
                <button
                  onClick={() => onAddToBattery(instrumento.id)}
                  disabled={isInBattery}
                  className={`px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black border-2 border-[#1A1A1A] transition-all flex items-center gap-1.5 ${
                    isInBattery 
                      ? 'bg-[#A9D89F] text-[#1A1A1A]' 
                      : 'bg-[#95CBE7] text-[#1A1A1A] hover:bg-[#82b9d4] shadow-[1.5px_1.5px_0px_0px_#1A1A1A]'
                  }`}
                >
                  {isInBattery ? <CheckCircle className="h-3.5 w-3.5" /> : <Layers className="h-3.5 w-3.5" />}
                  <span className="hidden sm:inline">{isInBattery ? 'En Batería Activa' : 'Añadir a Batería'}</span>
                  <span className="inline sm:hidden">{isInBattery ? 'En Batería' : '+ Batería'}</span>
                </button>
              )}
            </div>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg border-2 border-[#1A1A1A] bg-[#FFF3F0] hover:bg-[#FCE3DF] text-[#1A1A1A] font-black text-xs shadow-[1.5px_1.5px_0px_0px_#1A1A1A] transition-all active:translate-x-[0.5px] active:translate-y-[0.5px] flex items-center gap-1 shrink-0"
            >
              <X className="h-4.5 w-4.5" />
              <span>Cerrar</span>
            </button>
          </div>

          {/* Panel Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-8 space-y-5 md:space-y-6">
            {/* Instrument Title & Sub-heading */}
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-[#F5D56E] text-[#1A1A1A] border-2 border-[#1A1A1A] mb-3 shadow-[1px_1px_0px_0px_#1A1A1A]">
                {instrumento.area}
              </span>
              <h2 className="text-xl font-display font-black text-[#1A1A1A] leading-snug">
                {instrumento.nombre}
              </h2>
              {instrumento.nombres_alternativos && (
                <p className="text-xs font-bold text-slate-500 mt-1">
                  También conocido como: <span className="text-slate-600 italic">{instrumento.nombres_alternativos}</span>
                </p>
              )}
            </div>

            {/* Quick specifications grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 p-4 bg-[#FFF9F7] rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
              <div className="flex items-start gap-2.5">
                <User className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Autor</span>
                  <span className="text-xs font-semibold text-slate-700 leading-normal block mt-0.5">{instrumento.autor || 'No registrado'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Calendar className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Edición / Año</span>
                  <span className="text-xs font-semibold text-slate-700 leading-normal block mt-0.5">
                    {instrumento.anio ? `${instrumento.anio}` : 'S/I'} {instrumento.ultima_edicion ? `(Últ. ed: ${instrumento.ultima_edicion})` : ''}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Tiempo Estimado</span>
                  <span className="text-xs font-semibold text-slate-700 leading-normal block mt-0.5">{instrumento.tiempo_aproximado || instrumento.duracion || 'Variable'}</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Compass className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block leading-none">Público Objetivo</span>
                  <span className="text-xs font-semibold text-slate-700 leading-normal block mt-0.5">
                    {instrumento.edad_aplicacion} {instrumento.curso_recomendado ? `(${instrumento.curso_recomendado})` : ''}
                  </span>
                </div>
              </div>
            </div>

            {/* Detailed sections */}
            <div className="space-y-5">
              {/* ¿Qué evalúa? */}
              {(instrumento.que_evalua || instrumento.observaciones) && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-indigo-500" />
                    Propósito & Objetivos Evaluados
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-100 rounded-xl p-4 shadow-xs">
                    {instrumento.que_evalua || instrumento.observaciones}
                  </p>
                </div>
              )}

              {/* Subescalas o Dimensiones */}
              {instrumento.subescalas_dimensiones && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="h-3.5 w-3.5 text-indigo-500" />
                    Subescalas & Dimensiones
                  </h3>
                  <div className="flex flex-wrap gap-1.5 bg-white border border-slate-100 rounded-xl p-4 shadow-xs">
                    {instrumento.subescalas_dimensiones.split(',').map((sub, i) => (
                      <span key={i} className="text-xs bg-slate-50 text-slate-600 font-medium px-2 py-1 rounded-md border border-slate-100">
                        {sub.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Materiales requeridos */}
              {instrumento.materiales_requeridos && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-indigo-500" />
                    Kit de Materiales & Protocolos
                  </h3>
                  <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs space-y-2">
                    {instrumento.materiales_requeridos.split(',').map((mat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        <span>{mat.trim()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Validaciones Científicas / Adaptación Chilena */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5 text-indigo-500" />
                  Estandarización & Confiabilidad
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 bg-white border border-slate-100 rounded-xl shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase leading-none">Norma Chilena</span>
                    <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 text-xs font-bold rounded ${
                      instrumento.adaptacion_chilena === 'Sí' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {instrumento.adaptacion_chilena === 'Sí' ? 'Estandarizado en Chile' : 'Estandarización Extranjera'}
                    </span>
                    {instrumento.adaptaciones_otros_paises && (
                      <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                        Otras adaptaciones: {instrumento.adaptaciones_otros_paises}
                      </p>
                    )}
                  </div>
                  <div className="p-3.5 bg-white border border-slate-100 rounded-xl shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase leading-none">Evidencia Científica</span>
                    <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 text-xs font-bold rounded ${
                      instrumento.nivel_evidencia === 'Alto' 
                        ? 'bg-indigo-50 text-indigo-700' 
                        : instrumento.nivel_evidencia === 'Medio'
                        ? 'bg-sky-50 text-sky-700'
                        : 'bg-slate-50 text-slate-600'
                    }`}>
                      Nivel {instrumento.nivel_evidencia || 'Medio'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Baremos & Formato */}
              {(instrumento.baremos_disponibles || instrumento.formato) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {instrumento.baremos_disponibles && (
                    <div className="p-3.5 bg-white border border-slate-100 rounded-xl shadow-xs">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase leading-none">Baremos Disponibles</span>
                      <span className="text-xs font-semibold text-slate-700 mt-1.5 block leading-normal">{instrumento.baremos_disponibles}</span>
                    </div>
                  )}
                  {instrumento.formato && (
                    <div className="p-3.5 bg-white border border-slate-100 rounded-xl shadow-xs">
                      <span className="text-[10px] font-bold text-slate-400 block uppercase leading-none">Formato</span>
                      <span className="text-xs font-semibold text-slate-700 mt-1.5 block leading-normal">{instrumento.formato}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Bibliografía & Editorial */}
              {(instrumento.editorial || instrumento.referencias_bibliograficas || instrumento.enlace_editorial) && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                    Referencias & Editorial
                  </h3>
                  <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-xs space-y-2.5">
                    {instrumento.editorial && (
                      <p className="text-xs text-slate-600">
                        <span className="font-bold text-slate-500">Editorial:</span> {instrumento.editorial}
                      </p>
                    )}
                    {instrumento.referencias_bibliograficas && (
                      <p className="text-xs text-slate-500 leading-relaxed italic border-t border-slate-100 pt-2.5 mt-2">
                        {instrumento.referencias_bibliograficas}
                      </p>
                    )}
                    {instrumento.enlace_editorial && (
                      <a
                        href={instrumento.enlace_editorial}
                        target="_blank"
                        referrerPolicy="no-referrer"
                        className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors mt-1"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Visitar sitio oficial
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
