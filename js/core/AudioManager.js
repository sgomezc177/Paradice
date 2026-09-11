/**
 * AudioManager - Paradice Juegos
 * Reproductor universal de música (116 pistas eurodance/latinas en /music),
 * temas de victoria automáticos y generador de efectos de sonido (SFX) arcade.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    const inst = factory(root);
    root.AudioManager = inst;
    root.audioManager = inst;
    root.ParadiceAudio = inst;
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  // Catálogo completo de las 116 canciones de la carpeta /music
  const PLAYLIST_MUSIC = [
    "001  Dr. Alban - It's My Life (Raggadag Remix).mp3",
    "002 la bouche - BE MY LOVER.mp3",
    "003 Haddaway - What Is Love.mp3",
    "004 D.J. Bobo - Everybody.mp3",
    "005 ace of base - All That She Wants.mp3",
    "006 Technotronic - Megamix.mp3",
    "007 jhon scatman - scatman.mp3",
    "008 max a million - fat boys.mp3",
    "009 Mr President - Cocojambo.mp3",
    "010 newton - streamline.mp3",
    "011 Real McCoy - Another Night.mp3",
    "012 tecnotronic - pum up the jam.mp3",
    "013 2unlimited - twilinght zone.mp3",
    "014 dr alban - away from home.mp3",
    "015 whigfield - BIG TIME.mp3",
    "016 outhere brothers - boom boom.mp3",
    "017 tonight is the night - la bouche.mp3",
    "018 whigfield - saturday night.mp3",
    "019 twenty 4 seven - slave two the music.mp3",
    "020 Reel-z real. - Like to move it.mp3",
    "021 20 Fingers Featuring Gillette - Short Dick Man.mp3",
    "022  NO MERCY - WHERE DO YOU GO.mp3",
    "023 Cappella - U Got 2 Let The Music.mp3",
    "024 corona - the rythm of the night.mp3",
    "025 dr alban - look whos talking.mp3",
    "026 francy vicent - frutti de la pasion.mp3",
    "027 ice mc - ITs a rainy day.mp3",
    "028 La Bouche - Sweet dreams.mp3",
    "029 n trance - stalying alive.mp3",
    "030 real macoy - one more time.mp3",
    "031 technotronic - move this.mp3",
    "032 brothers - cant help my self.mp3",
    "033 2 times -  ann lee.mp3",
    "034 ace of base - Beautiful Life.mp3",
    "035 CABALLERO - HYMN.mp3",
    "036 Corona - Baby Baby.mp3",
    "037 Da Hool - Met her at the love parade.mp3",
    "038 faithless - insomnia.mp3",
    "039 JOHN SCATMAN - cotton eye joe.mp3",
    "040 LAS FIERITAS - TIRA PA ARRIBA.mp3",
    "041 aqua - barbie girl.mp3",
    "042  2 Unlimited - No Limit.mp3",
    "043 AB Logic - The Hitman.mp3",
    "044 cherry cocoke - no hagas el indio haz el cheroquee.mp3",
    "045 Dj Bobo - Somebody Dance With Me.mp3",
    "046 dr alban - hello afrika.mp3",
    "047 man - down under.mp3",
    "048 NO MERCY - MISSING.mp3",
    "049 TALEESA - I FOUND LOVE.mp3",
    "050 Whigfield - Baby boy.mp3",
    "051tecnotrronic - get up.mp3",
    "052 2 BROTHERS ON THE 4TH FLOOR - DREAMS (WILL COME ALIVE).mp3",
    "053 2 Unlimited - Mortal Kombat.mp3",
    "054 ace of base - Don't Turn Around.mp3",
    "055 Cappella - Move It Up.mp3",
    "056 D.J. Bobo - There is a party (Megamix).mp3",
    "057 Double You - Run to me.mp3",
    "058 haddaway - rock my heart.mp3",
    "059 MAQUINA TOTAL 7 - MAQUINA TOTAL 7 - RADIO EDIT.mp3",
    "060 PIROPO - RUSSIANS.mp3",
    "061 playahitty - the summer is magic.mp3",
    "062 cartouche - feel the groove.mp3",
    "063 unlimited - get ready for this.mp3",
    "064 Aqua - Around the world.mp3",
    "065 DJ Bobo - Freedom.mp3",
    "066 dr alban - born in africa.mp3",
    "067 fun factory - automatic lover.mp3",
    "068 LOVERS - 7 SECONDS.mp3",
    "069 Technotronic - Everybody dance now.mp3",
    "070 think were alone now -.mp3",
    "071 Modern talking - Brother lovie.mp3",
    "072  -  ice - ice - ice baby.mp3",
    "073 dr alban - let the beat go on.mp3",
    "074 NEVADA - TAKE ME TO HEAVEN.mp3",
    "075 Whigfield - Think of you.mp3",
    "076 ya ki da - i saw you dancing.mp3",
    "077 ace of base - Happy Nation.mp3",
    "078 Captain Hollywood - More And More.mp3",
    "079 dj lorenzo - ritmo de la noche.mp3",
    "080 G.E.M. - I FELL YOU TONIGHT.mp3",
    "081 Black Box - Fantasy.mp3",
    "082 Twenty 4 Seven - Keep on tryn.mp3",
    "083  Gillette - Mr. Personality.mp3",
    "084  alice deejay - hit mix.mp3",
    "085 MAQUINA TOTAL 7 - MEGAMIX.mp3",
    "086 D.J. Dero - Showtime.mp3",
    "087 ace of base - Waiting for Magic.mp3",
    "088 dr alban - Mr. D.J..mp3",
    "089 Haddaway - Fly away.mp3",
    "090 sueño latino - viciosa.mp3",
    "091 THE OUTHERE BROTHERS - DON'T STOP.mp3",
    "092 dr alban - sing hallelujah.mp3",
    "093 DJ BOBO - Pray.mp3",
    "094 wont let you down 2 boys -.mp3",
    "095 whigfield - sexy eyes.mp3",
    "096    Technotronic - This Beat Is Tecnotronic.mp3",
    "097   Twenty 4 Seven - Slave To The Music.mp3",
    "098 Black Box - Strike It Up.mp3",
    "099 dr alban - hallelujah day.mp3",
    "100 ace of base - The Sign.mp3",
    "Abayarde.mp3",
    "Agarrate el pantalon.mp3",
    "Amigo.mp3",
    "Bonsai.mp3",
    "Caile.mp3",
    "Cambumbo.mp3",
    "Dutty Love [Ft Natti Natasha].mp3",
    "Mujeres.mp3",
    "Por que me tratas asi.mp3",
    "Tra Tra.mp3",
    "VEN BAILALO.mp3",
    "Vengan al baile.mp3",
    "Villana.mp3",
    "Volvere.mp3",
    "YO SOY TU MAESTRO.mp3",
    "Yo Te Buscaba.mp3"
  ];

  // Canciones de celebración energética al obtener premios o retirar
  const WIN_TRACKS = [
    "092 dr alban - sing hallelujah.mp3",
    "069 Technotronic - Everybody dance now.mp3",
    "056 D.J. Bobo - There is a party (Megamix).mp3",
    "042  2 Unlimited - No Limit.mp3",
    "063 unlimited - get ready for this.mp3",
    "001  Dr. Alban - It's My Life (Raggadag Remix).mp3",
    "003 Haddaway - What Is Love.mp3",
    "VEN BAILALO.mp3"
  ];

  class AudioManagerClass {
    constructor() {
      this.audioEl = new Audio();
      this.audioEl.volume = 0.5;
      this.currentTrackIndex = -1;
      this.currentTrackName = '';
      this.currentTrack = null;
      this.currentGenre = 'todos';
      this.allTracks = [];
      this.genres = [];
      this.catalog = null;
      this.musicMuted = false;
      this.sfxMuted = false;
      this.isWinPlaying = false;
      this.hasUserInteracted = false;
      this.ctx = null;
      this.spinInterval = null;
      this.onTrackEnded = null;

      // Inicializar catálogo y preferencias
      this.initCatalog();
      this.loadPreferences();

      // Si el catálogo se carga después de este script, sincronizarlo
      if (typeof window !== 'undefined') {
        window.addEventListener('DOMContentLoaded', () => this.initCatalog());
      }

      // Transición automática al finalizar la pista
      this.audioEl.addEventListener('ended', () => {
        this.isWinPlaying = false;
        if (typeof this.onTrackEnded === 'function') {
          this.onTrackEnded();
          return;
        }
        if (!this.musicMuted) {
          this.playRandomTrack();
        }
      });

      // Desbloqueo de autoplay en la primera interacción
      this.setupInteractionUnlock();

      // Vinculación automática con controles en el DOM (selectores de género, botones prev, etc.)
      this.bindGlobalUI();
    }

    /**
     * Inicializa o sincroniza el catálogo desde window.PARADICE_MUSIC_CATALOG
     * o genera el fallback interno de 116 canciones
     */
    initCatalog() {
      const cat = (typeof window !== 'undefined' && (window.PARADICE_MUSIC_CATALOG || window.MusicCatalog)) || null;
      if (cat && Array.isArray(cat.tracks) && cat.tracks.length > 0) {
        this.catalog = cat;
        this.genres = cat.genres || [];
        this.allTracks = cat.tracks;
      } else if (!this.allTracks || this.allTracks.length === 0) {
        // Fallback predeterminado con las 116 canciones originales
        this.allTracks = PLAYLIST_MUSIC.map((fn, idx) => {
          const isEuro = idx < 100;
          const clean = this.cleanTitle(fn);
          let artist = 'Paradice Music';
          let title = clean;
          const parts = clean.split(' - ');
          if (parts.length > 1) {
            artist = parts[0].trim();
            title = parts.slice(1).join(' - ').trim();
          }
          return {
            id: `track-${String(idx + 1).padStart(3, '0')}`,
            filename: fn,
            path: 'music/' + fn,
            title: title,
            artist: artist,
            genre: isEuro ? 'eurodance' : 'reggaeton',
            album: isEuro ? 'Eurodance 90s Hits' : 'Urbano Clásico'
          };
        });

        this.genres = [
          { id: 'todos', name: 'Todos los Géneros', icon: '✨', count: this.allTracks.length },
          { id: 'eurodance', name: 'Eurodance 90s', icon: '🪩', count: 100 },
          { id: 'reggaeton', name: 'Reggaetón Clásico', icon: '🔥', count: 16 }
        ];
      }
    }

    /**
     * Vincula automáticamente los controles de audio en el DOM actual
     */
    bindGlobalUI() {
      if (typeof document === 'undefined') return;

      const initUI = () => {
        // 1. Selector de género
        document.querySelectorAll('#music-genre-select, .music-genre-select').forEach(sel => {
          if (sel._paradiceBound) return;
          sel._paradiceBound = true;

          const renderOptions = () => {
            const genres = this.getGenres();
            const cur = this.getCurrentGenre();
            if (genres && genres.length) {
              sel.innerHTML = '';
              genres.forEach(g => {
                const opt = document.createElement('option');
                opt.value = g.id;
                opt.textContent = `${g.icon || '🎵'} ${g.name} (${g.count || 0})`;
                if (g.id === cur) opt.selected = true;
                sel.appendChild(opt);
              });
            }
          };

          renderOptions();
          sel.addEventListener('change', (e) => {
            this.setGenre(e.target.value);
          });

          window.addEventListener('audiogenrechange', renderOptions);
        });

        // 2. Botón de pista anterior
        document.querySelectorAll('#btn-music-prev, .btn-music-prev').forEach(btn => {
          if (btn._paradiceBound) return;
          btn._paradiceBound = true;
          btn.addEventListener('click', () => {
            this.prevTrack();
          });
        });

        // 3. Sincronización continua con displays e iconos
        const syncElements = () => {
          const isMuted = this.isMusicMuted();
          document.querySelectorAll('#music-icon, .music-icon').forEach(el => {
            el.textContent = isMuted ? '🔇' : '🎵';
          });
          document.querySelectorAll('#music-track-display, .music-track-display').forEach(el => {
            const info = this.getCurrentTrackInfo();
            const genreObj = this.getCurrentGenreObject();
            const icon = genreObj?.icon || '🎵';
            const artist = info.artist && info.artist !== 'Paradice Music' ? `${info.artist} - ` : '';
            el.textContent = `${icon} ${artist}${info.title || this.getTrackTitle()}`;
            el.title = `${info.title} (${genreObj?.name || 'Paradice'})`;
          });
          document.querySelectorAll('#music-genre-select, .music-genre-select').forEach(sel => {
            if (sel.value !== this.currentGenre) sel.value = this.currentGenre;
          });
        };

        window.addEventListener('audiotrackchange', syncElements);
        syncElements();
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUI);
      } else {
        initUI();
      }
    }

    loadPreferences() {
      try {
        const savedGenre = localStorage.getItem('paradice_audio_genre');
        if (savedGenre) this.currentGenre = savedGenre;

        if (window.StorageService) {
          const cfg = window.StorageService.getAudioConfig();
          this.musicMuted = !!cfg.musicMuted;
          this.sfxMuted = !!cfg.sfxMuted;
          if (cfg.volume !== undefined) this.audioEl.volume = cfg.volume;
          if (cfg.genre) this.currentGenre = cfg.genre;
        }
      } catch (e) {
        // Fallback predeterminado
      }
    }

    savePreferences() {
      try {
        localStorage.setItem('paradice_audio_genre', this.currentGenre);
        if (window.StorageService) {
          window.StorageService.saveAudioConfig({
            musicMuted: this.musicMuted,
            sfxMuted: this.sfxMuted,
            volume: this.audioEl.volume,
            genre: this.currentGenre
          });
        }
      } catch (e) {}
    }

    setupInteractionUnlock() {
      const unlock = () => {
        if (this.hasUserInteracted) return;
        this.hasUserInteracted = true;
        this.initWebAudio();

        if (!this.musicMuted) {
          if (this.audioEl.src && this.currentTrack) {
            this.audioEl.play().catch(() => {});
          } else if (!this.audioEl.src || this.audioEl.paused) {
            this.playRandomTrack();
          }
        }

        ['click', 'touchstart', 'keydown'].forEach(evt => {
          document.removeEventListener(evt, unlock);
        });
      };

      ['click', 'touchstart', 'keydown'].forEach(evt => {
        document.addEventListener(evt, unlock, { once: false, passive: true });
      });
    }

    initWebAudio() {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    }

    /**
     * Limpia el nombre del archivo para mostrarlo amigablemente en la UI
     */
    cleanTitle(filename) {
      if (!filename) return 'Paradice Music';
      return filename
        .replace(/^\d{1,4}\s*[-_.]*\s*/, '') // Remueve números al inicio (001, 042, etc.)
        .replace(/\.mp3$/i, '')               // Remueve extensión .mp3
        .replace(/^[-_]\s*/, '')              // Remueve guiones huérfanos
        .trim();
    }

    getTrackTitle() {
      if (this.currentTrack && this.currentTrack.title) {
        return this.currentTrack.title;
      }
      return this.cleanTitle(this.currentTrackName);
    }

    getTrackArtist() {
      if (this.currentTrack && this.currentTrack.artist) {
        return this.currentTrack.artist;
      }
      return 'Paradice Music';
    }

    getCurrentTrackInfo() {
      if (this.currentTrack) {
        return this.currentTrack;
      }
      const pl = this.getPlaylist();
      return pl[0] || {
        id: 'track-default',
        filename: this.currentTrackName,
        path: 'music/' + this.currentTrackName,
        title: this.getTrackTitle(),
        artist: this.getTrackArtist(),
        genre: this.currentGenre,
        album: ''
      };
    }

    getGenres() {
      if (!this.genres || !this.genres.length) this.initCatalog();
      return this.genres;
    }

    getCurrentGenre() {
      return this.currentGenre;
    }

    getCurrentGenreObject() {
      const gList = this.getGenres();
      return gList.find(g => g.id === this.currentGenre) || gList[0] || { id: 'todos', name: 'Todos los Géneros', icon: '✨' };
    }

    setGenre(genreId) {
      const available = this.getGenres();
      const found = available.some(g => g.id === genreId);
      const target = found ? genreId : 'todos';

      if (this.currentGenre !== target) {
        this.currentGenre = target;
        this.savePreferences();

        // Notificar cambio de género
        const genreEvent = new CustomEvent('audiogenrechange', {
          detail: {
            genre: this.currentGenre,
            genreObj: this.getCurrentGenreObject()
          }
        });
        window.dispatchEvent(genreEvent);

        // Si la música está activa, reproducir una pista del nuevo género
        if (!this.musicMuted) {
          this.playRandomTrack();
        } else {
          this.notifyTrackChange();
        }
      }
      return this.currentGenre;
    }

    getPlaylist(genreId) {
      if (!this.allTracks || !this.allTracks.length) this.initCatalog();
      const targetGenre = genreId || this.currentGenre;
      if (!targetGenre || targetGenre === 'todos') {
        return this.allTracks;
      }
      const filtered = this.allTracks.filter(t => t.genre === targetGenre);
      return filtered.length > 0 ? filtered : this.allTracks;
    }

    init() {
      this.initWebAudio();
    }

    getCurrentTrackName() {
      return this.getTrackTitle();
    }

    playNextTrack() {
      return this.nextTrack();
    }

    notifyTrackChange() {
      const info = this.getCurrentTrackInfo();
      const genreObj = this.getCurrentGenreObject();

      const event = new CustomEvent('audiotrackchange', {
        detail: {
          track: this.currentTrackName,
          title: info.title || this.getTrackTitle(),
          artist: info.artist || this.getTrackArtist(),
          genre: this.currentGenre,
          genreName: genreObj ? genreObj.name : 'Todos los Géneros',
          genreIcon: genreObj ? genreObj.icon : '✨',
          album: info.album || '',
          path: info.path || ('music/' + this.currentTrackName),
          muted: this.musicMuted,
          isWin: this.isWinPlaying,
          volume: this.audioEl.volume
        }
      });
      window.dispatchEvent(event);
    }

    /**
     * Reproduce un objeto track { id, path, filename, title, artist, genre, album }
     */
    playTrack(trackObj, startTime = 0) {
      if (!trackObj) return;
      this.currentTrack = trackObj;
      this.currentTrackName = trackObj.filename;
      this.isWinPlaying = false;

      // Buscar índice en PLAYLIST_MUSIC o en allTracks
      this.currentTrackIndex = this.allTracks.findIndex(t => t.id === trackObj.id || t.filename === trackObj.filename);

      // Codificar ruta para URLs respetando carpetas
      const pathSegments = (trackObj.path || ('music/' + trackObj.filename)).split('/');
      const targetPath = pathSegments.map(seg => encodeURIComponent(seg)).join('/');

      const currentSrc = this.audioEl.src ? decodeURIComponent(this.audioEl.src) : '';
      const isSameFile = currentSrc.endsWith(trackObj.filename) || currentSrc.endsWith(trackObj.path);

      if (!isSameFile) {
        this.audioEl.src = targetPath;
      }
      this.audioEl.volume = 0.5;

      const applySeek = () => {
        if (startTime > 0 && Number.isFinite(startTime)) {
          try {
            if (this.audioEl.duration && startTime < this.audioEl.duration) {
              this.audioEl.currentTime = startTime;
            } else {
              this.audioEl.currentTime = startTime;
            }
          } catch (e) {}
        }
      };

      if (!this.musicMuted) {
        if (this.audioEl.readyState >= 1) {
          applySeek();
        } else {
          this.audioEl.addEventListener('loadedmetadata', applySeek, { once: true });
        }

        const playPromise = this.audioEl.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            applySeek();
          }).catch(e => {
            // Requiere interacción previa del usuario
          });
        }
      } else {
        applySeek();
      }

      this.notifyTrackChange();
    }

    playTrackByIndex(idx, startTime = 0) {
      const playlist = this.getPlaylist();
      if (idx < 0 || idx >= playlist.length) idx = 0;
      const track = playlist[idx] || this.allTracks[0];
      this.playTrack(track, startTime);
    }

    syncTrack(idx, currentTime = 0) {
      const playlist = this.getPlaylist();
      if (idx < 0 || idx >= playlist.length) return;
      const targetTrack = playlist[idx];
      const sameTrack = this.currentTrack && (this.currentTrack.id === targetTrack.id || this.currentTrack.filename === targetTrack.filename);
      const isPaused = !this.audioEl.src || this.audioEl.paused;

      if (!sameTrack || isPaused) {
        this.playTrack(targetTrack, currentTime);
      } else if (currentTime > 0 && Number.isFinite(currentTime)) {
        const drift = Math.abs(this.audioEl.currentTime - currentTime);
        if (drift > 2.0) {
          try {
            this.audioEl.currentTime = currentTime;
          } catch(e) {}
        }
      }
    }

    playRandomTrack() {
      const playlist = this.getPlaylist();
      if (!playlist || !playlist.length) return;

      let nextTrack;
      if (playlist.length === 1) {
        nextTrack = playlist[0];
      } else {
        do {
          const r = Math.floor(Math.random() * playlist.length);
          nextTrack = playlist[r];
        } while (this.currentTrack && nextTrack.id === this.currentTrack.id && playlist.length > 1);
      }

      this.playTrack(nextTrack);
    }

    nextTrack() {
      const playlist = this.getPlaylist();
      if (!playlist || !playlist.length) return;

      const currentId = this.currentTrack ? this.currentTrack.id : null;
      let currentIndex = playlist.findIndex(t => t.id === currentId || t.filename === this.currentTrackName);
      if (currentIndex === -1) currentIndex = 0;

      let nextIndex = (currentIndex + 1) % playlist.length;
      this.playTrack(playlist[nextIndex]);

      if (this.musicMuted) {
        this.toggleMusic();
      }
    }

    prevTrack() {
      const playlist = this.getPlaylist();
      if (!playlist || !playlist.length) return;

      const currentId = this.currentTrack ? this.currentTrack.id : null;
      let currentIndex = playlist.findIndex(t => t.id === currentId || t.filename === this.currentTrackName);
      if (currentIndex === -1) currentIndex = 0;

      let prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
      this.playTrack(playlist[prevIndex]);
    }

    playWinSong() {
      if (this.musicMuted) return;
      this.isWinPlaying = true;
      const randomWin = WIN_TRACKS[Math.floor(Math.random() * WIN_TRACKS.length)];
      this.currentTrackName = randomWin;

      this.audioEl.src = 'music/' + encodeURIComponent(randomWin);
      this.audioEl.volume = 0.7;
      this.audioEl.play().catch(() => {});
      this.notifyTrackChange();
    }

    toggleMusic() {
      this.musicMuted = !this.musicMuted;
      if (this.musicMuted) {
        this.audioEl.pause();
      } else {
        if (!this.audioEl.src || this.audioEl.src === window.location.href) {
          this.playRandomTrack();
        } else {
          this.audioEl.play().catch(() => {
            this.playRandomTrack();
          });
        }
      }
      this.savePreferences();
      this.notifyTrackChange();
      return this.musicMuted;
    }

    toggleSfx() {
      this.sfxMuted = !this.sfxMuted;
      this.savePreferences();
      return this.sfxMuted;
    }

    isMusicMuted() { return this.musicMuted; }
    isSfxMuted() { return this.sfxMuted; }

    setVolume(val) {
      const v = Math.max(0, Math.min(1, parseFloat(val)));
      if (!Number.isNaN(v)) {
        this.audioEl.volume = v;
        if (v > 0 && this.musicMuted) {
          this.musicMuted = false;
        }
        this.savePreferences();
        this.notifyTrackChange();
      }
      return this.audioEl.volume;
    }

    getVolume() {
      return this.audioEl.volume;
    }

    /* =========================================================================
     * SÍNTESIS DE EFECTOS DE SONIDO ARCADE (WEB AUDIO API)
     * ========================================================================= */
    playSpinTick(index = 0) {
      if (this.sfxMuted) return;
      this.initWebAudio();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = 420 + (index % 5) * 45;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + 0.04);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.055);
    }

    startSpinTicks(intervalMs = 90) {
      this.stopSpinTicks();
      let tick = 0;
      this.spinInterval = setInterval(() => {
        this.playSpinTick(tick++);
      }, intervalMs);
    }

    stopSpinTicks() {
      if (this.spinInterval) {
        clearInterval(this.spinInterval);
        this.spinInterval = null;
      }
    }

    playReelStop(reelIndex = 0) {
      if (this.sfxMuted) return;
      this.initWebAudio();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const baseFreq = 180 + reelIndex * 35;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.13);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    }

    playIceClink(step = 1) {
      if (this.sfxMuted) return;
      this.initWebAudio();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const baseFreq = 520 + Math.min(step * 75, 900);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.23);
    }

    playIceShatter() {
      if (this.sfxMuted) return;
      this.initWebAudio();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.45);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);

      // Ruido blanco
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.3, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.36);
    }

    playDiceShake() {
      if (this.sfxMuted) return;
      this.initWebAudio();
      if (!this.ctx) return;

      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          if (!this.ctx) return;
          const now = this.ctx.currentTime;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320 + Math.random() * 200, now);
          gain.gain.setValueAtTime(0.18, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 0.09);
        }, i * 90);
      }
    }

    playClimbTick(step = 0, totalSteps = 9) {
      if (this.sfxMuted) return;
      this.initWebAudio();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const baseFreq = 440;
      const freq = baseFreq * Math.pow(1.08, step);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.15, now + 0.07);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    }

    playHitSuccess(level = 1) {
      if (this.sfxMuted) return;
      this.initWebAudio();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const freq = 600 + (level * 110);
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, now + 0.18);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.29);
    }

    playHitMiss() {
      if (this.sfxMuted) return;
      this.initWebAudio();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(45, now + 0.4);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.42);
    }

    playRouletteTick() {
      if (this.sfxMuted) return;
      this.initWebAudio();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.035);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.045);
    }

    playTensionTick(secondsRemaining = 10) {
      if (this.sfxMuted) return;
      this.initWebAudio();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Pitch sube a medida que quedan menos segundos (de 10s a 1s)
      const freq = 220 + (11 - Math.max(1, secondsRemaining)) * 45;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.09);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    }

    playLifeGained() {
      if (this.sfxMuted) return;
      this.initWebAudio();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.28, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.26);
      });
    }

    playWinDiscount() {
      if (this.sfxMuted) return;
      this.initWebAudio();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.08;

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.25, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.23);
      });
    }

    playJackpot() {
      if (this.sfxMuted) return;
      this.playWinSong();
      this.initWebAudio();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.07;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.32);
      });
    }

    playFailSound() {
      if (this.sfxMuted) return;
      this.initWebAudio();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [311.13, 293.66, 277.18, 261.63];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + idx * 0.16;

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);
        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + 0.22);
      });
    }

    playExplosion() {
      if (this.sfxMuted) return;
      this.initWebAudio();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.5);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(40, now + 0.48);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.45, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start(now);
        noise.stop(now + 0.5);
      } catch (err) {
        // Fallback si falla AudioBuffer
        this.playFailSound();
      }
    }

    playTensionTick(secondsRemaining = 10) {
      if (this.sfxMuted) return;
      this.initWebAudio();
      if (!this.ctx) return;

      try {
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // Tono más agudo y urgente a medida que quedan menos segundos (10s -> 440Hz, 1s -> 880Hz)
        const freq = 440 + (10 - Math.max(1, secondsRemaining)) * 48;
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
      } catch (e) {
        // Ignorar si el contexto no está listo
      }
    }
  }

  // Instancia singleton compartida globalmente
  const instance = new AudioManagerClass();
  root.audioManager = instance;
  root.AudioManager = instance;
  root.ParadiceAudio = instance;
  return instance;
});
