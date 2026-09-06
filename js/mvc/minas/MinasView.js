/**
 * MinasView.js - Paradice Juegos (MVC - Minas Paradice)
 * Renderizado de baldosas 3D de hielo, animaciones de flip, escala de premios y modales.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.MinasView = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  class MinasViewClass {
    constructor() {
      this.dom = {};
      this.confettiInstance = window.confetti || null;
    }

    init() {
      this.cacheDOM();
    }

    cacheDOM() {
      this.dom = {
        board: document.getElementById('mines-board'),
        minesSelect: document.getElementById('mines-count-select'),
        safeCountEl: document.getElementById('safe-tiles-uncovered'),
        totalSafeEl: document.getElementById('total-safe-tiles'),
        currentPromoTitle: document.getElementById('current-accumulated-promo'),
        currentPromoDesc: document.getElementById('current-accumulated-desc'),
        cashOutBtn: document.getElementById('btn-cash-out'),
        ladderList: document.getElementById('promo-ladder-list'),
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
        voucherHitsCount: document.getElementById('voucher-hits-count'),
        voucherTerminalId: document.getElementById('voucher-terminal-id'),
        voucherQrcode: document.getElementById('voucher-qrcode'),
        voucherWhatsappBtn: document.getElementById('voucher-whatsapp-btn'),
        btnVoucherPlayAgain: document.getElementById('btn-voucher-play-again'),
        // Modal Explosión
        modalBlast: document.getElementById('modal-mine-blast'),
        blastBadge: document.getElementById('blast-badge'),
        blastTitle: document.getElementById('blast-title'),
        blastMessage: document.getElementById('blast-message'),
        blastLivesStatus: document.getElementById('blast-lives-status'),
        btnBlastAction: document.getElementById('btn-blast-action'),
        blastActionText: document.getElementById('blast-action-text'),
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

    renderBoard(onTileClick) {
      if (!this.dom.board) return;
      this.dom.board.innerHTML = '';

      for (let i = 0; i < 25; i++) {
        const tile = document.createElement('div');
        tile.className = 'ice-tile cursor-pointer';
        tile.dataset.index = i;

        tile.innerHTML = `
          <div class="ice-tile-inner">
            <div class="ice-tile-front bg-gradient-to-br from-slate-900/95 to-slate-950/95 border border-sky-500/30 hover:border-cyan-400 flex items-center justify-center text-xl sm:text-2xl shadow-inner transition-all group">
              <span class="text-sky-400/40 group-hover:scale-110 group-hover:text-cyan-300 transition transform">🧊</span>
            </div>
            <div class="ice-tile-back bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-700 flex flex-col items-center justify-center p-1 text-center">
              <span class="tile-icon text-2xl sm:text-3xl filter drop-shadow"></span>
            </div>
          </div>
        `;

        tile.addEventListener('click', () => {
          if (onTileClick) onTileClick(i, tile);
        });

        this.dom.board.appendChild(tile);
      }
    }

    revelarCasillaSegura(tileEl, icon, step) {
      tileEl.classList.add('revealed');
      const back = tileEl.querySelector('.ice-tile-back');
      const iconSpan = tileEl.querySelector('.tile-icon');

      if (back) {
        back.className = 'ice-tile-back bg-gradient-to-br from-cyan-950/90 to-blue-900/80 border-2 border-cyan-400 flex flex-col items-center justify-center p-1 shadow-[0_0_15px_rgba(0,240,255,0.4)]';
      }
      if (iconSpan) {
        iconSpan.textContent = icon;
      }
    }

    revelarMina(tileEl, allMines) {
      tileEl.classList.add('revealed');
      const back = tileEl.querySelector('.ice-tile-back');
      const iconSpan = tileEl.querySelector('.tile-icon');

      if (back) {
        back.className = 'ice-tile-back bg-gradient-to-br from-rose-950/95 to-red-900/90 border-2 border-rose-500 flex flex-col items-center justify-center p-1 shadow-[0_0_20px_rgba(244,63,94,0.7)] animate-shake';
      }
      if (iconSpan) {
        iconSpan.textContent = '💥';
      }

      // Revelar las demás minas
      if (allMines) {
        allMines.forEach(mineIdx => {
          const otherTile = this.dom.board.querySelector(`.ice-tile[data-index="${mineIdx}"]`);
          if (otherTile && !otherTile.classList.contains('revealed')) {
            otherTile.classList.add('revealed');
            const otherBack = otherTile.querySelector('.ice-tile-back');
            const otherIcon = otherTile.querySelector('.tile-icon');
            if (otherBack) {
              otherBack.className = 'ice-tile-back bg-rose-950/60 border border-rose-500/50 flex items-center justify-center';
            }
            if (otherIcon) {
              otherIcon.textContent = '💣';
            }
          }
        });
      }
    }

    renderLadder(tiers, currentHits) {
      if (!this.dom.ladderList) return;
      this.dom.ladderList.innerHTML = '';

      tiers.forEach(tier => {
        const isReached = currentHits >= tier.hits;
        const item = document.createElement('div');
        item.className = `flex items-center justify-between p-2 rounded-xl text-xs transition-all ${
          isReached 
            ? 'bg-gradient-to-r from-pink-950/90 to-purple-950/80 border border-pink-400 text-white shadow-[0_0_12px_rgba(255,0,127,0.3)]' 
            : 'bg-slate-900/60 border border-slate-800 text-slate-400'
        }`;

        item.innerHTML = `
          <div class="flex items-center space-x-2">
            <span class="${isReached ? 'text-pink-300 font-bold' : 'text-slate-500 font-mono'}">${tier.hits} Hielos</span>
            <span class="font-semibold">${tier.title}</span>
          </div>
          <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
            isReached ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-500'
          }">${tier.badge}</span>
        `;

        this.dom.ladderList.appendChild(item);
      });
    }

    actualizarContadores(safeHits, totalSafe, currentPromo) {
      if (this.dom.safeCountEl) this.dom.safeCountEl.textContent = safeHits;
      if (this.dom.totalSafeEl) this.dom.totalSafeEl.textContent = totalSafe;

      if (currentPromo) {
        if (this.dom.currentPromoTitle) this.dom.currentPromoTitle.textContent = currentPromo.title;
        if (this.dom.currentPromoDesc) this.dom.currentPromoDesc.textContent = currentPromo.desc;
        if (this.dom.cashOutBtn) {
          this.dom.cashOutBtn.disabled = false;
          this.dom.cashOutBtn.className = 'w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs sm:text-sm uppercase tracking-wider border-2 border-emerald-300 shadow-[0_0_25px_rgba(52,211,153,0.7)] animate-glow-pulse transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer';
          this.dom.cashOutBtn.innerHTML = `<span>🏆</span> <span>ASEGURAR Y CANJEAR: ${currentPromo.title}</span>`;
        }
      } else {
        if (this.dom.currentPromoTitle) this.dom.currentPromoTitle.textContent = 'Destapa al menos 1 hielo seguro';
        if (this.dom.currentPromoDesc) this.dom.currentPromoDesc.textContent = 'Esquiva las minas para acumular beneficios comerciales.';
        if (this.dom.cashOutBtn) {
          this.dom.cashOutBtn.disabled = true;
          this.dom.cashOutBtn.className = 'w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-slate-500 font-black text-xs sm:text-sm uppercase tracking-wider border border-slate-700 transition-all duration-300 flex items-center justify-center gap-2 cursor-not-allowed shadow-none';
          this.dom.cashOutBtn.innerHTML = '<span>💎</span> <span>ASEGURAR PROMO Y CANJEAR</span>';
        }
      }
    }

    actualizarVidasUI(vidas) {
      if (this.dom.life1) this.dom.life1.classList.toggle('lost', vidas < 1);
      if (this.dom.life2) this.dom.life2.classList.toggle('lost', vidas < 2);
      if (this.dom.life3) this.dom.life3.classList.toggle('lost', vidas < 3);
      if (this.dom.livesLabel) this.dom.livesLabel.textContent = `${Math.max(0, vidas)}/3`;
    }

    mostrarModalExplosion(vidasRestantes) {
      if (!this.dom.modalBlast) return;
      if (this.dom.blastLivesStatus) {
        let hearts = '';
        for (let i = 1; i <= 3; i++) {
          hearts += i <= vidasRestantes ? '❤️' : '🖤';
        }
        this.dom.blastLivesStatus.innerHTML = `<span>${hearts}</span> <span>${vidasRestantes > 0 
          ? `Te quedan ${vidasRestantes} de 3 vidas.` 
          : 'Has agotado tus 3 vidas de esta ronda.'}</span>`;
      }
      if (this.dom.blastActionText) {
        this.dom.blastActionText.textContent = vidasRestantes > 0 
          ? 'USAR OTRA VIDA Y REINTENTAR' 
          : 'REINICIAR NUEVA PARTIDA (3 VIDAS)';
      }
      this.dom.modalBlast.classList.remove('hidden');
    }

    ocultarModalExplosion() {
      if (this.dom.modalBlast) this.dom.modalBlast.classList.add('hidden');
    }

    mostrarModalVoucher(data) {
      if (!this.dom.modalVoucher) return;
      if (this.dom.voucherPromoTitle) this.dom.voucherPromoTitle.textContent = data.badge;
      if (this.dom.voucherPromoName) this.dom.voucherPromoName.textContent = data.title;
      if (this.dom.voucherHitsCount) this.dom.voucherHitsCount.textContent = `${data.hits} hielos acertados (Minas: ${data.mines})`;
      if (this.dom.voucherTerminalId) this.dom.voucherTerminalId.textContent = `${data.terminal} • SIG: ${data.sig.slice(0, 8)}...`;
      if (this.dom.voucherWhatsappBtn) this.dom.voucherWhatsappBtn.href = data.waUrl;

      // Renderizar QR
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
          this.dom.voucherQrcode.innerHTML = `<span class="text-[9px] font-mono text-slate-900">${data.sig}</span>`;
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
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }

    mostrarModoPreview() {
      if (this.dom.previewModeBanner) this.dom.previewModeBanner.classList.remove('hidden');
      if (this.previewInterval) clearInterval(this.previewInterval);

      const icons = ['🍧', '🍹', '🍸', '🍇', '✨'];
      let step = 0;
      this.previewInterval = setInterval(() => {
        if (!this.dom.board) return;
        const tiles = Array.from(this.dom.board.querySelectorAll('.ice-tile:not(.revealed)'));
        if (tiles.length === 0 || step > 4) {
          const allTiles = this.dom.board.querySelectorAll('.ice-tile');
          allTiles.forEach(t => t.classList.remove('revealed'));
          step = 0;
          return;
        }
        const randTile = tiles[Math.floor(Math.random() * tiles.length)];
        if (randTile) {
          this.revelarCasillaSegura(randTile, icons[step % icons.length], step + 1);
          step++;
        }
      }, 1400);
    }

    ocultarModoPreview() {
      if (this.dom.previewModeBanner) this.dom.previewModeBanner.classList.add('hidden');
      if (this.previewInterval) {
        clearInterval(this.previewInterval);
        this.previewInterval = null;
      }
      const allTiles = this.dom.board?.querySelectorAll('.ice-tile');
      if (allTiles) {
        allTiles.forEach(t => t.classList.remove('revealed'));
      }
    }
  }

  return MinasViewClass;
});
