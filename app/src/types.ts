export interface Instrumento {
  id: string;
  nombre: string;
  nombres_alternativos?: string;
  autor?: string;
  anio?: string;
  editorial?: string;
  pais_origen?: string;
  ultima_edicion?: string;
  area: string;
  subarea?: string;
  edad_aplicacion: string;
  curso_recomendado?: string;
  tiempo_aproximado?: string;
  aplicacion_modalidad?: string; // 'individual', 'colectiva' o 'ambos'
  materiales_requeridos?: string;
  profesional_autorizado?: string;
  nivel_evidencia?: string; // 'Alto', 'Medio', 'Bajo'
  adaptacion_chilena: 'Sí' | 'No';
  adaptaciones_otros_paises?: string;
  estado: 'vigente' | 'descontinuado';
  referencias_bibliograficas?: string;
  isbn?: string;
  enlace_editorial?: string;
  observaciones?: string;
  ficha_detallada_manual?: string;
  notas?: string;
  origen?: string;
  que_evalua?: string;
  duracion?: string;
  confiabilidad?: string;
  validez?: string;
  baremos_disponibles?: string;
  formato?: 'Papel' | 'Digital' | 'Ambos';
  costo?: string;
  subescalas_dimensiones?: string;
  contextos_recomendados?: string[];
  dificultades_asociadas?: string[];
}

export interface Caso {
  id: string;
  nombre: string;
  edad: number;
  curso: string;
  fecha?: string;
  motivo?: string;
  profesional?: string;
  estado: 'Pendiente' | 'En Proceso' | 'Finalizado';
  establecimiento_escolar?: string;
  nombre_apoderado?: string;
  contacto?: string;
  motivo_consulta?: string;
}

export interface Bateria {
  id: string;
  nombre: string;
  descripcion?: string;
  caso_id?: string; // Relación opcional con Caso
  creado_en: string;
  es_plantilla: boolean;
}

export interface BateriaItem {
  id: string;
  bateria_id: string;
  instrumento_id: string;
  sesion: number;
  orden: number;
}

export interface AgendaItem {
  id: string;
  caso_id?: string;
  titulo?: string;
  tipo: string;
  fecha: string;
  hora: string;
  notas?: string;
  completado: boolean;
}

export interface ObservacionClinica {
  id: string;
  caso_id: string;
  fecha?: string;
  conducta?: string;
  atencion?: string;
  motivacion?: string;
  interaccion?: string;
  lenguaje_espontaneo?: string;
  actitud?: string;
  observaciones_generales?: string;
  creado_en?: string;
  conducta_trabajo?: string;
  atencion_concentracion?: string;
  interaccion_social?: string;
  actitud_ante_pruebas?: string;
}

export interface Favorito {
  instrumento_id: string;
}

export interface Coleccion {
  id: string;
  nombre: string;
  descripcion?: string;
}

export interface ColeccionItem {
  coleccion_id: string;
  instrumento_id: string;
}

export interface Concepto {
  id: string;
  termino: string;
  definicion: string;
  bibliografia?: string;
}

export interface ProtocoloSugerido {
  id: string;
  motivo_consulta: string;
  ruta: string[]; // ['Entrevista', 'Observación', ...]
  descripcion: string;
  instrumentos_sugeridos: string[]; // Array de IDs de instrumentos
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
