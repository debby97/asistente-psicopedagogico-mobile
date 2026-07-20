import { Instrumento } from '../types';

export const AREAS_EVALUAR = [
  'Procesamiento cognitivo',
  'Procesos lectores',
  'Escritura',
  'Matemáticas y Cálculo',
  'Atención',
  'Memoria',
  'Funciones ejecutivas',
  'Lenguaje',
  'Desarrollo psicomotor',
  'Socioemocional y Conducta',
  'Creatividad',
  'Orientación vocacional',
  'Psicogerontología'
];

export function mapInstrumentoToArea(ins: Partial<Instrumento> & { nombre: string, area?: string, que_evalua?: string }): string {
  const nombre = (ins.nombre || '').toLowerCase();
  const antiguaArea = (ins.area || '').toLowerCase();
  const queEvalua = (ins.que_evalua || '').toLowerCase();

  // 1. Psicogerontología
  if (
    nombre.includes('camdex') ||
    nombre.includes('moca') ||
    nombre.includes('mini mental') ||
    nombre.includes('mmse') ||
    nombre.includes('senil') ||
    nombre.includes('vejez') ||
    nombre.includes('ancianos') ||
    nombre.includes('cummings') ||
    nombre.includes('isaacs') ||
    nombre.includes('clifton') ||
    antiguaArea.includes('geronto') ||
    queEvalua.includes('demencia') ||
    queEvalua.includes('deterioro cognitivo') ||
    queEvalua.includes('adultos mayores')
  ) {
    return 'Psicogerontología';
  }

  // 2. Orientación Vocacional
  if (
    nombre.includes('vocacional') ||
    nombre.includes('profesional') ||
    nombre.includes('intereses') ||
    nombre.includes('laboral') ||
    nombre.includes('chide') ||
    nombre.includes('competetea') ||
    nombre.includes('líder') ||
    nombre.includes('kostig') ||
    antiguaArea.includes('vocacional') ||
    antiguaArea.includes('laboral') ||
    queEvalua.includes('vocacional') ||
    queEvalua.includes('competencias laborales')
  ) {
    return 'Orientación vocacional';
  }

  // 3. Creatividad
  if (
    nombre.includes('creatividad') ||
    nombre.includes('crea') ||
    nombre.includes('imaginación') ||
    nombre.includes('pic') ||
    nombre.includes('cap') ||
    queEvalua.includes('imaginación creativa') ||
    queEvalua.includes('creatividad')
  ) {
    return 'Creatividad';
  }

  // 4. Atención
  if (
    nombre.includes('d2') ||
    nombre.includes('atención') ||
    nombre.includes('atencion') ||
    nombre.includes('concentración') ||
    nombre.includes('stroop') ||
    nombre.includes('casat') ||
    queEvalua.includes('atención sostenida') ||
    queEvalua.includes('atención selectiva') ||
    queEvalua.includes('concentración')
  ) {
    return 'Atención';
  }

  // 5. Memoria
  if (
    nombre.includes('memoria') ||
    nombre.includes('retención visual') ||
    nombre.includes('tomal') ||
    nombre.includes('tavec') ||
    nombre.includes('benton') ||
    nombre.includes('tomm') ||
    queEvalua.includes('memoria visual') ||
    queEvalua.includes('aprendizaje verbal') ||
    queEvalua.includes('retención visoespacial')
  ) {
    return 'Memoria';
  }

  // 6. Funciones Ejecutivas
  if (
    nombre.includes('ejecutiva') ||
    nombre.includes('ejecutivas') ||
    nombre.includes('planificación') ||
    nombre.includes('brief') ||
    nombre.includes('enfen') ||
    nombre.includes('wisconsin') ||
    nombre.includes('wcst') ||
    nombre.includes('senderos') ||
    nombre.includes('tesen') ||
    queEvalua.includes('funciones ejecutivas') ||
    queEvalua.includes('flexibilidad cognitiva') ||
    queEvalua.includes('control inhibitorio')
  ) {
    return 'Funciones ejecutivas';
  }

  // 7. Procesos Lectores
  if (
    nombre.includes('prolec') ||
    nombre.includes('lectura') ||
    nombre.includes('lector') ||
    nombre.includes('comprensión lectora') ||
    nombre.includes('behnale') ||
    nombre.includes('tevi') ||
    nombre.includes('clp') ||
    nombre.includes('dislexia') ||
    nombre.includes('dst-j') ||
    nombre.includes('lee') ||
    nombre.includes('becole') ||
    queEvalua.includes('lectura') ||
    queEvalua.includes('dislexia') ||
    queEvalua.includes('lectoescritura') ||
    queEvalua.includes('comprensión de lectura')
  ) {
    return 'Procesos lectores';
  }

  // 8. Escritura
  if (
    nombre.includes('escritura') ||
    nombre.includes('escribir') ||
    nombre.includes('ortografía') ||
    nombre.includes('disgrafía') ||
    nombre.includes('copia') ||
    nombre.includes('dictado') ||
    nombre.includes('grafía') ||
    queEvalua.includes('escritura') ||
    queEvalua.includes('disgrafía') ||
    queEvalua.includes('ortográfica')
  ) {
    return 'Escritura';
  }

  // 9. Matemáticas y Cálculo
  if (
    nombre.includes('cálculo') ||
    nombre.includes('calculo') ||
    nombre.includes('matemática') ||
    nombre.includes('matematica') ||
    nombre.includes('aritmética') ||
    nombre.includes('discalculia') ||
    nombre.includes('números') ||
    nombre.includes('evamat') ||
    queEvalua.includes('cálculo') ||
    queEvalua.includes('matemáticas') ||
    queEvalua.includes('operatoria')
  ) {
    return 'Matemáticas y Cálculo';
  }

  // 10. Desarrollo Psicomotor
  if (
    nombre.includes('psicomotor') ||
    nombre.includes('motricidad') ||
    nombre.includes('tepsi') ||
    nombre.includes('coordinación') ||
    nombre.includes('vmi') ||
    nombre.includes('bender') ||
    nombre.includes('lateralidad') ||
    nombre.includes('visomotora') ||
    antiguaArea.includes('psicomot') ||
    queEvalua.includes('viso-motriz') ||
    queEvalua.includes('psicomotricidad') ||
    queEvalua.includes('coordinación motora')
  ) {
    return 'Desarrollo psicomotor';
  }

  // 11. Socioemocional y Conducta
  if (
    nombre.includes('socioemocional') ||
    nombre.includes('conducta') ||
    nombre.includes('afectivo') ||
    nombre.includes('personalidad') ||
    nombre.includes('depresión') ||
    nombre.includes('ansiedad') ||
    nombre.includes('emocional') ||
    nombre.includes('autoestima') ||
    nombre.includes('basc') ||
    nombre.includes('social') ||
    nombre.includes('parental') ||
    nombre.includes('instituciones penitenciarias') ||
    nombre.includes('gds-yesavage') ||
    nombre.includes('hamilton') ||
    nombre.includes('riesgos psicosociales') ||
    nombre.includes('estres postraumatico') ||
    nombre.includes('egep') ||
    queEvalua.includes('personalidad') ||
    queEvalua.includes('autoestima') ||
    queEvalua.includes('ansiedad') ||
    queEvalua.includes('emocional') ||
    queEvalua.includes('depresiva')
  ) {
    return 'Socioemocional y Conducta';
  }

  // 12. Lenguaje
  if (
    nombre.includes('lenguaje') ||
    nombre.includes('habla') ||
    nombre.includes('comunicación') ||
    nombre.includes('vocabulario') ||
    nombre.includes('oral') ||
    nombre.includes('itpa') ||
    nombre.includes('bloc') ||
    nombre.includes('ecol') ||
    nombre.includes('sgel') ||
    queEvalua.includes('lenguaje') ||
    queEvalua.includes('vocabulario') ||
    queEvalua.includes('comunicación')
  ) {
    return 'Lenguaje';
  }

  // 13. Procesamiento cognitivo
  if (
    nombre.includes('inteligencia') ||
    nombre.includes('cognitivo') ||
    nombre.includes('factor g') ||
    nombre.includes('wais') ||
    nombre.includes('wisc') ||
    nombre.includes('wppsi') ||
    nombre.includes('matrices') ||
    nombre.includes('raven') ||
    nombre.includes('k-bit') ||
    nombre.includes('reynolds') ||
    nombre.includes('rias') ||
    nombre.includes('rist') ||
    nombre.includes('terman') ||
    nombre.includes('conceptos básicos') ||
    nombre.includes('concor') ||
    nombre.includes('efai') ||
    nombre.includes('catell') ||
    nombre.includes('beta') ||
    nombre.includes('kaufman') ||
    nombre.includes('carolina') ||
    nombre.includes('goodenough') ||
    nombre.includes('novis') ||
    nombre.includes('gilles pierre') ||
    nombre.includes('evalua') ||
    nombre.includes('concebas') ||
    nombre.includes('dat') ||
    nombre.includes('domino') ||
    nombre.includes('otis') ||
    nombre.includes('pma') ||
    nombre.includes('shipley') ||
    nombre.includes('stanford') ||
    nombre.includes('tig') ||
    nombre.includes('tip') ||
    nombre.includes('tisd') ||
    nombre.includes('toni') ||
    antiguaArea.includes('cognit') ||
    queEvalua.includes('inteligencia') ||
    queEvalua.includes('capacidad intelectual') ||
    queEvalua.includes('razonamiento') ||
    queEvalua.includes('madurez cognitiva')
  ) {
    return 'Procesamiento cognitivo';
  }

  // Default fallback por coincidencia de área antigua
  if (antiguaArea.includes('lectura') || antiguaArea.includes('comprensión')) return 'Procesos lectores';
  if (antiguaArea.includes('escritura') || antiguaArea.includes('grafía')) return 'Escritura';
  if (antiguaArea.includes('matemática') || antiguaArea.includes('cálculo')) return 'Matemáticas y Cálculo';
  if (antiguaArea.includes('atención') || antiguaArea.includes('atencion')) return 'Atención';
  if (antiguaArea.includes('memoria')) return 'Memoria';
  if (antiguaArea.includes('ejecutivas')) return 'Funciones ejecutivas';
  if (antiguaArea.includes('psicomot') || antiguaArea.includes('desarrollo infantil')) return 'Desarrollo psicomotor';
  if (antiguaArea.includes('socioemocional') || antiguaArea.includes('conducta') || antiguaArea.includes('afectivo')) return 'Socioemocional y Conducta';
  if (antiguaArea.includes('lenguaje')) return 'Lenguaje';
  if (antiguaArea.includes('cognit') || antiguaArea.includes('inteligencia')) return 'Procesamiento cognitivo';

  return 'Procesamiento cognitivo'; // Fallback final
}
