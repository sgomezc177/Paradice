/**
 * VerificarController.js - Paradice Juegos (MVC - Centro de Verificación)
 * Controlador que orquesta la verificación anti-fraude, canjes y filtros de auditoría.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.VerificarController = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  class VerificarControllerClass {
    constructor() {
      this.model = new root.VerificarModel();
      this.view = new root.VerificarView();
      this.security = root.SecurityService;
      this.currentFilter = 'TODOS';
      this.currentSearch = '';
    }

    init() {
      this.view.init();
      this.view.renderPosId(this.model.posId);
      this.bindEvents();

      const ticket = this.model.extraerTicketUrl();

      if (ticket) {
        this.procesarEscaneo(ticket);
      } else {
        this.view.renderEstadoTicket('AUDITORIA', null);
      }

      this.actualizarMetricasYTabla();
    }

    bindEvents() {
      // 1. Botón Canjear en Caja
      if (this.view.dom.canjearBtn) {
        this.view.dom.canjearBtn.addEventListener('click', () => {
          if (this.model.ticketActual) {
            this.model.registrarCanje(this.model.ticketActual);
            this.view.renderEstadoTicket('YA_CANJEADO', this.model.ticketActual);
            this.actualizarMetricasYTabla();
          }
        });
      }

      // 2. Filtros de Estado
      const filterBtns = document.querySelectorAll('.filter-btn');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          filterBtns.forEach(b => b.classList.remove('bg-cyan-500', 'text-slate-950', 'font-black'));
          btn.classList.add('bg-cyan-500', 'text-slate-950', 'font-black');
          this.currentFilter = btn.dataset.filter || 'TODOS';
          this.actualizarMetricasYTabla();
        });
      });

      // 3. Barra de Búsqueda
      if (this.view.dom.searchInput) {
        this.view.dom.searchInput.addEventListener('input', (e) => {
          this.currentSearch = e.target.value;
          this.actualizarMetricasYTabla();
        });
      }

      // 4. Limpiar Historial
      if (this.view.dom.btnLimpiar) {
        this.view.dom.btnLimpiar.addEventListener('click', () => {
          if (confirm('¿Estás seguro de que deseas limpiar el historial de auditoría de esta terminal?')) {
            this.model.limpiarHistorial();
            this.actualizarMetricasYTabla();
          }
        });
      }
    }

    procesarEscaneo(ticket) {
      this.view.renderDetallesTicket(ticket);

      // 1. Validar autenticidad criptográfica
      const esFirmaValida = this.security.validarTicket(ticket);

      if (!esFirmaValida) {
        this.model.historial.unshift({
          ...ticket,
          estado: 'INVALIDO',
          fechaCanje: 'Intento de Fraude'
        });
        this.model.guardarHistorial();
        this.view.renderEstadoTicket('INVALIDO', ticket);
        return;
      }

      // 2. Validar si ya fue canjeado
      const existente = this.model.buscarTicketPorFirma(ticket.sig);
      if (existente && existente.estado === 'CANJEADO') {
        this.view.renderEstadoTicket('YA_CANJEADO', existente);
        return;
      }

      // 3. Ticket Válido pendiente de entrega
      if (!existente) {
        this.model.historial.unshift({
          ...ticket,
          estado: 'VALIDO',
          fechaCanje: 'Pendiente'
        });
        this.model.guardarHistorial();
      }

      this.view.renderEstadoTicket('VALIDO', ticket);
    }

    actualizarMetricasYTabla() {
      const stats = this.model.getEstadisticas();
      this.view.renderKPIs(stats);

      const lista = this.model.filtrarHistorial(this.currentFilter, this.currentSearch);
      this.view.renderTabla(lista);
    }
  }

  return VerificarControllerClass;
});
