/**
 * SlotController.js - Paradice Juegos (MVC - Tragamonedas)
 * Controlador que orquesta el flujo del juego, eventos de usuario, máquina de estados,
 * sistema de audio, escalada piramidal, modo interactivo Hit Bar (parada columna a columna),
 * temporizador de tiro (30s) y detector de inactividad para modo preview.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.SlotController = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  class SlotControllerClass {
    constructor() {
      this.model = new root.SlotModel();
      this.view = new root.SlotView();
      this.audio = root.audioManager;
      this.timerService = root.TimerService;
      this.autoSpinActivo = false;
      this.autoSpinTimer = null;
      this.isSpinning = false;
      this.ultimoResultadoPremio = null;

      // Estado Minijuego Hit Bar (parada columna por columna)
      this.isHitBarActive = false;
      this.hitBarColumnaActual = 0;
      this.hitBarAciertos = 0;
      this.isStoppingHitBarCol = false;
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


      // Si ya hay vidas consumidas al recargar (< 3 y > 0), iniciar temporizador
      if (this.model.vidas < 3 && this.model.vidas > 0) {
        this.iniciarTemporizadorTiro();
      }
    }

    bindEvents() {
      // 1. Botón de Giro / Detener Hit Bar
      if (this.view.dom.spinBtn) {
        this.view.dom.spinBtn.addEventListener('click', () => {
          if (this.isHitBarActive) {
            this.detenerPasoHitBar();
          } else {
            this.realizarTirada();
          }
        });
      }

      // 2. Control de Audio
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

      if (this.view.dom.muteBtn) {
        this.view.dom.muteBtn.addEventListener('click', () => {
          this.audio.toggleSfx();
          this.actualizarAudioUI();
        });
      }

      // 3. Auto Spin
      if (this.view.dom.autoSpinBtn) {
        this.view.dom.autoSpinBtn.addEventListener('click', () => {
          this.toggleAutoSpin();
        });
      }

      // 4. Modales y Reclamar Premio
      if (this.view.dom.claimPrizeBtn) {
        this.view.dom.claimPrizeBtn.addEventListener('click', () => {
          this.reclamarPremioActual();
        });
      }

      // Descartar premio: NO gira automáticamente, el jugador debe tirar de forma manual
      if (this.view.dom.retrySpinBtn) {
        this.view.dom.retrySpinBtn.addEventListener('click', () => {
          this.view.ocultarPopoutGanador();
          this.view.limpiarTorrePagos();
          this.ultimoResultadoPremio = null;

          if (this.model.vidas > 0) {
            this.view.restablecerBotonGirar();
            this.iniciarTemporizadorTiro();
          } else {
            this.view.mostrarFinDePartida();
          }
        });
      }

      if (this.view.dom.closeWinPopoutBtn) {
        this.view.dom.closeWinPopoutBtn.addEventListener('click', () => {
          this.view.ocultarPopoutGanador();
          this.model.reiniciarVidas();
          this.view.actualizarVidasUI(this.model.vidas);
          this.view.limpiarTorrePagos();
          this.detenerTemporizadorTiro();
        });
      }

      if (this.view.dom.btnRestartFreePlay) {
        this.view.dom.btnRestartFreePlay.addEventListener('click', () => {
          this.model.reiniciarVidas();
          this.view.actualizarVidasUI(this.model.vidas);
          this.view.limpiarTorrePagos();
          this.view.ocultarFinDePartida();
          this.detenerTemporizadorTiro();
        });
      }

      // 5. Botones de Prueba Supervisor
      if (this.view.dom.testJackpotBtn) {
        this.view.dom.testJackpotBtn.addEventListener('click', () => {
          this.model.modoPruebaForzado = 'JACKPOT';
          if (this.view.dom.supervisorModal) this.view.dom.supervisorModal.classList.add('hidden');
          this.realizarTirada();
        });
      }

      if (this.view.dom.testBonusBtn) {
        this.view.dom.testBonusBtn.addEventListener('click', () => {
          this.model.modoPruebaForzado = 'BONUS';
          if (this.view.dom.supervisorModal) this.view.dom.supervisorModal.classList.add('hidden');
          this.realizarTirada();
        });
      }

      if (this.view.dom.testVidaBtn) {
        this.view.dom.testVidaBtn.addEventListener('click', () => {
          this.model.modoPruebaForzado = 'VIDA';
          if (this.view.dom.supervisorModal) this.view.dom.supervisorModal.classList.add('hidden');
          this.realizarTirada();
        });
      }

      if (this.view.dom.testHitbarBtn) {
        this.view.dom.testHitbarBtn.addEventListener('click', () => {
          this.model.modoPruebaForzado = 'HITBAR';
          if (this.view.dom.supervisorModal) this.view.dom.supervisorModal.classList.add('hidden');
          this.realizarTirada();
        });
      }

      if (this.view.dom.testMojarroBtn) {
        this.view.dom.testMojarroBtn.addEventListener('click', () => {
          this.model.modoPruebaForzado = 'MOJARRO';
          if (this.view.dom.supervisorModal) this.view.dom.supervisorModal.classList.add('hidden');
          this.realizarTirada();
        });
      }

      // Modal Combinaciones
      if (this.view.dom.combinationsBtn && this.view.dom.combinationsModal) {
        this.view.dom.combinationsBtn.addEventListener('click', () => {
          this.view.dom.combinationsModal.classList.remove('hidden');
        });
      }
      if (this.view.dom.closeCombinationsBtn) {
        this.view.dom.closeCombinationsBtn.addEventListener('click', () => {
          this.view.dom.combinationsModal.classList.add('hidden');
        });
      }
      if (this.view.dom.closeCombinationsBtnBottom) {
        this.view.dom.closeCombinationsBtnBottom.addEventListener('click', () => {
          this.view.dom.combinationsModal.classList.add('hidden');
        });
      }

      // Modal Supervisor
      if (this.view.dom.supervisorBtn && this.view.dom.supervisorModal) {
        this.view.dom.supervisorBtn.addEventListener('click', () => {
          this.view.dom.supervisorModal.classList.remove('hidden');
        });
      }
      if (this.view.dom.closeSupervisorBtn) {
        this.view.dom.closeSupervisorBtn.addEventListener('click', () => {
          this.view.dom.supervisorModal.classList.add('hidden');
        });
      }

      // Atajo de teclado: Barra Espaciadora para girar / detener Hit Bar
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.key === ' ') {
          if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
          e.preventDefault();

          if (this.isHitBarActive) {
            this.detenerPasoHitBar();
            return;
          }

          if (this.view.dom.winPopoutModal && !this.view.dom.winPopoutModal.classList.contains('hidden')) {
            if (this.view.dom.retrySpinBtn && !this.view.dom.retrySpinBtn.classList.contains('hidden')) {
              this.view.dom.retrySpinBtn.click();
            } else if (this.view.dom.claimPrizeBtn) {
              this.view.dom.claimPrizeBtn.click();
            }
            return;
          }

          if (this.view.dom.lifeLossModal && !this.view.dom.lifeLossModal.classList.contains('hidden')) {
            this.view.dom.btnContinueLife?.click();
            return;
          }

          if (this.view.dom.terminalBlockedModal && !this.view.dom.terminalBlockedModal.classList.contains('hidden')) {
            this.view.dom.btnRestartFreePlay?.click();
            return;
          }

          this.realizarTirada();
        }
      });
    }

    actualizarAudioUI() {
      if (this.view.dom.musicIcon) {
        this.view.dom.musicIcon.textContent = this.audio.isMusicMuted() ? '🔇' : '🎵';
      }
      if (this.view.dom.muteIcon) {
        this.view.dom.muteIcon.textContent = this.audio.isSfxMuted() ? '🔇' : '🔊';
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
            this.view.mostrarFinDePartida();
          }
        });
      });
    }

    detenerTemporizadorTiro() {
      if (this.timerService) {
        this.timerService.stopShotTimer(this.view.dom.shotTimerContainer);
      }
    }

    realizarTirada() {
      if (this.isSpinning || this.isHitBarActive) return;

      // Verificar vidas disponibles
      if (this.model.vidas <= 0) {
        this.view.mostrarFinDePartida();
        return;
      }

      // Detener temporizador temporalmente durante el giro
      this.detenerTemporizadorTiro();

      // Consumir vida de forma limpia
      this.model.consumirVida();
      this.view.actualizarVidasUI(this.model.vidas);

      // Verificar si en esta vida se activa el modo Hit Bar
      if (this.model.shouldTriggerHitBar()) {
        this.iniciarModoHitBar();
        return;
      }

      // Tirada estándar
      this.isSpinning = true;
      this.view.actualizarEstadoBotonGirar(true);

      const matriz = this.model.generarMatrizTirada();
      const resultado = this.model.evaluarTirada(matriz);
      this.ultimoResultadoPremio = resultado;

      // Iniciar giro visual y sonido de giro continuo
      this.view.animarGiro();
      this.audio.startSpinTicks(85);

      // Detener rodillos de izquierda a derecha secuencialmente uno por uno
      const reelStops = [500, 950, 1400, 1850, 2300];
      let rodillosDetenidos = 0;

      reelStops.forEach((delay, colIndex) => {
        setTimeout(() => {
          this.view.detenerRodillo(colIndex, matriz[colIndex], () => {
            this.audio.playReelStop(colIndex);
            rodillosDetenidos++;

            if (rodillosDetenidos === 5) {
              this.finalizarTirada(resultado);
            }
          });
        }, delay);
      });
    }

    iniciarModoHitBar() {
      this.isHitBarActive = true;
      this.hitBarColumnaActual = 0;
      this.hitBarAciertos = 0;
      this.isStoppingHitBarCol = false;

      // El temporizador se pausa en el modo Hit Bar
      if (this.timerService && this.timerService.pauseShotTimer) {
        this.timerService.pauseShotTimer();
      }

      this.view.mostrarHitBarBanner(0, 0);
      this.view.actualizarBotonHitBar(0);
      this.audio.startSpinTicks(30);

      // Iniciar animación Hit Bar: arranque a súper velocidad inicial y luego estabilización
      this.view.iniciarAnimacionHitBar(() => {
        this.audio.startSpinTicks(60);
      });
    }

    detenerPasoHitBar() {
      if (!this.isHitBarActive || this.isStoppingHitBarCol) return;
      this.isStoppingHitBarCol = true;

      const col = this.hitBarColumnaActual;
      // Probabilidad atractiva de alinear granizado en línea central (80%)
      const esAcierto = Math.random() < 0.8;
      if (esAcierto) {
        this.hitBarAciertos++;
        if (this.audio && typeof this.audio.playHitSuccess === 'function') {
          this.audio.playHitSuccess(this.hitBarAciertos);
        } else if (this.audio && typeof this.audio.playReelStop === 'function') {
          this.audio.playReelStop(col);
        }
      } else {
        if (this.audio && typeof this.audio.playReelStop === 'function') {
          this.audio.playReelStop(col);
        }
      }

      this.view.detenerRodilloHitBar(col, esAcierto, () => {
        this.isStoppingHitBarCol = false;
        this.hitBarColumnaActual++;
        if (this.hitBarColumnaActual < 5) {
          // Si hubo acierto, acelera los rodillos restantes hacia la combinación
          if (esAcierto && this.hitBarAciertos > 0) {
            this.view.acelerarRodillosHitBar(this.hitBarColumnaActual, this.hitBarAciertos);
            const nuevoIntervalo = Math.max(20, 60 - this.hitBarAciertos * 10);
            if (this.audio && typeof this.audio.startSpinTicks === 'function') {
              this.audio.startSpinTicks(nuevoIntervalo);
            }
          }

          this.view.mostrarHitBarBanner(this.hitBarColumnaActual, this.hitBarAciertos);
          this.view.actualizarBotonHitBar(this.hitBarColumnaActual);
        } else {
          // Finalizar los 5 pasos del Hit Bar
          this.isHitBarActive = false;
          if (this.audio && typeof this.audio.stopSpinTicks === 'function') {
            this.audio.stopSpinTicks();
          }
          this.view.ocultarHitBarBanner();
          this.view.restablecerBotonGirar();

          const resultadoHitBar = this.model.evaluarHitBarResultado(this.hitBarAciertos);
          this.ultimoResultadoPremio = resultadoHitBar;
          this.finalizarTirada(resultadoHitBar);
        }
      });
    }

    async finalizarTirada(resultado) {
      this.audio.stopSpinTicks();
      this.isSpinning = false;
      this.view.actualizarEstadoBotonGirar(false);

      // Resaltar símbolos en rodillos
      this.view.resaltarPremios(resultado.simbolosGanadores);

      // Iluminar y escalar la torre piramidal de premios con sonido por escalón
      await this.view.animarEscaladaTorre(resultado.nivel.id, this.audio);

      // Manejar combinación de Vida Extra
      if (resultado.nivel && (resultado.nivel.id === 'BONUS_VIDA' || resultado.nivel.esVidaExtra)) {
        if (this.model.vidas < 3) {
          this.model.recuperarVida();
          this.view.actualizarVidasUI(this.model.vidas);
          if (this.audio && this.audio.playLifeGained) {
            this.audio.playLifeGained();
          }
        }
      }

      if (resultado.esPremio) {
        const esJackpot = resultado.nivel.id === 'JACKPOT';
        this.view.lanzarConfeti(esJackpot);

        if (esJackpot) {
          this.audio.playJackpot();
        } else {
          this.audio.playWinSong();
        }

        setTimeout(() => {
          this.view.mostrarPopoutGanador(resultado, this.model.intentoActual, this.model.vidas);
        }, 500);
      } else {
        this.audio.playFailSound();

        // Mostrar popout fullscreen de pérdida de vida
        setTimeout(() => {
          this.view.mostrarModalPerdidaVida(this.model.vidas, () => {
            if (this.model.vidas <= 0) {
              this.view.mostrarFinDePartida();
              this.detenerTemporizadorTiro();
            } else {
              // Iniciar temporizador de 30 segundos para la siguiente tirada
              this.iniciarTemporizadorTiro();
            }
          });
        }, 600);
      }

      // Registrar en historial local
      if (root.StorageService) {
        root.StorageService.addHistory('slot', {
          premio: resultado.nivel.nombre,
          beneficio: resultado.nivel.beneficio,
          fecha: new Date().toLocaleTimeString(),
          intento: this.model.intentoActual
        });
      }

      // Continuación fluida de Giro Automático si no fue premio y tiene vidas
      if (this.autoSpinActivo && this.model.vidas > 0 && !resultado.esPremio) {
        setTimeout(() => {
          if (this.autoSpinActivo && !this.isSpinning && !this.isHitBarActive && this.model.vidas > 0) {
            this.realizarTirada();
          }
        }, 1200);
      }
    }

    reclamarPremioActual() {
      if (!this.ultimoResultadoPremio || !this.ultimoResultadoPremio.esPremio) return;
      this.detenerTemporizadorTiro();

      const premio = this.ultimoResultadoPremio.nivel.beneficio;
      const intento = this.model.intentoActual;
      const security = root.SecurityService;

      const terminal = security ? security.getOrCreateTerminalId() : (`TERM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`);
      const fecha = security ? security.getFechaActual() : new Date().toISOString().slice(0, 10);
      const hora = security ? security.getHoraActual() : new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const sig = security ? security.calcularFirma(intento, premio, fecha, hora, terminal) : (`SIG-${Date.now()}`);

      const verificationUrl = security ? security.buildVerificationUrl({
        intento,
        premio,
        codigo: `🎰 ${this.ultimoResultadoPremio.nivel.id || ''}`,
        fecha,
        hora,
        dispositivo: 'Tragamonedas Paradice',
        terminal,
        sig
      }) : (window.location.href.split('?')[0]);

      this.view.voltearQR({
        premio,
        intento,
        fecha,
        hora,
        terminal,
        sig,
        verificationUrl
      });

      // Al reclamar el premio se consumen las vidas restantes
      this.model.vidas = 0;
      this.model.guardarVidas();
      this.view.actualizarVidasUI(0);
    }

    toggleAutoSpin() {
      this.autoSpinActivo = !this.autoSpinActivo;
      if (this.view.dom.autoSpinBtn) {
        this.view.dom.autoSpinBtn.classList.toggle('bg-sky-500', this.autoSpinActivo);
        this.view.dom.autoSpinBtn.classList.toggle('shadow-[0_0_20px_rgba(56,189,248,0.8)]', this.autoSpinActivo);
      }

      if (this.autoSpinActivo) {
        // Giro inmediato al activar
        if (!this.isSpinning && !this.isHitBarActive && this.model.vidas > 0) {
          this.realizarTirada();
        }

        if (this.autoSpinTimer) clearInterval(this.autoSpinTimer);
        this.autoSpinTimer = setInterval(() => {
          if (!this.isSpinning && !this.isHitBarActive && this.model.vidas > 0) {
            this.realizarTirada();
          } else if (this.model.vidas <= 0) {
            this.toggleAutoSpin();
          }
        }, 3000);
      } else {
        if (this.autoSpinTimer) {
          clearInterval(this.autoSpinTimer);
          this.autoSpinTimer = null;
        }
      }
    }
  }

  return SlotControllerClass;
});
