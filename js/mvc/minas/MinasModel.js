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

  const PROMO_TIERS = [
    { hits: 1, title: '-$500 COP de Descuento', desc: 'Descuento directo de $500 al comprar tu granizado.', badge: '-$500 COP' },
    { hits: 2, title: '-$1.000 COP de Descuento', desc: 'Descuento directo de $1.000 en cualquier sabor con licor.', badge: '-$1.000 COP' },
    { hits: 3, title: 'Topping de Gomitas Gratis', desc: 'Gomitas / toppings premium gratis por la compra de tu bebida.', badge: 'Gomitas Gratis' },
    { hits: 4, title: 'Shot de Licor Extra Gratis', desc: 'Inyección de licor extra gratis al comprar tu vaso personal.', badge: 'Shot Extra' },
    { hits: 5, title: '50% OFF en el 2do Granizado', desc: 'Lleva tu segundo granizado con licor a mitad de precio.', badge: '50% OFF 2do Vaso' },
    { hits: 6, title: '¡SUPER PROMO 2x1 EN GRANIZADOS!', desc: 'Paga 1 y lleva 2 granizados con licor a elección (Jackpot).', badge: '¡PROMO 2x1!' },
    { hits: 8, title: 'Combo Amigos: 2 Dobles x $23.000', desc: 'Super precio especial para parchar con tus amigos.', badge: '2 Dobles x23k' },
  ];

  const SAFE_ICONS = ['🍧', '🍹', '🍸', '🥃', '🍷', '🍓', '🍇', '🍍', '🧊'];

  class MinasModelClass {
    constructor() {
      this.boardSize = 25; // 5x5
      this.minesCount = 3;
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
