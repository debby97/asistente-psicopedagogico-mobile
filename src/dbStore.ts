import { Instrumento, Caso, Bateria, BateriaItem, AgendaItem, ObservacionClinica, Favorito, Coleccion, ColeccionItem, Concepto, ProtocoloSugerido } from './types';
import { initialInstrumentos, initialConceptos, initialProtocolos } from './data';
import { mapInstrumentoToArea } from './utils/areaMapper';
import { EVALUA_BATTERIES, getEvaluaAsInstrumento } from './utils/evaluaData';

// Nombres de las tablas virtualizadas
export type TableName = 
  | 'instrumentos'
  | 'casos'
  | 'baterias'
  | 'bateria_items'
  | 'agenda'
  | 'observaciones'
  | 'favoritos'
  | 'colecciones'
  | 'coleccion_items'
  | 'conceptos'
  | 'protocolos_sugeridos';

export interface DatabaseState {
  instrumentos: Instrumento[];
  casos: Caso[];
  baterias: Bateria[];
  bateria_items: BateriaItem[];
  agenda: AgendaItem[];
  observaciones: ObservacionClinica[];
  favoritos: Favorito[];
  colecciones: Coleccion[];
  coleccion_items: ColeccionItem[];
  conceptos: Concepto[];
  protocolos_sugeridos: ProtocoloSugerido[];
}

const STORAGE_KEY = 'psico_eval_database';

// Helper de inicialización de base de datos
export function getInitialDatabase(): DatabaseState {
  const allBase = [...initialInstrumentos, ...EVALUA_BATTERIES.map(getEvaluaAsInstrumento)];
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Validar que existan todas las tablas requeridas
      if (parsed.instrumentos && parsed.casos) {
        // Asegurar que cualquier instrumento nuevo agregado se incorpore a la base de datos de localStorage
        const existingIds = new Set(parsed.instrumentos.map((i: any) => i.id));
        const missing = allBase.filter(i => !existingIds.has(i.id));
        if (missing.length > 0) {
          parsed.instrumentos = [...parsed.instrumentos, ...missing];
        }
        // Forzar mapeo de áreas a evaluar
        parsed.instrumentos = parsed.instrumentos.map((i: any) => ({
          ...i,
          area: mapInstrumentoToArea(i)
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        return parsed as DatabaseState;
      }
    } catch (e) {
      console.error('Error al cargar la base de datos de localStorage, reiniciando', e);
    }
  }

  // Si no hay datos, inicializar con datos por defecto
  const defaultState: DatabaseState = {
    instrumentos: allBase.map(i => ({
      ...i,
      area: mapInstrumentoToArea(i)
    })),
    casos: [
      {
        id: "caso_001",
        nombre: "Sofía Martínez",
        edad: 9,
        curso: "3° Básico",
        fecha: "2026-07-10",
        motivo: "Dificultades de lectura y sospecha de dislexia",
        profesional: "Felipe Soto (Psicopedagogo)",
        estado: "En Proceso"
      },
      {
        id: "caso_002",
        nombre: "Benjamín Muñoz",
        edad: 6,
        curso: "Kínder",
        fecha: "2026-07-15",
        motivo: "Sospecha de TEA y retraso en desarrollo psicomotor",
        profesional: "Karla Molina (Psicopedagoga)",
        estado: "Pendiente"
      }
    ],
    baterias: [
      {
        id: "bat_001",
        nombre: "Batería Lectura Sofía",
        descripcion: "Plan de evaluación inicial para Sofía centrado en velocidad y comprensión lectora",
        caso_id: "caso_001",
        creado_en: "2026-07-12",
        es_plantilla: false
      }
    ],
    bateria_items: [
      { id: "bi_001", bateria_id: "bat_001", instrumento_id: "doc_068", sesion: 1, orden: 1 }, // PROLEC-R
      { id: "bi_002", bateria_id: "bat_001", instrumento_id: "doc_104", sesion: 1, orden: 2 }, // TEDE
      { id: "bi_003", bateria_id: "bat_001", instrumento_id: "doc_168", sesion: 2, orden: 1 }  // TEVI-R
    ],
    agenda: [
      {
        id: "ag_001",
        caso_id: "caso_001",
        titulo: "Primera sesión - PROLEC-R",
        tipo: "Evaluación",
        fecha: "2026-07-18",
        hora: "10:30",
        notas: "Traer cuadernillo impreso y cronómetro",
        completado: false
      },
      {
        id: "ag_002",
        caso_id: "caso_001",
        titulo: "Segunda sesión - TEVI-R",
        tipo: "Evaluación",
        fecha: "2026-07-22",
        hora: "11:00",
        notas: "Sala de terapia libre de ruidos",
        completado: false
      },
      {
        id: "ag_003",
        caso_id: "caso_001",
        titulo: "Entrega de Informe Integrado",
        tipo: "Entrega de Informe",
        fecha: "2026-07-29",
        hora: "16:00",
        notas: "Reunión de devolución con apoderada",
        completado: false
      }
    ],
    observaciones: [
      {
        id: "obs_001",
        caso_id: "caso_001",
        fecha: "2026-07-16",
        conducta: "Sofía ingresa de manera cordial, se muestra cooperadora pero tímida.",
        atencion: "Sostiene atención sostenida durante tareas verbales de corta duración. Se distrae levemente con ruidos exteriores.",
        motivacion: "Alta hacia los elogios positivos. Requiere refuerzo constante.",
        interaccion: "Mantiene buen contacto ocular, responde con lenguaje formal.",
        lenguaje_espontaneo: "Fluido, con vocabulario adecuado para su edad cronológica.",
        actitud: "Persistente ante las dificultades, no abandona de forma impulsiva.",
        observaciones_generales: "Comportamiento general adecuado para el contexto evaluativo formal."
      }
    ],
    favoritos: [
      { instrumento_id: "doc_068" }, // PROLEC-R
      { instrumento_id: "doc_104" }, // TEDE
      { instrumento_id: "doc_168" }  // TEVI-R
    ],
    colecciones: [
      {
        id: "col_001",
        nombre: "Evaluación Dislexia",
        descripcion: "Instrumentos ideales para evaluar procesos lectores y descartar dislexia"
      },
      {
        id: "col_002",
        nombre: "Evaluación Inicial Preescolar",
        descripcion: "Batería básica de funciones y madurez para niños de 3 a 6 años"
      }
    ],
    coleccion_items: [
      { coleccion_id: "col_001", instrumento_id: "doc_068" },
      { coleccion_id: "col_001", instrumento_id: "doc_104" },
      { coleccion_id: "col_001", instrumento_id: "doc_085" },
      { coleccion_id: "col_002", instrumento_id: "doc_089" },
      { coleccion_id: "col_002", instrumento_id: "doc_148" },
      { coleccion_id: "col_002", instrumento_id: "doc_107" }
    ],
    conceptos: initialConceptos,
    protocolos_sugeridos: initialProtocolos
  };
  saveDatabase(defaultState);
  return defaultState;
}

export function saveDatabase(state: DatabaseState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ==========================================
// EXPORTADOR A SCRIPT SQL COMPATIBLE CON SQLITE
// ==========================================
export function exportDatabaseToSQL(state: DatabaseState): string {
  let sql = `-- =====================================================\n`;
  sql += `-- BASE DE DATOS: ASISTENTE DE EVALUACION PSICOPEDAGOGICA\n`;
  sql += `-- Generado automáticamente: ${new Date().toLocaleString()}\n`;
  sql += `-- Compatible con SQLite\n`;
  sql += `-- =====================================================\n\n`;

  sql += `PRAGMA foreign_keys = ON;\n\n`;

  // Helper para escapar comillas simples en strings de SQL
  const esc = (val: any) => {
    if (val === undefined || val === null) return 'NULL';
    if (typeof val === 'number') return val.toString();
    if (typeof val === 'boolean') return val ? '1' : '0';
    // Escapar comillas simples duplicándolas
    const cleanStr = val.toString().replace(/'/g, "''");
    return `'${cleanStr}'`;
  };

  // --- TABLA instrumentos ---
  sql += `-- Creación de tabla: instrumentos\n`;
  sql += `CREATE TABLE IF NOT EXISTS instrumentos (\n`;
  sql += `  id TEXT PRIMARY KEY,\n`;
  sql += `  nombre TEXT NOT NULL,\n`;
  sql += `  nombres_alternativos TEXT,\n`;
  sql += `  autor TEXT,\n`;
  sql += `  anio TEXT,\n`;
  sql += `  editorial TEXT,\n`;
  sql += `  pais_origen TEXT,\n`;
  sql += `  ultima_edicion TEXT,\n`;
  sql += `  area TEXT NOT NULL,\n`;
  sql += `  subarea TEXT,\n`;
  sql += `  edad_aplicacion TEXT NOT NULL,\n`;
  sql += `  curso_recomendado TEXT,\n`;
  sql += `  tiempo_aproximado TEXT,\n`;
  sql += `  aplicacion_modalidad TEXT,\n`;
  sql += `  materiales_requeridos TEXT,\n`;
  sql += `  profesional_autorizado TEXT,\n`;
  sql += `  nivel_evidencia TEXT,\n`;
  sql += `  adaptacion_chilena TEXT NOT NULL DEFAULT 'No',\n`;
  sql += `  adaptaciones_otros_paises TEXT,\n`;
  sql += `  estado TEXT NOT NULL DEFAULT 'vigente',\n`;
  sql += `  referencias_bibliograficas TEXT,\n`;
  sql += `  isbn TEXT,\n`;
  sql += `  enlace_editorial TEXT,\n`;
  sql += `  observaciones TEXT,\n`;
  sql += `  ficha_detallada_manual TEXT,\n`;
  sql += `  notas TEXT,\n`;
  sql += `  origen TEXT\n`;
  sql += `);\n\n`;

  state.instrumentos.forEach((ins) => {
    sql += `INSERT INTO instrumentos VALUES (${esc(ins.id)}, ${esc(ins.nombre)}, ${esc(ins.nombres_alternativos)}, ${esc(ins.autor)}, ${esc(ins.anio)}, ${esc(ins.editorial)}, ${esc(ins.pais_origen)}, ${esc(ins.ultima_edicion)}, ${esc(ins.area)}, ${esc(ins.subarea)}, ${esc(ins.edad_aplicacion)}, ${esc(ins.curso_recomendado)}, ${esc(ins.tiempo_aproximado)}, ${esc(ins.aplicacion_modalidad)}, ${esc(ins.materiales_requeridos)}, ${esc(ins.profesional_autorizado)}, ${esc(ins.nivel_evidencia)}, ${esc(ins.adaptacion_chilena)}, ${esc(ins.adaptaciones_otros_paises)}, ${esc(ins.estado)}, ${esc(ins.referencias_bibliograficas)}, ${esc(ins.isbn)}, ${esc(ins.enlace_editorial)}, ${esc(ins.observaciones)}, ${esc(ins.ficha_detallada_manual)}, ${esc(ins.notas)}, ${esc(ins.origen)});\n`;
  });
  sql += `\n`;

  // --- TABLA casos ---
  sql += `-- Creación de tabla: casos\n`;
  sql += `CREATE TABLE IF NOT EXISTS casos (\n`;
  sql += `  id TEXT PRIMARY KEY,\n`;
  sql += `  nombre TEXT NOT NULL,\n`;
  sql += `  edad INTEGER NOT NULL,\n`;
  sql += `  curso TEXT NOT NULL,\n`;
  sql += `  fecha TEXT NOT NULL,\n`;
  sql += `  motivo TEXT NOT NULL,\n`;
  sql += `  profesional TEXT NOT NULL,\n`;
  sql += `  estado TEXT NOT NULL\n`;
  sql += `);\n\n`;

  state.casos.forEach((cas) => {
    sql += `INSERT INTO casos VALUES (${esc(cas.id)}, ${esc(cas.nombre)}, ${cas.edad}, ${esc(cas.curso)}, ${esc(cas.fecha)}, ${esc(cas.motivo)}, ${esc(cas.profesional)}, ${esc(cas.estado)});\n`;
  });
  sql += `\n`;

  // --- TABLA baterias ---
  sql += `-- Creación de tabla: baterias\n`;
  sql += `CREATE TABLE IF NOT EXISTS baterias (\n`;
  sql += `  id TEXT PRIMARY KEY,\n`;
  sql += `  nombre TEXT NOT NULL,\n`;
  sql += `  descripcion TEXT,\n`;
  sql += `  caso_id TEXT,\n`;
  sql += `  creado_en TEXT NOT NULL,\n`;
  sql += `  es_plantilla INTEGER NOT NULL DEFAULT 0\n`;
  sql += `);\n\n`;

  state.baterias.forEach((bat) => {
    sql += `INSERT INTO baterias VALUES (${esc(bat.id)}, ${esc(bat.nombre)}, ${esc(bat.descripcion)}, ${esc(bat.caso_id)}, ${esc(bat.creado_en)}, ${bat.es_plantilla ? 1 : 0});\n`;
  });
  sql += `\n`;

  // --- TABLA bateria_items ---
  sql += `-- Creación de tabla: bateria_items\n`;
  sql += `CREATE TABLE IF NOT EXISTS bateria_items (\n`;
  sql += `  id TEXT PRIMARY KEY,\n`;
  sql += `  bateria_id TEXT NOT NULL,\n`;
  sql += `  instrumento_id TEXT NOT NULL,\n`;
  sql += `  sesion INTEGER NOT NULL,\n`;
  sql += `  orden INTEGER NOT NULL\n`;
  sql += `);\n\n`;

  state.bateria_items.forEach((item) => {
    sql += `INSERT INTO bateria_items VALUES (${esc(item.id)}, ${esc(item.bateria_id)}, ${esc(item.instrumento_id)}, ${item.sesion}, ${item.orden});\n`;
  });
  sql += `\n`;

  // --- TABLA agenda ---
  sql += `-- Creación de tabla: agenda\n`;
  sql += `CREATE TABLE IF NOT EXISTS agenda (\n`;
  sql += `  id TEXT PRIMARY KEY,\n`;
  sql += `  caso_id TEXT,\n`;
  sql += `  titulo TEXT NOT NULL,\n`;
  sql += `  tipo TEXT NOT NULL,\n`;
  sql += `  fecha TEXT NOT NULL,\n`;
  sql += `  hora TEXT NOT NULL,\n`;
  sql += `  notas TEXT,\n`;
  sql += `  completado INTEGER NOT NULL DEFAULT 0\n`;
  sql += `);\n\n`;

  state.agenda.forEach((ag) => {
    sql += `INSERT INTO agenda VALUES (${esc(ag.id)}, ${esc(ag.caso_id)}, ${esc(ag.titulo)}, ${esc(ag.tipo)}, ${esc(ag.fecha)}, ${esc(ag.hora)}, ${esc(ag.notas)}, ${ag.completado ? 1 : 0});\n`;
  });
  sql += `\n`;

  // --- TABLA observaciones ---
  sql += `-- Creación de tabla: observaciones\n`;
  sql += `CREATE TABLE IF NOT EXISTS observaciones (\n`;
  sql += `  id TEXT PRIMARY KEY,\n`;
  sql += `  caso_id TEXT NOT NULL,\n`;
  sql += `  fecha TEXT NOT NULL,\n`;
  sql += `  conducta TEXT,\n`;
  sql += `  atencion TEXT,\n`;
  sql += `  motivacion TEXT,\n`;
  sql += `  interaccion TEXT,\n`;
  sql += `  lenguaje_espontaneo TEXT,\n`;
  sql += `  actitud TEXT,\n`;
  sql += `  observaciones_generales TEXT\n`;
  sql += `);\n\n`;

  state.observaciones.forEach((obs) => {
    sql += `INSERT INTO observaciones VALUES (${esc(obs.id)}, ${esc(obs.caso_id)}, ${esc(obs.fecha)}, ${esc(obs.conducta)}, ${esc(obs.atencion)}, ${esc(obs.motivacion)}, ${esc(obs.interaccion)}, ${esc(obs.lenguaje_espontaneo)}, ${esc(obs.actitud)}, ${esc(obs.observaciones_generales)});\n`;
  });
  sql += `\n`;

  // --- TABLA favoritos ---
  sql += `-- Creación de tabla: favoritos\n`;
  sql += `CREATE TABLE IF NOT EXISTS favoritos (\n`;
  sql += `  instrumento_id TEXT PRIMARY KEY\n`;
  sql += `);\n\n`;

  state.favoritos.forEach((fav) => {
    sql += `INSERT INTO favoritos VALUES (${esc(fav.instrumento_id)});\n`;
  });
  sql += `\n`;

  // --- TABLA colecciones ---
  sql += `-- Creación de tabla: colecciones\n`;
  sql += `CREATE TABLE IF NOT EXISTS colecciones (\n`;
  sql += `  id TEXT PRIMARY KEY,\n`;
  sql += `  nombre TEXT NOT NULL,\n`;
  sql += `  descripcion TEXT\n`;
  sql += `);\n\n`;

  state.colecciones.forEach((col) => {
    sql += `INSERT INTO colecciones VALUES (${esc(col.id)}, ${esc(col.nombre)}, ${esc(col.descripcion)});\n`;
  });
  sql += `\n`;

  // --- TABLA coleccion_items ---
  sql += `-- Creación de tabla: coleccion_items\n`;
  sql += `CREATE TABLE IF NOT EXISTS coleccion_items (\n`;
  sql += `  coleccion_id TEXT NOT NULL,\n`;
  sql += `  instrumento_id TEXT NOT NULL,\n`;
  sql += `  PRIMARY KEY (coleccion_id, instrumento_id)\n`;
  sql += `);\n\n`;

  state.coleccion_items.forEach((item) => {
    sql += `INSERT INTO coleccion_items VALUES (${esc(item.coleccion_id)}, ${esc(item.instrumento_id)});\n`;
  });
  sql += `\n`;

  // --- TABLA conceptos ---
  sql += `-- Creación de tabla: conceptos\n`;
  sql += `CREATE TABLE IF NOT EXISTS conceptos (\n`;
  sql += `  id TEXT PRIMARY KEY,\n`;
  sql += `  termino TEXT NOT NULL,\n`;
  sql += `  definicion TEXT NOT NULL,\n`;
  sql += `  bibliografia TEXT\n`;
  sql += `);\n\n`;

  state.conceptos.forEach((con) => {
    sql += `INSERT INTO conceptos VALUES (${esc(con.id)}, ${esc(con.termino)}, ${esc(con.definicion)}, ${esc(con.bibliografia)});\n`;
  });
  sql += `\n`;

  // --- TABLA protocolos_sugeridos ---
  sql += `-- Creación de tabla: protocolos_sugeridos\n`;
  sql += `CREATE TABLE IF NOT EXISTS protocolos_sugeridos (\n`;
  sql += `  id TEXT PRIMARY KEY,\n`;
  sql += `  motivo_consulta TEXT NOT NULL,\n`;
  sql += `  ruta TEXT NOT NULL,\n`; // Guardado como JSON o string con comas
  sql += `  descripcion TEXT NOT NULL,\n`;
  sql += `  instrumentos_sugeridos TEXT NOT NULL\n`; // Guardado como JSON o string
  sql += `);\n\n`;

  state.protocolos_sugeridos.forEach((prot) => {
    sql += `INSERT INTO protocolos_sugeridos VALUES (${esc(prot.id)}, ${esc(prot.motivo_consulta)}, ${esc(JSON.stringify(prot.ruta))}, ${esc(prot.descripcion)}, ${esc(JSON.stringify(prot.instrumentos_sugeridos))});\n`;
  });
  sql += `\n`;

  return sql;
}

// ==========================================
// IMPORTADOR DE SQL (PARSER SIMPLE DE SENTENCIAS INSERT)
// ==========================================
export function importDatabaseFromSQL(sqlText: string, currentState: DatabaseState): DatabaseState {
  const state: DatabaseState = {
    instrumentos: [],
    casos: [],
    baterias: [],
    bateria_items: [],
    agenda: [],
    observaciones: [],
    favoritos: [],
    colecciones: [],
    coleccion_items: [],
    conceptos: [],
    protocolos_sugeridos: []
  };

  const lines = sqlText.split('\n');
  let loadedTables = new Set<string>();

  // Helper para decodificar un string SQL (comilla simple duplicada, remueve extremos)
  const parseVal = (vStr: string) => {
    vStr = vStr.trim();
    if (vStr.toUpperCase() === 'NULL') return null;
    if (vStr.startsWith("'") && vStr.endsWith("'")) {
      let unquoted = vStr.substring(1, vStr.length - 1);
      return unquoted.replace(/''/g, "'");
    }
    // Es número
    if (!isNaN(Number(vStr))) return Number(vStr);
    return vStr;
  };

  // Expresión regular para capturar INSERT INTO tabla VALUES (valores);
  const insertRegex = /INSERT\s+INTO\s+(\w+)\s+VALUES\s*\((.*)\)\s*;/i;

  lines.forEach((line) => {
    const match = line.match(insertRegex);
    if (match) {
      const table = match[1].toLowerCase();
      const valStr = match[2];

      // Separar por comas respetando comillas
      const values: any[] = [];
      let inString = false;
      let currentVal = "";
      for (let i = 0; i < valStr.length; i++) {
        const char = valStr[i];
        if (char === "'" && (i === 0 || valStr[i - 1] !== "\\")) {
          // Verificar si es comilla duplicada
          if (inString && valStr[i + 1] === "'") {
            currentVal += "'";
            i++; // saltar la siguiente comilla
          } else {
            inString = !inString;
            currentVal += "'";
          }
        } else if (char === "," && !inString) {
          values.push(parseVal(currentVal));
          currentVal = "";
        } else {
          currentVal += char;
        }
      }
      if (currentVal) {
        values.push(parseVal(currentVal));
      }

      loadedTables.add(table);

      try {
        if (table === 'instrumentos') {
          state.instrumentos.push({
            id: values[0] || `ins_${Math.random().toString(36).substr(2, 9)}`,
            nombre: values[1] || 'Sin Nombre',
            nombres_alternativos: values[2] || undefined,
            autor: values[3] || undefined,
            anio: values[4] || undefined,
            editorial: values[5] || undefined,
            pais_origen: values[6] || undefined,
            ultima_edicion: values[7] || undefined,
            area: values[8] || 'Sin Área',
            subarea: values[9] || undefined,
            edad_aplicacion: values[10] || 'Todas',
            curso_recomendado: values[11] || undefined,
            tiempo_aproximado: values[12] || undefined,
            aplicacion_modalidad: values[13] || undefined,
            materiales_requeridos: values[14] || undefined,
            profesional_autorizado: values[15] || undefined,
            nivel_evidencia: values[16] || undefined,
            adaptacion_chilena: (values[17] === 'Sí' ? 'Sí' : 'No'),
            adaptaciones_otros_paises: values[18] || undefined,
            estado: (values[19] === 'descontinuado' ? 'descontinuado' : 'vigente'),
            referencias_bibliograficas: values[20] || undefined,
            isbn: values[21] || undefined,
            enlace_editorial: values[22] || undefined,
            observaciones: values[23] || undefined,
            ficha_detallada_manual: values[24] || undefined,
            notas: values[25] || undefined,
            origen: values[26] || undefined,
          });
        } else if (table === 'casos') {
          state.casos.push({
            id: values[0],
            nombre: values[1],
            edad: Number(values[2]) || 0,
            curso: values[3],
            fecha: values[4],
            motivo: values[5],
            profesional: values[6],
            estado: values[7] as any || 'Pendiente'
          });
        } else if (table === 'baterias') {
          state.baterias.push({
            id: values[0],
            nombre: values[1],
            descripcion: values[2],
            caso_id: values[3],
            creado_en: values[4],
            es_plantilla: Number(values[5]) === 1
          });
        } else if (table === 'bateria_items') {
          state.bateria_items.push({
            id: values[0],
            bateria_id: values[1],
            instrumento_id: values[2],
            sesion: Number(values[3]) || 1,
            orden: Number(values[4]) || 1
          });
        } else if (table === 'agenda') {
          state.agenda.push({
            id: values[0],
            caso_id: values[1] || undefined,
            titulo: values[2],
            tipo: values[3] as any,
            fecha: values[4],
            hora: values[5],
            notas: values[6],
            completado: Number(values[7]) === 1
          });
        } else if (table === 'observaciones') {
          state.observaciones.push({
            id: values[0],
            caso_id: values[1],
            fecha: values[2],
            conducta: values[3],
            atencion: values[4],
            motivacion: values[5],
            interaccion: values[6],
            lenguaje_espontaneo: values[7],
            actitud: values[8],
            observaciones_generales: values[9]
          });
        } else if (table === 'favoritos') {
          state.favoritos.push({
            instrumento_id: values[0]
          });
        } else if (table === 'colecciones') {
          state.colecciones.push({
            id: values[0],
            nombre: values[1],
            descripcion: values[2]
          });
        } else if (table === 'coleccion_items') {
          state.coleccion_items.push({
            coleccion_id: values[0],
            instrumento_id: values[1]
          });
        } else if (table === 'conceptos') {
          state.conceptos.push({
            id: values[0],
            termino: values[1],
            definicion: values[2],
            bibliografia: values[3]
          });
        } else if (table === 'protocolos_sugeridos') {
          let rutaArr: string[] = [];
          let insSugeridosArr: string[] = [];
          try {
            rutaArr = JSON.parse(values[2]);
          } catch (e) {
            rutaArr = (values[2] || '').split(',').map((x: string) => x.trim()).filter(Boolean);
          }
          try {
            insSugeridosArr = JSON.parse(values[4]);
          } catch (e) {
            insSugeridosArr = (values[4] || '').split(',').map((x: string) => x.trim()).filter(Boolean);
          }

          state.protocolos_sugeridos.push({
            id: values[0],
            motivo_consulta: values[1],
            ruta: rutaArr,
            descripcion: values[3],
            instrumentos_sugeridos: insSugeridosArr
          });
        }
      } catch (e) {
        console.error(`Error al procesar fila de la tabla ${table}:`, e);
      }
    }
  });

  // Si no se leyó nada de una tabla específica, mantener el contenido actual para no perder todo el contexto
  const finalState = { ...currentState };
  if (loadedTables.has('instrumentos')) finalState.instrumentos = state.instrumentos;
  if (loadedTables.has('casos')) finalState.casos = state.casos;
  if (loadedTables.has('baterias')) finalState.baterias = state.baterias;
  if (loadedTables.has('bateria_items')) finalState.bateria_items = state.bateria_items;
  if (loadedTables.has('agenda')) finalState.agenda = state.agenda;
  if (loadedTables.has('observaciones')) finalState.observaciones = state.observaciones;
  if (loadedTables.has('favoritos')) finalState.favoritos = state.favoritos;
  if (loadedTables.has('colecciones')) finalState.colecciones = state.colecciones;
  if (loadedTables.has('coleccion_items')) finalState.coleccion_items = state.coleccion_items;
  if (loadedTables.has('conceptos')) finalState.conceptos = state.conceptos;
  if (loadedTables.has('protocolos_sugeridos')) finalState.protocolos_sugeridos = state.protocolos_sugeridos;

  saveDatabase(finalState);
  return finalState;
}

// ==========================================
// MOTOR SQLITE VIRTUAL EN JAVASCRIPT
// ==========================================
export interface SQLQueryResult {
  columns: string[];
  rows: any[][];
  error?: string;
  affectedRows?: number;
  message?: string;
}

export function executeSQLQuery(sql: string, state: DatabaseState, updateState: (ns: DatabaseState) => void): SQLQueryResult {
  const cleanSql = sql.trim().replace(/;+$/, '').trim();
  const queryLower = cleanSql.toLowerCase();

  // Helper para buscar tablas y campos
  const getTableData = (name: string): any[] | null => {
    switch(name.toLowerCase()) {
      case 'instrumentos': return state.instrumentos;
      case 'casos': return state.casos;
      case 'baterias': return state.baterias;
      case 'bateria_items': return state.bateria_items;
      case 'agenda': return state.agenda;
      case 'observaciones': return state.observaciones;
      case 'favoritos': return state.favoritos;
      case 'colecciones': return state.colecciones;
      case 'coleccion_items': return state.coleccion_items;
      case 'conceptos': return state.conceptos;
      case 'protocolos_sugeridos': return state.protocolos_sugeridos;
      default: return null;
    }
  };

  try {
    // ------------------------------------------
    // SENTENCIA: SELECT
    // ------------------------------------------
    if (queryLower.startsWith('select')) {
      // Intentar extraer campos, tabla y filtro simple
      // SELECT [campos] FROM [tabla] [WHERE campo = 'valor']
      const selectMatch = cleanSql.match(/select\s+(.+?)\s+from\s+(\w+)(?:\s+where\s+(.+))?/i);
      if (!selectMatch) {
        return { columns: [], rows: [], error: "Sintaxis de SELECT no soportada. Use formato: SELECT * FROM tabla [WHERE campo = 'valor']" };
      }

      const fieldsStr = selectMatch[1].trim();
      const tableName = selectMatch[2].trim();
      const whereStr = selectMatch[3] ? selectMatch[3].trim() : null;

      const data = getTableData(tableName);
      if (!data) {
        return { columns: [], rows: [], error: `Tabla '${tableName}' no encontrada.` };
      }

      if (data.length === 0) {
        // Retornar solo las columnas vacías
        const sampleKeys = ['id'];
        return { columns: sampleKeys, rows: [], message: "Consulta exitosa. La tabla está vacía." };
      }

      // Filtrar filas
      let filteredData = [...data];
      if (whereStr) {
        const eqMatch = whereStr.match(/(\w+)\s*=\s*['"]?([^'"]+)['"]?/i);
        const likeMatch = whereStr.match(/(\w+)\s+like\s+['"]%?([^%]+)%?['"]/i);
        
        if (eqMatch) {
          const field = eqMatch[1].toLowerCase();
          const value = eqMatch[2].toLowerCase();
          filteredData = filteredData.filter(row => {
            // Encontrar llave real (case-insensitive)
            const realKey = Object.keys(row).find(k => k.toLowerCase() === field);
            if (!realKey) return false;
            return String(row[realKey]).toLowerCase() === value;
          });
        } else if (likeMatch) {
          const field = likeMatch[1].toLowerCase();
          const value = likeMatch[2].toLowerCase();
          filteredData = filteredData.filter(row => {
            const realKey = Object.keys(row).find(k => k.toLowerCase() === field);
            if (!realKey) return false;
            return String(row[realKey]).toLowerCase().includes(value);
          });
        } else {
          return { columns: [], rows: [], error: "Filtro WHERE no soportado. Soporta WHERE campo = 'valor' o WHERE campo LIKE '%valor%'" };
        }
      }

      // Determinar columnas a proyectar
      let columns: string[] = [];
      const allKeys = Object.keys(data[0]);

      if (fieldsStr === '*') {
        columns = allKeys;
      } else {
        columns = fieldsStr.split(',').map(f => f.trim().toLowerCase());
        // Filtrar solo las que existen
        columns = columns.filter(col => allKeys.some(k => k.toLowerCase() === col));
      }

      // Construir filas matriciales
      const rows = filteredData.map(row => {
        return columns.map(col => {
          const realKey = Object.keys(row).find(k => k.toLowerCase() === col);
          return realKey ? row[realKey] : null;
        });
      });

      return {
        columns,
        rows,
        message: `SELECT exitoso. Se recuperaron ${rows.length} registros de la tabla '${tableName}'.`
      };
    }

    // ------------------------------------------
    // SENTENCIA: INSERT
    // ------------------------------------------
    if (queryLower.startsWith('insert')) {
      // INSERT INTO tabla (campos) VALUES (valores)
      const insertMatch = cleanSql.match(/insert\s+into\s+(\w+)\s*\((.+?)\)\s*values\s*\((.+?)\)/i);
      if (!insertMatch) {
        return { columns: [], rows: [], error: "Sintaxis de INSERT no soportada. Use formato: INSERT INTO tabla (col1, col2) VALUES ('val1', 'val2')" };
      }

      const tableName = insertMatch[1].trim();
      const colsStr = insertMatch[2].trim();
      const valsStr = insertMatch[3].trim();

      const data = getTableData(tableName);
      if (!data) {
        return { columns: [], rows: [], error: `Tabla '${tableName}' no encontrada.` };
      }

      const cols = colsStr.split(',').map(c => c.trim().toLowerCase());
      // Parsear valores respetando comillas
      const vals: any[] = [];
      let inString = false;
      let currentVal = "";
      for (let i = 0; i < valsStr.length; i++) {
        const char = valsStr[i];
        if (char === "'" && (i === 0 || valsStr[i - 1] !== "\\")) {
          inString = !inString;
        } else if (char === "," && !inString) {
          vals.push(currentVal.trim().replace(/^['"]|['"]$/g, ''));
          currentVal = "";
        } else {
          currentVal += char;
        }
      }
      if (currentVal) {
        vals.push(currentVal.trim().replace(/^['"]|['"]$/g, ''));
      }

      if (cols.length !== vals.length) {
        return { columns: [], rows: [], error: `La cantidad de columnas (${cols.length}) no coincide con los valores (${vals.length}).` };
      }

      // Crear nuevo objeto
      const newRecord: any = {};
      cols.forEach((col, idx) => {
        // Encontrar tipo o campo correspondiente
        newRecord[col] = vals[idx];
      });

      if (!newRecord.id) {
        newRecord.id = `sql_${Math.random().toString(36).substr(2, 9)}`;
      }

      // Comprobar claves primarias
      const exists = data.some(row => String(row.id).toLowerCase() === String(newRecord.id).toLowerCase());
      if (exists) {
        return { columns: [], rows: [], error: `Violación de restricción UNIQUE (PRIMARY KEY) en 'id' = '${newRecord.id}'.` };
      }

      // Guardar en el estado
      const newState = { ...state };
      const tableData = getTableData(tableName)!;
      tableData.push(newRecord);

      updateState(newState);
      saveDatabase(newState);

      return {
        columns: ['id'],
        rows: [[newRecord.id]],
        affectedRows: 1,
        message: `INSERT exitoso. Registro creado en tabla '${tableName}' con id '${newRecord.id}'.`
      };
    }

    // ------------------------------------------
    // SENTENCIA: DELETE
    // ------------------------------------------
    if (queryLower.startsWith('delete')) {
      // DELETE FROM tabla WHERE id = 'val'
      const deleteMatch = cleanSql.match(/delete\s+from\s+(\w+)\s+where\s+(.+)/i);
      if (!deleteMatch) {
        return { columns: [], rows: [], error: "Sintaxis de DELETE no soportada. Use formato: DELETE FROM tabla WHERE id = 'valor'" };
      }

      const tableName = deleteMatch[1].trim();
      const whereStr = deleteMatch[2].trim();

      const data = getTableData(tableName);
      if (!data) {
        return { columns: [], rows: [], error: `Tabla '${tableName}' no encontrada.` };
      }

      const eqMatch = whereStr.match(/id\s*=\s*['"]?([^'"]+)['"]?/i);
      if (!eqMatch) {
        return { columns: [], rows: [], error: "Sintaxis WHERE en DELETE solo soporta id = 'valor'" };
      }

      const idVal = eqMatch[1].toLowerCase();
      const initialLength = data.length;

      const newState = { ...state };
      let tableData = getTableData(tableName)!;
      const index = tableData.findIndex(row => String(row.id).toLowerCase() === idVal);
      
      if (index === -1) {
        return { columns: [], rows: [], message: `DELETE ejecutado. Cero registros afectados.` };
      }

      tableData.splice(index, 1);
      updateState(newState);
      saveDatabase(newState);

      return {
        columns: [],
        rows: [],
        affectedRows: 1,
        message: `DELETE exitoso. 1 registro eliminado de la tabla '${tableName}'.`
      };
    }

    return { columns: [], rows: [], error: "Instrucción SQL no reconocida o no soportada en este entorno virtualizado. Soporta SELECT, INSERT, y DELETE." };

  } catch (err: any) {
    return { columns: [], rows: [], error: `Error de sintaxis SQL: ${err.message}` };
  }
}
