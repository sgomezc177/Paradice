/**
 * TimerService.js - Paradice Juegos (Core)
 * Servicio compartido para:
 * 1. Temporizador de tiro de 30s tras gastar la primera vida.
 * 2. Detector de inactividad de 30s para activar el Modo Preview / Demo.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.TimerService = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  class TimerServiceClass {
    constructor() {
      // Temporizador de tiro de 30s
      this.shotTimerInterval = null;
      this.shotTimeRemaining = 30;
      this.isShotTimerPaused = false;
      this.onShotTimeoutCallback = null;
      this.gameStarted = false;
    }

    /**
     * Inicia o reinicia el temporizador de tiro de 30 segundos
     */
    startShotTimer(displayElement, onTimeout) {
      this.stopShotTimer(displayElement);
      this.shotTimeRemaining = 30;
      this.isShotTimerPaused = false;
      this.onShotTimeoutCallback = onTimeout;

      if (displayElement) {
        displayElement.classList.remove('hidden');
        const valEl = displayElement.querySelector('.timer-val') || displayElement;
        valEl.textContent = '30s';
        displayElement.classList.remove('text-rose-400', 'border-rose-500', 'animate-pulse', 'bg-rose-950/80', 'shadow-[0_0_20px_rgba(244,63,94,0.8)]');
        displayElement.classList.add('text-amber-300', 'border-amber-500/50');
      }

      this.shotTimerInterval = setInterval(() => {
        if (this.isShotTimerPaused) return;

        this.shotTimeRemaining--;

        if (displayElement) {
          const valEl = displayElement.querySelector('.timer-val') || displayElement;
          valEl.textContent = `${this.shotTimeRemaining}s`;

          // Alerta visual y sonora de tensión en los últimos 10 segundos
          if (this.shotTimeRemaining <= 10) {
            displayElement.classList.remove('text-amber-300', 'border-amber-500/50');
            displayElement.classList.add('text-rose-400', 'border-rose-500', 'animate-pulse', 'bg-rose-950/80', 'shadow-[0_0_20px_rgba(244,63,94,0.8)]');

            document.body.classList.add('tension-danger-overlay');

            // Sonido de latido/tensión rítmico creciente
            if (root.audioManager && root.audioManager.playTensionTick) {
              root.audioManager.playTensionTick(this.shotTimeRemaining);
            }
          } else {
            document.body.classList.remove('tension-danger-overlay');
          }
        }

        if (this.shotTimeRemaining <= 0) {
          this.stopShotTimer(displayElement);
          if (this.onShotTimeoutCallback) {
            this.onShotTimeoutCallback();
          }
        }
      }, 1000);
    }

    pauseShotTimer() {
      this.isShotTimerPaused = true;
      document.body.classList.remove('tension-danger-overlay');
    }

    resumeShotTimer() {
      this.isShotTimerPaused = false;
    }

    stopShotTimer(displayElement) {
      if (this.shotTimerInterval) {
        clearInterval(this.shotTimerInterval);
        this.shotTimerInterval = null;
      }
      this.isShotTimerPaused = false;
      document.body.classList.remove('tension-danger-overlay');
      if (displayElement) {
        displayElement.classList.add('hidden');
        displayElement.classList.remove('text-rose-400', 'border-rose-500', 'animate-pulse', 'bg-rose-950/80', 'shadow-[0_0_20px_rgba(244,63,94,0.8)]');
      }
    }

    // Métodos stubs seguros para compatibilidad sin modo demo ni prompt
    initGameplayDemo() {}
    initInactivityDetector() {}
    setGameBusy() {}
    restartInactivityTimer() {}
    startPreview() {}
    stopPreview() {}
  }

  const instance = new TimerServiceClass();
  root.TimerService = instance;
  return instance;
});
