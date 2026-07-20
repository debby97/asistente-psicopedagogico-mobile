import React, { useState } from 'react';
import { Database, Terminal, FileText, Play, Download, Upload, AlertCircle, Sparkles, Table2, Info } from 'lucide-react';
import { executeSQLQuery, exportDatabaseToSQL, importDatabaseFromSQL, DatabaseState } from '../dbStore';

interface ConsolaSQLProps {
  dbState: DatabaseState;
  setDbState: (state: DatabaseState) => void;
}

export default function ConsolaSQL({ dbState, setDbState }: ConsolaSQLProps) {
  const [rawQuery, setRawQuery] = useState("SELECT id, nombre, area, edad_aplicacion, adaptacion_chilena FROM instrumentos WHERE area = 'Lectura' LIMIT 5;");
  const [queryResult, setQueryResult] = useState<any[] | null>(null);
  const [queryColumns, setQueryColumns] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [affectedRows, setAffectedRows] = useState<number | null>(null);

  const [dbSchema, setDbSchema] = useState([
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
    },
    {
      table: 'agenda',
      columns: ['id (VARCHAR PRIMARY KEY)', 'caso_id (VARCHAR FOREIGN KEY)', 'titulo (VARCHAR)', 'tipo (VARCHAR)', 'fecha (VARCHAR)', 'hora (VARCHAR)', 'notas (TEXT)', 'completado (BOOLEAN)']
    }
  ]);

  const handleExecute = () => {
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
        
        // Mapear el formato matricial (rows: any[][]) de vuelta a objetos legibles o renderizar directamente la matriz
        if (res.rows && res.columns) {
          setQueryColumns(res.columns);
          // Convertimos la matriz rows en objetos para renderizado fácil
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
        alert('Copia de seguridad SQL importada correctamente. Se han sincronizado todas las tablas.');
      } catch (err: any) {
        alert(`Error al importar copia de seguridad: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="h-6 w-6 text-indigo-500" />
            Consola SQL y Copias de Seguridad
          </h2>
          <p className="text-sm text-slate-500">
            Administra, realiza consultas directas y respalda toda la base de datos relacional de la aplicación como sentencias SQL compatibles con SQLite.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer">
            <Upload className="h-4 w-4" />
            Importar SQL
            <input
              type="file"
              accept=".sql"
              onChange={handleImportBackup}
              className="hidden"
            />
          </label>

          <button
            onClick={handleExportBackup}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm"
          >
            <Download className="h-4 w-4" />
            Exportar SQL (.sql)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Esquema de Base de Datos */}
        <div className="space-y-4 lg:col-span-1">
          <div className="flex items-center gap-1.5 border-b pb-1.5">
            <Info className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Esquema Relacional</span>
          </div>

          <div className="space-y-3 max-h-[450px] overflow-y-auto">
            {dbSchema.map((sch) => (
              <div key={sch.table} className="border border-slate-200 rounded-xl bg-slate-50 p-3.5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 border-b border-slate-200/50 pb-1">
                  <Table2 className="h-3.5 w-3.5 text-indigo-500" />
                  {sch.table}
                </div>
                <div className="space-y-1">
                  {sch.columns.map((col) => (
                    <span key={col} className="text-[10px] font-mono text-slate-500 block truncate">
                      • {col}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Consola Interactiva */}
        <div className="lg:col-span-3 space-y-4">
          <div className="border border-slate-200 rounded-2xl bg-slate-900 text-slate-100 p-5 space-y-3.5">
            <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-3">
              <span className="font-mono text-indigo-400 flex items-center gap-1.5">
                <Terminal className="h-4 w-4" /> SQL Editor Console (Virtual Engine)
              </span>
              <button
                onClick={handleExecute}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-1 transition-fluent"
              >
                <Play className="h-3 w-3 fill-white" />
                Ejecutar Consulta
              </button>
            </div>

            <textarea
              value={rawQuery}
              onChange={(e) => setRawQuery(e.target.value)}
              rows={4}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-green-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none select-text"
              placeholder="Escribe tu consulta SQL aquí..."
            />
          </div>

          {/* Resultados de Consulta */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Resultado de la Ejecución</span>

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3 text-xs text-red-800">
                <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
                <div>
                  <strong>Error de sintaxis o motor SQL:</strong>
                  <p className="mt-1 font-mono">{errorMessage}</p>
                </div>
              </div>
            )}

            {affectedRows !== null && affectedRows > 0 && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex gap-3 text-xs text-green-800">
                <Sparkles className="h-5 w-5 text-green-600 shrink-0" />
                <p>
                  <strong>Modificación Correcta:</strong> La consulta se ejecutó de forma segura. Filas afectadas: {affectedRows}.
                </p>
              </div>
            )}

            {queryResult && (
              <div className="overflow-x-auto border border-slate-200 rounded-xl bg-white max-h-96">
                {queryResult.length > 0 ? (
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b text-[10px] font-bold text-slate-500 uppercase">
                        {queryColumns.map((key) => (
                          <th key={key} className="p-3 border-r">{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y font-mono text-[11px] text-slate-600">
                      {queryResult.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          {queryColumns.map((key) => {
                            const val = row[key];
                            return (
                              <td key={key} className="p-3 border-r truncate max-w-xs" title={String(val)}>
                                {val === null ? 'NULL' : String(val)}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-400">
                    La consulta devolvió un conjunto de datos vacío (0 filas).
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
