/**
 * Configuración oficial de símbolos, probabilidades y escala de premios
 * Basado en especificaciones1.md y diseño visual Hit Bar / Premios Granizados
 */

export const SIMBOLOS = [
  {
    id: 'SYM_LIMON',
    nombre: 'Limón',
    categoria: 'Fruta Base',
    icono: '🍋',
    subIcono: '🍃',
    color: '#FACC15',
    bgBadge: 'from-amber-400 to-yellow-500',
    peso: 28
  },
  {
    id: 'SYM_NARANJA',
    nombre: 'Naranja',
    categoria: 'Fruta Base',
    icono: '🍊',
    subIcono: '✨',
    color: '#FB923C',
    bgBadge: 'from-orange-500 to-amber-600',
    peso: 26
  },
  {
    id: 'SYM_COPA_AZUL',
    nombre: 'Granizado Azul',
    categoria: 'Bebida Estándar',
    icono: '🍧',
    subIcono: '🍒',
    color: '#38BDF8',
    bgBadge: 'from-sky-400 to-blue-600',
    peso: 20
  },
  {
    id: 'SYM_COPA_VERDE',
    nombre: 'Granizado Menta',
    categoria: 'Bebida Estándar',
    icono: '🍹',
    subIcono: '🍈',
    color: '#4ADE80',
    bgBadge: 'from-emerald-400 to-green-600',
    peso: 18
  },
  {
    id: 'SYM_SHOT',
    nombre: 'Shot Licor',
    categoria: 'Alcohol',
    icono: '🥃',
    subIcono: '🧊',
    color: '#F59E0B',
    bgBadge: 'from-amber-600 to-yellow-700',
    peso: 14
  },
  {
    id: 'SYM_COCTEL_ROJO',
    nombre: 'Frozen Berries',
    categoria: 'Especial',
    icono: '🍸',
    subIcono: '🍓',
    color: '#F43F5E',
    bgBadge: 'from-rose-500 to-pink-600',
    peso: 10
  },
  {
    id: 'SYM_VODKA',
    nombre: 'Vodka Frozen',
    categoria: 'Premium',
    icono: '🍷',
    subIcono: '🍇',
    color: '#A855F7',
    bgBadge: 'from-purple-500 to-indigo-700',
    peso: 8
  },
  {
    id: 'SYM_BONUS',
    nombre: 'Bonus Coctelera',
    categoria: 'Bonus Especial',
    icono: '🫗',
    subIcono: '💉',
    color: '#D946EF',
    bgBadge: 'from-fuchsia-500 to-pink-600',
    peso: 5
  },
  {
    id: 'SYM_GRATIS',
    nombre: 'Granizado Gratis',
    categoria: 'Jackpot',
    icono: '⭐',
    subIcono: '🍧',
    color: '#FBBF24',
    bgBadge: 'from-amber-300 via-yellow-400 to-amber-500',
    esEspecialGratis: true,
    peso: 2
  }
];

export const MAPA_SIMBOLOS = Object.fromEntries(SIMBOLOS.map(s => [s.id, s]));

/**
 * Escala de Premios para la torre "PREMIOS GRANIZADOS"
 * Fiel a la paleta, números y orden de la imagen de referencia.
 */
export const NIVELES_PREMIO = [
  {
    nivel: 13,
    id: 'JACKPOT',
    codigo: '13:',
    nombre: 'Nivel 13',
    condicion: '5+ Sellos Granizado Gratis ⭐',
    beneficio: 'Granizado gratis',
    tipoFeedback: 'jackpot',
    bgPill: 'bg-emerald-600 text-white border-emerald-400/80 shadow-[0_0_12px_rgba(34,197,94,0.6)]',
    numColor: 'text-emerald-200'
  },
  {
    nivel: 12,
    id: 'NIVEL_12',
    codigo: '12:',
    nombre: 'Nivel 12',
    condicion: '5 Cócteles Especiales (Berries / Vodka)',
    beneficio: '2 Granizados dobles x23k',
    tipoFeedback: 'win_big',
    bgPill: 'bg-purple-700 text-white border-purple-400/80 shadow-[0_0_12px_rgba(168,85,247,0.5)]',
    numColor: 'text-purple-200'
  },
  {
    nivel: 11,
    id: 'NIVEL_11',
    codigo: '11:',
    nombre: 'Nivel 11',
    condicion: '4 Cócteles Especiales (Berries / Vodka)',
    beneficio: 'Granizado doble x13k',
    tipoFeedback: 'win_big',
    bgPill: 'bg-sky-600 text-white border-sky-400/80 shadow-[0_0_12px_rgba(14,165,233,0.5)]',
    numColor: 'text-sky-200'
  },
  {
    nivel: 10,
    id: 'NIVEL_10',
    codigo: '10:',
    nombre: 'Nivel 10',
    condicion: '5 Granizados (Azul / Verde)',
    beneficio: '-1000',
    tipoFeedback: 'win_medium',
    bgPill: 'bg-yellow-500 text-slate-950 font-black border-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.5)]',
    numColor: 'text-slate-950 font-black'
  },
  {
    nivel: 9,
    id: 'NIVEL_9',
    codigo: '9:',
    nombre: 'Nivel 9',
    condicion: '5 Frutas (Limón / Naranja)',
    beneficio: '-900',
    tipoFeedback: 'win_medium',
    bgPill: 'bg-orange-600 text-white border-orange-400/80 shadow-[0_0_10px_rgba(249,115,22,0.5)]',
    numColor: 'text-orange-200'
  },
  {
    nivel: 8,
    id: 'NIVEL_8',
    codigo: '8:',
    nombre: 'Nivel 8',
    condicion: '4 Granizados Estándar',
    beneficio: '-600',
    tipoFeedback: 'win_medium',
    bgPill: 'bg-amber-800 text-amber-100 border-amber-600/80',
    numColor: 'text-amber-300'
  },
  {
    nivel: 7.5,
    id: 'BONUS_ALCOHOL',
    codigo: 'Bonus',
    nombre: 'Bonus Alcohol',
    condicion: '3+ Símbolos Bonus Coctelera 🫗',
    beneficio: 'Jeringa de alcohol',
    tipoFeedback: 'win_bonus',
    bgPill: 'bg-fuchsia-700 text-white border-fuchsia-400/90 shadow-[0_0_12px_rgba(217,70,239,0.6)] animate-pulse',
    numColor: 'text-fuchsia-200 font-bold'
  },
  {
    nivel: 7,
    id: 'NIVEL_7',
    codigo: '7:',
    nombre: 'Nivel 7',
    condicion: '4 Frutas (Limón / Naranja)',
    beneficio: '-800',
    tipoFeedback: 'win_discount',
    bgPill: 'bg-red-700 text-white border-red-400/80',
    numColor: 'text-red-200'
  },
  {
    nivel: 5,
    id: 'NIVEL_5',
    codigo: '5:',
    nombre: 'Nivel 5',
    condicion: '3 Granizados Estándar',
    beneficio: '-600',
    tipoFeedback: 'win_discount',
    bgPill: 'bg-yellow-700 text-amber-100 border-yellow-500/80',
    numColor: 'text-yellow-200'
  },
  {
    nivel: 4.5,
    id: 'BONUS_2X3',
    codigo: '2x3',
    nombre: 'Promo 2x3',
    condicion: '3 Shots de Licor 🥃',
    beneficio: 'Pague 2 Lleve 3',
    tipoFeedback: 'win_bonus',
    bgPill: 'bg-amber-600 text-white border-amber-400',
    numColor: 'text-amber-100'
  },
  {
    nivel: 4,
    id: 'NIVEL_4',
    codigo: '4:',
    nombre: 'Nivel 4',
    condicion: '3 Limones 🍋',
    beneficio: '-500',
    tipoFeedback: 'win_discount',
    bgPill: 'bg-yellow-600 text-slate-950 border-yellow-400',
    numColor: 'text-yellow-100'
  },
  {
    nivel: 3,
    id: 'NIVEL_3',
    codigo: '3:',
    nombre: 'Nivel 3',
    condicion: '3 Naranjas 🍊',
    beneficio: '-400',
    tipoFeedback: 'win_discount',
    bgPill: 'bg-orange-700 text-white border-orange-500',
    numColor: 'text-orange-200'
  },
  {
    nivel: 2,
    id: 'NIVEL_2',
    codigo: '2:',
    nombre: 'Nivel 2',
    condicion: 'Pareja alta (2 especiales)',
    beneficio: '-300',
    tipoFeedback: 'win_discount',
    bgPill: 'bg-pink-700 text-white border-pink-400',
    numColor: 'text-pink-200'
  },
  {
    nivel: 1,
    id: 'NIVEL_1',
    codigo: '1:',
    nombre: 'Nivel 1',
    condicion: 'Pareja básica (2 frutas)',
    beneficio: '-150',
    tipoFeedback: 'win_discount',
    bgPill: 'bg-lime-700 text-lime-100 border-lime-500',
    numColor: 'text-lime-200'
  },
  {
    nivel: 0,
    id: 'MOJARRO',
    codigo: '0:',
    nombre: 'Mojarro',
    condicion: 'Sin combinaciones',
    beneficio: 'Sin premio (Mojarro)',
    tipoFeedback: 'blanqueo',
    bgPill: 'bg-slate-800 text-slate-400 border-slate-700',
    numColor: 'text-slate-400'
  }
];

export const ESTADOS_JUEGO = {
  IDLE: 'IDLE',
  SPINNING: 'SPINNING',
  STOPPING: 'STOPPING',
  RESOLVED: 'RESOLVED',
  LOCKED: 'LOCKED'
};
