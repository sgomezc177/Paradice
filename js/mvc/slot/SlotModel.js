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
     * Es la vía exclusiva para obtener el Jackpot (PROMO_2X1_16OZ) con probabilidad del 1.0%.
     */
    shouldTriggerHitBar() {
      if (this.modoPruebaForzado === 'HITBAR') {
        this.modoPruebaForzado = null;
        return true;
      }
      // Drop rate oficial del Jackpot: exactamente 1.0% (0.01)
      return Math.random() < 0.01;
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
     * Selección de nivel para tiradas estándar (excluye Jackpot PROMO_2X1_16OZ,
     * ya que este es 100% exclusivo del modo Hit Bar con 1.0% global).
     * Sumatoria de drop rates restantes = 99.0%.
     */
    seleccionarNivelPorDropRate() {
      const nivelesSinJackpot = this.config.NIVELES_PREMIO.filter(n => n.id !== 'PROMO_2X1_16OZ');
      const pesoTotal = nivelesSinJackpot.reduce((acc, n) => acc + (n.dropRate || 0), 0); // 99.0
      const rand = Math.random() * pesoTotal;
      let acumulado = 0;
      for (let i = 0; i < nivelesSinJackpot.length; i++) {
        acumulado += (nivelesSinJackpot[i].dropRate || 0);
        if (rand <= acumulado) {
          return nivelesSinJackpot[i];
        }
      }
      return nivelesSinJackpot[nivelesSinJackpot.length - 1]; // Fallback a Consolación
    }

    /**
     * Genera una matriz visual orgánica (5x3) coherente con el nivel premiado
     */
    generarMatrizParaNivel(nivelId) {
      // 1. Matriz base con símbolos aleatorios no premiados
      const baseFill = [
        ['SYM_LIMON', 'SYM_NARANJA', 'SYM_COPA_VERDE'],
        ['SYM_NARANJA', 'SYM_SHOT', 'SYM_LIMON'],
        ['SYM_COPA_VERDE', 'SYM_LIMON', 'SYM_NARANJA'],
        ['SYM_SHOT', 'SYM_NARANJA', 'SYM_COPA_VERDE'],
        ['SYM_LIMON', 'SYM_COPA_VERDE', 'SYM_SHOT']
      ];

      const m = baseFill.map(col => [...col]);

      // 2. Colocar la combinación representativa en la línea central (row: 1) o scatter
      switch (nivelId) {
        case 'PROMO_2X1_16OZ': // 5 Sellos Paradice
          m[0][1] = 'SYM_GRATIS';
          m[1][1] = 'SYM_GRATIS';
          m[2][1] = 'SYM_GRATIS';
          m[3][1] = 'SYM_GRATIS';
          m[4][1] = 'SYM_GRATIS';
          break;

        case 'PROMO_2X16_22K': // 5 Cócteles Especiales
          m[0][1] = 'SYM_COCTEL_ROJO';
          m[1][1] = 'SYM_COCTEL_ROJO';
          m[2][1] = 'SYM_COCTEL_ROJO';
          m[3][1] = 'SYM_COCTEL_ROJO';
          m[4][1] = 'SYM_COCTEL_ROJO';
          break;

        case 'PROMO_1X16_11K': // 4 Cócteles Especiales
          m[0][1] = 'SYM_COCTEL_ROJO';
          m[1][1] = 'SYM_COCTEL_ROJO';
          m[2][1] = 'SYM_COCTEL_ROJO';
          m[3][1] = 'SYM_COCTEL_ROJO';
          m[4][1] = 'SYM_LIMON';
          break;

        case 'PROMO_COMBO_16_9': // 5 Granizados
          m[0][1] = 'SYM_COPA_AZUL';
          m[1][1] = 'SYM_COPA_AZUL';
          m[2][1] = 'SYM_COPA_AZUL';
          m[3][1] = 'SYM_COPA_AZUL';
          m[4][1] = 'SYM_COPA_AZUL';
          break;

        case 'PROMO_JERINGA_FREE': // 3+ Bonus Shakers / Jeringas
          m[0][1] = 'SYM_BONUS';
          m[2][1] = 'SYM_BONUS';
          m[4][1] = 'SYM_BONUS';
          break;

        case 'PROMO_1X16_13K': // 4 Granizados
          m[0][1] = 'SYM_COPA_AZUL';
          m[1][1] = 'SYM_COPA_AZUL';
          m[2][1] = 'SYM_COPA_AZUL';
          m[3][1] = 'SYM_COPA_AZUL';
          m[4][1] = 'SYM_NARANJA';
          break;

        case 'PROMO_2X9_14K': // 5 Frutas Cítricas
          m[0][1] = 'SYM_NARANJA';
          m[1][1] = 'SYM_NARANJA';
          m[2][1] = 'SYM_NARANJA';
          m[3][1] = 'SYM_NARANJA';
          m[4][1] = 'SYM_NARANJA';
          break;

        case 'DESC_1500_16OZ': // 4 Frutas Cítricas
          m[0][1] = 'SYM_LIMON';
          m[1][1] = 'SYM_LIMON';
          m[2][1] = 'SYM_LIMON';
          m[3][1] = 'SYM_LIMON';
          m[4][1] = 'SYM_SHOT';
          break;

        case 'DESC_1000_9OZ': // 3 Granizados
          m[0][1] = 'SYM_COPA_VERDE';
          m[1][1] = 'SYM_COPA_VERDE';
          m[2][1] = 'SYM_COPA_VERDE';
          m[3][1] = 'SYM_LIMON';
          m[4][1] = 'SYM_NARANJA';
          break;

        case 'DESC_500_ANY': // 3 Frutas o pareja
        default:
          m[0][1] = 'SYM_LIMON';
          m[1][1] = 'SYM_LIMON';
          m[2][1] = 'SYM_LIMON';
          m[3][1] = 'SYM_SHOT';
          m[4][1] = 'SYM_COPA_VERDE';
          break;
      }

      return m;
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

      // Selección por Drop Rate oficial (100.0% calibrado)
      const targetNivel = this.seleccionarNivelPorDropRate();
      const matriz = this.generarMatrizParaNivel(targetNivel.id);
      this.matriz = matriz;
      return matriz;
    }

    /**
     * Genera matrices fijas para validación del supervisor
     */
    generarMatrizPrueba(tipo) {
      if (tipo === 'JACKPOT' || tipo === 'PROMO_2X1_16OZ') {
        return this.generarMatrizParaNivel('PROMO_2X1_16OZ');
      } else if (tipo === 'EPICO_22K' || tipo === 'PROMO_2X16_22K') {
        return this.generarMatrizParaNivel('PROMO_2X16_22K');
      } else if (tipo === 'EPICO_11K' || tipo === 'PROMO_1X16_11K') {
        return this.generarMatrizParaNivel('PROMO_1X16_11K');
      } else if (tipo === 'COMBO_16_9' || tipo === 'PROMO_COMBO_16_9') {
        return this.generarMatrizParaNivel('PROMO_COMBO_16_9');
      } else if (tipo === 'JERINGA' || tipo === 'PROMO_JERINGA_FREE') {
        return this.generarMatrizParaNivel('PROMO_JERINGA_FREE');
      } else if (tipo === 'POCO_COMUN_13K' || tipo === 'PROMO_1X16_13K') {
        return this.generarMatrizParaNivel('PROMO_1X16_13K');
      } else if (tipo === 'POCO_COMUN_14K' || tipo === 'PROMO_2X9_14K') {
        return this.generarMatrizParaNivel('PROMO_2X9_14K');
      } else if (tipo === 'DESC_1500' || tipo === 'DESC_1500_16OZ') {
        return this.generarMatrizParaNivel('DESC_1500_16OZ');
      } else if (tipo === 'DESC_1000' || tipo === 'DESC_1000_9OZ') {
        return this.generarMatrizParaNivel('DESC_1000_9OZ');
      } else if (tipo === 'DESC_500' || tipo === 'DESC_500_ANY') {
        return this.generarMatrizParaNivel('DESC_500_ANY');
      }
      return this.generarMatrizParaNivel('DESC_500_ANY');
    }

    /**
     * Conteo y evaluación de los símbolos en la matriz
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

      let nivelGanador = niveles.find(n => n.id === 'DESC_500_ANY');
      let simbolosGanadores = [];

      // 1. Jackpot (1.0%): 5 Sellos Paradice
      if (nGratis >= 5) {
        nivelGanador = niveles.find(n => n.id === 'PROMO_2X1_16OZ');
        simbolosGanadores = posiciones['SYM_GRATIS'] || [];
      }
      // 2. Épico 2x16 (4.0%): 5 Cócteles Especiales
      else if (nEspeciales >= 5) {
        nivelGanador = niveles.find(n => n.id === 'PROMO_2X16_22K');
        simbolosGanadores = [...(posiciones['SYM_COCTEL_ROJO'] || []), ...(posiciones['SYM_VODKA'] || [])];
      }
      // 3. Épico 1x16 (5.0%): 4 Cócteles Especiales
      else if (nEspeciales >= 4) {
        nivelGanador = niveles.find(n => n.id === 'PROMO_1X16_11K');
        simbolosGanadores = [...(posiciones['SYM_COCTEL_ROJO'] || []), ...(posiciones['SYM_VODKA'] || [])];
      }
      // 4. Raro Combo Amigos (10.0%): 5 Granizados
      else if (nGranizados >= 5) {
        nivelGanador = niveles.find(n => n.id === 'PROMO_COMBO_16_9');
        simbolosGanadores = [...(posiciones['SYM_COPA_AZUL'] || []), ...(posiciones['SYM_COPA_VERDE'] || [])];
      }
      // 5. Raro Jeringa Shot (10.0%): 3+ Bonus Coctelera
      else if (nBonus >= 3) {
        nivelGanador = niveles.find(n => n.id === 'PROMO_JERINGA_FREE');
        simbolosGanadores = posiciones['SYM_BONUS'] || [];
      }
      // 6. Poco Común Doble 16 (15.0%): 4 Granizados
      else if (nGranizados >= 4) {
        nivelGanador = niveles.find(n => n.id === 'PROMO_1X16_13K');
        simbolosGanadores = [...(posiciones['SYM_COPA_AZUL'] || []), ...(posiciones['SYM_COPA_VERDE'] || [])];
      }
      // 7. Poco Común 2x9 (15.0%): 5 Frutas
      else if (nFrutas >= 5) {
        nivelGanador = niveles.find(n => n.id === 'PROMO_2X9_14K');
        simbolosGanadores = [...(posiciones['SYM_LIMON'] || []), ...(posiciones['SYM_NARANJA'] || [])];
      }
      // 8. Común -$1.500 16 oz (15.0%): 4 Frutas
      else if (nFrutas >= 4) {
        nivelGanador = niveles.find(n => n.id === 'DESC_1500_16OZ');
        simbolosGanadores = [...(posiciones['SYM_LIMON'] || []), ...(posiciones['SYM_NARANJA'] || [])];
      }
      // 9. Común -$1.000 9 oz (15.0%): 3 Granizados
      else if (nGranizados >= 3) {
        nivelGanador = niveles.find(n => n.id === 'DESC_1000_9OZ');
        simbolosGanadores = [...(posiciones['SYM_COPA_AZUL'] || []), ...(posiciones['SYM_COPA_VERDE'] || [])];
      }
      // 10. Consolación -$500 (10.0%): Base o resto
      else {
        nivelGanador = niveles.find(n => n.id === 'DESC_500_ANY');
        simbolosGanadores = [...(posiciones['SYM_LIMON'] || []), ...(posiciones['SYM_NARANJA'] || [])].slice(0, 3);
      }

      const resultado = {
        esPremio: true,
        nivel: nivelGanador,
        simbolosGanadores: simbolosGanadores,
        matriz: m
      };

      this.ultimoResultado = resultado;
      return resultado;
    }

    /**
     * Evalúa el resultado del evento Hit Bar según los aciertos logrados
     */
    evaluarHitBarResultado(aciertos) {
      const niveles = this.config.NIVELES_PREMIO;
      let nivelGanador = niveles.find(n => n.id === 'DESC_500_ANY');

      if (aciertos >= 5) {
        nivelGanador = niveles.find(n => n.id === 'PROMO_2X1_16OZ'); // Jackpot
      } else if (aciertos === 4) {
        nivelGanador = niveles.find(n => n.id === 'PROMO_2X16_22K') || niveles.find(n => n.id === 'PROMO_1X16_11K'); // Épico
      } else if (aciertos === 3) {
        nivelGanador = niveles.find(n => n.id === 'PROMO_COMBO_16_9') || niveles.find(n => n.id === 'PROMO_JERINGA_FREE'); // Raro
      } else if (aciertos === 2) {
        nivelGanador = niveles.find(n => n.id === 'PROMO_1X16_13K') || niveles.find(n => n.id === 'PROMO_2X9_14K'); // Poco Común
      } else if (aciertos === 1) {
        nivelGanador = niveles.find(n => n.id === 'DESC_1500_16OZ') || niveles.find(n => n.id === 'DESC_1000_9OZ'); // Común
      } else {
        nivelGanador = niveles.find(n => n.id === 'DESC_500_ANY'); // Consolación
      }

      const celdas = [];
      for (let i = 0; i < aciertos; i++) {
        celdas.push({ col: i, row: 1 });
      }

      const res = {
        esPremio: true,
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
