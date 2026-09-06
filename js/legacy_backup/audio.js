/**
 * Gestor de Audio de Paradice
 * Reproducción de música aleatoria desde la carpeta /music,
 * cambio automático a canción de victoria en premios y efectos de sonido arcade.
 */

export const PLAYLIST_MUSIC = [
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
  "090 sue\u00f1o latino - viciosa.mp3",
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

// Canciones especiales de celebración al obtener premio
export const WIN_TRACKS = [
  "092 dr alban - sing hallelujah.mp3",
  "069 Technotronic - Everybody dance now.mp3",
  "056 D.J. Bobo - There is a party (Megamix).mp3",
  "042  2 Unlimited - No Limit.mp3",
  "063 unlimited - get ready for this.mp3",
  "001  Dr. Alban - It's My Life (Raggadag Remix).mp3",
  "003 Haddaway - What Is Love.mp3",
  "VEN BAILALO.mp3"
];

class SoundManager {
  constructor() {
    this.ctx = null;
    this.sfxMuted = false;
    this.musicMuted = false;
    this.audioEl = new Audio();
    this.audioEl.volume = 0.5;
    this.currentTrackName = '';
    this.isWinPlaying = false;

    // Cuando termina la canción, reproducir otra aleatoria automáticamente
    this.audioEl.addEventListener('ended', () => {
      this.isWinPlaying = false;
      if (!this.musicMuted) {
        this.playRandomTrack();
      }
    });

    this.spinInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleSfx() {
    this.sfxMuted = !this.sfxMuted;
    return this.sfxMuted;
  }

  toggleMusic() {
    this.musicMuted = !this.musicMuted;
    if (this.musicMuted) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
    return this.musicMuted;
  }

  isSfxMuted() { return this.sfxMuted; }
  isMusicMuted() { return this.musicMuted; }

  // Reproducir canción aleatoria de la carpeta /music
  playRandomTrack() {
    if (this.musicMuted) return;
    const randomIndex = Math.floor(Math.random() * PLAYLIST_MUSIC.length);
    const track = PLAYLIST_MUSIC[randomIndex];
    this.currentTrackName = track;
    this.audioEl.src = 'music/' + encodeURIComponent(track);
    this.audioEl.volume = 0.5;
    this.audioEl.play().catch(e => {
      console.log('Interacción previa requerida para reproducir audio:', e);
    });
  }

  // Cambiar a canción de premio ganador
  playWinSong() {
    if (this.musicMuted) return;
    this.isWinPlaying = true;
    const randomIndex = Math.floor(Math.random() * WIN_TRACKS.length);
    const track = WIN_TRACKS[randomIndex];
    this.currentTrackName = track;
    this.audioEl.src = 'music/' + encodeURIComponent(track);
    this.audioEl.volume = 0.7;
    this.audioEl.play().catch(e => {
      console.log('Error al reproducir canción de premio:', e);
    });
  }

  startMusic() {
    if (this.musicMuted) return;
    if (!this.audioEl.src || this.audioEl.paused) {
      this.playRandomTrack();
    } else {
      this.audioEl.play().catch(e => {});
    }
  }

  stopMusic() {
    this.audioEl.pause();
  }

  /* ==========================================================
     EFECTOS DE SONIDO ARCADE (SFX VÍA WEB AUDIO API)
     ========================================================== */
  startSpin() {
    if (this.sfxMuted) return;
    this.init();
    this.stopSpin();
    let tickCount = 0;
    this.spinInterval = setInterval(() => {
      this.playSpinTick(tickCount);
      tickCount++;
    }, 90);
  }

  stopSpin() {
    if (this.spinInterval) {
      clearInterval(this.spinInterval);
      this.spinInterval = null;
    }
  }

  playSpinTick(index = 0) {
    if (this.sfxMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const frec = 420 + ((index % 6) * 35);
    osc.frequency.setValueAtTime(frec, now);
    osc.frequency.exponentialRampToValueAtTime(frec * 0.5, now + 0.04);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  playReelStop(reelIndex) {
    if (this.sfxMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 160 + (reelIndex * 28);
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.08);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  playClimbTick(stepIndex, maxSteps = 9) {
    if (this.sfxMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const baseFreq = 300;
    const stepFreq = baseFreq + (stepIndex * 55);
    osc.frequency.setValueAtTime(stepFreq, now);
    osc.frequency.exponentialRampToValueAtTime(stepFreq * 1.08, now + 0.08);

    gain.gain.setValueAtTime(0.22, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.095);
  }

  playWinDiscount() {
    if (this.sfxMuted || !this.ctx) return;
    const notas = [523.25, 659.25, 783.99, 1046.50];
    const now = this.ctx.currentTime;
    notas.forEach((frec, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(frec, now + idx * 0.09);
      gain.gain.setValueAtTime(0.25, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.19);
    });
  }

  playWinBonus() {
    if (this.sfxMuted || !this.ctx) return;
    const acordes = [
      [440.00, 554.37, 659.25],
      [587.33, 739.99, 880.00],
      [659.25, 830.61, 987.77]
    ];
    const now = this.ctx.currentTime;
    acordes.forEach((chord, cIdx) => {
      chord.forEach(frec => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(frec, now + cIdx * 0.14);
        gain.gain.setValueAtTime(0.18, now + cIdx * 0.14);
        gain.gain.exponentialRampToValueAtTime(0.001, now + cIdx * 0.14 + 0.28);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + cIdx * 0.14);
        osc.stop(now + cIdx * 0.14 + 0.29);
      });
    });
  }

  playJackpot() {
    if (this.sfxMuted || !this.ctx) return;
    const arpegio = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
    const now = this.ctx.currentTime;
    arpegio.forEach((frec, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(frec, now + idx * 0.07);
      gain.gain.setValueAtTime(0.2, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.36);
    });
  }

  playBlanqueo() {
    if (this.sfxMuted || !this.ctx) return;
    const notas = [350, 310, 270, 210];
    const now = this.ctx.currentTime;
    notas.forEach((frec, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(frec, now + idx * 0.12);
      gain.gain.setValueAtTime(0.14, now + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + idx * 0.12);
      osc.stop(now + idx * 0.12 + 0.15);
    });
  }
}

export const soundManager = new SoundManager();
