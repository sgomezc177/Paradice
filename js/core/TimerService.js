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
      // 1. Temporizador de tiro de 30s
      this.shotTimerInterval = null;
      this.shotTimeRemaining = 30;
      this.isShotTimerPaused = false;
      this.onShotTimeoutCallback = null;

      // 2. Inactividad para Preview
      this.inactivityTimeout = null;
      this.isPreviewActive = false;
      this.onPreviewStartCallback = null;
      this.onPreviewStopCallback = null;
      this.isGameBusy = false; // Si el juego está en giro o modal, no inicia preview
      this.gameStarted = false; // True una vez el jugador gasta su primer intento
      this.gameplayPromptEl = null;
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

    /**
     * Sistema de Gameplay Demo Inicial Universal para TODOS los juegos
     * Se activa de inmediato al cargar la página mostrando demo en vivo
     * y el botón blanco flotante "TOCA LA PANTALLA PARA INICIAR EL JUEGO"
     */
    initGameplayDemo(onStartDemo, onStopDemo) {
      this.onPreviewStartCallback = onStartDemo;
      this.onPreviewStopCallback = onStopDemo;

      // Crear o asegurar la capa de intercepción con el botón blanco flotante
      this.asegurarPromptInicioBlanco();

      // Iniciar en modo Gameplay Demo desde el primer arranque
      this.startPreview();

      // Interceptor en captura para teclado: si está en demo, barra espaciadora o enter SOLO desactivan demo
      window.addEventListener('keydown', (e) => {
        if (this.isPreviewActive && (e.code === 'Space' || e.key === ' ' || e.key === 'Enter')) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          this.stopPreview();
          return;
        }
        this.restartInactivityTimer();
      }, { capture: true });
    }

    asegurarPromptInicioBlanco() {
      const existing = document.getElementById('gameplay-start-prompt');
      if (existing) {
        this.gameplayPromptEl = existing;
        return;
      }

      const container = document.getElementById('app-container') || document.body;
      const isCard = container !== document.body;
      if (isCard && !container.classList.contains('relative')) {
        container.classList.add('relative');
      }

      // Capa dentro de la card del juego que intercepta el primer toque de forma sutil
      const overlay = document.createElement('div');
      overlay.id = 'gameplay-start-prompt';
      overlay.className = (isCard ? 'absolute inset-0 z-40 rounded-2xl sm:rounded-3xl' : 'fixed inset-0 z-40') +
        ' flex flex-col items-center justify-end pb-5 sm:pb-6 bg-slate-950/15 backdrop-blur-[0.5px] cursor-pointer select-none transition-opacity duration-200';
      overlay.innerHTML = `
        <div class="px-4 py-2 rounded-full bg-white/95 text-slate-800 font-semibold text-xs tracking-wide shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-slate-200/60 flex items-center gap-1.5 transition-transform hover:scale-105 active:scale-95">
          <span class="text-sm">👆</span>
          <span class="text-[11px] sm:text-xs">Toca la pantalla para iniciar</span>
          <span class="text-xs text-amber-500">✨</span>
        </div>
      `;

      // Interceptar clics y toques con captura para que NO lleguen a los botones del juego
      const desactivarDemo = (e) => {
        if (this.isPreviewActive) {
          e.preventDefault();
          e.stopPropagation();
          e.stopImmediatePropagation();
          this.stopPreview();
        }
      };

      ['pointerdown', 'touchstart', 'click'].forEach(evt => {
        overlay.addEventListener(evt, desactivarDemo, { capture: true });
      });

      container.appendChild(overlay);
      this.gameplayPromptEl = overlay;
    }

    initInactivityDetector(onPreviewStart, onPreviewStop) {
      this.initGameplayDemo(onPreviewStart, onPreviewStop);
    }

    setGameBusy(busy) {
      this.isGameBusy = busy;
      if (busy && this.isPreviewActive) {
        this.stopPreview();
      }
    }

    restartInactivityTimer() {
      if (this.inactivityTimeout) {
        clearTimeout(this.inactivityTimeout);
      }
      this.inactivityTimeout = setTimeout(() => {
        if (!this.isGameBusy && !this.isPreviewActive) {
          this.startPreview();
        } else {
          this.restartInactivityTimer();
        }
      }, 30000);
    }

    startPreview() {
      this.isPreviewActive = true;
      if (this.gameplayPromptEl) {
        this.gameplayPromptEl.classList.remove('hidden');
      }

      // Actualizar cualquier banner preview a "GAMEPLAY DEMO EN VIVO"
      const banner = document.getElementById('preview-mode-banner');
      if (banner) {
        banner.innerHTML = '<span>🎮</span> <span>DEMO GAMEPLAY EN VIVO</span> <span>🎮</span>';
        banner.classList.remove('hidden');
      }

      if (this.onPreviewStartCallback) {
        this.onPreviewStartCallback();
      }
    }

    stopPreview() {
      this.isPreviewActive = false;
      if (this.gameplayPromptEl) {
        this.gameplayPromptEl.classList.add('hidden');
      }

      const banner = document.getElementById('preview-mode-banner');
      if (banner) {
        banner.classList.add('hidden');
      }

      if (this.onPreviewStopCallback) {
        this.onPreviewStopCallback();
      }
      this.restartInactivityTimer();
    }
  }

  const instance = new TimerServiceClass();
  root.TimerService = instance;
  return instance;
});
