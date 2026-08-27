/* event-bus.js — Bus d'événements léger.
 *
 * Permet la communication découlée entre modules.
 * Zéro dépendance. Événements asynchrones.
 *
 * Pattern : publish/subscribe classique.
 * Chaque subscriber reçoit les arguments de l'emit.
 * Retourne une fonction de désabonnement.
 */

/**
 * Crée un bus d'événements.
 * @returns {{ on, off, emit, once, clear }}
 */
export function createEventBus() {
  /** @type {Map<string, Set<Function>>} */
  const listeners = new Map();

  return {
    /**
     * S'abonner à un événement.
     * @param {string} event
     * @param {Function} fn
     * @returns {Function} fonction de désabonnement
     */
    on(event, fn) {
      if (!listeners.has(event)) listeners.set(event, new Set());
      listeners.get(event).add(fn);
      return () => listeners.get(event)?.delete(fn);
    },

    /**
     * S'abonner une seule fois.
     * @param {string} event
     * @param {Function} fn
     * @returns {Function} fonction de désabonnement
     */
    once(event, fn) {
      const wrapper = (...args) => {
        unsub();
        fn(...args);
      };
      const unsub = this.on(event, wrapper);
      return unsub;
    },

    /**
     * Se désabonner.
     * @param {string} event
     * @param {Function} fn
     */
    off(event, fn) {
      listeners.get(event)?.delete(fn);
    },

    /**
     * Émettre un événement.
     * @param {string} event
     * @param {...*} args
     */
    emit(event, ...args) {
      const fns = listeners.get(event);
      if (fns) {
        for (const fn of fns) {
          try {
            fn(...args);
          } catch (err) {
            console.error(`[EventBus] Error in "${event}":`, err);
          }
        }
      }
    },

    /**
     * Supprimer tous les listeners (utile pour les tests).
     */
    clear() {
      listeners.clear();
    },
  };
}
