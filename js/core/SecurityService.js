/**
 * SecurityService - Paradice Juegos
 * Centraliza la generación y validación de firmas criptográficas para vouchers QR,
 * identificación de terminal POS / Cliente y generación de enlaces de verificación y WhatsApp.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.SecurityService = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  const SECRET_KEY = "PARADICE_SECRET_SLOT_KEY_2026";
  const WHATSAPP_PHONE = "";

  const SecurityService = {
    /**
     * Obtiene o crea un ID único de terminal simulado (MAC)
     */
    getOrCreateTerminalId() {
      try {
        let id = localStorage.getItem('paradice_terminal_mac');
        if (!id) {
          const hex = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1).toUpperCase();
          id = `MAC-${hex()}-${hex()}-${hex()}`;
          localStorage.setItem('paradice_terminal_mac', id);
        }
        return id;
      } catch (e) {
        return 'MAC-PARADICE-POS-01';
      }
    },

    /**
     * Algoritmo de hash dual para firma criptográfica anti-fraude
     */
    calcularFirma(intento, premio, fecha, hora, terminal) {
      const raw = `${intento}|${premio}|${fecha}|${hora}|${terminal}|${SECRET_KEY}`;
      
      let hash1 = 0;
      for (let i = 0; i < raw.length; i++) {
        const char = raw.charCodeAt(i);
        hash1 = ((hash1 << 5) - hash1) + char;
        hash1 = hash1 & hash1;
      }

      let hash2 = 5381;
      for (let i = 0; i < raw.length; i++) {
        hash2 = ((hash2 << 5) + hash2) + raw.charCodeAt(i);
        hash2 = hash2 & hash2;
      }

      const sig1 = Math.abs(hash1).toString(16).toUpperCase().padStart(8, '0');
      const sig2 = Math.abs(hash2).toString(16).toUpperCase().padStart(8, '0');
      return sig1 + sig2;
    },

    /**
     * Valida si un ticket coincide con su firma criptográfica
     */
    validarTicket(ticket) {
      if (!ticket || !ticket.sig) return false;
      const firmaCalculada = this.calcularFirma(
        ticket.intento,
        ticket.premio,
        ticket.fecha,
        ticket.hora,
        ticket.terminal
      );
      return ticket.sig === firmaCalculada;
    },

    /**
     * Formato de fecha actual DD/MM/AAAA
     */
    getFechaActual() {
      const now = new Date();
      const dd = String(now.getDate()).padStart(2, '0');
      const mm = String(now.getMonth() + 1).padStart(2, '0');
      const yyyy = now.getFullYear();
      return `${dd}/${mm}/${yyyy}`;
    },

    /**
     * Formato de hora actual HH:MM:SS (12h con AM/PM)
     */
    getHoraActual() {
      const now = new Date();
      return now.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
    },

    /**
     * Construye URL completa para verificar.html
     */
    buildVerificationUrl(data) {
      const baseUrl = window.location.href.substring(0, window.location.href.lastIndexOf('/') + 1) + 'verificar.html';
      const params = new URLSearchParams({
        intento: String(data.intento || 1),
        premio: String(data.premio || ''),
        codigo: String(data.codigo || '🍧'),
        fecha: String(data.fecha || this.getFechaActual()),
        hora: String(data.hora || this.getHoraActual()),
        dispositivo: String(data.dispositivo || 'Web Game'),
        terminal: String(data.terminal || this.getOrCreateTerminalId()),
        sig: String(data.sig || '')
      });
      if (data.restriccion) params.set('restriccion', String(data.restriccion));
      if (data.sku) params.set('sku', String(data.sku));
      return `${baseUrl}?${params.toString()}`;
    },

    /**
     * Construye URL de WhatsApp oficial con mensaje preformateado
     */
    buildWhatsAppUrl(juegoNombre, premioNombre, terminal, sig, restriccion = '') {
      let msg = `¡Hola Paradice! 🍧 Acabo de jugar a *${juegoNombre.toUpperCase()}* y gané la promoción: *${premioNombre}*.\n\n`;
      if (restriccion) {
        msg += `⚠️ Condición: ${restriccion}\n`;
      }
      msg += `🏷️ Terminal: ${terminal}\n` +
        `🔒 Código de Verificación: ${sig}\n\n` +
        `Quiero hacer mi pedido para redimir mi premio en mi granizado.`;
      const text = encodeURIComponent(msg);
      return WHATSAPP_PHONE ? `https://wa.me/${WHATSAPP_PHONE}?text=${text}` : `https://wa.me/?text=${text}`;
    }
  };

  return SecurityService;
});
