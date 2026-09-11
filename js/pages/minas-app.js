/**
 * PARADICE - MINAS GLACIALES (APP BOOTSTRAP)
 * Inicializador MVC y gestor del Drawer Lateral de Navegación
 */

(function () {
  'use strict';

  function startMinas() {
    if (window.__minasStarted) return;
    window.__minasStarted = true;
    window.minasController = new MinasController();
    window.minasController.init();

    // Control del Drawer Lateral
    const openBtn = document.getElementById('btn-open-sidebar');
    const closeBtn = document.getElementById('btn-close-sidebar');
    const drawer = document.getElementById('sidebar-drawer');
    const backdrop = document.getElementById('sidebar-backdrop');

    function openDrawer() {
      backdrop?.classList.remove('opacity-0', 'pointer-events-none');
      backdrop?.classList.add('opacity-100', 'pointer-events-auto');
      drawer?.classList.remove('translate-x-full');
    }

    function closeDrawer() {
      backdrop?.classList.remove('opacity-100', 'pointer-events-auto');
      backdrop?.classList.add('opacity-0', 'pointer-events-none');
      drawer?.classList.add('translate-x-full');
    }

    openBtn?.addEventListener('click', openDrawer);
    closeBtn?.addEventListener('click', closeDrawer);
    backdrop?.addEventListener('click', closeDrawer);

    document.getElementById('btn-instructions')?.addEventListener('click', closeDrawer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startMinas);
  } else {
    startMinas();
  }
})();
