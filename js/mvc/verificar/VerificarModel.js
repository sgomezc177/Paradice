/**
 * VerificarModel.js - Paradice Juegos (MVC - Centro de Verificación)
 * Lógica de auditoría, lectura de parámetros de URL, historial de tickets y estadísticas de caja.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.VerificarModel = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  const STORAGE_KEY = 'paradice_mac_verification_history_v2';

  class VerificarModelClass {
    constructor() {
      this.historial = [];
      this.ticketActual = null;
      this.posId = this.obtenerPosTerminalId();
      this.cargarHistorial();
    }

    obtenerPosTerminalId() {
      try {
        let posId = localStorage.getItem('paradice_pos_terminal_id');
        if (!posId) {
          posId = 'CAJA-' + Math.floor(1000 + Math.random() * 9000);
          localStorage.setItem('paradice_pos_terminal_id', posId);
        }
        return posId;
      } catch (e) {
        return 'CAJA-001';
      }
    }

    cargarHistorial() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        this.historial = raw ? JSON.parse(raw) : [];
      } catch (e) {
        this.historial = [];
      }
      return this.historial;
    }

    guardarHistorial() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.historial));
      } catch (e) {}
    }

    extraerTicketUrl() {
      const params = new URLSearchParams(window.location.search);
      const intento = params.get('intento');
      const premio = params.get('premio');
      const codigo = params.get('codigo') || '';
      const fecha = params.get('fecha');
      const hora = params.get('hora');
      const dispositivo = params.get('dispositivo') || 'Web Game';
      const terminal = params.get('terminal') || 'MAC-DESCONOCIDA';
      const sig = params.get('sig');

      if (intento && premio && fecha && hora && sig) {
        this.ticketActual = {
          intento,
          premio,
          codigo,
          fecha,
          hora,
          dispositivo: decodeURIComponent(dispositivo),
          terminal,
          sig
        };
        return this.ticketActual;
      }
      return null;
    }

    buscarTicketPorFirma(sig) {
      return this.historial.find(item => item.sig === sig);
    }

    registrarCanje(ticket) {
      const existente = this.buscarTicketPorFirma(ticket.sig);
      if (existente) {
        existente.estado = 'CANJEADO';
        existente.fechaCanje = new Date().toLocaleString();
      } else {
        this.historial.unshift({
          ...ticket,
          estado: 'CANJEADO',
          fechaCanje: new Date().toLocaleString()
        });
      }
      this.guardarHistorial();
    }

    getEstadisticas() {
      const total = this.historial.length;
      const canjeados = this.historial.filter(h => h.estado === 'CANJEADO').length;
      const validos = this.historial.filter(h => h.estado === 'VALIDO').length;
      const fraudes = this.historial.filter(h => h.estado === 'INVALIDO').length;

      return { total, canjeados, validos, fraudes };
    }

    filtrarHistorial(filtro = 'TODOS', busqueda = '') {
      return this.historial.filter(item => {
        const coincideFiltro = (filtro === 'TODOS') || (item.estado === filtro);
        const search = busqueda.toLowerCase();
        const coincideBusqueda = !busqueda || 
          item.premio.toLowerCase().includes(search) ||
          item.terminal.toLowerCase().includes(search) ||
          item.sig.toLowerCase().includes(search);

        return coincideFiltro && coincideBusqueda;
      });
    }

    limpiarHistorial() {
      this.historial = [];
      this.guardarHistorial();
    }
  }

  return VerificarModelClass;
});
