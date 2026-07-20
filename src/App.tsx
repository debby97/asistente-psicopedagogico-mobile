import React, { useState } from 'react';
import { 
  getInitialDatabase, 
  saveDatabase, 
  DatabaseState 
} from './dbStore';
import { 
  Instrumento, 
  Caso, 
  Bateria, 
  BateriaItem, 
  AgendaItem, 
  ObservacionClinica, 
  Coleccion 
} from './types';

// Importar componentes modulares rediseñados
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import GestorCasos from './components/GestorCasos';
import Biblioteca from './components/Biblioteca';
import ColeccionesClinicas from './components/ColeccionesClinicas';
import Favoritos from './components/Favoritos';
import Configuracion from './components/Configuracion';
import MobileNavigation from './components/MobileNavigation';
import GlobalSearchBar from './components/GlobalSearchBar';
import InstrumentoDetailPanel from './components/InstrumentoDetailPanel';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Estados para enrutamiento unificado y paso de parámetros entre pestañas
  const [searchQueryState, setSearchQueryState] = useState('');
  const [selectedAreaState, setSelectedAreaState] = useState('Todos');
  const [selectedFolderArea, setSelectedFolderArea] = useState('');
  const [selectedCasoIdState, setSelectedCasoIdState] = useState('');
  const [startEvaluationWizard, setStartEvaluationWizard] = useState(false);
  const [quickViewIns, setQuickViewIns] = useState<Instrumento | null>(null);

  const [dbState, setDbState] = useState<DatabaseState>(getInitialDatabase);
  const [profName, setProfName] = useState(() => localStorage.getItem('prof_name') || '');
  const [profTitle, setProfTitle] = useState(() => localStorage.getItem('prof_title') || '');

  const handleProfileUpdate = (name: string, title: string) => {
    setProfName(name);
    setProfTitle(title);
  };

  // Helper para persistencia reactiva unificada
  const updateDatabaseState = (newState: DatabaseState) => {
    setDbState(newState);
    saveDatabase(newState);
  };

  // Enrutamiento inteligente cruzado sin fricción
  const handleNavigateToTab = (tab: string, extra?: any) => {
    setActiveTab(tab);
    if (tab === 'biblioteca') {
      setSearchQueryState(extra?.search ?? '');
      setSelectedAreaState(extra?.area ?? 'Todos');
    }
    if (tab === 'colecciones') {
      setSelectedFolderArea(extra?.area ?? '');
    }
    if (tab === 'casos') {
      setSelectedCasoIdState(extra?.casoId ?? '');
      setStartEvaluationWizard(extra?.startEval ?? false);
    }
  };

  // --- CONTROLES DE INSTRUMENTOS ---
  const handleAddInstrumento = (ins: Omit<Instrumento, 'id'>) => {
    const id = `sql_${Math.random().toString(36).substr(2, 9)}`;
    const newIns: Instrumento = { id, ...ins };
    
    const newState = {
      ...dbState,
      instrumentos: [...dbState.instrumentos, newIns]
    };
    updateDatabaseState(newState);
  };

  const handleDeleteInstrumento = (id: string) => {
    const newState = {
      ...dbState,
      instrumentos: dbState.instrumentos.filter(i => i.id !== id)
    };
    updateDatabaseState(newState);
  };

  const handleToggleFavorito = (id: string) => {
    const isFav = dbState.favoritos.some(f => f.instrumento_id === id);
    let newFavs = [];
    if (isFav) {
      newFavs = dbState.favoritos.filter(f => f.instrumento_id !== id);
    } else {
      newFavs = [...dbState.favoritos, { instrumento_id: id }];
    }

    const newState = {
      ...dbState,
      favoritos: newFavs
    };
    updateDatabaseState(newState);
  };

  // --- CONTROLES DE COLECCIONES ---
  const handleAddColeccion = (nombre: string, descripcion: string, initialInsIds?: string[]) => {
    const id = `col_${Math.random().toString(36).substr(2, 9)}`;
    const newCol: Coleccion = { id, nombre, descripcion };
    
    let newItems = [...dbState.coleccion_items];
    if (initialInsIds && initialInsIds.length > 0) {
      initialInsIds.forEach(insId => {
        const exists = newItems.some(item => item.coleccion_id === id && item.instrumento_id === insId);
        if (!exists) {
          newItems.push({ coleccion_id: id, instrumento_id: insId });
        }
      });
    }

    const newState = {
      ...dbState,
      colecciones: [...dbState.colecciones, newCol],
      coleccion_items: newItems
    };
    updateDatabaseState(newState);
  };

  const handleDeleteColeccion = (colId: string) => {
    const newState = {
      ...dbState,
      colecciones: dbState.colecciones.filter(col => col.id !== colId),
      coleccion_items: dbState.coleccion_items.filter(item => item.coleccion_id !== colId)
    };
    updateDatabaseState(newState);
  };

  const handleAddInstrumentoToColeccion = (colId: string, insId: string) => {
    const exists = dbState.coleccion_items.some(
      item => item.coleccion_id === colId && item.instrumento_id === insId
    );
    if (exists) return;

    const newState = {
      ...dbState,
      coleccion_items: [...dbState.coleccion_items, { coleccion_id: colId, instrumento_id: insId }]
    };
    updateDatabaseState(newState);
  };

  const handleRemoveInstrumentoFromColeccion = (colId: string, insId: string) => {
    const newState = {
      ...dbState,
      coleccion_items: dbState.coleccion_items.filter(
        item => !(item.coleccion_id === colId && item.instrumento_id === insId)
      )
    };
    updateDatabaseState(newState);
  };

  // Mapear coleccion_items para rápido acceso
  const coleccionItemsMapped: { [colId: string]: string[] } = {};
  dbState.colecciones.forEach(col => {
    coleccionItemsMapped[col.id] = dbState.coleccion_items
      .filter(item => item.coleccion_id === col.id)
      .map(item => item.instrumento_id);
  });

  // --- CONTROLES DE CASOS ---
  const handleAddCaso = (caso: Omit<Caso, 'id' | 'creado_en'>) => {
    const id = `caso_${Math.random().toString(36).substr(2, 9)}`;
    const creado_en = new Date().toISOString().split('T')[0];
    const newCaso: Caso = { 
      id, 
      nombre: caso.nombre,
      edad: caso.edad,
      curso: caso.curso || '',
      fecha: creado_en,
      motivo: caso.motivo_consulta,
      profesional: caso.nombre_apoderado || 'Especialista',
      estado: caso.estado 
    };

    const newState = {
      ...dbState,
      casos: [...dbState.casos, newCaso]
    };
    updateDatabaseState(newState);
  };

  const handleUpdateCaso = (id: string, casoUpdate: Partial<Caso>) => {
    const newState = {
      ...dbState,
      casos: dbState.casos.map(c => c.id === id ? { ...c, ...casoUpdate } : c)
    };
    updateDatabaseState(newState);
  };

  const handleDeleteCaso = (id: string) => {
    const newState = {
      ...dbState,
      casos: dbState.casos.filter(c => c.id !== id),
      observaciones: dbState.observaciones.filter(o => o.caso_id !== id),
      agenda: dbState.agenda.filter(a => a.caso_id !== id)
    };
    updateDatabaseState(newState);
  };

  // --- CONTROLES DE OBSERVACIONES CLÍNICAS ---
  const handleAddObservacion = (obs: Omit<ObservacionClinica, 'id' | 'creado_en'>) => {
    const id = `obs_${Math.random().toString(36).substr(2, 9)}`;
    const creado_en = new Date().toISOString().split('T')[0];
    
    const newObs = {
      id,
      caso_id: obs.caso_id,
      fecha: creado_en,
      conducta: obs.conducta_trabajo,
      atencion: obs.atencion_concentracion,
      motivacion: obs.motivacion,
      interaccion: obs.interaccion_social,
      lenguaje_espontaneo: obs.lenguaje_espontaneo,
      actitud: obs.actitud_ante_pruebas,
      observaciones_generales: obs.observaciones_generales
    };

    const newState = {
      ...dbState,
      observaciones: [...dbState.observaciones, newObs as any]
    };
    updateDatabaseState(newState);
  };

  const handleDeleteObservacion = (id: string) => {
    const newState = {
      ...dbState,
      observaciones: dbState.observaciones.filter(o => o.id !== id)
    };
    updateDatabaseState(newState);
  };

  // --- CONTROLES DE BATERÍAS ---
  const handleSaveBattery = (
    bateria: Omit<Bateria, 'id' | 'creado_en'>, 
    items: Array<{ instrumento_id: string; sesion: number; orden: number }>
  ) => {
    const batId = `bat_${Math.random().toString(36).substr(2, 9)}`;
    const creado_en = new Date().toISOString().split('T')[0];

    const newBat: Bateria = {
      id: batId,
      nombre: bateria.nombre,
      descripcion: bateria.descripcion,
      caso_id: bateria.caso_id || undefined,
      creado_en,
      es_plantilla: bateria.es_plantilla
    };

    const newItems: BateriaItem[] = items.map((it, idx) => ({
      id: `bi_${Math.random().toString(36).substr(2, 9)}`,
      bateria_id: batId,
      instrumento_id: it.instrumento_id,
      sesion: it.sesion,
      orden: it.orden || idx + 1
    }));

    const newState = {
      ...dbState,
      baterias: [...dbState.baterias, newBat],
      bateria_items: [...dbState.bateria_items, ...newItems]
    };
    updateDatabaseState(newState);
  };

  const handleDeleteBateria = (id: string) => {
    const newState = {
      ...dbState,
      baterias: dbState.baterias.filter(b => b.id !== id),
      bateria_items: dbState.bateria_items.filter(item => item.bateria_id !== id)
    };
    updateDatabaseState(newState);
  };

  // --- CONTROLES DE AGENDA ---
  const handleAddAgendaItem = (item: Omit<AgendaItem, 'id' | 'creado_en'>) => {
    const id = `ag_${Math.random().toString(36).substr(2, 9)}`;
    const creado_en = new Date().toISOString().split('T')[0];

    const newAg: AgendaItem = {
      id,
      caso_id: item.caso_id,
      titulo: item.titulo || `Sesión de ${item.tipo}`,
      tipo: item.tipo,
      fecha: item.fecha,
      hora: item.hora,
      notas: item.notas,
      completado: item.completado || false
    };

    const newState = {
      ...dbState,
      agenda: [...dbState.agenda, newAg]
    };
    updateDatabaseState(newState);
  };

  const handleToggleAgendaComplete = (id: string) => {
    const newState = {
      ...dbState,
      agenda: dbState.agenda.map(a => a.id === id ? { ...a, completado: !a.completado } : a)
    };
    updateDatabaseState(newState);
  };

  const handleDeleteAgendaItem = (id: string) => {
    const newState = {
      ...dbState,
      agenda: dbState.agenda.filter(a => a.id !== id)
    };
    updateDatabaseState(newState);
  };

  // --- RENDERIZADO DINÁMICO DE PESTAÑAS ---
  const renderContent = () => {
    // Adaptar variables de dbStore a las interfaces esperadas por componentes
    const uiCasos = dbState.casos.map(c => ({
      id: c.id,
      nombre: c.nombre,
      edad: c.edad,
      curso: c.curso,
      establecimiento_escolar: c.establecimiento_escolar,
      nombre_apoderado: c.profesional, // Mapeo de contacto/apoderado
      contacto: '',
      motivo_consulta: c.motivo,
      estado: c.estado as any
    }));

    const uiObservaciones = dbState.observaciones.map(o => ({
      id: o.id,
      caso_id: o.caso_id,
      creado_en: o.fecha,
      conducta_trabajo: o.conducta || 'Adecuada',
      atencion_concentracion: o.atencion || 'Sostenida',
      motivacion: o.motivacion || 'Alta',
      interaccion_social: o.interaccion || 'Colaborativa',
      actitud_ante_pruebas: o.actitud || 'Positiva',
      lenguaje_espontaneo: o.lenguaje_espontaneo,
      observaciones_generales: o.observaciones_generales
    }));

    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard
            instrumentos={dbState.instrumentos}
            favoritos={dbState.favoritos.map(f => f.instrumento_id)}
            casos={uiCasos}
            baterias={dbState.baterias}
            colecciones={dbState.colecciones}
            onToggleFavorito={handleToggleFavorito}
            onNavigateToTab={handleNavigateToTab}
            onAddCaso={handleAddCaso}
          />
        );
      case 'casos':
        return (
          <GestorCasos
            casos={uiCasos}
            observaciones={uiObservaciones}
            onAddCaso={handleAddCaso}
            onUpdateCaso={handleUpdateCaso}
            onDeleteCaso={handleDeleteCaso}
            onAddObservacion={handleAddObservacion}
            onDeleteObservacion={handleDeleteObservacion}
            baterias={dbState.baterias}
            bateriaItems={dbState.bateria_items}
            instrumentos={dbState.instrumentos}
            onSaveBattery={handleSaveBattery}
            onDeleteBateria={handleDeleteBateria}
            onAddAgendaItem={handleAddAgendaItem}
            initialSelectedCasoId={selectedCasoIdState}
            initialStartEval={startEvaluationWizard}
          />
        );
      case 'biblioteca':
        return (
          <Biblioteca
            instrumentos={dbState.instrumentos}
            favoritos={dbState.favoritos.map(f => f.instrumento_id)}
            colecciones={dbState.colecciones}
            onToggleFavorito={handleToggleFavorito}
            onAddInstrumento={handleAddInstrumento}
            onDeleteInstrumento={handleDeleteInstrumento}
            onAddColeccion={handleAddColeccion}
            onAddInstrumentoToColeccion={handleAddInstrumentoToColeccion}
            onRemoveInstrumentoFromColeccion={handleRemoveInstrumentoFromColeccion}
            coleccionItems={coleccionItemsMapped}
            initialSearch={searchQueryState}
            initialArea={selectedAreaState}
            searchTerm={searchQueryState}
            onSearchTermChange={setSearchQueryState}
          />
        );
      case 'colecciones':
        return (
          <ColeccionesClinicas
            instrumentos={dbState.instrumentos}
            colecciones={dbState.colecciones}
            coleccionItems={coleccionItemsMapped}
            onAddColeccion={handleAddColeccion}
            onDeleteColeccion={handleDeleteColeccion}
            onAddInstrumentoToColeccion={handleAddInstrumentoToColeccion}
            onRemoveInstrumentoFromColeccion={handleRemoveInstrumentoFromColeccion}
            onSendToComparador={() => {
              handleNavigateToTab('biblioteca', { search: '', area: 'Todos' });
            }}
            onSendToConstructor={(insIds) => {
              handleSaveBattery({
                nombre: `Batería Personalizada`,
                descripcion: `Creada a partir de carpetas de la biblioteca`,
                es_plantilla: true,
                caso_id: undefined
              }, insIds.map((id, index) => ({ instrumento_id: id, sesion: 1, orden: index + 1 })));
              alert('¡Batería guardada! Se puede aplicar ingresando al expediente de cualquier paciente.');
            }}
            initialArea={selectedFolderArea}
          />
        );
      case 'favoritos':
        return (
          <Favoritos
            instrumentos={dbState.instrumentos}
            favoritos={dbState.favoritos.map(f => f.instrumento_id)}
            onToggleFavorito={handleToggleFavorito}
          />
        );
      case 'configuracion':
        return (
          <Configuracion
            dbState={dbState}
            setDbState={updateDatabaseState}
            onProfileUpdate={handleProfileUpdate}
          />
        );
      default:
        return (
          <div className="py-12 text-center text-slate-500 font-semibold">
            Sección en desarrollo técnico.
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-slate-50 overflow-hidden font-sans antialiased text-slate-800 relative">
      {/* Background soft ambient lights */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[45%] h-[45%] rounded-full bg-indigo-300/10 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[0%] w-[35%] h-[55%] rounded-full bg-blue-300/10 blur-[100px]"></div>
      </div>

      {/* Mobile-specific Top and Bottom Navigation Bars */}
      <MobileNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={dbState.favoritos.length}
        professionalName={profName || undefined}
        professionalInitials={(() => {
          if (!profName) return undefined;
          const parts = profName.trim().split(/\s+/);
          if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
          }
          return profName.slice(0, 2).toUpperCase();
        })()}
      />

      {/* Sidebar Navigation (Hidden on mobile, visible on medium screens and up) */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        favoritesCount={dbState.favoritos.length} 
        profName={profName}
        profTitle={profTitle}
      />

      {/* Main Workspace Frame */}
      <main className="flex-1 overflow-y-auto bg-slate-50 p-4 sm:p-6 md:p-8 pb-24 md:pb-8 relative z-10">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Cabecera Principal - Logo PsicoPlan Centrado (Estilo Simple y Elegante) */}
          <div className="flex flex-col items-center justify-center pt-2 pb-1 text-center select-none">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="group cursor-pointer border-none bg-transparent focus:outline-none"
            >
              <div className="px-3.5 py-1.5 bg-[#F5D56E] rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all group-hover:-translate-y-0.5 group-hover:shadow-[3px_3px_0px_0px_#1A1A1A] duration-150">
                <h1 className="font-display font-black text-base sm:text-lg tracking-tight text-[#1A1A1A] leading-none">
                  Psico<span className="text-neopeach">Plan</span>
                </h1>
              </div>
            </button>
          </div>

          {renderContent()}
        </div>
      </main>

      {/* Ficha técnica rápida, accesible desde el buscador global en cualquier pantalla */}
      <InstrumentoDetailPanel
        instrumento={quickViewIns}
        onClose={() => setQuickViewIns(null)}
        isFavorito={quickViewIns ? dbState.favoritos.some(f => f.instrumento_id === quickViewIns.id) : false}
        onToggleFavorito={() => quickViewIns && handleToggleFavorito(quickViewIns.id)}
      />
    </div>
  );
}
