import React, { useState } from 'react';
import { BookMarked, Search, BarChart3, AlertCircle, Sparkles, Star, ChevronRight, GraduationCap } from 'lucide-react';

interface Concept {
  id: string;
  title: string;
  definition: string;
  clinicalSigns: string[];
  bibliography: string;
}

const CONCEPTS_DICTIONARY: Concept[] = [
  {
    id: 'dislexia',
    title: 'Dislexia de Desarrollo',
    definition: 'Dificultad neurobiológica del aprendizaje caracterizada por impedimentos en el reconocimiento preciso y fluido de palabras escritas, deletreo deficiente y decodificación lectora descendida. Proviene de una alteración en el componente fonológico del lenguaje.',
    clinicalSigns: [
      'Lectura lenta, silábica o con excesivo esfuerzo vacilante.',
      'Sustitución, adición, omisión o transposición de letras homófonas o grafías de formas afines (b/d, p/q).',
      'Debilidad severa en la memoria fonológica y la velocidad de denominación rápida (RAN).'
    ],
    bibliography: 'Asociación Americana de Psiquiatría. (2014). Manual Diagnóstico y Estadístico de los Trastornos Mentales (DSM-5). Editorial Médica Panamericana.'
  },
  {
    id: 'discalculia',
    title: 'Discalculia del Desarrollo',
    definition: 'Trastorno específico del aprendizaje matemático que afecta la adquisición del concepto numérico base, la comprensión del valor posicional, las operaciones aritméticas directas y el razonamiento cuantitativo autónomo.',
    clinicalSigns: [
      'Dificultad para estimar magnitudes relativas directas (identificar qué número es mayor).',
      'Uso persistente de conteo digital (contar con dedos) a edades tardías.',
      'Inversión al escribir números o dificultades de ordenación columnar.'
    ],
    bibliography: 'Geary, D. C. (2011). Cognitive predictors of achievement in mathematics. Journal of Learning Disabilities, 44(3), 273-284.'
  },
  {
    id: 'tel',
    title: 'Trastorno Específico del Lenguaje (TEL) / TDL',
    definition: 'Alteración en el desarrollo normal del lenguaje expresivo y/o comprensivo en ausencia de factores de pérdida auditiva, retraso intelectual o daño cerebral orgánico demostrable. También conocido como Trastorno del Desarrollo del Lenguaje.',
    clinicalSigns: [
      'Vocabulario expresivo severamente restringido para su rango etario.',
      'Errores constantes de concordancia de género y número en oraciones estructuradas.',
      'Dificultades en la repetición de pseudopalabras (marcador clínico).'
    ],
    bibliography: 'Bishop, D. V. M. (2017). CATALISE: A multinational and multidisciplinary consensus to identify language impairments in children. Journal of Child Psychology and Psychiatry, 58(10), 1068-1080.'
  },
  {
    id: 'tdah',
    title: 'TDAH (Trastorno por Déficit de Atención con Hiperactividad)',
    definition: 'Trastorno del neurodesarrollo caracterizado por patrones persistentes de inatención, desorganización, hiperactividad motora e impulsividad disfuncionales para el entorno escolar y social, asociados a un déficit en las funciones ejecutivas prefrontales.',
    clinicalSigns: [
      'Labilidad atencional: distracción rápida ante estímulos irrelevantes del aula.',
      'Dificultad persistente para inhibir respuestas motrices o impulsos verbales.',
      'Dificultades en la memoria de trabajo para seguir instrucciones verbales secuenciales.'
    ],
    bibliography: 'Barkley, R. A. (2015). Attention-deficit hyperactivity disorder: A handbook for diagnosis and treatment (4th ed.). The Guilford Press.'
  },
  {
    id: 'tea',
    title: 'Trastorno del Espectro Autista (TEA)',
    definition: 'Condición del neurodesarrollo con inicio temprano caracterizada por dificultades persistentes en la comunicación e interacción social recíproca, junto con patrones de comportamiento, intereses o actividades sumamente restringidos y repetitivos.',
    clinicalSigns: [
      'Dificultades de reciprocidad social y lectura de la pragmática no verbal.',
      'Hipersensibilidad o hiposensibilidad a estímulos sensoriales del ambiente.',
      'Dificultades en la flexibilidad cognitiva ante cambios súbitos de rutina.'
    ],
    bibliography: 'Lord, C., et al. (2018). Autism spectrum disorder. The Lancet, 392(10146), 508-520.'
  },
  {
    id: 'funciones_ejecutivas',
    title: 'Funciones Ejecutivas',
    definition: 'Conjunto de procesos cognitivos de control consciente (memoria de trabajo, control inhibitorio, flexibilidad cognitiva y planificación) que permiten autorregular la conducta, dirigir el esfuerzo a metas académicas y resolver problemas complejos.',
    clinicalSigns: [
      'Dificultades para iniciar tareas escolares de forma autónoma.',
      'Perseveración en estrategias ineficaces de resolución de problemas.',
      'Olvidos constantes de materiales escolares o compromisos agendados.'
    ],
    bibliography: 'Diamond, A. (2013). Executive functions. Annual Review of Psychology, 64, 135-168.'
  }
];

export default function ConceptosEstadisticas() {
  const [activeSubTab, setActiveSubTab] = useState<'conceptos' | 'estadisticas'>('conceptos');
  const [searchWord, setSearchWord] = useState('');
  const [selectedConcept, setSelectedConcept] = useState<Concept>(CONCEPTS_DICTIONARY[0]);

  const filteredConcepts = CONCEPTS_DICTIONARY.filter(c => 
    c.title.toLowerCase().includes(searchWord.toLowerCase()) || 
    c.definition.toLowerCase().includes(searchWord.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Selector Interno */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('conceptos')}
          className={`px-4 py-2 text-xs font-bold transition-fluent border-b-2 ${
            activeSubTab === 'conceptos'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <BookMarked className="h-4 w-4" />
            Diccionario Clínico
          </div>
        </button>

        <button
          onClick={() => setActiveSubTab('estadisticas')}
          className={`px-4 py-2 text-xs font-bold transition-fluent border-b-2 ${
            activeSubTab === 'estadisticas'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <BarChart3 className="h-4 w-4" />
            Estadísticas de Uso
          </div>
        </button>
      </div>

      {/* ==========================================
          SUBTAB 1: DICCIONARIO CLÍNICO
          ========================================== */}
      {activeSubTab === 'conceptos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Navegación lateral conceptos */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar concepto o criterio..."
                value={searchWord}
                onChange={(e) => setSearchWord(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1 border border-slate-200/80 rounded-xl bg-white p-2 max-h-[400px] overflow-y-auto">
              {filteredConcepts.map(c => (
                <button
                  key={c.id}
                  onClick={() => setSelectedConcept(c)}
                  className={`w-full text-left p-3 text-xs rounded-lg font-medium transition-fluent flex justify-between items-center ${
                    selectedConcept.id === c.id
                      ? 'bg-indigo-50 text-indigo-900 border-l-4 border-indigo-600 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{c.title}</span>
                  <ChevronRight className="h-4 w-4 text-slate-400" />
                </button>
              ))}

              {filteredConcepts.length === 0 && (
                <div className="py-6 text-center text-xs text-slate-400">
                  No se encontraron conceptos coincidentes.
                </div>
              )}
            </div>
          </div>

          {/* Ficha técnica del concepto */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <div>
              <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                Marco Conceptual
              </span>
              <h3 className="font-display font-bold text-slate-900 text-lg mt-1.5 leading-tight">
                {selectedConcept.title}
              </h3>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Definición Clínica</span>
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {selectedConcept.definition}
              </p>
            </div>

            <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200/50">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Indicadores Observacionales Comunes en Aula</span>
              <ul className="space-y-2 text-xs text-slate-700 font-mono text-[11px]">
                {selectedConcept.clinicalSigns.map((sig, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{sig}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-1 pt-2 border-t">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Bibliografía Sugerida (Normas APA 7)</span>
              <p className="text-xs text-slate-500 italic leading-relaxed">
                {selectedConcept.bibliography}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          SUBTAB 2: ESTADÍSTICAS DE USO (CUSTOM CHARTS)
          ========================================== */}
      {activeSubTab === 'estadisticas' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Gráfico 1: Áreas más evaluadas */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Áreas más Evaluadas (Percentil Frecuencia)</h4>
              
              <div className="space-y-3">
                {[
                  { label: 'Lectura', count: 48, pct: '100%' },
                  { label: 'Matemática', count: 32, pct: '66%' },
                  { label: 'Lenguaje oral', count: 24, pct: '50%' },
                  { label: 'Escritura', count: 18, pct: '37%' },
                  { label: 'Funciones ejecutivas', count: 12, pct: '25%' }
                ].map(item => (
                  <div key={item.label} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-700">{item.label}</span>
                      <span className="text-slate-400 font-mono">{item.count} aplicaciones</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-indigo-600 h-full rounded-full transition-all duration-1000" style={{ width: item.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gráfico 2: Pruebas del catálogo más utilizadas */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Instrumentos más Utilizados</h4>
              
              <div className="space-y-3">
                {[
                  { label: 'PROLEC-R (Lectura)', count: 24, pct: '100%', color: 'bg-emerald-500' },
                  { label: 'TEDE (Decodificación)', count: 18, pct: '75%', color: 'bg-emerald-500' },
                  { label: 'Benton y Luria (Aritmética)', count: 15, pct: '62%', color: 'bg-emerald-500' },
                  { label: 'TEVI-R (Vocabulario)', count: 11, pct: '45%', color: 'bg-emerald-500' },
                  { label: 'CLP (Comprensión)', count: 9, pct: '37%', color: 'bg-emerald-500' }
                ].map(item => (
                  <div key={item.label} className="space-y-1 text-xs">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-700">{item.label}</span>
                      <span className="text-slate-400 font-mono">{item.count} planificadas</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className={`${item.color} h-full rounded-full`} style={{ width: item.pct }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Estadísticas de Casos */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/60 flex flex-col md:flex-row justify-around items-center text-center gap-6">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Casos Totales Registrados</span>
              <strong className="text-2xl font-display text-slate-900 block mt-1">26 Casos</strong>
              <span className="text-[10px] text-green-600 font-bold mt-1 block">▲ +12% este mes</span>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden md:block" />

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Sesiones Promedio por Batería</span>
              <strong className="text-2xl font-display text-slate-900 block mt-1">2.4 Sesiones</strong>
              <span className="text-[10px] text-slate-500 font-semibold mt-1 block">Óptimo para descarte diagnóstico</span>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden md:block" />

            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Baterías Clínicas Creadas</span>
              <strong className="text-2xl font-display text-slate-900 block mt-1">14 Plantillas</strong>
              <span className="text-[10px] text-indigo-600 font-bold mt-1 block">Ahorro de 5 horas semanales</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
