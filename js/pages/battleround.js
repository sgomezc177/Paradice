    (function () {
      'use strict';

      // 1. Estado Global del Juego
      const state = {
        cloudRelay: null,
        roomCode: null,
        isHost: false,
        myPlayerId: null,
        myPlayerName: 'Jugador',
        myAvatar: '🍹',
        players: [], // { id, name, avatar, score, isBot }
        currentTurnIndex: 0,
        board: [], // Casillas dinámicas (36 casillas en 2-5 jugadores, 49 casillas en 6 jugadores)
        myMinesCount: 0,
        targetScore: 1250,
        revanchaCount: 0,
        podium: [],
        isSpectator: false,
        isPlantingMode: false,
        plantableTileIndex: null,
        plantingTimer: null,
        isGameOver: false,
        botsList: [
          { name: 'Mateo', avatar: '🥃' },
          { name: 'Valentina', avatar: '🍧' },
          { name: 'DJ Santi', avatar: '⚡' },
          { name: 'Camila', avatar: '🍸' },
          { name: 'Lucía', avatar: '🍒' },
          { name: 'Sebas', avatar: '👑' },
          { name: 'Nico', avatar: '🚀' },
          { name: 'Aleja', avatar: '💎' },
          { name: 'Dani', avatar: '🥂' }
        ],
        heartbeatInterval: null,
        connectionTimeoutTimer: null,
        joinRetryInterval: null,
        isJoinAccepted: false,
        musicSyncInterval: null
      };

      // 2. Referencias DOM
      const dom = {
        viewLobby: document.getElementById('view-lobby'),
        viewRoomWaiting: document.getElementById('view-room-waiting'),
        viewGame: document.getElementById('view-game'),
        inputPlayerName: document.getElementById('input-player-name'),
        inputRoomCode: document.getElementById('input-room-code'),
        btnCreateRoom: document.getElementById('btn-create-room'),
        btnJoinRoom: document.getElementById('btn-join-room'),
        btnQuickPlayBots: document.getElementById('btn-quick-play-bots'),
        avatarSelector: document.getElementById('avatar-selector'),
        btnAvatarPrev: document.getElementById('btn-avatar-prev'),
        btnAvatarNext: document.getElementById('btn-avatar-next'),
        selectedAvatarIcon: document.getElementById('selected-avatar-icon'),
        // Waiting Room
        roomCodeDisplay: document.getElementById('room-code-display'),
        roomQrcode: document.getElementById('room-qrcode'),
        playerCountBadge: document.getElementById('player-count-badge'),
        roomPlayersList: document.getElementById('room-players-list'),
        guestConnectionStatus: document.getElementById('guest-connection-status'),
        btnCopyRoomCode: document.getElementById('btn-copy-room-code'),
        copyBtnText: document.getElementById('copy-btn-text'),
        btnShareRoomLink: document.getElementById('btn-share-room-link'),
        btnLeaveRoom: document.getElementById('btn-leave-room'),
        btnAddBot: document.getElementById('btn-add-bot'),
        btnStartGame: document.getElementById('btn-start-game'),
        headerRoomBadge: document.getElementById('header-room-badge'),
        headerRoomCode: document.getElementById('header-room-code'),
        // Target Points
        targetPointsBox: document.getElementById('target-points-box'),
        targetPointsBadge: document.getElementById('target-points-badge'),
        targetOptions: document.querySelectorAll('.target-opt'),
        gameTargetScore: document.getElementById('game-target-score'),
        // Spectator Banner
        spectatorBanner: document.getElementById('spectator-banner'),
        spectatorBannerText: document.getElementById('spectator-banner-text'),
        // Game Board, Cabecera y Notificador Dinámico
        gameHeaderBar: document.getElementById('game-header-bar'),
        headerBaseContent: document.getElementById('header-base-content'),
        headerPointsHud: document.getElementById('header-points-hud'),
        headerRebanchaMultBadge: document.getElementById('header-rebancha-mult-badge'),
        headerNotifContent: document.getElementById('header-notif-content'),
        headerNotifIcon: document.getElementById('header-notif-icon'),
        headerNotifTitle: document.getElementById('header-notif-title'),
        headerNotifMultTag: document.getElementById('header-notif-mult-tag'),
        headerNotifDesc: document.getElementById('header-notif-desc'),
        headerNotifThemeTag: document.getElementById('header-notif-theme-tag'),
        boardFooterLegend: document.getElementById('board-footer-legend'),
        battleGrid: document.getElementById('battle-grid'),
        currentTurnBadge: document.getElementById('current-turn-badge'),
        actionBannerPrompt: document.getElementById('action-banner-prompt'),
        btnSkipPlanting: document.getElementById('btn-skip-planting'),
        liveScoreboard: document.getElementById('live-scoreboard'),
        battleLog: document.getElementById('battle-log'),
        // Modal Game Over & Podio
        modalGameOver: document.getElementById('modal-game-over'),
        podiumContainer: document.getElementById('podium-container'),
        podium1st: document.getElementById('podium-1st'),
        podium1stName: document.getElementById('podium-1st-name'),
        podium1stScore: document.getElementById('podium-1st-score'),
        podium2nd: document.getElementById('podium-2nd'),
        podium2ndName: document.getElementById('podium-2nd-name'),
        podium2ndScore: document.getElementById('podium-2nd-score'),
        podium3rd: document.getElementById('podium-3rd'),
        podium3rdName: document.getElementById('podium-3rd-name'),
        podium3rdScore: document.getElementById('podium-3rd-score'),
        loserNameDisplay: document.getElementById('loser-name-display'),
        btnShareWhatsapp: document.getElementById('btn-share-whatsapp'),
        btnPlayAgain: document.getElementById('btn-play-again'),
        // Modal Instrucciones
        modalInstructions: document.getElementById('modal-instructions'),
        btnInstructions: document.getElementById('btn-instructions'),
        closeInstructionsBtn: document.getElementById('close-instructions-btn'),
        closeInstructionsBtnBottom: document.getElementById('btn-close-instructions-bottom'),
        // Audio Controls
        btnSoundToggle: document.getElementById('btn-sound-toggle'),
        soundIcon: document.getElementById('sound-icon'),
        btnMusicToggle: document.getElementById('btn-music-toggle'),
        musicIcon: document.getElementById('music-icon'),
        btnMusicNext: document.getElementById('btn-music-next'),
        musicTrackDisplay: document.getElementById('music-track-display'),
        // Menú Lateral Drawer
        btnOpenSidebar: document.getElementById('btn-open-sidebar'),
        btnCloseSidebar: document.getElementById('btn-close-sidebar'),
        sidebarDrawer: document.getElementById('sidebar-drawer'),
        sidebarBackdrop: document.getElementById('sidebar-backdrop'),
        // Modal Network Settings & TURN Relay
        modalNetworkSettings: document.getElementById('modal-network-settings'),
        btnOpenNetworkSettings: document.getElementById('btn-open-network-settings'),
        btnLobbyNetworkSettings: document.getElementById('btn-lobby-network-settings'),
        btnQuickNetworkSettings: document.getElementById('btn-quick-network-settings'),
        closeNetworkSettingsBtn: document.getElementById('close-network-settings-btn'),
        closeNetworkSettingsBtnBottom: document.getElementById('btn-close-network-settings-bottom'),
        sidebarTurnBadge: document.getElementById('sidebar-turn-badge'),
        modalTurnStatusBadge: document.getElementById('modal-turn-status-badge'),
        inputTurnUrl: document.getElementById('input-turn-url'),
        btnSaveTurnUrl: document.getElementById('btn-save-turn-url'),
        btnClearTurnUrl: document.getElementById('btn-clear-turn-url'),
        btnRunNetDiag: document.getElementById('btn-run-net-diag'),
        netDiagResults: document.getElementById('net-diag-results')
      };

      // 2.1 Paletas Neón de Color, Íconos y Categorías para la Rebancha
      const REBANCHA_THEMES = [
        {
          id: null,
          name: 'Hielo Cíber',
          coverIcon: '🧊',
          themeIcon: '🧊',
          borderColor: 'border-cyan-400',
          textColor: 'text-cyan-400',
          badgeBg: 'bg-cyan-500',
          tiers: [
            { type: 'HIELO', icon: '🧊', name: 'Cubo de Hielo', points: 5 },
            { type: 'CITRICO', icon: '🍋', name: 'Rodaja Cítrica', points: 10 },
            { type: 'CEREZA', icon: '🍒', name: 'Cereza Silvestre', points: 20 },
            { type: 'GRANIZADO', icon: '🍧', name: 'Granizado Suave', points: 25 },
            { type: 'COPA', icon: '🍹', name: 'Copa Refrescante', points: 50 },
            { type: 'COCTEL', icon: '🍸', name: 'Cóctel de Autor', points: 75 },
            { type: 'SHOT', icon: '🥃', name: 'Shot Prémium', points: 100 }
          ]
        },
        {
          id: 'theme-rebancha-1',
          name: 'Dorado VIP',
          coverIcon: '🧊',
          themeIcon: '🥂',
          borderColor: 'border-amber-400',
          textColor: 'text-amber-400',
          badgeBg: 'bg-amber-500',
          tiers: [
            { type: 'FICHA_ORO', icon: '🪙', name: 'Ficha VIP', points: 5 },
            { type: 'VASO_ENERGIA', icon: '🥤', name: 'Bebida Energizante', points: 10 },
            { type: 'BRINDIS_HELADO', icon: '🍻', name: 'Brindis Helado', points: 20 },
            { type: 'GRANIZADO_ORO', icon: '🍧', name: 'Granizado Dorado', points: 25 },
            { type: 'COPA_ORO', icon: '🍹', name: 'Copa Tropical Dorada', points: 50 },
            { type: 'BRINDIS_IMPERIAL', icon: '🥂', name: 'Brindis Imperial', points: 75 },
            { type: 'BOTELLA_VIP', icon: '🍾', name: 'Botella de Celebración', points: 100 }
          ]
        },
        {
          id: 'theme-rebancha-2',
          name: 'Rubí Glamour',
          coverIcon: '🧊',
          themeIcon: '💎',
          borderColor: 'border-pink-400',
          textColor: 'text-pink-400',
          badgeBg: 'bg-pink-500',
          tiers: [
            { type: 'CHISPA_ROSA', icon: '✨', name: 'Chispa Neón', points: 5 },
            { type: 'COCO_LOCO', icon: '🥥', name: 'Coco Loco Frío', points: 10 },
            { type: 'COPA_RUBI', icon: '🍷', name: 'Copa Rubí Selección', points: 20 },
            { type: 'GRANIZADO_ROSA', icon: '🍧', name: 'Granizado Rosé', points: 25 },
            { type: 'COPA_GLAMOUR', icon: '🍹', name: 'Copa Glamour Rosa', points: 50 },
            { type: 'COCTEL_COSMO', icon: '🍸', name: 'Cóctel Cosmopolitan', points: 75 },
            { type: 'SHOT_DIAMANTE', icon: '💎', name: 'Shot Diamante Rosa', points: 100 }
          ]
        },
        {
          id: 'theme-rebancha-3',
          name: 'Esmeralda Cool',
          coverIcon: '🧊',
          themeIcon: '🍸',
          borderColor: 'border-emerald-400',
          textColor: 'text-emerald-400',
          badgeBg: 'bg-emerald-500',
          tiers: [
            { type: 'TREBOL_SUERTE', icon: '🍀', name: 'Trébol de la Suerte', points: 5 },
            { type: 'SODA_LIMA', icon: '🥤', name: 'Soda Refrescante Lima', points: 10 },
            { type: 'JARRA_FROSTED', icon: '🍺', name: 'Jarra Helada Frosted', points: 20 },
            { type: 'GRANIZADO_MENTA', icon: '🍧', name: 'Granizado de Menta', points: 25 },
            { type: 'COPA_MOJITO', icon: '🍹', name: 'Copa Mojito Cool', points: 50 },
            { type: 'COCTEL_VERDE', icon: '🍸', name: 'Cóctel Green Paradise', points: 75 },
            { type: 'CORONA_VERDE', icon: '👑', name: 'Corona Esmeralda', points: 100 }
          ]
        },
        {
          id: 'theme-rebancha-4',
          name: 'Violeta Ultra',
          coverIcon: '🧊',
          themeIcon: '🏆',
          borderColor: 'border-purple-400',
          textColor: 'text-purple-400',
          badgeBg: 'bg-purple-500',
          tiers: [
            { type: 'ESTRELLA_VIP', icon: '⭐', name: 'Estrella Neón VIP', points: 5 },
            { type: 'BEAT_FIESTA', icon: '🎧', name: 'Beat de Fiesta', points: 10 },
            { type: 'BRINDIS_NOCHE', icon: '🍻', name: 'Brindis Doble Neón', points: 20 },
            { type: 'GRANIZADO_BLUE', icon: '🍧', name: 'Granizado Blue Velvet', points: 25 },
            { type: 'COPA_VIOLETA', icon: '🍹', name: 'Copa Púrpura Night', points: 50 },
            { type: 'COCTEL_ASTRAL', icon: '🍸', name: 'Cóctel Black Light', points: 75 },
            { type: 'TROFEO_NOCHE', icon: '🏆', name: 'Trofeo Campeón', points: 100 }
          ]
        }
      ];

      function getThemeForRevancha(count = 0) {
        if (count <= 0) return REBANCHA_THEMES[0];
        const themeIdx = ((count - 1) % (REBANCHA_THEMES.length - 1)) + 1;
        return REBANCHA_THEMES[themeIdx] || REBANCHA_THEMES[0];
      }

      // Multiplicador de robo por mina: 2 veces (el doble) del valor limpio de la casilla
      const MINE_STEAL_MULTIPLIER = 2;

      const audio = window.audioManager || window.ParadiceAudio;

      function openSidebar() {
        if (!dom.sidebarDrawer || !dom.sidebarBackdrop) return;
        dom.sidebarBackdrop.classList.remove('opacity-0', 'pointer-events-none');
        dom.sidebarBackdrop.classList.add('opacity-100', 'pointer-events-auto');
        dom.sidebarDrawer.classList.remove('translate-x-full');
      }

      function closeSidebar() {
        if (!dom.sidebarDrawer || !dom.sidebarBackdrop) return;
        dom.sidebarBackdrop.classList.remove('opacity-100', 'pointer-events-auto');
        dom.sidebarBackdrop.classList.add('opacity-0', 'pointer-events-none');
        dom.sidebarDrawer.classList.add('translate-x-full');
      }

      function openNetworkSettings() {
        closeSidebar();
        if (!dom.modalNetworkSettings) return;
        actualizarBadgeRed();
        dom.modalNetworkSettings.classList.remove('hidden');
      }

      function closeNetworkSettings() {
        if (!dom.modalNetworkSettings) return;
        dom.modalNetworkSettings.classList.add('hidden');
      }

      // 3. Inicialización
      function init() {
        bindEvents();
        checkUrlParams();
        updateAudioUI();
        actualizarBadgeRed();

        window.addEventListener('audiotrackchange', (e) => {
          if (dom.musicTrackDisplay) {
            dom.musicTrackDisplay.textContent = `🎵 ${e.detail.title}`;
          }
          if (state.isHost && state.roomCode && state.roomCode !== 'LOCAL-BOTS' && audio) {
            broadcast({
              type: 'MUSIC_SYNC',
              trackIndex: audio.currentTrackIndex,
              currentTime: audio.audioEl ? audio.audioEl.currentTime : 0
            });
          }
        });

        if (audio) {
          audio.onTrackEnded = () => {
            if (state.isHost && state.roomCode && state.roomCode !== 'LOCAL-BOTS') {
              audio.nextTrack();
              updateAudioUI();
            } else if (!state.isHost && state.roomCode && state.roomCode !== 'LOCAL-BOTS') {
              broadcast({
                type: 'REQUEST_NEXT_TRACK',
                from: state.myPlayerName || 'Un rival'
              });
            } else {
              audio.playRandomTrack();
            }
          };
        }
      }

      function updateAudioUI() {
        if (!audio) return;
        if (dom.soundIcon) dom.soundIcon.textContent = audio.isSfxMuted() ? '🔇' : '🔊';
        if (dom.musicIcon) dom.musicIcon.textContent = audio.isMusicMuted() ? '🔇' : '🎵';
        if (dom.musicTrackDisplay) dom.musicTrackDisplay.textContent = `🎵 ${audio.getTrackTitle()}`;
      }

      function checkUrlParams() {
        const searchStr = window.location.search || (window.location.href.includes('?') ? '?' + window.location.href.split('?')[1] : '');
        const urlParams = new URLSearchParams(searchStr);
        const room = urlParams.get('room');
        if (room) {
          const cleanRoom = room.trim().toUpperCase();
          if (dom.inputRoomCode) dom.inputRoomCode.value = cleanRoom;
          const banner = document.getElementById('invitation-banner');
          const codeSpan = document.getElementById('invite-room-code');
          if (banner) banner.classList.remove('hidden');
          if (codeSpan) codeSpan.textContent = cleanRoom;
        }
        if (urlParams.get('network') === '1' || window.location.hash === '#network') {
          openNetworkSettings();
        }
      }

      const AVAILABLE_AVATARS = [
        '🍹', '🥃', '🍧', '🍸', '🍺', '🥂', '🍷', '🍾', '🥤', '🥥',
        '⚡', '🔥', '👑', '💎', '🎉', '✨', '⭐', '🍒', '🍋', '🍉',
        '🕶️', '🎧', '🤖', '👾', '🚀', '💣', '🦄', '🐉', '🦁', '🐺', '🦊', '🐯', '🐼'
      ];

      function initAvatarSelector() {
        if (!dom.avatarSelector) return;
        dom.avatarSelector.innerHTML = '';
        AVAILABLE_AVATARS.forEach((av, idx) => {
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.dataset.avatar = av;
          const isSelected = av === state.myAvatar || (idx === 0 && !state.myAvatar);
          if (isSelected) {
            state.myAvatar = av;
            btn.className = 'avatar-opt flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-lg sm:text-xl flex items-center justify-center bg-rose-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.6)] scale-105 border border-rose-400 transition active:scale-95 cursor-pointer';
          } else {
            btn.className = 'avatar-opt flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-lg sm:text-xl flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition active:scale-95 cursor-pointer';
          }
          btn.textContent = av;
          btn.addEventListener('click', () => {
            dom.avatarSelector.querySelectorAll('.avatar-opt').forEach(b => {
              b.className = 'avatar-opt flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-lg sm:text-xl flex items-center justify-center bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition active:scale-95 cursor-pointer';
            });
            btn.className = 'avatar-opt flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl text-lg sm:text-xl flex items-center justify-center bg-rose-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.6)] scale-105 border border-rose-400 transition active:scale-95 cursor-pointer';
            state.myAvatar = av;
            if (dom.selectedAvatarIcon) dom.selectedAvatarIcon.textContent = av;
            btn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          });
          dom.avatarSelector.appendChild(btn);
        });

        if (dom.btnAvatarPrev) {
          dom.btnAvatarPrev.addEventListener('click', () => {
            dom.avatarSelector.scrollBy({ left: -140, behavior: 'smooth' });
          });
        }
        if (dom.btnAvatarNext) {
          dom.btnAvatarNext.addEventListener('click', () => {
            dom.avatarSelector.scrollBy({ left: 140, behavior: 'smooth' });
          });
        }
      }

      function bindEvents() {
        // Selector de avatar deslizable
        initAvatarSelector();

        // Crear Sala
        dom.btnCreateRoom.addEventListener('click', async () => {
          setupPlayerProfile();
          await iniciarHostRoom();
        });

        // Unirse a Sala
        dom.btnJoinRoom.addEventListener('click', async () => {
          setupPlayerProfile();
          const code = dom.inputRoomCode.value.trim().toUpperCase();
          if (!code) {
            alert('Por favor ingresa un código de sala válido.');
            return;
          }
          await unirseComoGuest(code);
        });

        // Partida Rápida vs Bots
        dom.btnQuickPlayBots.addEventListener('click', () => {
          setupPlayerProfile();
          iniciarPartidaBots();
        });

        // Agregar Bot en Sala de Espera
        dom.btnAddBot.addEventListener('click', () => {
          if (state.players.length >= 6) {
            alert('Máximo 6 jugadores por sala.');
            return;
          }
          const availableBot = state.botsList.find(b => !state.players.some(p => p.name === b.name)) || {
            name: `Bot ${state.players.length + 1}`,
            avatar: '🤖'
          };
          const botPlayer = {
            id: `bot-${Date.now()}-${Math.random()}`,
            name: availableBot.name,
            avatar: availableBot.avatar,
            score: 0,
            isBot: true,
            mines: 0
          };
          state.players.push(botPlayer);
          renderWaitingPlayers();
          notificarConexionJugador(botPlayer.name);
          broadcast({ type: 'UPDATE_PLAYERS', players: state.players });
        });

        // Selector de Meta de Puntos
        dom.targetOptions?.forEach(btn => {
          btn.addEventListener('click', () => {
            if (!state.isHost && state.roomCode && state.roomCode !== 'LOCAL-BOTS') {
              return;
            }
            const pts = parseInt(btn.dataset.points, 10);
            if (pts && [1250, 2500, 3750, 5000].includes(pts)) {
              actualizarMetaPuntos(pts);
              if (state.isHost) {
                broadcast({ type: 'TARGET_SCORE_CHANGED', targetScore: pts });
              }
            }
          });
        });

        // Iniciar Partida
        dom.btnStartGame.addEventListener('click', () => {
          if (state.players.length < 2) {
            alert('Se necesitan al menos 2 jugadores. ¡Puedes pulsar "Añadir Bot de Prueba" para probar ya mismo!');
            return;
          }
          state.podium = [];
          state.isSpectator = false;
          state.isGameOver = false;
          state.currentTurnIndex = 0;
          state.revanchaCount = 0;
          aplicarTemaTablero(0);
          state.players.forEach(p => {
            p.score = 0;
          });

          generarTableroBatalla();

          const is6p = state.players.length >= 6;
          const gameStartData = {
            type: 'START_GAME',
            players: state.players,
            turnIndex: state.currentTurnIndex,
            targetScore: state.targetScore,
            boardSize: state.board.length,
            boardRows: is6p ? 7 : 6,
            boardCols: is6p ? 7 : 6,
            musicSync: audio ? {
              trackIndex: audio.currentTrackIndex,
              currentTime: audio.audioEl ? audio.audioEl.currentTime : 0
            } : null
          };

          broadcast(gameStartData);
          iniciarPantallaJuego();
        });

        // Reiniciar / Jugar otra
        dom.btnPlayAgain.addEventListener('click', () => {
          dom.modalGameOver.classList.add('hidden');
          if (dom.spectatorBanner) dom.spectatorBanner.classList.add('hidden');
          state.isGameOver = false;
          state.isSpectator = false;
          state.podium = [];
          state.revanchaCount = 0;
          aplicarTemaTablero(0);
          if (state.isHost) {
            dom.btnStartGame.click();
          } else {
            dom.viewGame.classList.add('hidden');
            dom.viewRoomWaiting.classList.remove('hidden');
          }
        });

        // Menú Lateral (Drawer)
        dom.btnOpenSidebar?.addEventListener('click', openSidebar);
        dom.btnCloseSidebar?.addEventListener('click', closeSidebar);
        dom.sidebarBackdrop?.addEventListener('click', closeSidebar);

        // Controles de audio
        dom.btnSoundToggle.addEventListener('click', () => {
          if (audio) {
            audio.toggleSfx();
            updateAudioUI();
          }
        });

        dom.btnMusicToggle.addEventListener('click', () => {
          if (audio) {
            audio.toggleMusic();
            updateAudioUI();
          }
        });

        dom.btnMusicNext.addEventListener('click', () => {
          if (audio) {
            if (!state.isHost && state.roomCode && state.roomCode !== 'LOCAL-BOTS') {
              broadcast({
                type: 'REQUEST_NEXT_TRACK',
                from: state.myPlayerName || 'Un rival'
              });
            } else {
              audio.nextTrack();
              updateAudioUI();
            }
          }
        });

        // Botón saltar siembra de mina ("Dejar libre")
        dom.btnSkipPlanting?.addEventListener('click', () => {
          finalizarTurnoSinSiembra();
        });

        // Instrucciones
        dom.btnInstructions.addEventListener('click', () => {
          closeSidebar();
          dom.modalInstructions.classList.remove('hidden');
        });
        dom.closeInstructionsBtn.addEventListener('click', () => dom.modalInstructions.classList.add('hidden'));
        // Herramientas de Sala de Espera (A distancia)
        dom.btnCopyRoomCode?.addEventListener('click', () => {
          if (!state.roomCode) return;
          navigator.clipboard?.writeText(state.roomCode).then(() => {
            if (dom.copyBtnText) dom.copyBtnText.textContent = '¡Copiado!';
            setTimeout(() => {
              if (dom.copyBtnText) dom.copyBtnText.textContent = 'Copiar Código';
            }, 2000);
          }).catch(() => {
            prompt('Copia este código de sala para compartir:', state.roomCode);
          });
        });

        dom.btnShareRoomLink?.addEventListener('click', () => {
          if (!state.roomCode) return;
          const isFile = window.location.protocol === 'file:';
          let shareText = '';
          if (isFile) {
            shareText = `¡Únete a mi partida de Paradice BattleRound! 🍻 Abre el juego en tu celular e ingresa el código de sala: *${state.roomCode}*`;
          } else {
            const joinUrl = `${window.location.origin}${window.location.pathname}?room=${state.roomCode}`;
            shareText = `¡Únete a mi partida de Paradice BattleRound! 🍻 Código: *${state.roomCode}*. Entra directo aquí: ${joinUrl}`;
          }
          const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
          window.open(whatsappUrl, '_blank');
        });

        dom.btnLeaveRoom?.addEventListener('click', () => {
          desactivarWakeLock();
          if (state.cloudRelay) {
            try { state.cloudRelay.destroy(); } catch(e) {}
            state.cloudRelay = null;
          }
          if (state.heartbeatInterval) clearInterval(state.heartbeatInterval);
          if (state.musicSyncInterval) {
            clearInterval(state.musicSyncInterval);
            state.musicSyncInterval = null;
          }
          if (state.connectionTimeoutTimer) clearTimeout(state.connectionTimeoutTimer);
          if (state.joinRetryInterval) {
            clearInterval(state.joinRetryInterval);
            state.joinRetryInterval = null;
          }
          state.isJoinAccepted = false;
          ocultarNotificacionSiembra();
          dom.viewRoomWaiting.classList.add('hidden');
          dom.viewGame.classList.add('hidden');
          dom.viewLobby.classList.remove('hidden');
          dom.headerRoomBadge.classList.add('hidden');
        });

        // Herramientas de Red y Diagnóstico Cloud Relay WSS
        dom.btnOpenNetworkSettings?.addEventListener('click', openNetworkSettings);
        dom.btnLobbyNetworkSettings?.addEventListener('click', openNetworkSettings);
        dom.btnQuickNetworkSettings?.addEventListener('click', openNetworkSettings);
        dom.closeNetworkSettingsBtn?.addEventListener('click', closeNetworkSettings);
        dom.closeNetworkSettingsBtnBottom?.addEventListener('click', closeNetworkSettings);
        dom.btnRunNetDiag?.addEventListener('click', runNetworkDiagnostic);
      }

      function setupPlayerProfile() {
        const nameVal = dom.inputPlayerName.value.trim();
        state.myPlayerName = nameVal || `Jugador ${Math.floor(Math.random() * 900 + 100)}`;
        state.myPlayerId = `p-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      }

      // =========================================================================
      // Gestión de Suspensión Móvil y Screen Wake Lock
      // =========================================================================
      let screenWakeLock = null;
      async function activarWakeLock() {
        try {
          if ('wakeLock' in navigator) {
            screenWakeLock = await navigator.wakeLock.request('screen');
            console.log('Screen WakeLock activo: la pantalla no se suspenderá.');
            screenWakeLock.addEventListener('release', () => {
              screenWakeLock = null;
            });
          }
        } catch (e) {
          console.log('WakeLock no disponible o no permitido:', e);
        }
      }

      function desactivarWakeLock() {
        if (screenWakeLock) {
          try { screenWakeLock.release(); } catch(e) {}
          screenWakeLock = null;
        }
      }

      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
          if (!state.isGameOver && (state.isHost || state.cloudRelay)) {
            activarWakeLock();
          }
          if (state.cloudRelay && !state.cloudRelay.connected) {
            console.log('Pestaña visible: reconectando Cloud Relay...');
            state.cloudRelay._attemptConnection();
          }
        }
      });

      window.addEventListener('online', () => {
        if (state.cloudRelay && !state.cloudRelay.connected) {
          console.log('Red reanudada: reconectando Cloud Relay...');
          state.cloudRelay._attemptConnection();
        }
      });

      // =========================================================================
      // 4. Conexión Cloud Relay WSS (MQTT sobre WebSockets Seguros)
      // Servidor en la nube multi-región para conexión universal sin bloqueos de router
      // =========================================================================

      const CLOUD_BROKERS = [
        'wss://broker.emqx.io:8084/mqtt',
        'wss://broker.hivemq.com:8884/mqtt'
      ];

      class MiniMQTT {
        constructor(brokers = CLOUD_BROKERS) {
          this.brokers = Array.isArray(brokers) ? brokers : [brokers];
          this.brokerIdx = 0;
          this.ws = null;
          this.connected = false;
          this.packetId = 1;
          this.onMessage = null;
          this.onConnect = null;
          this.onError = null;
          this.onClose = null;
          this.pingTimer = null;
          this.connectTimeout = null;
          this.subscribedTopics = new Set();
          this.clientId = null;
          this.intentionalClose = false;
        }

        connect(clientId) {
          this.clientId = clientId || 'pd_' + Math.random().toString(16).slice(2, 10);
          this.intentionalClose = false;
          this._attemptConnection();
        }

        _attemptConnection() {
          if (this.intentionalClose) return;
          const currentBroker = this.brokers[this.brokerIdx % this.brokers.length];
          console.log(`[CloudRelay] Conectando a broker (${(this.brokerIdx % this.brokers.length) + 1}/${this.brokers.length}):`, currentBroker);

          try {
            this.ws = new WebSocket(currentBroker, 'mqtt');
            this.ws.binaryType = 'arraybuffer';
          } catch (e) {
            console.warn('[CloudRelay] Error creando WebSocket:', e);
            this._tryNextBroker();
            return;
          }

          if (this.connectTimeout) clearTimeout(this.connectTimeout);
          this.connectTimeout = setTimeout(() => {
            if (!this.connected) {
              console.warn('[CloudRelay] Timeout en broker actual, probando siguiente broker...');
              try { this.ws.close(); } catch(e) {}
              this._tryNextBroker();
            }
          }, 5500);

          this.ws.onopen = () => {
            const proto = [0x00, 0x04, 0x4d, 0x51, 0x54, 0x54, 0x04, 0x02, 0x00, 0x1e]; // MQTT 3.1.1, keepalive 30s
            const idBytes = new TextEncoder().encode(this.clientId);
            const varHeader = [...proto, idBytes.length >> 8, idBytes.length & 0xff, ...idBytes];
            const pkt = new Uint8Array([0x10, varHeader.length, ...varHeader]);
            this.ws.send(pkt);
          };

          this.ws.onmessage = (e) => {
            const data = new Uint8Array(e.data);
            const type = data[0] >> 4;

            if (type === 2) { // CONNACK
              if (data[3] === 0) {
                this.connected = true;
                if (this.connectTimeout) clearTimeout(this.connectTimeout);
                console.log('[CloudRelay] Conectado exitosamente al broker WSS');
                this.startPing();
                this.subscribedTopics.forEach(t => this._sendSubscribe(t));
                if (this.onConnect) this.onConnect(this.brokers[this.brokerIdx % this.brokers.length]);
              }
            } else if (type === 3) { // PUBLISH
              let offset = 1;
              while (data[offset] & 0x80) offset++;
              offset++;
              const topicLen = (data[offset] << 8) | data[offset + 1];
              offset += 2;
              const topic = new TextDecoder().decode(data.slice(offset, offset + topicLen));
              offset += topicLen;
              const payload = new TextDecoder().decode(data.slice(offset));
              if (this.onMessage) this.onMessage(topic, payload);
            }
          };

          this.ws.onerror = (err) => {
            console.warn('[CloudRelay] WebSocket error:', err);
            if (!this.connected) {
              this._tryNextBroker();
            } else if (this.onError) {
              this.onError(err);
            }
          };

          this.ws.onclose = () => {
            const wasConnected = this.connected;
            this.connected = false;
            if (this.pingTimer) clearInterval(this.pingTimer);
            if (this.onClose) this.onClose(wasConnected);

            if (!this.intentionalClose && wasConnected) {
              console.log('[CloudRelay] Desconexión detectada. Reconectando en 2 segundos...');
              setTimeout(() => this._attemptConnection(), 2000);
            }
          };
        }

        _tryNextBroker() {
          if (this.intentionalClose) return;
          if (this.ws) {
            try { this.ws.close(); } catch(e) {}
            this.ws = null;
          }
          this.brokerIdx++;
          setTimeout(() => this._attemptConnection(), 1000);
        }

        startPing() {
          if (this.pingTimer) clearInterval(this.pingTimer);
          this.pingTimer = setInterval(() => {
            if (this.connected && this.ws && this.ws.readyState === WebSocket.OPEN) {
              this.ws.send(new Uint8Array([0xc0, 0x00])); // PINGREQ
            }
          }, 15000);
        }

        subscribe(topic) {
          this.subscribedTopics.add(topic);
          if (this.connected) {
            this._sendSubscribe(topic);
          }
        }

        _sendSubscribe(topic) {
          const pId = this.packetId++;
          const tBytes = new TextEncoder().encode(topic);
          const body = [pId >> 8, pId & 0xff, tBytes.length >> 8, tBytes.length & 0xff, ...tBytes, 0x00];
          const pkt = new Uint8Array([0x82, body.length, ...body]);
          if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(pkt);
          }
        }

        publish(topic, msgOrObj) {
          if (!this.connected || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
          const msgStr = typeof msgOrObj === 'string' ? msgOrObj : JSON.stringify(msgOrObj);
          const tBytes = new TextEncoder().encode(topic);
          const mBytes = new TextEncoder().encode(msgStr);
          const body = [tBytes.length >> 8, tBytes.length & 0xff, ...tBytes, ...mBytes];

          let len = body.length;
          let lenBytes = [];
          do {
            let digit = len % 128;
            len = Math.floor(len / 128);
            if (len > 0) digit = digit | 0x80;
            lenBytes.push(digit);
          } while (len > 0);

          const pkt = new Uint8Array([0x30, ...lenBytes, ...body]);
          this.ws.send(pkt);
        }

        destroy() {
          this.intentionalClose = true;
          if (this.pingTimer) clearInterval(this.pingTimer);
          if (this.connectTimeout) clearTimeout(this.connectTimeout);
          if (this.ws) {
            try { this.ws.close(); } catch(e) {}
            this.ws = null;
          }
          this.connected = false;
          this.subscribedTopics.clear();
        }
      }

      function actualizarBadgeRed() {
        if (dom.sidebarTurnBadge) {
          dom.sidebarTurnBadge.textContent = 'CLOUD WSS ⚡';
          dom.sidebarTurnBadge.className = 'text-[9px] px-1.5 py-0.5 rounded font-mono bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-black';
        }
        if (dom.modalTurnStatusBadge) {
          dom.modalTurnStatusBadge.textContent = 'CLOUD RELAY ACTIVO ⚡';
          dom.modalTurnStatusBadge.className = 'px-2.5 py-1 rounded-full text-[10px] font-mono font-black bg-emerald-950 text-emerald-300 border border-emerald-500/50';
        }
      }

      async function runNetworkDiagnostic() {
        if (!dom.netDiagResults) return;
        dom.netDiagResults.innerHTML = '<div class="text-cyan-400">⏳ Conectando con los servidores Cloud Relay para medir latencia...</div>';

        const testBroker = (url) => new Promise((resolve) => {
          const t0 = performance.now();
          let ws;
          try {
            ws = new WebSocket(url, 'mqtt');
          } catch(e) {
            resolve({ url, ok: false, ms: 0, error: e.message });
            return;
          }
          const timer = setTimeout(() => {
            try { ws.close(); } catch(e) {}
            resolve({ url, ok: false, ms: 5000, error: 'Timeout' });
          }, 4500);

          ws.onopen = () => {
            const ms = Math.round(performance.now() - t0);
            clearTimeout(timer);
            try { ws.close(); } catch(e) {}
            resolve({ url, ok: true, ms });
          };

          ws.onerror = () => {
            clearTimeout(timer);
            resolve({ url, ok: false, ms: Math.round(performance.now() - t0), error: 'Error de conexión' });
          };
        });

        const results = await Promise.all(CLOUD_BROKERS.map(testBroker));
        let html = '<div class="space-y-1.5">';
        html += `<div class="text-xs font-bold text-white mb-1">Estado de Servidores Cloud Relay:</div>`;
        let allOk = false;
        results.forEach(res => {
          let hostName = res.url;
          try { hostName = new URL(res.url).host; } catch(e) {}
          if (res.ok) {
            allOk = true;
            html += `<div class="text-emerald-300">✅ Servidor ${hostName}: OPERATIVO (${res.ms} ms)</div>`;
          } else {
            html += `<div class="text-amber-400">⚠️ Servidor ${hostName}: ${res.error}</div>`;
          }
        });

        html += '<div class="mt-2 pt-2 border-t border-slate-800 text-[11px] leading-snug">';
        if (allOk) {
          html += '<span class="text-emerald-300 font-bold">🎉 ¡Conexión 100% blindada! Tu dispositivo tiene acceso a los servidores en la nube. Supera automáticamente aislamiento de Wi-Fi (WLAN_Invitados) y redes móviles (4G/5G).</span>';
        } else {
          html += '<span class="text-rose-300 font-bold">⚠️ No se pudo conectar a los servidores cloud. Verifica tu conexión a internet.</span>';
        }
        html += '</div></div>';
        dom.netDiagResults.innerHTML = html;
      }

      function generarCodigoSala() {
        return Math.floor(Math.random() * 9000 + 1000).toString();
      }

      function mostrarEstadoConexion(textoHtml, tipo = 'info', allowRetry = false) {
        if (!dom.guestConnectionStatus) return;
        dom.guestConnectionStatus.classList.remove(
          'hidden',
          'bg-cyan-950/80', 'border-cyan-500/50', 'text-cyan-200',
          'bg-emerald-950/80', 'border-emerald-500/50', 'text-emerald-200',
          'bg-amber-950/90', 'border-amber-500/60', 'text-amber-200',
          'bg-rose-950/90', 'border-rose-500', 'text-rose-200',
          'animate-pulse'
        );

        if (tipo === 'connecting') {
          dom.guestConnectionStatus.classList.add('bg-cyan-950/80', 'border', 'border-cyan-500/50', 'text-cyan-200', 'animate-pulse');
        } else if (tipo === 'connected') {
          dom.guestConnectionStatus.classList.add('bg-emerald-950/80', 'border', 'border-emerald-500/50', 'text-emerald-200');
        } else if (tipo === 'warning') {
          dom.guestConnectionStatus.classList.add('bg-amber-950/90', 'border', 'border-amber-500/60', 'text-amber-200');
        } else if (tipo === 'error') {
          dom.guestConnectionStatus.classList.add('bg-rose-950/90', 'border', 'border-rose-500', 'text-rose-200');
        } else {
          dom.guestConnectionStatus.classList.add('bg-slate-950/80', 'border', 'border-slate-700', 'text-slate-300');
        }

        let inner = `<div class="text-center w-full leading-snug">${textoHtml}</div>`;
        if (allowRetry) {
          inner += `
            <button id="btn-guest-retry-action" class="mt-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-black text-[11px] uppercase tracking-wider rounded-xl shadow-[0_0_10px_rgba(0,240,255,0.4)] transition active:scale-95 cursor-pointer">
              🔄 Reintentar Conexión Ahora
            </button>
          `;
        }
        dom.guestConnectionStatus.innerHTML = inner;

        if (allowRetry) {
          const btnRetry = document.getElementById('btn-guest-retry-action');
          btnRetry?.addEventListener('click', () => {
            if (state.roomCode) unirseComoGuest(state.roomCode);
          });
        }
      }

      function iniciarHeartbeat() {
        if (state.heartbeatInterval) clearInterval(state.heartbeatInterval);
        state.heartbeatInterval = setInterval(() => {
          if (state.cloudRelay && state.cloudRelay.connected && state.roomCode) {
            const topic = state.isHost
              ? `paradice/br/${state.roomCode}/host`
              : `paradice/br/${state.roomCode}/client`;
            state.cloudRelay.publish(topic, { type: 'HEARTBEAT' });
          }
        }, 12000);
      }

      async function iniciarHostRoom(codeOverride = null) {
        if (state.cloudRelay) {
          try { state.cloudRelay.destroy(); } catch(e) {}
          state.cloudRelay = null;
        }

        const roomCode = codeOverride || generarCodigoSala();
        state.roomCode = roomCode;
        state.isHost = true;

        dom.viewLobby.classList.add('hidden');
        dom.viewRoomWaiting.classList.remove('hidden');
        dom.roomCodeDisplay.textContent = roomCode;
        dom.headerRoomBadge.classList.remove('hidden');
        dom.headerRoomCode.textContent = roomCode;

        if (dom.guestConnectionStatus) {
          dom.guestConnectionStatus.classList.add('hidden');
        }
        if (dom.targetPointsBox) {
          dom.targetPointsBox.classList.remove('hidden');
        }
        notificarConexionJugador();

        if (dom.btnAddBot) dom.btnAddBot.classList.remove('hidden');
        if (dom.btnStartGame) dom.btnStartGame.classList.remove('hidden');

        activarWakeLock();

        // Renderizar Código QR
        let joinUrl = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
        if (!window.location.origin || window.location.origin === 'null' || window.location.protocol === 'file:') {
          joinUrl = `https://sgomezc177.github.io/Paradice/battleround.html?room=${roomCode}`;
        }
        dom.roomQrcode.innerHTML = '';
        if (typeof QRCode !== 'undefined') {
          new QRCode(dom.roomQrcode, {
            text: joinUrl,
            width: 140,
            height: 140,
            colorDark: '#040814',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
          });
        }

        // Agregar al host como jugador 1
        state.players = [{
          id: state.myPlayerId,
          name: state.myPlayerName,
          avatar: state.myAvatar,
          score: 0,
          isBot: false,
          mines: 0
        }];
        renderWaitingPlayers();
        actualizarBadgeRed();

        const clientTopic = `paradice/br/${roomCode}/client`;
        const hostTopic = `paradice/br/${roomCode}/host`;

        state.cloudRelay = new MiniMQTT(CLOUD_BROKERS);

        state.cloudRelay.onConnect = (brokerUrl) => {
          console.log('[Host] Conectado al Cloud Relay Broker:', brokerUrl);
          state.cloudRelay.subscribe(clientTopic);
          iniciarHeartbeat();

          // Iniciar música en host si no ha arrancado y activar sincronización periódica (cada 4s)
          if (audio && audio.currentTrackIndex < 0 && !audio.isMusicMuted()) {
            audio.playRandomTrack();
          }
          if (state.musicSyncInterval) clearInterval(state.musicSyncInterval);
          state.musicSyncInterval = setInterval(() => {
            if (state.isHost && state.roomCode && state.cloudRelay && state.cloudRelay.connected && audio && audio.currentTrackIndex >= 0) {
              broadcast({
                type: 'MUSIC_SYNC',
                trackIndex: audio.currentTrackIndex,
                currentTime: audio.audioEl ? audio.audioEl.currentTime : 0
              });
            }
          }, 4000);
        };

        state.cloudRelay.onMessage = (topic, payload) => {
          try {
            const msg = JSON.parse(payload);
            handlePeerMessage(msg);
          } catch (e) {
            console.warn('[Host] Error parseando mensaje:', e);
          }
        };

        state.cloudRelay.onError = (err) => {
          console.warn('[Host] Cloud Relay error:', err);
        };

        state.cloudRelay.connect(`host_${roomCode}_${Math.random().toString(16).slice(2, 8)}`);
      }

      async function unirseComoGuest(code) {
        if (state.cloudRelay) {
          try { state.cloudRelay.destroy(); } catch(e) {}
          state.cloudRelay = null;
        }
        if (state.musicSyncInterval) {
          clearInterval(state.musicSyncInterval);
          state.musicSyncInterval = null;
        }
        if (state.connectionTimeoutTimer) {
          clearTimeout(state.connectionTimeoutTimer);
          state.connectionTimeoutTimer = null;
        }
        if (state.joinRetryInterval) {
          clearInterval(state.joinRetryInterval);
          state.joinRetryInterval = null;
        }

        const cleanCode = code.trim().toUpperCase();
        state.roomCode = cleanCode;
        state.isHost = false;
        state.isJoinAccepted = false;

        dom.viewLobby.classList.add('hidden');
        dom.viewRoomWaiting.classList.remove('hidden');
        dom.roomCodeDisplay.textContent = cleanCode;
        dom.btnAddBot.classList.add('hidden');
        dom.btnStartGame.classList.add('hidden');
        dom.headerRoomBadge.classList.remove('hidden');
        dom.headerRoomCode.textContent = cleanCode;

        if (dom.targetPointsBox) {
          dom.targetPointsBox.classList.add('hidden');
        }
        notificarConexionJugador();

        mostrarEstadoConexion(`📡 Conectando al servidor Cloud Relay para la sala #${cleanCode}...`, 'connecting');

        const myGuestId = `guest-${cleanCode}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        state.myPlayerId = myGuestId;

        const clientTopic = `paradice/br/${cleanCode}/client`;
        const hostTopic = `paradice/br/${cleanCode}/host`;

        state.cloudRelay = new MiniMQTT(CLOUD_BROKERS);

        state.connectionTimeoutTimer = setTimeout(() => {
          if (!state.isJoinAccepted) {
            mostrarEstadoConexion(
              `⏳ La conexión está tardando más de lo habitual.<br><span class="text-[10px] text-amber-200">Asegúrate de que el anfitrión tenga la sala abierta en su pantalla.</span>`,
              'warning',
              true
            );
          }
        }, 12000);

        const enviarPlayerJoin = () => {
          if (state.isJoinAccepted || !state.cloudRelay || !state.cloudRelay.connected) return;
          try {
            state.cloudRelay.publish(clientTopic, {
              type: 'PLAYER_JOIN',
              player: {
                id: state.myPlayerId,
                name: state.myPlayerName,
                avatar: state.myAvatar,
                score: 0,
                isBot: false,
                mines: 0
              }
            });
            console.log('[Guest] PLAYER_JOIN enviado al host por Cloud Relay');
          } catch (e) {
            console.warn('[Guest] Error enviando PLAYER_JOIN:', e);
          }
        };

        state.cloudRelay.onConnect = (brokerUrl) => {
          console.log('[Guest] Conectado al Cloud Relay Broker:', brokerUrl);
          mostrarEstadoConexion('⚡ Enlazando con la sala del anfitrión...', 'connecting');
          state.cloudRelay.subscribe(hostTopic);

          setTimeout(enviarPlayerJoin, 200);

          if (state.joinRetryInterval) clearInterval(state.joinRetryInterval);
          let attempts = 0;
          state.joinRetryInterval = setInterval(() => {
            if (state.isJoinAccepted || attempts >= 8) {
              clearInterval(state.joinRetryInterval);
              state.joinRetryInterval = null;
              return;
            }
            attempts++;
            enviarPlayerJoin();
          }, 1500);

          iniciarHeartbeat();
          activarWakeLock();
        };

        state.cloudRelay.onMessage = (topic, payload) => {
          try {
            const msg = JSON.parse(payload);
            handlePeerMessage(msg);
          } catch (e) {
            console.warn('[Guest] Error parseando mensaje:', e);
          }
        };

        state.cloudRelay.onError = (err) => {
          console.warn('[Guest] Cloud Relay error:', err);
        };

        state.cloudRelay.connect(`guest_${cleanCode}_${Math.random().toString(16).slice(2, 8)}`);
      }

      function broadcast(msg) {
        if (!state.cloudRelay || !state.cloudRelay.connected || !state.roomCode) return;
        const topic = state.isHost
          ? `paradice/br/${state.roomCode}/host`
          : `paradice/br/${state.roomCode}/client`;
        state.cloudRelay.publish(topic, msg);
      }

      function handlePeerMessage(msg) {
        if (!msg || !msg.type) return;

        if (msg.type === 'HEARTBEAT') {
          return;
        } else if (msg.type === 'PLAYER_JOIN' && state.isHost) {
          if (state.players.length >= 6) return;
          const exists = state.players.some(p => p.id === msg.player.id);
          if (!exists) {
            state.players.push({
              ...msg.player
            });
            notificarConexionJugador(msg.player.name);
          }
          renderWaitingPlayers();
          broadcast({
            type: 'JOIN_ACCEPTED',
            targetPlayerId: msg.player.id,
            players: state.players,
            turnIndex: state.currentTurnIndex,
            targetScore: state.targetScore,
            musicSync: audio ? {
              trackIndex: audio.currentTrackIndex,
              currentTime: audio.audioEl ? audio.audioEl.currentTime : 0
            } : null
          });
          broadcast({ type: 'UPDATE_PLAYERS', players: state.players });
        } else if (msg.type === 'TARGET_SCORE_CHANGED') {
          actualizarMetaPuntos(msg.targetScore);
        } else if (msg.type === 'JOIN_ACCEPTED') {
          if (!msg.targetPlayerId || msg.targetPlayerId === state.myPlayerId || !state.isJoinAccepted) {
            state.isJoinAccepted = true;
            if (state.joinRetryInterval) {
              clearInterval(state.joinRetryInterval);
              state.joinRetryInterval = null;
            }
            if (state.connectionTimeoutTimer) {
              clearTimeout(state.connectionTimeoutTimer);
              state.connectionTimeoutTimer = null;
            }
            state.players = msg.players;
            if (msg.targetScore) {
              actualizarMetaPuntos(msg.targetScore);
            }
            if (msg.musicSync && audio && !state.isHost) {
              audio.syncTrack(msg.musicSync.trackIndex, msg.musicSync.currentTime);
              updateAudioUI();
            }
            renderWaitingPlayers();
            notificarConexionJugador();
            mostrarEstadoConexion('✅ ¡Conectado con éxito! Esperando que el anfitrión inicie...', 'connected');
          }
        } else if (msg.type === 'UPDATE_PLAYERS') {
          const prevCount = state.players.length;
          state.players = msg.players;
          renderWaitingPlayers();
          if (state.players.length > prevCount) {
            const newlyAdded = state.players[state.players.length - 1];
            if (newlyAdded && newlyAdded.id !== state.myPlayerId) {
              notificarConexionJugador(newlyAdded.name);
            }
          }
        } else if (msg.type === 'START_GAME') {
          state.players = msg.players;
          state.currentTurnIndex = msg.turnIndex || 0;
          state.targetScore = msg.targetScore || state.targetScore || 1250;
          state.podium = [];
          state.isSpectator = false;
          state.isGameOver = false;
          state.isPlantingMode = false;
          state.plantableTileIndex = null;
          state.revanchaCount = 0;
          aplicarTemaTablero(0);
          ocultarNotificacionSiembra();
          if (dom.spectatorBanner) dom.spectatorBanner.classList.add('hidden');
          // Inicializar las casillas en el Guest (36 para 2-5 jugadores, 49 para 6 jugadores)
          const totalTiles = msg.boardSize || (state.players.length >= 6 ? 49 : 36);
          state.board = Array.from({ length: totalTiles }, (_, idx) => ({
            index: idx,
            revealedTo: [],
            publiclyRevealed: false,
            isExplosion: false,
            mineBy: null,
            victimAvatar: null,
            victimName: null,
            pointsLabel: '',
            icon: '🧊',
            name: 'Hielo'
          }));
          if (msg.musicSync && audio && !state.isHost) {
            audio.syncTrack(msg.musicSync.trackIndex, msg.musicSync.currentTime);
            updateAudioUI();
          }
          iniciarPantallaJuego();
        } else if (msg.type === 'BOARD_REVANCHA') {
          if (state.isPlantingMode) {
            state.isPlantingMode = false;
            state.plantableTileIndex = null;
            ocultarNotificacionSiembra();
          }
          state.revanchaCount = msg.revanchaCount || 1;
          if (msg.players) state.players = msg.players;
          if (typeof msg.turnIndex === 'number') state.currentTurnIndex = msg.turnIndex;
          const totalTiles = msg.boardSize || (state.players.length >= 6 ? 49 : 36);
          const count = state.revanchaCount;
          const activeTheme = getThemeForRevancha(count);
          state.board = Array.from({ length: totalTiles }, (_, idx) => ({
            index: idx,
            revealedTo: [],
            publiclyRevealed: false,
            isExplosion: false,
            mineBy: null,
            victimAvatar: null,
            victimName: null,
            pointsLabel: '',
            icon: activeTheme.coverIcon || '🧊',
            coverIcon: activeTheme.coverIcon || '🧊',
            name: 'Hielo'
          }));
          aplicarTemaTablero(state.revanchaCount);
          renderTableroVisual(true);
          actualizarScoreboard();
          actualizarTurnoUI();
          mostrarBannerRebancha(state.revanchaCount);
          if (msg.musicSync && audio && !state.isHost) {
            audio.syncTrack(msg.musicSync.trackIndex, msg.musicSync.currentTime || 0);
            updateAudioUI();
          } else if (audio && audio.playCoinWin) {
            audio.playCoinWin();
          }
          logEvent(`🔥 <strong>¡REBANCHA #${state.revanchaCount}!</strong> Nueva matriz (${activeTheme.name} ${activeTheme.themeIcon || '✨'}) y nueva música. ¡Puntos conservados!`);
        } else if (msg.type === 'TILE_CLICK') {
          if (state.isHost) {
            procesarClicCasilla(msg.tileIndex, msg.playerId);
          }
        } else if (msg.type === 'PLANT_MINE') {
          registrarMinaPlantada(msg.tileIndex, msg.planterId);
          if (state.isHost) {
            pasarSiguienteTurno();
          }
        } else if (msg.type === 'PASS_TURN') {
          if (state.isHost) {
            pasarSiguienteTurno();
          }
        } else if (msg.type === 'MINE_PLANTED' || msg.type === 'MINE_PLANTED_SYNC') {
          registrarMinaPlantada(msg.tileIndex, msg.planterId);
        } else if (msg.type === 'CLEAN_TILE_RESULT' && msg.playerId === state.myPlayerId) {
          const tile = state.board[msg.tileIndex];
          if (tile) {
            if (!tile.revealedTo) tile.revealedTo = [];
            if (!tile.revealedTo.includes(state.myPlayerId)) tile.revealedTo.push(state.myPlayerId);
            if (msg.tileInfo) {
              tile.icon = msg.tileInfo.icon;
              tile.name = msg.tileInfo.name;
              tile.points = msg.tileInfo.points;
              tile.pointsLabel = msg.tileInfo.pointsLabel || `+${msg.tileInfo.points} pts`;
            }
            if (msg.players) state.players = msg.players;
            actualizarTileVisual(msg.tileIndex);
            actualizarScoreboard();
            state.myMinesCount = Math.max(1, state.myMinesCount);
            if (audio && audio.playCoinWin) audio.playCoinWin();
            mostrarNotificacionSiembra(msg.tileIndex);
          }
        } else if (msg.type === 'TILE_EXPLODED') {
          const tile = state.board[msg.tileIndex];
          if (tile) {
            tile.isExplosion = true;
            tile.publiclyRevealed = true;
            tile.victimAvatar = msg.victimAvatar;
            tile.victimName = msg.victimName;
            tile.pointsLabel = `-${msg.stolenPoints} pts`;
            actualizarTileVisual(msg.tileIndex);
          }
          if (msg.players) state.players = msg.players;
          if (msg.podium) state.podium = msg.podium;
          actualizarScoreboard();
          if (audio && audio.playExplosion) audio.playExplosion();
          dom.battleGrid.classList.add('animate-shake');
          setTimeout(() => dom.battleGrid.classList.remove('animate-shake'), 500);
          const victim = state.players.find(p => p.id === msg.victimId);
          const planter = state.players.find(p => p.id === msg.planterId);
          logEvent(`💥 <strong>¡EMBOSCADA!</strong> ${msg.victimAvatar || '👤'} ${victim ? victim.name : 'Un rival'} pisó la mina de <strong>${planter ? planter.name : 'un rival'}</strong>. ¡${planter ? planter.name : 'Rival'} le robó <strong>${msg.stolenPoints} pts</strong>!`);
        } else if (msg.type === 'PLAYER_EXPLORED_CLEAN') {
          state.players = msg.players;
          actualizarScoreboard();
          const p = state.players.find(x => x.id === msg.playerId);
          if (p && p.id !== state.myPlayerId) {
            logEvent(`❄️ ${p.avatar || '👤'} ${p.name} exploró una casilla de hielo.`);
          }
        } else if (msg.type === 'PLAYER_REACHED_GOAL') {
          if (msg.podium) state.podium = msg.podium;
          if (msg.players) state.players = msg.players;
          const winnerEntry = state.podium.find(p => p.id === msg.playerId);
          if (winnerEntry) {
            const medal = winnerEntry.rank === 1 ? '🥇' : (winnerEntry.rank === 2 ? '🥈' : '🥉');
            const rankName = winnerEntry.rank === 1 ? '1er Lugar • Campeón' : (winnerEntry.rank === 2 ? '2do Lugar • Subcampeón' : '3er Lugar • Tercer Puesto');
            logEvent(`👑 ¡${medal} <strong>${winnerEntry.avatar} ${winnerEntry.name}</strong> alcanzó la meta (${winnerEntry.score}/${state.targetScore} pts) y asegura el <strong>${rankName}</strong>!`);
          }
          if (msg.playerId === state.myPlayerId) {
            state.isSpectator = true;
            if (dom.spectatorBanner) {
              dom.spectatorBanner.classList.remove('hidden');
              if (dom.spectatorBannerText && winnerEntry) {
                const medal = winnerEntry.rank === 1 ? '🥇' : (winnerEntry.rank === 2 ? '🥈' : '🥉');
                dom.spectatorBannerText.textContent = `¡Alcanzaste la meta con ${winnerEntry.score} pts! Aseguraste el ${medal} ${winnerEntry.rank}º Lugar. Modo Espectador activo.`;
              }
            }
          }
          actualizarScoreboard();
          actualizarTurnoUI();
        } else if (msg.type === 'GAME_SYNC') {
          state.players = msg.players;
          state.currentTurnIndex = msg.turnIndex;
          if (msg.podium) state.podium = msg.podium;
          if (msg.musicSync && audio && !state.isHost) {
            audio.syncTrack(msg.musicSync.trackIndex, msg.musicSync.currentTime);
            updateAudioUI();
          }
          actualizarScoreboard();
          actualizarTurnoUI();
        } else if (msg.type === 'GAME_OVER') {
          state.isGameOver = true;
          state.podium = msg.podium || state.podium;
          if (msg.players) state.players = msg.players;
          ocultarNotificacionSiembra();
          desactivarWakeLock();
          const loser = msg.loser || (state.podium[state.podium.length - 1]);
          mostrarModalFinJuego(state.podium, loser);
        } else if (msg.type === 'MUSIC_SYNC') {
          if (audio && !state.isHost) {
            audio.syncTrack(msg.trackIndex, msg.currentTime);
            updateAudioUI();
          }
        } else if (msg.type === 'REQUEST_NEXT_TRACK') {
          if (state.isHost && audio) {
            audio.nextTrack();
            updateAudioUI();
            if (msg.from) {
              logEvent(`🎵 <strong>${msg.from}</strong> cambió la canción.`);
            }
            broadcast({
              type: 'MUSIC_SYNC',
              trackIndex: audio.currentTrackIndex,
              currentTime: audio.audioEl ? audio.audioEl.currentTime : 0
            });
          }
        }
      }

      function renderWaitingPlayers() {
        dom.playerCountBadge.textContent = `${state.players.length}/6`;
        dom.roomPlayersList.innerHTML = '';
        state.players.forEach(p => {
          const item = document.createElement('div');
          item.className = 'flex items-center justify-between p-2 rounded-xl bg-slate-950/80 border border-slate-800';
          item.innerHTML = `
            <div class="flex items-center space-x-2">
              <span class="text-base">${p.avatar}</span>
              <span class="font-bold text-white">${p.name}</span>
            </div>
            <span class="text-[10px] font-black uppercase ${p.id === state.myPlayerId ? 'text-cyan-400' : 'text-slate-500'}">
              ${p.id === state.myPlayerId ? 'TÚ' : (p.isBot ? 'BOT' : 'RIVAL')}
            </span>
          `;
          dom.roomPlayersList.appendChild(item);
        });
      }

      function notificarConexionJugador(nombreJugador) {
        const box = document.getElementById('connection-notify-box');
        const icon = document.getElementById('conn-notify-icon');
        const text = document.getElementById('conn-notify-text');
        if (!text) return;

        if (nombreJugador) {
          // Cambia de color dinámicamente: resplandor esmeralda / dorado que avisa que alguien se conectó
          if (box) {
            box.className = 'w-full py-2 px-3 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 text-center my-1.5 shadow-[0_0_25px_rgba(52,211,153,0.5)] transition-all duration-300 scale-102';
          }
          if (icon) {
            icon.className = 'inline-block text-base animate-bounce';
            icon.textContent = '🎉';
          }
          text.className = 'text-xs font-black text-emerald-200 uppercase tracking-wide';
          text.textContent = `¡${nombreJugador} se acaba de conectar!`;

          setTimeout(() => {
            if (box) {
              box.className = 'w-full py-1.5 px-3 rounded-2xl bg-slate-950/70 border border-amber-500/40 text-center my-1.5 transition-all duration-300';
            }
            if (icon) {
              icon.className = 'inline-block w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse';
              icon.textContent = '';
            }
            text.className = 'text-xs font-bold text-amber-300 transition-colors duration-300';
            text.textContent = `👥 ${state.players.length} jugadores listos en la mesa`;
          }, 3500);
        } else {
          // Estado inicial / espera
          if (box) {
            box.className = 'w-full py-1.5 px-3 rounded-2xl bg-slate-950/70 border border-cyan-500/30 text-center my-1.5 transition-all duration-300';
          }
          if (icon) {
            icon.className = 'inline-block w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping';
            icon.textContent = '';
          }
          text.className = 'text-xs font-bold text-cyan-300 transition-colors duration-300';
          text.textContent = state.players.length > 1 
            ? `👥 ${state.players.length} jugadores listos en la mesa` 
            : 'Esperando que se unan jugadores...';
        }
      }

      function iniciarPartidaBots() {
        state.isHost = true;
        state.roomCode = 'LOCAL-BOTS';
        state.podium = [];
        state.isSpectator = false;
        state.isGameOver = false;
        state.revanchaCount = 0;
        aplicarTemaTablero(0);
        state.players = [
          { id: state.myPlayerId, name: state.myPlayerName, avatar: state.myAvatar, score: 0, isBot: false, mines: 0 },
          { id: 'bot-1', name: 'Mateo', avatar: '🥃', score: 0, isBot: true, mines: 0 },
          { id: 'bot-2', name: 'Valentina', avatar: '🍧', score: 0, isBot: true, mines: 0 }
        ];
        generarTableroBatalla();
        state.currentTurnIndex = 0;
        iniciarPantallaJuego();
      }

      // =========================================================================
      // 5. Lógica del Tablero Dinámico (6x6 o 7x7) y Batalla
      // =========================================================================
      function generarTableroBatalla() {
        state.board = [];
        const is6Players = state.players.length >= 6;
        const totalTiles = is6Players ? 49 : 36;

        // Multiplicador progresivo de rebancha: Ronda 0 = 1x, Rebancha 1 = 2x, Rebancha 2 = 4x, Rebancha 3 = 8x...
        const count = state.revanchaCount || 0;
        const rebanchaMultiplier = count > 0 ? Math.pow(2, count) : 1;

        // Seleccionar paleta temática según el número de Rebancha actual
        const activeTheme = getThemeForRevancha(count);
        const rawTiers = activeTheme.tiers;
        const POINT_DEFINITIONS = rawTiers.map(def => ({
          ...def,
          points: def.points * rebanchaMultiplier
        }));

        let items = [];
        if (is6Players) {
          // Tablero 7x7 (49 casillas): 7 de cada una de las 7 categorías (7 * 7 = 49 casillas)
          POINT_DEFINITIONS.forEach(def => {
            for (let k = 0; k < 7; k++) {
              items.push({ ...def });
            }
          });
        } else {
          // Tablero 6x6 (36 casillas): 5 de cada una de las 7 categorías (35 casillas) + 1 extra balanceado
          POINT_DEFINITIONS.forEach(def => {
            for (let k = 0; k < 5; k++) {
              items.push({ ...def });
            }
          });
          items.push({ ...POINT_DEFINITIONS[4] }); // Categoría intermedia extra
        }

        // Barajar aleatoriamente en el tablero (Fisher-Yates)
        for (let i = items.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [items[i], items[j]] = [items[j], items[i]];
        }

        for (let idx = 0; idx < totalTiles; idx++) {
          state.board.push({
            index: idx,
            type: items[idx].type,
            icon: items[idx].icon,
            name: items[idx].name,
            points: items[idx].points,
            initialPoints: items[idx].points,
            revealedTo: [], // Jugadores que lo han explorado en privado
            publiclyRevealed: false,
            isExplosion: false,
            mineBy: null, // ID del jugador que plantó la mina aquí (secreto)
            pointsLabel: `+${items[idx].points} pts`,
            coverIcon: activeTheme.coverIcon || '🧊'
          });
        }

        actualizarLeyendaTablero(count);
      }

      function actualizarMetaPuntos(pts) {
        state.targetScore = pts;
        if (dom.targetPointsBadge) {
          dom.targetPointsBadge.textContent = `${pts} pts`;
        }
        if (dom.gameTargetScore) {
          dom.gameTargetScore.textContent = `${pts}`;
        }
        dom.targetOptions?.forEach(btn => {
          const btnPts = parseInt(btn.dataset.points, 10);
          if (btnPts === pts) {
            btn.className = 'target-opt py-1.5 px-1 rounded-xl text-xs font-black border border-amber-400 bg-amber-500 text-slate-950 shadow-[0_0_12px_rgba(250,204,21,0.6)] transition cursor-pointer';
          } else {
            btn.className = 'target-opt py-1.5 px-1 rounded-xl text-xs font-black border border-slate-700 bg-slate-900 text-slate-300 hover:border-amber-400 transition cursor-pointer';
          }
        });
      }

      function verificarPuestoPodio(player) {
        if (!player) return null;
        if (player.score >= state.targetScore && !state.podium.some(p => p.id === player.id)) {
          const rank = state.podium.length + 1;
          const entry = {
            id: player.id,
            name: player.name,
            avatar: player.avatar,
            score: player.score,
            rank: rank
          };
          state.podium.push(entry);

          const medal = rank === 1 ? '🥇' : (rank === 2 ? '🥈' : '🥉');
          const rankName = rank === 1 ? '1er Lugar • Campeón' : (rank === 2 ? '2do Lugar • Subcampeón' : '3er Lugar • Tercer Puesto');
          logEvent(`👑 ¡${medal} <strong>${player.avatar} ${player.name}</strong> alcanzó la meta (${player.score}/${state.targetScore} pts) y asegura el <strong>${rankName}</strong>!`);

          if (player.id === state.myPlayerId) {
            state.isSpectator = true;
            if (dom.spectatorBanner) {
              dom.spectatorBanner.classList.remove('hidden');
              if (dom.spectatorBannerText) {
                dom.spectatorBannerText.textContent = `¡Alcanzaste la meta con ${player.score} pts! Aseguraste el ${medal} ${rankName}. Modo Espectador activo viendo la disputa del podio.`;
              }
            }
          }

          if (state.isHost) {
            broadcast({
              type: 'PLAYER_REACHED_GOAL',
              podium: state.podium,
              playerId: player.id,
              players: state.players
            });
          }

          return entry;
        }
        return null;
      }

      function aplicarTemaTablero(revanchaCount = 0) {
        if (!dom.battleGrid) return;
        REBANCHA_THEMES.forEach(th => {
          if (th.id) dom.battleGrid.classList.remove(th.id);
        });

        if (revanchaCount > 0) {
          const theme = getThemeForRevancha(revanchaCount);
          if (theme.id) {
            dom.battleGrid.classList.add(theme.id);
          }
        }
      }

      function actualizarLeyendaTablero(count = 0) {
        if (!dom.boardFooterLegend) return;
        const mult = count > 0 ? Math.pow(2, count) : 1;
        const activeTheme = getThemeForRevancha(count);
        const tiers = activeTheme.tiers;
        const tierSummary = tiers.map(t => `${t.icon} ${t.points * mult}`).join(' | ');
        if (mult > 1) {
          dom.boardFooterLegend.innerHTML = `<span class="font-black text-amber-300">⚡ REBANCHA #${count} (PUNTOS x${mult}):</span> ${tierSummary} pts • 💣 Minas roban el doble (${MINE_STEAL_MULTIPLIER}x).`;
        } else {
          dom.boardFooterLegend.innerHTML = `${tierSummary} pts • 💣 Siembra minas secretas para robar el doble (${MINE_STEAL_MULTIPLIER}x de la casilla).`;
        }
      }

      let rebanchaNotifTimer = null;
      function mostrarBannerRebancha(count) {
        if (!dom.gameHeaderBar) return;
        const theme = getThemeForRevancha(count);
        const mult = count > 0 ? Math.pow(2, count) : 1;

        // 1. Multiplicador progresivo en el HUD de puntos
        if (dom.headerRebanchaMultBadge) {
          if (mult > 1) {
            dom.headerRebanchaMultBadge.textContent = `x${mult}`;
            dom.headerRebanchaMultBadge.classList.remove('hidden');
          } else {
            dom.headerRebanchaMultBadge.classList.add('hidden');
          }
        }

        // 2. Capa de Notificación integrada en la cabecera
        if (dom.headerNotifIcon) {
          dom.headerNotifIcon.textContent = theme.themeIcon || theme.coverIcon || '🔥';
        }
        if (dom.headerNotifTitle) {
          dom.headerNotifTitle.textContent = `¡REBANCHA #${count}!`;
        }
        if (dom.headerNotifMultTag) {
          dom.headerNotifMultTag.textContent = `PUNTOS x${mult}`;
          dom.headerNotifMultTag.className = `px-1.5 py-0.5 rounded-md font-black text-[9px] uppercase shadow ${theme.badgeBg || 'bg-amber-400'} text-slate-950`;
        }
        if (dom.headerNotifDesc) {
          dom.headerNotifDesc.textContent = `¡Nueva matriz temática y puntos multiplicados x${mult}!`;
        }
        if (dom.headerNotifThemeTag) {
          dom.headerNotifThemeTag.textContent = theme.name;
          dom.headerNotifThemeTag.className = `flex-shrink-0 text-[10px] font-mono font-black ${theme.textColor || 'text-amber-400'} uppercase tracking-tight bg-slate-950/90 border ${theme.borderColor || 'border-amber-500/50'} px-2 py-0.5 rounded-lg ml-1`;
        }

        // 3. Estilizar el contenedor de la cabecera con el color temático
        dom.gameHeaderBar.className = `w-full relative min-h-[48px] p-2 sm:p-2.5 rounded-2xl bg-slate-900/95 border-2 ${theme.borderColor || 'border-amber-400'} mb-2.5 backdrop-blur-sm text-xs shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500 overflow-hidden`;

        // 4. Animación de cambio: ocultar base y deslizar hacia adentro la notificación
        if (dom.headerBaseContent) {
          dom.headerBaseContent.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
          dom.headerBaseContent.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
        }
        if (dom.headerNotifContent) {
          dom.headerNotifContent.classList.remove('opacity-0', '-translate-y-full', 'pointer-events-none');
          dom.headerNotifContent.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
        }

        // 5. Retorno automático a su estado base tras 3.4 segundos
        if (rebanchaNotifTimer) clearTimeout(rebanchaNotifTimer);
        rebanchaNotifTimer = setTimeout(() => {
          if (dom.headerNotifContent) {
            dom.headerNotifContent.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
            dom.headerNotifContent.classList.add('opacity-0', '-translate-y-full', 'pointer-events-none');
          }
          if (dom.headerBaseContent) {
            dom.headerBaseContent.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
            dom.headerBaseContent.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
          }
        }, 3400);

        actualizarLeyendaTablero(count);
      }

      function ejecutarRevanchaTablero() {
        if (!state.isHost) return;

        if (state.isPlantingMode) {
          state.isPlantingMode = false;
          state.plantableTileIndex = null;
          ocultarNotificacionSiembra();
        }

        state.revanchaCount = (state.revanchaCount || 0) + 1;
        const count = state.revanchaCount;

        // 1. Cambiar canción a la siguiente pista sincronizada para la Rebancha
        if (audio && audio.nextTrack) {
          audio.nextTrack();
          updateAudioUI();
        }

        // 2. Generar nuevo tablero con los puntos aleatorios y el tema activo
        generarTableroBatalla();

        // 3. Aplicar nuevo color al tablero
        aplicarTemaTablero(count);

        // 4. Renderizar el tablero visualmente con la animación de transición en ola
        renderTableroVisual(true);

        // 5. Mostrar la notificación temporal de REBANCHA que aparece y desaparece sola
        mostrarBannerRebancha(count);

        if (audio && audio.playCoinWin) {
          audio.playCoinWin();
        }

        const theme = getThemeForRevancha(count);
        logEvent(`🔥 <strong>¡REBANCHA #${count}!</strong> El tablero se agotó sin ganador. ¡Nueva matriz temática (${theme.name} ${theme.themeIcon || '✨'}) y nueva música! Puntos acumulados conservados.`);

        // 6. Transmitir a todos los dispositivos en la partida (incluyendo musicSync)
        broadcast({
          type: 'BOARD_REVANCHA',
          revanchaCount: count,
          boardSize: state.board.length,
          players: state.players,
          turnIndex: state.currentTurnIndex,
          musicSync: audio ? { trackIndex: audio.currentTrackIndex, currentTime: 0 } : null
        });

        // 7. Si el turno le corresponde a un bot, activarlo tras la animación
        const nextPlayer = state.players[state.currentTurnIndex];
        if (nextPlayer && nextPlayer.isBot) {
          setTimeout(() => ejecutarTurnoBot(nextPlayer), 2400);
        }
      }

      function iniciarPantallaJuego() {
        activarWakeLock();
        dom.viewLobby.classList.add('hidden');
        dom.viewRoomWaiting.classList.add('hidden');
        dom.viewGame.classList.remove('hidden');

        if (dom.gameTargetScore) {
          dom.gameTargetScore.textContent = `${state.targetScore}`;
        }
        if (dom.spectatorBanner) {
          dom.spectatorBanner.classList.add('hidden');
        }

        aplicarTemaTablero(state.revanchaCount || 0);
        if (state.revanchaCount === 0) {
          if (dom.headerRebanchaMultBadge) dom.headerRebanchaMultBadge.classList.add('hidden');
          if (dom.gameHeaderBar) {
            dom.gameHeaderBar.className = 'w-full relative min-h-[48px] p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 border border-red-500/40 mb-2.5 backdrop-blur-sm text-xs transition-all duration-500 overflow-hidden shadow-lg';
          }
          if (dom.headerBaseContent) {
            dom.headerBaseContent.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
            dom.headerBaseContent.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
          }
          if (dom.headerNotifContent) {
            dom.headerNotifContent.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
            dom.headerNotifContent.classList.add('opacity-0', '-translate-y-full', 'pointer-events-none');
          }
        }
        actualizarLeyendaTablero(state.revanchaCount || 0);
        updateAudioUI();
        renderTableroVisual();
        actualizarScoreboard();
        actualizarTurnoUI();
      }

      function renderTableroVisual(isRebancha = false) {
        dom.battleGrid.innerHTML = '';
        const totalTiles = state.board.length || (state.players.length >= 6 ? 49 : 36);
        const is7x7 = totalTiles >= 49;
        const cols = is7x7 ? 7 : 6;
        if (is7x7) {
          dom.battleGrid.classList.add('grid-7x7');
        } else {
          dom.battleGrid.classList.remove('grid-7x7');
        }

        const activeTheme = getThemeForRevancha(state.revanchaCount || 0);
        const coverIcon = activeTheme.coverIcon || '🧊';

        for (let idx = 0; idx < totalTiles; idx++) {
          const el = document.createElement('div');
          el.className = 'battle-tile select-none';
          el.dataset.index = idx;

          if (isRebancha) {
            el.classList.add('rebancha-anim');
            const col = idx % cols;
            const row = Math.floor(idx / cols);
            const delay = (col * 35) + (row * 30);
            el.style.animationDelay = `${delay}ms`;

            const onAnimEnd = () => {
              el.classList.remove('rebancha-anim');
              el.style.animation = '';
              el.style.animationDelay = '';
              el.removeEventListener('animationend', onAnimEnd);
            };
            el.addEventListener('animationend', onAnimEnd);
            setTimeout(onAnimEnd, delay + 650);
          }

          el.innerHTML = `
            <!-- Cara Frontal -->
            <div class="battle-tile-face battle-tile-front">
              <span class="tile-front-icon text-xl sm:text-2xl">${coverIcon}</span>
              <span class="text-[9px] font-mono text-cyan-300/60 mt-0.5">${idx + 1}</span>
            </div>

            <!-- Cara Trasera (Revelado / Seguro / Mina) -->
            <div class="battle-tile-face battle-tile-back battle-tile-safe">
              <span class="tile-back-icon text-2xl sm:text-3xl">${coverIcon}</span>
              <span class="text-[9px] font-black text-white mt-0.5 uppercase tracking-wider"></span>
            </div>
          `;

          el.addEventListener('click', () => onTileUserClick(idx));
          el.addEventListener('dblclick', (e) => {
            e.preventDefault();
            onTileUserDoubleClick(idx);
          });
          dom.battleGrid.appendChild(el);
          actualizarTileVisual(idx);
        }
      }

      function onTileUserDoubleClick(tileIndex) {
        if (state.isGameOver || state.isSpectator) return;
        if (state.isPlantingMode && state.plantableTileIndex === tileIndex) {
          confirmarSiembraMina(tileIndex);
        }
      }

      function onTileUserClick(tileIndex) {
        if (state.isGameOver || state.isSpectator) return;
        const currentActivePlayer = state.players[state.currentTurnIndex];
        if (!currentActivePlayer) return;

        // Si estamos en modo de siembra de mina: el segundo click o doble tap en el cubo confirma la siembra, o clic en otra casilla pasa el turno
        if (state.isPlantingMode) {
          if (state.plantableTileIndex === tileIndex) {
            confirmarSiembraMina(tileIndex);
          } else {
            finalizarTurnoSinSiembra(state.plantableTileIndex);
          }
          return;
        }

        // Si es el turno del usuario local
        if (currentActivePlayer.id !== state.myPlayerId) {
          return;
        }

        const tile = state.board[tileIndex];
        if (!tile) return;

        // Si la casilla ya está destruida por una mina mortal
        if (tile.isExplosion) {
          return;
        }

        // Si este mismo usuario ya exploró este cubo en su turno
        if (tile.revealedTo && tile.revealedTo.includes(state.myPlayerId)) {
          return;
        }

        if (state.isHost) {
          procesarClicCasilla(tileIndex, state.myPlayerId);
        } else {
          broadcast({ type: 'TILE_CLICK', tileIndex, playerId: state.myPlayerId });
        }
      }

      function procesarClicCasilla(tileIndex, playerId) {
        const tile = state.board[tileIndex];
        if (!tile || tile.isExplosion) return;

        const player = state.players.find(p => p.id === playerId);
        if (!player) return;

        // 1. ¿Había una mina plantada aquí por otro rival?
        if (tile.mineBy && tile.mineBy !== playerId) {
          const planter = state.players.find(p => p.id === tile.mineBy);

          // REGLA: Robo por valor de la casilla (2 veces / el doble del valor en limpio de la casilla)
          const baseTilePoints = tile.initialPoints || 10;
          const stolenPoints = baseTilePoints * MINE_STEAL_MULTIPLIER;

          player.score = Math.max(0, player.score - stolenPoints);
          if (planter) {
            planter.score += stolenPoints;
            const winner = verificarPuestoPodio(planter);
            if (winner) {
              tile.isExplosion = true;
              tile.publiclyRevealed = true;
              tile.victimAvatar = player.avatar;
              tile.victimName = player.name;
              tile.pointsLabel = `-${stolenPoints} pts`;
              actualizarTileVisual(tileIndex);
              actualizarScoreboard();
              finalizarPartida();
              return;
            }
          }

          // AQUÍ Y SOLO AQUÍ LA CASILLA SE DESACTIVA PARA TODOS LOS JUGADORES
          tile.isExplosion = true;
          tile.publiclyRevealed = true;
          tile.victimAvatar = player.avatar;
          tile.victimName = player.name;
          tile.pointsLabel = `-${stolenPoints} pts`;

          if (audio && audio.playExplosion) audio.playExplosion();
          else if (audio && audio.playFailSound) audio.playFailSound();

          logEvent(`💥 <strong>¡EMBOSCADA!</strong> ${player.avatar || '👤'} ${player.name} pisó la mina de <strong>${planter ? planter.name : 'un rival'}</strong>. ¡${planter ? planter.name : 'Rival'} le robó <strong>${stolenPoints} pts</strong> (${MINE_STEAL_MULTIPLIER}x el valor limpio)!`);

          // Shake animation en el tablero
          dom.battleGrid.classList.add('animate-shake');
          setTimeout(() => dom.battleGrid.classList.remove('animate-shake'), 500);

          actualizarTileVisual(tileIndex);
          actualizarScoreboard();

          broadcast({
            type: 'TILE_EXPLODED',
            tileIndex,
            victimId: player.id,
            victimAvatar: player.avatar,
            victimName: player.name,
            planterId: tile.mineBy,
            stolenPoints,
            players: state.players,
            podium: state.podium
          });

          pasarSiguienteTurno();
          return;
        }

        // 2. Destapado seguro (NO hay mina de rival)
        if (!tile.revealedTo) tile.revealedTo = [];
        if (!tile.revealedTo.includes(playerId)) {
          tile.revealedTo.push(playerId);
        }

        const puntosGanados = tile.points || 0;
        tile.pointsLabel = `+${puntosGanados} pts`;
        if (puntosGanados > 0) {
          player.score += puntosGanados;
          tile.points = 0; // Premio reclamado
        }

        // Otorga 1 mina disponible al jugador que acertó
        if (playerId === state.myPlayerId) {
          state.myMinesCount = Math.max(1, state.myMinesCount);
        }

        // Verificar si el jugador alcanzó la meta de puntos
        const winner = verificarPuestoPodio(player);
        if (winner) {
          actualizarTileVisual(tileIndex);
          actualizarScoreboard();
          finalizarPartida();
          return;
        }

        actualizarScoreboard();

        // Si es el jugador local (Host)
        if (playerId === state.myPlayerId) {
          actualizarTileVisual(tileIndex);

          if (audio && audio.playCoinWin) audio.playCoinWin();
          else if (audio && audio.playSuccessBeep) audio.playSuccessBeep();

          logEvent(`${tile.icon || '✨'} ¡Descubriste <strong>${tile.name}</strong> (+${puntosGanados} pts)! El cubo está <strong>Limpio</strong>.`);

          // Notificación flotante de siembra con doble click
          mostrarNotificacionSiembra(tileIndex);

          broadcast({
            type: 'PLAYER_EXPLORED_CLEAN',
            playerId: state.myPlayerId,
            players: state.players
          });
        } else if (player.isBot) {
          // El bot juega: siembra o pasa
          if (Math.random() < 0.70) {
            tile.mineBy = player.id;
          } else {
            simularSiembraBot(player.id);
          }
          logEvent(`❄️ ${player.avatar || '🤖'} ${player.name} exploró una casilla de hielo.`);
          broadcast({
            type: 'PLAYER_EXPLORED_CLEAN',
            playerId: player.id,
            players: state.players
          });
          pasarSiguienteTurno();
        } else {
          // Es un guest humano en otra pantalla
          logEvent(`❄️ ${player.avatar || '👤'} ${player.name} exploró una casilla de hielo.`);
          if (state.isHost) {
            broadcast({
              type: 'CLEAN_TILE_RESULT',
              tileIndex,
              playerId,
              tileInfo: {
                type: tile.type,
                icon: tile.icon,
                name: tile.name,
                points: puntosGanados,
                pointsLabel: `+${puntosGanados} pts`
              },
              players: state.players
            });
            broadcast({
              type: 'PLAYER_EXPLORED_CLEAN',
              playerId,
              players: state.players
            });
          }
        }
      }

      function mostrarNotificacionSiembra(tileIndex) {
        if (state.plantingTimer) {
          clearTimeout(state.plantingTimer);
          state.plantingTimer = null;
        }

        state.isPlantingMode = true;
        state.plantableTileIndex = tileIndex;

        // Resaltar la casilla limpia actual
        const tileEl = dom.battleGrid.querySelector(`.battle-tile[data-index="${tileIndex}"]`);
        if (tileEl) {
          tileEl.classList.add('planting-target');
        }

        // Mostrar notificación flotante
        if (dom.actionBannerPrompt) {
          dom.actionBannerPrompt.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
          dom.actionBannerPrompt.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');

          // Reiniciar barra de tiempo visual (3.8 segundos)
          const fill = document.getElementById('planting-progress-fill');
          if (fill) {
            fill.style.transition = 'none';
            fill.style.width = '100%';
            void fill.offsetWidth; // Forzar reflow
            fill.style.transition = 'width 3.8s linear';
            fill.style.width = '0%';
          }
        }

        // Temporizador para auto-desaparecer y pasar el turno sin sembrar
        state.plantingTimer = setTimeout(() => {
          finalizarTurnoSinSiembra(tileIndex);
        }, 3800);
      }

      function ocultarNotificacionSiembra() {
        if (state.plantingTimer) {
          clearTimeout(state.plantingTimer);
          state.plantingTimer = null;
        }
        if (dom.actionBannerPrompt) {
          dom.actionBannerPrompt.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
          dom.actionBannerPrompt.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
        }
        dom.battleGrid.querySelectorAll('.planting-target').forEach(el => el.classList.remove('planting-target'));
      }

      function finalizarTurnoSinSiembra(tileIndex) {
        state.isPlantingMode = false;
        state.plantableTileIndex = null;
        ocultarNotificacionSiembra();

        if (state.isHost) {
          pasarSiguienteTurno();
        } else {
          broadcast({ type: 'PASS_TURN', playerId: state.myPlayerId });
        }
      }

      function confirmarSiembraMina(tileIndex) {
        if (!state.isPlantingMode || state.plantableTileIndex !== tileIndex) return;
        ocultarNotificacionSiembra();
        plantarMina(tileIndex, state.myPlayerId);
      }

      function plantarMina(tileIndex, planterId) {
        state.isPlantingMode = false;
        state.plantableTileIndex = null;
        ocultarNotificacionSiembra();

        state.myMinesCount = Math.max(0, state.myMinesCount - 1);

        registrarMinaPlantada(tileIndex, planterId);

        logEvent(`💣 Sembraste una mina trampa secreta en el cubo <strong>#${tileIndex + 1}</strong>.`);

        if (state.isHost) {
          pasarSiguienteTurno();
        } else {
          broadcast({ type: 'PLANT_MINE', tileIndex, planterId });
        }
      }

      function registrarMinaPlantada(tileIndex, planterId) {
        const tile = state.board[tileIndex];
        if (tile) {
          tile.mineBy = planterId;
          actualizarTileVisual(tileIndex);
        }
      }

      function simularSiembraBot(botId) {
        const elegibles = state.board.filter(t => !t.isExplosion && !t.mineBy);
        if (elegibles.length > 0) {
          const randTile = elegibles[Math.floor(Math.random() * elegibles.length)];
          randTile.mineBy = botId;
        }
      }

      function actualizarTileVisual(tileIndex) {
        const tileData = state.board[tileIndex];
        const tileEl = dom.battleGrid.querySelector(`.battle-tile[data-index="${tileIndex}"]`);
        if (!tileEl || !tileData) return;

        const isExploded = tileData.isExplosion || tileData.publiclyRevealed;
        const isRevealedToMe = tileData.revealedTo && tileData.revealedTo.includes(state.myPlayerId);
        const isMinePlantedByMe = tileData.mineBy === state.myPlayerId;

        const back = tileEl.querySelector('.battle-tile-back');
        const iconEl = tileEl.querySelector('.tile-back-icon');
        const labelEl = back ? back.querySelector('span:last-child') : null;
        const front = tileEl.querySelector('.battle-tile-front');
        const frontIcon = front ? front.querySelector('.tile-front-icon') : null;

        const currentTheme = getThemeForRevancha(state.revanchaCount || 0);
        const coverIcon = (tileData && tileData.coverIcon) || currentTheme.coverIcon || '🧊';

        if (isExploded) {
          tileEl.classList.remove('rebancha-anim');
          tileEl.style.animation = '';
          tileEl.style.animationDelay = '';
          tileEl.classList.add('revealed', 'pointer-events-none', 'cursor-not-allowed');
          if (back) back.className = 'battle-tile-face battle-tile-back battle-tile-mine border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.9)] bg-rose-950/90';
          if (iconEl) iconEl.innerHTML = `<div class="flex items-center justify-center gap-0.5 text-xs sm:text-sm leading-none"><span class="text-sm sm:text-base">${tileData.victimAvatar || '👤'}</span><span>💀</span><span class="text-sm sm:text-base">💥</span></div>`;
          if (labelEl) labelEl.innerHTML = `<span class="text-[9px] sm:text-[10px] text-rose-200 font-extrabold tracking-tight">${tileData.victimName ? tileData.victimName : 'RIVAL'} 💀</span>`;
        } else if (isRevealedToMe) {
          // Destapado exclusivamente para mí (cubo limpio verificado)
          tileEl.classList.remove('rebancha-anim');
          tileEl.style.animation = '';
          tileEl.style.animationDelay = '';
          tileEl.classList.add('revealed');
          tileEl.classList.remove('pointer-events-none', 'cursor-not-allowed');
          if (isMinePlantedByMe) {
            if (back) back.className = 'battle-tile-face battle-tile-back battle-tile-safe border-2 border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.85)]';
            if (iconEl) iconEl.textContent = '💣';
            if (labelEl) labelEl.textContent = 'MINA SECRETA';
          } else {
            if (back) back.className = 'battle-tile-face battle-tile-back battle-tile-safe';
            if (iconEl) iconEl.textContent = tileData.icon || coverIcon;
            if (labelEl) labelEl.textContent = tileData.pointsLabel || (tileData.initialPoints ? `+${tileData.initialPoints} pts` : 'LIMPIO ✨');
          }
        } else {
          // No revelado para mí: sigue viéndose cubierto con el ícono del tema activo
          tileEl.classList.remove('revealed', 'pointer-events-none', 'cursor-not-allowed');
          if (isMinePlantedByMe) {
            if (front) front.classList.add('mine-planted-by-me');
            if (frontIcon) frontIcon.textContent = '💣';
          } else {
            if (front) front.classList.remove('mine-planted-by-me');
            if (frontIcon) frontIcon.textContent = coverIcon;
          }
        }
      }

      function actualizarTileUI(tileIndex) {
        actualizarTileVisual(tileIndex);
      }

      function jugadorTieneMovimientos(p) {
        return state.board.some(t => !t.isExplosion && (!t.revealedTo || !t.revealedTo.includes(p.id)));
      }

      function pasarSiguienteTurno() {
        if (!state.isHost) return;

        // 1. Verificar si la partida ya debe finalizar:
        // - Alguien alcanzó la meta de puntos o ya hay podio registrado
        // - O ningún jugador tiene movimientos válidos por descubrir
        // - O no quedan casillas de hielo sin explotar
        const alguienGano = state.podium.length >= 1 || state.players.some(p => p.score >= state.targetScore);
        const algunJugadorTieneMovimientos = state.players.some(p => jugadorTieneMovimientos(p));
        const quedanHielosActivos = state.board.some(t => !t.isExplosion);

        // Si alguien alcanzó la meta de puntos, la partida finaliza con podio
        if (alguienGano) {
          finalizarPartida();
          return;
        }

        // Si el tablero se agotó sin que nadie alcance la meta:
        // ¡REBANCHA! Se renueva la matriz de puntos, se mantienen todos los puntajes y cambia el color del tablero.
        if (!algunJugadorTieneMovimientos || !quedanHielosActivos) {
          ejecutarRevanchaTablero();
          return;
        }

        // 2. Avanzar el turno solo a jugadores que NO estén en el podio y que tengan movimientos disponibles
        let foundNext = false;
        let attempts = 0;
        let nextIndex = state.currentTurnIndex;

        while (attempts < state.players.length) {
          nextIndex = (nextIndex + 1) % state.players.length;
          attempts++;
          const candidate = state.players[nextIndex];
          if (candidate && !state.podium.some(p => p.id === candidate.id) && jugadorTieneMovimientos(candidate)) {
            state.currentTurnIndex = nextIndex;
            foundNext = true;
            break;
          }
        }

        if (!foundNext) {
          if (alguienGano) {
            finalizarPartida();
          } else {
            ejecutarRevanchaTablero();
          }
          return;
        }

        actualizarTurnoUI();
        actualizarScoreboard();

        broadcast({
          type: 'GAME_SYNC',
          players: state.players,
          turnIndex: state.currentTurnIndex,
          podium: state.podium,
          musicSync: audio && audio.currentTrackIndex >= 0 ? {
            trackIndex: audio.currentTrackIndex,
            currentTime: audio.audioEl ? audio.audioEl.currentTime : 0
          } : null
        });

        // Si el siguiente turno es de un Bot activo
        const nextPlayer = state.players[state.currentTurnIndex];
        if (nextPlayer && nextPlayer.isBot) {
          setTimeout(() => ejecutarTurnoBot(nextPlayer), 1200);
        }
      }

      function ejecutarTurnoBot(bot) {
        if (state.isGameOver || state.podium.some(p => p.id === bot.id)) return;
        const elegibles = state.board.filter(t => !t.isExplosion && (!t.revealedTo || !t.revealedTo.includes(bot.id)));
        if (elegibles.length === 0) {
          pasarSiguienteTurno();
          return;
        }

        const chosenTile = elegibles[Math.floor(Math.random() * elegibles.length)];
        procesarClicCasilla(chosenTile.index, bot.id);
      }

      function actualizarTurnoUI() {
        if (state.isSpectator) {
          dom.currentTurnBadge.textContent = '👀 Modo Espectador';
          dom.currentTurnBadge.className = 'px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-500 font-bold text-xs truncate max-w-[150px]';
          return;
        }

        const currentActive = state.players[state.currentTurnIndex];
        if (!currentActive) return;

        const isMe = currentActive.id === state.myPlayerId;
        dom.currentTurnBadge.textContent = isMe ? '👉 ¡TU TURNO!' : `Turno: ${currentActive.name}`;
        dom.currentTurnBadge.className = isMe 
          ? 'px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-400 font-black text-xs animate-pulse truncate max-w-[150px]'
          : 'px-2.5 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-700 font-bold text-xs truncate max-w-[150px]';
      }

      function actualizarScoreboard() {
        // Ordenar: primero los del podio en orden de llegada (rank), luego el resto por puntos desc
        const enPodio = [...state.podium].map(podEntry => {
          const livePlayer = state.players.find(p => p.id === podEntry.id) || podEntry;
          return { ...livePlayer, podiumRank: podEntry.rank };
        });
        const noEnPodio = state.players
          .filter(p => !state.podium.some(pod => pod.id === p.id))
          .sort((a, b) => b.score - a.score)
          .map((p, idx) => ({ ...p, podiumRank: null, standing: enPodio.length + idx + 1 }));

        const sorted = [...enPodio, ...noEnPodio];
        dom.liveScoreboard.innerHTML = '';

        sorted.forEach((p, idx) => {
          const isMe = p.id === state.myPlayerId;
          let medal = '';
          if (p.podiumRank === 1) medal = '🥇 1º';
          else if (p.podiumRank === 2) medal = '🥈 2º';
          else if (p.podiumRank === 3) medal = '🥉 3º';
          else if (idx === sorted.length - 1) medal = '💀';
          else medal = `${p.standing || idx + 1}.`;

          const row = document.createElement('div');
          row.className = `flex items-center justify-between p-2 rounded-xl text-xs transition ${
            isMe ? 'bg-gradient-to-r from-red-950/90 to-rose-950/70 border border-red-500/60 shadow-sm' : 'bg-slate-950/60 border border-slate-800'
          }`;

          row.innerHTML = `
            <div class="flex items-center space-x-2 truncate min-w-0">
              <span class="font-black text-xs ${p.podiumRank ? 'text-amber-400' : (idx === sorted.length - 1 ? 'text-rose-400' : 'text-slate-400')}">${medal}</span>
              <span class="text-sm">${p.avatar}</span>
              <span class="font-bold text-white truncate max-w-[120px] sm:max-w-[140px]">${p.name}</span>
            </div>
            <div class="font-mono font-black text-cyan-300 flex-shrink-0 text-right">
              ${p.score} <span class="text-[9px] text-slate-400 font-normal">/ ${state.targetScore}</span>
            </div>
          `;
          dom.liveScoreboard.appendChild(row);
        });
      }

      function logEvent(htmlMsg) {
        const item = document.createElement('div');
        item.className = 'text-[11px] text-slate-300 border-b border-slate-800/60 pb-1 leading-snug';
        item.innerHTML = htmlMsg;
        dom.battleLog.prepend(item);
      }

      function finalizarPartida() {
        state.isGameOver = true;
        ocultarNotificacionSiembra();
        desactivarWakeLock();

        // Completar los puestos del podio con los jugadores restantes ordenados por puntaje desc
        const jugadoresRestantes = state.players
          .filter(p => !state.podium.some(pod => pod.id === p.id))
          .sort((a, b) => b.score - a.score);

        jugadoresRestantes.forEach(p => {
          state.podium.push({
            id: p.id,
            name: p.name,
            avatar: p.avatar,
            score: p.score,
            rank: state.podium.length + 1
          });
        });

        // El perdedor es el que quedó en el último puesto absoluto
        const loser = state.podium[state.podium.length - 1] || state.players[state.players.length - 1];

        // Transmitir inmediatamente a todos los clientes (Host & Guests)
        if (state.isHost) {
          broadcast({
            type: 'GAME_OVER',
            podium: state.podium,
            players: state.players,
            loser: loser
          });
        }

        mostrarModalFinJuego(state.podium, loser);
      }

      function mostrarModalFinJuego(podium, loser) {
        if (window.confetti) {
          window.confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        }
        if (audio && audio.playJackpot) audio.playJackpot();

        // 1er Lugar
        const first = podium[0];
        if (first && dom.podium1stName && dom.podium1stScore) {
          dom.podium1stName.textContent = `${first.avatar} ${first.name}`;
          dom.podium1stScore.textContent = `${first.score} pts`;
        }

        // 2do Lugar
        const second = podium[1];
        if (second && dom.podium2nd && dom.podium2ndName && dom.podium2ndScore) {
          dom.podium2nd.classList.remove('hidden');
          dom.podium2ndName.textContent = `${second.avatar} ${second.name}`;
          dom.podium2ndScore.textContent = `${second.score} pts`;
        } else if (dom.podium2nd) {
          dom.podium2nd.classList.add('hidden');
        }

        // 3er Lugar
        const third = podium[2];
        if (third && dom.podium3rd && dom.podium3rdName && dom.podium3rdScore) {
          dom.podium3rd.classList.remove('hidden');
          dom.podium3rdName.textContent = `${third.avatar} ${third.name}`;
          dom.podium3rdScore.textContent = `${third.score} pts`;
        } else if (dom.podium3rd) {
          dom.podium3rd.classList.add('hidden');
        }

        // El Perdedor Paga la Ronda
        if (loser && dom.loserNameDisplay) {
          dom.loserNameDisplay.textContent = `${loser.avatar} ${loser.name} (${loser.score} pts)`;
        }

        // URL de WhatsApp para cobrar la ronda
        const winner = first || { name: 'Campeón', score: 0 };
        const loserName = loser ? loser.name : 'Alguien';
        const waMsg = encodeURIComponent(
          `🍻 ¡Ronda finalizada en BattleRound Paradice!\n\n` +
          `🥇 1er Lugar: ${winner.name} (${winner.score} pts)\n` +
          (second ? `🥈 2do Lugar: ${second.name} (${second.score} pts)\n` : '') +
          (third ? `🥉 3er Lugar: ${third.name} (${third.score} pts)\n` : '') +
          `💀 Perdedor: ${loserName} (${loser ? loser.score : 0} pts)\n\n` +
          `🍸 ¡A ${loserName} le toca pagar la ronda de granizados en Paradice! Nos vemos allá.`
        );
        if (dom.btnShareWhatsapp) {
          dom.btnShareWhatsapp.href = `https://wa.me/?text=${waMsg}`;
        }

        dom.modalGameOver.classList.remove('hidden');
      }

      // Arrancar juego al cargar
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
      } else {
        init();
      }

    })();
