import { Instrumento } from '../types';

export interface EvaluaSubtest {
  nombre: string;
  descripcion: string;
  area: string;
}

export interface EvaluaBatteryData {
  id: string;
  nombre: string;
  destinatarios: string;
  edad_rango: string;
  tiempo: string;
  descripcion_general: string;
  autores: string;
  areas_principales: string[];
  subtests: EvaluaSubtest[];
  baremos: string;
  enfoque_pie: string;
}

export const EVALUA_BATTERIES: EvaluaBatteryData[] = [
  {
    id: "evalua_0",
    nombre: "Batería Psicopedagógica Evalúa 0",
    destinatarios: "Final de Educación Parvularia (Kínder) y comienzo de 1º de Educación Básica",
    edad_rango: "5 a 6 años",
    tiempo: "Aprox. 2 horas",
    descripcion_general: "Diseñada para evaluar los prerrequisitos cognitivos, psicomotrices y socioafectivos fundamentales para la iniciación en la lectoescritura y el cálculo matemático formal.",
    autores: "Jesús García Vidal, Daniel González Manjón",
    areas_principales: ["Cognitiva", "Psicomotora", "Lenguaje", "Socioafectiva"],
    subtests: [
      { nombre: "Clasificación", descripcion: "Capacidad de agrupar objetos verbales o visuales según atributos comunes.", area: "Cognitiva" },
      { nombre: "Series", descripcion: "Ordenación lógica y secuenciación de estímulos visuales.", area: "Cognitiva" },
      { nombre: "Organización Perceptiva", descripcion: "Habilidad visoespacial y reproducción de figuras geométricas sencillas.", area: "Cognitiva" },
      { nombre: "Letras y Números", descripcion: "Conocimiento y reconocimiento de símbolos gráficos básicos y fonemas.", area: "Cognitiva" },
      { nombre: "Memoria y Atención", descripcion: "Atención selectiva sostenida a través de la búsqueda de estímulos visuales idénticos.", area: "Cognitiva" },
      { nombre: "Esquema Corporal", descripcion: "Reconocimiento y ubicación espacial de las partes de su propio cuerpo.", area: "Psicomotora" },
      { nombre: "Coordinación Visomotriz", descripcion: "Trazado, control motor y precisión del dibujo.", area: "Psicomotora" },
      { nombre: "Lateralidad", descripcion: "Definición del predominio manual, ocular, pedal y auditivo.", area: "Psicomotora" },
      { nombre: "Palabras y Frases", descripcion: "Comprensión léxica y vocabulario pasivo básico en oraciones simples.", area: "Lenguaje" },
      { nombre: "Recepción Auditiva y Fonológica", descripcion: "Discriminación fonémica y articulación fonológica.", area: "Lenguaje" },
      { nombre: "Autoestima", descripcion: "Autopercepción inicial del estudiante respecto a sus habilidades y valía personal.", area: "Socioafectiva" },
      { nombre: "Adaptación Escolar", descripcion: "Predisposición y nivel de comodidad del niño frente a la rutina escolar.", area: "Socioafectiva" },
      { nombre: "Socialización", descripcion: "Interacción inicial y actitudes prosociales con pares.", area: "Socioafectiva" }
    ],
    baremos: "Baremos chilenos actualizados. Adaptado por coordinadores locales en conjunto con Giunti EOS.",
    enfoque_pie: "Sugerido para evaluación diagnóstica de ingreso en estudiantes con sospecha de NEE de tipo intelectual o del desarrollo durante la transición parvularia-básica."
  },
  {
    id: "evalua_1",
    nombre: "Batería Psicopedagógica Evalúa 1",
    destinatarios: "Final de 1º de Educación Básica y comienzo de 2º de Educación Básica",
    edad_rango: "6 a 7 años",
    tiempo: "Aprox. 2.5 horas",
    descripcion_general: "Evalúa los procesos instrumentales básicos de lectura, escritura y matemáticas junto con bases cognitivas y niveles de adaptación al finalizar el primer año básico.",
    autores: "Jesús García Vidal, Daniel González Manjón",
    areas_principales: ["Cognitiva", "Lectura", "Escritura", "Matemáticas", "Socioafectiva"],
    subtests: [
      { nombre: "Bases del Razonamiento: Pensamiento Analógico", descripcion: "Identificación de relaciones conceptuales y establecimiento de analogías visuales.", area: "Cognitiva" },
      { nombre: "Bases del Razonamiento: Organización Perceptiva", descripcion: "Capacidad para completar figuras simétricas y organizar componentes espaciales.", area: "Cognitiva" },
      { nombre: "Bases del Razonamiento: Clasificación", descripcion: "Agrupación de categorías lógicas semánticas y visuales.", area: "Cognitiva" },
      { nombre: "Memoria y Atención", descripcion: "Mantenimiento de la atención focalizada y retención de estímulos visuales.", area: "Cognitiva" },
      { nombre: "Comprensión Lectora", descripcion: "Habilidad para extraer el significado de palabras escritas, oraciones sencillas y seguir instrucciones.", area: "Lectura" },
      { nombre: "Exactitud Lectora", descripcion: "Lectura de palabras aisladas de diferente longitud y pseudopalabras (decodificación fonológica).", area: "Lectura" },
      { nombre: "Grafomotricidad", descripcion: "Control postural, calidad del trazado y soltura de la caligrafía.", area: "Escritura" },
      { nombre: "Ortografía Fonética", descripcion: "Conversión fonema-grafema mediante dictado de palabras sencillas y pseudopalabras.", area: "Escritura" },
      { nombre: "Cálculo y Numeración", descripcion: "Adquisición del concepto de número, valor posicional y operaciones básicas de suma y resta simples.", area: "Matemáticas" },
      { nombre: "Adaptación Socioafectiva", descripcion: "Explora autoconcepto, motivación escolar, relaciones de aula y el clima familiar básico.", area: "Socioafectiva" }
    ],
    baremos: "Baremos chilenos normativos para establecimientos educacionales chilenos, muy demandado en procesos PIE.",
    enfoque_pie: "Identifica dificultades tempranas en el aprendizaje instrumental (Dislexia, Disgrafía, Discalculia) para postulación a PIE."
  },
  {
    id: "evalua_2",
    nombre: "Batería Psicopedagógica Evalúa 2",
    destinatarios: "Final de 2º de Educación Básica y comienzo de 3º de Educación Básica",
    edad_rango: "7 a 8 años",
    tiempo: "Aprox. 2.5 horas",
    descripcion_general: "Enfocado en consolidación de la lectura de oraciones, habilidades de cálculo escrito con reserva y razonamiento inductivo/deductivo temprano.",
    autores: "Jesús García Vidal, Daniel González Manjón",
    areas_principales: ["Cognitiva", "Lectura", "Escritura", "Matemáticas", "Socioafectiva"],
    subtests: [
      { nombre: "Razonamiento Analógico", descripcion: "Detección de patrones conceptuales en estímulos figurativos.", area: "Cognitiva" },
      { nombre: "Pensamiento Espacial", descripcion: "Rotación mental, asimetría geométrica y organización viso-constructiva.", area: "Cognitiva" },
      { nombre: "Clasificación", descripcion: "Detección de categorías complejas o exclusión de elementos intrusos.", area: "Cognitiva" },
      { nombre: "Memoria y Atención", descripcion: "Búsqueda visual rápida e identificación de discrepancias bajo presión de tiempo.", area: "Cognitiva" },
      { nombre: "Comprensión Lectora", descripcion: "Entendimiento de textos breves de estructura narrativa y expositiva simple.", area: "Lectura" },
      { nombre: "Exactitud Lectora", descripcion: "Fluidez, ruta visual y fonológica del vocabulario escolar habitual.", area: "Lectura" },
      { nombre: "Grafomotricidad y Escritura", descripcion: "Calidad de copia manuscrita, postura y enlace caligráfico.", area: "Escritura" },
      { nombre: "Ortografía Fonética", descripcion: "Dictado de textos cortos evaluando la aplicación de reglas de transcripción acústica directa.", area: "Escritura" },
      { nombre: "Cálculo y Numeración", descripcion: "Estructura de la decena/centena, sumas y restas con reserva, tablas de multiplicar.", area: "Matemáticas" },
      { nombre: "Resolución de Problemas", descripcion: "Interpretación verbal de un enunciado matemático simple y selección de la operación correcta.", area: "Matemáticas" },
      { nombre: "Adaptación Socioafectiva", descripcion: "Autoestima escolar, integración grupal, actitud familiar y motivación intrínseca.", area: "Socioafectiva" }
    ],
    baremos: "Baremos adaptados a la realidad escolar chilena de educación básica.",
    enfoque_pie: "Útil en el monitoreo del Decreto 170 para pesquisar dificultades específicas de aprendizaje (DEA) a nivel de segundo año básico."
  },
  {
    id: "evalua_3",
    nombre: "Batería Psicopedagógica Evalúa 3",
    destinatarios: "Final de 3º de Educación Básica y comienzo de 4º de Educación Básica",
    edad_rango: "8 a 9 años",
    tiempo: "Aprox. 3 horas",
    descripcion_general: "Evalúa los procesos mentales de atención, reflexividad conceptual y la automatización consolidada de la ortografía y el cálculo.",
    autores: "Jesús García Vidal, Daniel González Manjón",
    areas_principales: ["Cognitiva", "Lectura", "Escritura", "Matemáticas", "Socioafectiva"],
    subtests: [
      { nombre: "Reflexividad Cognitiva", descripcion: "Capacidad para analizar minuciosamente estímulos visuales y tomar decisiones reflexivas en lugar de impulsivas.", area: "Cognitiva" },
      { nombre: "Pensamiento Analógico", descripcion: "Completar analogías complejas de carácter figurativo.", area: "Cognitiva" },
      { nombre: "Organización Perceptiva", descripcion: "Reconstrucción espacial bidimensional a partir de modelos.", area: "Cognitiva" },
      { nombre: "Memoria y Atención", descripcion: "Focalización selectiva, localización rápida de dianas visuales y memoria operativa visual.", area: "Cognitiva" },
      { nombre: "Comprensión Lectora", descripcion: "Procesamiento de oraciones, síntesis conceptual y vocabulario contextual.", area: "Lectura" },
      { nombre: "Exactitud Lectora", descripcion: "Integración léxica de palabras de alta/baja frecuencia escolar y lectura fluida.", area: "Lectura" },
      { nombre: "Ortografía Fonética", descripcion: "Dictado de sílabas complejas, pseudopalabras y vocabulario irregular.", area: "Escritura" },
      { nombre: "Grafía y Expresión Escrita", descripcion: "Redacción espontánea evaluando cohesión, coherencia y legibilidad.", area: "Escritura" },
      { nombre: "Cálculo y Numeración", descripcion: "Dominio de la multiplicación, inicio de la división y manejo numérico hasta el millar.", area: "Matemáticas" },
      { nombre: "Resolución de Problemas", descripcion: "Comprensión semántica de problemas de una y dos operaciones y ejecución algorítmica.", area: "Matemáticas" },
      { nombre: "Adaptación Socioafectiva", descripcion: "Autoestima, adaptación personal, relaciones interpersonales escolares y comportamiento conductual general.", area: "Socioafectiva" }
    ],
    baremos: "Normalizado con muestra nacional representativa de escolares chilenos.",
    enfoque_pie: "Indispensable para el diagnóstico de dificultades específicas en la automatización del cálculo y de la comprensión lectora básica."
  },
  {
    id: "evalua_4",
    nombre: "Batería Psicopedagógica Evalúa 4",
    destinatarios: "Final de 4º de Educación Básica y comienzo de 5º de Educación Básica",
    edad_rango: "9 a 10 años",
    tiempo: "Aprox. 3 horas",
    descripcion_general: "Batería clave que incorpora la evaluación específica de la velocidad lectora en palabras por minuto y procesos ortográficos visuales consolidados.",
    autores: "Jesús García Vidal, Daniel González Manjón, Beatriz García Ortiz",
    areas_principales: ["Cognitiva", "Lectura", "Escritura", "Matemáticas", "Socioafectiva"],
    subtests: [
      { nombre: "Reflexividad", descripcion: "Resolución sistemática de problemas lógicos visuales mediante auto-instrucciones implícitas.", area: "Cognitiva" },
      { nombre: "Pensamiento Analógico", descripcion: "Razonamiento lógico no-verbal por inducción de analogías de matrices.", area: "Cognitiva" },
      { nombre: "Organización Perceptiva", descripcion: "Capacidad de rotación tridimensional espacial de bloques.", area: "Cognitiva" },
      { nombre: "Atención y Memoria", descripcion: "Mantenimiento atencional sostenido y retención visoespacial inmediata.", area: "Cognitiva" },
      { nombre: "Comprensión Lectora", descripcion: "Comprensión global, inferencial, vocabulario lector y uso de conectores.", area: "Lectura" },
      { nombre: "Velocidad Lectora", descripcion: "Medición cuantitativa de palabras leídas en un minuto, asociada a la eficacia de comprensión de un texto informativo.", area: "Lectura" },
      { nombre: "Exactitud Lectora", descripcion: "Lectura veloz sin errores de sustitución, omisión o inversión fonémica.", area: "Lectura" },
      { nombre: "Ortografía Visual", descripcion: "Mapeo ortográfico de palabras homófonas y dictado enfocado en ortografía arbitraria reglada.", area: "Escritura" },
      { nombre: "Grafía y Expresión Escrita", descripcion: "Valoración de la caligrafía, organización sintáctica de ideas escritas y coherencia formal.", area: "Escritura" },
      { nombre: "Cálculo y Numeración", descripcion: "Operatoria básica, suma, resta, multiplicación y división con dividendos de varias cifras.", area: "Matemáticas" },
      { nombre: "Resolución de Problemas", descripcion: "Resolución reflexiva de problemas lógicos y aritméticos con distractores textuales.", area: "Matemáticas" },
      { nombre: "Niveles de Adaptación", descripcion: "Mide Adaptación Personal, Adaptación Familiar, Adaptación Escolar y Socialización.", area: "Socioafectiva" }
    ],
    baremos: "Baremos nacionales escolares chilenos. Herramienta estándar en colegios con convenio PIE.",
    enfoque_pie: "Soporte clave para informes psicopedagógicos de reevaluación anual de alumnos con DEA lectoescritora y matemática."
  },
  {
    id: "evalua_5",
    nombre: "Batería Psicopedagógica Evalúa 5",
    destinatarios: "Final de 5º de Educación Básica y comienzo de 6º de Educación Básica",
    edad_rango: "10 a 11 años",
    tiempo: "Aprox. 3 horas",
    descripcion_general: "Integra procesos cognitivos de organización perceptual con procesos sofisticados de lectura rápida de comprensión y ortografía visual y reglada.",
    autores: "Jesús García Vidal, Daniel González Manjón, Beatriz García Ortiz",
    areas_principales: ["Cognitiva", "Lectura", "Escritura", "Matemáticas", "Socioafectiva"],
    subtests: [
      { nombre: "Pensamiento Analógico", descripcion: "Habilidad para discernir relaciones abstractas en matrices complejas.", area: "Cognitiva" },
      { nombre: "Reflexividad", descripcion: "Procesamiento atencional enfocado en la solución de laberintos y secuencias de estímulos lógicos.", area: "Cognitiva" },
      { nombre: "Organización Perceptiva", descripcion: "Reconocimiento y armado visoespacial de siluetas proyectadas en plano bidimensional.", area: "Cognitiva" },
      { nombre: "Atención y Memoria", descripcion: "Discriminación atencional visual ante distractores densos.", area: "Cognitiva" },
      { nombre: "Comprensión Lectora", descripcion: "Lectura inferencial de textos narrativos, científicos y técnicos adecuados al nivel.", area: "Lectura" },
      { nombre: "Velocidad Lectora", descripcion: "Exactitud y velocidad combinadas mediante cálculo de eficacia lectora silenciosa.", area: "Lectura" },
      { nombre: "Eficacia Lectora", descripcion: "Mapeo ortográfico rápido e identificación de la palabra semánticamente correcta.", area: "Lectura" },
      { nombre: "Ortografía Visual y Reglada", descripcion: "Identificación de errores ortográficos típicos de la lengua castellana escolar.", area: "Escritura" },
      { nombre: "Grafía y Expresión", descripcion: "Copia caligráfica y escritura libre creativa evaluando riqueza de vocabulario y sintaxis.", area: "Escritura" },
      { nombre: "Cálculo y Numeración", descripcion: "Operaciones con fracciones, decimales, sumas y restas de grandes números.", area: "Matemáticas" },
      { nombre: "Resolución de Problemas", descripcion: "Planificación heurística en problemas lógicos y operatorios de dificultad progresiva.", area: "Matemáticas" },
      { nombre: "Adaptación Socioafectiva", descripcion: "Dimensiones: Autoestima, Adaptación Personal, Adaptación Social, Adaptación Escolar.", area: "Socioafectiva" }
    ],
    baremos: "Baremos adaptados a Chile en establecimientos municipales, subvencionados y particulares.",
    enfoque_pie: "Permite establecer la línea de base psicopedagógica para el diseño de adecuaciones curriculares individuales (PACI)."
  },
  {
    id: "evalua_6",
    nombre: "Batería Psicopedagógica Evalúa 6",
    destinatarios: "Final de 6º de Educación Básica y comienzo de 7º de Educación Básica",
    edad_rango: "11 a 12 años",
    tiempo: "Aprox. 3 horas",
    descripcion_general: "Incorpora el razonamiento inductivo formal y mide la eficacia de la comprensión inferencial, clave en la antesala de la educación media chilena.",
    autores: "Jesús García Vidal, Daniel González Manjón, Beatriz García Ortiz",
    areas_principales: ["Cognitiva", "Lectura", "Escritura", "Matemáticas", "Socioafectiva"],
    subtests: [
      { nombre: "Razonamiento Inductivo", descripcion: "Capacidad de extraer leyes generales a partir de secuencias numéricas, verbales y analógicas.", area: "Cognitiva" },
      { nombre: "Razonamiento Espacial", descripcion: "Localización tridimensional, plegamiento y manipulación espacial mental de cuerpos.", area: "Cognitiva" },
      { nombre: "Atención y Memoria", descripcion: "Velocidad de procesamiento visual atencional y memoria semántica operativa.", area: "Cognitiva" },
      { nombre: "Comprensión Lectora", descripcion: "Procesamiento inferencial complejo de textos continuos e discontinuos.", area: "Lectura" },
      { nombre: "Velocidad Lectora", descripcion: "Velocidad en lectura silenciosa con su posterior cuestionario de retención comprensiva inmediata.", area: "Lectura" },
      { nombre: "Eficacia Lectora", descripcion: "Habilidad para captar errores ortográficos y de correspondencia léxica de un vistazo rápido.", area: "Lectura" },
      { nombre: "Ortografía Visual y Reglada", descripcion: "Dominio de la acentuación, uso de grafemas dudosos (b-v, c-s-z) y ortografía arbitraria.", area: "Escritura" },
      { nombre: "Expresión Escrita", descripcion: "Composición escrita original argumentativa y descriptiva con criterios léxicos rigurosos.", area: "Escritura" },
      { nombre: "Cálculo y Numeración", descripcion: "Potencias, raíces básicas, números enteros, operaciones combinadas y fracciones complejas.", area: "Matemáticas" },
      { nombre: "Resolución de Problemas", descripcion: "Traducción de enunciados a sistemas aritméticos y razonamiento proporcional matemático.", area: "Matemáticas" },
      { nombre: "Adaptación Socioafectiva", descripcion: "Escalas de adaptación personal, académica, grupal y relaciones sistémicas familiares.", area: "Socioafectiva" }
    ],
    baremos: "Normalizado con baremos chilenos nacionales, ampliamente aplicado para procesos de ingreso a 7° básico.",
    enfoque_pie: "Indispensable para identificar brechas de aprendizaje al egresar del segundo ciclo básico, facilitando la articulación pedagógica."
  },
  {
    id: "evalua_7",
    nombre: "Batería Psicopedagógica Evalúa 7",
    destinatarios: "Final de 7º de Educación Básica y comienzo de 8º de Educación Básica",
    edad_rango: "12 a 13 años",
    tiempo: "Aprox. 3 horas",
    descripcion_general: "Enfocada en el razonamiento lógico-formal complejo y en la maduración de los procesos lectores comprensivos para el currículo avanzado.",
    autores: "Jesús García Vidal, Daniel González Manjón, Beatriz García Ortiz",
    areas_principales: ["Cognitiva", "Lectura", "Escritura", "Matemáticas", "Socioafectiva"],
    subtests: [
      { nombre: "Razonamiento Inductivo", descripcion: "Analogías verbales cruzadas, series de figuras lógicas complejas y leyes categoriales.", area: "Cognitiva" },
      { nombre: "Razonamiento Espacial", descripcion: "Capacidad de representación mental de formas geométricas rotadas tridimensionalmente.", area: "Cognitiva" },
      { nombre: "Atención y Memoria", descripcion: "Atención selectiva rápida con distractores geométricos y memoria verbal auditiva diferida.", area: "Cognitiva" },
      { nombre: "Comprensión Lectora", descripcion: "Habilidad crítica, identificación de ideas centrales, sutilezas semánticas y léxico académico.", area: "Lectura" },
      { nombre: "Eficacia Lectora", descripcion: "Velocidad de discriminación visual-semántica instantánea de palabras.", area: "Lectura" },
      { nombre: "Velocidad Lectora", descripcion: "Habilidad para leer textos informativos complejos manteniendo tasas de comprensión óptimas.", area: "Lectura" },
      { nombre: "Ortografía Visual y Reglada", descripcion: "Uso correcto del léxico ortográfico en español a nivel avanzado.", area: "Escritura" },
      { nombre: "Expresión Escrita", descripcion: "Redacción formal valorando la estructura gramatical, coherencia textual y riqueza verbal.", area: "Escritura" },
      { nombre: "Cálculo y Numeración", descripcion: "Estructuras numéricas complejas, porcentajes, operatoria algebraica inicial.", area: "Matemáticas" },
      { nombre: "Resolución de Problemas", descripcion: "Planteamiento heurístico sistemático de problemas de lógica matemática de la vida real.", area: "Matemáticas" },
      { nombre: "Adaptación Socioafectiva", descripcion: "Autoestima general, adaptabilidad escolar, relaciones familiares y dimensiones de socialización entre adolescentes.", area: "Socioafectiva" }
    ],
    baremos: "Baremos chilenos actualizados, ideal para reevaluaciones en 7° y 8° básico.",
    enfoque_pie: "Sustenta informes psicopedagógicos de reevaluación para adolescentes que enfrentan mayores exigencias lectoras y lógicas."
  },
  {
    id: "evalua_8",
    nombre: "Batería Psicopedagógica Evalúa 8",
    destinatarios: "Final de 8º de Educación Básica y comienzo de 1º de Educación Media",
    edad_rango: "13 a 14 años",
    tiempo: "Aprox. 3 horas",
    descripcion_general: "Mide competencias lógicas de transición crucial para el egreso de la educación básica hacia la enseñanza media científica o humanista.",
    autores: "Jesús García Vidal, Daniel González Manjón, Beatriz García Ortiz",
    areas_principales: ["Cognitiva", "Lectura", "Escritura", "Matemáticas", "Socioafectiva"],
    subtests: [
      { nombre: "Razonamiento Inductivo", descripcion: "Detección de relaciones jerárquicas lógicas y categorizaciones avanzadas.", area: "Cognitiva" },
      { nombre: "Razonamiento Espacial", descripcion: "Proyecciones ortogonales y rotaciones visuales tridimensionales de nivel avanzado.", area: "Cognitiva" },
      { nombre: "Atención y Memoria", descripcion: "Mantenimiento de atención sostenida ante tareas monótonas de discriminación de símbolos.", area: "Cognitiva" },
      { nombre: "Comprensión Lectora", descripcion: "Síntesis informativa, lectura crítica de artículos, vocabulario abstracto y comprensión de mapas conceptuales.", area: "Lectura" },
      { nombre: "Velocidad Lectora", descripcion: "Exactitud y tasa de transferencia lectora en textos argumentativos complejos.", area: "Lectura" },
      { nombre: "Eficacia Lectora", descripcion: "Lectura rápida y eficiente evaluada mediante detección instantánea de errores textuales.", area: "Lectura" },
      { nombre: "Ortografía Visual y Reglada", descripcion: "Uso de reglas de ortografía complejas y descarte de vicios del lenguaje escrito.", area: "Escritura" },
      { nombre: "Expresión Escrita", descripcion: "Elaboración de textos explicativos ordenados con riqueza conceptual y gramática depurada.", area: "Escritura" },
      { nombre: "Cálculo y Numeración", descripcion: "Razones, proporciones, ecuaciones lineales elementales, operaciones complejas en la recta real.", area: "Matemáticas" },
      { nombre: "Resolución de Problemas", descripcion: "Resolución sistemática de problemas verbales utilizando variables simbólicas.", area: "Matemáticas" },
      { nombre: "Adaptación Socioafectiva", descripcion: "Adaptación personal, autoconcepto físico e intelectual, actitud académica, adaptación familiar y social.", area: "Socioafectiva" }
    ],
    baremos: "Baremos nacionales representativos para educación de adultos u octavo año básico chileno.",
    enfoque_pie: "Soporte para informes psicopedagógicos de articulación básica-media y recomendación de estrategias curriculares."
  },
  {
    id: "evalua_9",
    nombre: "Batería Psicopedagógica Evalúa 9",
    destinatarios: "1º y 2º de Educación Media (Enseñanza Media Chilena)",
    edad_rango: "14 a 16 años",
    tiempo: "Aprox. 3 horas",
    descripcion_general: "Evalúa los procesos adaptativos, competencias de razonamiento abstracto y resolución de problemas algebraicos de nivel de secundaria chilena.",
    autores: "Jesús García Vidal, Daniel González Manjón, Beatriz García Ortiz",
    areas_principales: ["Cognitiva", "Lectura", "Escritura", "Matemáticas", "Socioafectiva"],
    subtests: [
      { nombre: "Razonamiento Inductivo", descripcion: "Establecer generalizaciones lógicas a partir de premisas complejas no estructuradas.", area: "Cognitiva" },
      { nombre: "Razonamiento Espacial", descripcion: "Rotación espacial compleja de cuerpos volumétricos combinados.", area: "Cognitiva" },
      { nombre: "Atención y Memoria", descripcion: "Mapeo atencional visual y memoria de trabajo verbal-secuencial compleja.", area: "Cognitiva" },
      { nombre: "Comprensión Lectora", descripcion: "Interpretación crítica de textos de alta complejidad, vocabulario culto e inferencias textuales profundas.", area: "Lectura" },
      { nombre: "Velocidad Lectora", descripcion: "Eficacia de velocidad lectora silenciosa con tareas complejas de discriminación lógica.", area: "Lectura" },
      { nombre: "Eficacia Lectora", descripcion: "Identificación de incongruencias textuales rápidas de vocabulario y sintaxis.", area: "Lectura" },
      { nombre: "Ortografía Visual y Reglada", descripcion: "Dictado y reconocimiento ortográfico formal adaptado al nivel curricular medio.", area: "Escritura" },
      { nombre: "Expresión Escrita", descripcion: "Producción textual formal que evalúa coherencia lógica, cohesión gramatical y vocabulario técnico.", area: "Escritura" },
      { nombre: "Cálculo y Numeración", descripcion: "Ecuaciones simultáneas, potencias, polinomios, fracciones algebraicas y operatoria mixta.", area: "Matemáticas" },
      { nombre: "Resolución de Problemas", descripcion: "Resolución heurística de problemas abstractos y geométricos complejos.", area: "Matemáticas" },
      { nombre: "Adaptación Socioafectiva", descripcion: "Evalúa: Autoconcepto (Académico, Social, Emocional, Físico), Adaptación Familiar, Adaptación Social.", area: "Socioafectiva" }
    ],
    baremos: "Baremos nacionales representativos de primer y segundo año medio en Chile.",
    enfoque_pie: "Utilizado ampliamente para postulación, diagnóstico y reevaluación anual de alumnos con dificultades específicas de aprendizaje en enseñanza media."
  },
  {
    id: "evalua_10",
    nombre: "Batería Psicopedagógica Evalúa 10",
    destinatarios: "3º y 4º de Educación Media (Egreso de Enseñanza Media Chilena)",
    edad_rango: "16 a 18 años",
    tiempo: "Aprox. 3.5 horas",
    descripcion_general: "La versión más avanzada diseñada para medir las competencias cognitivas, procesos de razonamiento formal inductivo/deductivo y la eficacia de la comprensión analítica ante el egreso a la educación superior.",
    autores: "Jesús García Vidal, Daniel González Manjón, Beatriz García Ortiz",
    areas_principales: ["Cognitiva", "Lectura", "Escritura", "Matemáticas", "Socioafectiva"],
    subtests: [
      { nombre: "Razonamiento Inductivo", descripcion: "Análisis conceptual deductivo e inductivo abstracto a partir de matrices y enunciados lógicos.", area: "Cognitiva" },
      { nombre: "Razonamiento Espacial", descripcion: "Mapeo geométrico, simetrías rotacionales tridimensionales complejas.", area: "Cognitiva" },
      { nombre: "Atención", descripcion: "Atención selectiva focalizada sostenida con tareas de alta interferencia visual (tipo Stroop).", area: "Cognitiva" },
      { nombre: "Comprensión Lectora", descripcion: "Lectura comprensiva analítica de carácter académico-científico, ensayos argumentativos, interpretación filológica y vocabulario avanzado.", area: "Lectura" },
      { nombre: "Velocidad y Eficacia Lectora", descripcion: "Capacidad de lectura veloz comprensiva silenciosa de textos extensos.", area: "Lectura" },
      { nombre: "Ortografía y Expresión Escrita", descripcion: "Estructuración escrita de ensayos argumentativos, uso riguroso de puntuación, conectores y ortografía formal.", area: "Escritura" },
      { nombre: "Cálculo y Numeración", descripcion: "Funciones matemáticas elementales, trigonometría básica, sistemas de ecuaciones complejas, progresiones.", area: "Matemáticas" },
      { nombre: "Resolución de Problemas", descripcion: "Modelamiento y planteamiento lógico-matemático heurístico para la solución de problemas complejos.", area: "Matemáticas" },
      { nombre: "Adaptación Socioafectiva", descripcion: "Mide Autoestima general, Adaptación Académica, Autocontrol, Adaptación Familiar, Habilidades Sociales.", area: "Socioafectiva" }
    ],
    baremos: "Baremos normativos chilenos para egreso de educación secundaria y postulación a educación superior.",
    enfoque_pie: "Soporte fundamental para la orientación psicopedagógica vocacional, egreso de programas de integración (PIE) y adaptaciones para la transición universitaria."
  }
];

export function getEvaluaAsInstrumento(item: EvaluaBatteryData): Instrumento {
  const mapAreaEvalua = (a: string) => {
    switch (a.toLowerCase()) {
      case 'cognitiva': return 'Procesamiento cognitivo';
      case 'lectura': return 'Procesos lectores';
      case 'escritura': return 'Escritura';
      case 'matemáticas': return 'Matemáticas y Cálculo';
      case 'psicomotora': return 'Desarrollo psicomotor';
      case 'socioafectiva': return 'Socioemocional y Conducta';
      default: return 'Procesamiento cognitivo';
    }
  };

  const primaryArea = item.areas_principales[0] || 'Cognitiva';

  return {
    id: item.id,
    nombre: item.nombre,
    autor: item.autores,
    anio: "2018 (Versión 4.0 / 4.1)",
    pais_origen: "España (Adaptada e impresa para Chile por Giunti EOS)",
    area: mapAreaEvalua(primaryArea),
    subarea: "Batería Psicopedagógica Integral",
    edad_aplicacion: item.edad_rango,
    curso_recomendado: item.destinatarios,
    tiempo_aproximado: item.tiempo,
    aplicacion_modalidad: "Individual / Colectiva",
    formato: "Ambos",
    estado: "vigente",
    adaptacion_chilena: "Sí",
    editorial: "Giunti Psychometrics Chile / Instituto de Orientación Psicológica EOS",
    que_evalua: item.descripcion_general,
    dificultades_asociadas: [
      "Dificultades de Aprendizaje (DEA)",
      "Lectoescritura",
      "Discalculia",
      "Procesos cognitivos escolares"
    ],
    contextos_recomendados: ["Educativo (Básica/Media)", "Clínico"],
    ficha_detallada_manual: `Batería Psicopedagógica Integral de referencia en Chile. Ampliamente utilizada para el diagnóstico de ingreso y reevaluación de los Programas de Integración Escolar (PIE) bajo el Decreto 170 y 83.\n\nEstructura de subtests:\n${item.subtests.map(s => `- ${s.nombre} (${s.area}): ${s.descripcion}`).join('\n')}\n\nNormas: ${item.baremos}\n\nEnfoque PIE: ${item.enfoque_pie}`
  };
}
