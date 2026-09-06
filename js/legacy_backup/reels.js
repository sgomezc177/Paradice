/**
 * Controlador de Rodillos con Gráficos Neón Ultra-Vivos y Efectos 3D Luminosos
 * Colores de alta saturación, auras de neón y acabados brillantes de casino digital
 */

import { SIMBOLOS, MAPA_SIMBOLOS } from './config.js';
import { obtenerSimboloAleatorio } from './rng.js';
import { soundManager } from './audio.js';

// Catálogo de Gráficos Vectoriales de Alta Definición fieles a la imagen de referencia
export const GRAFICOS_NEON_3D = {
  // 1. GRANIZADO GRATIS: Estrella 3D azul de 8 puntas con bisel blanco/cian, estrellitas rosadas, copa de frutos rojos y textos 3D
  SYM_GRATIS: `
    <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">
      <defs>
        <radialGradient id="starGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="70%" stop-color="#0284c7"/>
          <stop offset="100%" stop-color="#075985"/>
        </radialGradient>
        <linearGradient id="goldTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="25%" stop-color="#fef08a"/>
          <stop offset="60%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
        <linearGradient id="cyanTextGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="40%" stop-color="#bae6fd"/>
          <stop offset="80%" stop-color="#38bdf8"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
      </defs>
      <!-- Estrellitas decorativas rosadas y cian alrededor -->
      <polygon points="12,18 14,23 19,23 15,26 17,31 12,28 7,31 9,26 5,23 10,23" fill="#f43f5e"/>
      <polygon points="86,14 88,18 92,18 89,21 90,25 86,22 82,25 83,21 80,18 84,18" fill="#f43f5e"/>
      <polygon points="90,75 91,78 94,78 92,80 93,83 90,81 87,83 88,80 86,78 89,78" fill="#38bdf8"/>
      
      <!-- Estrella 3D azul de 8 puntas biselada -->
      <polygon points="50,2 62,25 88,14 77,41 100,53 76,66 85,93 59,83 50,100 41,83 15,93 24,66 0,53 23,41 12,14 38,25" 
               fill="url(#starGrad)" stroke="#ffffff" stroke-width="2.2" stroke-linejoin="round"/>
      <polygon points="50,9 59,27 82,18 73,41 92,53 72,64 78,86 57,78 50,92 43,78 22,86 28,64 8,53 27,41 18,18 41,27" 
               fill="none" stroke="#7dd3fc" stroke-width="1.2" opacity="0.9"/>
      
      <!-- Vaso de granizado de frutos rojos en la cúspide de la estrella -->
      <g transform="translate(35, 10) scale(0.30)">
        <path d="M12,28 L24,92 L76,92 L88,28 Z" fill="rgba(255,255,255,0.4)" stroke="#ffffff" stroke-width="4"/>
        <path d="M14,30 L26,90 L74,90 L86,30 Z" fill="#e11d48"/>
        <!-- Granizado con textura de nieve de frutos rojos -->
        <ellipse cx="50" cy="28" rx="36" ry="18" fill="#be123c"/>
        <path d="M14,28 Q50,-10 86,28 Z" fill="#f43f5e"/>
        <circle cx="50" cy="8" r="7" fill="#ffffff" opacity="0.85"/>
        <circle cx="36" cy="18" r="4" fill="#fb7185"/>
        <circle cx="64" cy="20" r="4" fill="#fb7185"/>
      </g>
      
      <!-- Letrero 3D: GRANIZADO (Celeste) -->
      <text x="50" y="60" text-anchor="middle" font-family="system-ui, Arial Black, Impact, sans-serif" font-size="8.8" font-weight="900" fill="#03254c" stroke="#03254c" stroke-width="2.5">GRANIZADO</text>
      <text x="50" y="59" text-anchor="middle" font-family="system-ui, Arial Black, Impact, sans-serif" font-size="8.8" font-weight="900" fill="#ffffff" stroke="#ffffff" stroke-width="1">GRANIZADO</text>
      <text x="50" y="59" text-anchor="middle" font-family="system-ui, Arial Black, Impact, sans-serif" font-size="8.8" font-weight="900" fill="url(#cyanTextGrad)">GRANIZADO</text>
      
      <!-- Letrero 3D: GRATIS (Dorado) -->
      <text x="50" y="75" text-anchor="middle" font-family="system-ui, Arial Black, Impact, sans-serif" font-size="12.5" font-weight="900" fill="#451a03" stroke="#451a03" stroke-width="3">GRATIS</text>
      <text x="50" y="74" text-anchor="middle" font-family="system-ui, Arial Black, Impact, sans-serif" font-size="12.5" font-weight="900" fill="#ffffff" stroke="#ffffff" stroke-width="1.2">GRATIS</text>
      <text x="50" y="74" text-anchor="middle" font-family="system-ui, Arial Black, Impact, sans-serif" font-size="12.5" font-weight="900" fill="url(#goldTextGrad)">GRATIS</text>
    </svg>
  `,

  // 2. VODKA: Vaso cónico de cristal con granizado de arándanos/moras rosa-violeta, moras al pie y VODKA rotulado
  SYM_VODKA: `
    <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_8px_rgba(168,85,247,0.7)]">
      <defs>
        <radialGradient id="vodkaSlush" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#f472b6"/>
          <stop offset="45%" stop-color="#d946ef"/>
          <stop offset="100%" stop-color="#701a75"/>
        </radialGradient>
      </defs>
      <!-- Granizado en cúpula con hielo triturado -->
      <path d="M26,30 Q50,15 74,30 L66,86 Q50,92 34,86 Z" fill="url(#vodkaSlush)"/>
      <ellipse cx="50" cy="30" rx="24" ry="7" fill="#fbcfe8"/>
      <!-- Vaso de cristal con reflejo -->
      <path d="M24,28 L33,88 Q50,94 67,88 L76,28 Q50,22 24,28 Z" fill="rgba(255,255,255,0.16)" stroke="#ffffff" stroke-width="1.8"/>
      <path d="M29,34 L35,82" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
      <!-- Estrellita azul en el borde superior -->
      <polygon points="76,24 77.5,27 81,27 78,29 79,32 76,30 73,32 74,29 71,27 74.5,27" fill="#38bdf8"/>
      <!-- Moras y frambuesas al pie del vaso -->
      <circle cx="30" cy="85" r="5" fill="#4c0519" stroke="#be123c" stroke-width="0.8"/>
      <circle cx="28" cy="84" r="1.5" fill="#f43f5e"/>
      <circle cx="24" cy="88" r="4.5" fill="#581c87" stroke="#9333ea" stroke-width="0.8"/>
      <circle cx="23" cy="87" r="1.2" fill="#d8b4fe"/>
      <!-- Texto rotulado en el vaso: VODKA (celeste brillante con relieve) -->
      <text x="50" y="62" text-anchor="middle" font-family="system-ui, Arial Black, Impact, sans-serif" font-size="10.5" font-weight="900" fill="#0369a1" letter-spacing="1">VODKA</text>
      <text x="50" y="61" text-anchor="middle" font-family="system-ui, Arial Black, Impact, sans-serif" font-size="10.5" font-weight="900" fill="#38bdf8" letter-spacing="1">VODKA</text>
    </svg>
  `,

  // 3. FROZEN BERRIES (COCTEL ROJO): Copa de granizado de frutos rojos silvestres con fresa y moras
  SYM_COCTEL_ROJO: `
    <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_8px_rgba(239,68,68,0.7)]">
      <defs>
        <radialGradient id="berriesGrad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#fb7185"/>
          <stop offset="50%" stop-color="#e11d48"/>
          <stop offset="100%" stop-color="#881337"/>
        </radialGradient>
      </defs>
      <!-- Bebida granizada roja -->
      <path d="M26,30 Q50,15 74,30 L66,86 Q50,92 34,86 Z" fill="url(#berriesGrad)"/>
      <ellipse cx="50" cy="30" rx="24" ry="7" fill="#fecdd3"/>
      <!-- Vaso de cristal -->
      <path d="M24,28 L33,88 Q50,94 67,88 L76,28 Q50,22 24,28 Z" fill="rgba(255,255,255,0.18)" stroke="#ffffff" stroke-width="1.8"/>
      <path d="M29,34 L35,82" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
      <!-- Estrellitas decorativas en el borde superior -->
      <polygon points="30,22 31.5,25 35,25 32,27 33,30 30,28 27,30 28,27 25,25 28.5,25" fill="#f43f5e"/>
      <polygon points="36,25 37,27 39,27 37.5,28.5 38,30.5 36,29 34,30.5 34.5,28.5 33,27 35,27" fill="#fb7185"/>
      <!-- Moras y arándanos al pie del vaso -->
      <circle cx="70" cy="85" r="5" fill="#881337" stroke="#f43f5e" stroke-width="0.8"/>
      <circle cx="76" cy="88" r="4" fill="#4a044e" stroke="#c084fc" stroke-width="0.8"/>
      <circle cx="69" cy="84" r="1.5" fill="#fda4af"/>
    </svg>
  `,

  // 4. GRANIZADO AZUL Y BICOLOR: Vaso alto con granizado azul arriba y jugo dorado abajo, con cerezas rojas
  SYM_COPA_AZUL: `
    <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_8px_rgba(56,189,248,0.7)]">
      <defs>
        <linearGradient id="layeredSlush" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="48%" stop-color="#0284c7"/>
          <stop offset="52%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#d97706"/>
        </linearGradient>
      </defs>
      <!-- Contenido bicolor -->
      <path d="M26,28 Q50,18 74,28 L66,86 Q50,92 34,86 Z" fill="url(#layeredSlush)"/>
      <ellipse cx="50" cy="28" rx="24" ry="7" fill="#bae6fd"/>
      <!-- Vaso de cristal con reflejo satinado -->
      <path d="M24,26 L33,88 Q50,94 67,88 L76,26 Q50,20 24,26 Z" fill="rgba(255,255,255,0.18)" stroke="#ffffff" stroke-width="1.8"/>
      <path d="M29,32 L35,82" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
      <!-- Cereza roja brillante en el borde superior -->
      <circle cx="62" cy="22" r="6" fill="#dc2626" stroke="#ffffff" stroke-width="0.8"/>
      <circle cx="60" cy="20" r="1.8" fill="#ffffff"/>
      <path d="M62,16 Q67,8 72,12" fill="none" stroke="#22c55e" stroke-width="1.6" stroke-linecap="round"/>
      <!-- Cereza al pie del vaso -->
      <circle cx="70" cy="85" r="5" fill="#b91c1c" stroke="#f87171" stroke-width="0.8"/>
      <circle cx="69" cy="84" r="1.5" fill="#ffffff"/>
      <path d="M70,80 Q74,74 72,70" fill="none" stroke="#22c55e" stroke-width="1.2"/>
    </svg>
  `,

  // 5. GRANIZADO VERDE: Vaso cónico de granizado verde lima con rodaja de lima cortada al pie
  SYM_COPA_VERDE: `
    <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_8px_rgba(74,222,128,0.7)]">
      <defs>
        <radialGradient id="limeSlushGrad" cx="40%" cy="30%" r="70%">
          <stop offset="0%" stop-color="#86efac"/>
          <stop offset="50%" stop-color="#22c55e"/>
          <stop offset="100%" stop-color="#14532d"/>
        </radialGradient>
      </defs>
      <!-- Granizado verde -->
      <path d="M26,30 Q50,15 74,30 L66,86 Q50,92 34,86 Z" fill="url(#limeSlushGrad)"/>
      <ellipse cx="50" cy="30" rx="24" ry="7" fill="#bbf7d0"/>
      <!-- Vaso de cristal -->
      <path d="M24,28 L33,88 Q50,94 67,88 L76,28 Q50,22 24,28 Z" fill="rgba(255,255,255,0.18)" stroke="#ffffff" stroke-width="1.8"/>
      <path d="M29,34 L35,82" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
      <!-- Rodaja de lima al pie del vaso (media luna realista) -->
      <g transform="translate(62, 70) rotate(15)">
        <path d="M0,18 A16,16 0 0,0 28,18 Z" fill="#15803d" stroke="#ffffff" stroke-width="1"/>
        <path d="M2,18 A13,13 0 0,0 26,18 Z" fill="#86efac"/>
        <path d="M5,18 A10,10 0 0,0 23,18 Z" fill="#4ade80"/>
        <!-- Gajos de la lima -->
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
        <linearGradient id="tequilaGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fef08a"/>
          <stop offset="40%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <!-- Licor dorado en el vaso -->
      <path d="M27,45 L32,88 Q50,94 68,88 L73,45 Z" fill="url(#tequilaGold)"/>
      <ellipse cx="50" cy="45" rx="23" ry="5" fill="#fde047"/>
      <!-- Base sólida de vidrio grueso del shot -->
      <path d="M31,80 L32,88 Q50,94 68,88 L69,80 Z" fill="rgba(255,255,255,0.6)"/>
      <!-- Gema de hielo cristalina (bloque poligonal facetado) que sobresale hacia arriba -->
      <polygon points="45,12 58,18 52,38 38,32" fill="#bae6fd" stroke="#ffffff" stroke-width="0.8"/>
      <polygon points="58,18 68,26 59,44 52,38" fill="#38bdf8" opacity="0.9"/>
      <polygon points="38,32 52,38 48,50 36,44" fill="#0284c7" opacity="0.85"/>
      <polygon points="45,12 38,32 36,44 32,24" fill="#e0f2fe" opacity="0.95"/>
      <!-- Vaso de cristal con bordes biselados -->
      <path d="M25,40 L31,90 Q50,96 69,90 L75,40 Q50,34 25,40 Z" fill="rgba(255,255,255,0.18)" stroke="#ffffff" stroke-width="1.8"/>
      <path d="M29,46 L33,84" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.85"/>
      <!-- Rodaja de limón/lima apoyada al pie -->
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
        <linearGradient id="chromeBody" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#64748b"/>
          <stop offset="20%" stop-color="#cbd5e1"/>
          <stop offset="45%" stop-color="#ffffff"/>
          <stop offset="70%" stop-color="#94a3b8"/>
          <stop offset="90%" stop-color="#cbd5e1"/>
          <stop offset="100%" stop-color="#475569"/>
        </linearGradient>
      </defs>
      <!-- Tapa superior (tapón cilíndrico abombado) -->
      <ellipse cx="50" cy="14" rx="10" ry="3.5" fill="#f8fafc" stroke="#64748b" stroke-width="0.8"/>
      <path d="M40,14 L41,22 Q50,25 59,22 L60,14 Z" fill="url(#chromeBody)" stroke="#64748b" stroke-width="0.8"/>
      <!-- Sección media cónica con anillo de unión -->
      <path d="M33,26 L67,26 L63,48 L37,48 Z" fill="url(#chromeBody)" stroke="#64748b" stroke-width="0.8"/>
      <ellipse cx="50" cy="26" rx="17" ry="3" fill="#ffffff"/>
      <ellipse cx="50" cy="48" rx="13" ry="2.5" fill="#94a3b8"/>
      <!-- Vaso principal inferior -->
      <path d="M37,48 L63,48 L58,88 Q50,91 42,88 L37,48 Z" fill="url(#chromeBody)" stroke="#64748b" stroke-width="0.8"/>
      <ellipse cx="50" cy="88" rx="8" ry="2" fill="#334155"/>
      <!-- Destellos de luz vertical -->
      <line x1="48" y1="28" x2="47" y2="86" stroke="#ffffff" stroke-width="1.8" opacity="0.85"/>
      <line x1="56" y1="50" x2="54" y2="84" stroke="#ffffff" stroke-width="1" opacity="0.6"/>
    </svg>
  `,

  // 8. LIMÓN: Limón amarillo fresco ovalado con textura, relieve y hojas verdes
  SYM_LIMON: `
    <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_8px_rgba(234,179,8,0.7)]">
      <defs>
        <radialGradient id="lemonReal" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="30%" stop-color="#fef08a"/>
          <stop offset="70%" stop-color="#eab308"/>
          <stop offset="100%" stop-color="#a16207"/>
        </radialGradient>
      </defs>
      <!-- Hojas verdes en el tallo -->
      <path d="M52,24 Q72,6 84,18 Q74,36 54,27 Z" fill="#22c55e" stroke="#15803d" stroke-width="1.2"/>
      <path d="M54,24 Q70,18 80,18" fill="none" stroke="#86efac" stroke-width="1"/>
      <circle cx="50" cy="24" r="2.5" fill="#15803d"/>
      <!-- Cuerpo del limón con extremos cónicos -->
      <path d="M22,54 Q15,42 26,32 Q46,18 74,36 Q88,48 78,65 Q58,84 28,70 Q17,64 22,54 Z" 
            fill="url(#lemonReal)" stroke="#ca8a04" stroke-width="1.5"/>
      <!-- Brillo especular y textura suave -->
      <ellipse cx="44" cy="38" rx="14" ry="7" transform="rotate(-22, 44, 38)" fill="#ffffff" opacity="0.65"/>
      <circle cx="38" cy="35" r="2.5" fill="#ffffff"/>
    </svg>
  `,

  // 9. NARANJA: Esfera naranja con textura porosa y hoja verde
  SYM_NARANJA: `
    <svg viewBox="0 0 100 100" class="w-full h-full filter drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]">
      <defs>
        <radialGradient id="orangeReal" cx="40%" cy="35%" r="65%">
          <stop offset="0%" stop-color="#ffedd5"/>
          <stop offset="35%" stop-color="#fb923c"/>
          <stop offset="75%" stop-color="#ea580c"/>
          <stop offset="100%" stop-color="#9a3412"/>
        </radialGradient>
      </defs>
      <!-- Esfera de la naranja -->
      <circle cx="50" cy="52" r="34" fill="url(#orangeReal)" stroke="#ea580c" stroke-width="1.2"/>
      <!-- Tallo y hoja verde -->
      <circle cx="50" cy="18" r="3" fill="#166534"/>
      <path d="M50,18 Q66,6 74,14 Q68,26 50,19 Z" fill="#22c55e" stroke="#15803d" stroke-width="1"/>
      <!-- Brillo y textura -->
      <ellipse cx="38" cy="38" rx="12" ry="6" transform="rotate(-30, 38, 38)" fill="#ffffff" opacity="0.65"/>
      <circle cx="34" cy="34" r="2.5" fill="#ffffff"/>
    </svg>
  `
};

export class ReelsController {
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

      this.reels.push({
        columnEl: reelCol,
        trackEl: track
      });

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
    cell.className = 'symbol-cell w-full h-[60px] sm:h-[68px] p-0.5 flex items-center justify-center';
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
    const cellHeight = firstCell ? firstCell.getBoundingClientRect().height : 64;
    const stripLengths = [20, 24, 28, 32, 36];

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
        const spinDuration = 1.35 + (c * 0.32);

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
    this.container.querySelectorAll('.symbol-winner').forEach(el => {
      el.classList.remove('symbol-winner');
    });
  }
}
