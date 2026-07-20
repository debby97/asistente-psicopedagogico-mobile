import React, { useState, useEffect } from 'react';
import { Caso, ObservacionClinica, Bateria, BateriaItem, Instrumento } from '../types';
import { supabase } from '../licensing/supabaseClient';
import { 
  Users, 
  Plus, 
  Trash2, 
  Check, 
  FileText, 
  UserPlus, 
  Calendar, 
  Layers, 
  AlertCircle,
  Eye,
  Settings,
  X,
  Edit2,
  Heart,
  Shield,
  Lock,
  Unlock,
  Printer,
  Copy,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  BookOpen,
  ArrowLeft,
  ChevronLeft,
  CheckCircle,
  BarChart,
  UserCheck,
  Info,
  Brain,
  Loader2,
  Send
} from 'lucide-react';
import { AREAS_EVALUAR } from '../utils/areaMapper';

interface GestorCasosProps {
  casos: Caso[];
  observaciones: ObservacionClinica[];
  onAddCaso: (caso: Omit<Caso, 'id' | 'creado_en'>) => void;
  onUpdateCaso: (id: string, caso: Partial<Caso>) => void;
  onDeleteCaso: (id: string) => void;
  onAddObservacion: (obs: Omit<ObservacionClinica, 'id' | 'creado_en'>) => void;
  onDeleteObservacion: (id: string) => void;
  baterias: Bateria[];
  bateriaItems: BateriaItem[];
  instrumentos: Instrumento[];
  onSaveBattery: (
    bateria: Omit<Bateria, 'id' | 'creado_en'>, 
    items: Array<{ instrumento_id: string; sesion: number; orden: number }>
  ) => void;
  onDeleteBateria: (id: string) => void;
  onAddAgendaItem?: (item: any) => void;
  initialSelectedCasoId?: string;
  initialStartEval?: boolean;
}

type UserRole = 'admin' | 'clinico' | 'lector';

export default function GestorCasos({
  casos,
  observaciones,
  onAddCaso,
  onUpdateCaso,
  onDeleteCaso,
  onAddObservacion,
  onDeleteObservacion,
  baterias,
  bateriaItems,
  instrumentos,
  onSaveBattery,
  onDeleteBateria,
  onAddAgendaItem,
  initialSelectedCasoId = '',
  initialStartEval = false
}: GestorCasosProps) {
  const [selectedCasoId, setSelectedCasoId] = useState<string>(initialSelectedCasoId || casos[0]?.id || '');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showObsModal, setShowObsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'baterias' | 'observaciones' | 'informes'>('baterias');

  // --- Clinical Wizard State ---
  const [showWizard, setShowWizard] = useState(initialStartEval);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardMotive, setWizardMotive] = useState('Dificultades de lectura');
  const [wizardAreas, setWizardAreas] = useState<string[]>(['Procesos lectores']);
  const [wizardSessionsCount, setWizardSessionsCount] = useState<number>(2);
  const [wizardSelectedTests, setWizardSelectedTests] = useState<Array<{
    instrumento: Instrumento;
    razon: string;
    sesion: number;
  }>>([]);
  const [wizardUseAI, setWizardUseAI] = useState<boolean>(true); // Activado por defecto para facilitar su uso directo
  const [wizardCustomQuery, setWizardCustomQuery] = useState<string>('');
  const [wizardIsAiLoading, setWizardIsAiLoading] = useState<boolean>(false);
  const [wizardAiError, setWizardAiError] = useState<string | null>(null);

  // --- Institutional Roles (Funcionalidades existentes garantizadas) ---
  const [activeRole, setActiveRole] = useState<UserRole>('admin');
  const [permissionAlert, setPermissionAlert] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // --- Report Generator State ---
  const [reportTemplate, setReportTemplate] = useState<'escolar' | 'clinico' | 'neuropsicologico'>('escolar');
  const [diagConclusions, setDiagConclusions] = useState('Se aprecian dificultades específicas en la decodificación fonológica y velocidad lectora, consistentes con un perfil de dislexia de desarrollo. El razonamiento perceptual y funciones ejecutivas se encuentran preservados.');
  const [recSchool, setRecSchool] = useState('Otorgar tiempo adicional de un 30% en evaluaciones escritas. Priorizar las evaluaciones orales. Evitar la lectura obligatoria en voz alta frente al grupo curso sin preparación previa.');
  const [recFamily, setRecFamily] = useState('Establecer rutinas de lectura compartida de 10 minutos diarios con textos de alta motivación. Reforzar positivamente los avances evitando el castigo asociado a calificaciones descendidas.');
  const [reportGenerated, setReportGenerated] = useState(false);
  const [clipboardToast, setClipboardToast] = useState(false);

  // Case Form States
  const [mobileViewMode, setMobileViewMode] = useState<'burbujas' | 'tabla'>('burbujas');
  const [cNombre, setCNombre] = useState('');
  const [cEdad, setCEdad] = useState<number>(8);
  const [cCurso, setCCurso] = useState('');
  const [cEstablecimiento, setCEstablecimiento] = useState('');
  const [cApoderado, setCApoderado] = useState('');
  const [cMotivo, setCMotivo] = useState('');

  // Observation Form States
  const [obsConducta, setObsConducta] = useState('Adecuada');
  const [obsAtencion, setObsAtencion] = useState('Sostenida');
  const [obsMotivacion, setObsMotivacion] = useState('Alta');
  const [obsInteraccion, setObsInteraccion] = useState('Colaborativa');
  const [obsActitud, setObsActitud] = useState('Positiva');
  const [obsNotasGenerales, setObsNotasGenerales] = useState('');

  const activeCaso = casos.find(c => c.id === selectedCasoId);
  const activeObservaciones = observaciones.filter(o => o.caso_id === selectedCasoId);
  const activeBaterias = baterias.filter(b => b.caso_id === selectedCasoId);

  useEffect(() => {
    if (initialSelectedCasoId) {
      setSelectedCasoId(initialSelectedCasoId);
    }
  }, [initialSelectedCasoId]);

  useEffect(() => {
    if (initialStartEval) {
      setShowWizard(true);
      setWizardStep(1);
    }
  }, [initialStartEval]);

  const checkPermission = (action: 'edit' | 'delete'): boolean => {
    if (activeRole === 'lector') {
      setPermissionAlert('Permiso Denegado: Su cuenta institucional está en modo "Visualizador / Directivo" (Solo Lectura).');
      setTimeout(() => setPermissionAlert(null), 4000);
      return false;
    }
    if (action === 'delete' && activeRole !== 'admin') {
      setPermissionAlert('Permiso Denegado: Solo los usuarios con rol "Administrador" pueden eliminar expedientes de pacientes.');
      setTimeout(() => setPermissionAlert(null), 4000);
      return false;
    }
    return true;
  };

  const handleCreateCaso = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPermission('edit')) return;
    if (!cNombre) return;

    onAddCaso({
      nombre: cNombre,
      edad: cEdad,
      curso: cCurso,
      estado: 'Pendiente',
      establecimiento_escolar: cEstablecimiento,
      nombre_apoderado: cApoderado,
      motivo_consulta: cMotivo
    });

    setCNombre('');
    setCEdad(8);
    setCCurso('');
    setCEstablecimiento('');
    setCApoderado('');
    setCMotivo('');
    setShowAddModal(false);
  };

  const handleDeleteCasoClick = (id: string) => {
    if (!checkPermission('delete')) return;
    setShowDeleteConfirm(true);
  };

  const handleConfirmDeleteCaso = () => {
    if (!activeCaso) return;
    onDeleteCaso(activeCaso.id);
    setSelectedCasoId(casos.find(c => c.id !== activeCaso.id)?.id || '');
    setShowDeleteConfirm(false);
  };

  const handleCreateObservacion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkPermission('edit')) return;
    if (!selectedCasoId) return;

    onAddObservacion({
      caso_id: selectedCasoId,
      conducta_trabajo: obsConducta,
      atencion_concentracion: obsAtencion,
      motivacion: obsMotivacion,
      interaccion_social: obsInteraccion,
      actitud_ante_pruebas: obsActitud,
      observaciones_generales: obsNotasGenerales
    });

    setObsConducta('Adecuada');
    setObsAtencion('Sostenida');
    setObsMotivacion('Alta');
    setObsInteraccion('Colaborativa');
    setObsActitud('Positiva');
    setObsNotasGenerales('');
    setShowObsModal(false);
  };

  // --- Dynamic Selection Decision Tree Logic ---
  const isAgeCompatible = (edadPaciente: number, edadAplicacion: string): boolean => {
    if (!edadAplicacion) return true;
    const text = edadAplicacion.toLowerCase();
    
    // Adultos/Adults descriptive checks
    if ((text.includes('adulto') || text.includes('senil') || text.includes('vejez') || text.includes('geronto') || text.includes('wais')) && edadPaciente >= 16) {
      return true;
    }
    
    // Infant/Adolescent descriptive checks
    if (text.includes('infantil') || text.includes('niño') || text.includes('nino')) {
      if (edadPaciente <= 12) return true;
    }
    if (text.includes('adolescente')) {
      if (edadPaciente >= 11 && edadPaciente <= 19) return true;
    }

    // Extract numbers from something like "6 a 12 años", "5 a 18 años", "3 a 6", etc.
    const numbers = text.match(/\d+/g);
    if (numbers && numbers.length >= 2) {
      const min = parseInt(numbers[0], 10);
      const max = parseInt(numbers[1], 10);
      
      if (text.includes('mes') || text.includes('meses')) {
        const edadMeses = edadPaciente * 12;
        return edadMeses >= min && edadMeses <= max;
      }
      
      return edadPaciente >= min && edadPaciente <= max;
    } else if (numbers && numbers.length === 1) {
      const val = parseInt(numbers[0], 10);
      if (text.includes('mes') || text.includes('meses')) {
        const edadMeses = edadPaciente * 12;
        if (text.includes('desde') || text.includes('adelante') || text.includes('más') || text.includes('mas')) {
          return edadMeses >= val;
        }
        return edadMeses <= val;
      } else {
        if (text.includes('desde') || text.includes('adelante') || text.includes('más') || text.includes('mas') || text.includes('mayor')) {
          return edadPaciente >= val;
        }
        return edadPaciente <= val || Math.abs(edadPaciente - val) <= 1;
      }
    }
    
    if (text.includes('básico') || text.includes('basico') || text.includes('kínder') || text.includes('kinder') || text.includes('medio')) {
      return edadPaciente >= 4 && edadPaciente <= 18;
    }
    
    return true; // Fallback
  };

  const handleWizardNext = async () => {
    if (wizardStep === 1) {
      if (wizardUseAI) {
        setWizardIsAiLoading(true);
        setWizardAiError(null);
        try {
          const { data, error: fnError } = await supabase.functions.invoke('recommend-instruments', {
            body: {
              motive: wizardMotive,
              edad: activeCaso ? activeCaso.edad : 8,
              curso: activeCaso ? activeCaso.curso : 'No especificado',
              customQuery: wizardCustomQuery,
              availableInstruments: instrumentos.map(ins => ({
                id: ins.id,
                nombre: ins.nombre,
                area: ins.area,
                subarea: ins.subarea,
                edad_aplicacion: ins.edad_aplicacion,
                que_evalua: ins.que_evalua ? ins.que_evalua.substring(0, 200) : '',
                adaptacion_chilena: ins.adaptacion_chilena
              })),
              sessionsCount: wizardSessionsCount
            }
          });

          if (fnError) {
            throw new Error((data && data.error) || fnError.message || 'Error al obtener recomendaciones de IA');
          }
          if (data && data.error) {
            throw new Error(data.error);
          }

          if (data && Array.isArray(data.recommendations)) {
            const matched: Array<{ instrumento: Instrumento; razon: string; sesion: number }> = [];
            data.recommendations.forEach((rec: any) => {
              const matchedInst = instrumentos.find(ins => ins.id === rec.instrumentId);
              if (matchedInst) {
                matched.push({
                  instrumento: matchedInst,
                  razon: rec.reason,
                  sesion: rec.session || 1
                });
              }
            });

            if (matched.length === 0) {
              throw new Error("La IA de selección no encontró instrumentos idóneos compatibles con la edad del paciente en el catálogo.");
            }

            setWizardSelectedTests(matched);
            setWizardStep(2);
          } else {
            throw new Error("La respuesta de la IA no contiene el formato esperado de recomendaciones.");
          }
        } catch (error: any) {
          console.error("Error en recomendación IA:", error);
          setWizardAiError(error.message || 'Error de comunicación con el servicio de IA. Inténtalo de nuevo o usa el Filtro de Catálogo Estándar.');
          return;
        } finally {
          setWizardIsAiLoading(false);
        }
      } else {
        // Generar recomendaciones dinámicas basadas en edad y áreas seleccionadas (ALGORITMO ESTÁNDAR)
        const matched: Array<{ instrumento: Instrumento; razon: string; sesion: number }> = [];
        const currentEdad = activeCaso ? activeCaso.edad : 8;

        wizardAreas.forEach((area) => {
          // Filtrar instrumentos de la base de datos que correspondan exactamente al área seleccionada
          const candidates = instrumentos.filter(ins => ins.area.toLowerCase() === area.toLowerCase());
          
          // Verificar compatibilidad de edad para cada candidato
          const compatibleCandidates = candidates.filter(cand => isAgeCompatible(currentEdad, cand.edad_aplicacion));
          
          // Ordenar candidatos para priorizar:
          // 1. Los que tienen adaptación chilena ('Sí') que es crucial para la pertinencia psicopedagógica en el país
          // 2. Nivel de evidencia alto
          const sortedCandidates = [...compatibleCandidates].sort((a, b) => {
            const aChile = a.adaptacion_chilena === 'Sí' ? 1 : 0;
            const bChile = b.adaptacion_chilena === 'Sí' ? 1 : 0;
            if (aChile !== bChile) return bChile - aChile;
            
            const aEv = a.nivel_evidencia === 'Alto' ? 1 : 0;
            const bEv = b.nivel_evidencia === 'Alto' ? 1 : 0;
            if (aEv !== bEv) return bEv - aEv;
            
            return a.nombre.localeCompare(b.nombre);
          });

          // Seleccionar hasta los mejores 4 instrumentos por cada área
          const topCandidates = sortedCandidates.slice(0, 4);

          topCandidates.forEach(cand => {
            const isChilean = cand.adaptacion_chilena === 'Sí';
            const esEvalua = cand.id.startsWith('evalua_');
            let razon = "";

            if (esEvalua) {
              razon = `${cand.nombre}: Batería psicopedagógica de amplio uso en Chile, ideal para screening en el rango de ${cand.edad_aplicacion}.`;
            } else {
              const basicReason = cand.que_evalua 
                ? cand.que_evalua.replace(/^evaluar los /i, 'Evalúa los ').replace(/^evaluar el /i, 'Evalúa el ').replace(/^evaluar la /i, 'Evalúa la ').replace(/^evaluar /i, 'Evalúa ')
                : 'Evalúa competencias fundamentales en este dominio psicopedagógico.';
              
              // Limitar longitud de la descripción en el razonamiento
              const maxLen = 140;
              const shortReason = basicReason.length > maxLen ? basicReason.substring(0, maxLen) + '...' : basicReason;

              razon = `${shortReason} ${isChilean ? 'Cuenta con adaptación y baremos chilenos.' : 'Estándar clínico internacional.'}`;
            }

            matched.push({
              instrumento: cand,
              razon,
              sesion: matched.length % wizardSessionsCount + 1
            });
          });
        });

        // Si por filtros de edad muy estrictos no hay ningún match, ofrecer opciones generales de esa área como fallback
        if (matched.length === 0) {
          wizardAreas.forEach((area) => {
            const candidates = instrumentos.filter(ins => ins.area.toLowerCase() === area.toLowerCase());
            candidates.slice(0, 2).forEach(cand => {
              matched.push({
                instrumento: cand,
                razon: `Aplicable según criterio clínico. Rango sugerido: ${cand.edad_aplicacion}.`,
                sesion: matched.length % wizardSessionsCount + 1
              });
            });
          });
        }

        setWizardSelectedTests(matched);
        setWizardStep(2);
      }
    } else if (wizardStep === 2) {
      setWizardStep(3);
    }
  };

  const handleWizardFinish = () => {
    if (!activeCaso) return;

    // Crear la batería asociada
    const batteryName = `Batería: ${wizardMotive} (${activeCaso.nombre})`;
    const batteryDesc = `Plan de evaluación inteligente diseñado para motivos de "${wizardMotive}" con enfoque en áreas seleccionadas.`;

    onSaveBattery(
      {
        nombre: batteryName,
        descripcion: batteryDesc,
        caso_id: activeCaso.id,
        es_plantilla: false
      },
      wizardSelectedTests.map((it, idx) => ({
        instrumento_id: it.instrumento.id,
        sesion: it.sesion,
        orden: idx + 1
      }))
    );

    // Agenda opcional
    if (onAddAgendaItem) {
      for (let s = 1; s <= wizardSessionsCount; s++) {
        onAddAgendaItem({
          caso_id: activeCaso.id,
          titulo: `Sesión ${s}: Aplicación Batería Psicopedagógica`,
          tipo: 'Evaluación',
          fecha: new Date(Date.now() + s * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          hora: '10:00',
          notas: `Aplicar instrumentos correspondientes a la sesión número ${s}.`,
          completado: false
        });
      }
    }

    setShowWizard(false);
    setWizardStep(1);
    setActiveTab('baterias');
    alert('¡Batería de evaluación y citas calendarizadas creadas con éxito!');
  };

  const handleCopyReportToClipboard = () => {
    const textToCopy = `INFORME PSICOPEDAGÓGICO DE EVALUACIÓN
----------------------------------------------
Paciente: ${activeCaso?.nombre}
Edad: ${activeCaso?.edad} años
Establecimiento: ${activeCaso?.establecimiento_escolar || 'N/A'}
Curso: ${activeCaso?.curso || 'N/A'}

I. CONCLUSIÓN DIAGNÓSTICA:
${diagConclusions}

II. RECOMENDACIONES ESCOLARES:
${recSchool}

III. RECOMENDACIONES FAMILIARES:
${recFamily}
`;
    navigator.clipboard.writeText(textToCopy);
    setClipboardToast(true);
    setTimeout(() => setClipboardToast(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6 md:gap-8">
      {/* LEFT COLUMN: Cases files panel */}
      <div className="md:col-span-1 lg:col-span-4 bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="h-4 w-4 text-slate-500" />
            Casos Clínicos ({casos.length})
          </h3>
          <button
            onClick={() => setShowAddModal(true)}
            className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors"
            title="Crear expediente de paciente"
          >
            <UserPlus className="h-4 w-4" />
          </button>
        </div>

        {permissionAlert && (
          <div className="p-3 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-lg border border-rose-100 flex items-start gap-1.5 animate-pulse">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{permissionAlert}</span>
          </div>
        )}

        {/* Case lists search / scrollable */}
        <div className="space-y-2 max-h-[550px] overflow-y-auto pr-1">
          {casos.map((caso) => {
            const isSelected = caso.id === selectedCasoId;
            return (
              <div
                key={caso.id}
                onClick={() => {
                  setSelectedCasoId(caso.id);
                  setShowWizard(false);
                }}
                className={`p-3.5 rounded-xl border cursor-pointer transition-fluent flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-[#F5D56E]/10 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]' 
                    : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-slate-800 truncate">
                    {caso.nombre}
                  </h4>
                  <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded ${
                    caso.estado === 'Finalizado' 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/30' 
                      : caso.estado === 'En Proceso'
                      ? 'bg-amber-50 text-amber-700 border border-amber-100/30'
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {caso.estado}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 font-medium">
                  <span>{caso.edad} años • {caso.curso || 'Sin curso'}</span>
                  <span className="text-indigo-600 font-bold flex items-center gap-0.5">
                    Ver expediente
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: Full central Workspace folder of selected patient */}
      <div className="md:col-span-2 lg:col-span-8 space-y-6">
        {activeCaso ? (
          <>
            {/* Patient Header Card */}
            <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-indigo-600" />
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded uppercase">
                    ID: {activeCaso.id}
                  </span>
                  <h2 className="text-xl font-bold text-slate-800 tracking-tight mt-2">{activeCaso.nombre}</h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Colegio: <span className="font-semibold text-slate-700">{activeCaso.establecimiento_escolar || 'No registrado'}</span> • Curso: <span className="font-semibold text-slate-700">{activeCaso.curso || 'No registrado'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowWizard(true)}
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-md shadow-indigo-100"
                  >
                    <Sparkles className="h-4 w-4" />
                    + Crear Evaluación
                  </button>
                  <button
                    onClick={() => handleDeleteCasoClick(activeCaso.id)}
                    className="p-2 text-rose-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Archivar caso"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {activeCaso.motivo && (
                <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block leading-none">Motivo de consulta principal</span>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed italic">
                    "{activeCaso.motivo}"
                  </p>
                </div>
              )}
            </div>

            {/* Step-by-Step Intelligent Assessment Wizard Overlay */}
            {showWizard && (
              <div className="bg-[#FFF9F7] text-[#1A1A1A] rounded-2xl p-6 shadow-[4px_4px_0px_0px_#1A1A1A] border-2 border-[#1A1A1A] space-y-6">
                <div className="flex items-center justify-between border-b-2 border-[#1A1A1A] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#F5D56E] text-[#1A1A1A] rounded-lg border-2 border-[#1A1A1A] shadow-[1.5px_1.5px_0px_0px_#1A1A1A]">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-[#1A1A1A]">Asistente Clínico de Evaluación</h3>
                      <p className="text-[10px] text-slate-600 font-bold mt-0.5">Creación de planes diagnósticos eficientes y adaptados.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowWizard(false)}
                    className="px-3 py-1.5 bg-white hover:bg-slate-50 text-[#1A1A1A] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] text-xs font-black rounded-lg transition-all"
                  >
                    Cerrar Asistente
                  </button>
                </div>

                {/* Steps Breadcrumbs */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <span className={`px-2 py-1 rounded-md border-2 ${wizardStep === 1 ? 'bg-[#F5D56E] border-[#1A1A1A] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]' : 'bg-white border-slate-200 text-slate-400'}`}>1. Criterios</span>
                  <ArrowRight className="h-3 w-3 text-[#1A1A1A]" />
                  <span className={`px-2 py-1 rounded-md border-2 ${wizardStep === 2 ? 'bg-[#F5D56E] border-[#1A1A1A] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]' : 'bg-white border-slate-200 text-slate-400'}`}>2. Diagnóstico</span>
                  <ArrowRight className="h-3 w-3 text-[#1A1A1A]" />
                  <span className={`px-2 py-1 rounded-md border-2 ${wizardStep === 3 ? 'bg-[#F5D56E] border-[#1A1A1A] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]' : 'bg-white border-slate-200 text-slate-400'}`}>3. Calendarización</span>
                </div>

                {/* STEP 1: Clinical Motives & Cognition areas */}
                {wizardStep === 1 && !wizardIsAiLoading && !wizardAiError && (
                  <div className="space-y-4">
                    {/* Switcher for AI vs Standard Filter */}
                    <div className="space-y-1">
                      <label className="text-[9px] uppercase font-black text-slate-500 block mb-1">Método de Selección de Instrumentos</label>
                      <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setWizardUseAI(false)}
                          className={`flex-1 py-2 text-center text-[11px] font-black rounded-lg transition-all ${
                            !wizardUseAI 
                              ? 'bg-white border-2 border-[#1A1A1A] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]' 
                              : 'text-slate-600 hover:text-slate-800'
                          }`}
                        >
                          Filtro de Catálogo (Estándar)
                        </button>
                        <button
                          type="button"
                          onClick={() => setWizardUseAI(true)}
                          className={`flex-1 py-2 text-center text-[11px] font-black rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                            wizardUseAI 
                              ? 'bg-[#F5D56E] border-2 border-[#1A1A1A] text-[#1A1A1A] shadow-[1px_1px_0px_0px_#1A1A1A]' 
                              : 'text-slate-600 hover:text-slate-800'
                          }`}
                        >
                          <Brain className="h-3.5 w-3.5 text-indigo-600" />
                          Recomendación Inteligente (IA)
                        </button>
                      </div>
                    </div>

                    {!wizardUseAI ? (
                      <div>
                        <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-2">Áreas de desarrollo a indagar</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {AREAS_EVALUAR.map((area) => {
                            const isSelected = wizardAreas.includes(area);
                            return (
                              <button
                                key={area}
                                type="button"
                                onClick={() => {
                                  if (isSelected) {
                                    setWizardAreas(wizardAreas.filter(a => a !== area));
                                  } else {
                                    setWizardAreas([...wizardAreas, area]);
                                  }
                                }}
                                className={`p-3 text-left text-xs rounded-xl border-2 font-black transition-all ${
                                  isSelected 
                                    ? 'bg-[#F5D56E] border-[#1A1A1A] text-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]' 
                                    : 'bg-white border-slate-200 text-slate-600 hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                                }`}
                              >
                                {area}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2.5 bg-white p-4 rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A]">
                        <div className="flex items-center gap-2 text-xs font-black text-[#1A1A1A]">
                          <Brain className="h-4 w-4 text-indigo-600" />
                          <span>Especificar área o dificultad a evaluar con IA</span>
                        </div>
                        <p className="text-[10px] text-slate-600 font-bold leading-normal">
                          Escribe de forma libre qué deseas evaluar o qué dificultades presenta tu paciente (ej. comprensión lectora, dislexia, atención, razonamiento lógico, etc.).
                        </p>
                        <textarea
                          value={wizardCustomQuery}
                          onChange={(e) => setWizardCustomQuery(e.target.value)}
                          placeholder="Ej: Deseo evaluar la comprensión lectora de un niño de 8 años con sospecha de TDAH y dificultades importantes en la memoria de trabajo..."
                          className="w-full h-24 text-xs p-3 bg-slate-50 border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:bg-white text-[#1A1A1A] font-bold placeholder-slate-400 resize-none transition-colors"
                        />
                      </div>
                    )}


                    <div className="flex justify-end pt-4">
                      <button
                        onClick={handleWizardNext}
                        disabled={wizardUseAI ? wizardCustomQuery.trim() === "" : wizardAreas.length === 0}
                        className="px-5 py-3 bg-[#F79472] hover:bg-[#eb7d55] disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200 border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] text-[#1A1A1A] font-black text-xs rounded-xl flex items-center gap-1.5 transition-all"
                      >
                        Siguiente
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* LOADING VIEW FOR AI */}
                {wizardStep === 1 && wizardIsAiLoading && (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4 bg-white border-2 border-[#1A1A1A] rounded-xl shadow-[3px_3px_0px_0px_#1A1A1A]">
                    <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
                    <div className="text-center space-y-1">
                      <h4 className="text-xs font-black uppercase text-[#1A1A1A]">Consultando Asistente IA</h4>
                      <p className="text-[10px] text-slate-500 font-bold">
                        Analizando la biblioteca de instrumentos psicopedagógicos...
                      </p>
                      <div className="pt-4 max-w-xs mx-auto text-left text-[9px] text-slate-500 font-semibold space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <Check className="h-3 w-3 shrink-0" />
                          <span>Paciente de {activeCaso?.edad} años y nivel {activeCaso?.curso || "escolar"} detectado.</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-600">
                          <Check className="h-3 w-3 shrink-0" />
                          <span>Analizando consulta personalizada: "{wizardCustomQuery.substring(0, 35)}..."</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-indigo-600 animate-pulse">
                          <Brain className="h-3 w-3 shrink-0" />
                          <span>Distribuyendo pruebas en {wizardSessionsCount} sesiones...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ERROR VIEW FOR AI */}
                {wizardStep === 1 && wizardAiError && (
                  <div className="p-5 bg-red-50 border-2 border-red-500 text-red-700 rounded-xl space-y-4 shadow-[2px_2px_0px_0px_#EF4444]">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                      <div className="space-y-1">
                        <h4 className="text-xs font-black uppercase">Fallo en la Recomendación IA</h4>
                        <p className="text-[10px] font-bold leading-relaxed text-red-600">
                          {wizardAiError}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => {
                          setWizardUseAI(false);
                          setWizardAiError(null);
                        }}
                        className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-[10px] font-black rounded-lg transition-all"
                      >
                        Usar Filtro Estándar
                      </button>
                      <button
                        onClick={() => {
                          setWizardAiError(null);
                          handleWizardNext();
                        }}
                        className="px-4 py-1.5 bg-[#F79472] border-2 border-[#1A1A1A] shadow-[1.5px_1.5px_0px_0px_#1A1A1A] text-[#1A1A1A] text-[10px] font-black rounded-lg transition-all"
                      >
                        Reintentar
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: Recommended test list (Autocalculated under the hood!) */}
                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <div className="bg-[#EAF6FF] p-3 rounded-xl border-2 border-[#1A1A1A] flex items-start gap-2.5 text-xs text-[#1A1A1A] font-bold">
                      <Info className="h-5 w-5 shrink-0 text-blue-600" />
                      <p className="font-medium text-[11px] leading-relaxed">
                        Basado en el motivo de <strong>{wizardMotive}</strong> y una edad de <strong>{activeCaso.edad} años</strong>, nuestro motor clínico recomienda las siguientes pruebas psicopedagógicas validadas:
                      </p>
                    </div>

                    <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                      {wizardSelectedTests.map((it, idx) => (
                        <div
                          key={it.instrumento.id}
                          className="p-4 bg-white rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] flex items-start justify-between gap-4"
                        >
                          <div className="min-w-0">
                            <span className="text-[8px] bg-[#F5D56E] text-[#1A1A1A] border border-[#1A1A1A] font-black px-2 py-0.5 rounded uppercase">
                              {it.instrumento.area}
                            </span>
                            <h4 className="text-xs font-black text-[#1A1A1A] mt-2">{it.instrumento.nombre}</h4>
                            <p className="text-[10px] text-slate-600 leading-relaxed italic mt-1 font-semibold">
                              Razonamiento Clínico: "{it.razon}"
                            </p>
                          </div>
                          
                          <select
                            value={it.sesion}
                            onChange={(e) => {
                              const updated = [...wizardSelectedTests];
                              updated[idx].sesion = Number(e.target.value);
                              setWizardSelectedTests(updated);
                            }}
                            className="bg-white border-2 border-[#1A1A1A] text-[10px] font-black p-1.5 rounded focus:outline-none shrink-0"
                          >
                            {Array.from({ length: wizardSessionsCount }).map((_, i) => (
                              <option key={i} value={i + 1}>Sesión {i + 1}</option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <button
                        onClick={() => setWizardStep(1)}
                        className="text-xs font-black text-slate-500 hover:text-[#1A1A1A]"
                      >
                        Atrás
                      </button>
                      <button
                        onClick={handleWizardNext}
                        className="px-5 py-3 bg-[#F79472] hover:bg-[#eb7d55] border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] text-[#1A1A1A] font-black text-xs rounded-xl transition-all"
                      >
                        Confirmar Batería
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: Confirm and schedule appointments */}
                {wizardStep === 3 && (
                  <div className="space-y-4">
                    <div className="p-4 bg-[#E8F8F0] border-2 border-[#1A1A1A] rounded-xl flex items-center gap-3 text-[#1A1A1A]">
                      <CheckCircle className="h-6 w-6 text-emerald-600 shrink-0" />
                      <div>
                        <h4 className="text-xs font-black uppercase tracking-wider">Batería diseñada con éxito</h4>
                        <p className="text-[10px] text-slate-600 font-bold leading-normal mt-0.5">
                          Se calendarizarán automáticamente {wizardSessionsCount} citas psicopedagógicas de aplicación para {activeCaso.nombre}.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-700 bg-white p-4 border-2 border-[#1A1A1A] rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A]">
                      <p className="font-bold"><strong>Paciente:</strong> {activeCaso.nombre}</p>
                      <p className="font-bold"><strong>Batería resultante:</strong> Batería: {wizardMotive} ({activeCaso.nombre})</p>
                      <p className="font-bold"><strong>Total instrumentos seleccionados:</strong> {wizardSelectedTests.length} tests diagnósticos</p>
                    </div>

                    <div className="flex items-center justify-between pt-4">
                      <button
                        onClick={() => setWizardStep(2)}
                        className="text-xs font-black text-slate-500 hover:text-[#1A1A1A]"
                      >
                        Atrás
                      </button>
                      <button
                        onClick={handleWizardFinish}
                        className="px-5 py-3 bg-[#F5D56E] hover:bg-[#ebc455] border-2 border-[#1A1A1A] shadow-[2.5px_2.5px_0px_0px_#1A1A1A] text-[#1A1A1A] font-black text-xs rounded-xl transition-all"
                      >
                        Generar & Agenda Citas
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Case file workspace section tabs */}
            <div className="flex border-b border-slate-200 gap-6">
              <button
                onClick={() => setActiveTab('baterias')}
                className={`pb-3 text-xs font-bold transition-colors relative ${
                  activeTab === 'baterias' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {activeTab === 'baterias' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
                <span className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4" />
                  Baterías de Evaluación ({activeBaterias.length})
                </span>
              </button>

              <button
                onClick={() => setActiveTab('observaciones')}
                className={`pb-3 text-xs font-bold transition-colors relative ${
                  activeTab === 'observaciones' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {activeTab === 'observaciones' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
                <span className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  Observaciones Clínicas ({activeObservaciones.length})
                </span>
              </button>

              <button
                onClick={() => setActiveTab('informes')}
                className={`pb-3 text-xs font-bold transition-colors relative ${
                  activeTab === 'informes' ? 'text-[#1A1A1A]' : 'text-slate-450 hover:text-slate-600'
                }`}
              >
                {activeTab === 'informes' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600" />}
                <span className="flex items-center gap-1.5">
                  <Printer className="h-4 w-4" />
                  Generador de Informes
                </span>
              </button>
            </div>

            {/* Render workspace tab details */}
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm min-h-[300px]">
              
              {/* TAB 1: BATERIAS */}
              {activeTab === 'baterias' && (
                <div className="space-y-4">
                  {activeBaterias.length > 0 ? (
                    <div className="space-y-4">
                      {activeBaterias.map((bat) => {
                        const items = bateriaItems.filter(bi => bi.bateria_id === bat.id);
                        return (
                          <div key={bat.id} className="p-5 bg-slate-50/50 border border-slate-200/60 rounded-xl space-y-4">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h4 className="text-xs font-bold text-slate-800 leading-snug">{bat.nombre}</h4>
                                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Plan de evaluación generado en: {bat.creado_en}</p>
                              </div>
                              <button
                                onClick={() => onDeleteBateria(bat.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                                title="Eliminar batería"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                              {bat.descripcion || 'Sin descripción disponible.'}
                            </p>

                            <div className="border-t border-slate-100 pt-3.5 space-y-2">
                              <span className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Instrumentos en esta batería ({items.length})</span>
                              <div className="space-y-1.5">
                                {items.map((it, idx) => {
                                  const ins = instrumentos.find(i => i.id === it.instrumento_id);
                                  return (
                                    <div key={it.id} className="p-2.5 bg-white border border-slate-100 rounded-lg flex items-center justify-between text-xs text-slate-700 font-medium">
                                      <div className="truncate max-w-sm">
                                        <span className="font-bold text-indigo-600 mr-2">#{idx + 1}</span>
                                        <span>{ins ? ins.nombre : 'Test clínico'}</span>
                                      </div>
                                      <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100">
                                        Sesión {it.sesion}
                                      </span>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
                      <Layers className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <h4 className="text-xs font-bold text-slate-700">Sin Baterías Planificadas</h4>
                      <p className="text-[10px] text-slate-400 mt-1 max-w-xs mx-auto">
                        Haz clic en "+ Crear Evaluación" para iniciar el asistente de selección dinámica y diseñar una batería específica.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: OBSERVACIONES CLÍNICAS */}
              {activeTab === 'observaciones' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Historial de conductas y atención</span>
                    <button
                      onClick={() => setShowObsModal(true)}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-lg"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Añadir Registro
                    </button>
                  </div>

                  {activeObservaciones.length > 0 ? (
                    <div className="space-y-4">
                      {activeObservaciones.map((obs) => (
                        <div key={obs.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3 relative">
                          <button
                            onClick={() => onDeleteObservacion(obs.id)}
                            className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 transition-colors p-1"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>

                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Registro: {obs.creado_en || obs.fecha}</span>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[10px] font-semibold text-slate-600">
                            <div className="bg-white p-2 border border-slate-100 rounded-lg">
                              <span className="text-[8px] text-slate-400 block uppercase font-bold leading-none mb-1">Conducta</span>
                              <span>{obs.conducta_trabajo || obs.conducta || 'Adecuada'}</span>
                            </div>
                            <div className="bg-white p-2 border border-slate-100 rounded-lg">
                              <span className="text-[8px] text-slate-400 block uppercase font-bold leading-none mb-1">Atención</span>
                              <span>{obs.atencion_concentracion || obs.atencion || 'Sostenida'}</span>
                            </div>
                            <div className="bg-white p-2 border border-slate-100 rounded-lg">
                              <span className="text-[8px] text-slate-400 block uppercase font-bold leading-none mb-1">Motivación</span>
                              <span>{obs.motivacion || 'Alta'}</span>
                            </div>
                            <div className="bg-white p-2 border border-slate-100 rounded-lg">
                              <span className="text-[8px] text-slate-400 block uppercase font-bold leading-none mb-1">Actitud</span>
                              <span>{obs.actitud_ante_pruebas || obs.actitud || 'Positiva'}</span>
                            </div>
                          </div>

                          {obs.observaciones_generales && (
                            <p className="text-xs text-slate-600 italic bg-white p-3 rounded-lg border border-slate-100 leading-relaxed">
                              "{obs.observaciones_generales}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
                      <FileText className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                      <h4 className="text-xs font-bold text-slate-700">Sin observaciones conductuales</h4>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Registra anotaciones clínicas y conductuales de las sesiones de evaluación del paciente.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: GENERADOR DE INFORMES */}
              {activeTab === 'informes' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['escolar', 'clinico', 'neuropsicologico'].map((temp) => (
                      <button
                        key={temp}
                        onClick={() => setReportTemplate(temp as any)}
                        className={`p-3.5 rounded-xl border font-bold text-xs text-left transition-fluent ${
                          reportTemplate === temp 
                            ? 'bg-indigo-50 border-indigo-200 text-indigo-700' 
                            : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-slate-100'
                        }`}
                      >
                        {temp === 'escolar' ? 'Plantilla Escolar' : temp === 'clinico' ? 'Diagnóstico Clínico' : 'Informe'}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">I. Conclusión y Perfil Diagnóstico</label>
                      <textarea
                        rows={3}
                        value={diagConclusions}
                        onChange={(e) => setDiagConclusions(e.target.value)}
                        className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none resize-none leading-relaxed text-slate-700 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">II. Recomendaciones para el Colegio</label>
                        <textarea
                          rows={3}
                          value={recSchool}
                          onChange={(e) => setRecSchool(e.target.value)}
                          className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none resize-none leading-relaxed text-slate-700"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">III. Orientaciones para la Familia</label>
                        <textarea
                          rows={3}
                          value={recFamily}
                          onChange={(e) => setRecFamily(e.target.value)}
                          className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none resize-none leading-relaxed text-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-5 flex justify-end gap-3">
                    <button
                      onClick={handleCopyReportToClipboard}
                      className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-100 flex items-center gap-1.5"
                    >
                      <Copy className="h-4 w-4" />
                      Copiar Informe Completo
                    </button>
                  </div>

                  {clipboardToast && (
                    <div className="p-3 bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      ¡Informe clínico copiado al portapapeles listo para Notion, Word o correo!
                    </div>
                  )}
                </div>
              )}

            </div>
          </>
        ) : (
          <div className="text-center py-20 bg-white border border-slate-200/60 rounded-2xl">
            <Users className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-700">Sin Paciente Seleccionado</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Selecciona un expediente en la columna izquierda o haz clic en "+ Crear Caso" para registrar un nuevo menor en consulta.
            </p>
          </div>
        )}
      </div>

      {/* Modal: New Case Form */}
      {showAddModal && (
        <div className="fixed inset-x-0 bottom-0 top-16 md:inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] max-w-lg w-full overflow-hidden flex flex-col max-h-[calc(100dvh-6rem)]">
            <div className="px-6 py-4 border-b-2 border-[#1A1A1A] flex items-center justify-between bg-[#FFF9F7] shrink-0">
              <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider">Crear Nuevo Expediente</h3>
              <button
                onClick={() => setShowAddModal(false)}
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
                    value={cNombre}
                    onChange={(e) => setCNombre(e.target.value)}
                    placeholder="Ej. Sofía Martínez Rojas"
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
                    value={cEdad}
                    onChange={(e) => setCEdad(Number(e.target.value))}
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Curso / Nivel</label>
                  <input
                    type="text"
                    value={cCurso}
                    onChange={(e) => setCCurso(e.target.value)}
                    placeholder="Ej. 3° Básico"
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Establecimiento</label>
                  <input
                    type="text"
                    value={cEstablecimiento}
                    onChange={(e) => setCEstablecimiento(e.target.value)}
                    placeholder="Ej. Colegio San Agustín"
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Nombre del Apoderado / Contacto</label>
                <input
                  type="text"
                  value={cApoderado}
                  onChange={(e) => setCApoderado(e.target.value)}
                  placeholder="Ej. Felipe Martínez (Padre)"
                  className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Motivo de Consulta Principal</label>
                <textarea
                  required
                  rows={3}
                  value={cMotivo}
                  onChange={(e) => setCMotivo(e.target.value)}
                  placeholder="Ej. Dificultades notables en comprensión de textos y sospecha de déficit atencional."
                  className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none focus:ring-0 resize-none"
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
                  Registrar Caso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Observational Log Form */}
      {showObsModal && (
        <div className="fixed inset-x-0 bottom-0 top-16 md:inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] max-w-md w-full overflow-hidden flex flex-col max-h-[calc(100dvh-6rem)]">
            <div className="px-6 py-4 border-b-2 border-[#1A1A1A] flex items-center justify-between bg-[#FFF9F7] shrink-0">
              <h3 className="text-sm font-black text-[#1A1A1A] uppercase tracking-wider">Registro Observacional</h3>
              <button
                onClick={() => setShowObsModal(false)}
                className="text-slate-500 hover:text-slate-800 text-xs font-black underline"
              >
                Cerrar
              </button>
            </div>
            <form onSubmit={handleCreateObservacion} className="p-6 space-y-4 overflow-y-auto flex-1 bg-[#FFF9F7]/10">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Conducta Trabajo</label>
                  <select
                    value={obsConducta}
                    onChange={(e) => setObsConducta(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none"
                  >
                    <option value="Adecuada">Adecuada</option>
                    <option value="Inquieta">Inquieta</option>
                    <option value="Lenta / Pasiva">Lenta / Pasiva</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Atención / Concentración</label>
                  <select
                    value={obsAtencion}
                    onChange={(e) => setObsAtencion(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none"
                  >
                    <option value="Sostenida">Sostenida</option>
                    <option value="Lábil / Dispersa">Lábil / Dispersa</option>
                    <option value="Focalizada con esfuerzo">Focalizada con esfuerzo</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Motivación</label>
                  <select
                    value={obsMotivacion}
                    onChange={(e) => setObsMotivacion(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja / Reticente">Baja / Reticente</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Actitud Ante Pruebas</label>
                  <select
                    value={obsActitud}
                    onChange={(e) => setObsActitud(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none"
                  >
                    <option value="Positiva">Positiva</option>
                    <option value="Ansiosa">Ansiosa</option>
                    <option value="Defensiva / Negativa">Defensiva / Negativa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-black text-[#1A1A1A] block mb-1">Observaciones y Notas Generales</label>
                <textarea
                  rows={3}
                  value={obsNotasGenerales}
                  onChange={(e) => setObsNotasGenerales(e.target.value)}
                  placeholder="Ej. El niño cooperó durante la sesión, pero mostró signos notables de cansancio al término de la segunda prueba..."
                  className="w-full text-xs p-2.5 bg-white border-2 border-[#1A1A1A] rounded-xl focus:outline-none resize-none animate-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t-2 border-dashed border-[#1A1A1A]/20">
                <button
                  type="button"
                  onClick={() => setShowObsModal(false)}
                  className="px-4 py-2 text-xs font-black text-slate-500 hover:text-slate-800 underline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-black text-[#1A1A1A] bg-[#F79472] hover:bg-[#eb7d55] rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all active:translate-x-[1px] active:translate-y-[1px]"
                >
                  Guardar Registro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Custom Delete Case Confirmation */}
      {showDeleteConfirm && activeCaso && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] max-w-md w-full overflow-hidden p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="h-6 w-6 shrink-0" />
              <h3 className="text-sm font-black uppercase tracking-wider text-[#1A1A1A]">
                Confirmar Eliminación
              </h3>
            </div>
            
            <p className="text-xs text-slate-600 font-bold leading-relaxed">
              ¿Estás seguro de que deseas archivar y borrar definitivamente el expediente clínico de{' '}
              <span className="text-[#1A1A1A] underline font-black">{activeCaso.nombre}</span>?
            </p>
            <p className="text-[10px] text-slate-400 font-bold">
              * Esta acción eliminará permanentemente todos sus registros de observaciones, diagnósticos y citas asociadas.
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t-2 border-dashed border-[#1A1A1A]/20">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-xs font-black text-slate-500 hover:text-slate-800 underline"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCaso}
                className="px-5 py-2.5 text-xs font-black text-white bg-rose-500 hover:bg-rose-600 rounded-xl border-2 border-[#1A1A1A] shadow-[2px_2px_0px_0px_#1A1A1A] transition-all active:translate-x-[1px] active:translate-y-[1px]"
              >
                Borrar Expediente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
