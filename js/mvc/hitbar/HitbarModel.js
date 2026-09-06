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

  const RUSH_PROMOS = [
    { level: 1, targetId: 'LIMON', targetIcon: '🍋', targetName: 'Limón Glacial', targetHint: 'Atínale al Limón para ganar - COP', title: '- COP de Descuento', desc: 'Descuento directo de  al comprar tu granizado.', badge: '- COP', bpm: 130, speed: 6.8, speedStep: '1x (+1)' },
    { level: 2, targetId: 'NARANJA', targetIcon: '🍊', targetName: 'Naranja Fresh', targetHint: 'Atínale a la Naranja para ganar -.000 COP', title: '-.000 COP de Descuento', desc: 'Descuento directo de .000 en cualquier sabor con licor.', badge: '-.000 COP', bpm: 140, speed: 9.8, speedStep: '2x (+1)' },
    { level: 3, targetId: 'GOMITAS', targetIcon: '🍬', targetName: 'Topping de Gomitas', targetHint: 'Atínale a las Gomitas para el Topping Gratis', title: 'Topping de Gomitas Gratis', desc: 'Gomitas / toppings premium gratis por la compra de tu bebida.', badge: 'Gomitas Gratis', bpm: 150, speed: 13.5, speedStep: '3x (+1)' },
    { level: 4, targetId: 'SHOT', targetIcon: '🥃', targetName: 'Shot de Licor Extra', targetHint: 'Atínale al Shot para inyección de licor gratis', title: 'Shot de Licor Extra Gratis', desc: 'Inyección de licor extra gratis al comprar tu vaso personal.', badge: 'Shot Extra', bpm: 162, speed: 17.5, speedStep: '4x (+1)' },
    { level: 5, targetId: 'COPA', targetIcon: '🍧', targetName: '50% OFF 2do Granizado', targetHint: 'Atínale al Granizado Doble para 50% OFF en 2do', title: '50% OFF en el 2do Granizado', desc: 'Lleva tu segundo granizado con licor a mitad de precio.', badge: '50% OFF 2do Vaso', bpm: 174, speed: 22.0, speedStep: '5x (+1)' },
    { level: 6, targetId: 'ESTRELLA', targetIcon: '⭐', targetName: 'SUPER PROMO 2x1', targetHint: '¡NIVEL MÁXIMO! Atínale a la Estrella para el 2x1', title: '¡SUPER PROMO 2x1 EN GRANIZADOS!', desc: 'Paga 1 y lleva 2 granizados con licor a elección (Jackpot).', badge: '¡PROMO 2x1!', bpm: 188, speed: 27.5, speedStep: 'MAX 2x1' }
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
