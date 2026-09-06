/**
 * DadosView.js - Paradice Juegos (MVC - Dice Battle)
 * Renderizado de dados 3D, animación de agitado, activación de puntos (pips), lista de combos y modales.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.DadosView = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  // Mapeo de pips (posiciones 1 a 9)
  const PIP_MAP = {
    1: [5],
    2: [1, 9],
    3: [1, 5, 9],
    4: [1, 3, 7, 9],
    5: [1, 3, 5, 7, 9],
    6: [1, 3, 4, 6, 7, 9]
  };

  class DadosViewClass {
    constructor() {
      this.dom = {};
      this.confettiInstance = window.confetti || null;
    }

    init() {
      this.cacheDOM();
    }

    cacheDOM() {
      this.dom = {
        die1: document.getElementById('die-1'),
        die2: document.getElementById('die-2'),
        die3: document.getElementById('die-3'),
        btnRoll: document.getElementById('btn-roll-dice'),
        btnReroll: document.getElementById('btn-reroll-life'),
        btnCashOut: document.getElementById('btn-cash-out'),
        comboBadge: document.getElementById('combo-badge'),
        sumDisplay: document.getElementById('sum-display'),
        attemptDisplay: document.getElementById('attempt-label-display'),
        currentPromoTitle: document.getElementById('current-promo-title'),
        currentPromoDesc: document.getElementById('current-promo-desc'),
        combosList: document.getElementById('dice-combos-list'),
        // Vidas
        life1: document.getElementById('life-1'),
        life2: document.getElementById('life-2'),
        life3: document.getElementById('life-3'),
        livesLabel: document.getElementById('lives-label'),
        // Audio
        soundBtn: document.getElementById('btn-sound-toggle'),
        soundIcon: document.getElementById('sound-icon'),
        musicBtn: document.getElementById('btn-music-toggle'),
        musicIcon: document.getElementById('music-icon'),
        musicNextBtn: document.getElementById('btn-music-next'),
        musicTrackDisplay: document.getElementById('music-track-display'),
        // Modal Voucher
        modalVoucher: document.getElementById('modal-voucher'),
        voucherPromoTitle: document.getElementById('voucher-promo-title'),
        voucherPromoName: document.getElementById('voucher-promo-name'),
        voucherDiceRoll: document.getElementById('voucher-dice-roll'),
        voucherTerminalId: document.getElementById('voucher-terminal-id'),
        voucherQrcode: document.getElementById('voucher-qrcode'),
        voucherWhatsappBtn: document.getElementById('voucher-whatsapp-btn'),
        btnVoucherPlayAgain: document.getElementById('btn-voucher-play-again'),
        // Modal Instrucciones
        modalInstructions: document.getElementById('modal-instructions'),
        btnInstructions: document.getElementById('btn-instructions'),
        closeInstructionsBtn: document.getElementById('close-instructions-btn'),
        closeInstructionsBtnBottom: document.getElementById('btn-close-instructions-bottom'),
        // Temporizador y Preview
        shotTimerContainer: document.getElementById('shot-timer-container'),
        shotTimerDisplay: document.getElementById('shot-timer-display'),
        previewModeBanner: document.getElementById('preview-mode-banner'),
        // Modal Pérdida de Vida
        lifeLossModal: document.getElementById('life-loss-modal'),
        lifeLossMessage: document.getElementById('life-loss-message'),
        lifeLossRemaining: document.getElementById('life-loss-remaining'),
        btnContinueLife: document.getElementById('btn-continue-life')
      };
    }

    renderDice(values) {
      const diceElements = [this.dom.die1, this.dom.die2, this.dom.die3];

      values.forEach((val, idx) => {
        const dieEl = diceElements[idx];
        if (!dieEl) return;

        const activePips = PIP_MAP[val] || [];
        const pips = dieEl.querySelectorAll('.pip');

        pips.forEach((pip, pIdx) => {
          const pipNum = pIdx + 1;
          pip.classList.toggle('active', activePips.includes(pipNum));
        });
      });

      const sum = values.reduce((a, b) => a + b, 0);
      if (this.dom.sumDisplay) this.dom.sumDisplay.textContent = `SUMA: ${sum}`;
    }

    animarLanzamiento(callback) {
      const dice = [this.dom.die1, this.dom.die2, this.dom.die3];
      dice.forEach(d => {
        if (d) d.classList.add('animate-shake');
      });

      // Efecto de caras cambiantes rápidas
      let ticks = 0;
      const interval = setInterval(() => {
        const randomValues = [
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1,
          Math.floor(Math.random() * 6) + 1
        ];
        this.renderDice(randomValues);
        ticks++;

        if (ticks >= 6) {
          clearInterval(interval);
          dice.forEach(d => {
            if (d) d.classList.remove('animate-shake');
          });
          if (callback) callback();
        }
      }, 70);
    }

    actualizarResultadoUI(resultado, intento, vidas) {
      if (this.dom.comboBadge) this.dom.comboBadge.textContent = resultado.badge;
      if (this.dom.currentPromoTitle) this.dom.currentPromoTitle.textContent = resultado.title;
      if (this.dom.currentPromoDesc) this.dom.currentPromoDesc.textContent = resultado.desc;
      if (this.dom.attemptDisplay) this.dom.attemptDisplay.textContent = `Tiro ${intento} de 3`;

      // Habilitar botones de acción con brillo esmeralda/oro neón
      if (this.dom.btnCashOut) {
        this.dom.btnCashOut.disabled = false;
        this.dom.btnCashOut.className = 'w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.7)] animate-glow-pulse transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer';
        this.dom.btnCashOut.innerHTML = `<span>🏆</span> <span>ASEGURAR Y CANJEAR: ${resultado.title}</span>`;
      }

      if (this.dom.btnReroll) {
        if (vidas > 0) {
          this.dom.btnReroll.disabled = false;
          this.dom.btnReroll.classList.remove('opacity-50', 'cursor-not-allowed');
        } else {
          this.dom.btnReroll.disabled = true;
          this.dom.btnReroll.classList.add('opacity-50', 'cursor-not-allowed');
        }
      }

      // Resaltar en la lista de combos
      if (this.dom.combosList) {
        const items = this.dom.combosList.querySelectorAll('.combo-item');
        items.forEach(item => {
          const tier = item.dataset.tier;
          item.classList.toggle('active-combo', tier === resultado.tier);
        });
      }
    }

    actualizarVidasUI(vidas) {
      if (this.dom.life1) this.dom.life1.classList.toggle('lost', vidas < 1);
      if (this.dom.life2) this.dom.life2.classList.toggle('lost', vidas < 2);
      if (this.dom.life3) this.dom.life3.classList.toggle('lost', vidas < 3);
      if (this.dom.livesLabel) this.dom.livesLabel.textContent = `${Math.max(0, vidas)}/3`;
    }

    mostrarModalVoucher(data) {
      if (!this.dom.modalVoucher) return;
      if (this.dom.voucherPromoTitle) this.dom.voucherPromoTitle.textContent = data.badge;
      if (this.dom.voucherPromoName) this.dom.voucherPromoName.textContent = data.title;
      if (this.dom.voucherDiceRoll) this.dom.voucherDiceRoll.textContent = `Dados: [ ${data.dice.join(' - ')} ] • Suma: ${data.sum}`;
      if (this.dom.voucherTerminalId) this.dom.voucherTerminalId.textContent = `${data.terminal} • SIG: ${data.sig.slice(0, 8)}...`;
      if (this.dom.voucherWhatsappBtn) this.dom.voucherWhatsappBtn.href = data.waUrl;

      if (this.dom.voucherQrcode) {
        this.dom.voucherQrcode.innerHTML = '';
        if (typeof QRCode !== 'undefined') {
          new QRCode(this.dom.voucherQrcode, {
            text: data.verificationUrl,
            width: 120,
            height: 120,
            colorDark: "#040814",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.M
          });
        }
      }

      this.dom.modalVoucher.classList.remove('hidden');
    }

    ocultarModalVoucher() {
      if (this.dom.modalVoucher) this.dom.modalVoucher.classList.add('hidden');
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
          ? `<div class="text-lg my-1.5 tracking-wider">${hearts}</div> No obtuviste la combinación esperada. Te quedan <span class="font-bold text-amber-300">${vidasRestantes} de 3 vidas</span>.` 
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
      if (this.previewInterval) clearInterval(this.previewInterval);
      this.previewInterval = setInterval(() => {
        this.animarLanzamiento();
      }, 1600);
    }

    ocultarModoPreview() {
      if (this.dom.previewModeBanner) this.dom.previewModeBanner.classList.add('hidden');
      if (this.previewInterval) {
        clearInterval(this.previewInterval);
        this.previewInterval = null;
      }
    }

    lanzarConfeti(esTrio = false) {
      if (!this.confettiInstance) return;
      this.confettiInstance({
        particleCount: esTrio ? 120 : 60,
        spread: esTrio ? 80 : 50,
        origin: { y: 0.6 }
      });
    }
  }

  return DadosViewClass;
});
