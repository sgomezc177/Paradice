/**
 * DadosModel.js - Paradice Juegos (MVC - Dice Battle)
 * Lógica pura de lanzamiento de 3 dados, evaluación de combinaciones y vidas.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.DadosModel = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  class DadosModelClass {
    constructor() {
      this.currentDice = [1, 2, 3];
      this.vidas = 3;
      this.intentoActual = 1;
      this.ultimoResultado = null;

      this.cargarVidas();
    }

    cargarVidas() {
      if (root.StorageService) {
        this.vidas = root.StorageService.getLives('dados', 3);
      }
    }

    guardarVidas() {
      if (root.StorageService) {
        root.StorageService.setLives('dados', this.vidas);
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

    lanzarDados() {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const d3 = Math.floor(Math.random() * 6) + 1;
      this.currentDice = [d1, d2, d3];
      this.ultimoResultado = this.evaluarTirada(this.currentDice);
      return {
        dice: this.currentDice,
        resultado: this.ultimoResultado
      };
    }

    evaluarTirada(dice) {
      const [d1, d2, d3] = [...dice].sort((a, b) => a - b);
      const sum = d1 + d2 + d3;

      // 1. Trío
      if (d1 === d2 && d2 === d3) {
        return {
          tier: 'TRIO',
          title: '¡SUPER PROMO 2x1 EN GRANIZADOS!',
          badge: '¡PROMO 2x1!',
          desc: `¡Trío Glacial de ${d1}-${d2}-${d3}! Ganaste el premio mayor 2x1.`,
          esMayor: true
        };
      }

      // 2. Suma Alta 14 a 18
      if (sum >= 14) {
        return {
          tier: 'SUMA_ALTA',
          title: 'Combo Amigos: 2 Dobles x $23.000',
          badge: '2 Dobles x23k',
          desc: `Suma alta de ${sum}. Combo especial para compartir con el parche.`,
          esMayor: false
        };
      }

      // 3. Escalera (1-2-3, 2-3-4, 3-4-5, 4-5-6)
      if ((d2 === d1 + 1) && (d3 === d2 + 1)) {
        return {
          tier: 'ESCALERA',
          title: '50% OFF en el 2do Granizado',
          badge: '50% OFF 2do Vaso',
          desc: `¡Escalera Glacial ${d1}-${d2}-${d3}! Segundo granizado a mitad de precio.`,
          esMayor: false
        };
      }

      // 4. Par
      if (d1 === d2 || d2 === d3 || d1 === d3) {
        return {
          tier: 'PAR',
          title: 'Shot de Licor Extra Gratis',
          badge: 'Shot Extra',
          desc: 'Par de dados iguales. Inyección de licor gratis en tu bebida.',
          esMayor: false
        };
      }

      // 5. Suma Media 10 a 13
      if (sum >= 10) {
        return {
          tier: 'SUMA_MEDIA',
          title: 'Topping de Gomitas Gratis',
          badge: 'Gomitas Gratis',
          desc: `Suma de ${sum}. Topping gratis al pedir tu granizado.`,
          esMayor: false
        };
      }

      // 6. Suma 7 a 9
      if (sum >= 7) {
        return {
          tier: 'SUMA_7_9',
          title: '-$1.000 COP de Descuento',
          badge: '-$1.000 COP',
          desc: `Suma de ${sum}. Descuento directo de $1.000 en cualquier sabor con licor.`,
          esMayor: false
        };
      }

      // 7. Suma 3 a 6
      return {
        tier: 'SUMA_BAJA',
        title: '-$500 COP de Descuento',
        badge: '-$500 COP',
        desc: `Suma de ${sum}. Descuento de $500 para tu granizado personal.`,
        esMayor: false
      };
    }
  }

  return DadosModelClass;
});
