/**
 * RuletaController.js - Paradice Juegos (MVC - Ruleta Paradice)
 * Controlador que orquesta la física inercial de la ruleta, audio y vouchers QR.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.RuletaController = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  class RuletaControllerClass {
    constructor() {
      this.model = new root.RuletaModel();
      this.view = new root.RuletaView();
      this.audio = root.audioManager;
      this.security = root.SecurityService;
      this.timerService = root.TimerService;
      this.isSpinning = false;
      this.currentAngle = 0;
      this.lastSectorIdx = -1;
    }

    init() {
      this.view.init();
      this.bindEvents();
      this.view.dibujarRuleta(this.currentAngle, this.model.getSectores());
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
            if (!this.isSpinning) {
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
      // 1. Botones de Giro
      if (this.view.dom.btnSpinWheel) {
        this.view.dom.btnSpinWheel.addEventListener('click', () => {
          this.iniciarGiro();
        });
      }
      if (this.view.dom.btnSpinCenter) {
        this.view.dom.btnSpinCenter.addEventListener('click', () => {
          this.iniciarGiro();
        });
      }

      // 2. Re-giro con otra vida
      if (this.view.dom.btnRespin) {
        this.view.dom.btnRespin.addEventListener('click', () => {
          if (this.model.vidas > 0) {
            this.iniciarGiro();
          }
        });
      }

      // 3. Cash-out / Cobro
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

          this.iniciarGiro();
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

    iniciarGiro() {
      if (this.isSpinning) return;

      this.detenerTemporizadorTiro();

      if (this.model.vidas <= 0) {
        this.model.reiniciarVidas();
        this.view.actualizarVidasUI(this.model.vidas);
      }

      this.isSpinning = true;
      this.model.consumirVida();
      this.view.actualizarVidasUI(this.model.vidas);
      this.view.actualizarEstadoGiro(true);

      // Física de giro: vueltas completas aleatorias + desplazamiento angular
      const extraVueltas = 5 + Math.floor(Math.random() * 4); // 5 a 8 vueltas completas
      const randRadianes = Math.random() * 2 * Math.PI;
      const anguloTotal = extraVueltas * 2 * Math.PI + randRadianes;
      const duracionMs = 4500 + Math.random() * 1000;

      const startAngle = this.currentAngle;
      const startTime = performance.now();

      // Función de aceleración suave con frenado natural (Cubic Ease Out)
      const easeOutCubic = (t) => (--t) * t * t + 1;

      const step = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duracionMs, 1);
        const easedProgress = easeOutCubic(progress);

        this.currentAngle = startAngle + anguloTotal * easedProgress;
        this.view.dibujarRuleta(this.currentAngle, this.model.getSectores());

        // Detección de paso de alfileres para ticks de sonido y movimiento de aguja
        const { index: currentSectorIdx } = this.model.getSectorAtAngle(this.currentAngle);
        if (currentSectorIdx !== this.lastSectorIdx) {
          this.lastSectorIdx = currentSectorIdx;
          this.audio.playRouletteTick();
          this.view.moverAguja();
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          this.finalizarGiro();
        }
      };

      requestAnimationFrame(step);
    }

    finalizarGiro() {
      this.isSpinning = false;
      this.view.actualizarEstadoGiro(false);

      const { sector } = this.model.getSectorAtAngle(this.currentAngle);
      this.model.ultimoResultado = sector;

      this.view.actualizarResultadoUI(sector, this.model.intentoActual, this.model.vidas);

      if (sector.isLose) {
        this.audio.playFailSound();
        setTimeout(() => {
          this.view.mostrarModalPerdidaVida(this.model.vidas, () => {
            if (this.model.vidas > 0) {
              this.iniciarTemporizadorTiro();
            } else {
              this.model.reiniciarVidas();
              this.view.actualizarVidasUI(this.model.vidas);
            }
          });
        }, 500);
      } else {
        const esJackpot = sector.badge === '¡PROMO 2x1!';
        if (esJackpot) {
          this.audio.playJackpot();
          this.view.lanzarConfeti(true);
        } else {
          this.audio.playWinDiscount();
          this.view.lanzarConfeti(false);
        }

        if (this.model.vidas > 0) {
          this.iniciarTemporizadorTiro();
        }
      }
    }

    asegurarPromoYCanjear() {
      if (!this.model.ultimoResultado || this.model.ultimoResultado.isLose) return;
      this.detenerTemporizadorTiro();
      const promo = this.model.ultimoResultado;

      this.audio.playWinSong();
      this.view.lanzarConfeti(promo.badge === '¡PROMO 2x1!');

      const terminal = this.security.getOrCreateTerminalId();
      const fecha = this.security.getFechaActual();
      const hora = this.security.getHoraActual();
      const intento = Math.min(this.model.intentoActual, 3);
      const sig = this.security.calcularFirma(intento, promo.title, fecha, hora, terminal);

      const verificationUrl = this.security.buildVerificationUrl({
        intento,
        premio: promo.title,
        codigo: '🎡🍸',
        fecha,
        hora,
        dispositivo: 'Ruleta Paradice',
        terminal,
        sig
      });

      const waUrl = this.security.buildWhatsAppUrl('Ruleta Paradice', promo.title, terminal, sig);

      this.view.mostrarModalVoucher({
        badge: promo.badge,
        title: promo.title,
        label: promo.label,
        terminal,
        sig,
        verificationUrl,
        waUrl
      });
    }
  }

  return RuletaControllerClass;
});
