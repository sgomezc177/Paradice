/**
 * RuletaModel.js - Paradice Juegos (MVC - Ruleta Paradice)
 * Definición de los 12 sectores, cálculo de ángulos físicos y gestión de vidas.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.RuletaModel = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  const SECTORES = [
    { label: '¡PROMO 2x1! ⭐', title: '¡SUPER PROMO 2x1 EN GRANIZADOS!', badge: '¡PROMO 2x1!', color: '#facc15', textDark: true, isLose: false },
    { label: '50% OFF 2do', title: '50% OFF en el 2do Granizado', badge: '50% OFF 2do', color: '#0284c7', textDark: false, isLose: false },
    { label: '-$1.000 COP', title: '-$1.000 COP de Descuento', badge: '-$1.000 COP', color: '#059669', textDark: false, isLose: false },
    { label: 'Shot Extra', title: 'Shot de Licor Extra Gratis', badge: 'Shot Extra', color: '#db2777', textDark: false, isLose: false },
    { label: '2 Dobles x23k', title: 'Combo Amigos: 2 Dobles x $23.000', badge: '2 Dobles x23k', color: '#7c3aed', textDark: false, isLose: false },
    { label: '-$500 COP', title: '-$500 COP de Descuento', badge: '-$500 COP', color: '#06b6d4', textDark: true, isLose: false },
    { label: 'Gomitas Gratis', title: 'Topping de Gomitas Gratis', badge: 'Gomitas Gratis', color: '#9333ea', textDark: false, isLose: false },
    { label: 'Hielo Roto 💀', title: 'Hielo Roto (Sin Premio)', badge: 'Sin Premio', color: '#e11d48', textDark: false, isLose: true },
    { label: '50% OFF 2do', title: '50% OFF en el 2do Granizado', badge: '50% OFF 2do', color: '#0284c7', textDark: false, isLose: false },
    { label: '-$800 COP', title: '-$800 COP de Descuento', badge: '-$800 COP', color: '#10b981', textDark: false, isLose: false },
    { label: 'Shot Extra', title: 'Shot de Licor Extra Gratis', badge: 'Shot Extra', color: '#ec4899', textDark: false, isLose: false },
    { label: 'Pague 2 Lleve 3', title: 'Pague 2 y Lleve 3 Granizados', badge: 'Pague 2 Lleve 3', color: '#eab308', textDark: true, isLose: false }
  ];

  class RuletaModelClass {
    constructor() {
      this.currentAngle = 0;
      this.vidas = 3;
      this.intentoActual = 1;
      this.ultimoResultado = null;

      this.cargarVidas();
    }

    cargarVidas() {
      if (root.StorageService) {
        this.vidas = root.StorageService.getLives('ruleta', 3);
      }
    }

    guardarVidas() {
      if (root.StorageService) {
        root.StorageService.setLives('ruleta', this.vidas);
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

    getSectores() {
      return SECTORES;
    }

    /**
     * Calcula el sector apuntado por la aguja superior (a 270 grados / -90 grados)
     */
    getSectorAtAngle(angle) {
      const numSectores = SECTORES.length;
      const arc = (2 * Math.PI) / numSectores;

      // Normalizar ángulo entre 0 y 2*PI
      let normalizedAngle = (angle % (2 * Math.PI));
      if (normalizedAngle < 0) normalizedAngle += 2 * Math.PI;

      // La aguja apunta en el punto superior: 3*PI/2 (270 grados)
      const pointerAngle = (3 * Math.PI) / 2;
      let diff = (pointerAngle - normalizedAngle) % (2 * Math.PI);
      if (diff < 0) diff += 2 * Math.PI;

      const sectorIdx = Math.floor(diff / arc) % numSectores;
      return {
        index: sectorIdx,
        sector: SECTORES[sectorIdx]
      };
    }
  }

  return RuletaModelClass;
});
