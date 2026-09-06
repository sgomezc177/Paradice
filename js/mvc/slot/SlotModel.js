/**
 * SlotModel.js - Paradice Juegos (MVC - Tragamonedas)
 * Lógica pura de negocio, probabilidades ponderadas (RNG), evaluador de premios,
 * gestión de vidas y selector de evento aleatorio Hit Bar (1 vez por partida en 1 de las 3 vidas).
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.SlotModel = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  class SlotModelClass {
    constructor() {
      this.config = root.SlotConfig;
      this.reelsCount = 5;
      this.rowsCount = 3;
      this.matriz = [];
      this.ultimoResultado = null;
      this.vidas = 3;
      this.intentoActual = 1;
      this.modoPruebaForzado = null;

      // Evento especial Hit Bar: se activa exactamente 1 vez por partida en una vida aleatoria (1, 2 o 3)
      this.hitBarAttempt = Math.floor(Math.random() * 3) + 1;
      this.hitBarPlayed = false;

      this.cargarVidas();
    }

    cargarVidas() {
      if (root.StorageService) {
        this.vidas = root.StorageService.getLives('slot', 3);
        if (this.vidas <= 0) {
          this.vidas = 3;
          this.guardarVidas();
        }
        this.intentoActual = Math.max(1, 4 - this.vidas);
      }
    }

    guardarVidas() {
      if (root.StorageService) {
        root.StorageService.setLives('slot', this.vidas);
      }
    }

    consumirVida() {
      if (this.vidas > 0) {
        this.intentoActual = 4 - this.vidas;
        this.vidas--;
        this.guardarVidas();
      }
      return this.vidas;
    }

    recuperarVida() {
      if (this.vidas < 3) {
        this.vidas = Math.min(3, this.vidas + 1);
        this.intentoActual = Math.max(1, 4 - this.vidas);
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

    /**
     * Determina si la tirada actual debe activar el modo interactivo Hit Bar.
     * Puede aparecer aleatoriamente en CUALQUIERA de las 3 vidas, e incluso más de una vez.
     */
    shouldTriggerHitBar() {
      if (this.modoPruebaForzado === 'HITBAR') {
        this.modoPruebaForzado = null;
        return true;
      }
      // Probabilidad atractiva y balanceada de ~28% en cada tirada
      return Math.random() < 0.28;
    }

    /**
     * Generador de símbolo ponderado según peso RNG
     */
    obtenerSimboloAleatorio() {
      const simbolos = this.config.SIMBOLOS;
      const pesoTotal = simbolos.reduce((acc, s) => acc + s.peso, 0);
      let rand = Math.random() * pesoTotal;

      for (let i = 0; i < simbolos.length; i++) {
        if (rand < simbolos[i].peso) {
          return simbolos[i];
        }
        rand -= simbolos[i].peso;
      }
      return simbolos[0];
    }

    /**
     * Genera la matriz de 5 columnas x 3 filas
     */
    generarMatrizTirada() {
      if (this.modoPruebaForzado) {
        const forzada = this.generarMatrizPrueba(this.modoPruebaForzado);
        this.modoPruebaForzado = null;
        this.matriz = forzada;
        return forzada;
      }

      const matriz = [];
      for (let col = 0; col < this.reelsCount; col++) {
        const columna = [];
        for (let row = 0; row < this.rowsCount; row++) {
          columna.push(this.obtenerSimboloAleatorio().id);
        }
        matriz.push(columna);
      }
      this.matriz = matriz;
      return matriz;
    }

    /**
     * Genera matrices fijas para validación de supervisor
     */
    generarMatrizPrueba(tipo) {
      const matriz = [
        ['SYM_LIMON', 'SYM_NARANJA', 'SYM_COPA_AZUL'],
        ['SYM_COPA_VERDE', 'SYM_SHOT', 'SYM_COCTEL_ROJO'],
        ['SYM_VODKA', 'SYM_LIMON', 'SYM_NARANJA'],
        ['SYM_COPA_AZUL', 'SYM_COPA_VERDE', 'SYM_SHOT'],
        ['SYM_COCTEL_ROJO', 'SYM_VODKA', 'SYM_LIMON']
      ];

      if (tipo === 'JACKPOT') {
        matriz[0][1] = 'SYM_GRATIS';
        matriz[1][1] = 'SYM_GRATIS';
        matriz[2][1] = 'SYM_GRATIS';
        matriz[3][1] = 'SYM_GRATIS';
        matriz[4][1] = 'SYM_GRATIS';
      } else if (tipo === 'BONUS') {
        matriz[0][1] = 'SYM_BONUS';
        matriz[2][1] = 'SYM_BONUS';
        matriz[4][1] = 'SYM_BONUS';
      } else if (tipo === 'VIDA') {
        matriz[0][1] = 'SYM_CORAZON';
        matriz[2][1] = 'SYM_CORAZON';
        matriz[4][1] = 'SYM_CORAZON';
      } else if (tipo === 'MOJARRO') {
        matriz[0] = ['SYM_LIMON', 'SYM_COPA_AZUL', 'SYM_SHOT'];
        matriz[1] = ['SYM_NARANJA', 'SYM_COPA_VERDE', 'SYM_COCTEL_ROJO'];
        matriz[2] = ['SYM_VODKA', 'SYM_BONUS', 'SYM_GRATIS'];
        matriz[3] = ['SYM_LIMON', 'SYM_COPA_AZUL', 'SYM_NARANJA'];
        matriz[4] = ['SYM_COPA_VERDE', 'SYM_SHOT', 'SYM_VODKA'];
      }
      this.matriz = matriz;
      return matriz;
    }

    /**
     * Conteo y evaluación de los 15 símbolos
     */
    evaluarTirada(matriz) {
      const m = matriz || this.matriz;
      const conteo = {};
      const posiciones = {};

      for (let col = 0; col < m.length; col++) {
        for (let row = 0; row < m[col].length; row++) {
          const symId = m[col][row];
          conteo[symId] = (conteo[symId] || 0) + 1;
          if (!posiciones[symId]) posiciones[symId] = [];
          posiciones[symId].push({ col, row });
        }
      }

      const niveles = this.config.NIVELES_PREMIO;
      const nGratis = conteo['SYM_GRATIS'] || 0;
      const nBonus = conteo['SYM_BONUS'] || 0;
      const nCorazon = conteo['SYM_CORAZON'] || 0;
      const nCopaAzul = conteo['SYM_COPA_AZUL'] || 0;
      const nCopaVerde = conteo['SYM_COPA_VERDE'] || 0;
      const nCoctelRojo = conteo['SYM_COCTEL_ROJO'] || 0;
      const nVodka = conteo['SYM_VODKA'] || 0;
      const nLimon = conteo['SYM_LIMON'] || 0;
      const nNaranja = conteo['SYM_NARANJA'] || 0;

      const nGranizados = nCopaAzul + nCopaVerde;
      const nFrutas = nLimon + nNaranja;
      const nEspeciales = nCoctelRojo + nVodka;

      let nivelGanador = niveles.find(n => n.id === 'MOJARRO');
      let simbolosGanadores = [];

      // 1. Nivel 13: 5+ Sellos Gratis
      if (nGratis >= 5) {
        nivelGanador = niveles.find(n => n.id === 'JACKPOT');
        simbolosGanadores = posiciones['SYM_GRATIS'] || [];
      }
      // 2. Nivel 12: 5 Cócteles Especiales
      else if (nEspeciales >= 5) {
        nivelGanador = niveles.find(n => n.id === 'NIVEL_12');
        simbolosGanadores = [...(posiciones['SYM_COCTEL_ROJO'] || []), ...(posiciones['SYM_VODKA'] || [])];
      }
      // 3. Nivel 11: 4 Cócteles Especiales
      else if (nEspeciales >= 4) {
        nivelGanador = niveles.find(n => n.id === 'NIVEL_11');
        simbolosGanadores = [...(posiciones['SYM_COCTEL_ROJO'] || []), ...(posiciones['SYM_VODKA'] || [])];
      }
      // 4. Nivel 10: 5 Granizados
      else if (nGranizados >= 5) {
        nivelGanador = niveles.find(n => n.id === 'NIVEL_10');
        simbolosGanadores = [...(posiciones['SYM_COPA_AZUL'] || []), ...(posiciones['SYM_COPA_VERDE'] || [])];
      }
      // 5. Nivel 9: 5 Frutas
      else if (nFrutas >= 5) {
        nivelGanador = niveles.find(n => n.id === 'NIVEL_9');
        simbolosGanadores = [...(posiciones['SYM_LIMON'] || []), ...(posiciones['SYM_NARANJA'] || [])];
      }
      // 6. Nivel 8: 4 Granizados
      else if (nGranizados >= 4) {
        nivelGanador = niveles.find(n => n.id === 'NIVEL_8');
        simbolosGanadores = [...(posiciones['SYM_COPA_AZUL'] || []), ...(posiciones['SYM_COPA_VERDE'] || [])];
      }
      // 7. Bonus Alcohol: 3+ Bonus
      else if (nBonus >= 3) {
        nivelGanador = niveles.find(n => n.id === 'BONUS_ALCOHOL');
        simbolosGanadores = posiciones['SYM_BONUS'] || [];
      }
      // 8. Nivel 7: 4 Frutas
      else if (nFrutas >= 4) {
        nivelGanador = niveles.find(n => n.id === 'NIVEL_7');
        simbolosGanadores = [...(posiciones['SYM_LIMON'] || []), ...(posiciones['SYM_NARANJA'] || [])];
      }
      // 9. Bonus Vida Extra: 3+ Corazones 💖
      else if (nCorazon >= 3) {
        nivelGanador = niveles.find(n => n.id === 'BONUS_VIDA');
        simbolosGanadores = posiciones['SYM_CORAZON'] || [];
      }
      // 10. Nivel 5: 3 Granizados
      else if (nGranizados >= 3) {
        nivelGanador = niveles.find(n => n.id === 'NIVEL_5');
        simbolosGanadores = [...(posiciones['SYM_COPA_AZUL'] || []), ...(posiciones['SYM_COPA_VERDE'] || [])];
      }

      const resultado = {
        esPremio: nivelGanador.id !== 'MOJARRO',
        nivel: nivelGanador,
        simbolosGanadores: simbolosGanadores,
        matriz: m
      };

      this.ultimoResultado = resultado;
      return resultado;
    }

    /**
     * Evalúa el resultado final del evento Hit Bar según los aciertos logrados
     */
    evaluarHitBarResultado(aciertos) {
      const niveles = this.config.NIVELES_PREMIO;
      let nivelGanador = niveles.find(n => n.id === 'MOJARRO');

      if (aciertos >= 5) {
        nivelGanador = niveles.find(n => n.id === 'JACKPOT');
      } else if (aciertos === 4) {
        nivelGanador = niveles.find(n => n.id === 'NIVEL_11');
      } else if (aciertos === 3) {
        nivelGanador = niveles.find(n => n.id === 'NIVEL_10');
      } else if (aciertos === 2) {
        nivelGanador = niveles.find(n => n.id === 'NIVEL_8');
      } else if (aciertos === 1) {
        nivelGanador = niveles.find(n => n.id === 'NIVEL_5');
      }

      const celdas = [];
      for (let i = 0; i < aciertos; i++) {
        celdas.push({ col: i, row: 1 });
      }

      const res = {
        esPremio: nivelGanador.id !== 'MOJARRO',
        nivel: nivelGanador,
        simbolosGanadores: celdas,
        aciertos: aciertos,
        esHitBar: true
      };

      this.ultimoResultado = res;
      return res;
    }
  }

  return SlotModelClass;
});
