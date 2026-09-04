/**
 * Motor de Probabilidad Ponderada (RNG)
 * Basado estrictamente en la sección 5 de especificaciones1.md
 */

import { SIMBOLOS, MAPA_SIMBOLOS } from './config.js';

/**
 * Motor de probabilidad ponderada para la ruleta
 * Selecciona un símbolo considerando el peso relativo de cada uno.
 */
export function obtenerSimboloAleatorio() {
  const pesoTotal = SIMBOLOS.reduce((acc, s) => acc + s.peso, 0);
  let random = Math.random() * pesoTotal;

  for (const s of SIMBOLOS) {
    if (random < s.peso) return s;
    random -= s.peso;
  }
  return SIMBOLOS[0];
}

/**
 * Genera una matriz de 5 rodillos x 3 filas (15 símbolos en total)
 * Retorna un arreglo de 5 columnas, cada una con 3 símbolos [fila 0, fila 1, fila 2]
 */
export function generarMatrizTirada(columnas = 5, filas = 3) {
  const matriz = [];
  for (let c = 0; c < columnas; c++) {
    const columna = [];
    for (let f = 0; f < filas; f++) {
      columna.push(obtenerSimboloAleatorio());
    }
    matriz.push(columna);
  }
  return matriz;
}

/**
 * Generadores predeterminados para validación técnica y pruebas del supervisor
 */
export function generarMatrizPrueba(tipo) {
  const c = 5;
  const f = 3;
  const matriz = [];

  switch (tipo) {
    case 'JACKPOT': {
      // Al menos 5 SYM_GRATIS
      for (let col = 0; col < c; col++) {
        const fila = [];
        for (let fil = 0; fil < f; fil++) {
          if (fil === 1) {
            fila.push(MAPA_SIMBOLOS['SYM_GRATIS']);
          } else {
            fila.push(MAPA_SIMBOLOS['SYM_LIMON']);
          }
        }
        matriz.push(fila);
      }
      return matriz;
    }

    case 'BONUS_ALCOHOL': {
      // 3 SYM_BONUS
      let bonusColocados = 0;
      for (let col = 0; col < c; col++) {
        const fila = [];
        for (let fil = 0; fil < f; fil++) {
          if (bonusColocados < 3 && fil === 1) {
            fila.push(MAPA_SIMBOLOS['SYM_BONUS']);
            bonusColocados++;
          } else {
            fila.push(MAPA_SIMBOLOS['SYM_LIMON']);
          }
        }
        matriz.push(fila);
      }
      return matriz;
    }

    case 'MOJARRO': {
      // Todos símbolos diferentes o sin combinaciones suficientes
      const pool = ['SYM_LIMON', 'SYM_NARANJA', 'SYM_COPA_AZUL', 'SYM_COPA_VERDE', 'SYM_SHOT', 'SYM_COCTEL_ROJO', 'SYM_VODKA'];
      let idx = 0;
      for (let col = 0; col < c; col++) {
        const fila = [];
        for (let fil = 0; fil < f; fil++) {
          fila.push(MAPA_SIMBOLOS[pool[idx % pool.length]]);
          idx++;
        }
        matriz.push(fila);
      }
      return matriz;
    }

    default:
      return generarMatrizTirada(columnas, filas);
  }
}
