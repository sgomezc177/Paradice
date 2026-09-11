/**
 * PARADICE - CONTROLADOR PRINCIPAL DE LA LANDING OFICIAL (INDEX)
 * Gestión de la Carta de Sabores Frozen, Modales de Autenticación y Reproductor de Audio
 */

// Catálogo de Sabores Exclusivos Paradice (Coctelería Frozen)
const SABORES_CON_LICOR = [
  // --- WHISKY BASE ---
  { nombre: "EXTASIS", ingredientes: "Whisky, uva y sandia.", licor: "WHISKY", color: "amber", icono: "🍇" },
  { nombre: "BOMBOMBUN", ingredientes: "Whisky, fresa y bombombun.", licor: "WHISKY", color: "amber", icono: "🍓" },
  { nombre: "TROPICO", ingredientes: "Whisky, vodka y frutos amarillos.", licor: "WHISKY", color: "amber", icono: "🍍" },
  { nombre: "CITRUS", ingredientes: "Whisky y naranja.", licor: "WHISKY", color: "amber", icono: "🍊" },
  { nombre: "NERDS", ingredientes: "Whisky, sandia y frambuesa.", licor: "WHISKY", color: "amber", icono: "🍬" },
  { nombre: "PINK DRINK", ingredientes: "Whisky, sandia y frutos rojos.", licor: "WHISKY", color: "amber", icono: "🍉" },
  { nombre: "CHERRY SLING", ingredientes: "Whisky, cereza y limón.", licor: "WHISKY", color: "amber", icono: "🍒" },

  // --- VODKA / SMIRNOFF BASE ---
  { nombre: "SANDIA", ingredientes: "Vodka, ginebra y sandia.", licor: "VODKA", color: "cyan", icono: "🍉" },
  { nombre: "SMIRNOFF MANZANA", ingredientes: "Smirnoff, vodka y manzana.", licor: "VODKA", color: "cyan", icono: "🍏" },
  { nombre: "SMIRNOFF MORAZUL", ingredientes: "Smirnoff, vodka y morazul.", licor: "VODKA", color: "cyan", icono: "🫐" },
  { nombre: "SMIRNOFF", ingredientes: "Limón y vodka.", licor: "VODKA", color: "cyan", icono: "🍋" },
  { nombre: "CANDY", ingredientes: "Vodka, champaña y liche.", licor: "VODKA", color: "cyan", icono: "🥂" },
  { nombre: "CAIPIROSKA", ingredientes: "Vodka, frambuesa y limon.", licor: "VODKA", color: "cyan", icono: "🍹" },
  { nombre: "RED FANTASY", ingredientes: "Vodka y frutos rojos.", licor: "VODKA", color: "cyan", icono: "🍓" },
  { nombre: "BUBALU", ingredientes: "Vodka, morazul y sandia.", licor: "VODKA", color: "cyan", icono: "🫐" },
  { nombre: "FOURLOKO", ingredientes: "Vodka y fourloko ponche.", licor: "VODKA", color: "cyan", icono: "💥" },
  { nombre: "BLACK GRAPE", ingredientes: "Vodka, bombombun y uva.", licor: "VODKA", color: "cyan", icono: "🍇" },
  { nombre: "PARTY BLUE", ingredientes: "Vodka y champaña.", licor: "VODKA", color: "cyan", icono: "🍾" },
  { nombre: "MALIBÚ", ingredientes: "Vodka, cereza y morazul.", licor: "VODKA", color: "cyan", icono: "🍒" },
  { nombre: "SEX ON THE BEACH", ingredientes: "Vodka, granadina, naranja.", licor: "VODKA", color: "cyan", icono: "🏖️" },

  // --- GINEBRA BASE ---
  { nombre: "IBIZA", ingredientes: "Ginebra, uva y frutos rojos.", licor: "GINEBRA", color: "purple", icono: "🍇" },
  { nombre: "STARBLUE", ingredientes: "Ginebra, cereza limón y maracuyá.", licor: "GINEBRA", color: "purple", icono: "⭐" },
  { nombre: "PARADAISE", ingredientes: "Ginebra, vodka, uva y chicle.", licor: "GINEBRA", color: "purple", icono: "🍧" },
  { nombre: "PASION PURPLE", ingredientes: "Ginebra, vodka, fresa y uva.", licor: "GINEBRA", color: "purple", icono: "💜" },
  { nombre: "SWEET CANDY", ingredientes: "Ginebra, vodka y uva.", licor: "GINEBRA", color: "purple", icono: "🍬" },
  { nombre: "SEDUCCIÓN", ingredientes: "Ginebra, vodka y cereza.", licor: "GINEBRA", color: "purple", icono: "🍒" },

  // --- TEQUILA BASE ---
  { nombre: "MANGO BICHE", ingredientes: "Tequila y mango.", licor: "TEQUILA", color: "pink", icono: "🥭" },
  { nombre: "OJO DEL DIABLO", ingredientes: "Tequila, vodka, kola y granadina.", licor: "TEQUILA", color: "pink", icono: "🔥" },
  { nombre: "CLIMAX", ingredientes: "Tequila, vodka, frambuesa y maracuyá.", licor: "TEQUILA", color: "pink", icono: "🌋" },
  { nombre: "NEBULOSA", ingredientes: "Tequila, chicle y tutti frutty.", licor: "TEQUILA", color: "pink", icono: "🌌" },
  { nombre: "BLUBERRY BLOOM", ingredientes: "Tequila, vodka chicle y mora azul.", licor: "TEQUILA", color: "pink", icono: "🫐" },
  { nombre: "TEQUILULO", ingredientes: "Tequila y lulo.", licor: "TEQUILA", color: "pink", icono: "🍈" },
  { nombre: "MARACUYA TEQUILA", ingredientes: "Maracuyá y tequila.", licor: "TEQUILA", color: "pink", icono: "🟡" },
  { nombre: "MARACUMANGO", ingredientes: "Tequila, maracuya y mango.", licor: "TEQUILA", color: "pink", icono: "🥭" },
  { nombre: "MARACULULO", ingredientes: "Tequila, maracuyá y lulo.", licor: "TEQUILA", color: "pink", icono: "🍈" },
  { nombre: "PANDA IKI", ingredientes: "Tequila, licor de naranja y limón.", licor: "TEQUILA", color: "pink", icono: "🐼" },
  { nombre: "KRIPTONITA", ingredientes: "Tequila, limon, maracuya y fresa.", licor: "TEQUILA", color: "pink", icono: "🧪" },
  { nombre: "MARACUTUSSI", ingredientes: "Vodka, tequila, maracuyá y sandia.", licor: "TEQUILA", color: "pink", icono: "⚡" },

  // --- COÑAC BASE ---
  { nombre: "TUSSI", ingredientes: "Coñac, vodka y chicle.", licor: "COÑAC", color: "fuchsia", icono: "💎" },
  { nombre: "BLACK DIAMOND", ingredientes: "Coñac y frutos negros.", licor: "COÑAC", color: "fuchsia", icono: "🖤" }
];

document.addEventListener('DOMContentLoaded', () => {
  // 1. Elementos del Modal de Sabores
  const modal = document.getElementById('flavors-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const flavorsGrid = document.getElementById('flavors-grid');
  const searchInput = document.getElementById('flavor-search-input');
  const filterBtns = document.querySelectorAll('.flavor-filter-btn');

  // Botones que abren el modal
  const openButtons = [
    document.getElementById('open-menu-btn-nav'),
    document.getElementById('open-menu-btn-hero'),
    document.getElementById('open-menu-btn-cta'),
    document.getElementById('btn-floating-menu'),
    document.getElementById('open-menu-btn-footer')
  ];

  function openModal() {
    if (modal) {
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      renderFlavors();
    }
  }

  function closeModal() {
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  }

  openButtons.forEach(btn => {
    if (btn) btn.addEventListener('click', openModal);
  });

  // Botones directos de sedes universitarias
  document.querySelectorAll('.open-menu-direct-btn').forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  // Botón del pie del modal hacia el Arcade
  const btnModalArcade = document.getElementById('btn-modal-to-arcade');
  if (btnModalArcade) {
    btnModalArcade.addEventListener('click', (e) => {
      e.preventDefault();
      closeModal();
      const target = document.getElementById('arcade');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  // Cerrar al pulsar el fondo oscuro
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  let activeFilter = 'TODOS';
  let currentQuery = '';

  function renderFlavors() {
    if (!flavorsGrid) return;

    let filtered = SABORES_CON_LICOR;

    // Filtro por licor
    if (activeFilter !== 'TODOS') {
      filtered = filtered.filter(s => s.licor === activeFilter || (s.licorSecundario && s.licorSecundario === activeFilter));
    }

    // Filtro por búsqueda
    if (currentQuery.trim()) {
      const q = currentQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.nombre.toLowerCase().includes(q) ||
        s.ingredientes.toLowerCase().includes(q) ||
        s.licor.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      flavorsGrid.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-500">
          <span class="text-3xl">🔍</span>
          <p class="text-xs font-bold mt-2">No se encontraron sabores con ese filtro.</p>
        </div>
      `;
      return;
    }

    flavorsGrid.innerHTML = filtered.map(s => {
      let badgeColor = "bg-amber-950 text-amber-300 border-amber-500/40";
      if (s.licor === 'VODKA') badgeColor = "bg-cyan-950 text-cyan-300 border-cyan-500/40";
      if (s.licor === 'GINEBRA') badgeColor = "bg-purple-950 text-purple-300 border-purple-500/40";
      if (s.licor === 'TEQUILA') badgeColor = "bg-pink-950 text-pink-300 border-pink-500/40";
      if (s.licor === 'COÑAC') badgeColor = "bg-fuchsia-950 text-fuchsia-300 border-fuchsia-500/40";

      return `
        <div class="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-pink-500/40 transition flex flex-col justify-between group">
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-lg">${s.icono}</span>
              <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${badgeColor}">
                ${s.licor}
              </span>
            </div>
            <h4 class="text-sm font-black text-white uppercase tracking-tight group-hover:text-pink-300 transition">
              ${s.nombre}
            </h4>
            <p class="text-[11px] text-slate-300 leading-snug">
              ${s.ingredientes}
            </p>
          </div>

          <div class="pt-3 border-t border-slate-900 mt-2 flex items-center justify-between">
            <span class="text-[10px] text-pink-400 font-bold">✨ Receta de Autor</span>
            <span class="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-medium text-[9px] uppercase">
              Frozen
            </span>
          </div>
        </div>
      `;
    }).join('');
  }

  // Eventos de filtros
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('active', 'bg-pink-600', 'text-white');
        b.classList.add('bg-slate-950', 'text-slate-300');
      });
      btn.classList.add('active', 'bg-pink-600', 'text-white');
      btn.classList.remove('bg-slate-950', 'text-slate-300');
      activeFilter = btn.dataset.filter;
      renderFlavors();
    });
  });

  // Evento buscador
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentQuery = e.target.value;
      renderFlavors();
    });
  }

  // Renderizado inicial de la carta de sabores
  renderFlavors();

  // Abrir modal automáticamente si viene en URL (?modal=sabores o #sabores)
  if (new URLSearchParams(window.location.search).get('modal') === 'sabores' || window.location.hash === '#sabores') {
    openModal();
  }

  // --- MODAL LOG IN / SIGN UP (PRÓXIMAMENTE) ---
  const authModal = document.getElementById('modal-auth-coming-soon');
  const btnLoginSignup = document.getElementById('btn-login-signup');
  const btnCloseAuth = document.getElementById('btn-close-auth-modal');
  const btnCloseAuthSec = document.getElementById('btn-close-auth-modal-secondary');
  const btnAuthToArcade = document.getElementById('btn-auth-to-arcade');

  const openAuthModal = () => {
    if (authModal) {
      authModal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
  };

  const closeAuthModal = () => {
    if (authModal) {
      authModal.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
  };

  if (btnLoginSignup) {
    btnLoginSignup.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthModal();
    });
  }

  if (btnCloseAuth) btnCloseAuth.addEventListener('click', closeAuthModal);
  if (btnCloseAuthSec) btnCloseAuthSec.addEventListener('click', closeAuthModal);

  if (btnAuthToArcade) {
    btnAuthToArcade.addEventListener('click', () => {
      closeAuthModal();
      const target = document.getElementById('arcade');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (authModal) {
    authModal.addEventListener('click', (e) => {
      if (e.target === authModal) closeAuthModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && authModal && !authModal.classList.contains('hidden')) {
      closeAuthModal();
    }
  });

  // 2. Control del Reproductor Universal de Música Paradice
  if (window.ParadiceAudio) {
    window.ParadiceAudio.init();
    const musicToggle = document.getElementById('btn-music-toggle');
    const musicNext = document.getElementById('btn-music-next');
    const musicIcon = document.getElementById('music-icon');
    const trackDisplay = document.getElementById('music-track-display');

    const updateAudioUI = () => {
      if (musicIcon) {
        musicIcon.textContent = window.ParadiceAudio.isMusicMuted ? '🔇' : '🎵';
      }
      if (trackDisplay) {
        trackDisplay.textContent = window.ParadiceAudio.getCurrentTrackName() || 'Paradice Beats';
      }
    };

    if (musicToggle) {
      musicToggle.addEventListener('click', () => {
        window.ParadiceAudio.toggleMusic();
        updateAudioUI();
      });
    }
    if (musicNext) {
      musicNext.addEventListener('click', () => {
        window.ParadiceAudio.playNextTrack();
        updateAudioUI();
      });
    }

    updateAudioUI();
    setInterval(updateAudioUI, 1200);
  }
});
