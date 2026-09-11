/**
 * PARADICE - VALIDADOR DE VOUCHERS QR (APP BOOTSTRAP)
 * Inicializador MVC del centro de verificación de premios
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';
  if (window.VerificarController) {
    window.verificarController = new VerificarController();
    window.verificarController.init();
  }
});
