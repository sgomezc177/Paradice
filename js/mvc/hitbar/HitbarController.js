/**
 * HitbarController.js - Paradice Juegos (MVC - Hit Bar Rush 2.0)
 * Controlador que orquesta la precisión del jugador, el motor de audio,
 * la máquina de estados, el canje de premios (Cash Out) y códigos QR oficiales,
 * temporizador de 30s tras perder la primera vida y detector de inactividad.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.HitbarController = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  class HitbarControllerClass {
    constructor() {
      this.model = new root.HitbarModel();
      this.view = new root.HitbarView();
      this.audio = root.audioManager;
      this.security = root.SecurityService;
      this.timerService = root.TimerService;
      this.isHitCooldown = false;
    }

    init() {
      this.view.init();
      this.bindEvents();
      this.view.actualizarVidasUI(this.model.vidas);
      this.actualizarAudioUI();

      // Escuchar cambios de pista de música
      window.addEventListener('audiotrackchange', (e) => {
        if (this.view.dom.musicTrackDisplay) {
          this.view.dom.musicTrackDisplay.textContent = `🎵 ${e.detail.title}`;
        }
      });


      this.prepararNivelActual();

      if (this.model.vidas < 3 && this.model.vidas > 0) {
        this.iniciarTemporizadorTiro();
      }
    }

    iniciarTemporizadorTiro() {
      if (!this.timerService || this.model.vidas >= 3 || this.model.vidas <= 0) return;
      this.timerService.startShotTimer(this.view.dom.shotTimerContainer, () => {
        this.audio.playHitMiss();
        this.view.stopAnimation();
        this.model.consumirVida();
        this.view.actualizarVidasUI(this.model.vidas);
        this.view.mostrarModalFallo(this.model.vidas);
      });
    }

    detenerTemporizadorTiro() {
      if (this.timerService) {
        this.timerService.stopShotTimer(this.view.dom.shotTimerContainer);
      }
    }

    bindEvents() {
      // 1. Botón de Parada / Impacto
      if (this.view.dom.btnHit) {
        this.view.dom.btnHit.addEventListener('click', () => {
          this.handleHitAttempt();
        });
      }

      // 2. Botón Cash-Out / Asegurar Promo
      if (this.view.dom.btnCashOut) {
        this.view.dom.btnCashOut.addEventListener('click', () => {
          this.asegurarPromoYCanjear();
        });
      }

      // 3. Volver a Jugar en Cupón
      if (this.view.dom.btnVoucherPlayAgain) {
        this.view.dom.btnVoucherPlayAgain.addEventListener('click', () => {
          this.view.ocultarModalVoucher();
          this.model.reiniciarVidas();
          this.model.resetProgression();
          this.view.actualizarVidasUI(this.model.vidas);
          this.detenerTemporizadorTiro();
          this.prepararNivelActual();
        });
      }

      // 4. Modal de Fallo
      if (this.view.dom.btnMissAction) {
        this.view.dom.btnMissAction.addEventListener('click', () => {
          this.view.ocultarModalFallo();
          if (this.model.vidas > 0) {
            this.prepararNivelActual();
            this.iniciarTemporizadorTiro();
          } else {
            this.model.reiniciarVidas();
            this.model.resetProgression();
            this.view.actualizarVidasUI(this.model.vidas);
            this.detenerTemporizadorTiro();
            this.prepararNivelActual();
          }
        });
      }

      // 5. Controles de Audio
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

      // 6. Modal Instrucciones
      if (this.view.dom.btnInstructions) {
        this.view.dom.btnInstructions.addEventListener('click', () => {
          if (this.view.dom.modalInstructions) this.view.dom.modalInstructions.classList.remove('hidden');
        });
      }

      if (this.view.dom.closeInstructionsBtn) {
        this.view.dom.closeInstructionsBtn.addEventListener('click', () => {
          if (this.view.dom.modalInstructions) this.view.dom.modalInstructions.classList.add('hidden');
        });
      }

      if (this.view.dom.closeInstructionsBtnBottom) {
        this.view.dom.closeInstructionsBtnBottom.addEventListener('click', () => {
          if (this.view.dom.modalInstructions) this.view.dom.modalInstructions.classList.add('hidden');
        });
      }

      // Atajo de Teclado: Barra Espaciadora para frenar
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.key === ' ') {
          if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
          e.preventDefault();

          if (this.view.dom.modalMiss && !this.view.dom.modalMiss.classList.contains('hidden')) {
            this.view.dom.btnMissAction?.click();
            return;
          }

          if (this.view.dom.modalVoucher && !this.view.dom.modalVoucher.classList.contains('hidden')) {
            this.view.dom.btnVoucherPlayAgain?.click();
            return;
          }

          this.handleHitAttempt();
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

    prepararNivelActual() {
      const levelData = this.model.getCurrentLevel();

      this.view.updateTargetUI(levelData);
      this.view.renderStrip(levelData.targetId, levelData.targetIcon);
      this.view.updateLadderAndCashOut(
        this.model.getAllLevels(),
        this.model.currentLevelIndex,
        this.model.accumulatedPromo
      );

      // Iniciar recorrido continuo
      this.view.startAnimation(levelData.speed);
      this.isHitCooldown = false;
    }

    handleHitAttempt() {
      if (this.isHitCooldown) return;
      this.isHitCooldown = true;

      const currentLevel = this.model.getCurrentLevel();
      // Evaluar impacto físico contra la hitbox
      const hitSuccess = this.view.checkHitAccuracy(currentLevel.targetId);
      this.view.flashHitFeedback(hitSuccess);

      if (hitSuccess) {
        // Acierto: registrar progresión
        this.audio.playHitSuccess(currentLevel.level);
        const levelUpResult = this.model.advanceLevel();

        // Pausar animación con destello
        this.view.stopAnimation();

        if (levelUpResult.hasWonMax) {
          // Victoria Máxima: alcanzar Jackpot de la escalera
          this.audio.playJackpot();
          this.view.lanzarConfeti();
          setTimeout(() => {
            this.asegurarPromoYCanjear();
          }, 600);
        } else {
          // Celebración de acierto antes del siguiente nivel
          setTimeout(() => {
            this.prepararNivelActual();
            if (this.model.vidas < 3) {
              this.iniciarTemporizadorTiro();
            }
          }, 450);
        }
      } else {
        // Fallo: consumir vida
        this.detenerTemporizadorTiro();
        this.audio.playHitMiss();
        this.view.stopAnimation();
        this.model.consumirVida();
        this.view.actualizarVidasUI(this.model.vidas);

        setTimeout(() => {
          this.view.mostrarModalFallo(this.model.vidas);
        }, 500);
      }
    }

    asegurarPromoYCanjear() {
      this.detenerTemporizadorTiro();
      const promo = this.model.accumulatedPromo || this.model.getCurrentLevel();
      this.view.stopAnimation();
      this.audio.playWinSong();
      this.view.lanzarConfeti();

      // Generar voucher firmado con SecurityService
      const terminal = this.security ? this.security.getOrCreateTerminalId() : (`TERM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);
      const fecha = this.security ? this.security.getFechaActual() : new Date().toISOString().slice(0, 10);
      const hora = this.security ? this.security.getHoraActual() : new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const intento = Math.min(this.model.intentoActual, 3);
      const sig = this.security ? this.security.calcularFirma(intento, promo.title, fecha, hora, terminal) : (`SIG-${Date.now()}`);

      const verificationUrl = this.security ? this.security.buildVerificationUrl({
        intento,
        premio: promo.title,
        codigo: '⚡🍸',
        fecha,
        hora,
        dispositivo: 'Hit Bar Rush 2.0',
        terminal,
        sig
      }) : window.location.href;

      const waUrl = this.security ? this.security.buildWhatsAppUrl('Hit Bar Rush 2.0', promo.title, terminal, sig) : '#';

      this.view.mostrarModalVoucher({
        badge: promo.badge,
        title: promo.title,
        level: this.model.getCurrentLevel().level,
        bpm: this.model.getCurrentLevel().bpm,
        terminal,
        sig,
        verificationUrl,
        waUrl
      });
    }
  }

  return HitbarControllerClass;
});
