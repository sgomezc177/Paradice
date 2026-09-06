/**
 * StorageService - Paradice Juegos
 * Capa de persistencia unificada para gestión de vidas (3 vidas por juego),
 * historial de jugadas y preferencias de audio del usuario.
 */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], function () { return factory(root); });
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory(root);
  } else {
    root.StorageService = factory(root);
  }
})(typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this), function (root) {
  'use strict';
  root = root || (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : this));

  const PREFIX = 'paradice_';

  const StorageService = {
    /**
     * Obtiene un valor parseado de localStorage
     */
    get(key, defaultValue = null) {
      try {
        const item = localStorage.getItem(PREFIX + key);
        return item !== null ? JSON.parse(item) : defaultValue;
      } catch (e) {
        console.warn('StorageService.get error:', e);
        return defaultValue;
      }
    },

    /**
     * Guarda un valor en localStorage serializado en JSON
     */
    set(key, value) {
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(value));
        return true;
      } catch (e) {
        console.warn('StorageService.set error:', e);
        return false;
      }
    },

    /**
     * Elimina una clave de localStorage
     */
    remove(key) {
      try {
        localStorage.removeItem(PREFIX + key);
        return true;
      } catch (e) {
        console.warn('StorageService.remove error:', e);
        return false;
      }
    },

    /**
     * Gestión de vidas por juego (3 vidas estándar)
     */
    getLives(gameKey, maxLives = 3) {
      const lives = this.get(`lives_${gameKey}`, maxLives);
      return typeof lives === 'number' && lives >= 0 && lives <= maxLives ? lives : maxLives;
    },

    setLives(gameKey, lives) {
      return this.set(`lives_${gameKey}`, Math.max(0, lives));
    },

    decrementLives(gameKey, maxLives = 3) {
      const current = this.getLives(gameKey, maxLives);
      const next = Math.max(0, current - 1);
      this.setLives(gameKey, next);
      return next;
    },

    resetLives(gameKey, maxLives = 3) {
      this.setLives(gameKey, maxLives);
      return maxLives;
    },

    /**
     * Configuración de audio
     */
    getAudioConfig() {
      return this.get('audio_config', {
        musicMuted: false,
        sfxMuted: false,
        volume: 0.55
      });
    },

    saveAudioConfig(config) {
      return this.set('audio_config', config);
    },

    /**
     * Historial de tiradas / partidas
     */
    getHistory(gameKey) {
      return this.get(`history_${gameKey}`, []);
    },

    addHistory(gameKey, record, maxItems = 30) {
      const list = this.getHistory(gameKey);
      list.unshift(record);
      if (list.length > maxItems) list.length = maxItems;
      this.set(`history_${gameKey}`, list);
      return list;
    },

    clearHistory(gameKey) {
      return this.set(`history_${gameKey}`, []);
    }
  };

  return StorageService;
});
