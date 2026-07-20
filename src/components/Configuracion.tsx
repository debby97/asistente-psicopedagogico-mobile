import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Database, 
  Terminal, 
  FileText, 
  Play, 
  Download, 
  Upload, 
  AlertCircle, 
  Sparkles, 
  Table2, 
  Info,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { DatabaseState, executeSQLQuery, exportDatabaseToSQL, importDatabaseFromSQL } from '../dbStore';

interface ConfiguracionProps {
  dbState: DatabaseState;
  setDbState: (state: DatabaseState) => void;
  onProfileUpdate?: (name: string, title: string) => void;
}

export default function Configuracion({ dbState, setDbState, onProfileUpdate }: ConfiguracionProps) {
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'sql' | 'dictionary'>('profile');
  
  // Profile settings state (local mock for UI, starts empty until saved/loaded)
  const [profName, setProfName] = useState(() => localStorage.getItem('prof_name') || '');
  const [profTitle, setProfTitle] = useState(() => localStorage.getItem('prof_title') || '');
  const [institution, setInstitution] = useState(() => localStorage.getItem('prof_institution') || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // SQL Console state
  const [rawQuery, setRawQuery] = useState("SELECT id, nombre, area, edad_aplicacion, adaptacion_chilena FROM instrumentos WHERE area = 'Lectura' LIMIT 5;");
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [queryColumns, setQueryColumns] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [affectedRows, setAffectedRows] = useState<number | null>(null);

  const [dbSchema] = useState([
    {
      table: 'instrumentos',
      columns: ['id (VARCHAR PRIMARY KEY)', 'nombre (VARCHAR)', 'autor (VARCHAR)', 'anio (INTEGER)', 'editorial (VARCHAR)', 'area (VARCHAR)', 'subarea (VARCHAR)', 'edad_aplicacion (VARCHAR)', 'tiempo_aproximado (VARCHAR)', 'nivel_evidencia (VARCHAR)', 'adaptacion_chilena (VARCHAR)', 'estado (VARCHAR)']
    },
    {
      table: 'casos',
      columns: ['id (VARCHAR PRIMARY KEY)', 'nombre (VARCHAR)', 'edad (INTEGER)', 'curso (VARCHAR)', 'establecimiento_escolar (VARCHAR)', 'motivo_consulta (TEXT)', 'estado (VARCHAR)', 'creado_en (VARCHAR)']
    },
    {
      table: 'baterias',
      columns: ['id (VARCHAR PRIMARY KEY)', 'nombre (VARCHAR)', 'descripcion (TEXT)', 'caso_id (VARCHAR FOREIGN KEY)', 'es_plantilla (BOOLEAN)', 'creado_en (VARCHAR)']
    },
    {
      table: 'bateria_items',
      columns: ['id (VARCHAR PRIMARY KEY)', 'bateria_id (VARCHAR FOREIGN KEY)', 'instrumento_id (VARCHAR FOREIGN KEY)', 'sesion (INTEGER)', 'orden (INTEGER)']
    },
    {
      table: 'observaciones',
      columns: ['id (VARCHAR PRIMARY KEY)', 'caso_id (VARCHAR FOREIGN KEY)', 'conducta (TEXT)', 'atencion (TEXT)', 'motivacion (TEXT)', 'interaccion (TEXT)', 'lenguaje_espontaneo (TEXT)', 'actitud (TEXT)', 'observaciones_generales (TEXT)']
    }
  ]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('prof_name', profName);
    localStorage.setItem('prof_title', profTitle);
    localStorage.setItem('prof_institution', institution);
    setSaveSuccess(true);
    if (onProfileUpdate) {
      onProfileUpdate(profName, profTitle);
    }
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleExecuteSQL = () => {
    setErrorMessage(null);
    setQueryResult(null);
    setQueryColumns([]);
    setAffectedRows(null);

    try {
      const res = executeSQLQuery(rawQuery, dbState, setDbState);
      if (res.error) {
        setErrorMessage(res.error);
      } else {
        if (res.affectedRows !== undefined) {
          setAffectedRows(res.affectedRows);
        }
        if (res.rows && res.columns) {
          setQueryColumns(res.columns);
          const objRows = res.rows.map(rowArr => {
            const obj: any = {};
            res.columns.forEach((col, idx) => {
              obj[col] = rowArr[idx];
            });
            return obj;
          });
          setQueryResult(objRows);
        }
      }
    } catch (e: any) {
      setErrorMessage(e.message || "Error al ejecutar la sentencia SQL.");
    }
  };

  const handleExportBackup = () => {
    try {
      const sqlContent = exportDatabaseToSQL(dbState);
      const blob = new Blob([sqlContent], { type: 'text/plain;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `backup_asistente_psicopedagogico_${new Date().toISOString().split('T')[0]}.sql`;
      link.click();
    } catch (e: any) {
      alert(`Error al exportar copia de seguridad: ${e.message}`);
    }
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const newState = importDatabaseFromSQL(text, dbState);
        setDbState(newState);
        alert("¡Base de datos restablecida correctamente desde la copia de seguridad!");
      } catch (err: any) {
        alert(`Error al importar respaldo SQL: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const glossaryConcepts = [
    { title: 'Confiabilidad (Fiabilidad)', desc: 'Precisión con que un test mide lo que pretende medir, expresada comúnmente a través del coeficiente Alfa de Cronbach (valores > 0.8 indican alta fiabilidad).' },
    { title: 'Validez de Contenido', desc: 'Grado en que los ítems de una prueba constituyen una muestra representativa del dominio cognitivo, emocional o conductual que se evalúa.' },
    { title: 'Baremos Percentiles', desc: 'Tablas de equivalencias numéricas que comparan el desempeño individual frente al grupo de estandarización escolar, donde un percentil 50 representa la mediana poblacional.' },
    { title: 'Adaptación Ecológica (Chile)', desc: 'Proceso de ajuste lingüístico, psicométrico y cultural de pruebas extranjeras a las normas curriculares y poblacionales del sistema escolar chileno.' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-2.5 border-dashed border-slate-300 pb-6">
        <span className="text-[10px] font-black text-[#1A1A1A] uppercase tracking-wider bg-[#F5D56E] px-3.5 py-1.5 rounded-full border-2 border-[#1A1A1A] shadow-[1.5px_1.5px_0px_0px_#1A1A1A] inline-block">
          Ajustes
        </span>
        <h1 className="text-3xl font-display font-black text-[#1A1A1A] mt-3 tracking-tight">
          Configuración de la Plataforma
        </h1>
        <p className="text-xs text-slate-600 font-medium mt-1">
          Modifica tu perfil profesional, gestiona copias de seguridad de datos clínicas, o accede a herramientas técnicas.
        </p>
      </div>

      {/* Tabs list inside Settings (Notion-style) */}
      <div className="flex flex-wrap border-b-2 border-[#1A1A1A] gap-3 pb-[1px]">
        <button
          onClick={() => setActiveSubTab('profile')}
          className={`px-4 py-2 text-xs font-black transition-all border-2 rounded-t-xl relative -mb-[2px] ${
            activeSubTab === 'profile' 
              ? 'bg-[#F5D56E] border-[#1A1A1A] text-[#1A1A1A] border-b-white z-10' 
              : 'bg-white border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            Perfil Profesional
          </span>
        </button>
        
        <button
          onClick={() => setActiveSubTab('sql')}
          className={`px-4 py-2 text-xs font-black transition-all border-2 rounded-t-xl relative -mb-[2px] ${
            activeSubTab === 'sql' 
              ? 'bg-[#F5D56E] border-[#1A1A1A] text-[#1A1A1A] border-b-white z-10' 
              : 'bg-white border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Database className="h-4 w-4" />
            Consola SQL y Copias
          </span>
        </button>

        <button
          onClick={() => setActiveSubTab('dictionary')}
          className={`px-4 py-2 text-xs font-black transition-all border-2 rounded-t-xl relative -mb-[2px] ${
            activeSubTab === 'dictionary' 
              ? 'bg-[#F5D56E] border-[#1A1A1A] text-[#1A1A1A] border-b-white z-10' 
              : 'bg-white border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <span className="flex items-center gap-1.5">
            <BookOpen className="h-4 w-4" />
            Glosario Técnico
          </span>
        </button>
      </div>

      {/* Render subtab contents */}
      <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-xs">
        {activeSubTab === 'profile' && (
          <form onSubmit={handleSaveProfile} className="max-w-xl space-y-5">
            {(!profName || !profTitle || !institution) && (
              <div className="p-4 bg-[#FFF9F7] border-2 border-[#1A1A1A] rounded-xl shadow-[2px_2px_0px_0px_#1A1A1A] text-xs text-[#1A1A1A] font-bold space-y-1">
                <span className="text-[#F79472] flex items-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  Perfil Profesional Sin Completar
                </span>
                <p className="font-medium text-slate-600 text-[11px] leading-relaxed">
                  Tu información profesional aún no ha sido registrada. Completa los siguientes campos y guárdalos para personalizar tus reportes y espacio clínico.
                </p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Nombre del Profesional</label>
                <input
                  type="text"
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Especialidad o Cargo</label>
                <input
                  type="text"
                  value={profTitle}
                  onChange={(e) => setProfTitle(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">Institución / Centro Educativo</label>
                <input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" />
                ¡Cambios en el perfil guardados con éxito!
              </div>
            )}

            <button
              type="submit"
              className="px-4 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors"
            >
              Guardar Perfil
            </button>
          </form>
        )}

        {activeSubTab === 'sql' && (
          <div className="space-y-6">
            {/* Backup actions card */}
            <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">Copia de Seguridad y Migraciones</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  Exporta toda la base de datos virtual (pacientes, baterías, resultados) en un archivo .sql estándar o arrastra un respaldo anterior para restaurarlo.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={handleExportBackup}
                  className="px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg border border-slate-200 shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  Respaldar SQL
                </button>
                <label className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer">
                  <Upload className="h-4 w-4" />
                  Importar SQL
                  <input
                    type="file"
                    accept=".sql"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Virtual SQL Shell */}
            <div className="space-y-3 border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-slate-500" />
                  Consola SQL Interactiva (Simulador SQLite)
                </h4>
                <span className="text-[10px] font-bold text-slate-400 uppercase">SQLite Virtual</span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                {/* Database tables dictionary */}
                <div className="lg:col-span-1 bg-slate-50 border border-slate-200/60 rounded-xl p-4 max-h-[300px] overflow-y-auto">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Esquema de Tablas</span>
                  <div className="space-y-3.5">
                    {dbSchema.map((sch, idx) => (
                      <div key={idx}>
                        <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                          <Table2 className="h-3.5 w-3.5" />
                          {sch.table}
                        </span>
                        <div className="pl-4 mt-1 space-y-0.5 border-l border-slate-200">
                          {sch.columns.map((col, cIdx) => (
                            <span key={cIdx} className="text-[9px] font-medium text-slate-500 block truncate" title={col}>
                              {col}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Console editor & result */}
                <div className="lg:col-span-3 space-y-3 flex flex-col">
                  <div className="relative bg-slate-900 rounded-xl p-1 overflow-hidden shadow-inner">
                    <textarea
                      value={rawQuery}
                      onChange={(e) => setRawQuery(e.target.value)}
                      rows={5}
                      className="w-full bg-transparent text-emerald-400 font-mono text-xs p-3 focus:outline-none resize-none leading-relaxed"
                    />
                    <button
                      onClick={handleExecuteSQL}
                      className="absolute bottom-3 right-3 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-md flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="h-3.5 w-3.5" />
                      Ejecutar
                    </button>
                  </div>

                  {/* Errors block */}
                  {errorMessage && (
                    <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-lg border border-rose-100 flex items-start gap-2">
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span className="font-mono">{errorMessage}</span>
                    </div>
                  )}

                  {/* Rows affected */}
                  {affectedRows !== null && (
                    <div className="p-2.5 bg-slate-50 text-slate-700 text-[11px] font-bold rounded-lg border border-slate-100">
                      Filas afectadas: {affectedRows}
                    </div>
                  )}

                  {/* Grid table representation */}
                  {queryResult && (
                    <div className="border border-slate-200/80 rounded-xl overflow-hidden bg-white">
                      <div className="bg-slate-50/50 px-4 py-2 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                        <span>Resultado de consulta</span>
                        <span>{queryResult.length} registros</span>
                      </div>
                      <div className="overflow-x-auto max-h-[220px]">
                        <table className="w-full border-collapse text-left text-[11px]">
                          <thead>
                            <tr className="bg-slate-50/20 border-b border-slate-100 font-bold text-slate-500">
                              {queryColumns.map((col, idx) => (
                                <th key={idx} className="px-4 py-2.5 font-bold uppercase">{col}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
                            {queryResult.map((row, rIdx) => (
                              <tr key={rIdx} className="hover:bg-slate-50/40">
                                {queryColumns.map((col, cIdx) => (
                                  <td key={cIdx} className="px-4 py-2.5 truncate max-w-[180px]" title={String(row[col])}>
                                    {row[col] !== null ? String(row[col]) : <span className="text-slate-300">NULL</span>}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'dictionary' && (
          <div className="space-y-4 max-w-2xl">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Glosario Técnico de Métricas Psicopedagógicas</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Encuentra aclaraciones y directrices estandarizadas sobre terminología científica y métricas psicométricas requeridas para el diagnóstico institucional.
            </p>

            <div className="space-y-3.5 divide-y divide-slate-100">
              {glossaryConcepts.map((item, idx) => (
                <div key={idx} className="pt-3.5 first:pt-0">
                  <h5 className="text-xs font-bold text-indigo-700 mb-1">{item.title}</h5>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
