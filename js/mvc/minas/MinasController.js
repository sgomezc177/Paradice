/**
 * MinasController.js - Paradice Juegos (MVC - Minas Paradice)
 * Controlador que orquesta la interacción del jugador, transiciones de estado, audio, cupones QR,
 * temporizador de tiro de 30s tras perder la primera vida y detector de inactividad.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.MinasController = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  class MinasControllerClass {
    constructor() {
      this.model = new root.MinasModel();
      this.view = new root.MinasView();
      this.audio = root.audioManager;
      this.security = root.SecurityService;
      this.timerService = root.TimerService;
      this.roundLifeConsumed = false;
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

      // Inicializar detector de inactividad de 30s
      if (this.timerService && this.timerService.initInactivityDetector) {
        this.timerService.initInactivityDetector(
          () => {
            this.view.mostrarModoPreview();
          },
          () => {
            this.view.ocultarModoPreview();
          }
        );
      }

      this.iniciarNuevaRonda();

      if (this.model.vidas < 3 && this.model.vidas > 0) {
        this.iniciarTemporizadorTiro();
      }
    }

    iniciarTemporizadorTiro() {
      if (!this.timerService || this.model.vidas >= 3 || this.model.vidas <= 0) return;
      this.timerService.startShotTimer(this.view.dom.shotTimerContainer, () => {
        this.audio.playBombExplode();
        this.model.consumirVida();
        this.view.actualizarVidasUI(this.model.vidas);
        this.view.mostrarModalExplosion(this.model.vidas);
      });
    }

    detenerTemporizadorTiro() {
      if (this.timerService) {
        this.timerService.stopShotTimer(this.view.dom.shotTimerContainer);
      }
    }

    bindEvents() {
      // 1. Selector de número de minas
      if (this.view.dom.minesSelect) {
        this.view.dom.minesSelect.addEventListener('change', (e) => {
          const count = parseInt(e.target.value, 10);
          this.iniciarNuevaRonda(count);
        });
      }

      // 2. Botón Cash-Out
      if (this.view.dom.cashOutBtn) {
        this.view.dom.cashOutBtn.addEventListener('click', () => {
          this.asegurarPromoYCanjear();
        });
      }

      // 3. Volver a Jugar en Cupón
      if (this.view.dom.btnVoucherPlayAgain) {
        this.view.dom.btnVoucherPlayAgain.addEventListener('click', () => {
          this.view.ocultarModalVoucher();
          this.model.reiniciarVidas();
          this.view.actualizarVidasUI(this.model.vidas);
          this.detenerTemporizadorTiro();
          this.iniciarNuevaRonda();
        });
      }

      // 4. Acción de Modal Explosión
      if (this.view.dom.btnBlastAction) {
        this.view.dom.btnBlastAction.addEventListener('click', () => {
          this.view.ocultarModalExplosion();
          if (this.model.vidas > 0) {
            this.iniciarNuevaRonda();
            this.iniciarTemporizadorTiro();
          } else {
            this.model.reiniciarVidas();
            this.view.actualizarVidasUI(this.model.vidas);
            this.detenerTemporizadorTiro();
            this.iniciarNuevaRonda();
          }
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

      // Atajo de Teclado: Barra Espaciadora para asegurar premio
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.key === ' ') {
          if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
          e.preventDefault();

          if (this.view.dom.modalBlast && !this.view.dom.modalBlast.classList.contains('hidden')) {
            this.view.dom.btnBlastAction?.click();
            return;
          }

          if (this.view.dom.modalVoucher && !this.view.dom.modalVoucher.classList.contains('hidden')) {
            this.view.dom.btnVoucherPlayAgain?.click();
            return;
          }

          if (this.model.safeHits > 0 && !this.model.gameOver) {
            this.asegurarPromoYCanjear();
          }
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

    iniciarNuevaRonda(minesCount = null) {
      this.roundLifeConsumed = false;
      this.model.iniciarRonda(minesCount);

      const totalSeguras = this.model.boardSize - this.model.minesCount;
      this.view.renderBoard((index, tileEl) => this.handleTileClick(index, tileEl));
      this.view.renderLadder(this.model.getPromoTiers(), 0);
      this.view.actualizarContadores(0, totalSeguras, null);
    }

    handleTileClick(index, tileEl) {
      if (this.model.gameOver) return;

      // Consumir vida de la ronda en el primer destape
      if (!this.roundLifeConsumed) {
        this.roundLifeConsumed = true;
        this.model.consumirVida();
        this.view.actualizarVidasUI(this.model.vidas);
        if (this.model.vidas < 3 && this.model.vidas > 0) {
          this.iniciarTemporizadorTiro();
        }
      }

      const resultado = this.model.revelarCasilla(index);
      if (!resultado) return;

      if (resultado.tipo === 'MINA') {
        this.detenerTemporizadorTiro();
        this.audio.playIceShatter();
        this.view.revelarMina(tileEl, resultado.allMines);

        setTimeout(() => {
          this.view.mostrarModalExplosion(this.model.vidas);
        }, 700);
      } else {
        this.audio.playIceClink(resultado.safeHits);
        this.view.revelarCasillaSegura(tileEl, resultado.icon, resultado.safeHits);

        const totalSeguras = this.model.boardSize - this.model.minesCount;
        this.view.actualizarContadores(resultado.safeHits, totalSeguras, resultado.promoActual);
        this.view.renderLadder(this.model.getPromoTiers(), resultado.safeHits);

        if (resultado.victoriaTotal) {
          this.asegurarPromoYCanjear();
        }
      }
    }

    asegurarPromoYCanjear() {
      this.detenerTemporizadorTiro();
      const promo = this.model.obtenerPromoActual();
      if (!promo) return;

      this.model.gameOver = true;
      this.audio.playWinSong();
      this.view.lanzarConfeti();

      // Generar voucher criptográfico con SecurityService
      const terminal = this.security.getOrCreateTerminalId();
      const fecha = this.security.getFechaActual();
      const hora = this.security.getHoraActual();
      const intento = Math.min(this.model.intentoActual, 3);
      const sig = this.security.calcularFirma(intento, promo.title, fecha, hora, terminal);

      const verificationUrl = this.security.buildVerificationUrl({
        intento,
        premio: promo.title,
        codigo: '🍧💣',
        fecha,
        hora,
        dispositivo: 'Minas Paradice',
        terminal,
        sig
      });

      const waUrl = this.security.buildWhatsAppUrl('Minas Paradice', promo.title, terminal, sig);

      this.view.mostrarModalVoucher({
        title: promo.title,
        desc: promo.desc,
        hits: this.model.safeHits,
        terminal,
        sig,
        verificationUrl,
        waUrl
      });
    }
  }

  return MinasControllerClass;
});
