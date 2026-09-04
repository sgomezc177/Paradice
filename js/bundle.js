/**
 * Paradice - Hit Bar Premios Granizados
 * Bundle unificado con Gráficos Neón 3D, Escalada de Pirámide Alumbrando Peldaño a Peldaño,
 * Modal de Combinaciones Ganadoras y Música de Casino Lounge Suave.
 * Compatible con file:/// y servidores web (sin errores CORS)
 */

(function () {
  'use strict';

  // 1. CONFIGURACIÓN Y SÍMBOLOS
  const SIMBOLOS = [
    { id: 'SYM_LIMON', nombre: 'Limón', categoria: 'Fruta Base', icono: '🍋', peso: 30 },
    { id: 'SYM_NARANJA', nombre: 'Naranja', categoria: 'Fruta Base', icono: '🍊', peso: 30 },
    { id: 'SYM_COPA_AZUL', nombre: 'Granizado Azul', categoria: 'Bebida Estándar', icono: '🍧', peso: 24 },
    { id: 'SYM_COPA_VERDE', nombre: 'Granizado Menta', categoria: 'Bebida Estándar', icono: '🍹', peso: 22 },
    { id: 'SYM_SHOT', nombre: 'Shot Licor', categoria: 'Alcohol', icono: '🥃', peso: 18 },
    { id: 'SYM_COCTEL_ROJO', nombre: 'Frozen Berries', categoria: 'Especial', icono: '🍸', peso: 14 },
    { id: 'SYM_VODKA', nombre: 'Vodka Frozen', categoria: 'Premium', icono: '🍷', peso: 12 },
    { id: 'SYM_BONUS', nombre: 'Bonus Coctelera', categoria: 'Bonus Especial', icono: '🫗', peso: 9 },
    { id: 'SYM_GRATIS', nombre: 'Granizado Gratis', categoria: 'Jackpot', icono: '⭐', peso: 4 }
  ];

  const MAPA_SIMBOLOS = Object.fromEntries(SIMBOLOS.map(s => [s.id, s]));

  const NIVELES_PREMIO = [
    { nivel: 13, id: 'JACKPOT', codigo: '13:', beneficio: 'Granizado gratis', tipoFeedback: 'jackpot' },
    { nivel: 12, id: 'NIVEL_12', codigo: '12:', beneficio: '2 Granizados dobles x23k', tipoFeedback: 'win_big' },
    { nivel: 11, id: 'NIVEL_11', codigo: '11:', beneficio: 'Granizado doble x13k', tipoFeedback: 'win_big' },
    { nivel: 10, id: 'NIVEL_10', codigo: '10:', beneficio: '-1000', tipoFeedback: 'win_medium' },
    { nivel: 9, id: 'NIVEL_9', codigo: '9:', beneficio: '-900', tipoFeedback: 'win_medium' },
    { nivel: 8, id: 'NIVEL_8', codigo: '8:', beneficio: '-600', tipoFeedback: 'win_medium' },
    { nivel: 7.5, id: 'BONUS_ALCOHOL', codigo: 'Bonus', beneficio: 'Jeringa de alcohol', tipoFeedback: 'win_bonus' },
    { nivel: 7, id: 'NIVEL_7', codigo: '7:', beneficio: '-800', tipoFeedback: 'win_discount' },
    { nivel: 5, id: 'NIVEL_5', codigo: '5:', beneficio: '-600', tipoFeedback: 'win_discount' },
    { nivel: 4.5, id: 'BONUS_2X3', codigo: '2x3', beneficio: 'Pague 2 Lleve 3', tipoFeedback: 'win_bonus' },
    { nivel: 4, id: 'NIVEL_4', codigo: '4:', beneficio: '-500', tipoFeedback: 'win_discount' },
    { nivel: 3, id: 'NIVEL_3', codigo: '3:', beneficio: '-400', tipoFeedback: 'win_discount' },
    { nivel: 2, id: 'NIVEL_2', codigo: '2:', beneficio: '-300', tipoFeedback: 'win_discount' },
    { nivel: 1, id: 'NIVEL_1', codigo: '1:', beneficio: '-150', tipoFeedback: 'win_discount' },
    { nivel: 0, id: 'MOJARRO', codigo: '0:', beneficio: 'Sin premio (Mojarro)', tipoFeedback: 'blanqueo' }
  ];

  const ESTADOS_JUEGO = {
    IDLE: 'IDLE',
    SPINNING: 'SPINNING',
    STOPPING: 'STOPPING',
    RESOLVED: 'RESOLVED',
    LOCKED: 'LOCKED'
  };

  // 2. ICONOS VECTORIALES DE ALTA DEFINICIÓN FIELES A LA IMAGEN DE REFERENCIA
  const GRAFICOS_NEON_3D = {
    // 1. GRANIZADO GRATIS: Estrella 3D azul de 8 puntas con bisel blanco/cian, estrellitas rosadas, copa de frutos rojos y textos 3D
    SYM_GRATIS: `
      <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
        <defs>
          <radialGradient id="bStarGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="70%" stop-color="#0284c7"/>
            <stop offset="100%" stop-color="#075985"/>
          </radialGradient>
          <linearGradient id="bGoldTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fffbeb"/>
            <stop offset="25%" stop-color="#fef08a"/>
            <stop offset="60%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>
          <linearGradient id="bCyanTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="40%" stop-color="#bae6fd"/>
            <stop offset="80%" stop-color="#38bdf8"/>
            <stop offset="100%" stop-color="#0284c7"/>
          </linearGradient>
        </defs>
        <polygon points="12,18 14,23 19,23 15,26 17,31 12,28 7,31 9,26 5,23 10,23" fill="#f43f5e"/>
        <polygon points="86,14 88,18 92,18 89,21 90,25 86,22 82,25 83,21 80,18 84,18" fill="#f43f5e"/>
        <polygon points="90,75 91,78 94,78 92,80 93,83 90,81 87,83 88,80 86,78 89,78" fill="#38bdf8"/>
        <polygon points="50,2 62,25 88,14 77,41 100,53 76,66 85,93 59,83 50,100 41,83 15,93 24,66 0,53 23,41 12,14 38,25" 
                 fill="url(#bStarGrad)" stroke="#ffffff" stroke-width="2.2" stroke-linejoin="round"/>
        <polygon points="50,9 59,27 82,18 73,41 92,53 72,64 78,86 57,78 50,92 43,78 22,86 28,64 8,53 27,41 18,18 41,27" 
                 fill="none" stroke="#7dd3fc" stroke-width="1.2" opacity="0.9"/>
        <g transform="translate(35, 10) scale(0.30)">
          <path d="M12,28 L24,92 L76,92 L88,28 Z" fill="rgba(255,255,255,0.4)" stroke="#ffffff" stroke-width="4"/>
          <path d="M14,30 L26,90 L74,90 L86,30 Z" fill="#e11d48"/>
          <ellipse cx="50" cy="28" rx="36" ry="18" fill="#be123c"/>
          <path d="M14,28 Q50,-10 86,28 Z" fill="#f43f5e"/>
          <circle cx="50" cy="8" r="7" fill="#ffffff" opacity="0.85"/>
          <circle cx="36" cy="18" r="4" fill="#fb7185"/>
          <circle cx="64" cy="20" r="4" fill="#fb7185"/>
        </g>
        <text x="50" y="60" text-anchor="middle" font-family="system-ui, Arial Black, Impact, sans-serif" font-size="8.8" font-weight="900" fill="#03254c" stroke="#03254c" stroke-width="2.5">GRANIZADO</text>
        <text x="50" y="59" text-anchor="middle" font-family="system-ui, Arial Black, Impact, sans-serif" font-size="8.8" font-weight="900" fill="#ffffff" stroke="#ffffff" stroke-width="1">GRANIZADO</text>
        <text x="50" y="59" text-anchor="middle" font-family="system-ui, Arial Black, Impact, sans-serif" font-size="8.8" font-weight="900" fill="url(#bCyanTextGrad)">GRANIZADO</text>
        <text x="50" y="75" text-anchor="middle" font-family="system-ui, Arial Black, Impact, sans-serif" font-size="12.5" font-weight="900" fill="#451a03" stroke="#451a03" stroke-width="3">GRATIS</text>
        <text x="50" y="74" text-anchor="middle" font-family="system-ui, Arial Black, Impact, sans-serif" font-size="12.5" font-weight="900" fill="#ffffff" stroke="#ffffff" stroke-width="1.2">GRATIS</text>
        <text x="50" y="74" text-anchor="middle" font-family="system-ui, Arial Black, Impact, sans-serif" font-size="12.5" font-weight="900" fill="url(#bGoldTextGrad)">GRATIS</text>
      </svg>
    `,

    // 2. VODKA: Vaso cónico de cristal con granizado de arándanos/moras rosa-violeta, moras al pie y VODKA rotulado
    SYM_VODKA: `
      <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]">
        <defs>
          <radialGradient id="bVodkaSlush" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#f472b6"/>
            <stop offset="45%" stop-color="#d946ef"/>
            <stop offset="100%" stop-color="#701a75"/>
          </radialGradient>
        </defs>
        <path d="M26,30 Q50,15 74,30 L66,86 Q50,92 34,86 Z" fill="url(#bVodkaSlush)"/>
        <ellipse cx="50" cy="30" rx="24" ry="7" fill="#fbcfe8"/>
        <path d="M24,28 L33,88 Q50,94 67,88 L76,28 Q50,22 24,28 Z" fill="rgba(255,255,255,0.16)" stroke="#ffffff" stroke-width="1.8"/>
        <path d="M29,34 L35,82" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
        <polygon points="76,24 77.5,27 81,27 78,29 79,32 76,30 73,32 74,29 71,27 74.5,27" fill="#38bdf8"/>
        <circle cx="30" cy="85" r="5" fill="#4c0519" stroke="#be123c" stroke-width="0.8"/>
        <circle cx="28" cy="84" r="1.5" fill="#f43f5e"/>
        <circle cx="24" cy="88" r="4.5" fill="#581c87" stroke="#9333ea" stroke-width="0.8"/>
        <circle cx="23" cy="87" r="1.2" fill="#d8b4fe"/>
        <text x="50" y="62" text-anchor="middle" font-family="system-ui, Arial Black, Impact, sans-serif" font-size="10.5" font-weight="900" fill="#0369a1" letter-spacing="1">VODKA</text>
        <text x="50" y="61" text-anchor="middle" font-family="system-ui, Arial Black, Impact, sans-serif" font-size="10.5" font-weight="900" fill="#38bdf8" letter-spacing="1">VODKA</text>
      </svg>
    `,

    // 3. FROZEN BERRIES (COCTEL ROJO): Copa de granizado de frutos rojos silvestres con fresa y moras
    SYM_COCTEL_ROJO: `
      <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]">
        <defs>
          <radialGradient id="bBerriesGrad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#fb7185"/>
            <stop offset="50%" stop-color="#e11d48"/>
            <stop offset="100%" stop-color="#881337"/>
          </radialGradient>
        </defs>
        <path d="M26,30 Q50,15 74,30 L66,86 Q50,92 34,86 Z" fill="url(#bBerriesGrad)"/>
        <ellipse cx="50" cy="30" rx="24" ry="7" fill="#fecdd3"/>
        <path d="M24,28 L33,88 Q50,94 67,88 L76,28 Q50,22 24,28 Z" fill="rgba(255,255,255,0.18)" stroke="#ffffff" stroke-width="1.8"/>
        <path d="M29,34 L35,82" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
        <polygon points="30,22 31.5,25 35,25 32,27 33,30 30,28 27,30 28,27 25,25 28.5,25" fill="#f43f5e"/>
        <polygon points="36,25 37,27 39,27 37.5,28.5 38,30.5 36,29 34,30.5 34.5,28.5 33,27 35,27" fill="#fb7185"/>
        <circle cx="70" cy="85" r="5" fill="#881337" stroke="#f43f5e" stroke-width="0.8"/>
        <circle cx="76" cy="88" r="4" fill="#4a044e" stroke="#c084fc" stroke-width="0.8"/>
        <circle cx="69" cy="84" r="1.5" fill="#fda4af"/>
      </svg>
    `,

    // 4. GRANIZADO AZUL Y BICOLOR: Vaso alto con granizado azul arriba y jugo dorado abajo, con cerezas rojas
    SYM_COPA_AZUL: `
      <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]">
        <defs>
          <linearGradient id="bLayeredSlush" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#38bdf8"/>
            <stop offset="48%" stop-color="#0284c7"/>
            <stop offset="52%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#d97706"/>
          </linearGradient>
        </defs>
        <path d="M26,28 Q50,18 74,28 L66,86 Q50,92 34,86 Z" fill="url(#bLayeredSlush)"/>
        <ellipse cx="50" cy="28" rx="24" ry="7" fill="#bae6fd"/>
        <path d="M24,26 L33,88 Q50,94 67,88 L76,26 Q50,20 24,26 Z" fill="rgba(255,255,255,0.18)" stroke="#ffffff" stroke-width="1.8"/>
        <path d="M29,32 L35,82" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
        <circle cx="62" cy="22" r="6" fill="#dc2626" stroke="#ffffff" stroke-width="0.8"/>
        <circle cx="60" cy="20" r="1.8" fill="#ffffff"/>
        <path d="M62,16 Q67,8 72,12" fill="none" stroke="#22c55e" stroke-width="1.6" stroke-linecap="round"/>
        <circle cx="70" cy="85" r="5" fill="#b91c1c" stroke="#f87171" stroke-width="0.8"/>
        <circle cx="69" cy="84" r="1.5" fill="#ffffff"/>
        <path d="M70,80 Q74,74 72,70" fill="none" stroke="#22c55e" stroke-width="1.2"/>
      </svg>
    `,

    // 5. GRANIZADO VERDE: Vaso cónico de granizado verde lima con rodaja de lima cortada al pie
    SYM_COPA_VERDE: `
      <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_8px_rgba(74,222,128,0.7)]">
        <defs>
          <radialGradient id="bLimeSlushGrad" cx="40%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#86efac"/>
            <stop offset="50%" stop-color="#22c55e"/>
            <stop offset="100%" stop-color="#14532d"/>
          </radialGradient>
        </defs>
        <path d="M26,30 Q50,15 74,30 L66,86 Q50,92 34,86 Z" fill="url(#bLimeSlushGrad)"/>
        <ellipse cx="50" cy="30" rx="24" ry="7" fill="#bbf7d0"/>
        <path d="M24,28 L33,88 Q50,94 67,88 L76,28 Q50,22 24,28 Z" fill="rgba(255,255,255,0.18)" stroke="#ffffff" stroke-width="1.8"/>
        <path d="M29,34 L35,82" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
        <g transform="translate(62, 70) rotate(15)">
          <path d="M0,18 A16,16 0 0,0 28,18 Z" fill="#15803d" stroke="#ffffff" stroke-width="1"/>
          <path d="M2,18 A13,13 0 0,0 26,18 Z" fill="#86efac"/>
          <path d="M5,18 A10,10 0 0,0 23,18 Z" fill="#4ade80"/>
          <line x1="14" y1="18" x2="6" y2="12" stroke="#ffffff" stroke-width="0.8"/>
          <line x1="14" y1="18" x2="14" y2="8" stroke="#ffffff" stroke-width="0.8"/>
          <line x1="14" y1="18" x2="22" y2="12" stroke="#ffffff" stroke-width="0.8"/>
        </g>
      </svg>
    `,

    // 6. SHOT LICOR: Vaso de chupito con licor dorado, témpano/gema de hielo cristalina y rodaja de limón
    SYM_SHOT: `
      <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_8px_rgba(245,158,11,0.7)]">
        <defs>
          <linearGradient id="bTequilaGold" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#fef08a"/>
            <stop offset="40%" stop-color="#f59e0b"/>
            <stop offset="100%" stop-color="#b45309"/>
          </linearGradient>
        </defs>
        <path d="M27,45 L32,88 Q50,94 68,88 L73,45 Z" fill="url(#bTequilaGold)"/>
        <ellipse cx="50" cy="45" rx="23" ry="5" fill="#fde047"/>
        <path d="M31,80 L32,88 Q50,94 68,88 L69,80 Z" fill="rgba(255,255,255,0.6)"/>
        <polygon points="45,12 58,18 52,38 38,32" fill="#bae6fd" stroke="#ffffff" stroke-width="0.8"/>
        <polygon points="58,18 68,26 59,44 52,38" fill="#38bdf8" opacity="0.9"/>
        <polygon points="38,32 52,38 48,50 36,44" fill="#0284c7" opacity="0.85"/>
        <polygon points="45,12 38,32 36,44 32,24" fill="#e0f2fe" opacity="0.95"/>
        <path d="M25,40 L31,90 Q50,96 69,90 L75,40 Q50,34 25,40 Z" fill="rgba(255,255,255,0.18)" stroke="#ffffff" stroke-width="1.8"/>
        <path d="M29,46 L33,84" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
        <g transform="translate(56, 72) rotate(-15)">
          <path d="M0,18 A14,14 0 0,0 24,18 Z" fill="#eab308" stroke="#ffffff" stroke-width="0.8"/>
          <path d="M2,18 A11,11 0 0,0 22,18 Z" fill="#fef08a"/>
        </g>
      </svg>
    `,

    // 7. COCTELERA (BONUS): Shaker de acero inoxidable ultra-realista con acabado cromado y reflejos
    SYM_BONUS: `
      <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_8px_rgba(203,213,225,0.7)]">
        <defs>
          <linearGradient id="bChromeBody" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#64748b"/>
            <stop offset="20%" stop-color="#cbd5e1"/>
            <stop offset="45%" stop-color="#ffffff"/>
            <stop offset="70%" stop-color="#94a3b8"/>
            <stop offset="90%" stop-color="#cbd5e1"/>
            <stop offset="100%" stop-color="#475569"/>
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="14" rx="10" ry="3.5" fill="#f8fafc" stroke="#64748b" stroke-width="0.8"/>
        <path d="M40,14 L41,22 Q50,25 59,22 L60,14 Z" fill="url(#bChromeBody)" stroke="#64748b" stroke-width="0.8"/>
        <path d="M33,26 L67,26 L63,48 L37,48 Z" fill="url(#bChromeBody)" stroke="#64748b" stroke-width="0.8"/>
        <ellipse cx="50" cy="26" rx="17" ry="3" fill="#ffffff"/>
        <ellipse cx="50" cy="48" rx="13" ry="2.5" fill="#94a3b8"/>
        <path d="M37,48 L63,48 L58,88 Q50,91 42,88 L37,48 Z" fill="url(#bChromeBody)" stroke="#64748b" stroke-width="0.8"/>
        <ellipse cx="50" cy="88" rx="8" ry="2" fill="#334155"/>
        <line x1="48" y1="28" x2="47" y2="86" stroke="#ffffff" stroke-width="1.8" opacity="0.85"/>
        <line x1="56" y1="50" x2="54" y2="84" stroke="#ffffff" stroke-width="1" opacity="0.6"/>
      </svg>
    `,

    // 8. LIMÓN: Limón amarillo fresco ovalado con textura, relieve y hojas verdes
    SYM_LIMON: `
      <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_8px_rgba(234,179,8,0.7)]">
        <defs>
          <radialGradient id="bLemonReal" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#ffffff"/>
            <stop offset="30%" stop-color="#fef08a"/>
            <stop offset="70%" stop-color="#eab308"/>
            <stop offset="100%" stop-color="#a16207"/>
          </radialGradient>
        </defs>
        <path d="M52,24 Q72,6 84,18 Q74,36 54,27 Z" fill="#22c55e" stroke="#15803d" stroke-width="1.2"/>
        <path d="M54,24 Q70,18 80,18" fill="none" stroke="#86efac" stroke-width="1"/>
        <circle cx="50" cy="24" r="2.5" fill="#15803d"/>
        <path d="M22,54 Q15,42 26,32 Q46,18 74,36 Q88,48 78,65 Q58,84 28,70 Q17,64 22,54 Z" 
              fill="url(#bLemonReal)" stroke="#ca8a04" stroke-width="1.5"/>
        <ellipse cx="44" cy="38" rx="14" ry="7" transform="rotate(-22, 44, 38)" fill="#ffffff" opacity="0.65"/>
        <circle cx="38" cy="35" r="2.5" fill="#ffffff"/>
      </svg>
    `,

    // 9. NARANJA: Esfera naranja con textura porosa y hoja verde
    SYM_NARANJA: `
      <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]">
        <defs>
          <radialGradient id="bOrangeReal" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#ffedd5"/>
            <stop offset="35%" stop-color="#fb923c"/>
            <stop offset="75%" stop-color="#ea580c"/>
            <stop offset="100%" stop-color="#9a3412"/>
          </radialGradient>
        </defs>
        <circle cx="50" cy="52" r="34" fill="url(#bOrangeReal)" stroke="#ea580c" stroke-width="1.2"/>
        <circle cx="50" cy="18" r="3" fill="#166534"/>
        <path d="M50,18 Q66,6 74,14 Q68,26 50,19 Z" fill="#22c55e" stroke="#15803d" stroke-width="1"/>
        <ellipse cx="38" cy="38" rx="12" ry="6" transform="rotate(-30, 38, 38)" fill="#ffffff" opacity="0.65"/>
        <circle cx="34" cy="34" r="2.5" fill="#ffffff"/>
      </svg>
    `
  };

  // 3. MOTOR RNG
  function obtenerSimboloAleatorio() {
    const pesoTotal = SIMBOLOS.reduce((acc, s) => acc + s.peso, 0);
    let random = Math.random() * pesoTotal;

    for (const s of SIMBOLOS) {
      if (random < s.peso) return s;
      random -= s.peso;
    }
    return SIMBOLOS[0];
  }

  function generarMatrizTirada(columnas = 5, filas = 3) {
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

  function generarMatrizPrueba(tipo) {
    const c = 5;
    const f = 3;
    const matriz = [];

    switch (tipo) {
      case 'JACKPOT': {
        for (let col = 0; col < c; col++) {
          const fila = [];
          for (let fil = 0; fil < f; fil++) {
            fila.push(fil === 1 ? MAPA_SIMBOLOS['SYM_GRATIS'] : MAPA_SIMBOLOS['SYM_LIMON']);
          }
          matriz.push(fila);
        }
        return matriz;
      }
      case 'BONUS_ALCOHOL': {
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
      case 'HITBAR': {
        let gratisColocados = 0;
        for (let col = 0; col < c; col++) {
          const fila = [];
          for (let fil = 0; fil < f; fil++) {
            if (gratisColocados < 3 && fil === 1) {
              fila.push(MAPA_SIMBOLOS['SYM_GRATIS']);
              gratisColocados++;
            } else {
              fila.push(MAPA_SIMBOLOS['SYM_LIMON']);
            }
          }
          matriz.push(fila);
        }
        return matriz;
      }
      default:
        return generarMatrizTirada(c, f);
    }
  }

  // 4. EVALUADOR DE PREMIOS
  function analizarMatriz(matriz) {
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

  function evaluarTirada(matriz, jackpotCount = 0) {
    const {
      conteo,
      posiciones,
      conteoFrutas,
      posicionesFrutas,
      conteoGranizados,
      posicionesGranizados,
      conteoEspeciales,
      posicionesEspeciales
    } = analizarMatriz(matriz);

    const buscarDefinicion = (idNivel) => NIVELES_PREMIO.find(n => n.id === idNivel);

    // 0. TRIGGER HIT BAR (3 o más Granizados Gratis en pantalla)
    if ((conteo['SYM_GRATIS'] || 0) >= 3) {
      return {
        premio: {
          nivel: 13,
          id: 'HITBAR_TRIGGER',
          codigo: '⚡ HIT BAR',
          beneficio: '¡Desafío Hit Bar!',
          tipoFeedback: 'win_big'
        },
        celdasGanadoras: posiciones['SYM_GRATIS'] || [],
        cantidadAciertos: conteo['SYM_GRATIS'],
        esHitBarTrigger: true
      };
    }

    // 1. JACKPOT (Granizado Gratis) - Máximo 3 veces por máquina
    if ((conteo['SYM_GRATIS'] || 0) >= 5) {
      if (jackpotCount >= 3) {
        // Cupo de Jackpots agotado: Se sustituye por Nivel 12
        return {
          premio: buscarDefinicion('NIVEL_12'),
          celdasGanadoras: posiciones['SYM_GRATIS'] || [],
          cantidadAciertos: conteo['SYM_GRATIS'],
          jackpotCupoAlcanzado: true
        };
      }
      return { premio: buscarDefinicion('JACKPOT'), celdasGanadoras: posiciones['SYM_GRATIS'] || [], cantidadAciertos: conteo['SYM_GRATIS'] };
    }
    if (conteoEspeciales >= 5) {
      return { premio: buscarDefinicion('NIVEL_12'), celdasGanadoras: posicionesEspeciales, cantidadAciertos: conteoEspeciales };
    }
    if (conteoEspeciales >= 4) {
      return { premio: buscarDefinicion('NIVEL_11'), celdasGanadoras: posicionesEspeciales, cantidadAciertos: conteoEspeciales };
    }
    if (conteoGranizados >= 5) {
      return { premio: buscarDefinicion('NIVEL_10'), celdasGanadoras: posicionesGranizados, cantidadAciertos: conteoGranizados };
    }
    if (conteoFrutas >= 5) {
      return { premio: buscarDefinicion('NIVEL_9'), celdasGanadoras: posicionesFrutas, cantidadAciertos: conteoFrutas };
    }
    if (conteoGranizados >= 4) {
      return { premio: buscarDefinicion('NIVEL_8'), celdasGanadoras: posicionesGranizados, cantidadAciertos: conteoGranizados };
    }
    if ((conteo['SYM_BONUS'] || 0) >= 3) {
      return { premio: buscarDefinicion('BONUS_ALCOHOL'), celdasGanadoras: posiciones['SYM_BONUS'] || [], cantidadAciertos: conteo['SYM_BONUS'] };
    }
    if (conteoFrutas >= 4) {
      return { premio: buscarDefinicion('NIVEL_7'), celdasGanadoras: posicionesFrutas, cantidadAciertos: conteoFrutas };
    }
    if (conteoGranizados >= 3) {
      return { premio: buscarDefinicion('NIVEL_5'), celdasGanadoras: posicionesGranizados, cantidadAciertos: conteoGranizados };
    }
    if ((conteo['SYM_SHOT'] || 0) >= 3) {
      return { premio: buscarDefinicion('BONUS_2X3'), celdasGanadoras: posiciones['SYM_SHOT'] || [], cantidadAciertos: conteo['SYM_SHOT'] };
    }
    if ((conteo['SYM_LIMON'] || 0) >= 3) {
      return { premio: buscarDefinicion('NIVEL_4'), celdasGanadoras: posiciones['SYM_LIMON'] || [], cantidadAciertos: conteo['SYM_LIMON'] };
    }
    if ((conteo['SYM_NARANJA'] || 0) >= 3) {
      return { premio: buscarDefinicion('NIVEL_3'), celdasGanadoras: posiciones['SYM_NARANJA'] || [], cantidadAciertos: conteo['SYM_NARANJA'] };
    }
    if (conteoEspeciales >= 2) {
      return { premio: buscarDefinicion('NIVEL_2'), celdasGanadoras: posicionesEspeciales, cantidadAciertos: conteoEspeciales };
    }
    if (conteoGranizados >= 2) {
      return { premio: buscarDefinicion('NIVEL_2'), celdasGanadoras: posicionesGranizados, cantidadAciertos: conteoGranizados };
    }
    if (conteoFrutas >= 2) {
      return { premio: buscarDefinicion('NIVEL_1'), celdasGanadoras: posicionesFrutas, cantidadAciertos: conteoFrutas };
    }
    return { premio: buscarDefinicion('MOJARRO'), celdasGanadoras: [], cantidadAciertos: 0 };
  }

  // 5. GESTOR DE AUDIO CON PLAYLIST MP3 Y EFECTOS DE SONIDO ARCADE
  const PLAYLIST_MUSIC = [
    "001  Dr. Alban - It's My Life (Raggadag Remix).mp3",
    "002 la bouche - BE MY LOVER.mp3",
    "003 Haddaway - What Is Love.mp3",
    "004 D.J. Bobo - Everybody.mp3",
    "005 ace of base - All That She Wants.mp3",
    "006 Technotronic - Megamix.mp3",
    "007 jhon scatman - scatman.mp3",
    "008 max a million - fat boys.mp3",
    "009 Mr President - Cocojambo.mp3",
    "010 newton - streamline.mp3",
    "011 Real McCoy - Another Night.mp3",
    "012 tecnotronic - pum up the jam.mp3",
    "013 2unlimited - twilinght zone.mp3",
    "014 dr alban - away from home.mp3",
    "015 whigfield - BIG TIME.mp3",
    "016 outhere brothers - boom boom.mp3",
    "017 tonight is the night - la bouche.mp3",
    "018 whigfield - saturday night.mp3",
    "019 twenty 4 seven - slave two the music.mp3",
    "020 Reel-z real. - Like to move it.mp3",
    "021 20 Fingers Featuring Gillette - Short Dick Man.mp3",
    "022  NO MERCY - WHERE DO YOU GO.mp3",
    "023 Cappella - U Got 2 Let The Music.mp3",
    "024 corona - the rythm of the night.mp3",
    "025 dr alban - look whos talking.mp3",
    "026 francy vicent - frutti de la pasion.mp3",
    "027 ice mc - ITs a rainy day.mp3",
    "028 La Bouche - Sweet dreams.mp3",
    "029 n trance - stalying alive.mp3",
    "030 real macoy - one more time.mp3",
    "031 technotronic - move this.mp3",
    "032 brothers - cant help my self.mp3",
    "033 2 times -  ann lee.mp3",
    "034 ace of base - Beautiful Life.mp3",
    "035 CABALLERO - HYMN.mp3",
    "036 Corona - Baby Baby.mp3",
    "037 Da Hool - Met her at the love parade.mp3",
    "038 faithless - insomnia.mp3",
    "039 JOHN SCATMAN - cotton eye joe.mp3",
    "040 LAS FIERITAS - TIRA PA ARRIBA.mp3",
    "041 aqua - barbie girl.mp3",
    "042  2 Unlimited - No Limit.mp3",
    "043 AB Logic - The Hitman.mp3",
    "044 cherry cocoke - no hagas el indio haz el cheroquee.mp3",
    "045 Dj Bobo - Somebody Dance With Me.mp3",
    "046 dr alban - hello afrika.mp3",
    "047 man - down under.mp3",
    "048 NO MERCY - MISSING.mp3",
    "049 TALEESA - I FOUND LOVE.mp3",
    "050 Whigfield - Baby boy.mp3",
    "051tecnotrronic - get up.mp3",
    "052 2 BROTHERS ON THE 4TH FLOOR - DREAMS (WILL COME ALIVE).mp3",
    "053 2 Unlimited - Mortal Kombat.mp3",
    "054 ace of base - Don't Turn Around.mp3",
    "055 Cappella - Move It Up.mp3",
    "056 D.J. Bobo - There is a party (Megamix).mp3",
    "057 Double You - Run to me.mp3",
    "058 haddaway - rock my heart.mp3",
    "059 MAQUINA TOTAL 7 - MAQUINA TOTAL 7 - RADIO EDIT.mp3",
    "060 PIROPO - RUSSIANS.mp3",
    "061 playahitty - the summer is magic.mp3",
    "062 cartouche - feel the groove.mp3",
    "063 unlimited - get ready for this.mp3",
    "064 Aqua - Around the world.mp3",
    "065 DJ Bobo - Freedom.mp3",
    "066 dr alban - born in africa.mp3",
    "067 fun factory - automatic lover.mp3",
    "068 LOVERS - 7 SECONDS.mp3",
    "069 Technotronic - Everybody dance now.mp3",
    "070 think were alone now -.mp3",
    "071 Modern talking - Brother lovie.mp3",
    "072  -  ice - ice - ice baby.mp3",
    "073 dr alban - let the beat go on.mp3",
    "074 NEVADA - TAKE ME TO HEAVEN.mp3",
    "075 Whigfield - Think of you.mp3",
    "076 ya ki da - i saw you dancing.mp3",
    "077 ace of base - Happy Nation.mp3",
    "078 Captain Hollywood - More And More.mp3",
    "079 dj lorenzo - ritmo de la noche.mp3",
    "080 G.E.M. - I FELL YOU TONIGHT.mp3",
    "081 Black Box - Fantasy.mp3",
    "082 Twenty 4 Seven - Keep on tryn.mp3",
    "083  Gillette - Mr. Personality.mp3",
    "084  alice deejay - hit mix.mp3",
    "085 MAQUINA TOTAL 7 - MEGAMIX.mp3",
    "086 D.J. Dero - Showtime.mp3",
    "087 ace of base - Waiting for Magic.mp3",
    "088 dr alban - Mr. D.J..mp3",
    "089 Haddaway - Fly away.mp3",
    "090 sueño latino - viciosa.mp3",
    "091 THE OUTHERE BROTHERS - DON'T STOP.mp3",
    "092 dr alban - sing hallelujah.mp3",
    "093 DJ BOBO - Pray.mp3",
    "094 wont let you down 2 boys -.mp3",
    "095 whigfield - sexy eyes.mp3",
    "096    Technotronic - This Beat Is Tecnotronic.mp3",
    "097   Twenty 4 Seven - Slave To The Music.mp3",
    "098 Black Box - Strike It Up.mp3",
    "099 dr alban - hallelujah day.mp3",
    "100 ace of base - The Sign.mp3",
    "Abayarde.mp3",
    "Agarrate el pantalon.mp3",
    "Amigo.mp3",
    "Bonsai.mp3",
    "Caile.mp3",
    "Cambumbo.mp3",
    "Dutty Love [Ft Natti Natasha].mp3",
    "Mujeres.mp3",
    "Por que me tratas asi.mp3",
    "Tra Tra.mp3",
    "VEN BAILALO.mp3",
    "Vengan al baile.mp3",
    "Villana.mp3",
    "Volvere.mp3",
    "YO SOY TU MAESTRO.mp3",
    "Yo Te Buscaba.mp3"
  ];

  const WIN_TRACKS = [
    "092 dr alban - sing hallelujah.mp3",
    "069 Technotronic - Everybody dance now.mp3",
    "056 D.J. Bobo - There is a party (Megamix).mp3",
    "042  2 Unlimited - No Limit.mp3",
    "063 unlimited - get ready for this.mp3",
    "001  Dr. Alban - It's My Life (Raggadag Remix).mp3",
    "003 Haddaway - What Is Love.mp3",
    "VEN BAILALO.mp3"
  ];

  const HITBAR_TRACKS = [
    "042  2 Unlimited - No Limit.mp3",
    "063 unlimited - get ready for this.mp3",
    "012 tecnotronic - pum up the jam.mp3",
    "006 Technotronic - Megamix.mp3",
    "016 outhere brothers - boom boom.mp3",
    "091 THE OUTHERE BROTHERS - DON'T STOP.mp3",
    "085 MAQUINA TOTAL 7 - MEGAMIX.mp3",
    "020 Reel-z real. - Like to move it.mp3",
    "024 corona - the rythm of the night.mp3"
  ];

  class SoundManager {
    constructor() {
      this.ctx = null;
      this.sfxMuted = false;
      this.musicMuted = false;
      this.audioEl = new Audio();
      this.audioEl.volume = 0.5;
      this.currentTrackName = '';
      this.isWinPlaying = false;

      this.audioEl.addEventListener('ended', () => {
        this.isWinPlaying = false;
        if (!this.musicMuted) {
          this.playRandomTrack();
        }
      });

      this.spinInterval = null;
    }

    init() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
    }

    toggleSfx() {
      this.sfxMuted = !this.sfxMuted;
      return this.sfxMuted;
    }

    toggleMusic() {
      this.musicMuted = !this.musicMuted;
      if (this.musicMuted) {
        this.stopMusic();
      } else {
        this.startMusic();
      }
      return this.musicMuted;
    }

    isSfxMuted() { return this.sfxMuted; }
    isMusicMuted() { return this.musicMuted; }

    playRandomTrack() {
      if (this.musicMuted) return;
      const randomIndex = Math.floor(Math.random() * PLAYLIST_MUSIC.length);
      const track = PLAYLIST_MUSIC[randomIndex];
      this.currentTrackName = track;
      this.audioEl.src = 'music/' + encodeURIComponent(track);
      this.audioEl.volume = 0.5;
      this.audioEl.play().catch(e => {
        console.log('Interacción requerida para audio:', e);
      });
    }

    playWinSong() {
      if (this.musicMuted) return;
      this.isWinPlaying = true;
      const randomIndex = Math.floor(Math.random() * WIN_TRACKS.length);
      const track = WIN_TRACKS[randomIndex];
      this.currentTrackName = track;
      this.audioEl.src = 'music/' + encodeURIComponent(track);
      this.audioEl.volume = 0.7;
      this.audioEl.play().catch(e => {
        console.log('Error al reproducir canción de premio:', e);
      });
    }

    playHitBarSong() {
      if (this.musicMuted) return;
      this.init();
      this.isWinPlaying = true;
      const randomIndex = Math.floor(Math.random() * HITBAR_TRACKS.length);
      const track = HITBAR_TRACKS[randomIndex];
      this.currentTrackName = track;
      this.audioEl.src = 'music/' + encodeURIComponent(track);
      this.audioEl.volume = 0.85;
      this.audioEl.play().catch(e => {
        console.log('Error al reproducir canción de Hit Bar:', e);
      });
    }

    startMusic() {
      if (this.musicMuted) return;
      if (!this.audioEl.src || this.audioEl.paused) {
        this.playRandomTrack();
      } else {
        this.audioEl.play().catch(e => {});
      }
    }

    stopMusic() {
      this.audioEl.pause();
    }

    startSpin() {
      if (this.sfxMuted) return;
      this.init();
      this.stopSpin();
      let tickCount = 0;
      this.spinInterval = setInterval(() => {
        this.playSpinTick(tickCount);
        tickCount++;
      }, 90);
    }

    stopSpin() {
      if (this.spinInterval) {
        clearInterval(this.spinInterval);
        this.spinInterval = null;
      }
    }

    playSpinTick(index = 0) {
      if (this.sfxMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      const frec = 420 + ((index % 6) * 35);
      osc.frequency.setValueAtTime(frec, now);
      osc.frequency.exponentialRampToValueAtTime(frec * 0.5, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.045);
    }

    playReelStop(reelIndex) {
      if (this.sfxMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const baseFreq = 160 + (reelIndex * 28);
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.08);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    }

    playClimbTick(stepIndex, maxSteps = 9) {
      if (this.sfxMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const baseFreq = 300;
      const stepFreq = baseFreq + (stepIndex * 55);
      osc.frequency.setValueAtTime(stepFreq, now);
      osc.frequency.exponentialRampToValueAtTime(stepFreq * 1.08, now + 0.08);

      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.095);
    }

    playWinDiscount() {
      if (this.sfxMuted || !this.ctx) return;
      const notas = [523.25, 659.25, 783.99, 1046.50];
      const now = this.ctx.currentTime;
      notas.forEach((frec, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(frec, now + idx * 0.09);
        gain.gain.setValueAtTime(0.25, now + idx * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.09);
        osc.stop(now + idx * 0.09 + 0.19);
      });
    }

    playWinBonus() {
      if (this.sfxMuted || !this.ctx) return;
      const acordes = [
        [440.00, 554.37, 659.25],
        [587.33, 739.99, 880.00],
        [659.25, 830.61, 987.77]
      ];
      const now = this.ctx.currentTime;
      acordes.forEach((chord, cIdx) => {
        chord.forEach(frec => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(frec, now + cIdx * 0.14);
          gain.gain.setValueAtTime(0.18, now + cIdx * 0.14);
          gain.gain.exponentialRampToValueAtTime(0.001, now + cIdx * 0.14 + 0.28);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + cIdx * 0.14);
          osc.stop(now + cIdx * 0.14 + 0.29);
        });
      });
    }

    playJackpot() {
      if (this.sfxMuted || !this.ctx) return;
      const arpegio = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
      const now = this.ctx.currentTime;
      arpegio.forEach((frec, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(frec, now + idx * 0.07);
        gain.gain.setValueAtTime(0.2, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.36);
      });
    }

    playBlanqueo() {
      if (this.sfxMuted || !this.ctx) return;
      const notas = [350, 310, 270, 210];
      const now = this.ctx.currentTime;
      notas.forEach((frec, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(frec, now + idx * 0.12);
        gain.gain.setValueAtTime(0.14, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 0.15);
      });
    }

    playHitBarPerdida() {
      // 1. Detener la música acelerada de Hit Bar para dar paso al sonido de pérdida
      this.stopMusic();
      this.isWinPlaying = false;

      if (this.sfxMuted) return;
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Sonido de pérdida de arcade / sad trombone retro con notas descendentes
      const notas = [
        { freq: 196.00, time: 0.00, dur: 0.32 }, // G3
        { freq: 185.00, time: 0.32, dur: 0.32 }, // F#3
        { freq: 174.61, time: 0.64, dur: 0.32 }, // F3
        { freq: 155.56, time: 0.96, dur: 0.85, slideTo: 105.0 } // Eb3 con deslizamiento triste hacia abajo
      ];

      notas.forEach(n => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.freq, now + n.time);
        if (n.slideTo) {
          osc.frequency.exponentialRampToValueAtTime(n.slideTo, now + n.time + n.dur);
        }

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(750, now + n.time);
        filter.frequency.exponentialRampToValueAtTime(320, now + n.time + n.dur);

        gain.gain.setValueAtTime(0.25, now + n.time);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.time + n.dur);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + n.time);
        osc.stop(now + n.time + n.dur + 0.05);
      });

      // Golpe sordo de fallo / sub-bass
      const subOsc = this.ctx.createOscillator();
      const subGain = this.ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(115, now);
      subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.5);
      subGain.gain.setValueAtTime(0.32, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      subOsc.connect(subGain);
      subGain.connect(this.ctx.destination);
      subOsc.start(now);
      subOsc.stop(now + 0.51);
    }
  }

  const soundManager = new SoundManager();

  // 6. CONTROLADOR DE RODILLOS
  class ReelsController {
    constructor(containerElement, totalReels = 5, visibleRows = 3) {
      this.container = containerElement;
      this.totalReels = totalReels;
      this.visibleRows = visibleRows;
      this.reels = [];
      this.currentMatrix = [];
      this.isSpinning = false;
    }

    init(matrizInicial = null) {
      this.container.innerHTML = '';
      this.reels = [];

      if (!matrizInicial) {
        this.currentMatrix = [];
        for (let c = 0; c < this.totalReels; c++) {
          const col = [];
          for (let f = 0; f < this.visibleRows; f++) {
            col.push(obtenerSimboloAleatorio());
          }
          this.currentMatrix.push(col);
        }
      } else {
        this.currentMatrix = matrizInicial;
      }

      for (let c = 0; c < this.totalReels; c++) {
        const reelCol = document.createElement('div');
        reelCol.className = 'reel-column relative flex-1 h-full overflow-hidden bg-slate-950/60';
        reelCol.dataset.colIndex = c;

        const track = document.createElement('div');
        track.className = 'reel-track w-full flex flex-col items-center justify-start';
        reelCol.appendChild(track);

        this.reels.push({ columnEl: reelCol, trackEl: track });
        this.container.appendChild(reelCol);
        this.renderReelStatic(c, this.currentMatrix[c]);
      }
    }

    renderReelStatic(colIndex, symbols) {
      const track = this.reels[colIndex].trackEl;
      track.style.transition = 'none';
      track.style.transform = 'translateY(0px)';
      track.innerHTML = '';

      symbols.forEach((simbolo, filaIndex) => {
        const cell = this.createSymbolElement(simbolo, colIndex, filaIndex);
        track.appendChild(cell);
      });
    }

    createSymbolElement(simbolo, col, fila) {
      const cell = document.createElement('div');
      cell.className = 'symbol-cell w-full h-[68px] sm:h-[72px] p-0.5 flex items-center justify-center';
      cell.dataset.col = col;
      cell.dataset.fila = fila;
      cell.dataset.symbolId = simbolo.id;

      const box = document.createElement('div');
      box.className = 'symbol-box-inner w-full h-full rounded-2xl bg-gradient-to-b from-slate-800/80 via-slate-900/90 to-slate-950 border border-slate-600/40 flex flex-col items-center justify-center relative p-1 shadow-[0_4px_10px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] transition-all duration-200';

      const svgContent = GRAFICOS_NEON_3D[simbolo.id] || `<span class="text-3xl">${simbolo.icono}</span>`;
      box.innerHTML = svgContent;

      cell.appendChild(box);
      return cell;
    }

    async spinTo(targetMatrix) {
      this.isSpinning = true;
      this.clearHighlights();

      const firstCell = this.reels[0].trackEl.querySelector('.symbol-cell');
      const cellHeight = firstCell ? firstCell.getBoundingClientRect().height : 68;
      const stripLengths = [22, 28, 34, 44, 52];

      const reelPromises = this.reels.map((reel, c) => {
        return new Promise((resolve) => {
          const track = reel.trackEl;
          const currentSymbols = this.currentMatrix[c];
          const finalSymbols = targetMatrix[c];
          const totalItems = stripLengths[c];

          const stripSymbols = [];
          currentSymbols.forEach(s => stripSymbols.push(s));
          for (let i = 0; i < totalItems; i++) {
            stripSymbols.push(obtenerSimboloAleatorio());
          }
          finalSymbols.forEach(s => stripSymbols.push(s));

          track.style.transition = 'none';
          track.style.transform = 'translateY(0px)';
          track.innerHTML = '';

          stripSymbols.forEach((s, idx) => {
            const isFinal = idx >= stripSymbols.length - 3;
            const fila = isFinal ? idx - (stripSymbols.length - 3) : -1;
            const cell = this.createSymbolElement(s, c, fila);
            track.appendChild(cell);
          });

          track.classList.add('reel-spinning');
          const finalOffset = -(stripSymbols.length - 3) * cellHeight;
          const spinDuration = 1.6 + (c * 0.48);

          void track.offsetHeight;

          track.style.transition = `transform ${spinDuration}s cubic-bezier(0.12, 0.92, 0.22, 1.02)`;
          track.style.transform = `translateY(${finalOffset}px)`;

          const onTransitionEnd = (e) => {
            if (e.target !== track) return;
            track.removeEventListener('transitionend', onTransitionEnd);
            track.classList.remove('reel-spinning');
            soundManager.playReelStop(c);
            this.renderReelStatic(c, finalSymbols);
            resolve();
          };

          track.addEventListener('transitionend', onTransitionEnd);
        });
      });

      await Promise.all(reelPromises);
      this.currentMatrix = targetMatrix;
      this.isSpinning = false;
    }

    highlightWinningCells(celdas) {
      this.clearHighlights();
      celdas.forEach(({ col, fila }) => {
        if (col >= 0 && col < this.totalReels && fila >= 0 && fila < this.visibleRows) {
          const cell = this.reels[col].trackEl.querySelector(`[data-fila="${fila}"]`);
          if (cell) {
            cell.classList.add('symbol-winner');
          }
        }
      });
    }

    clearHighlights() {
      this.container.querySelectorAll('.symbol-winner, .reel-cell-hit-success').forEach(el => {
        el.classList.remove('symbol-winner', 'reel-cell-hit-success');
      });
    }

    startFastSpin() {
      this.isSpinning = true;
      this.clearHighlights();

      this.reels.forEach((reel, c) => {
        const track = reel.trackEl;
        track.style.transition = 'none';
        track.style.transform = 'translateY(0px)';
        track.innerHTML = '';

        // Generamos 20 celdas para un bucle continuo fluido e infinito
        for (let i = 0; i < 20; i++) {
          const sym = obtenerSimboloAleatorio();
          const cell = this.createSymbolElement(sym, c, -1);
          track.appendChild(cell);
        }

        track.classList.add('reel-fast-spin-active');
      });
    }

    stopFastSpin(targetMatrix = null) {
      this.reels.forEach((reel, c) => {
        const track = reel.trackEl;
        track.classList.remove('reel-fast-spin-active');
        track.style.transition = 'none';
        track.style.transform = 'translateY(0px)';
        track.innerHTML = '';
        const matrixToRender = targetMatrix || this.currentMatrix;
        if (matrixToRender && matrixToRender[c]) {
          this.renderReelStatic(c, matrixToRender[c]);
        }
      });
      this.isSpinning = false;
    }

    startHitBar5Reels(onReadyCallback) {
      this.isSpinning = true;
      this.clearHighlights();

      // Strips de 10 símbolos con sólo 1 SYM_GRATIS en el índice 2 (alta dificultad)
      this.hitBarStripSymbols = [
        'SYM_LIMON',       // 0
        'SYM_COPA_AZUL',   // 1
        'SYM_GRATIS',      // 2 <-- Objetivo principal
        'SYM_NARANJA',     // 3
        'SYM_VODKA',       // 4
        'SYM_COPA_VERDE',  // 5
        'SYM_BONUS',       // 6
        'SYM_LIMON',       // 7
        'SYM_COCTEL_ROJO', // 8
        'SYM_SHOT'         // 9
      ];

      const firstCell = this.reels[0].trackEl.querySelector('.symbol-cell');
      this.hitBarCellHeight = firstCell ? firstCell.getBoundingClientRect().height : 68;
      if (!this.hitBarCellHeight || this.hitBarCellHeight < 50) this.hitBarCellHeight = 68;

      // Fase 1: Velocidades ultra rápidas iniciales (-5%: ~36.1 a 49.4 px/frame a 60fps)
      // Fase 2: Transición a velocidad normal legible (-5%: ~8.08 a 10.45 px/frame)
      const fastSpeeds = [36.1, 39.9, 42.75, 45.6, 49.4];
      const normalSpeeds = [8.08, 8.74, 9.31, 9.88, 10.45];

      this.hitBarStates = this.reels.map((reel, c) => {
        const track = reel.trackEl;
        track.classList.remove('reel-fast-spin-active', 'reel-spinning');
        track.style.transition = 'none';
        track.style.transform = 'translateY(0px)';
        track.innerHTML = '';
        reel.columnEl.classList.remove('reel-column-active');

        // 3 repeticiones (30 celdas) para desplazamiento infinito ultra fluido
        for (let rep = 0; rep < 3; rep++) {
          this.hitBarStripSymbols.forEach((symId, sIdx) => {
            const symObj = MAPA_SIMBOLOS[symId] || { id: symId, icono: '🍧', nombre: symId };
            const cell = this.createSymbolElement(symObj, c, -1);
            cell.dataset.symbolId = symId;
            cell.dataset.symbolIndex = sIdx.toString();
            track.appendChild(cell);
          });
        }

        const initialOffset = Math.floor(Math.random() * (this.hitBarCellHeight * 10));
        track.style.transform = `translateY(-${initialOffset}px)`;

        return {
          col: c,
          reelEl: reel.columnEl,
          trackEl: track,
          offset: initialOffset,
          currentSpeed: fastSpeeds[c],
          targetSpeed: normalSpeeds[c],
          isSpinning: true,
          isStopped: false,
          isHit: false,
          centerSymbolId: null
        };
      });

      const startTime = Date.now();
      let hasSettledToNormal = false;
      let frameCount = 0;

      // Aplicar clase de giro rápido con desenfoque de movimiento en todos los carriles
      this.reels.forEach(reel => {
        reel.trackEl.classList.add('reel-fast-spin-active');
      });

      const animLoop = () => {
        if (!this.isSpinning) return;
        frameCount++;
        const totalHeight10 = this.hitBarCellHeight * 10;
        const elapsed = Date.now() - startTime;

        // Fase 1: Durante los primeros 1200ms (o ~70 frames) giran a máxima velocidad ("muy rápido")
        // Fase 2: A partir de 1200ms desaceleran gradualmente hasta llegar a velocidad normal
        if (elapsed > 1200 || frameCount > 70) {
          this.reels.forEach(reel => {
            reel.trackEl.classList.remove('reel-fast-spin-active');
          });

          this.hitBarStates.forEach(state => {
            if (state.currentSpeed > state.targetSpeed) {
              state.currentSpeed = Math.max(state.targetSpeed, state.currentSpeed * 0.92);
            }
          });

          if ((elapsed > 1800 || frameCount > 105) && !hasSettledToNormal) {
            hasSettledToNormal = true;
            this.hitBarStates.forEach(st => { st.currentSpeed = st.targetSpeed; });
            if (onReadyCallback) {
              onReadyCallback();
            }
          }
        }

        this.hitBarStates.forEach(state => {
          if (state.isSpinning) {
            state.offset = (state.offset + state.currentSpeed) % totalHeight10;
            state.trackEl.style.transform = `translateY(-${state.offset}px)`;
          }
        });

        this.hitBarAnimId = requestAnimationFrame(animLoop);
      };

      if (this.hitBarAnimId) cancelAnimationFrame(this.hitBarAnimId);
      this.hitBarAnimId = requestAnimationFrame(animLoop);
    }

    detenerHitBarReel(colIndex) {
      if (!this.hitBarStates || !this.hitBarStates[colIndex]) return null;
      const state = this.hitBarStates[colIndex];
      if (!state.isSpinning) return null;

      state.isSpinning = false;
      state.isStopped = true;

      const cellHeight = this.hitBarCellHeight || 68;
      const totalHeight10 = cellHeight * 10;

      // Calcular qué celda cae exactamente en la línea central (Row 1: Y = 68 a 136px, centro = 102px)
      const centerIndex = Math.floor((state.offset + (cellHeight * 1.5)) / cellHeight) % 10;
      const centerSymbolId = this.hitBarStripSymbols[centerIndex];
      const topSymbolId = this.hitBarStripSymbols[(centerIndex - 1 + 10) % 10];
      const bottomSymbolId = this.hitBarStripSymbols[(centerIndex + 1) % 10];

      state.centerSymbolId = centerSymbolId;

      // Snapping matemático exacto a la línea central
      let snappedOffset = (centerIndex * cellHeight) - cellHeight;
      if (snappedOffset < 0) snappedOffset += totalHeight10;
      state.offset = snappedOffset;
      state.trackEl.style.transform = `translateY(-${snappedOffset}px)`;

      // Actualizar matriz interna para renderizado y evaluación
      this.currentMatrix[colIndex] = [
        MAPA_SIMBOLOS[topSymbolId] || { id: topSymbolId, icono: '🍧', nombre: topSymbolId },
        MAPA_SIMBOLOS[centerSymbolId] || { id: centerSymbolId, icono: '⭐', nombre: centerSymbolId },
        MAPA_SIMBOLOS[bottomSymbolId] || { id: bottomSymbolId, icono: '🍧', nombre: bottomSymbolId }
      ];

      const isHit = (centerSymbolId === 'SYM_GRATIS');
      state.isHit = isHit;

      // Encontrar la celda central visual (en repetición 1: índice 10 + centerIndex)
      const allCells = state.trackEl.querySelectorAll('.symbol-cell');
      const centerCell = allCells[10 + centerIndex];

      if (isHit) {
        if (centerCell) {
          centerCell.classList.add('reel-cell-hit-success');
        }
        state.reelEl.classList.add('reel-column-active');
      } else {
        state.reelEl.classList.remove('reel-column-active');
      }

      return {
        col: colIndex,
        isHit: isHit,
        centerSymbolId: centerSymbolId,
        centerCell: centerCell
      };
    }

    setActiveHitBarColumn(colIndex) {
      if (!this.hitBarStates) return;
      this.hitBarStates.forEach((st, idx) => {
        if (idx === colIndex) {
          st.reelEl.classList.add('reel-column-active');
        } else if (!st.isHit) {
          st.reelEl.classList.remove('reel-column-active');
        }
      });
    }

    finalizarHitBar() {
      if (this.hitBarAnimId) {
        cancelAnimationFrame(this.hitBarAnimId);
        this.hitBarAnimId = null;
      }
      this.isSpinning = false;
      this.reels.forEach(reel => {
        reel.trackEl.classList.remove('reel-fast-spin-active');
        reel.columnEl.classList.remove('reel-column-active');
      });
      if (this.hitBarStates) {
        this.hitBarStates.forEach(st => {
          st.reelEl.classList.remove('reel-column-active');
        });
      }
    }
  }

  // 6.5 FUNCIONES DE SEGURIDAD Y TERMINAL PARA VERIFICACIÓN QR
  function getOrCreateTerminalId() {
    let id = localStorage.getItem('paradice_terminal_id');
    if (!id) {
      const hex = () => Math.floor(Math.random() * 256).toString(16).toUpperCase().padStart(2, '0');
      id = `MAC-${hex()}-${hex()}-${hex()}-${hex()}-${hex()}-${hex()}`;
      localStorage.setItem('paradice_terminal_id', id);
    }
    return id;
  }

  function getDeviceSummary() {
    const ua = navigator.userAgent;
    let os = 'Dispositivo';
    if (ua.indexOf('Win') !== -1) os = 'Windows PC';
    else if (ua.indexOf('Android') !== -1) os = 'Android';
    else if (ua.indexOf('iPhone') !== -1 || ua.indexOf('iPad') !== -1) os = 'iOS';
    else if (ua.indexOf('Mac') !== -1) os = 'MacOS';
    else if (ua.indexOf('Linux') !== -1) os = 'Linux';
    return os;
  }

  function calcularFirma(intento, premio, fecha, hora, terminal) {
    const secret = "PARADICE_SECRET_SLOT_KEY_2026";
    const raw = `${intento}|${premio}|${fecha}|${hora}|${terminal}|${secret}`;
    let hash1 = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash1 = ((hash1 << 5) - hash1) + char;
      hash1 = hash1 & hash1;
    }
    let hash2 = 5381;
    for (let i = 0; i < raw.length; i++) {
      hash2 = ((hash2 << 5) + hash2) + raw.charCodeAt(i);
      hash2 = hash2 & hash2;
    }
    return Math.abs(hash1).toString(16).toUpperCase().padStart(8, '0') +
           Math.abs(hash2).toString(16).toUpperCase().padStart(8, '0');
  }

  let cachedPublicIp = null;

  async function detectarIpPublica() {
    if (cachedPublicIp) return cachedPublicIp;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1800);
      const resp = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
      clearTimeout(timeoutId);
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.ip) {
          cachedPublicIp = data.ip;
          return cachedPublicIp;
        }
      }
    } catch (e) {
      // Entorno offline de kiosko
    }
    cachedPublicIp = '192.168.1.100';
    return cachedPublicIp;
  }

  function isTerminalBlocked() {
    const blockedFlag = localStorage.getItem('paradice_terminal_blocked');
    if (blockedFlag === 'true') return true;
    const blockedList = JSON.parse(localStorage.getItem('paradice_blocked_terminals') || '[]');
    const mac = getOrCreateTerminalId();
    return blockedList.includes(mac) || (cachedPublicIp && blockedList.includes(cachedPublicIp));
  }

  function blockTerminal(ip = null) {
    localStorage.setItem('paradice_terminal_blocked', 'true');
    const mac = getOrCreateTerminalId();
    let blockedList = JSON.parse(localStorage.getItem('paradice_blocked_terminals') || '[]');
    if (!blockedList.includes(mac)) blockedList.push(mac);
    if (ip && !blockedList.includes(ip)) blockedList.push(ip);
    localStorage.setItem('paradice_blocked_terminals', JSON.stringify(blockedList));
  }

  function unblockTerminal() {
    localStorage.removeItem('paradice_terminal_blocked');
    const mac = getOrCreateTerminalId();
    let blockedList = JSON.parse(localStorage.getItem('paradice_blocked_terminals') || '[]');
    blockedList = blockedList.filter(item => item !== mac && item !== cachedPublicIp);
    localStorage.setItem('paradice_blocked_terminals', JSON.stringify(blockedList));
  }

  // 7. APLICACIÓN PRINCIPAL CON ESCALADA DE LA PIRÁMIDE Y HIT BAR DIRECTO EN PANEL PRINCIPAL
  class GranizadosSlotApp {
    constructor() {
      this.estado = ESTADOS_JUEGO.IDLE;
      this.reelsController = null;
      this.ultimoResultado = null;
      this.premioActualEnMano = null;
      this.historialTiradas = [];
      this.confettiInstance = null;
      this.modoPruebaForzado = null;
      this.autoSpinActivo = false;

      // Sistema de 3 Vidas / Oportunidades persistente en localStorage
      const vidasGuardadas = localStorage.getItem('paradice_vidas_restantes');
      const intentoGuardado = localStorage.getItem('paradice_intento_actual');
      this.vidasRestantes = (vidasGuardadas !== null) ? parseInt(vidasGuardadas, 10) : 3;
      this.intentoActual = (intentoGuardado !== null) ? parseInt(intentoGuardado, 10) : 1;

      // Minijuego HIT BAR en el panel principal (5 rodillos interactivos)
      this.hitBarModoActivo = false;
      this.hitBarColumnaActual = 0;
      this.hitBarAciertos = 0;
      this.hitBarStoppingStep = false;
      this.hitBarResolverPromise = null;
      this.hitBarJugadoEnPartida = false;
      this.vidaHitBarMisterio = Math.floor(Math.random() * 3) + 1;

      // Control estricto de Jackpots (Máximo 3)
      this.jackpotWinsCount = parseInt(localStorage.getItem('paradice_jackpot_wins_count') || '0', 10);

      try {
        const guardado = localStorage.getItem('paradice_slot_historial');
        if (guardado) {
          this.historialTiradas = JSON.parse(guardado);
        }
      } catch (e) {
        this.historialTiradas = [];
      }
    }

    guardarVidas() {
      try {
        localStorage.setItem('paradice_vidas_restantes', this.vidasRestantes.toString());
        localStorage.setItem('paradice_intento_actual', this.intentoActual.toString());
      } catch (e) {}
    }

    dispararChispasHitBar() {
      if (!this.confettiInstance) return;

      // Chispas eléctricas brillantes y doradas de casino
      this.confettiInstance({
        particleCount: 70,
        startVelocity: 42,
        spread: 360,
        ticks: 85,
        origin: { x: 0.5, y: 0.55 },
        colors: ['#00f0ff', '#facc15', '#ffffff', '#fbbf24', '#38bdf8', '#ff007f'],
        shapes: ['circle', 'square'],
        scalar: 0.68,
        gravity: 1.15
      });

      setTimeout(() => {
        if (!this.confettiInstance) return;
        this.confettiInstance({
          particleCount: 40,
          angle: 55,
          spread: 50,
          startVelocity: 35,
          origin: { x: 0.12, y: 0.55 },
          colors: ['#facc15', '#00f0ff', '#ffffff'],
          scalar: 0.55
        });
        this.confettiInstance({
          particleCount: 40,
          angle: 125,
          spread: 50,
          startVelocity: 35,
          origin: { x: 0.88, y: 0.55 },
          colors: ['#facc15', '#00f0ff', '#ffffff'],
          scalar: 0.55
        });
      }, 200);
    }

    dispararChispasColumna(colIdx) {
      if (!this.confettiInstance) return;
      const xPos = 0.12 + (colIdx * 0.19);
      this.confettiInstance({
        particleCount: 30,
        spread: 75,
        startVelocity: 30,
        ticks: 60,
        origin: { x: xPos, y: 0.52 },
        colors: ['#facc15', '#ffffff', '#fbbf24', '#00f0ff'],
        scalar: 0.6,
        gravity: 1.25
      });
    }

    init() {
      this.cacheDOM();
      this.initConfetti();

      detectarIpPublica().then(() => {
        this.actualizarSupervisorUI();
      });

      this.reelsController = new ReelsController(this.dom.reelsContainer, 5, 3);
      this.reelsController.init();

      this.bindEvents();
      this.actualizarUIEstado();
      this.actualizarVidasUI();
      this.actualizarJackpotUI();
      this.actualizarHistorialUI();
      this.actualizarSupervisorUI();

      if (isTerminalBlocked() || this.vidasRestantes <= 0) {
        this.bloquearTerminalActual();
        this.mostrarBloqueoTerminal();
      }
    }

    cacheDOM() {
      this.dom = {
        appContainer: document.getElementById('app-container'),
        paytableTower: document.getElementById('paytable-tower'),
        reelsContainer: document.getElementById('reels-container'),
        spinBtn: document.getElementById('spin-btn'),
        spinBtnText: document.getElementById('spin-btn-text'),
        spinBtnIcon: document.getElementById('spin-btn-icon'),
        autoSpinBtn: document.getElementById('auto-spin-btn'),
        statusBadge: document.getElementById('status-badge'),
        statusTitle: document.getElementById('status-title'),
        muteBtn: document.getElementById('mute-btn'),
        muteIcon: document.getElementById('mute-icon'),
        musicBtn: document.getElementById('music-btn'),
        musicIcon: document.getElementById('music-icon'),
        supervisorBtn: document.getElementById('supervisor-btn'),
        supervisorModal: document.getElementById('supervisor-modal'),
        closeSupervisorBtn: document.getElementById('close-supervisor-modal'),
        supervisorResetBtn: document.getElementById('supervisor-reset-btn'),
        supervisorValidateBtn: document.getElementById('supervisor-validate-btn'),
        supervisorHistorialList: document.getElementById('supervisor-historial-list'),
        testJackpotBtn: document.getElementById('test-jackpot-btn'),
        testBonusBtn: document.getElementById('test-bonus-btn'),
        testMojarroBtn: document.getElementById('test-mojarro-btn'),
        clearHistoryBtn: document.getElementById('clear-history-btn'),
        // Minijuego Hit Bar en vivo (Panel Principal)
        hitbarBanner: document.getElementById('hitbar-live-banner'),
        hitbarTitle: document.getElementById('hitbar-live-title'),
        hitbarScore: document.getElementById('hitbar-live-score'),
        paylineGuide: document.getElementById('main-payline-guide'),
        testHitbarBtn: document.getElementById('test-hitbar-btn'),
        // Bloqueo de Terminal IP/MAC
        terminalBlockedModal: document.getElementById('terminal-blocked-modal'),
        blockedTerminalMac: document.getElementById('blocked-terminal-mac'),
        blockedTerminalIp: document.getElementById('blocked-terminal-ip'),
        unlockTerminalBtn: document.getElementById('unlock-terminal-btn'),
        supervisorTerminalStatus: document.getElementById('supervisor-terminal-status'),
        supervisorTerminalInfo: document.getElementById('supervisor-terminal-info'),
        supervisorStateBadge: document.getElementById('supervisor-state-badge'),
        supervisorResultSummary: document.getElementById('supervisor-result-summary'),
        // Indicador de Vidas
        life1: document.getElementById('life-1'),
        life2: document.getElementById('life-2'),
        life3: document.getElementById('life-3'),
        livesLabel: document.getElementById('lives-label'),
        // Combinaciones
        combinationsBtn: document.getElementById('combinations-btn'),
        combinationsModal: document.getElementById('combinations-modal'),
        closeCombinationsBtn: document.getElementById('close-combinations-modal'),
        closeCombinationsBtnBottom: document.getElementById('close-combinations-btn-bottom'),
        // Popout Ganador 3D Flip y QR
        winPopoutModal: document.getElementById('win-popout-modal'),
        flipCardInner: document.getElementById('flip-card-inner'),
        winPopoutIcon: document.getElementById('win-popout-icon'),
        winPopoutTitle: document.getElementById('win-popout-title'),
        winPopoutTier: document.getElementById('win-popout-tier'),
        winPopoutPrize: document.getElementById('win-popout-prize'),
        winPopoutAttemptInfo: document.getElementById('win-popout-attempt-info'),
        claimPrizeBtn: document.getElementById('claim-prize-btn'),
        retrySpinBtn: document.getElementById('retry-spin-btn'),
        closeWinPopoutBtn: document.getElementById('close-win-popout-btn'),
        qrcodeBox: document.getElementById('qrcode-box'),
        qrSummaryPrize: document.getElementById('qr-summary-prize'),
        qrSummaryAttempt: document.getElementById('qr-summary-attempt'),
        qrSummaryTime: document.getElementById('qr-summary-time'),
        qrSummaryTerminal: document.getElementById('qr-summary-terminal'),
        qrDirectLink: document.getElementById('qr-direct-link'),
        // Supervisor Jackpot Quota
        jackpotCountDisplay: document.getElementById('jackpot-count-display'),
        resetJackpotBtn: document.getElementById('reset-jackpot-btn')
      };
    }

    initConfetti() {
      if (window.confetti) {
        this.confettiInstance = window.confetti;
      }
    }

    bindEvents() {
      this.dom.spinBtn.addEventListener('click', () => {
        this.handleSpinClick();
      });

      if (this.dom.musicBtn) {
        this.dom.musicBtn.addEventListener('click', () => {
          const isMuted = soundManager.toggleMusic();
          this.dom.musicIcon.textContent = isMuted ? '🔇' : '🎵';
          this.dom.musicBtn.classList.toggle('opacity-50', isMuted);
        });
      }

      this.dom.muteBtn.addEventListener('click', () => {
        const isMuted = soundManager.toggleSfx();
        this.dom.muteIcon.textContent = isMuted ? '🔇' : '🔊';
      });

      if (this.dom.autoSpinBtn) {
        this.dom.autoSpinBtn.addEventListener('click', () => {
          this.toggleAutoSpin();
        });
      }

      const betBtn = document.getElementById('bet-btn');
      if (betBtn) {
        betBtn.addEventListener('click', () => {
          soundManager.playClimbTick(4, 9);
          if (this.dom.statusTitle && this.estado === ESTADOS_JUEGO.IDLE) {
            const prev = this.dom.statusTitle.textContent;
            this.dom.statusTitle.textContent = 'Apuesta: 1 Crédito ($1.000 COP)';
            setTimeout(() => {
              if (this.estado === ESTADOS_JUEGO.IDLE) {
                this.dom.statusTitle.textContent = prev;
              }
            }, 1400);
          }
        });
      }

      // Modal de Combinaciones
      if (this.dom.combinationsBtn) {
        this.dom.combinationsBtn.addEventListener('click', () => {
          this.dom.combinationsModal.classList.remove('hidden');
        });
      }
      if (this.dom.closeCombinationsBtn) {
        this.dom.closeCombinationsBtn.addEventListener('click', () => {
          this.dom.combinationsModal.classList.add('hidden');
        });
      }
      if (this.dom.closeCombinationsBtnBottom) {
        this.dom.closeCombinationsBtnBottom.addEventListener('click', () => {
          this.dom.combinationsModal.classList.add('hidden');
        });
      }

      // Popout Ganador 3D y Decisiones
      if (this.dom.claimPrizeBtn) {
        this.dom.claimPrizeBtn.addEventListener('click', () => {
          this.reclamarPremioYVoltearQR();
        });
      }

      if (this.dom.retrySpinBtn) {
        this.dom.retrySpinBtn.addEventListener('click', () => {
          this.descartarYVolverATirar();
        });
      }

      if (this.dom.closeWinPopoutBtn) {
        this.dom.closeWinPopoutBtn.addEventListener('click', () => {
          this.reiniciarNuevaPartida();
        });
      }

      if (this.dom.resetJackpotBtn) {
        this.dom.resetJackpotBtn.addEventListener('click', () => {
          this.jackpotWinsCount = 0;
          try {
            localStorage.setItem('paradice_jackpot_wins_count', '0');
          } catch (e) {}
          this.actualizarJackpotUI();
        });
      }

      this.dom.supervisorBtn.addEventListener('click', () => {
        this.abrirModalSupervisor();
      });

      this.dom.closeSupervisorBtn.addEventListener('click', () => {
        this.cerrarModalSupervisor();
      });

      if (this.dom.supervisorValidateBtn) {
        this.dom.supervisorValidateBtn.addEventListener('click', () => {
          this.supervisorValidarPremio();
        });
      }

      if (this.dom.supervisorResetBtn) {
        this.dom.supervisorResetBtn.addEventListener('click', () => {
          this.supervisorReiniciar();
        });
      }

      if (this.dom.testJackpotBtn) {
        this.dom.testJackpotBtn.addEventListener('click', () => {
          this.modoPruebaForzado = 'JACKPOT';
          this.cerrarModalSupervisor();
          this.ejecutarGiro();
        });
      }

      if (this.dom.testBonusBtn) {
        this.dom.testBonusBtn.addEventListener('click', () => {
          this.modoPruebaForzado = 'BONUS_ALCOHOL';
          this.cerrarModalSupervisor();
          this.ejecutarGiro();
        });
      }

      if (this.dom.testMojarroBtn) {
        this.dom.testMojarroBtn.addEventListener('click', () => {
          this.modoPruebaForzado = 'MOJARRO';
          this.cerrarModalSupervisor();
          this.ejecutarGiro();
        });
      }

      if (this.dom.testHitbarBtn) {
        this.dom.testHitbarBtn.addEventListener('click', () => {
          this.modoPruebaForzado = 'HITBAR';
          this.cerrarModalSupervisor();
          this.ejecutarGiro();
        });
      }

      if (this.dom.unlockTerminalBtn) {
        this.dom.unlockTerminalBtn.addEventListener('click', () => {
          this.desbloquearTerminal();
        });
      }

      if (this.dom.clearHistoryBtn) {
        this.dom.clearHistoryBtn.addEventListener('click', () => {
          this.historialTiradas = [];
          try {
            localStorage.removeItem('paradice_slot_historial');
          } catch (e) {}
          this.actualizarHistorialUI();
        });
      }

      const unlockAudioAndStartMusic = () => {
        soundManager.init();
        if (!soundManager.isMusicMuted()) {
          soundManager.startMusic();
        }
        window.removeEventListener('click', unlockAudioAndStartMusic);
        window.removeEventListener('touchstart', unlockAudioAndStartMusic);
      };
      window.addEventListener('click', unlockAudioAndStartMusic);
      window.addEventListener('touchstart', unlockAudioAndStartMusic);

      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space') {
          e.preventDefault();
          this.handleSpinClick();
        }
      });
    }

    toggleAutoSpin() {
      this.autoSpinActivo = !this.autoSpinActivo;
      if (this.dom.autoSpinBtn) {
        if (this.autoSpinActivo) {
          this.dom.autoSpinBtn.classList.add('bg-cyan-600', 'text-white', 'border-cyan-300');
          this.dom.autoSpinBtn.innerHTML = '<span>⏹️</span> Parar';
          if (this.estado === ESTADOS_JUEGO.IDLE) {
            this.ejecutarGiro();
          }
        } else {
          this.dom.autoSpinBtn.classList.remove('bg-cyan-600', 'text-white', 'border-cyan-300');
          this.dom.autoSpinBtn.innerHTML = '<span>⚡</span> Auto';
        }
      }
    }

    async handleSpinClick() {
      if (this.hitBarModoActivo) {
        this.avanzarHitBarPaso();
        return;
      }
      if (isTerminalBlocked()) {
        this.mostrarBloqueoTerminal();
        return;
      }
      if (this.estado !== ESTADOS_JUEGO.IDLE) {
        if (this.estado === ESTADOS_JUEGO.LOCKED) {
          this.mostrarAlertaSupervisorRequerido();
        }
        return;
      }
      this.ejecutarGiro();
    }

    iniciarHitBarEnPanelPrincipal() {
      this.hitBarModoActivo = true;
      this.hitBarColumnaActual = 0;
      this.hitBarAciertos = 0;
      this.hitBarStoppingStep = true;

      // 1. Cambio de canción a Hit Bar (eurodance de alta energía)
      soundManager.playHitBarSong();

      // 2. Generar chispas y efecto de premio inmediato
      this.dispararChispasHitBar();

      // 3. Mostrar banner en vivo sobre las ruletas con animación de aceleración
      if (this.dom.hitbarBanner) {
        this.dom.hitbarBanner.classList.remove('hidden');
      }
      if (this.dom.hitbarTitle) {
        this.dom.hitbarTitle.innerHTML = '⚡ <span class="text-amber-300 font-extrabold animate-pulse">¡¡HIT BAR ACTIVADO!! ¡MÁXIMA VELOCIDAD! ⚡</span>';
      }
      if (this.dom.hitbarScore) {
        this.dom.hitbarScore.textContent = '0 / 5 Acertados';
      }

      // 4. Encender guía dorada central
      if (this.dom.paylineGuide) {
        this.dom.paylineGuide.classList.add('hitbar-payline-active');
      }

      // 5. Botón en estado preparatorio mientras se produce la animación rápida inicial
      if (this.dom.spinBtn) {
        this.dom.spinBtn.disabled = true;
        this.dom.spinBtn.classList.add('spin-btn-hitbar-mode');
      }
      if (this.dom.spinBtnText) {
        this.dom.spinBtnText.textContent = 'PREPÁRATE';
      }
      if (this.dom.spinBtnIcon) {
        this.dom.spinBtnIcon.classList.add('animate-spin');
        this.dom.spinBtnIcon.textContent = '⚡';
      }

      // 6. Animación de velocidad: primero muy rápido y luego desacelera a velocidad normal
      this.reelsController.startHitBar5Reels(() => {
        // Al desacelerar y llegar a velocidad normal:
        this.hitBarStoppingStep = false;
        if (this.dom.spinBtn) {
          this.dom.spinBtn.disabled = false;
        }
        if (this.dom.spinBtnText) {
          this.dom.spinBtnText.textContent = 'DETENER 1';
        }
        if (this.dom.spinBtnIcon) {
          this.dom.spinBtnIcon.classList.remove('animate-spin');
          this.dom.spinBtnIcon.textContent = '🛑';
        }
        if (this.dom.hitbarTitle) {
          this.dom.hitbarTitle.innerHTML = '⚡ <span>HIT BAR: ¡DETÉN LA CASILLA 1 DE 5!</span>';
        }
        this.reelsController.setActiveHitBarColumn(0);
      });

      return new Promise((resolve) => {
        this.hitBarResolverPromise = resolve;
      });
    }

    avanzarHitBarPaso() {
      if (!this.hitBarModoActivo || this.hitBarStoppingStep || this.hitBarColumnaActual >= 5) {
        return;
      }

      this.hitBarStoppingStep = true;
      const colActual = this.hitBarColumnaActual;

      // Detener el rodillo actual y calcular alineación
      const stopResult = this.reelsController.detenerHitBarReel(colActual);
      if (!stopResult) {
        this.hitBarStoppingStep = false;
        return;
      }

      if (stopResult.isHit) {
        this.hitBarAciertos++;
        this.dispararChispasColumna(colActual);
        soundManager.playClimbTick(7, 9);
        if (this.dom.hitbarTitle) {
          this.dom.hitbarTitle.innerHTML = `⭐ <span class="text-amber-300 animate-pulse">¡ACERTASTE CASILLA ${colActual + 1}! ⭐</span>`;
        }
      } else {
        soundManager.playBlanqueo();
        if (this.dom.hitbarTitle) {
          this.dom.hitbarTitle.innerHTML = `❌ <span class="text-rose-400">Casilla ${colActual + 1} no cayó en granizado</span>`;
        }
      }

      if (this.dom.hitbarScore) {
        this.dom.hitbarScore.textContent = `${this.hitBarAciertos} / 5 Acertados`;
      }

      // Pausa táctil para asimilar la parada y activar la siguiente casilla
      setTimeout(() => {
        this.hitBarColumnaActual++;

        if (this.hitBarColumnaActual < 5) {
          const siguienteCol = this.hitBarColumnaActual;
          this.reelsController.setActiveHitBarColumn(siguienteCol);

          if (this.dom.hitbarTitle) {
            this.dom.hitbarTitle.innerHTML = `⚡ <span>HIT BAR: ¡DETÉN LA CASILLA ${siguienteCol + 1} DE 5!</span>`;
          }
          if (this.dom.spinBtnText) {
            this.dom.spinBtnText.textContent = `DETENER ${siguienteCol + 1}`;
          }
          this.hitBarStoppingStep = false;
        } else {
          this.concluirHitBar();
        }
      }, 420);
    }

    async concluirHitBar() {
      if (this.dom.spinBtn) {
        this.dom.spinBtn.disabled = true;
      }
      if (this.dom.spinBtnText) {
        this.dom.spinBtnText.textContent = 'PROCESANDO';
      }
      if (this.dom.spinBtnIcon) {
        this.dom.spinBtnIcon.textContent = '⏳';
      }

      const aciertos = this.hitBarAciertos;
      let premioId = 'MOJARRO';

      if (aciertos === 5) {
        premioId = 'JACKPOT';
        if (this.dom.hitbarTitle) {
          this.dom.hitbarTitle.innerHTML = '⭐ <span class="text-amber-300 font-extrabold animate-bounce">¡¡¡5 DE 5 ALINEADOS!!! ¡¡¡GRANIZADO GRATIS (JACKPOT)!!! ⭐⭐⭐</span>';
        }
        soundManager.playHitBarSong();
        this.dispararConfeti(true);
      } else if (aciertos === 4) {
        premioId = 'NIVEL_11';
        if (this.dom.hitbarTitle) {
          this.dom.hitbarTitle.innerHTML = '🍸 <span class="text-sky-300 font-extrabold animate-pulse">¡4 DE 5! ¡GRANIZADO DOBLE x13K! 🍸</span>';
        }
        soundManager.playWinSong();
        this.dispararConfeti(false);
      } else if (aciertos === 3) {
        premioId = 'NIVEL_10';
        if (this.dom.hitbarTitle) {
          this.dom.hitbarTitle.innerHTML = '🍧 <span class="text-yellow-300 font-extrabold">¡3 DE 5! ¡DESCUENTO -$1.000 COP! 🍧</span>';
        }
        soundManager.playWinSong();
        this.dispararConfeti(false);
      } else if (aciertos === 2) {
        premioId = 'NIVEL_2';
        if (this.dom.hitbarTitle) {
          this.dom.hitbarTitle.innerHTML = '🍹 <span class="text-emerald-300 font-extrabold">¡2 DE 5! ¡DESCUENTO -$300 COP! 🍹</span>';
        }
        soundManager.playWinSong();
      } else if (aciertos === 1) {
        premioId = 'NIVEL_1';
        if (this.dom.hitbarTitle) {
          this.dom.hitbarTitle.innerHTML = '🍋 <span class="text-amber-200 font-bold">¡1 DE 5! ¡DESCUENTO -$150 COP! 🍋</span>';
        }
        soundManager.playWinSong();
      } else {
        premioId = 'MOJARRO';
        if (this.dom.hitbarTitle) {
          this.dom.hitbarTitle.innerHTML = '❌ <span class="text-rose-400 font-extrabold animate-pulse">¡0 DE 5 ACERTADOS! SIN COMBINACIÓN GANADORA ❌</span>';
        }
        soundManager.playHitBarPerdida();
      }

      if (premioId === 'JACKPOT' && this.jackpotWinsCount >= 3) {
        premioId = 'NIVEL_12';
      }

      const premioObj = NIVELES_PREMIO.find(n => n.id === premioId);

      // Pausa para apreciar el resultado completo (sonido de pérdida o victoria)
      const duracionPausa = (aciertos === 0) ? 2000 : 1600;
      await new Promise(r => setTimeout(r, duracionPausa));

      // Desactivar modo Hit Bar
      this.hitBarModoActivo = false;
      this.reelsController.finalizarHitBar();

      if (this.dom.hitbarBanner) {
        this.dom.hitbarBanner.classList.add('hidden');
      }
      if (this.dom.paylineGuide) {
        this.dom.paylineGuide.classList.remove('hitbar-payline-active');
      }

      // Devolver botón de girar a su estado original
      if (this.dom.spinBtn) {
        this.dom.spinBtn.classList.remove('spin-btn-hitbar-mode');
        this.dom.spinBtn.disabled = false;
      }
      if (this.dom.spinBtnText) {
        this.dom.spinBtnText.textContent = 'GIRAR';
      }
      if (this.dom.spinBtnIcon) {
        this.dom.spinBtnIcon.textContent = '🔄';
      }

      // Celdas ganadoras en la payline central
      const celdasGanadoras = [];
      if (this.reelsController.currentMatrix) {
        this.reelsController.currentMatrix.forEach((colSyms, colIdx) => {
          if (colSyms[1] && colSyms[1].id === 'SYM_GRATIS') {
            celdasGanadoras.push({ col: colIdx, fila: 1 });
          }
        });
      }

      const resultadoFinal = {
        premio: premioObj,
        cantidadAciertos: aciertos,
        esHitBar: true,
        celdasGanadoras: celdasGanadoras
      };

      if (this.hitBarResolverPromise) {
        this.hitBarResolverPromise(resultadoFinal);
        this.hitBarResolverPromise = null;
      }
    }

    async ejecutarGiro() {
      this.estado = ESTADOS_JUEGO.SPINNING;
      this.limpiarResaltadoTorre();
      this.actualizarUIEstado();

      soundManager.startSpin();

      let matrizDestino;
      if (this.modoPruebaForzado) {
        matrizDestino = generarMatrizPrueba(this.modoPruebaForzado);
        this.modoPruebaForzado = null;
      } else {
        matrizDestino = generarMatrizTirada(5, 3);
      }

      this.estado = ESTADOS_JUEGO.STOPPING;
      await this.reelsController.spinTo(matrizDestino);
      soundManager.stopSpin();

      // Suspense y adrenalina: breve pausa antes de iniciar la escalada
      await new Promise(r => setTimeout(r, 450));

      this.estado = ESTADOS_JUEGO.RESOLVED;
      let resultado = evaluarTirada(matrizDestino, this.jackpotWinsCount);

      if (resultado.celdasGanadoras && resultado.celdasGanadoras.length > 0) {
        this.reelsController.highlightWinningCells(resultado.celdasGanadoras);
      }

      // Activación del MINIJUEGO HIT BAR EN PANEL PRINCIPAL:
      // Se activa si aparecen 3+ Granizados Gratis O de manera aleatoria/misterio en una de las vidas
      let dispararHitBar = false;
      if (resultado.esHitBarTrigger) {
        dispararHitBar = true;
      } else if (!this.hitBarJugadoEnPartida && (this.intentoActual === this.vidaHitBarMisterio || (this.intentoActual === 3 && Math.random() < 0.75))) {
        dispararHitBar = true;
      }

      if (dispararHitBar) {
        this.hitBarJugadoEnPartida = true;
        if (this.dom.statusTitle) {
          this.dom.statusTitle.textContent = '⚡ ¡HIT BAR ACTIVADO! ¡GIRANDO A MÁXIMA VELOCIDAD! ⚡';
        }
        const resultadoHitBar = await this.iniciarHitBarEnPanelPrincipal();
        resultado = resultadoHitBar;
      }

      this.ultimoResultado = resultado;

      // Animación de escalada de la pirámide alumbrando peldaño por peldaño
      await this.animarEscaladaTorre(resultado);

      this.ejecutarFeedback(resultado);
      this.registrarTiradaEnHistorial(resultado);

      if (resultado.premio.id === 'JACKPOT') {
        this.jackpotWinsCount++;
        try {
          localStorage.setItem('paradice_jackpot_wins_count', this.jackpotWinsCount.toString());
        } catch (e) {}
        this.actualizarJackpotUI();
      }

      // Si ganó un premio (distinto de MOJARRO), cambiar a canción de premio y mostrar popout interactivo con decisión
      if (resultado.premio.id !== 'MOJARRO') {
        soundManager.playWinSong();
        this.mostrarPopoutConDecision(resultado);
        this.estado = ESTADOS_JUEGO.LOCKED;
        this.actualizarUIEstado();
      } else {
        // MOJARRO (Sin premio)
        this.vidasRestantes--;
        this.intentoActual++;
        this.guardarVidas();
        this.actualizarVidasUI();

        if (this.vidasRestantes > 0) {
          if (this.dom.statusTitle) {
            this.dom.statusTitle.textContent = `Sin suerte. Te quedan ${this.vidasRestantes} ${this.vidasRestantes === 1 ? 'intento' : 'intentos'}.`;
          }
          setTimeout(() => {
            this.estado = ESTADOS_JUEGO.IDLE;
            this.limpiarResaltadoTorre();
            this.reelsController.clearHighlights();
            this.actualizarUIEstado();
            soundManager.startMusic();
          }, 1400);
        } else {
          // Sin intentos restantes: Bloqueo de terminal tras agotar 3 vidas
          if (this.dom.statusTitle) {
            this.dom.statusTitle.textContent = '¡Sin más intentos! Has agotado tus 3 vidas.';
          }
          this.bloquearTerminalActual();
          setTimeout(() => {
            this.mostrarBloqueoTerminal();
          }, 1800);
        }
      }

      if (this.autoSpinActivo) {
        setTimeout(() => {
          if (this.autoSpinActivo) {
            this.supervisorReiniciar();
            this.ejecutarGiro();
          }
        }, 2200);
      }
    }

    async animarEscaladaTorre(resultado) {
      this.limpiarResaltadoTorre();
      const rows = Array.from(this.dom.paytableTower.querySelectorAll('.pill-row'));
      rows.sort((a, b) => parseInt(a.dataset.ladderIndex, 10) - parseInt(b.dataset.ladderIndex, 10));

      const targetId = resultado.premio.id;
      const targetRow = this.dom.paytableTower.querySelector(`[data-nivel-id="${targetId}"]`);

      if (targetId === 'MOJARRO') {
        for (let i = 0; i <= 2 && i < rows.length; i++) {
          rows[i].classList.add('pill-row-climbing');
          soundManager.playClimbTick(i, 9);
          await new Promise(r => setTimeout(r, 90));
          rows[i].classList.remove('pill-row-climbing');
        }
        return;
      }

      let targetIndex = 0;
      if (targetRow && targetRow.dataset.ladderIndex !== undefined) {
        targetIndex = parseInt(targetRow.dataset.ladderIndex, 10);
      } else {
        targetIndex = 0;
      }

      for (let i = 0; i <= targetIndex; i++) {
        rows.forEach(r => r.classList.remove('pill-row-climbing'));
        rows[i].classList.add('pill-row-climbing');
        soundManager.playClimbTick(i, 9);
        await new Promise(r => setTimeout(r, 120));
      }

      const winningRow = rows[targetIndex];
      for (let f = 0; f < 3; f++) {
        winningRow.classList.remove('pill-row-active', 'pill-row-climbing');
        await new Promise(r => setTimeout(r, 65));
        winningRow.classList.add('pill-row-active');
        await new Promise(r => setTimeout(r, 85));
      }
    }

    ejecutarFeedback(resultado) {
      const { tipoFeedback } = resultado.premio;

      switch (tipoFeedback) {
        case 'jackpot':
          soundManager.playJackpot();
          this.dispararConfeti(true);
          break;
        case 'win_big':
          soundManager.playJackpot();
          this.dispararConfeti(false);
          break;
        case 'win_bonus':
          soundManager.playWinBonus();
          this.dispararConfeti(false);
          break;
        case 'win_medium':
        case 'win_discount':
          soundManager.playWinDiscount();
          break;
        case 'blanqueo':
          soundManager.playBlanqueo();
          break;
        default:
          soundManager.playWinDiscount();
      }
    }

    dispararConfeti(esJackpot = false) {
      if (!this.confettiInstance) return;

      if (esJackpot) {
        const duracion = 3.5 * 1000;
        const fin = Date.now() + duracion;

        const intervalo = setInterval(() => {
          if (Date.now() > fin) {
            return clearInterval(intervalo);
          }
          this.confettiInstance({
            startVelocity: 30,
            spread: 360,
            ticks: 60,
            origin: { x: Math.random(), y: Math.random() - 0.2 },
            colors: ['#FACC15', '#00F0FF', '#EC4899', '#38BDF8', '#FFFFFF']
          });
        }, 250);
      } else {
        this.confettiInstance({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00F0FF', '#38BDF8', '#FACC15', '#4ADE80', '#EC4899']
        });
      }
    }

    mostrarPopoutConDecision(resultado) {
      if (!this.dom.winPopoutModal) return;

      this.premioActualEnMano = resultado;

      let icon = '🎁';
      if (resultado.premio.id === 'JACKPOT') icon = '⭐';
      else if (resultado.premio.id === 'BONUS_ALCOHOL') icon = '🫗';
      else if (resultado.premio.id === 'BONUS_2X3') icon = '🥃';
      else if (resultado.premio.id.startsWith('NIVEL_12') || resultado.premio.id.startsWith('NIVEL_11')) icon = '🍸';
      else if (resultado.premio.id.startsWith('NIVEL_10') || resultado.premio.id.startsWith('NIVEL_8') || resultado.premio.id.startsWith('NIVEL_5')) icon = '🍧';
      else icon = '🍹';

      if (this.dom.winPopoutIcon) this.dom.winPopoutIcon.textContent = icon;
      if (this.dom.winPopoutTitle) this.dom.winPopoutTitle.textContent = (resultado.premio.id === 'JACKPOT') ? '⭐ ¡JACKPOT! ⭐' : '¡GANASTE!';
      if (this.dom.winPopoutTier) this.dom.winPopoutTier.textContent = `${resultado.premio.codigo || ''} ${resultado.premio.nombre || ''}`;
      if (this.dom.winPopoutPrize) this.dom.winPopoutPrize.textContent = resultado.premio.beneficio;

      // Actualizar texto del intento y vidas restantes
      if (this.dom.winPopoutAttemptInfo) {
        if (this.intentoActual >= 3) {
          this.dom.winPopoutAttemptInfo.innerHTML = `Obtenido en el <span class="font-bold text-amber-300">Intento 3 de 3 (Última Oportunidad)</span>. Este es tu premio definitivo.`;
        } else {
          const vidasQuedan = this.vidasRestantes - 1;
          this.dom.winPopoutAttemptInfo.innerHTML = `Obtenido en el <span class="font-bold text-amber-300">Intento ${this.intentoActual} de 3</span>. ¿Deseas quedarte con este premio o cambiarlo? (Te ${vidasQuedan === 1 ? 'queda' : 'quedan'} ${vidasQuedan} ${vidasQuedan === 1 ? 'vida' : 'vidas'}).`;
        }
      }

      // En el intento 3 se oculta el botón de descartar
      if (this.dom.retrySpinBtn) {
        if (this.intentoActual >= 3) {
          this.dom.retrySpinBtn.classList.add('hidden');
        } else {
          this.dom.retrySpinBtn.classList.remove('hidden');
        }
      }

      // Asegurarse de mostrar la cara frontal
      if (this.dom.flipCardInner) {
        this.dom.flipCardInner.classList.remove('flipped');
      }

      this.dom.winPopoutModal.classList.remove('hidden');
    }

    reclamarPremioYVoltearQR() {
      if (!this.premioActualEnMano) return;

      const intento = this.intentoActual;
      const premio = this.premioActualEnMano.premio.beneficio;
      const codigo = this.premioActualEnMano.premio.codigo || '';
      const now = new Date();
      const fecha = now.toISOString().slice(0, 10);
      const hora = now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const dispositivo = getDeviceSummary();
      const terminal = getOrCreateTerminalId();
      const sig = calcularFirma(intento, premio, fecha, hora, terminal);

      const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1) + 'verificar.html';
      const params = new URLSearchParams({
        intento: intento.toString(),
        premio: premio,
        codigo: codigo,
        fecha: fecha,
        hora: hora,
        dispositivo: dispositivo,
        terminal: terminal,
        sig: sig
      });
      const verificationUrl = `${baseUrl}?${params.toString()}`;

      // Actualizar resumen en el reverso
      if (this.dom.qrSummaryPrize) this.dom.qrSummaryPrize.textContent = (codigo ? codigo + ' ' : '') + premio;
      if (this.dom.qrSummaryAttempt) this.dom.qrSummaryAttempt.textContent = `Intento ${intento} de 3`;
      if (this.dom.qrSummaryTime) this.dom.qrSummaryTime.textContent = `${fecha} ${hora}`;
      if (this.dom.qrSummaryTerminal) this.dom.qrSummaryTerminal.textContent = terminal;
      if (this.dom.qrDirectLink) this.dom.qrDirectLink.href = verificationUrl;

      // Renderizar código QR
      if (this.dom.qrcodeBox) {
        this.dom.qrcodeBox.innerHTML = '';
        if (typeof QRCode !== 'undefined') {
          new QRCode(this.dom.qrcodeBox, {
            text: verificationUrl,
            width: 120,
            height: 120,
            colorDark: "#040814",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
          });
        } else {
          this.dom.qrcodeBox.innerHTML = `<div class="p-2 text-center text-[10px] text-slate-800 font-bold">QR Generado<br>${sig}</div>`;
        }
      }

      // Voltear tarjeta en 3D y bloquear terminal por premio reclamado
      if (this.dom.flipCardInner) {
        this.dom.flipCardInner.classList.add('flipped');
      }

      this.vidasRestantes = 0;
      this.guardarVidas();
      this.bloquearTerminalActual();
    }

    descartarYVolverATirar() {
      if (this.intentoActual >= 3) return;

      this.vidasRestantes--;
      this.intentoActual++;
      this.guardarVidas();
      this.actualizarVidasUI();

      if (this.dom.winPopoutModal) {
        this.dom.winPopoutModal.classList.add('hidden');
      }
      if (this.dom.flipCardInner) {
        this.dom.flipCardInner.classList.remove('flipped');
      }

      this.limpiarResaltadoTorre();
      this.reelsController.clearHighlights();

      this.estado = ESTADOS_JUEGO.IDLE;
      this.actualizarUIEstado();

      if (this.dom.statusTitle) {
        this.dom.statusTitle.textContent = `Premio descartado. ¡Gira tu intento ${this.intentoActual} de 3!`;
      }
    }

    reiniciarNuevaPartida() {
      if (isTerminalBlocked() || this.vidasRestantes <= 0) {
        if (this.dom.winPopoutModal) {
          this.dom.winPopoutModal.classList.add('hidden');
        }
        this.mostrarBloqueoTerminal();
        return;
      }

      this.vidasRestantes = 3;
      this.intentoActual = 1;
      this.guardarVidas();
      this.premioActualEnMano = null;
      this.hitBarJugadoEnPartida = false;
      this.vidaHitBarMisterio = Math.floor(Math.random() * 3) + 1;
      this.actualizarVidasUI();

      if (this.dom.winPopoutModal) {
        this.dom.winPopoutModal.classList.add('hidden');
      }
      if (this.dom.flipCardInner) {
        this.dom.flipCardInner.classList.remove('flipped');
      }

      this.supervisorReiniciar();
    }

    actualizarVidasUI() {
      const vidas = this.vidasRestantes;
      if (this.dom.life1) this.dom.life1.classList.toggle('lost', vidas < 1);
      if (this.dom.life2) this.dom.life2.classList.toggle('lost', vidas < 2);
      if (this.dom.life3) this.dom.life3.classList.toggle('lost', vidas < 3);

      if (this.dom.livesLabel) {
        this.dom.livesLabel.textContent = `Intento ${Math.min(this.intentoActual, 3)} de 3`;
      }
    }

    actualizarJackpotUI() {
      if (this.dom.jackpotCountDisplay) {
        this.dom.jackpotCountDisplay.textContent = `${this.jackpotWinsCount} / 3`;
      }
    }

    resaltarFilaTorre(nivelId) {
      this.limpiarResaltadoTorre();
      const row = this.dom.paytableTower.querySelector(`[data-nivel-id="${nivelId}"]`);
      if (row) {
        row.classList.add('pill-row-active');
      }
    }

    limpiarResaltadoTorre() {
      this.dom.paytableTower.querySelectorAll('.pill-row-active, .pill-row-climbing').forEach(r => {
        r.classList.remove('pill-row-active', 'pill-row-climbing');
      });
    }

    actualizarUIEstado() {
      const { spinBtn, spinBtnText, spinBtnIcon, statusBadge, statusTitle } = this.dom;

      switch (this.estado) {
        case ESTADOS_JUEGO.IDLE:
          if (spinBtn) spinBtn.disabled = false;
          if (spinBtnText) spinBtnText.textContent = 'GIRAR';
          if (spinBtnIcon) spinBtnIcon.classList.remove('animate-spin');

          if (statusBadge) {
            statusBadge.textContent = 'LISTO';
            statusBadge.className = 'px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-500/40';
          }
          if (statusTitle) statusTitle.textContent = '¡Tira tu Granizado de la Suerte!';
          break;

        case ESTADOS_JUEGO.SPINNING:
        case ESTADOS_JUEGO.STOPPING:
          if (spinBtn) spinBtn.disabled = true;
          if (spinBtnText) spinBtnText.textContent = 'Buena suerte';
          if (spinBtnIcon) spinBtnIcon.classList.add('animate-spin');

          if (statusBadge) {
            statusBadge.textContent = 'GIRANDO';
            statusBadge.className = 'px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-blue-950 text-blue-400 border border-blue-500/40 animate-pulse';
          }
          if (statusTitle) statusTitle.textContent = '¡Buena suerte!';
          break;

        case ESTADOS_JUEGO.RESOLVED:
        case ESTADOS_JUEGO.LOCKED: {
          const premio = this.ultimoResultado?.premio;
          if (spinBtn) spinBtn.disabled = true;
          if (spinBtnText) spinBtnText.textContent = 'VALIDAR';
          if (spinBtnIcon) spinBtnIcon.classList.remove('animate-spin');

          if (premio && premio.id === 'MOJARRO') {
            if (statusBadge) {
              statusBadge.textContent = 'MOJARRO';
              statusBadge.className = 'px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-600';
            }
            if (statusTitle) statusTitle.textContent = '¡Sin Suerte esta vez!';
          } else if (premio && premio.id === 'JACKPOT') {
            if (statusBadge) {
              statusBadge.textContent = '⭐ JACKPOT ⭐';
              statusBadge.className = 'px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 border border-yellow-300 shadow-lg animate-bounce';
            }
            if (statusTitle) statusTitle.textContent = `¡JACKPOT! ${premio.beneficio}`;
          } else if (premio) {
            if (statusBadge) {
              statusBadge.textContent = `${premio.codigo || 'PREMIO'}`;
              statusBadge.className = 'px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-md';
            }
            if (statusTitle) statusTitle.textContent = `Ganaste: ${premio.beneficio}`;
          }
          break;
        }
      }
    }

    mostrarAlertaSupervisorRequerido() {
      this.abrirModalSupervisor();
    }

    abrirModalSupervisor() {
      this.dom.supervisorModal.classList.remove('hidden');
      this.actualizarHistorialUI();
      this.actualizarSupervisorUI();
    }

    cerrarModalSupervisor() {
      this.dom.supervisorModal.classList.add('hidden');
    }

    supervisorValidarPremio() {
      if (this.historialTiradas.length > 0) {
        this.historialTiradas[0].validado = true;
        try {
          localStorage.setItem('paradice_slot_historial', JSON.stringify(this.historialTiradas));
        } catch (e) {}
      }
      this.supervisorReiniciar();
    }

    supervisorReiniciar() {
      unblockTerminal();
      if (this.dom.terminalBlockedModal) {
        this.dom.terminalBlockedModal.classList.add('hidden');
      }
      this.vidasRestantes = 3;
      this.intentoActual = 1;
      this.guardarVidas();
      this.hitBarModoActivo = false;
      this.hitBarStoppingStep = false;
      this.hitBarJugadoEnPartida = false;
      this.vidaHitBarMisterio = Math.floor(Math.random() * 3) + 1;
      this.actualizarVidasUI();

      if (this.reelsController) {
        this.reelsController.finalizarHitBar();
      }
      if (this.dom.hitbarBanner) {
        this.dom.hitbarBanner.classList.add('hidden');
      }
      if (this.dom.paylineGuide) {
        this.dom.paylineGuide.classList.remove('hitbar-payline-active');
      }
      if (this.dom.spinBtn) {
        this.dom.spinBtn.classList.remove('spin-btn-hitbar-mode');
      }

      this.estado = ESTADOS_JUEGO.IDLE;
      this.limpiarResaltadoTorre();
      this.reelsController.clearHighlights();
      this.actualizarUIEstado();
      this.actualizarSupervisorUI();
      this.cerrarModalSupervisor();
    }

    mostrarBloqueoTerminal() {
      const mac = getOrCreateTerminalId();
      const ip = cachedPublicIp || '192.168.1.100';

      if (this.dom.blockedTerminalMac) this.dom.blockedTerminalMac.textContent = mac;
      if (this.dom.blockedTerminalIp) this.dom.blockedTerminalIp.textContent = ip;
      if (this.dom.terminalBlockedModal) this.dom.terminalBlockedModal.classList.remove('hidden');

      if (this.dom.spinBtn) this.dom.spinBtn.disabled = true;
      this.actualizarSupervisorUI();
    }

    bloquearTerminalActual() {
      const ip = cachedPublicIp || '192.168.1.100';
      blockTerminal(ip);
      this.actualizarSupervisorUI();
    }

    desbloquearTerminal() {
      unblockTerminal();
      if (this.dom.terminalBlockedModal) {
        this.dom.terminalBlockedModal.classList.add('hidden');
      }
      this.vidasRestantes = 3;
      this.intentoActual = 1;
      this.hitBarJugadoEnPartida = false;
      this.vidaHitBarMisterio = Math.floor(Math.random() * 3) + 1;
      this.actualizarVidasUI();
      this.supervisorReiniciar();
      this.actualizarSupervisorUI();
      if (this.dom.statusTitle) {
        this.dom.statusTitle.textContent = '¡Terminal desbloqueada! ¡Tira tu Granizado de la Suerte!';
      }
    }

    actualizarSupervisorUI() {
      const mac = getOrCreateTerminalId();
      const ip = cachedPublicIp || 'Detectando...';
      if (this.dom.supervisorTerminalInfo) {
        this.dom.supervisorTerminalInfo.textContent = `MAC: ${mac} • IP: ${ip}`;
      }
      const blocked = isTerminalBlocked();
      if (this.dom.supervisorTerminalStatus) {
        this.dom.supervisorTerminalStatus.innerHTML = blocked
          ? '<span class="text-rose-400 font-bold">🔴 BLOQUEADA (3 Vidas)</span>'
          : '<span class="text-emerald-400 font-bold">🟢 Habilitada</span>';
      }
      if (this.dom.supervisorStateBadge) {
        this.dom.supervisorStateBadge.textContent = this.estado;
      }
      if (this.dom.supervisorResultSummary && this.ultimoResultado) {
        this.dom.supervisorResultSummary.textContent = this.ultimoResultado.premio.beneficio;
      }
    }

    registrarTiradaEnHistorial(resultado) {
      const item = {
        id: Date.now(),
        fecha: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        premioId: resultado.premio.id,
        nombrePremio: resultado.premio.nombre || resultado.premio.codigo,
        beneficio: resultado.premio.beneficio,
        aciertos: resultado.cantidadAciertos,
        validado: false
      };

      this.historialTiradas.unshift(item);
      if (this.historialTiradas.length > 50) {
        this.historialTiradas.pop();
      }

      try {
        localStorage.setItem('paradice_slot_historial', JSON.stringify(this.historialTiradas));
      } catch (e) {}

      this.actualizarHistorialUI();
    }

    actualizarHistorialUI() {
      if (!this.dom.supervisorHistorialList) return;

      if (this.historialTiradas.length === 0) {
        this.dom.supervisorHistorialList.innerHTML = `
          <div class="text-center py-6 text-xs text-slate-500">
            No hay tiradas registradas aún en esta sesión.
          </div>
        `;
        return;
      }

      this.dom.supervisorHistorialList.innerHTML = '';
      this.historialTiradas.forEach(h => {
        const row = document.createElement('div');
        row.className = 'flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800 text-xs';

        const left = document.createElement('div');
        left.className = 'flex flex-col';
        left.innerHTML = `
          <span class="font-bold text-slate-200">${h.beneficio}</span>
          <span class="text-[10px] text-slate-400">${h.fecha} • ${h.nombrePremio}</span>
        `;

        const badge = document.createElement('span');
        badge.className = h.validado
          ? 'px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800'
          : 'px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800';
        badge.textContent = h.validado ? '✓ Canjeado' : '⏳ Pendiente';

        row.appendChild(left);
        row.appendChild(badge);
        this.dom.supervisorHistorialList.appendChild(row);
      });
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    const app = new GranizadosSlotApp();
    app.init();
    window.paradiceApp = app;
  });
})();
