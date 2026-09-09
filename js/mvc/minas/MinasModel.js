/**
 * MinasModel.js - Paradice Juegos (MVC - Minas Paradice)
 * Lógica pura del tablero 5x5 de hielos, distribución de minas, aciertos y promociones.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.MinasModel = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  /**
   * Escalera Oficial de 7 Niveles - Minas Paradice
   * Conforme a la especificación técnica en config_games/minas.md
   * Todos los premios son exclusivos para presentación de 16 oz.
   */
  const PROMO_TIERS = [
    {
      hits: 1,
      title: 'Bordeado o Michelado Gratis',
      desc: 'Aditivo físico de bordeado o michelado a $0 con tu vaso de 16 oz.',
      badge: 'Bordeado Gratis',
      restriccion: 'Aplica exclusivamente para 1 vaso de 16 oz. Aditivo físico sin costo ($0). Bloqueado para 9 oz.',
      sku: '16oz',
      vasosRequeridos: 1,
      tipo: 'aditivo',
      aditivo: 'Bordeado / Michelado',
      aditivoCosto: 0
    },
    {
      hits: 2,
      title: 'Adición Sirope / Salsa de Mora',
      desc: 'Adición de sirope o salsa de mora gratis con tu vaso de 16 oz.',
      badge: 'Sirope Gratis',
      restriccion: 'Aplica exclusivamente para 1 vaso de 16 oz. Aditivo de salsa a costo $0. Bloqueado para 9 oz.',
      sku: '16oz',
      vasosRequeridos: 1,
      tipo: 'aditivo',
      aditivo: 'Sirope / Salsa de Mora',
      aditivoCosto: 0
    },
    {
      hits: 3,
      title: '-$2,000 COP de Descuento',
      desc: 'Descuento directo de $2.000 COP en tu vaso de 16 oz.',
      badge: '-$2.000 COP',
      restriccion: 'Aplica únicamente para 1 vaso de 16 oz. Descuento directo de -$2.000 COP. Bloqueado para 9 oz.',
      sku: '16oz',
      vasosRequeridos: 1,
      tipo: 'descuento',
      valorDescuento: 2000
    },
    {
      hits: 4,
      title: 'Granizado 16 oz a $11,000',
      desc: 'Precio cerrado especial de $11.000 COP para tu vaso de 16 oz.',
      badge: '16 oz a $11k',
      restriccion: 'Aplica únicamente para 1 vaso de 16 oz. Precio fijo cerrado de $11.000 COP. Bloqueado para 9 oz.',
      sku: '16oz',
      vasosRequeridos: 1,
      tipo: 'precio_fijo',
      precioFijo: 11000
    },
    {
      hits: 5,
      title: 'Combo: 16 oz + Shot x $13,000',
      desc: 'Precio cerrado de $13.000 COP en 1 vaso de 16 oz con Shot incluido a $0.',
      badge: 'Combo 16oz + Shot',
      restriccion: 'Aplica únicamente para 1 vaso de 16 oz. Precio fijo de $13.000 COP con Shot incluido a $0. Bloqueado para 9 oz.',
      sku: '16oz',
      vasosRequeridos: 1,
      tipo: 'combo_precio_fijo',
      precioFijo: 13000,
      aditivo: 'Shot de Licor',
      aditivoCosto: 0
    },
    {
      hits: 6,
      title: 'El 2do a Mitad de Precio (50% OFF)',
      desc: '2do vaso de 16 oz al 50% OFF ($15.000 1ro + $7.500 2do = $22.500).',
      badge: '2do a Mitad (50%)',
      restriccion: 'Requiere 2 vasos de 16 oz. Subtotal automático cerrado de $22.500 COP. Bloqueado para 9 oz.',
      sku: '16oz_x2',
      vasosRequeridos: 2,
      tipo: 'segundo_mitad',
      subtotalFijo: 22500
    },
    {
      hits: 7,
      title: 'Combo Rumba: 2 (16oz) + 2 Shots x $25k',
      desc: '2 vasos de 16 oz + 2 Shots por solo $25.000 COP cerrado.',
      badge: 'Combo Rumba 25k',
      restriccion: 'Requiere 2 vasos de 16 oz. Precio final cerrado de $25.000 COP con 2 Shots a $0. Bloqueado para 9 oz.',
      sku: '16oz_x2',
      vasosRequeridos: 2,
      tipo: 'combo_precio_fijo',
      precioFijo: 25000,
      aditivo: '2 Shots de Licor',
      aditivoCosto: 0
    }
  ];

  const SAFE_ICONS = ['🍧', '🍹', '🍸', '🥃', '🍷', '🍓', '🍇', '🍍', '🧊'];

  class MinasModelClass {
    constructor() {
      this.boardSize = 25; // 5x5
      this.minesCount = 7; // Configuración oficial: 7 minas (18 hielos seguros)
      this.mines = new Set();
      this.revealed = new Set();
      this.safeHits = 0;
      this.gameOver = false;
      this.vidas = 3;
      this.intentoActual = 1;

      this.cargarVidas();
    }

    cargarVidas() {
      if (root.StorageService) {
        this.vidas = root.StorageService.getLives('minas', 3);
      }
    }

    guardarVidas() {
      if (root.StorageService) {
        root.StorageService.setLives('minas', this.vidas);
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

    iniciarRonda(minesCount = null) {
      if (minesCount !== null) {
        this.minesCount = minesCount;
      }
      this.mines.clear();
      this.revealed.clear();
      this.safeHits = 0;
      this.gameOver = false;

      // Colocación aleatoria de minas
      while (this.mines.size < this.minesCount) {
        const randIndex = Math.floor(Math.random() * this.boardSize);
        this.mines.add(randIndex);
      }
    }

    revelarCasilla(index) {
      if (this.gameOver || this.revealed.has(index)) return null;

      this.revealed.add(index);
      const isMine = this.mines.has(index);

      if (isMine) {
        this.gameOver = true;
        return {
          tipo: 'MINA',
          index,
          allMines: Array.from(this.mines)
        };
      } else {
        this.safeHits++;
        const icon = SAFE_ICONS[Math.floor(Math.random() * SAFE_ICONS.length)];
        const promoActual = this.obtenerPromoActual();
        const totalSeguras = this.boardSize - this.minesCount;
        const victoriaTotal = this.safeHits >= totalSeguras;

        if (victoriaTotal) {
          this.gameOver = true;
        }

        return {
          tipo: 'SEGURO',
          index,
          icon,
          safeHits: this.safeHits,
          promoActual,
          victoriaTotal
        };
      }
    }

    obtenerPromoActual() {
      return this.obtenerPromoPorAciertos(this.safeHits);
    }

    obtenerPromoPorAciertos(hits) {
      let best = null;
      for (let i = 0; i < PROMO_TIERS.length; i++) {
        if (hits >= PROMO_TIERS[i].hits) {
          best = PROMO_TIERS[i];
        }
      }
      return best;
    }

    getPromoTiers() {
      return PROMO_TIERS;
    }
  }

  return MinasModelClass;
});
