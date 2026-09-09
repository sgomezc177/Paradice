/**
 * HitbarModel.js - Paradice Juegos (MVC - Hit Bar Rush 2.0)
 * Lógica de niveles, objetivos dinámicos, velocidades calibradas y sistema de vidas.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.HitbarModel = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  /**
   * Escalera Oficial de 7 Niveles - Hit Bar Rush
   * Conforme a la especificación técnica en config_games/hitbar_rush.md
   * Exclusivo para presentación de 16 oz. Multiplicadores de 1.0x a 4.0x.
   */
  const RUSH_PROMOS = [
    {
      level: 1,
      targetId: 'GOMITAS',
      targetIcon: '🍬',
      targetName: 'Gomitas Ácidas',
      targetHint: 'Atínale a las Gomitas para ganar Topping Gratis',
      title: 'Topping de Gomitas Ácidas',
      desc: 'Topping de gomitas ácidas gratis con tu vaso de 16 oz.',
      badge: 'Gomitas Ácidas',
      bpm: 128,
      speed: 8.0,
      tolerance: 44,
      speedStep: '1.0x (Base)',
      sku: '16oz',
      vasosRequeridos: 1,
      tipo: 'aditivo',
      aditivo: 'Topping Gomitas Ácidas',
      aditivoCosto: 0,
      restriccion: 'Aplica exclusivamente para 1 vaso de 16 oz. Aditivo a costo $0. Bloqueado para 9 oz.'
    },
    {
      level: 2,
      targetId: 'SHOT',
      targetIcon: '🥃',
      targetName: 'Shot de Licor',
      targetHint: 'Atínale al Shot para inyección de licor gratis',
      title: 'Adición de Shot de Licor',
      desc: 'Adición de shot de licor gratis con tu vaso de 16 oz.',
      badge: 'Shot de Licor',
      bpm: 142,
      speed: 13.0,
      tolerance: 36,
      speedStep: '1.5x (+62%)',
      sku: '16oz',
      vasosRequeridos: 1,
      tipo: 'aditivo',
      aditivo: 'Shot de Licor',
      aditivoCosto: 0,
      restriccion: 'Aplica exclusivamente para 1 vaso de 16 oz. Aditivo a costo $0. Bloqueado para 9 oz.'
    },
    {
      level: 3,
      targetId: 'COPA',
      targetIcon: '🍧',
      targetName: '2do Vaso Descuento',
      targetHint: 'Atínale a la Copa para -$3.000 en el 2do vaso',
      title: '-$3,000 COP en tu 2do Granizado',
      desc: 'Descuento de $3.000 COP en tu 2do vaso de 16 oz ($15k + $12k = $27.000).',
      badge: '-$3k en 2do Vaso',
      bpm: 158,
      speed: 19.0,
      tolerance: 29,
      speedStep: '2.0x (+137%)',
      sku: '16oz_x2',
      vasosRequeridos: 2,
      tipo: 'segundo_descuento',
      subtotalFijo: 27000,
      restriccion: 'Requiere 2 vasos de 16 oz. Subtotal automático de $27.000 COP ($15k + $12k). Bloqueado para 9 oz.'
    },
    {
      level: 4,
      targetId: 'JERINGA',
      targetIcon: '💉',
      targetName: 'Jeringa Shot Extra',
      targetHint: 'Atínale a la Jeringa para combo cerrado x $14.000',
      title: 'Granizado 16oz + Jeringa x $14,000',
      desc: 'Precio cerrado de $14.000 COP en 1 vaso de 16 oz con Jeringa a $0.',
      badge: '16oz + Jeringa $14k',
      bpm: 174,
      speed: 26.0,
      tolerance: 23,
      speedStep: '2.5x (+225%)',
      sku: '16oz',
      vasosRequeridos: 1,
      tipo: 'combo_precio_fijo',
      precioFijo: 14000,
      aditivo: '1 Jeringa de Licor',
      aditivoCosto: 0,
      restriccion: 'Aplica para 1 vaso de 16 oz. Precio fijo de $14.000 COP con 1 Jeringa a $0. Bloqueado para 9 oz.'
    },
    {
      level: 5,
      targetId: 'COMBO',
      targetIcon: '🍹',
      targetName: '2 Granizados 16 oz',
      targetHint: 'Atínale a los Granizados para 2 de 16 oz x $23.000',
      title: '2 Granizados de 16oz x $23,000',
      desc: 'Precio cerrado de $23.000 COP por 2 vasos de 16 oz.',
      badge: '2 de 16oz x $23k',
      bpm: 190,
      speed: 34.0,
      tolerance: 18,
      speedStep: '3.0x (+325%)',
      sku: '16oz_x2',
      vasosRequeridos: 2,
      tipo: 'precio_fijo',
      precioFijo: 23000,
      restriccion: 'Requiere 2 vasos de 16 oz. Precio final cerrado de $23.000 COP. Bloqueado para 9 oz.'
    },
    {
      level: 6,
      targetId: 'EXTREMO',
      targetIcon: '🔥',
      targetName: 'Combo Extremo 26k',
      targetHint: 'Atínale al Fuego para 2 (16oz) + 2 Jeringas x $26k',
      title: 'Combo Extremo: 2 (16oz) + 2 Jeringas x $26k',
      desc: '2 vasos de 16 oz + 2 Jeringas por $26.000 COP cerrado.',
      badge: 'Combo Extremo 26k',
      bpm: 210,
      speed: 43.0,
      tolerance: 14,
      speedStep: '3.5x (+437%)',
      sku: '16oz_x2',
      vasosRequeridos: 2,
      tipo: 'combo_precio_fijo',
      precioFijo: 26000,
      aditivo: '2 Jeringas de Licor',
      aditivoCosto: 0,
      restriccion: 'Requiere 2 vasos de 16 oz. Precio cerrado de $26.000 COP con 2 Jeringas a $0. Bloqueado para 9 oz.'
    },
    {
      level: 7,
      targetId: 'ESTRELLA',
      targetIcon: '⭐',
      targetName: 'Rush Champion (¡3x2!)',
      targetHint: '¡VELOCIDAD EXTREMA! Atínale a la Estrella para el 3x2',
      title: '¡3x2 en Granizados de 16oz!',
      desc: '3 vasos de 16 oz por solo $30.000 COP (Pagas 2 y el 3ro es GRATIS).',
      badge: '¡3x2 Granizados!',
      bpm: 230,
      speed: 53.0,
      tolerance: 11,
      speedStep: '4.0x MAX RUSH',
      sku: '16oz_x3',
      vasosRequeridos: 3,
      tipo: 'tres_por_dos',
      subtotalFijo: 30000,
      precioFijo: 30000,
      restriccion: 'Requiere 3 vasos de 16 oz. Precio total cerrado de $30.000 COP (Paga 2 lleva 3). Bloqueado para 9 oz.'
    }
  ];

  class HitbarModelClass {
    constructor() {
      this.currentLevelIndex = 0;
      this.vidas = 3;
      this.intentoActual = 1;
      this.isPlaying = false;
      this.accumulatedPromo = null;

      this.cargarVidas();
    }

    cargarVidas() {
      if (root.StorageService) {
        this.vidas = root.StorageService.getLives('hitbar', 3);
      }
    }

    guardarVidas() {
      if (root.StorageService) {
        root.StorageService.setLives('hitbar', this.vidas);
      }
    }

    consumirVida() {
      if (this.vidas > 0) {
        this.vidas--;
        this.intentoActual = Math.min(3, 4 - this.vidas);
        this.guardarVidas();
      }
      return this.vidas;
    }

    reiniciarVidas() {
      this.vidas = 3;
      this.intentoActual = 1;
      this.guardarVidas();
      return this.vidas;
    }

    getCurrentLevel() {
      return RUSH_PROMOS[this.currentLevelIndex];
    }

    getAllLevels() {
      return RUSH_PROMOS;
    }

    advanceLevel() {
      this.accumulatedPromo = this.getCurrentLevel();
      if (this.currentLevelIndex < RUSH_PROMOS.length - 1) {
        this.currentLevelIndex++;
        return {
          hasWonMax: false,
          level: this.getCurrentLevel()
        };
      } else {
        return {
          hasWonMax: true,
          level: this.getCurrentLevel()
        };
      }
    }

    resetProgression() {
      this.currentLevelIndex = 0;
      this.accumulatedPromo = null;
    }
  }

  return HitbarModelClass;
});
