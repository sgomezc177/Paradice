/**
 * SlotView.js - Paradice Juegos (MVC - Tragamonedas)
 * Renderizado visual, animación secuencial de los 5 rodillos, efectos de brillo (glow),
 * iluminación piramidal por escalones, confeti y modales con tarjeta 3D flip.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.SlotView = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  class SlotViewClass {
    constructor() {
      this.dom = {};
      this.reelStrips = [];
      this.confettiInstance = window.confetti || null;
      this.cellHeight = 68; // Base mobile: 68px, desktop sm: 72px
      this.hitBarColumnsStopped = [false, false, false, false, false];
      this.hitbarStabilizeTimer = null;
    }

    init() {
      this.cacheDOM();
      this.initReels();
    }

    cacheDOM() {
      this.dom = {
        appContainer: document.getElementById('app-container'),
        paytableTower: document.getElementById('paytable-tower'),
        reelsContainer: document.getElementById('reels-container'),
        mainPaylineGuide: document.getElementById('main-payline-guide'),
        spinBtn: document.getElementById('spin-btn'),
        spinBtnText: document.getElementById('spin-btn-text'),
        spinBtnIcon: document.getElementById('spin-btn-icon'),
        autoSpinBtn: document.getElementById('auto-spin-btn'),
        statusBadge: document.getElementById('status-badge'),
        statusTitle: document.getElementById('status-title'),
        // Audio
        muteBtn: document.getElementById('mute-btn'),
        muteIcon: document.getElementById('mute-icon'),
        musicBtn: document.getElementById('music-btn'),
        musicIcon: document.getElementById('music-icon'),
        musicNextBtn: document.getElementById('music-next-btn'),
        musicTrackDisplay: document.getElementById('music-track-display'),
        // Vidas
        life1: document.getElementById('life-1'),
        life2: document.getElementById('life-2'),
        life3: document.getElementById('life-3'),
        livesLabel: document.getElementById('lives-label'),
        // Supervisor
        supervisorBtn: document.getElementById('supervisor-btn'),
        supervisorModal: document.getElementById('supervisor-modal'),
        closeSupervisorBtn: document.getElementById('close-supervisor-modal'),
        supervisorResetBtn: document.getElementById('supervisor-reset-btn'),
        supervisorValidateBtn: document.getElementById('supervisor-validate-btn'),
        supervisorHistorialList: document.getElementById('supervisor-historial-list'),
        testJackpotBtn: document.getElementById('test-jackpot-btn'),
        testEpico22Btn: document.getElementById('test-epico22-btn'),
        testEpico11Btn: document.getElementById('test-epico11-btn'),
        testComboBtn: document.getElementById('test-combo-btn'),
        testJeringaBtn: document.getElementById('test-jeringa-btn'),
        testPoco13Btn: document.getElementById('test-poco13-btn'),
        testPoco14Btn: document.getElementById('test-poco14-btn'),
        testDesc1500Btn: document.getElementById('test-desc1500-btn'),
        testDesc1000Btn: document.getElementById('test-desc1000-btn'),
        testDesc500Btn: document.getElementById('test-desc500-btn'),
        testBonusBtn: document.getElementById('test-bonus-btn'),
        testVidaBtn: document.getElementById('test-vida-btn'),
        testHitbarBtn: document.getElementById('test-hitbar-btn'),
        testMojarroBtn: document.getElementById('test-mojarro-btn'),
        clearHistoryBtn: document.getElementById('clear-history-btn'),
        // Combinaciones
        combinationsBtn: document.getElementById('combinations-btn'),
        combinationsModal: document.getElementById('combinations-modal'),
        closeCombinationsBtn: document.getElementById('close-combinations-modal'),
        closeCombinationsBtnBottom: document.getElementById('close-combinations-btn-bottom'),
        // Popout Ganador 3D Flip
        winPopoutModal: document.getElementById('win-popout-modal'),
        flipCardInner: document.getElementById('flip-card-inner'),
        winPopoutIcon: document.getElementById('win-popout-icon'),
        winPopoutTitle: document.getElementById('win-popout-title'),
        winPopoutTier: document.getElementById('win-popout-tier'),
        winPopoutPrize: document.getElementById('win-popout-prize'),
        winPopoutRestriction: document.getElementById('win-popout-restriction'),
        winPopoutAttemptInfo: document.getElementById('win-popout-attempt-info'),
        claimPrizeBtn: document.getElementById('claim-prize-btn'),
        retrySpinBtn: document.getElementById('retry-spin-btn'),
        closeWinPopoutBtn: document.getElementById('close-win-popout-btn'),
        // QR de Verificación
        qrcodeBox: document.getElementById('qrcode-box'),
        qrSummaryPrize: document.getElementById('qr-summary-prize'),
        qrSummaryRestriction: document.getElementById('qr-summary-restriction'),
        qrSummaryAttempt: document.getElementById('qr-summary-attempt'),
        qrSummaryTime: document.getElementById('qr-summary-time'),
        qrSummaryTerminal: document.getElementById('qr-summary-terminal'),
        qrDirectLink: document.getElementById('qr-direct-link'),
        // Fin de vidas / Reintento
        terminalBlockedModal: document.getElementById('terminal-blocked-modal'),
        btnRestartFreePlay: document.getElementById('btn-restart-free-play'),
        // Temporizador de tiro y Preview
        shotTimerContainer: document.getElementById('shot-timer-container'),
        shotTimerDisplay: document.getElementById('shot-timer-display'),
        previewModeBanner: document.getElementById('preview-mode-banner'),
        // Modal de pérdida de vida
        lifeLossModal: document.getElementById('life-loss-modal'),
        lifeLossMessage: document.getElementById('life-loss-message'),
        lifeLossRemaining: document.getElementById('life-loss-remaining'),
        btnContinueLife: document.getElementById('btn-continue-life'),
        // Banner en Vivo Hit Bar
        hitbarLiveBanner: document.getElementById('hitbar-live-banner'),
        hitbarLiveTitle: document.getElementById('hitbar-live-title'),
        hitbarLiveScore: document.getElementById('hitbar-live-score'),
        testHitbarBtn: document.getElementById('test-hitbar-btn')
      };
    }

    initReels() {
      if (!this.dom.reelsContainer) return;
      this.dom.reelsContainer.innerHTML = '';
      this.reelStrips = [];

      const mapa = root.SlotConfig.MAPA_SIMBOLOS;
      const simbolosArray = root.SlotConfig.SIMBOLOS;

      for (let col = 0; col < 5; col++) {
        const reelCol = document.createElement('div');
        reelCol.className = 'reel-column flex-1 h-full relative overflow-hidden bg-slate-900/60 border-r border-sky-500/20 last:border-r-0';

        const strip = document.createElement('div');
        strip.className = 'reel-strip flex flex-col items-center w-full transition-transform';
        strip.style.transform = 'translateY(0px)';

        // Poblar 15 símbolos iniciales por columna
        for (let i = 0; i < 15; i++) {
          const sym = simbolosArray[(col + i) % simbolosArray.length];
          const cell = this.createSymbolElement(sym);
          strip.appendChild(cell);
        }

        reelCol.appendChild(strip);
        this.dom.reelsContainer.appendChild(reelCol);
        this.reelStrips.push(strip);
      }
    }

    /**
     * Crea un elemento de celda con dimensiones calibradas exactamente
     * al viewport (68px móvil / 72px desktop)
     */
    createSymbolElement(sym) {
      const cell = document.createElement('div');
      cell.className = 'symbol-cell w-full h-[68px] sm:h-[72px] flex flex-col items-center justify-center p-1 select-none flex-shrink-0';
      cell.dataset.symbolId = sym.id;

      cell.innerHTML = `
        <div class="symbol-inner relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${sym.bgBadge} p-0.5 shadow-md flex items-center justify-center transform transition-all duration-200">
          <span class="text-2xl sm:text-3xl filter drop-shadow">${sym.icono}</span>
          <span class="absolute bottom-0.5 right-1 text-[9px] opacity-75 font-bold">${sym.subIcono || ''}</span>
        </div>
      `;
      return cell;
    }

    limpiarClasesGiro() {
      if (this.hitbarStabilizeTimer) {
        clearTimeout(this.hitbarStabilizeTimer);
        this.hitbarStabilizeTimer = null;
      }
      this.hitBarColumnsStopped = [false, false, false, false, false];

      const clasesGiro = [
        'reel-strip-spinning',
        'spinning-blur',
        'reel-fast-spin-active',
        'reel-hitbar-hyper',
        'reel-hitbar-stable',
        'reel-hitbar-speed-1',
        'reel-hitbar-speed-2',
        'reel-hitbar-speed-3',
        'reel-hitbar-speed-4'
      ];
      this.reelStrips.forEach(strip => {
        strip.classList.remove(...clasesGiro);
        strip.style.animation = '';
        strip.style.filter = '';
      });
    }

    animarGiro() {
      this.limpiarClasesGiro();

      this.reelStrips.forEach((strip, col) => {
        // Inicio fluido con aceleración realista (física de motor mecánico)
        strip.style.transition = 'transform 0.18s cubic-bezier(0.4, 0, 1, 1)';
        strip.style.transform = 'translateY(-140px)';

        setTimeout(() => {
          strip.classList.add('reel-strip-spinning');
          strip.style.transition = 'none';
          strip.style.transform = 'translateY(0px)';
        }, 180 + col * 35);
      });
    }

    detenerRodillo(colIndex, simbolosColumna, callback) {
      const strip = this.reelStrips[colIndex];
      if (!strip) return;

      const mapa = root.SlotConfig.MAPA_SIMBOLOS;

      // Detener SOLO la animación continua de este rodillo
      strip.classList.remove('reel-strip-spinning', 'spinning-blur');
      strip.innerHTML = '';

      // Crear buffer de símbolos aleatorios para inercia fluida
      const bufferCount = 14;
      for (let i = 0; i < bufferCount; i++) {
        const randSym = root.SlotConfig.SIMBOLOS[Math.floor(Math.random() * root.SlotConfig.SIMBOLOS.length)];
        strip.appendChild(this.createSymbolElement(randSym));
      }

      // Los 3 símbolos ganadores van exactamente al final del buffer
      simbolosColumna.forEach(symId => {
        const sym = mapa[symId] || root.SlotConfig.SIMBOLOS[0];
        strip.appendChild(this.createSymbolElement(sym));
      });

      // Medir la altura de celda real renderizada
      const firstCell = strip.querySelector('.symbol-cell');
      const cellHeight = firstCell ? firstCell.getBoundingClientRect().height : (window.innerWidth >= 640 ? 72 : 68);

      strip.style.transition = 'none';
      strip.style.transform = 'translateY(0px)';
      void strip.offsetHeight; // Forzar reflow

      // Curva de deceleración de tragamonedas física con suave rebote y asentamiento
      strip.style.transition = 'transform 0.55s cubic-bezier(0.12, 0.92, 0.22, 1.02)';
      const targetTranslate = -(bufferCount * cellHeight);
      strip.style.transform = `translateY(${targetTranslate}px)`;

      setTimeout(() => {
        if (callback) callback(colIndex);
      }, 550);
    }

    resaltarPremios(simbolosGanadores) {
      // Remover resaltados previos
      document.querySelectorAll('.symbol-inner.winning-highlight').forEach(el => {
        el.classList.remove('winning-highlight', 'ring-4', 'ring-amber-300', 'animate-pulse');
      });

      if (!simbolosGanadores || simbolosGanadores.length === 0) return;

      // Resaltar en la matriz visible (las últimas 3 celdas de cada rodillo)
      simbolosGanadores.forEach(pos => {
        const strip = this.reelStrips[pos.col];
        if (!strip) return;
        const visibleCells = Array.from(strip.querySelectorAll('.symbol-cell')).slice(-3);
        const targetCell = visibleCells[pos.row];
        if (targetCell) {
          const inner = targetCell.querySelector('.symbol-inner');
          if (inner) {
            inner.classList.add('winning-highlight', 'ring-4', 'ring-amber-300', 'animate-pulse');
          }
        }
      });
    }

    limpiarTorrePagos() {
      if (!this.dom.paytableTower) return;
      this.dom.paytableTower.querySelectorAll('.pill-row').forEach(row => {
        row.classList.remove('pill-row-active', 'pill-row-climbing');
      });
    }

    /**
     * Anima la subida por la pirámide de premios iluminando cada escalón con neón
     */
    async animarEscaladaTorre(nivelId, audioManager) {
      this.limpiarTorrePagos();
      if (!this.dom.paytableTower) return;

      const rows = Array.from(this.dom.paytableTower.querySelectorAll('.pill-row'));
      // Ordenar de abajo hacia arriba según data-ladder-index (0 es la base, 9 es Jackpot)
      rows.sort((a, b) => parseInt(a.dataset.ladderIndex || 0, 10) - parseInt(b.dataset.ladderIndex || 0, 10));

      if (!nivelId || nivelId === 'MOJARRO') {
        // En jugada no premiada, sube 2 escalones fugaces de ilusión
        for (let i = 0; i <= 2 && i < rows.length; i++) {
          rows[i].classList.add('pill-row-climbing');
          if (audioManager && audioManager.playClimbTick) audioManager.playClimbTick(i, 9);
          await new Promise(r => setTimeout(r, 80));
          rows[i].classList.remove('pill-row-climbing');
        }
        return;
      }

      const targetRow = this.dom.paytableTower.querySelector(`.pill-row[data-nivel-id="${nivelId}"]`) ||
        (nivelId === 'JACKPOT' ? this.dom.paytableTower.querySelector('.pill-row[data-nivel-id="PROMO_2X1_16OZ"]') : null);
      let targetIndex = 0;
      if (targetRow && targetRow.dataset.ladderIndex !== undefined) {
        targetIndex = parseInt(targetRow.dataset.ladderIndex, 10);
      }

      // Subir alumbrando escalón por escalón desde la base hasta el premio alcanzado
      for (let i = 0; i <= targetIndex && i < rows.length; i++) {
        rows.forEach(r => r.classList.remove('pill-row-climbing'));
        rows[i].classList.add('pill-row-climbing');
        if (audioManager && audioManager.playClimbTick) audioManager.playClimbTick(i, 9);
        await new Promise(r => setTimeout(r, 110));
      }

      // Destello ganador triunfal en el escalón alcanzado
      const winningRow = rows[targetIndex] || targetRow;
      if (winningRow) {
        for (let f = 0; f < 3; f++) {
          winningRow.classList.remove('pill-row-active', 'pill-row-climbing');
          await new Promise(r => setTimeout(r, 60));
          winningRow.classList.add('pill-row-active');
          await new Promise(r => setTimeout(r, 80));
        }
      }
    }

    iluminarTorrePagosDirecto(nivelId) {
      this.limpiarTorrePagos();
      if (!this.dom.paytableTower || !nivelId || nivelId === 'MOJARRO') return;
      const targetRow = this.dom.paytableTower.querySelector(`.pill-row[data-nivel-id="${nivelId}"]`) ||
        (nivelId === 'JACKPOT' ? this.dom.paytableTower.querySelector('.pill-row[data-nivel-id="PROMO_2X1_16OZ"]') : null);
      if (targetRow) {
        targetRow.classList.add('pill-row-active');
      }
    }

    lanzarConfeti(esJackpot = false) {
      if (!this.confettiInstance) return;
      if (esJackpot) {
        this.confettiInstance({
          particleCount: 160,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#ff007f', '#facc15', '#ffffff']
        });
      } else {
        this.confettiInstance({
          particleCount: 65,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }

    actualizarVidasUI(vidas) {
      const v = Math.max(0, vidas);
      if (this.dom.life1) this.dom.life1.classList.toggle('lost', v < 1);
      if (this.dom.life2) this.dom.life2.classList.toggle('lost', v < 2);
      if (this.dom.life3) this.dom.life3.classList.toggle('lost', v < 3);
      if (this.dom.livesLabel) this.dom.livesLabel.textContent = `${v}/3`;
    }

    mostrarPopoutGanador(resultado, intentoActual = 1, vidas = 3) {
      if (!resultado || !resultado.esPremio) return;
      const nivel = resultado.nivel;

      let icon = '🎁';
      let title = '¡GANASTE!';
      if (nivel.id === 'PROMO_2X1_16OZ' || nivel.id === 'JACKPOT') {
        icon = '⭐';
        title = '⭐ ¡JACKPOT! ⭐';
      } else if (nivel.id === 'PROMO_2X16_22K' || nivel.id === 'PROMO_1X16_11K') {
        icon = '🍸';
        title = '¡PREMIO ÉPICO!';
      } else if (nivel.id === 'PROMO_COMBO_16_9') {
        icon = '🍧';
        title = '¡PREMIO RARO!';
      } else if (nivel.id === 'PROMO_JERINGA_FREE') {
        icon = '💉';
        title = '¡PREMIO RARO!';
      } else if (nivel.id === 'PROMO_1X16_13K' || nivel.id === 'PROMO_2X9_14K') {
        icon = '🍹';
        title = '¡POCO COMÚN!';
      } else if (nivel.id === 'DESC_1500_16OZ' || nivel.id === 'DESC_1000_9OZ') {
        icon = '🍋';
        title = '¡PREMIO COMÚN!';
      } else {
        icon = '🎁';
        title = '¡GANASTE!';
      }

      if (this.dom.winPopoutIcon) this.dom.winPopoutIcon.textContent = icon;
      if (this.dom.winPopoutTitle) this.dom.winPopoutTitle.textContent = title;
      if (this.dom.winPopoutTier) this.dom.winPopoutTier.textContent = nivel.nombre;
      if (this.dom.winPopoutPrize) this.dom.winPopoutPrize.textContent = nivel.beneficio;

      // Restricción / Condición de canje en caja
      if (this.dom.winPopoutRestriction) {
        if (nivel.restriccion) {
          this.dom.winPopoutRestriction.innerHTML = `⚠️ <span class="font-bold">${nivel.restriccion}</span>`;
          this.dom.winPopoutRestriction.classList.remove('hidden');
        } else {
          this.dom.winPopoutRestriction.classList.add('hidden');
        }
      }

      // Actualizar información del intento y vidas restantes
      if (this.dom.winPopoutAttemptInfo) {
        if (intentoActual >= 3 || vidas <= 0) {
          this.dom.winPopoutAttemptInfo.innerHTML = `Obtenido en el <span class="font-bold text-amber-300">Intento ${intentoActual} de 3 (Premio Definitivo)</span>.`;
        } else {
          this.dom.winPopoutAttemptInfo.innerHTML = `Obtenido en el <span class="font-bold text-amber-300">Intento ${intentoActual} de 3</span>. ¿Deseas quedarte con este premio o cambiarlo? (Te quedan ${vidas} vidas).`;
        }
      }

      // Ocultar botón de reintento si no quedan vidas o ya está en el 3er intento
      if (this.dom.retrySpinBtn) {
        if (intentoActual >= 3 || vidas <= 0) {
          this.dom.retrySpinBtn.classList.add('hidden');
        } else {
          this.dom.retrySpinBtn.classList.remove('hidden');
          this.dom.retrySpinBtn.innerHTML = `<span>🔄</span> <span>Descartar y Volver a Tirar (-1 Vida • Quedan ${vidas})</span>`;
        }
      }

      // Asegurar que la tarjeta empiece en la cara frontal (sin voltear)
      if (this.dom.flipCardInner) {
        this.dom.flipCardInner.classList.remove('flipped');
      }

      if (this.dom.winPopoutModal) this.dom.winPopoutModal.classList.remove('hidden');
    }

    voltearQR(voucherData) {
      if (this.dom.qrSummaryPrize) this.dom.qrSummaryPrize.textContent = voucherData.premio;
      if (this.dom.qrSummaryRestriction) this.dom.qrSummaryRestriction.textContent = voucherData.restriccion || 'Sin restricción';
      if (this.dom.qrSummaryAttempt) this.dom.qrSummaryAttempt.textContent = `Intento ${voucherData.intento} de 3`;
      if (this.dom.qrSummaryTime) this.dom.qrSummaryTime.textContent = `${voucherData.fecha} ${voucherData.hora}`;
      if (this.dom.qrSummaryTerminal) this.dom.qrSummaryTerminal.textContent = voucherData.terminal;
      if (this.dom.qrDirectLink) this.dom.qrDirectLink.href = voucherData.verificationUrl;

      // Renderizar código QR oficial
      if (this.dom.qrcodeBox) {
        this.dom.qrcodeBox.innerHTML = '';
        if (typeof QRCode !== 'undefined') {
          new QRCode(this.dom.qrcodeBox, {
            text: voucherData.verificationUrl,
            width: 120,
            height: 120,
            colorDark: "#040814",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
          });
        } else {
          this.dom.qrcodeBox.innerHTML = `<div class="p-2 text-center text-[10px] text-slate-800 font-bold">QR Generado<br>${voucherData.sig.slice(0, 10)}...</div>`;
        }
      }

      // Voltear tarjeta en 3D
      if (this.dom.flipCardInner) {
        this.dom.flipCardInner.classList.add('flipped');
      }
    }

    ocultarPopoutGanador() {
      if (this.dom.winPopoutModal) this.dom.winPopoutModal.classList.add('hidden');
      if (this.dom.flipCardInner) this.dom.flipCardInner.classList.remove('flipped');
    }

    mostrarFinDePartida() {
      if (this.dom.terminalBlockedModal) this.dom.terminalBlockedModal.classList.remove('hidden');
    }

    ocultarFinDePartida() {
      if (this.dom.terminalBlockedModal) this.dom.terminalBlockedModal.classList.add('hidden');
    }

    /**
     * Verifica si algún modal o popout está visible en pantalla para evitar tiros dobles
     */
    isPopoutVisible() {
      const isVisible = el => el && !el.classList.contains('hidden');
      return Boolean(
        isVisible(this.dom.winPopoutModal) ||
        isVisible(this.dom.lifeLossModal) ||
        isVisible(this.dom.terminalBlockedModal) ||
        isVisible(this.dom.combinationsModal) ||
        isVisible(this.dom.supervisorModal) ||
        isVisible(document.getElementById('instructions-modal'))
      );
    }

    actualizarEstadoBotonGirar(girando) {
      if (!this.dom.spinBtn) return;
      this.dom.spinBtn.disabled = girando;
      if (girando) {
        this.dom.spinBtn.classList.add('opacity-50', 'cursor-not-allowed');
        if (this.dom.spinBtnText) this.dom.spinBtnText.textContent = 'GIRANDO...';
        if (this.dom.spinBtnIcon) this.dom.spinBtnIcon.classList.add('animate-spin');
      } else {
        this.dom.spinBtn.classList.remove('opacity-50', 'cursor-not-allowed');
        if (this.dom.spinBtnText) this.dom.spinBtnText.textContent = 'GIRAR';
        if (this.dom.spinBtnIcon) this.dom.spinBtnIcon.classList.remove('animate-spin');
      }
    }

    mostrarHitBarBanner(colIndex, aciertos) {
      if (this.dom.hitbarLiveBanner) this.dom.hitbarLiveBanner.classList.remove('hidden');
      if (this.dom.hitbarLiveTitle) {
        this.dom.hitbarLiveTitle.innerHTML = `⚡ <span>HIT BAR: ¡DETÉN EN ⭐ (SELLO PARADICE) - RODILLO ${colIndex + 1} DE 5!</span>`;
      }
      if (this.dom.hitbarLiveScore) this.dom.hitbarLiveScore.textContent = `${aciertos} / 5 Acertados`;
    }

    ocultarHitBarBanner() {
      if (this.dom.hitbarLiveBanner) this.dom.hitbarLiveBanner.classList.add('hidden');
    }

    iniciarAnimacionHitBar(onEstabilizado) {
      this.limpiarClasesGiro();
      this.hitBarColumnsStopped = [false, false, false, false, false];
      if (this.hitbarStabilizeTimer) {
        clearTimeout(this.hitbarStabilizeTimer);
        this.hitbarStabilizeTimer = null;
      }

      // Banner en vivo: aviso inicial indicando claramente la figura objetivo (⭐)
      if (this.dom.hitbarLiveBanner) this.dom.hitbarLiveBanner.classList.remove('hidden');
      if (this.dom.hitbarLiveTitle) {
        this.dom.hitbarLiveTitle.innerHTML = `⚡ <span>¡HIT BAR! DETÉN EN ⭐ (SELLO PARADICE) - RODILLO 1 DE 5</span>`;
      }
      if (this.dom.hitbarLiveScore) this.dom.hitbarLiveScore.textContent = `0 / 5 Acertados`;

      // Botón en fase de arranque inicial veloz
      if (this.dom.spinBtn) {
        this.dom.spinBtn.disabled = false;
        this.dom.spinBtn.classList.remove('opacity-50', 'opacity-75', 'cursor-not-allowed');
        this.dom.spinBtn.classList.add('spin-btn-hitbar-mode');
        if (this.dom.spinBtnIcon) {
          this.dom.spinBtnIcon.textContent = '⭐';
          this.dom.spinBtnIcon.classList.add('animate-spin');
        }
        if (this.dom.spinBtnText) {
          this.dom.spinBtnText.textContent = 'DETENER 1';
          this.dom.spinBtnText.className = 'text-[9px] font-black uppercase tracking-wider text-amber-300 mt-0.5 animate-pulse';
        }
      }

      // Fase 1: Ultra velocidad inicial (Hyper Spin Rush)
      this.reelStrips.forEach(strip => {
        strip.style.animation = '';
        strip.classList.add('reel-hitbar-hyper');
      });

      // Fase 2: Tras 750ms se modera a giro rítmico claramente visible (0.58s) para control del jugador
      this.hitbarStabilizeTimer = setTimeout(() => {
        this.hitbarStabilizeTimer = null;
        this.reelStrips.forEach((strip, idx) => {
          if (!this.hitBarColumnsStopped[idx]) {
            strip.classList.remove('reel-hitbar-hyper');
            strip.classList.add('reel-hitbar-stable');
          }
        });
        // Proteger: solo actualizar UI si la columna 0 no fue detenida previamente por el usuario
        if (!this.hitBarColumnsStopped[0]) {
          this.mostrarHitBarBanner(0, 0);
          this.actualizarBotonHitBar(0);
        }
        if (onEstabilizado) onEstabilizado();
      }, 750);
    }

    deshabilitarBotonHitBarTemporal() {
      // El botón NUNCA se deshabilita para que el jugador pueda detenerlo al instante incluso durante el giro veloz
      this.actualizarBotonHitBar(0);
    }

    acelerarRodillosHitBar(proximaCol, aciertos) {
      const speedClasses = [
        'reel-hitbar-speed-1',
        'reel-hitbar-speed-2',
        'reel-hitbar-speed-3',
        'reel-hitbar-speed-4'
      ];
      // A medida que aumentan los aciertos (1, 2, 3, 4), se incrementa la velocidad
      const speedIdx = Math.max(0, Math.min(aciertos - 1, speedClasses.length - 1));
      const targetClass = speedClasses[speedIdx];

      for (let col = proximaCol; col < 5; col++) {
        if (!this.hitBarColumnsStopped[col]) {
          const strip = this.reelStrips[col];
          if (strip) {
            strip.classList.remove(
              'reel-hitbar-hyper',
              'reel-hitbar-stable',
              'reel-hitbar-speed-1',
              'reel-hitbar-speed-2',
              'reel-hitbar-speed-3',
              'reel-hitbar-speed-4'
            );
            strip.classList.add(targetClass);
          }
        }
      }
    }

    actualizarBotonHitBar(colIndex) {
      if (!this.dom.spinBtn) return;
      this.dom.spinBtn.disabled = false;
      this.dom.spinBtn.classList.remove('opacity-50', 'opacity-75', 'cursor-not-allowed');
      this.dom.spinBtn.classList.add('spin-btn-hitbar-mode');
      if (this.dom.spinBtnIcon) {
        this.dom.spinBtnIcon.textContent = '⭐';
        this.dom.spinBtnIcon.classList.remove('animate-spin');
      }
      if (this.dom.spinBtnText) {
        this.dom.spinBtnText.textContent = `DETENER ${colIndex + 1}`;
        this.dom.spinBtnText.className = 'text-[9px] font-black uppercase tracking-wider text-amber-300 mt-0.5 animate-pulse';
      }
    }

    restablecerBotonGirar() {
      if (!this.dom.spinBtn) return;
      this.dom.spinBtn.disabled = false;
      this.dom.spinBtn.classList.remove('opacity-50', 'opacity-75', 'cursor-not-allowed', 'spin-btn-hitbar-mode');
      if (this.dom.spinBtnIcon) {
        this.dom.spinBtnIcon.textContent = '🔄';
        this.dom.spinBtnIcon.classList.remove('animate-spin');
      }
      if (this.dom.spinBtnText) {
        this.dom.spinBtnText.textContent = 'GIRAR';
        this.dom.spinBtnText.className = 'text-[8px] font-black uppercase tracking-wider text-sky-300 mt-0.5';
      }
    }

    detenerRodilloHitBar(colIndex, esAcierto, callback) {
      const strip = this.reelStrips[colIndex];
      if (!strip) return;

      this.hitBarColumnsStopped[colIndex] = true;

      const mapa = root.SlotConfig.MAPA_SIMBOLOS;
      // Remover completamente cualquier animación previa de este rodillo
      strip.classList.remove(
        'spinning-blur',
        'reel-strip-spinning',
        'reel-fast-spin-active',
        'reel-hitbar-hyper',
        'reel-hitbar-stable',
        'reel-hitbar-speed-1',
        'reel-hitbar-speed-2',
        'reel-hitbar-speed-3',
        'reel-hitbar-speed-4'
      );
      strip.style.setProperty('animation', 'none', 'important');
      strip.style.animation = 'none';
      strip.style.filter = 'none';
      strip.innerHTML = '';

      const bufferCount = 12;
      for (let i = 0; i < bufferCount; i++) {
        const randSym = root.SlotConfig.SIMBOLOS[Math.floor(Math.random() * root.SlotConfig.SIMBOLOS.length)];
        strip.appendChild(this.createSymbolElement(randSym));
      }

      const nonGratisSymbols = root.SlotConfig.SIMBOLOS.filter(s => s.id !== 'SYM_GRATIS');
      const sym0 = root.SlotConfig.SIMBOLOS[Math.floor(Math.random() * root.SlotConfig.SIMBOLOS.length)];
      const sym1 = esAcierto ? mapa['SYM_GRATIS'] : nonGratisSymbols[Math.floor(Math.random() * nonGratisSymbols.length)];
      const sym2 = root.SlotConfig.SIMBOLOS[Math.floor(Math.random() * root.SlotConfig.SIMBOLOS.length)];

      [sym0, sym1, sym2].forEach(sym => {
        strip.appendChild(this.createSymbolElement(sym));
      });

      const firstCell = strip.querySelector('.symbol-cell');
      const cellHeight = firstCell ? firstCell.getBoundingClientRect().height : (window.innerWidth >= 640 ? 72 : 68);

      strip.style.transition = 'none';
      strip.style.transform = 'translateY(0px)';
      void strip.offsetHeight; // Forzar reflow

      strip.style.transition = 'transform 0.38s cubic-bezier(0.12, 0.95, 0.22, 1.02)';
      const targetTranslate = -(bufferCount * cellHeight);
      strip.style.transform = `translateY(${targetTranslate}px)`;

      setTimeout(() => {
        if (esAcierto) {
          const visibleCells = Array.from(strip.querySelectorAll('.symbol-cell')).slice(-3);
          const centerCell = visibleCells[1];
          if (centerCell) {
            const inner = centerCell.querySelector('.symbol-inner');
            if (inner) {
              inner.classList.add('winning-highlight', 'ring-4', 'ring-amber-300', 'animate-pulse');
            }
          }
        }
        if (callback) callback(colIndex);
      }, 380);
    }

    mostrarModalPerdidaVida(vidasRestantes, onContinuar) {
      if (!this.dom.lifeLossModal) return;
      if (this.dom.lifeLossRemaining) {
        this.dom.lifeLossRemaining.textContent = vidasRestantes > 0 ? `${vidasRestantes} vidas` : '0 vidas';
      }
      if (this.dom.lifeLossMessage) {
        let hearts = '';
        for (let i = 1; i <= 3; i++) {
          hearts += i <= vidasRestantes ? '❤️' : '🖤';
        }
        this.dom.lifeLossMessage.innerHTML = vidasRestantes > 0 
          ? `<div class="text-lg my-1.5 tracking-wider">${hearts}</div> No obtuviste premio en este tiro. Te quedan <span class="font-bold text-amber-300">${vidasRestantes} de 3 vidas</span>.` 
          : `<div class="text-lg my-1.5 tracking-wider">${hearts}</div> Has agotado tus 3 vidas en esta ronda.`;
      }
      if (this.dom.btnContinueLife) {
        this.dom.btnContinueLife.textContent = vidasRestantes > 0 
          ? `CONTINUAR JUGANDO (Intento ${Math.min(3, 4 - vidasRestantes)} de 3)` 
          : 'REINICIAR PARTIDA (3 VIDAS)';
        this.dom.btnContinueLife.onclick = () => {
          this.ocultarModalPerdidaVida();
          if (onContinuar) onContinuar();
        };
      }
      this.dom.lifeLossModal.classList.remove('hidden');
    }

    ocultarModalPerdidaVida() {
      if (this.dom.lifeLossModal) this.dom.lifeLossModal.classList.add('hidden');
    }

    mostrarModoPreview() {
      if (this.dom.previewModeBanner) this.dom.previewModeBanner.classList.remove('hidden');
      this.animarGiro(); // Simulación visual de gameplay en vivo
      this.animarEscaladaTorre('PROMO_2X1_16OZ', null);
    }

    ocultarModoPreview() {
      if (this.dom.previewModeBanner) this.dom.previewModeBanner.classList.add('hidden');
      this.limpiarClasesGiro();
      this.limpiarTorrePagos();
    }
  }

  return SlotViewClass;
});
