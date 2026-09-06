/**
 * HitbarView.js - Paradice Juegos (MVC - Hit Bar Rush 2.0)
 * Renderizado visual, animación vertical de alta precisión, detección milimétrica en zona de impacto,
 * iluminación de escalera y activación del botón de canje (Cash Out).
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.HitbarView = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  class HitbarViewClass {
    constructor() {
      this.dom = {};
      this.confettiInstance = window.confetti || null;
      this.animationFrameId = null;
      this.stripPosition = 0;
      this.stripSpeed = 2.2;
      this.itemHeight = 95; // .runner-item height in CSS
      this.loopItemCount = 6;
      this.loopHeight = 95 * 6; // 570px por vuelta completa
    }

    init() {
      this.cacheDOM();
    }

    cacheDOM() {
      this.dom = {
        track: document.querySelector('.hitbar-track'),
        runnerStrip: document.getElementById('runner-strip'),
        hitZone: document.querySelector('.hit-zone-target'),
        btnHit: document.getElementById('btn-hit-impact'),
        btnCashOut: document.getElementById('btn-cash-out'),
        // HUD Superior
        targetIcon: document.getElementById('target-icon'),
        targetName: document.getElementById('target-name'),
        targetBenefitTag: document.getElementById('target-benefit-tag'),
        targetLevelBadge: document.getElementById('target-level-badge'),
        bpmDisplay: document.getElementById('bpm-display'),
        rushLevelDisplay: document.getElementById('rush-level-display'),
        speedStepBadge: document.getElementById('speed-step-badge'),
        speedValDisplay: document.getElementById('speed-val-display'),
        hitZoneTargetIcon: document.getElementById('hit-zone-target-icon'),
        hitZoneTargetIconRight: document.getElementById('hit-zone-target-icon-right'),
        hintTargetName: document.getElementById('hint-target-name'),
        // Escalera & Promoción
        currentPromoTitle: document.getElementById('current-promo-title'),
        currentPromoDesc: document.getElementById('current-promo-desc'),
        promoLadderList: document.getElementById('promo-ladder-list'),
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
        // Modal Cupón Voucher
        modalVoucher: document.getElementById('modal-voucher'),
        voucherPromoTitle: document.getElementById('voucher-promo-title'),
        voucherPromoName: document.getElementById('voucher-promo-name'),
        voucherQrcode: document.getElementById('voucher-qrcode'),
        voucherLevelReached: document.getElementById('voucher-level-reached'),
        voucherTerminalId: document.getElementById('voucher-terminal-id'),
        voucherWhatsappBtn: document.getElementById('voucher-whatsapp-btn'),
        btnVoucherPlayAgain: document.getElementById('btn-voucher-play-again'),
        // Modal Fallo
        modalMiss: document.getElementById('modal-miss'),
        missBadge: document.getElementById('miss-badge'),
        missTitle: document.getElementById('miss-title'),
        missMessage: document.getElementById('miss-message'),
        missLivesStatus: document.getElementById('miss-lives-status'),
        btnMissAction: document.getElementById('btn-miss-action'),
        missActionText: document.getElementById('miss-action-text'),
        // Modal Instrucciones
        modalInstructions: document.getElementById('modal-instructions'),
        btnInstructions: document.getElementById('btn-instructions'),
        closeInstructionsBtn: document.getElementById('close-instructions-btn'),
        closeInstructionsBtnBottom: document.getElementById('btn-close-instructions-bottom'),
        // Temporizador y Preview
        shotTimerContainer: document.getElementById('shot-timer-container'),
        shotTimerDisplay: document.getElementById('shot-timer-display'),
        previewModeBanner: document.getElementById('preview-mode-banner')
      };
    }

    renderStrip(targetId, targetIcon) {
      if (!this.dom.runnerStrip) return;
      this.dom.runnerStrip.innerHTML = '';

      const itemsDef = [
        { id: 'LIMON', icon: '🍋' },
        { id: 'NARANJA', icon: '🍊' },
        { id: 'GOMITAS', icon: '🍬' },
        { id: 'SHOT', icon: '🥃' },
        { id: 'COPA', icon: '🍧' },
        { id: 'ESTRELLA', icon: '⭐' }
      ];

      // Creamos 6 repeticiones del patrón de 6 elementos para un scroll continuo sin fin
      for (let rep = 0; rep < 6; rep++) {
        itemsDef.forEach(item => {
          const isTarget = item.id === targetId;
          const el = document.createElement('div');
          el.className = 'runner-item w-full flex flex-col items-center justify-center select-none';
          el.dataset.itemId = item.id;

          el.innerHTML = `
            <div class="relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-200 ${isTarget ? 'target-glow-shining' : 'non-target-item'}">
              <span class="target-icon-elem">${item.icon}</span>
            </div>
          `;
          this.dom.runnerStrip.appendChild(el);
        });
      }
    }

    startAnimation(speed) {
      this.stripSpeed = speed || 2.2;
      this.stopAnimation();

      const animate = () => {
        if (!this.dom.runnerStrip) return;
        this.stripPosition += this.stripSpeed;

        // Bucle infinito perfecto al completar un ciclo completo de 6 items (570px)
        if (this.stripPosition >= this.loopHeight) {
          this.stripPosition %= this.loopHeight;
        }

        this.dom.runnerStrip.style.transform = `translateY(-${this.stripPosition}px)`;
        this.animationFrameId = requestAnimationFrame(animate);
      };

      this.animationFrameId = requestAnimationFrame(animate);
    }

    stopAnimation() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
        this.animationFrameId = null;
      }
    }

    /**
     * Detección milimétrica de colisión vertical entre el objetivo y la Zona Láser
     */
    checkHitAccuracy(targetId) {
      if (!this.dom.hitZone || !this.dom.runnerStrip) return false;
      const hitRect = this.dom.hitZone.getBoundingClientRect();
      const hitCenterY = hitRect.top + hitRect.height / 2;

      const items = this.dom.runnerStrip.querySelectorAll('.runner-item');
      let foundHit = false;

      items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        const itemCenterY = itemRect.top + itemRect.height / 2;

        // Zona láser tiene 100px de alto, tolerancia de 50px de radio vertical
        if (Math.abs(itemCenterY - hitCenterY) <= 52) {
          if (item.dataset.itemId === targetId) {
            foundHit = true;
          }
        }
      });

      return foundHit;
    }

    evaluateImpact(targetId) {
      const success = this.checkHitAccuracy(targetId);
      this.flashHitFeedback(success);
      return { success };
    }

    flashHitZone(success = true) {
      this.flashHitFeedback(success);
    }

    flashHitFeedback(success) {
      if (!this.dom.hitZone) return;
      if (success) {
        this.dom.hitZone.classList.add('bg-emerald-500/40', 'border-emerald-300');
        setTimeout(() => {
          this.dom.hitZone.classList.remove('bg-emerald-500/40', 'border-emerald-300');
        }, 350);
      } else {
        this.dom.hitZone.classList.add('bg-rose-500/40', 'border-rose-400');
        setTimeout(() => {
          this.dom.hitZone.classList.remove('bg-rose-500/40', 'border-rose-400');
        }, 350);
      }
    }

    updateHUD(levelData, targetConfig) {
      this.updateTargetUI(levelData);
    }

    updateTargetUI(levelData) {
      if (this.dom.targetIcon) this.dom.targetIcon.textContent = levelData.targetIcon;
      if (this.dom.targetName) this.dom.targetName.textContent = `${levelData.targetName} ${levelData.targetIcon}`;
      if (this.dom.targetBenefitTag) this.dom.targetBenefitTag.textContent = `Recompensa: ${levelData.title}`;
      if (this.dom.targetLevelBadge) this.dom.targetLevelBadge.textContent = `NIVEL ${levelData.level}/6`;
      if (this.dom.bpmDisplay) this.dom.bpmDisplay.textContent = `${levelData.bpm} BPM`;
      if (this.dom.rushLevelDisplay) this.dom.rushLevelDisplay.textContent = `NIVEL ${levelData.level}`;
      if (this.dom.speedStepBadge) this.dom.speedStepBadge.textContent = `⚡ ${levelData.speedStep}`;
      if (this.dom.speedValDisplay) this.dom.speedValDisplay.textContent = `${levelData.speed.toFixed(1)} px/f`;
      if (this.dom.hitZoneTargetIcon) this.dom.hitZoneTargetIcon.textContent = levelData.targetIcon;
      if (this.dom.hitZoneTargetIconRight) this.dom.hitZoneTargetIconRight.textContent = levelData.targetIcon;
      if (this.dom.hintTargetName) this.dom.hintTargetName.textContent = `${levelData.targetName} ${levelData.targetIcon}`;
    }

    /**
     * Ilumina la escalera de premios y activa el botón de canje en colores esmeralda/oro
     */
    updateLadderAndCashOut(levels, currentLevelIndex, accumulatedPromo) {
      const currentLevelNumber = currentLevelIndex + 1;

      // 1. Iluminar escalones en la lista
      if (this.dom.promoLadderList) {
        const tierElements = this.dom.promoLadderList.querySelectorAll('.rush-tier-item');
        tierElements.forEach(item => {
          const itemLevel = parseInt(item.dataset.level, 10);
          item.classList.remove(
            'border-amber-400', 'bg-amber-950/60', 'shadow-[0_0_20px_rgba(250,204,21,0.5)]', 'animate-pulse',
            'border-emerald-400/80', 'bg-emerald-950/40', 'text-emerald-200'
          );

          if (itemLevel === currentLevelNumber) {
            // Nivel objetivo actual: iluminación dorada pulsante
            item.classList.add('border-amber-400', 'bg-amber-950/60', 'shadow-[0_0_20px_rgba(250,204,21,0.5)]', 'animate-pulse');
          } else if (itemLevel < currentLevelNumber) {
            // Niveles superados: borde esmeralda neon
            item.classList.add('border-emerald-400/80', 'bg-emerald-950/40', 'text-emerald-200');
          }
        });
      }

      // 2. Actualizar tarjeta de Promoción en Mano y activar Botón Cash Out
      if (accumulatedPromo) {
        if (this.dom.currentPromoTitle) {
          this.dom.currentPromoTitle.textContent = accumulatedPromo.title;
        }
        if (this.dom.currentPromoDesc) {
          this.dom.currentPromoDesc.textContent = accumulatedPromo.desc;
        }

        // ACTIVAR BOTÓN DE ASEGURAR PROMO CON RESPLANDOR ESMERALDA NEÓN
        if (this.dom.btnCashOut) {
          this.dom.btnCashOut.disabled = false;
          this.dom.btnCashOut.className = 'w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.7)] animate-glow-pulse transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer';
          this.dom.btnCashOut.innerHTML = `<span>🏆</span> <span>ASEGURAR Y CANJEAR: ${accumulatedPromo.badge}</span>`;
        }
      } else {
        if (this.dom.currentPromoTitle) {
          this.dom.currentPromoTitle.textContent = '¡Alinea tu primer granizado!';
        }
        if (this.dom.currentPromoDesc) {
          this.dom.currentPromoDesc.textContent = 'Supera cada nivel de velocidad para acumular promociones y ganar el 2x1.';
        }

        // Botón deshabilitado en reposo
        if (this.dom.btnCashOut) {
          this.dom.btnCashOut.disabled = true;
          this.dom.btnCashOut.className = 'w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-slate-500 font-black text-xs sm:text-sm uppercase tracking-wider border border-slate-700 transition-all duration-300 flex items-center justify-center gap-2 cursor-not-allowed shadow-none';
          this.dom.btnCashOut.innerHTML = '<span>🍸</span> <span>ASEGURAR PROMO Y CANJEAR</span>';
        }
      }
    }

    actualizarVidasUI(vidas) {
      const v = Math.max(0, vidas);
      if (this.dom.life1) this.dom.life1.classList.toggle('lost', v < 1);
      if (this.dom.life2) this.dom.life2.classList.toggle('lost', v < 2);
      if (this.dom.life3) this.dom.life3.classList.toggle('lost', v < 3);
      if (this.dom.livesLabel) this.dom.livesLabel.textContent = `${v}/3`;
    }

    mostrarModalFallo(vidasRestantes) {
      if (!this.dom.modalMiss) return;
      if (this.dom.missLivesStatus) {
        this.dom.missLivesStatus.innerHTML = vidasRestantes > 0 
          ? `<span>❤️</span> <span>Te quedan ${vidasRestantes} de 3 vidas</span>` 
          : '<span>💔</span> <span>Has consumido tus 3 vidas de esta partida</span>';
      }
      if (this.dom.missActionText) {
        this.dom.missActionText.textContent = vidasRestantes > 0 
          ? 'USAR OTRA VIDA Y CONTINUAR' 
          : 'JUGAR OTRA PARTIDA (3 VIDAS)';
      }
      this.dom.modalMiss.classList.remove('hidden');
    }

    ocultarModalFallo() {
      if (this.dom.modalMiss) this.dom.modalMiss.classList.add('hidden');
    }

    mostrarModalVoucher(data) {
      if (!this.dom.modalVoucher) return;
      if (this.dom.voucherPromoTitle) this.dom.voucherPromoTitle.textContent = data.badge;
      if (this.dom.voucherPromoName) this.dom.voucherPromoName.textContent = data.title;
      if (this.dom.voucherLevelReached) this.dom.voucherLevelReached.textContent = `Nivel ${data.level} Alcanzado (${data.bpm} BPM)`;
      if (this.dom.voucherTerminalId) this.dom.voucherTerminalId.textContent = `${data.terminal} • ${data.sig.slice(0, 10)}...`;
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
        } else {
          this.dom.voucherQrcode.innerHTML = `<div class="p-2 text-center text-[10px] text-slate-800 font-bold">QR Generado<br>${data.sig.slice(0, 10)}...</div>`;
        }
      }

      this.dom.modalVoucher.classList.remove('hidden');
    }

    ocultarModalVoucher() {
      if (this.dom.modalVoucher) this.dom.modalVoucher.classList.add('hidden');
    }

    lanzarConfeti() {
      if (this.confettiInstance) {
        this.confettiInstance({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    }

    mostrarModoPreview() {
      if (this.dom.previewModeBanner) this.dom.previewModeBanner.classList.remove('hidden');
      this.startAnimation(5.5);
      if (this.previewInterval) clearInterval(this.previewInterval);
      this.previewInterval = setInterval(() => {
        this.flashHitFeedback(true);
      }, 1500);
    }

    ocultarModoPreview() {
      if (this.dom.previewModeBanner) this.dom.previewModeBanner.classList.add('hidden');
      if (this.previewInterval) {
        clearInterval(this.previewInterval);
        this.previewInterval = null;
      }
    }
  }

  return HitbarViewClass;
});
