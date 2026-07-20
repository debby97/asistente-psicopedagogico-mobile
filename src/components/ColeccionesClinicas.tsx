import React, { useState } from 'react';
import { Instrumento, Coleccion } from '../types';
import { 
  Folder, 
  FolderPlus, 
  ChevronRight, 
  Search, 
  Trash2, 
  Plus, 
  Layers, 
  Columns, 
  X, 
  Check, 
  Info,
  Clock,
  Compass,
  ArrowLeft,
  Briefcase,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import InstrumentoDetailPanel from './InstrumentoDetailPanel';

interface ColeccionesClinicasProps {
  instrumentos: Instrumento[];
  colecciones: Coleccion[];
  coleccionItems: { [colId: string]: string[] };
  onAddColeccion: (nombre: string, descripcion: string) => void;
  onDeleteColeccion: (colId: string) => void;
  onAddInstrumentoToColeccion: (colId: string, insId: string) => void;
  onRemoveInstrumentoFromColeccion: (colId: string, insId: string) => void;
  onSendToComparador: (insIds: string[]) => void;
  onSendToConstructor: (insIds: string[]) => void;
  initialArea?: string;
}

export default function ColeccionesClinicas({
  instrumentos,
  colecciones,
  coleccionItems,
  onAddColeccion,
  onDeleteColeccion,
  onAddInstrumentoToColeccion,
  onRemoveInstrumentoFromColeccion,
  onSendToComparador,
  onSendToConstructor,
  initialArea
}: ColeccionesClinicasProps) {
  // Navigation states
  const [activeFolderId, setActiveFolderId] = useState<string | null>(initialArea || null);
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [folderDesc, setFolderDesc] = useState('');

  // Search inside active folder
  const [folderToDeleteId, setFolderToDeleteId] = useState<string | null>(null);
  const [innerSearch, setInnerSearch] = useState('');
  const [selectedIns, setSelectedIns] = useState<Instrumento | null>(null);
  const [showAddTestDropdown, setShowAddTestDropdown] = useState(false);

  // Determinar la lista de colecciones (solo carpetas reales creadas por el profesional)
  const getFoldersList = () => {
    const customFolders = colecciones.map(col => ({
      id: col.id,
      name: col.nombre,
      description: col.descripcion || 'Colección personalizada de pruebas clínicas.',
      isCustom: true,
      count: (coleccionItems[col.id] || []).length,
      itemIds: coleccionItems[col.id] || []
    }));

    return customFolders;
  };

  const folders = getFoldersList();
  
  // Si tenemos initialArea, seleccionamos esa carpeta automática o custom
  React.useEffect(() => {
    if (initialArea) {
      const match = folders.find(f => f.name.toLowerCase().includes(initialArea.toLowerCase()) || initialArea.toLowerCase().includes(f.name.toLowerCase()));
      if (match) {
        setActiveFolderId(match.id);
      }
    }
  }, [initialArea]);

  const activeFolder = folders.find(f => f.id === activeFolderId);

  // Instrumentos dentro de la carpeta activa
  const getActiveFolderInstruments = () => {
    if (!activeFolder) return [];
    
    let filtered = instrumentos.filter(ins => activeFolder.itemIds.includes(ins.id));
    if (innerSearch) {
      filtered = filtered.filter(ins => 
        ins.nombre.toLowerCase().includes(innerSearch.toLowerCase()) || 
        (ins.autor || '').toLowerCase().includes(innerSearch.toLowerCase())
      );
    }
    return filtered;
  };

  const folderInstruments = getActiveFolderInstruments();

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName) return;
    onAddColeccion(folderName, folderDesc);
    setFolderName('');
    setFolderDesc('');
    setShowCreateFolderModal(false);
  };

  const handleDeleteFolder = (id: string) => {
    setFolderToDeleteId(id);
  };

  // Encontrar instrumentos que se pueden agregar a la colección custom activa
  const getAddableInstruments = () => {
    if (!activeFolder || !activeFolder.isCustom) return [];
    return instrumentos.filter(ins => !activeFolder.itemIds.includes(ins.id));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2.5 border-dashed border-slate-300 pb-6">
        <div>
          <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-wider bg-[#F5D56E] px-3.5 py-1.5 rounded-full border-2 border-[#1A1A1A] shadow-[1.5px_1.5px_0px_0px_#1A1A1A] inline-block">
            Mis Colecciones
          </span>
          <h1 className="text-3xl font-display font-black text-[#1A1A1A] mt-3 tracking-tight">
            Navegación por Carpetas
          </h1>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Organiza tus tests clínicos en carpetas temáticas o utiliza las colecciones automáticas por área cognitiva.
          </p>
        </div>

        {!activeFolderId && (
          <button
            onClick={() => setShowCreateFolderModal(true)}
            className="flex items-center justify-center gap-2 px-5 py-3 text-xs font-black text-[#1A1A1A] bg-[#F79472] hover:bg-[#eb7d55] rounded-2xl border-2 border-[#1A1A1A] shadow-[3px_3px_0px_0px_#1A1A1A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#1A1A1A] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_#1A1A1A] transition-all"
          >
            <FolderPlus className="h-4.5 w-4.5" />
            Nueva Carpeta
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!activeFolderId ? (
          /* ROOT LEVEL: Folders Directory Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {folders.map((folder) => (
              <div
                key={folder.id}
                onClick={() => setActiveFolderId(folder.id)}
                className="p-5 bg-white border border-slate-200/60 rounded-2xl hover:border-indigo-300 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between group h-44 relative"
              >
                {/* Colored accent side tab */}
                <div className={`absolute top-0 left-0 bottom-0 w-1.5 rounded-l-2xl ${folder.isCustom ? 'bg-amber-400' : 'bg-indigo-500'}`} />
                
                <div className="pl-2">
                  <div className="flex items-center justify-between">
                    <Folder className={`h-8 w-8 ${folder.isCustom ? 'text-amber-500 fill-amber-100/40' : 'text-indigo-500 fill-indigo-100/40'}`} />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200/30">
                      {folder.count} tests
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors mt-4 leading-snug">
                    {folder.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 leading-normal font-semibold line-clamp-2 mt-1">
                    {folder.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 pl-2 mt-2 text-[10px] text-indigo-600 font-bold">
                  <span>{folder.isCustom ? 'Carpeta del profesional' : 'Área diagnóstica'}</span>
                  <span className="group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Abrir carpeta
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* DRILL-DOWN LEVEL: Inside Selected Folder Workspace */
          <div className="space-y-6">
            {/* Folder Breadcrumb bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-slate-200/60 rounded-2xl">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveFolderId(null);
                    setInnerSearch('');
                  }}
                  className="p-2.5 rounded-xl bg-white border-2 border-[#1A1A1A] hover:bg-[#FFF9F7] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all hover:translate-x-[-0.5px] hover:translate-y-[-0.5px] shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    <span>Mis Colecciones</span>
                    <ChevronRight className="h-3 w-3" />
                    <span className="text-slate-500">{activeFolder?.isCustom ? 'Personalizada' : 'Área'}</span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-800 leading-none mt-1 truncate">
                    📂 {activeFolder?.name}
                  </h3>
                </div>
              </div>

              {/* Actions for folder content */}
              {activeFolder && activeFolder.itemIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    onClick={() => onSendToConstructor(activeFolder.itemIds)}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-black text-[#1A1A1A] bg-[#A9D89F] hover:bg-[#97c58e] rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all hover:translate-x-[-0.5px] hover:translate-y-[-0.5px]"
                  >
                    <Layers className="h-4 w-4 text-[#1A1A1A]" />
                    Crear Batería
                  </button>
                  <button
                    onClick={() => onSendToComparador(activeFolder.itemIds.slice(0, 2))}
                    disabled={activeFolder.itemIds.length < 2}
                    className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-black text-[#1A1A1A] bg-[#95CBE7] hover:bg-[#83bad0] rounded-2xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all hover:translate-x-[-0.5px] hover:translate-y-[-0.5px] disabled:opacity-50"
                  >
                    <Columns className="h-4 w-4 text-[#1A1A1A]" />
                    Comparar Tests
                  </button>
                  {activeFolder.isCustom && (
                    <button
                      onClick={() => handleDeleteFolder(activeFolder.id)}
                      className="p-2 text-[#1A1A1A] bg-[#F79472] hover:bg-[#eb7d55] border-2 border-[#1A1A1A] shadow-[1.5px_1.5px_0px_0px_#1A1A1A] transition-all hover:translate-x-[-0.5px] hover:translate-y-[-0.5px] rounded-xl"
                      title="Eliminar esta carpeta"
                    >
                      <Trash2 className="h-4 w-4 text-[#1A1A1A]" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Folder Specific Search & Quick Add Section */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={innerSearch}
                  onChange={(e) => setInnerSearch(e.target.value)}
                  placeholder={`Buscar dentro de la carpeta ${activeFolder?.name}...`}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              {/* Add instrument specifically to this custom folder */}
              {activeFolder?.isCustom && (
                <div className="relative shrink-0 w-full sm:w-auto">
                  <button
                    onClick={() => setShowAddTestDropdown(!showAddTestDropdown)}
                    className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar Instrumento
                  </button>

                  {showAddTestDropdown && (
                    <div className="absolute right-0 top-full mt-2 bg-white border border-slate-200 rounded-xl shadow-xl z-20 w-64 max-h-56 overflow-y-auto p-1 divide-y divide-slate-100">
                      {getAddableInstruments().length > 0 ? (
                        getAddableInstruments().map(ins => (
                          <button
                            key={ins.id}
                            onClick={() => {
                              onAddInstrumentoToColeccion(activeFolder.id, ins.id);
                              setShowAddTestDropdown(false);
                            }}
                            className="w-full text-left px-3 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors truncate"
                          >
                            + {ins.nombre}
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-slate-400 text-[10px]">
                          Todos los instrumentos agregados.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Folder Content Grid */}
            {folderInstruments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {folderInstruments.map((ins) => (
                  <div
                    key={ins.id}
                    onClick={() => setSelectedIns(ins)}
                    className="p-5 bg-white border border-slate-200/60 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500/10 group-hover:bg-indigo-500 transition-colors" />

                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[9px] font-bold uppercase text-indigo-600 bg-indigo-50 border border-indigo-100/30 px-2 py-0.5 rounded-md truncate">
                          {ins.area}
                        </span>

                        {activeFolder?.isCustom && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveInstrumentoFromColeccion(activeFolder.id, ins.id);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50"
                            title="Quitar de esta colección"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>

                      <h3 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug line-clamp-2">
                        {ins.nombre}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1 truncate">
                        Por {ins.autor || 'Especialista'}
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
              <div className="text-center p-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Info className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-700">Carpeta vacía o sin coincidencias</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Añade instrumentos a esta colección o cambia el término de búsqueda actual.
                </p>
              </div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Slide-over details spec panel */}
      <InstrumentoDetailPanel
        instrumento={selectedIns}
        onClose={() => setSelectedIns(null)}
        isFavorito={selectedIns ? folderInstruments.includes(selectedIns) : false}
        onToggleFavorito={() => {}}
      />

      {/* Modal: Create Folder Form */}
      {showCreateFolderModal && (
        <div className="fixed inset-x-0 bottom-0 top-16 md:inset-0 bg-slate-950/25 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] max-w-md w-full overflow-hidden flex flex-col max-h-[calc(100dvh-6rem)]">
            <div className="px-6 py-4 border-b-2 border-[#1A1A1A] flex items-center justify-between bg-[#FFF9F7] shrink-0">
              <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider">Crear Nueva Carpeta</h3>
              <button
                onClick={() => setShowCreateFolderModal(false)}
                className="text-slate-500 hover:text-slate-800 text-xs font-black underline"
              >
                Cerrar
              </button>
            </div>
            <form onSubmit={handleCreateFolder} className="p-6 space-y-4 overflow-y-auto flex-1 bg-[#FFF9F7]/10">
              <div>
                <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Nombre de la carpeta</label>
                <input
                  type="text"
                  required
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  placeholder="Ej. Batería Evaluación TEA"
                  className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Descripción / Propósito</label>
                <textarea
                  rows={3}
                  value={folderDesc}
                  onChange={(e) => setFolderDesc(e.target.value)}
                  placeholder="Ej. Colección de pruebas para evaluar espectro autista en primer ciclo básico."
                  className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t-2 border-dashed border-[#1A1A1A]/20">
                <button
                  type="button"
                  onClick={() => setShowCreateFolderModal(false)}
                  className="px-4 py-2 text-xs font-black text-slate-500 hover:text-slate-800 underline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-black text-[#1A1A1A] bg-[#F79472] hover:bg-[#eb7d55] rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all active:translate-x-[1px] active:translate-y-[1px]"
                >
                  Crear Carpeta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Custom Delete Collection Confirmation */}
      {folderToDeleteId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] max-w-sm w-full p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-rose-600">
              ¿Eliminar Colección?
            </h3>
            
            <p className="text-xs text-slate-600 font-bold leading-relaxed">
              ¿Estás seguro de que deseas eliminar esta colección personalizada? Los instrumentos contenidos en ella no serán borrados del sistema.
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-dashed border-slate-200">
              <button
                type="button"
                onClick={() => setFolderToDeleteId(null)}
                className="px-4 py-2 text-xs font-black text-slate-500 hover:text-slate-800 underline"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteColeccion(folderToDeleteId);
                  setActiveFolderId(null);
                  setFolderToDeleteId(null);
                }}
                className="px-5 py-2.5 text-xs font-black text-white bg-rose-500 hover:bg-rose-600 rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all active:translate-x-[1px] active:translate-y-[1px]"
              >
                Eliminar Colección
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
