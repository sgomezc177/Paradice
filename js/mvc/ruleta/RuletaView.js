/**
 * RuletaView.js - Paradice Juegos (MVC - Ruleta Paradice)
 * Renderizado en Canvas 2D, dibujo de los 12 sectores, aguja indicadora y modales.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.RuletaView = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  class RuletaViewClass {
    constructor() {
      this.dom = {};
      this.ctx = null;
      this.confettiInstance = window.confetti || null;
    }

    init() {
      this.cacheDOM();
      if (this.dom.canvas) {
        this.ctx = this.dom.canvas.getContext('2d');
      }
    }

    cacheDOM() {
      this.dom = {
        canvas: document.getElementById('wheel-canvas'),
        pointer: document.getElementById('wheel-pointer'),
        btnSpinCenter: document.getElementById('btn-spin-center'),
        btnSpinWheel: document.getElementById('btn-spin-wheel'),
        btnRespin: document.getElementById('btn-respin-life'),
        btnCashOut: document.getElementById('btn-cash-out'),
        statusDisplay: document.getElementById('wheel-status-display'),
        attemptDisplay: document.getElementById('spin-attempt-display'),
        resultBadge: document.getElementById('wheel-result-badge'),
        currentPromoTitle: document.getElementById('current-promo-title'),
        currentPromoDesc: document.getElementById('current-promo-desc'),
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
        voucherSlotInfo: document.getElementById('voucher-slot-info'),
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

    dibujarRuleta(angle, sectores) {
      if (!this.ctx || !this.dom.canvas) return;

      const { width, height } = this.dom.canvas;
      const cx = width / 2;
      const cy = height / 2;
      const radius = cx - 12;
      const arc = (2 * Math.PI) / sectores.length;

      this.ctx.clearRect(0, 0, width, height);

      sectores.forEach((sector, i) => {
        const sectorAngle = angle + i * arc;

        // Cuña del sector
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy);
        this.ctx.arc(cx, cy, radius, sectorAngle, sectorAngle + arc);
        this.ctx.fillStyle = sector.color;
        this.ctx.fill();

        // Borde oscuro entre sectores
        this.ctx.strokeStyle = '#040814';
        this.ctx.lineWidth = 4;
        this.ctx.stroke();

        // Texto del sector rotado
        this.ctx.save();
        this.ctx.translate(cx, cy);
        this.ctx.rotate(sectorAngle + arc / 2);
        this.ctx.textAlign = 'right';
        this.ctx.fillStyle = sector.textDark ? '#040814' : '#ffffff';
        this.ctx.font = 'bold 22px Montserrat, sans-serif';
        this.ctx.shadowColor = sector.textDark ? 'transparent' : 'rgba(0,0,0,0.6)';
        this.ctx.shadowBlur = 4;
        this.ctx.fillText(sector.label, radius - 24, 8);
        this.ctx.restore();
      });

      // Anillo externo de escarcha neón
      this.ctx.beginPath();
      this.ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      this.ctx.strokeStyle = '#38bdf8';
      this.ctx.lineWidth = 6;
      this.ctx.stroke();

      // Bulbos decorativos perimetrales
      const numPins = sectores.length * 2;
      for (let p = 0; p < numPins; p++) {
        const pinAngle = angle + (p * 2 * Math.PI / numPins);
        const px = cx + (radius - 2) * Math.cos(pinAngle);
        const py = cy + (radius - 2) * Math.sin(pinAngle);

        this.ctx.beginPath();
        this.ctx.arc(px, py, 4.5, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#ffffff';
        this.ctx.shadowColor = '#00f0ff';
        this.ctx.shadowBlur = 8;
        this.ctx.fill();
      }
    }

    moverAguja() {
      if (!this.dom.pointer) return;
      this.dom.pointer.style.transform = 'translateX(-50%) rotate(-18deg)';
      setTimeout(() => {
        if (this.dom.pointer) {
          this.dom.pointer.style.transform = 'translateX(-50%) rotate(0deg)';
        }
      }, 50);
    }

    actualizarEstadoGiro(girando) {
      if (this.dom.btnSpinWheel) {
        this.dom.btnSpinWheel.disabled = girando;
        this.dom.btnSpinWheel.classList.toggle('opacity-50', girando);
      }
      if (this.dom.btnSpinCenter) {
        this.dom.btnSpinCenter.disabled = girando;
        this.dom.btnSpinCenter.classList.toggle('opacity-50', girando);
      }
      if (this.dom.statusDisplay) {
        this.dom.statusDisplay.textContent = girando ? 'RULETA GIRANDO...' : 'LISTO PARA GIRAR';
      }
    }

    actualizarResultadoUI(sector, intento, vidas) {
      if (this.dom.resultBadge) {
        this.dom.resultBadge.textContent = sector.title;
      }
      if (this.dom.currentPromoTitle) {
        this.dom.currentPromoTitle.textContent = sector.title;
      }
      if (this.dom.currentPromoDesc) {
        this.dom.currentPromoDesc.textContent = sector.isLose 
          ? 'Cayó en casilla de Hielo Roto. ¡Puedes reintentar con otra vida!' 
          : '¡Premio asegurado! Retira ahora con cupón QR o WhatsApp.';
      }
      if (this.dom.attemptDisplay) {
        this.dom.attemptDisplay.textContent = `${intento} de 3`;
      }

      // Habilitar cobro con brillo neón si no es casilla perdedora
      if (this.dom.btnCashOut) {
        const puedeCobrar = !sector.isLose;
        this.dom.btnCashOut.disabled = !puedeCobrar;
        if (puedeCobrar) {
          this.dom.btnCashOut.className = 'w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.7)] animate-glow-pulse transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer';
          this.dom.btnCashOut.innerHTML = `<span>🏆</span> <span>ASEGURAR Y CANJEAR: ${sector.title}</span>`;
        } else {
          this.dom.btnCashOut.className = 'w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-slate-500 font-black text-xs sm:text-sm uppercase tracking-wider border border-slate-700 transition-all duration-300 flex items-center justify-center gap-2 cursor-not-allowed shadow-none';
          this.dom.btnCashOut.innerHTML = '<span>🍸</span> <span>ASEGURAR PROMO Y CANJEAR</span>';
        }
      }

      // Habilitar re-giro si quedan vidas
      if (this.dom.btnRespin) {
        const puedeReintentar = vidas > 0;
        this.dom.btnRespin.disabled = !puedeReintentar;
        this.dom.btnRespin.classList.toggle('opacity-50', !puedeReintentar);
        this.dom.btnRespin.classList.toggle('cursor-not-allowed', !puedeReintentar);
      }
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
          ? `<div class="text-lg my-1.5 tracking-wider">${hearts}</div> Cayó en casilla de Hielo Roto. Te quedan <span class="font-bold text-amber-300">${vidasRestantes} de 3 vidas</span>.` 
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
      const sectores = root.RuletaConfig ? root.RuletaConfig.SECTORES : [];
      let demoAngle = 0;
      this.previewInterval = setInterval(() => {
        demoAngle += 0.08;
        this.dibujarRuleta(demoAngle, sectores);
      }, 30);
    }

    ocultarModoPreview() {
      if (this.dom.previewModeBanner) this.dom.previewModeBanner.classList.add('hidden');
      if (this.previewInterval) {
        clearInterval(this.previewInterval);
        this.previewInterval = null;
      }
      const sectores = root.RuletaConfig ? root.RuletaConfig.SECTORES : [];
      this.dibujarRuleta(0, sectores);
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
      if (this.dom.voucherSlotInfo) this.dom.voucherSlotInfo.textContent = `Casilla Ruleta: ${data.label}`;
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

    lanzarConfeti(esJackpot = false) {
      if (!this.confettiInstance) return;
      this.confettiInstance({
        particleCount: esJackpot ? 120 : 60,
        spread: esJackpot ? 80 : 55,
        origin: { y: 0.6 }
      });
    }
  }

  return RuletaViewClass;
});
