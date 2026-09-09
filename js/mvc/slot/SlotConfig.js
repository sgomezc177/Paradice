/**
 * SlotConfig.js - Paradice Juegos (MVC - Tragamonedas)
 * Catálogo de símbolos, ponderación RNG y tabla de pagos oficial.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.SlotConfig = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  const SIMBOLOS = [
    { id: 'SYM_LIMON', nombre: 'Limón', categoria: 'Fruta Base', icono: '🍋', subIcono: '🍃', color: '#FACC15', bgBadge: 'from-amber-400 to-yellow-500', peso: 28 },
    { id: 'SYM_NARANJA', nombre: 'Naranja', categoria: 'Fruta Base', icono: '🍊', subIcono: '✨', color: '#FB923C', bgBadge: 'from-orange-500 to-amber-600', peso: 26 },
    { id: 'SYM_COPA_AZUL', nombre: 'Granizado Azul', categoria: 'Bebida Estándar', icono: '🍧', subIcono: '🍒', color: '#38BDF8', bgBadge: 'from-sky-400 to-blue-600', peso: 20 },
    { id: 'SYM_COPA_VERDE', nombre: 'Granizado Menta', categoria: 'Bebida Estándar', icono: '🍹', subIcono: '🍈', color: '#4ADE80', bgBadge: 'from-emerald-400 to-green-600', peso: 18 },
    { id: 'SYM_SHOT', nombre: 'Shot Prémium', categoria: 'Shot', icono: '🥃', subIcono: '🧊', color: '#F59E0B', bgBadge: 'from-amber-600 to-yellow-700', peso: 14 },
    { id: 'SYM_COCTEL_ROJO', nombre: 'Frozen Berries', categoria: 'Especial', icono: '🍸', subIcono: '🍓', color: '#F43F5E', bgBadge: 'from-rose-500 to-pink-600', peso: 10 },
    { id: 'SYM_VODKA', nombre: 'Frozen Púrpura', categoria: 'Premium', icono: '🍷', subIcono: '🍇', color: '#A855F7', bgBadge: 'from-purple-500 to-indigo-700', peso: 8 },
    { id: 'SYM_CORAZON', nombre: 'Vida Extra', categoria: 'Bonus Especial', icono: '💖', subIcono: '❤️', color: '#F43F5E', bgBadge: 'from-pink-500 to-rose-600', peso: 7 },
    { id: 'SYM_BONUS', nombre: 'Bonus Coctelera', categoria: 'Bonus Especial', icono: '🫗', subIcono: '💉', color: '#D946EF', bgBadge: 'from-fuchsia-500 to-pink-600', peso: 5 },
    { id: 'SYM_GRATIS', nombre: 'Granizado Gratis', categoria: 'Jackpot', icono: '⭐', subIcono: '🍧', color: '#FBBF24', bgBadge: 'from-amber-300 via-yellow-400 to-amber-500', esEspecialGratis: true, peso: 2 }
  ];

  const MAPA_SIMBOLOS = Object.fromEntries(SIMBOLOS.map(s => [s.id, s]));

  /**
   * Tabla Oficial de 10 Niveles de Promociones (Sumatoria Drop Rates = 100.0%)
   * Ordenada de Mayor Rareza (Jackpot, ladderIndex 9) a Menor (Consolación, ladderIndex 0).
   */
  const NIVELES_PREMIO = [
    {
      id: 'PROMO_2X1_16OZ',
      ladderIndex: 9,
      tier: 'Jackpot',
      tierNombre: '⭐ JACKPOT',
      dropRate: 1.0,
      etiqueta: '¡SUPER PROMO 2x1! (Solo Vaso 16 oz)',
      beneficio: '¡Super Promo 2x1! (Solo Vaso 16 oz)',
      nombre: 'Super Promo 2x1 (16 oz)',
      condicion: '5 Sellos Paradice ⭐',
      restriccion: 'Aplica únicamente para presentación de 16 oz. Bloqueado para vasos de 9 oz.',
      sku: '16oz',
      tipoFeedback: 'jackpot',
      bgPill: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white font-black border border-emerald-300 shadow-[0_0_15px_rgba(34,197,94,0.7)]',
      numColor: 'text-emerald-200'
    },
    {
      id: 'PROMO_2X16_22K',
      ladderIndex: 8,
      tier: 'Épico',
      tierNombre: '🔥 ÉPICO',
      dropRate: 4.0,
      etiqueta: '2 Vasos de 16 oz x $22.000',
      beneficio: '2 Vasos de 16 oz x $22.000',
      nombre: 'Combo 2 Vasos de 16 oz',
      condicion: '5 Cócteles Especiales 🍸',
      restriccion: 'Precio fijo final de $22.000 en 2 vasos de 16 oz. No acumulable con otros descuentos.',
      sku: '16oz',
      tipoFeedback: 'win_big',
      bgPill: 'bg-gradient-to-r from-purple-700 to-fuchsia-700 text-white font-bold border border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.6)]',
      numColor: 'text-purple-200'
    },
    {
      id: 'PROMO_1X16_11K',
      ladderIndex: 7,
      tier: 'Épico',
      tierNombre: '🔥 ÉPICO',
      dropRate: 5.0,
      etiqueta: 'Granizado de 16 oz a $11.000',
      beneficio: 'Granizado de 16 oz a $11.000',
      nombre: 'Granizado 16 oz Especial',
      condicion: '4 Cócteles Especiales 🍸',
      restriccion: 'Precio especial de $11.000 aplicable únicamente en vaso de 16 oz.',
      sku: '16oz',
      tipoFeedback: 'win_big',
      bgPill: 'bg-gradient-to-r from-sky-600 to-blue-600 text-white font-bold border border-sky-300 shadow-[0_0_12px_rgba(14,165,233,0.5)]',
      numColor: 'text-sky-200'
    },
    {
      id: 'PROMO_COMBO_16_9',
      ladderIndex: 6,
      tier: 'Raro',
      tierNombre: '💎 RARO',
      dropRate: 10.0,
      etiqueta: 'Combo Amigos: 16 oz + 9 oz x $19.000',
      beneficio: 'Combo Amigos: 16 oz + 9 oz x $19.000',
      nombre: 'Combo Amigos (16 oz + 9 oz)',
      condicion: '5 Granizados Estándar 🍧',
      restriccion: 'Precio fijo combo de 1 vaso 16 oz + 1 vaso 9 oz por $19.000. No acumulable.',
      sku: 'combo_16_9',
      tipoFeedback: 'win_medium',
      bgPill: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-950 font-black border border-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.5)]',
      numColor: 'text-slate-950 font-black'
    },
    {
      id: 'PROMO_JERINGA_FREE',
      ladderIndex: 5,
      tier: 'Raro',
      tierNombre: '💎 RARO',
      dropRate: 10.0,
      etiqueta: 'Jeringa Shot GRATIS con tu 16 oz',
      beneficio: 'Jeringa Shot GRATIS con tu 16 oz',
      nombre: 'Jeringa Shot Gratis (con 16 oz)',
      condicion: '3+ Shakers / Jeringas 🫗',
      restriccion: 'Descuento del 100% en el aditivo (jeringa) con compra de al menos un (1) vaso de 16 oz a precio regular ($15.000).',
      sku: '16oz_jeringa',
      tipoFeedback: 'win_bonus',
      bgPill: 'bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white font-black border border-fuchsia-300 shadow-[0_0_12px_rgba(217,70,239,0.6)] animate-pulse',
      numColor: 'text-fuchsia-200 font-bold'
    },
    {
      id: 'PROMO_1X16_13K',
      ladderIndex: 4,
      tier: 'Poco Común',
      tierNombre: '✨ POCO COMÚN',
      dropRate: 15.0,
      etiqueta: 'Granizado doble (16 oz) por $13.000',
      beneficio: 'Granizado doble (16 oz) por $13.000',
      nombre: 'Granizado Doble 16 oz',
      condicion: '4 Granizados Estándar 🍧',
      restriccion: 'Precio especial de $13.000 exclusivo para presentación de 16 oz.',
      sku: '16oz',
      tipoFeedback: 'win_medium',
      bgPill: 'bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-bold border border-blue-400',
      numColor: 'text-blue-200'
    },
    {
      id: 'PROMO_2X9_14K',
      ladderIndex: 3,
      tier: 'Poco Común',
      tierNombre: '✨ POCO COMÚN',
      dropRate: 15.0,
      etiqueta: 'Combo 2 de 9 oz x $14.000',
      beneficio: 'Combo 2 de 9 oz x $14.000',
      nombre: 'Combo 2 de 9 oz',
      condicion: '5 Frutas Cítricas 🍊',
      restriccion: 'Precio fijo combo de 2 vasos de 9 oz por $14.000. No acumulable.',
      sku: '9oz',
      tipoFeedback: 'win_discount',
      bgPill: 'bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold border border-orange-400',
      numColor: 'text-orange-200'
    },
    {
      id: 'DESC_1500_16OZ',
      ladderIndex: 2,
      tier: 'Común',
      tierNombre: '🎉 COMÚN',
      dropRate: 15.0,
      etiqueta: '-$1.500 de descuento en vaso de 16 oz',
      beneficio: '-$1.500 de descuento en vaso de 16 oz',
      nombre: 'Descuento -$1.500 (16 oz)',
      condicion: '4 Frutas Cítricas 🍋',
      restriccion: 'Descuento directo de -$1.500 COP exclusivo para presentación de 16 oz.',
      sku: '16oz',
      tipoFeedback: 'win_discount',
      bgPill: 'bg-gradient-to-r from-teal-700 to-emerald-700 text-emerald-100 font-bold border border-teal-400',
      numColor: 'text-teal-200'
    },
    {
      id: 'DESC_1000_9OZ',
      ladderIndex: 1,
      tier: 'Común',
      tierNombre: '🎉 COMÚN',
      dropRate: 15.0,
      etiqueta: '-$1.000 de descuento en vaso de 9 oz',
      beneficio: '-$1.000 de descuento en vaso de 9 oz',
      nombre: 'Descuento -$1.000 (9 oz)',
      condicion: '3 Granizados Estándar 🍧',
      restriccion: 'Descuento directo de -$1.000 COP exclusivo para presentación de 9 oz.',
      sku: '9oz',
      tipoFeedback: 'win_discount',
      bgPill: 'bg-gradient-to-r from-amber-700 to-yellow-800 text-amber-100 font-bold border border-yellow-500',
      numColor: 'text-yellow-200'
    },
    {
      id: 'DESC_500_ANY',
      ladderIndex: 0,
      tier: 'Consolación',
      tierNombre: '🥤 CONSOLACIÓN',
      dropRate: 10.0,
      etiqueta: '-$500 en cualquier compra',
      beneficio: '-$500 en cualquier compra',
      nombre: 'Descuento -$500 Global',
      condicion: '3 Frutas o Pareja Cítrica 🍋',
      restriccion: 'Descuento global de -$500 COP restado del total de cualquier compra sin importar tamaño.',
      sku: 'any',
      tipoFeedback: 'win_discount',
      bgPill: 'bg-gradient-to-r from-slate-700 to-slate-800 text-slate-200 font-bold border border-slate-600',
      numColor: 'text-slate-300'
    }
  ];

  const ESTADOS_JUEGO = {
    IDLE: 'IDLE',
    SPINNING: 'SPINNING',
    STOPPING: 'STOPPING',
    RESOLVED: 'RESOLVED',
    LOCKED: 'LOCKED'
  };

  return {
    SIMBOLOS,
    MAPA_SIMBOLOS,
    NIVELES_PREMIO,
    ESTADOS_JUEGO
  };
});
