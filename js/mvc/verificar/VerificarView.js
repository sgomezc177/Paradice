/**
 * VerificarView.js - Paradice Juegos (MVC - Centro de Verificación)
 * Renderizado de tarjeta de estatus de validación, KPIs numéricos y tabla de auditoría.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.VerificarView = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  class VerificarViewClass {
    constructor() {
      this.dom = {};
    }

    init() {
      this.cacheDOM();
    }

    cacheDOM() {
      this.dom = {
        posDeviceId: document.getElementById('pos-device-id'),
        statusContainer: document.getElementById('status-container'),
        detailsTable: document.getElementById('details-table'),
        actionContainer: document.getElementById('action-container'),
        canjearBtn: document.getElementById('canjear-btn'),
        cardGlow: document.getElementById('card-glow'),
        // Campos de detalles
        fieldPremio: document.getElementById('field-premio'),
        fieldIntento: document.getElementById('field-intento'),
        fieldFecha: document.getElementById('field-fecha'),
        fieldHora: document.getElementById('field-hora'),
        fieldDispositivo: document.getElementById('field-dispositivo'),
        fieldTerminal: document.getElementById('field-terminal'),
        fieldSig: document.getElementById('field-sig'),
        // KPIs
        kpiTotal: document.getElementById('kpi-total-validados'),
        kpiCanjeados: document.getElementById('kpi-canjeados'),
        kpiValidos: document.getElementById('kpi-pendientes'),
        kpiFraudes: document.getElementById('kpi-invalidos'),
        // Tabla y filtros
        tablaHistorial: document.getElementById('tabla-historial-body'),
        searchInput: document.getElementById('search-input'),
        btnExportar: document.getElementById('btn-exportar'),
        btnLimpiar: document.getElementById('btn-limpiar')
      };
    }

    renderPosId(posId) {
      if (this.dom.posDeviceId) this.dom.posDeviceId.textContent = posId;
    }

    renderDetallesTicket(ticket) {
      if (!ticket) return;
      if (this.dom.fieldPremio) this.dom.fieldPremio.textContent = (ticket.codigo ? ticket.codigo + ' ' : '') + ticket.premio;
      if (this.dom.fieldIntento) this.dom.fieldIntento.textContent = `Intento ${ticket.intento} de 3`;
      if (this.dom.fieldFecha) this.dom.fieldFecha.textContent = ticket.fecha;
      if (this.dom.fieldHora) this.dom.fieldHora.textContent = ticket.hora;
      if (this.dom.fieldDispositivo) this.dom.fieldDispositivo.textContent = ticket.dispositivo;
      if (this.dom.fieldTerminal) this.dom.fieldTerminal.textContent = ticket.terminal;
      if (this.dom.fieldSig) this.dom.fieldSig.textContent = ticket.sig;

      if (this.dom.detailsTable) this.dom.detailsTable.classList.remove('hidden');
    }

    renderEstadoTicket(tipo, ticket) {
      if (!this.dom.statusContainer) return;

      if (tipo === 'INVALIDO') {
        if (this.dom.cardGlow) {
          this.dom.cardGlow.className = 'absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-rose-500/30 rounded-full blur-2xl pointer-events-none';
        }
        this.dom.statusContainer.innerHTML = `
          <div class="w-16 h-16 rounded-full bg-rose-950/80 border-2 border-rose-500 flex items-center justify-center text-3xl mb-3 shadow-[0_0_30px_rgba(244,63,94,0.7)] animate-bounce">
            ❌
          </div>
          <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-950 text-rose-300 border border-rose-500/60 mb-2">
            FIRMA CRIPTOGRÁFICA INVÁLIDA
          </span>
          <h2 class="text-2xl font-black text-rose-400 uppercase">TICKET NO AUTORIZADO</h2>
          <p class="text-xs text-slate-400 mt-2 max-w-sm">Los parámetros del código QR fueron manipulados o el ticket no fue emitido por el sistema oficial de Paradice.</p>
        `;
        if (this.dom.actionContainer) this.dom.actionContainer.classList.add('hidden');
      } 
      else if (tipo === 'YA_CANJEADO') {
        if (this.dom.cardGlow) {
          this.dom.cardGlow.className = 'absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-amber-500/30 rounded-full blur-2xl pointer-events-none';
        }
        this.dom.statusContainer.innerHTML = `
          <div class="w-16 h-16 rounded-full bg-amber-950/80 border-2 border-amber-500 flex items-center justify-center text-3xl mb-3 shadow-[0_0_30px_rgba(245,158,11,0.7)]">
            ⚠️
          </div>
          <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-950 text-amber-300 border border-amber-500/60 mb-2">
            PREMIO YA REDIMIDO
          </span>
          <h2 class="text-2xl font-black text-amber-400 uppercase">TICKET PREVIAMENTE ENTREGADO</h2>
          <p class="text-xs text-slate-400 mt-2 max-w-sm">Este premio ya fue canjeado en caja el: <strong class="text-white">${ticket.fechaCanje || 'Fecha previa'}</strong>.</p>
        `;
        if (this.dom.actionContainer) this.dom.actionContainer.classList.add('hidden');
      } 
      else if (tipo === 'VALIDO') {
        if (this.dom.cardGlow) {
          this.dom.cardGlow.className = 'absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-24 bg-emerald-500/30 rounded-full blur-2xl pointer-events-none';
        }
        this.dom.statusContainer.innerHTML = `
          <div class="w-16 h-16 rounded-full bg-emerald-950/80 border-2 border-emerald-500 flex items-center justify-center text-3xl mb-3 shadow-[0_0_30px_rgba(52,211,153,0.7)] animate-pulse">
            ✅
          </div>
          <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/60 mb-2">
            TICKET 100% AUTÉNTICO
          </span>
          <h2 class="text-2xl font-black text-white uppercase">PREMIO VÁLIDO PARA ENTREGA</h2>
          <p class="text-xs text-slate-400 mt-2 max-w-sm">Firma digital corroborada por el supervisor. Procede a aplicar el descuento o entregar la bebida.</p>
        `;
        if (this.dom.actionContainer) this.dom.actionContainer.classList.remove('hidden');
      } 
      else {
        // Modo Auditoría
        this.dom.statusContainer.innerHTML = `
          <div class="w-16 h-16 rounded-full bg-sky-950/80 border-2 border-sky-400 flex items-center justify-center text-3xl mb-3 shadow-[0_0_25px_rgba(56,189,248,0.5)]">
            📋
          </div>
          <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-950 text-sky-300 border border-sky-500/50 mb-2">
            MODO AUDITORÍA Y CAJA
          </span>
          <h2 class="text-xl sm:text-2xl font-black text-white uppercase">ESCANEE UN CÓDIGO QR</h2>
          <p class="text-xs text-slate-400 mt-2 max-w-sm">Apunta la cámara de la terminal al voucher del cliente para verificar su autenticidad al instante.</p>
        `;
        if (this.dom.detailsTable) this.dom.detailsTable.classList.add('hidden');
        if (this.dom.actionContainer) this.dom.actionContainer.classList.add('hidden');
      }
    }

    renderKPIs(stats) {
      if (this.dom.kpiTotal) this.dom.kpiTotal.textContent = stats.total;
      if (this.dom.kpiCanjeados) this.dom.kpiCanjeados.textContent = stats.canjeados;
      if (this.dom.kpiValidos) this.dom.kpiValidos.textContent = stats.validos;
      if (this.dom.kpiFraudes) this.dom.kpiFraudes.textContent = stats.fraudes;
    }

    renderTabla(tickets) {
      if (!this.dom.tablaHistorial) return;
      this.dom.tablaHistorial.innerHTML = '';

      if (tickets.length === 0) {
        this.dom.tablaHistorial.innerHTML = `
          <tr>
            <td colspan="6" class="px-4 py-8 text-center text-xs text-slate-500">
              No hay tickets registrados que coincidan con la búsqueda.
            </td>
          </tr>
        `;
        return;
      }

      tickets.forEach(t => {
        const tr = document.createElement('tr');
        tr.className = 'border-b border-slate-800/60 hover:bg-slate-900/50 text-xs transition';

        const badgeClass = t.estado === 'CANJEADO' 
          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' 
          : t.estado === 'INVALIDO' 
            ? 'bg-rose-950 text-rose-300 border border-rose-500/50'
            : 'bg-sky-950 text-sky-300 border border-sky-500/50';

        tr.innerHTML = `
          <td class="px-4 py-3 font-mono text-[11px] text-slate-400">${t.fecha} ${t.hora}</td>
          <td class="px-4 py-3 font-bold text-white">${t.codigo ? t.codigo + ' ' : ''}${t.premio}</td>
          <td class="px-4 py-3 font-mono text-slate-300 text-[10px]">${t.terminal}</td>
          <td class="px-4 py-3 font-mono text-cyan-300 text-[10px]">${t.sig.slice(0, 10)}...</td>
          <td class="px-4 py-3">
            <span class="px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${badgeClass}">
              ${t.estado}
            </span>
          </td>
        `;
        this.dom.tablaHistorial.appendChild(tr);
      });
    }
  }

  return VerificarViewClass;
});
