/**
 * PARADICE - HIT BAR RUSH 2.0 (APP BOOTSTRAP)
 * Inicializador MVC y gestor del Drawer Lateral de Navegación
 */

(function () {
  'use strict';

  function startHitbar() {
    if (window.__hitbarStarted) return;
    window.__hitbarStarted = true;
    window.hitbarController = new HitbarController();
    window.hitbarController.init();

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
    document.addEventListener('DOMContentLoaded', startHitbar);
  } else {
    startHitbar();
  }
})();
