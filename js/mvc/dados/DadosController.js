/**
 * DadosController.js - Paradice Juegos (MVC - Dice Battle)
 * Controlador que orquesta las tiradas de dados, audio eurodance y vouchers QR.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.DadosController = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  class DadosControllerClass {
    constructor() {
      this.model = new root.DadosModel();
      this.view = new root.DadosView();
      this.audio = root.audioManager;
      this.security = root.SecurityService;
      this.timerService = root.TimerService;
      this.isRolling = false;
    }

    init() {
      this.view.init();
      this.bindEvents();
      this.view.renderDice(this.model.currentDice);
      this.view.actualizarVidasUI(this.model.vidas);
      this.actualizarAudioUI();

      // Escuchar cambios de pista de música
      window.addEventListener('audiotrackchange', (e) => {
        if (this.view.dom.musicTrackDisplay) {
          this.view.dom.musicTrackDisplay.textContent = `🎵 ${e.detail.title}`;
        }
      });

      // Inicializar detector de inactividad de 30s para Modo Preview
      if (this.timerService && this.timerService.initInactivityDetector) {
        this.timerService.initInactivityDetector(
          () => {
            if (!this.isRolling) {
              this.view.mostrarModoPreview();
            }
          },
          () => {
            this.view.ocultarModoPreview();
          }
        );
      }

      // Si ya hay vidas consumidas (< 3 y > 0), iniciar temporizador
      if (this.model.vidas < 3 && this.model.vidas > 0) {
        this.iniciarTemporizadorTiro();
      }
    }

    bindEvents() {
      // 1. Lanzar dados
      if (this.view.dom.btnRoll) {
        this.view.dom.btnRoll.addEventListener('click', () => {
          this.ejecutarLanzamiento();
        });
      }

      // 2. Re-lanzar con otra vida
      if (this.view.dom.btnReroll) {
        this.view.dom.btnReroll.addEventListener('click', () => {
          if (this.model.vidas > 0) {
            this.ejecutarLanzamiento();
          }
        });
      }

      // 3. Cobrar / Cash-Out
      if (this.view.dom.btnCashOut) {
        this.view.dom.btnCashOut.addEventListener('click', () => {
          this.asegurarPromoYCanjear();
        });
      }

      // 4. Volver a jugar desde cupón
      if (this.view.dom.btnVoucherPlayAgain) {
        this.view.dom.btnVoucherPlayAgain.addEventListener('click', () => {
          this.view.ocultarModalVoucher();
          this.model.reiniciarVidas();
          this.view.actualizarVidasUI(this.model.vidas);
          this.view.renderDice([1, 2, 3]);
        });
      }

      // 5. Audio
      if (this.view.dom.soundBtn) {
        this.view.dom.soundBtn.addEventListener('click', () => {
          this.audio.toggleSfx();
          this.actualizarAudioUI();
        });
      }

      if (this.view.dom.musicBtn) {
        this.view.dom.musicBtn.addEventListener('click', () => {
          this.audio.toggleMusic();
          this.actualizarAudioUI();
        });
      }

      if (this.view.dom.musicNextBtn) {
        this.view.dom.musicNextBtn.addEventListener('click', () => {
          this.audio.nextTrack();
          this.actualizarAudioUI();
        });
      }

      // 6. Instrucciones
      if (this.view.dom.btnInstructions && this.view.dom.modalInstructions) {
        this.view.dom.btnInstructions.addEventListener('click', () => {
          this.view.dom.modalInstructions.classList.remove('hidden');
        });
      }
      if (this.view.dom.closeInstructionsBtn && this.view.dom.modalInstructions) {
        this.view.dom.closeInstructionsBtn.addEventListener('click', () => {
          this.view.dom.modalInstructions.classList.add('hidden');
        });
      }
      if (this.view.dom.closeInstructionsBtnBottom && this.view.dom.modalInstructions) {
        this.view.dom.closeInstructionsBtnBottom.addEventListener('click', () => {
          this.view.dom.modalInstructions.classList.add('hidden');
        });
      }

      // 7. Atajo Espacio
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.key === ' ') {
          if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
          e.preventDefault();

          if (this.view.dom.modalInstructions && !this.view.dom.modalInstructions.classList.contains('hidden')) {
            this.view.dom.modalInstructions.classList.add('hidden');
            return;
          }
          if (this.view.dom.modalVoucher && !this.view.dom.modalVoucher.classList.contains('hidden')) {
            this.view.dom.btnVoucherPlayAgain?.click();
            return;
          }

          this.ejecutarLanzamiento();
        }
      });
    }

    actualizarAudioUI() {
      if (this.view.dom.soundIcon) {
        this.view.dom.soundIcon.textContent = this.audio.isSfxMuted() ? '🔇' : '🔊';
      }
      if (this.view.dom.musicIcon) {
        this.view.dom.musicIcon.textContent = this.audio.isMusicMuted() ? '🔇' : '🎵';
      }
      if (this.view.dom.musicTrackDisplay) {
        this.view.dom.musicTrackDisplay.textContent = `🎵 ${this.audio.getTrackTitle()}`;
      }
    }

    iniciarTemporizadorTiro() {
      if (!this.timerService || this.model.vidas >= 3 || this.model.vidas <= 0) return;
      this.timerService.startShotTimer(this.view.dom.shotTimerContainer, () => {
        // Expiraron los 30 segundos
        this.audio.playFailSound();
        this.model.consumirVida();
        this.view.actualizarVidasUI(this.model.vidas);

        this.view.mostrarModalPerdidaVida(this.model.vidas, () => {
          if (this.model.vidas > 0) {
            this.iniciarTemporizadorTiro();
          } else {
            this.model.reiniciarVidas();
            this.view.actualizarVidasUI(this.model.vidas);
          }
        });
      });
    }

    detenerTemporizadorTiro() {
      if (this.timerService) {
        this.timerService.stopShotTimer(this.view.dom.shotTimerContainer);
      }
    }

    ejecutarLanzamiento() {
      if (this.isRolling) return;

      this.detenerTemporizadorTiro();

      if (this.model.vidas <= 0) {
        this.model.reiniciarVidas();
        this.view.actualizarVidasUI(this.model.vidas);
      }

      this.isRolling = true;
      this.model.consumirVida();
      this.view.actualizarVidasUI(this.model.vidas);

      this.audio.playDiceShake();

      this.view.animarLanzamiento(() => {
        const { dice, resultado } = this.model.lanzarDados();
        this.view.renderDice(dice);
        this.view.actualizarResultadoUI(resultado, this.model.intentoActual, this.model.vidas);
        this.isRolling = false;

        if (resultado.esMayor) {
          this.audio.playWinSong();
          this.view.lanzarConfeti(true);
        } else {
          this.audio.playWinDiscount();
        }

        if (this.model.vidas > 0) {
          this.iniciarTemporizadorTiro();
        } else {
          setTimeout(() => {
            this.view.mostrarModalPerdidaVida(0, () => {
              this.model.reiniciarVidas();
              this.view.actualizarVidasUI(this.model.vidas);
            });
          }, 800);
        }
      });
    }

    asegurarPromoYCanjear() {
      if (!this.model.ultimoResultado) return;
      this.detenerTemporizadorTiro();
      const promo = this.model.ultimoResultado;

      this.audio.playWinSong();
      this.view.lanzarConfeti(promo.esMayor);

      const terminal = this.security.getOrCreateTerminalId();
      const fecha = this.security.getFechaActual();
      const hora = this.security.getHoraActual();
      const intento = Math.min(this.model.intentoActual, 3);
      const sig = this.security.calcularFirma(intento, promo.title, fecha, hora, terminal);

      const verificationUrl = this.security.buildVerificationUrl({
        intento,
        premio: promo.title,
        codigo: '🎲🍸',
        fecha,
        hora,
        dispositivo: 'Dice Battle Paradice',
        terminal,
        sig
      });

      const waUrl = this.security.buildWhatsAppUrl('Dice Battle Paradice', promo.title, terminal, sig);

      const sum = this.model.currentDice.reduce((a, b) => a + b, 0);

      this.view.mostrarModalVoucher({
        badge: promo.badge,
        title: promo.title,
        dice: this.model.currentDice,
        sum,
        terminal,
        sig,
        verificationUrl,
        waUrl
      });
    }
  }

  return DadosControllerClass;
});
