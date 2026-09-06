/**
 * Aplicación Principal / Orquestador de la Tragamonedas Hit Bar Premios Granizados
 * Máquina de Estados, Música de Fondo (BGM), Supervisor y Confeti
 * Basado en especificaciones1.md y diseño visual Hit Bar / Premios Granizados
 */

import { NIVELES_PREMIO, ESTADOS_JUEGO, SIMBOLOS } from './config.js';
import { generarMatrizTirada, generarMatrizPrueba } from './rng.js';
import { evaluarTirada } from './evaluator.js';
import { soundManager } from './audio.js';
import { ReelsController } from './reels.js';

class GranizadosSlotApp {
  constructor() {
    this.estado = ESTADOS_JUEGO.IDLE;
    this.reelsController = null;
    this.ultimoResultado = null;
    this.historialTiradas = [];
    this.confettiInstance = null;
    this.modoPruebaForzado = null;
    this.autoSpinActivo = false;
    this.autoSpinTimer = null;

    try {
      const guardado = localStorage.getItem('paradice_slot_historial');
      if (guardado) {
        this.historialTiradas = JSON.parse(guardado);
      }
    } catch (e) {
      this.historialTiradas = [];
    }
  }

  init() {
    this.cacheDOM();
    this.initConfetti();

    this.reelsController = new ReelsController(this.dom.reelsContainer, 5, 3);
    this.reelsController.init();

    this.bindEvents();
    this.actualizarUIEstado();
    this.actualizarHistorialUI();
  }

  cacheDOM() {
    this.dom = {
      appContainer: document.getElementById('app-container'),
      paytableTower: document.getElementById('paytable-tower'),
      reelsContainer: document.getElementById('reels-container'),
      spinBtn: document.getElementById('spin-btn'),
      spinBtnText: document.getElementById('spin-btn-text'),
      spinBtnIcon: document.getElementById('spin-btn-icon'),
      autoSpinBtn: document.getElementById('auto-spin-btn'),
      statusBadge: document.getElementById('status-badge'),
      statusTitle: document.getElementById('status-title'),
      muteBtn: document.getElementById('mute-btn'),
      muteIcon: document.getElementById('mute-icon'),
      musicBtn: document.getElementById('music-btn'),
      musicIcon: document.getElementById('music-icon'),
      supervisorBtn: document.getElementById('supervisor-btn'),
      supervisorModal: document.getElementById('supervisor-modal'),
      closeSupervisorBtn: document.getElementById('close-supervisor-modal'),
      supervisorResetBtn: document.getElementById('supervisor-reset-btn'),
      supervisorValidateBtn: document.getElementById('supervisor-validate-btn'),
      supervisorHistorialList: document.getElementById('supervisor-historial-list'),
      testJackpotBtn: document.getElementById('test-jackpot-btn'),
      testBonusBtn: document.getElementById('test-bonus-btn'),
      testMojarroBtn: document.getElementById('test-mojarro-btn'),
      clearHistoryBtn: document.getElementById('clear-history-btn'),
      // Combinaciones
      combinationsBtn: document.getElementById('combinations-btn'),
      combinationsModal: document.getElementById('combinations-modal'),
      closeCombinationsBtn: document.getElementById('close-combinations-modal'),
      closeCombinationsBtnBottom: document.getElementById('close-combinations-btn-bottom'),
      // Popout Ganador
      winPopoutModal: document.getElementById('win-popout-modal'),
      winPopoutIcon: document.getElementById('win-popout-icon'),
      winPopoutTier: document.getElementById('win-popout-tier'),
      winPopoutPrize: document.getElementById('win-popout-prize'),
      closeWinPopoutBtn: document.getElementById('close-win-popout-btn')
    };
  }

  initConfetti() {
    if (window.confetti) {
      this.confettiInstance = window.confetti;
    }
  }

  bindEvents() {
    // Giro normal
    this.dom.spinBtn.addEventListener('click', () => {
      this.handleSpinClick();
    });

    // Toggle Música de Fondo (BGM)
    if (this.dom.musicBtn) {
      this.dom.musicBtn.addEventListener('click', () => {
        const isMuted = soundManager.toggleMusic();
        this.dom.musicIcon.textContent = isMuted ? '🔇' : '🎵';
        this.dom.musicBtn.classList.toggle('opacity-50', isMuted);
      });
    }

    // Toggle Efectos de Sonido (SFX)
    this.dom.muteBtn.addEventListener('click', () => {
      const isMuted = soundManager.toggleSfx();
      this.dom.muteIcon.textContent = isMuted ? '🔇' : '🔊';
    });

    // Auto Giro
    if (this.dom.autoSpinBtn) {
      this.dom.autoSpinBtn.addEventListener('click', () => {
        this.toggleAutoSpin();
      });
    }

    const betBtn = document.getElementById('bet-btn');
    if (betBtn) {
      betBtn.addEventListener('click', () => {
        soundManager.playClimbTick(4, 9);
        if (this.dom.statusTitle && this.estado === ESTADOS_JUEGO.IDLE) {
          const prev = this.dom.statusTitle.textContent;
          this.dom.statusTitle.textContent = 'Apuesta: 1 Crédito ($1.000 COP)';
          setTimeout(() => {
            if (this.estado === ESTADOS_JUEGO.IDLE) {
              this.dom.statusTitle.textContent = prev;
            }
          }, 1400);
        }
      });
    }

    // Popout Ganador
    if (this.dom.closeWinPopoutBtn) {
      this.dom.closeWinPopoutBtn.addEventListener('click', () => {
        if (this.dom.winPopoutModal) {
          this.dom.winPopoutModal.classList.add('hidden');
        }
        this.supervisorReiniciar();
      });
    }

    // Supervisor
    this.dom.supervisorBtn.addEventListener('click', () => {
      this.abrirModalSupervisor();
    });

    this.dom.closeSupervisorBtn.addEventListener('click', () => {
      this.cerrarModalSupervisor();
    });

    if (this.dom.supervisorValidateBtn) {
      this.dom.supervisorValidateBtn.addEventListener('click', () => {
        this.supervisorValidarPremio();
      });
    }

    if (this.dom.supervisorResetBtn) {
      this.dom.supervisorResetBtn.addEventListener('click', () => {
        this.supervisorReiniciar();
      });
    }

    if (this.dom.testJackpotBtn) {
      this.dom.testJackpotBtn.addEventListener('click', () => {
        this.modoPruebaForzado = 'JACKPOT';
        this.cerrarModalSupervisor();
        this.ejecutarGiro();
      });
    }

    if (this.dom.testBonusBtn) {
      this.dom.testBonusBtn.addEventListener('click', () => {
        this.modoPruebaForzado = 'BONUS_ALCOHOL';
        this.cerrarModalSupervisor();
        this.ejecutarGiro();
      });
    }

    if (this.dom.testMojarroBtn) {
      this.dom.testMojarroBtn.addEventListener('click', () => {
        this.modoPruebaForzado = 'MOJARRO';
        this.cerrarModalSupervisor();
        this.ejecutarGiro();
      });
    }

    if (this.dom.clearHistoryBtn) {
      this.dom.clearHistoryBtn.addEventListener('click', () => {
        this.historialTiradas = [];
        try {
          localStorage.removeItem('paradice_slot_historial');
        } catch (e) {}
        this.actualizarHistorialUI();
      });
    }

    // Modal de Combinaciones
    if (this.dom.combinationsBtn) {
      this.dom.combinationsBtn.addEventListener('click', () => {
        this.dom.combinationsModal.classList.remove('hidden');
      });
    }

    if (this.dom.closeCombinationsBtn) {
      this.dom.closeCombinationsBtn.addEventListener('click', () => {
        this.dom.combinationsModal.classList.add('hidden');
      });
    }

    if (this.dom.closeCombinationsBtnBottom) {
      this.dom.closeCombinationsBtnBottom.addEventListener('click', () => {
        this.dom.combinationsModal.classList.add('hidden');
      });
    }

    // Desbloqueo e inicio automático de audio y música de fondo en la primera interacción
    const unlockAudioAndStartMusic = () => {
      soundManager.init();
      if (!soundManager.isMusicMuted()) {
        soundManager.startMusic();
      }
      window.removeEventListener('click', unlockAudioAndStartMusic);
      window.removeEventListener('touchstart', unlockAudioAndStartMusic);
    };
    window.addEventListener('click', unlockAudioAndStartMusic);
    window.addEventListener('touchstart', unlockAudioAndStartMusic);
  }

  toggleAutoSpin() {
    this.autoSpinActivo = !this.autoSpinActivo;
    if (this.dom.autoSpinBtn) {
      if (this.autoSpinActivo) {
        this.dom.autoSpinBtn.classList.add('bg-cyan-600', 'text-white', 'border-cyan-300');
        this.dom.autoSpinBtn.innerHTML = '<span>⏹️</span> Parar';
        if (this.estado === ESTADOS_JUEGO.IDLE) {
          this.ejecutarGiro();
        }
      } else {
        this.dom.autoSpinBtn.classList.remove('bg-cyan-600', 'text-white', 'border-cyan-300');
        this.dom.autoSpinBtn.innerHTML = '<span>⚡</span> Auto';
      }
    }
  }

  async handleSpinClick() {
    if (this.estado !== ESTADOS_JUEGO.IDLE) {
      if (this.estado === ESTADOS_JUEGO.LOCKED) {
        this.mostrarAlertaSupervisorRequerido();
      }
      return;
    }
    this.ejecutarGiro();
  }

  async ejecutarGiro() {
    this.estado = ESTADOS_JUEGO.SPINNING;
    this.limpiarResaltadoTorre();
    this.actualizarUIEstado();

    soundManager.startSpin();

    let matrizDestino;
    if (this.modoPruebaForzado) {
      matrizDestino = generarMatrizPrueba(this.modoPruebaForzado);
      this.modoPruebaForzado = null;
    } else {
      matrizDestino = generarMatrizTirada(5, 3);
    }

    this.estado = ESTADOS_JUEGO.STOPPING;
    await this.reelsController.spinTo(matrizDestino);
    soundManager.stopSpin();

    this.estado = ESTADOS_JUEGO.RESOLVED;
    const resultado = evaluarTirada(matrizDestino);
    this.ultimoResultado = resultado;

    if (resultado.celdasGanadoras && resultado.celdasGanadoras.length > 0) {
      this.reelsController.highlightWinningCells(resultado.celdasGanadoras);
    }

    // Subir la pirámide de premios alumbrando uno a uno hasta llegar al ganador
    await this.animarEscaladaTorre(resultado);

    this.ejecutarFeedback(resultado);
    this.registrarTiradaEnHistorial(resultado);

    // Si ganó un premio (distinto de MOJARRO), cambiar a canción de premio y mostrar popout
    if (resultado.premio.id !== 'MOJARRO') {
      soundManager.playWinSong();
      this.mostrarPopoutPremio(resultado);
    }

    this.estado = ESTADOS_JUEGO.LOCKED;
    this.actualizarUIEstado();

    // Si auto-spin estaba activo y el supervisor no ha bloqueado
    if (this.autoSpinActivo) {
      setTimeout(() => {
        if (this.autoSpinActivo) {
          this.supervisorReiniciar();
          this.ejecutarGiro();
        }
      }, 2500);
    }
  }

  ejecutarFeedback(resultado) {
    const { tipoFeedback } = resultado.premio;

    switch (tipoFeedback) {
      case 'jackpot':
        soundManager.playJackpot();
        this.dispararConfeti(true);
        break;
      case 'win_big':
        soundManager.playJackpot();
        this.dispararConfeti(false);
        break;
      case 'win_bonus':
        soundManager.playWinBonus();
        this.dispararConfeti(false);
        break;
      case 'win_medium':
      case 'win_discount':
        soundManager.playWinDiscount();
        break;
      case 'blanqueo':
        soundManager.playBlanqueo();
        break;
      default:
        soundManager.playWinDiscount();
    }
  }

  mostrarPopoutPremio(resultado) {
    if (!this.dom.winPopoutModal) return;

    let icon = '🎁';
    if (resultado.premio.id === 'JACKPOT') icon = '⭐';
    else if (resultado.premio.id === 'BONUS_ALCOHOL') icon = '🫗';
    else if (resultado.premio.id === 'BONUS_2X3') icon = '🥃';
    else if (resultado.premio.id.startsWith('NIVEL_12') || resultado.premio.id.startsWith('NIVEL_11')) icon = '🍸';
    else if (resultado.premio.id.startsWith('NIVEL_10') || resultado.premio.id.startsWith('NIVEL_8') || resultado.premio.id.startsWith('NIVEL_5')) icon = '🍧';
    else icon = '🍹';

    if (this.dom.winPopoutIcon) this.dom.winPopoutIcon.textContent = icon;
    if (this.dom.winPopoutTier) this.dom.winPopoutTier.textContent = `${resultado.premio.codigo} ${resultado.premio.nombre}`;
    if (this.dom.winPopoutPrize) this.dom.winPopoutPrize.textContent = resultado.premio.beneficio;

    this.dom.winPopoutModal.classList.remove('hidden');
  }

  dispararConfeti(esJackpot = false) {
    if (!this.confettiInstance) return;

    if (esJackpot) {
      const duracion = 3.5 * 1000;
      const fin = Date.now() + duracion;

      const intervalo = setInterval(() => {
        if (Date.now() > fin) {
          return clearInterval(intervalo);
        }
        this.confettiInstance({
          startVelocity: 30,
          spread: 360,
          ticks: 60,
          origin: { x: Math.random(), y: Math.random() - 0.2 },
          colors: ['#FACC15', '#00F0FF', '#EC4899', '#38BDF8', '#FFFFFF']
        });
      }, 250);
    } else {
      this.confettiInstance({
        particleCount: 85,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#00F0FF', '#38BDF8', '#FACC15', '#4ADE80', '#EC4899']
      });
    }
  }

  async animarEscaladaTorre(resultado) {
    this.limpiarResaltadoTorre();
    const rows = Array.from(this.dom.paytableTower.querySelectorAll('.pill-row'));
    // Ordenar de abajo hacia arriba según data-ladder-index (0 es la base Nivel 5, 8 es la cumbre Jackpot)
    rows.sort((a, b) => parseInt(a.dataset.ladderIndex, 10) - parseInt(b.dataset.ladderIndex, 10));

    const targetId = resultado.premio.id;
    const targetRow = this.dom.paytableTower.querySelector(`[data-nivel-id="${targetId}"]`);

    if (targetId === 'MOJARRO') {
      // Si es mojarro, sube 2 escalones de ilusión y luego se apaga
      for (let i = 0; i <= 2 && i < rows.length; i++) {
        rows[i].classList.add('pill-row-climbing');
        soundManager.playClimbTick(i, 9);
        await new Promise(r => setTimeout(r, 90));
        rows[i].classList.remove('pill-row-climbing');
      }
      return;
    }

    let targetIndex = 0;
    if (targetRow && targetRow.dataset.ladderIndex !== undefined) {
      targetIndex = parseInt(targetRow.dataset.ladderIndex, 10);
    } else {
      // Para premios menores básicos, ilumina la base
      targetIndex = 0;
    }

    // Subir alumbrando uno a uno desde abajo hacia arriba
    for (let i = 0; i <= targetIndex; i++) {
      rows.forEach(r => r.classList.remove('pill-row-climbing'));
      rows[i].classList.add('pill-row-climbing');
      soundManager.playClimbTick(i, 9);
      await new Promise(r => setTimeout(r, 120));
    }

    // Destello de victoria triunfal al alcanzar el premio ganador
    const winningRow = rows[targetIndex];
    for (let f = 0; f < 3; f++) {
      winningRow.classList.remove('pill-row-active', 'pill-row-climbing');
      await new Promise(r => setTimeout(r, 65));
      winningRow.classList.add('pill-row-active');
      await new Promise(r => setTimeout(r, 85));
    }
  }

  resaltarFilaTorre(nivelId) {
    this.limpiarResaltadoTorre();
    const row = this.dom.paytableTower.querySelector(`[data-nivel-id="${nivelId}"]`);
    if (row) {
      row.classList.add('pill-row-active');
    }
  }

  limpiarResaltadoTorre() {
    this.dom.paytableTower.querySelectorAll('.pill-row-active').forEach(r => {
      r.classList.remove('pill-row-active');
    });
  }

  actualizarUIEstado() {
    const { spinBtn, spinBtnText, spinBtnIcon, statusBadge, statusTitle } = this.dom;

    switch (this.estado) {
      case ESTADOS_JUEGO.IDLE:
        spinBtn.disabled = false;
        spinBtnText.textContent = 'GIRAR';
        spinBtnIcon.classList.remove('animate-spin');

        statusBadge.textContent = 'LISTO';
        statusBadge.className = 'px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-500/40';
        statusTitle.textContent = '¡Tira tu Granizado de la Suerte!';
        break;

      case ESTADOS_JUEGO.SPINNING:
      case ESTADOS_JUEGO.STOPPING:
        spinBtn.disabled = true;
        spinBtnText.textContent = 'GIRANDO';
        spinBtnIcon.classList.add('animate-spin');

        statusBadge.textContent = 'GIRANDO';
        statusBadge.className = 'px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-blue-950 text-blue-400 border border-blue-500/40 animate-pulse';
        statusTitle.textContent = '¡Buscando Combinación Ganadora!';
        break;

      case ESTADOS_JUEGO.RESOLVED:
      case ESTADOS_JUEGO.LOCKED: {
        const premio = this.ultimoResultado?.premio;
        spinBtn.disabled = true;
        spinBtnText.textContent = 'VALIDAR';
        spinBtnIcon.classList.remove('animate-spin');

        if (premio && premio.id === 'MOJARRO') {
          if (statusBadge) {
            statusBadge.textContent = 'MOJARRO';
            statusBadge.className = 'px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-600';
          }
          if (statusTitle) statusTitle.textContent = '¡Sin Suerte esta vez!';
          // Desbloqueo suave para seguir jugando rápidamente
          setTimeout(() => {
            if (this.estado === ESTADOS_JUEGO.LOCKED && this.ultimoResultado && this.ultimoResultado.premio.id === 'MOJARRO') {
              this.supervisorReiniciar();
            }
          }, 1200);
        } else if (premio && premio.id === 'JACKPOT') {
          if (statusBadge) {
            statusBadge.textContent = '⭐ JACKPOT ⭐';
            statusBadge.className = 'px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider bg-amber-400 text-slate-950 border border-yellow-300 shadow-lg animate-bounce';
          }
          if (statusTitle) statusTitle.textContent = `¡JACKPOT! ${premio.beneficio}`;
        } else if (premio) {
          if (statusBadge) {
            statusBadge.textContent = `${premio.codigo || 'PREMIO'}`;
            statusBadge.className = 'px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/50 shadow-md';
          }
          if (statusTitle) statusTitle.textContent = `Ganaste: ${premio.beneficio}`;
        }
        break;
      }
    }
  }

  mostrarAlertaSupervisorRequerido() {
    this.abrirModalSupervisor();
  }

  abrirModalSupervisor() {
    this.dom.supervisorModal.classList.remove('hidden');
    this.actualizarHistorialUI();
  }

  cerrarModalSupervisor() {
    this.dom.supervisorModal.classList.add('hidden');
  }

  supervisorValidarPremio() {
    if (this.historialTiradas.length > 0) {
      this.historialTiradas[0].validado = true;
      try {
        localStorage.setItem('paradice_slot_historial', JSON.stringify(this.historialTiradas));
      } catch (e) {}
    }
    this.supervisorReiniciar();
  }

  supervisorReiniciar() {
    this.estado = ESTADOS_JUEGO.IDLE;
    this.limpiarResaltadoTorre();
    this.reelsController.clearHighlights();
    this.actualizarUIEstado();
    this.cerrarModalSupervisor();
  }

  registrarTiradaEnHistorial(resultado) {
    const item = {
      id: Date.now(),
      fecha: new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      premioId: resultado.premio.id,
      nombrePremio: resultado.premio.nombre,
      beneficio: resultado.premio.beneficio,
      aciertos: resultado.cantidadAciertos,
      validado: false
    };

    this.historialTiradas.unshift(item);
    if (this.historialTiradas.length > 50) {
      this.historialTiradas.pop();
    }

    try {
      localStorage.setItem('paradice_slot_historial', JSON.stringify(this.historialTiradas));
    } catch (e) {}

    this.actualizarHistorialUI();
  }

  actualizarHistorialUI() {
    if (!this.dom.supervisorHistorialList) return;

    if (this.historialTiradas.length === 0) {
      this.dom.supervisorHistorialList.innerHTML = `
        <div class="text-center py-6 text-xs text-slate-500">
          No hay tiradas registradas aún en esta sesión.
        </div>
      `;
      return;
    }

    this.dom.supervisorHistorialList.innerHTML = '';
    this.historialTiradas.forEach(h => {
      const row = document.createElement('div');
      row.className = 'flex items-center justify-between p-2 rounded bg-slate-900/80 border border-slate-800 text-xs';

      const left = document.createElement('div');
      left.className = 'flex flex-col';
      left.innerHTML = `
        <span class="font-bold text-slate-200">${h.beneficio}</span>
        <span class="text-[10px] text-slate-400">${h.fecha} • ${h.nombrePremio}</span>
      `;

      const badge = document.createElement('span');
      badge.className = h.validado
        ? 'px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800'
        : 'px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800';
      badge.textContent = h.validado ? '✓ Canjeado' : '⏳ Pendiente';

      row.appendChild(left);
      row.appendChild(badge);
      this.dom.supervisorHistorialList.appendChild(row);
    });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const app = new GranizadosSlotApp();
  app.init();
});
