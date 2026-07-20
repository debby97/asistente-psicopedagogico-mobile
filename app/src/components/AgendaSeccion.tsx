import React, { useState } from 'react';
import { AgendaItem, Caso } from '../types';
import { Calendar, Plus, Trash2, Check, Clock, FileText, Bell, Sparkles, X, CheckSquare, Square } from 'lucide-react';

interface AgendaSeccionProps {
  agenda: AgendaItem[];
  casos: Caso[];
  onAddAgendaItem: (item: Omit<AgendaItem, 'id' | 'creado_en'>) => void;
  onToggleAgendaComplete: (id: string) => void;
  onDeleteAgendaItem: (id: string) => void;
}

export default function AgendaSeccion({
  agenda,
  casos,
  onAddAgendaItem,
  onToggleAgendaComplete,
  onDeleteAgendaItem
}: AgendaSeccionProps) {
  const [showAddModal, setShowAddModal] = useState(false);

  // Formulario Agenda
  const [aCasoId, setACasoId] = useState('');
  const [aFecha, setAFecha] = useState(new Date().toISOString().split('T')[0]);
  const [aHora, setAHora] = useState('09:00');
  const [aTipo, setATipo] = useState<'Evaluación' | 'Entrevista' | 'Entrega Informe' | 'Otro'>('Evaluación');
  const [aNotas, setANotas] = useState('');
  const [agendaItemToDelete, setAgendaItemToDelete] = useState<string | null>(null);

  const handleCreateAgendaItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aFecha || !aHora) return;

    onAddAgendaItem({
      caso_id: aCasoId || undefined,
      fecha: aFecha,
      hora: aHora,
      tipo: aTipo,
      notas: aNotas || undefined,
      completado: false
    });

    // Resetear
    setACasoId('');
    setAFecha(new Date().toISOString().split('T')[0]);
    setAHora('09:00');
    setATipo('Evaluación');
    setANotas('');
    setShowAddModal(false);
  };

  const getTipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'Evaluación': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'Entrevista': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Entrega Informe': return 'bg-green-50 text-green-700 border-green-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera del Módulo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-2xl font-display font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="h-6 w-6 text-indigo-500" />
            Agenda y Calendario Clínico
          </h2>
          <p className="text-sm text-slate-500">
            Planifica tus sesiones de evaluación diagnóstica, entrevistas con apoderados y plazos de entrega de informes psicopedagógicos.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-fluent"
        >
          <Plus className="h-4 w-4" />
          Agendar Evento
        </button>
      </div>

      {/* Lista de Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Panel Principal */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compromisos Próximos</h3>

          {agenda.length > 0 ? (
            <div className="space-y-3">
              {agenda
                .sort((a, b) => a.fecha.localeCompare(b.fecha) || a.hora.localeCompare(b.hora))
                .map((item) => {
                  const estudiante = casos.find(c => c.id === item.caso_id);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 bg-white border rounded-xl hover:shadow-sm transition-fluent flex items-start justify-between gap-4 ${
                        item.completado ? 'border-slate-100 bg-slate-50/50 opacity-75' : 'border-slate-200'
                      }`}
                    >
                      <div className="flex items-start gap-3.5">
                        <button
                          onClick={() => onToggleAgendaComplete(item.id)}
                          className="mt-0.5 text-slate-400 hover:text-indigo-600 shrink-0"
                          title={item.completado ? 'Marcar como pendiente' : 'Marcar como completado'}
                        >
                          {item.completado ? (
                            <CheckSquare className="h-5 w-5 text-indigo-600 fill-indigo-50" />
                          ) : (
                            <Square className="h-5 w-5 text-slate-300" />
                          )}
                        </button>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[9px] border px-2 py-0.5 rounded font-bold uppercase ${getTipoBadgeColor(item.tipo)}`}>
                              {item.tipo}
                            </span>
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                              <Clock className="h-3 w-3 text-slate-400" />
                              {item.fecha} a las {item.hora} hrs
                            </span>
                          </div>

                          <h4 className="text-xs font-semibold text-slate-900 leading-tight">
                            {estudiante ? `Caso: ${estudiante.nombre}` : 'Asunto General / Consulta'}
                          </h4>

                          {item.notas && (
                            <p className="text-[11px] text-slate-500 font-mono leading-relaxed pt-1">
                              {item.notas}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setAgendaItemToDelete(item.id)}
                        className="p-1 text-slate-400 hover:text-red-500 rounded hover:bg-slate-50 shrink-0"
                        title="Eliminar de la agenda"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="py-12 flex flex-col items-center justify-center text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl">
              <Calendar className="h-8 w-8 text-slate-400 mb-2 animate-bounce" />
              <h4 className="text-xs font-semibold text-slate-700">Agenda vacía</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Comience agendando compromisos o plazos de entrega.</p>
              <button
                onClick={() => setShowAddModal(true)}
                className="mt-3 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm"
              >
                Agendar Evento
              </button>
            </div>
          )}
        </div>

        {/* Panel de Soporte Temporal */}
        <div className="space-y-4">
          <div className="bg-slate-50 p-5 rounded-xl border border-slate-200/60 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 border-b border-slate-200 pb-1.5 uppercase tracking-wider">
              Resumen Clínico Semanal
            </h3>

            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200/40">
                <span className="text-slate-500 font-medium">Evaluaciones Activas:</span>
                <strong className="text-slate-800 text-sm">
                  {agenda.filter(a => a.tipo === 'Evaluación' && !a.completado).length}
                </strong>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200/40">
                <span className="text-slate-500 font-medium">Entrevistas con Apoderados:</span>
                <strong className="text-slate-800 text-sm">
                  {agenda.filter(a => a.tipo === 'Entrevista' && !a.completado).length}
                </strong>
              </div>
              <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200/40">
                <span className="text-slate-500 font-medium">Entregas de Informe Pendientes:</span>
                <strong className="text-slate-800 text-sm">
                  {agenda.filter(a => a.tipo === 'Entrega Informe' && !a.completado).length}
                </strong>
              </div>
            </div>
          </div>

          <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-3 text-xs text-slate-700 leading-relaxed">
            <Bell className="h-5 w-5 text-indigo-500 shrink-0" />
            <p>
              <strong>Recordatorio Ético:</strong> Mantén siempre un margen de 24 horas para redactar informes de síntesis diagnóstica para asegurar el rigor psicopedagógico.
            </p>
          </div>
        </div>
      </div>

      {/* ==========================================
          MODAL: AGENDAR EVENTO
          ========================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-2xl">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-indigo-600" />
                <h3 className="font-display font-bold text-slate-900 text-base">Agendar Nuevo Compromiso</h3>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAgendaItem} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Vincular Estudiante</label>
                <select
                  value={aCasoId}
                  onChange={(e) => setACasoId(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none bg-white"
                >
                  <option value="">Compromiso general / Administrativo</option>
                  {casos.map(c => (
                    <option key={c.id} value={c.id}>{c.nombre}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Fecha *</label>
                  <input
                    type="date"
                    required
                    value={aFecha}
                    onChange={(e) => setAFecha(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hora *</label>
                  <input
                    type="time"
                    required
                    value={aHora}
                    onChange={(e) => setAHora(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Tipo de Compromiso *</label>
                <select
                  value={aTipo}
                  onChange={(e) => setATipo(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none bg-white"
                >
                  <option value="Evaluación">Evaluación Diagnóstica / Sesión de Test</option>
                  <option value="Entrevista">Entrevista de Anamnesis / Devolución</option>
                  <option value="Entrega Informe">Fecha Límite / Entrega de Informe</option>
                  <option value="Otro">Otro Compromiso / Reunión de Coordinación</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Notas o Recordatorio</label>
                <textarea
                  value={aNotas}
                  onChange={(e) => setANotas(e.target.value)}
                  placeholder="E.g., Aplicación de subtest de velocidad de PROLEC-R. Recordar llevar cronómetro físico."
                  rows={2}
                  className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none resize-none"
                />
              </div>

              <div className="border-t border-slate-100 pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm"
                >
                  Agendar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Custom Delete Agenda Item Confirmation */}
      {agendaItemToDelete && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border-2 border-[#1A1A1A] shadow-[4px_4px_0px_0px_#1A1A1A] max-w-sm w-full p-6 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-rose-600">
              ¿Eliminar Cita?
            </h3>
            
            <p className="text-xs text-slate-600 font-bold leading-relaxed">
              ¿Estás seguro de que deseas eliminar esta cita de la agenda? Esta acción no se puede deshacer.
            </p>

            <div className="flex justify-end gap-3 pt-4 border-t border-dashed border-slate-200">
              <button
                type="button"
                onClick={() => setAgendaItemToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-500 hover:bg-slate-50 border border-slate-200 rounded-lg"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteAgendaItem(agendaItemToDelete);
                  setAgendaItemToDelete(null);
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 rounded-lg shadow-sm"
              >
                Eliminar Cita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
