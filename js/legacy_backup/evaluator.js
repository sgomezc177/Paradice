/**
 * Evaluador de Premios y Escrutinio de la Cuadrícula (5x3)
 * Basado estrictamente en la sección 4 de especificaciones1.md
 */

import { NIVELES_PREMIO } from './config.js';

/**
 * Realiza el conteo de frecuencias y posiciones de cada símbolo en la matriz 5x3
 * @param {Array<Array<Object>>} matriz - 5 columnas x 3 filas
 */
export function analizarMatriz(matriz) {
  const conteo = {};
  const posiciones = {};

  for (let c = 0; c < matriz.length; c++) {
    for (let f = 0; f < matriz[c].length; f++) {
      const simbolo = matriz[c][f];
      const id = simbolo.id;

      if (!conteo[id]) {
        conteo[id] = 0;
        posiciones[id] = [];
      }
      conteo[id]++;
      posiciones[id].push({ col: c, fila: f });
    }
  }

  // Agrupaciones por categorías según especificaciones
  const frutaIds = ['SYM_LIMON', 'SYM_NARANJA'];
  const granizadoIds = ['SYM_COPA_AZUL', 'SYM_COPA_VERDE'];
  const especialIds = ['SYM_COCTEL_ROJO', 'SYM_VODKA'];

  const conteoFrutas = frutaIds.reduce((sum, id) => sum + (conteo[id] || 0), 0);
  const posicionesFrutas = frutaIds.flatMap(id => posiciones[id] || []);

  const conteoGranizados = granizadoIds.reduce((sum, id) => sum + (conteo[id] || 0), 0);
  const posicionesGranizados = granizadoIds.flatMap(id => posiciones[id] || []);

  const conteoEspeciales = especialIds.reduce((sum, id) => sum + (conteo[id] || 0), 0);
  const posicionesEspeciales = especialIds.flatMap(id => posiciones[id] || []);

  return {
    conteo,
    posiciones,
    conteoFrutas,
    posicionesFrutas,
    conteoGranizados,
    posicionesGranizados,
    conteoEspeciales,
    posicionesEspeciales
  };
}

/**
 * Evalúa la matriz de 15 símbolos contra la escala de pagos
 * Retorna el nivel ganador más alto alcanzado y las celdas a resaltar
 * @param {Array<Array<Object>>} matriz
 */
export function evaluarTirada(matriz) {
  const analisis = analizarMatriz(matriz);
  const {
    conteo,
    posiciones,
    conteoFrutas,
    posicionesFrutas,
    conteoGranizados,
    posicionesGranizados,
    conteoEspeciales,
    posicionesEspeciales
  } = analisis;

  const buscarDefinicion = (idNivel) => NIVELES_PREMIO.find(n => n.id === idNivel);

  // 1. Nivel 13 (Jackpot): 5+ Sellos SYM_GRATIS
  if ((conteo['SYM_GRATIS'] || 0) >= 5) {
    return {
      premio: buscarDefinicion('JACKPOT'),
      celdasGanadoras: posiciones['SYM_GRATIS'] || [],
      simbolosInvolucrados: ['SYM_GRATIS'],
      cantidadAciertos: conteo['SYM_GRATIS']
    };
  }

  // 2. Nivel 12: 5 Cócteles Especiales
  if (conteoEspeciales >= 5) {
    return {
      premio: buscarDefinicion('NIVEL_12'),
      celdasGanadoras: posicionesEspeciales,
      simbolosInvolucrados: ['SYM_COCTEL_ROJO', 'SYM_VODKA'],
      cantidadAciertos: conteoEspeciales
    };
  }

  // 3. Nivel 11: 4 Cócteles Especiales
  if (conteoEspeciales >= 4) {
    return {
      premio: buscarDefinicion('NIVEL_11'),
      celdasGanadoras: posicionesEspeciales,
      simbolosInvolucrados: ['SYM_COCTEL_ROJO', 'SYM_VODKA'],
      cantidadAciertos: conteoEspeciales
    };
  }

  // 4. Nivel 10: 5 Granizados (Azul/Verde)
  if (conteoGranizados >= 5) {
    return {
      premio: buscarDefinicion('NIVEL_10'),
      celdasGanadoras: posicionesGranizados,
      simbolosInvolucrados: ['SYM_COPA_AZUL', 'SYM_COPA_VERDE'],
      cantidadAciertos: conteoGranizados
    };
  }

  // 5. Nivel 9: 5 Frutas (Limón/Naranja)
  if (conteoFrutas >= 5) {
    return {
      premio: buscarDefinicion('NIVEL_9'),
      celdasGanadoras: posicionesFrutas,
      simbolosInvolucrados: ['SYM_LIMON', 'SYM_NARANJA'],
      cantidadAciertos: conteoFrutas
    };
  }

  // 6. Nivel 8: 4 Granizados Estándar
  if (conteoGranizados >= 4) {
    return {
      premio: buscarDefinicion('NIVEL_8'),
      celdasGanadoras: posicionesGranizados,
      simbolosInvolucrados: ['SYM_COPA_AZUL', 'SYM_COPA_VERDE'],
      cantidadAciertos: conteoGranizados
    };
  }

  // 7. Bonus Alcohol: 3+ Símbolos SYM_BONUS
  if ((conteo['SYM_BONUS'] || 0) >= 3) {
    return {
      premio: buscarDefinicion('BONUS_ALCOHOL'),
      celdasGanadoras: posiciones['SYM_BONUS'] || [],
      simbolosInvolucrados: ['SYM_BONUS'],
      cantidadAciertos: conteo['SYM_BONUS']
    };
  }

  // 8. Nivel 7: 4 Frutas (Limón/Naranja)
  if (conteoFrutas >= 4) {
    return {
      premio: buscarDefinicion('NIVEL_7'),
      celdasGanadoras: posicionesFrutas,
      simbolosInvolucrados: ['SYM_LIMON', 'SYM_NARANJA'],
      cantidadAciertos: conteoFrutas
    };
  }

  // 9. Nivel 5: 3 Granizados Estándar
  if (conteoGranizados >= 3) {
    return {
      premio: buscarDefinicion('NIVEL_5'),
      celdasGanadoras: posicionesGranizados,
      simbolosInvolucrados: ['SYM_COPA_AZUL', 'SYM_COPA_VERDE'],
      cantidadAciertos: conteoGranizados
    };
  }

  // 10. Bonus 2x3: 3 Shots de Licor
  if ((conteo['SYM_SHOT'] || 0) >= 3) {
    return {
      premio: buscarDefinicion('BONUS_2X3'),
      celdasGanadoras: posiciones['SYM_SHOT'] || [],
      simbolosInvolucrados: ['SYM_SHOT'],
      cantidadAciertos: conteo['SYM_SHOT']
    };
  }

  // 11. Nivel 4: 3 Limones
  if ((conteo['SYM_LIMON'] || 0) >= 3) {
    return {
      premio: buscarDefinicion('NIVEL_4'),
      celdasGanadoras: posiciones['SYM_LIMON'] || [],
      simbolosInvolucrados: ['SYM_LIMON'],
      cantidadAciertos: conteo['SYM_LIMON']
    };
  }

  // 12. Nivel 3: 3 Naranjas
  if ((conteo['SYM_NARANJA'] || 0) >= 3) {
    return {
      premio: buscarDefinicion('NIVEL_3'),
      celdasGanadoras: posiciones['SYM_NARANJA'] || [],
      simbolosInvolucrados: ['SYM_NARANJA'],
      cantidadAciertos: conteo['SYM_NARANJA']
    };
  }

  // 13. Nivel 2: Pareja alta (2 especiales: Berries o Vodka)
  if (conteoEspeciales >= 2) {
    return {
      premio: buscarDefinicion('NIVEL_2'),
      celdasGanadoras: posicionesEspeciales,
      simbolosInvolucrados: ['SYM_COCTEL_ROJO', 'SYM_VODKA'],
      cantidadAciertos: conteoEspeciales
    };
  }

  // 14. Nivel 1: Pareja básica (2 frutas: Limón o Naranja)
  if (conteoFrutas >= 2) {
    return {
      premio: buscarDefinicion('NIVEL_1'),
      celdasGanadoras: posicionesFrutas,
      simbolosInvolucrados: ['SYM_LIMON', 'SYM_NARANJA'],
      cantidadAciertos: conteoFrutas
    };
  }

  // 15. Nivel 0 (Mojarro): Sin combinaciones válidas
  return {
    premio: buscarDefinicion('MOJARRO'),
    celdasGanadoras: [],
    simbolosInvolucrados: [],
    cantidadAciertos: 0
  };
}
