/* engine.js — Moteur d'événements EVENT→CONDITION→ACTION→STATE.
 *
 * Architecture :
 *   event → rules matching → conditions evaluated → actions executed → state updated
 *
 * Le moteur est un bus d'événements avec :
 * - Des RÈGLES (rules) : { event, conditions[], actions[] }
 * - Un STATE courant (game state)
 * - Un LOGGER optionnel pour le debug
 *
 * Tout est injectable : les conditions, les actions, le state.
 * Le moteur ne connait PAS le DOM, le Store, ni AudioSys.
 *
 * Usage :
 *   const engine = createEngine({ rules, getState, setState, ctx });
 *   engine.on(BALISE_FOUND, (state, payload) => { ... });
 *   engine.emit(BALISE_FOUND, { balise, mode: "qr" });
 */

/**
 * Crée un moteur d'événements.
 * @param {object} config
 * @param {Array} config.rules — [{ event, conditions[], actions[], priority? }]
 * @param {Function} config.getState — retourne le game state courant
 * @param {Function} config.setState — applique un nouveau game state
 * @param {object} [config.ctx] — contexte supplémentaire (balisesCount, etc.)
 * @param {Function} [config.log] — fonction de log (debug)
 * @returns {{ emit, on, off, getRules, addRule, removeRule }}
 */
export function createEngine({ rules = [], getState, setState, ctx = {}, log } = {}) {
  /** @type {Map<string, Set<Function>>} */
  const listeners = new Map();
  const _rules = [...rules];

  function _log(msg, ...args) {
    if (log) log(`[Engine] ${msg}`, ...args);
  }

  /**
   * Émettre un événement.
   * 1. Exécute les listeners enregistrés via on()
   * 2. Évalue les règles matching cet événement
   * 3. Pour chaque règle : vérifie les conditions, exécute les actions
   *
   * @param {string} event — type d'événement
   * @param {*} payload — données de l'événement
   * @returns {{ matched: number, actionsExecuted: number }}
   */
  function emit(event, payload) {
    const state = getState();
    let matched = 0;
    let actionsExecuted = 0;

    // 1. Listeners enregistrés
    const fns = listeners.get(event);
    if (fns) {
      for (const fn of fns) {
        try {
          fn(state, payload);
        } catch (err) {
          _log(`Listener error on "${event}":`, err);
        }
      }
    }

    // 2. Règles matching
    for (const rule of _rules) {
      if (rule.event !== event) continue;
      matched++;

      // 3. Évaluer les conditions
      const conditionsMet = rule.conditions.every((cond) => {
        try {
          return cond(state, payload, ctx);
        } catch (err) {
          _log(`Condition error in rule "${rule.event}":`, err);
          return false;
        }
      });

      if (!conditionsMet) {
        _log(`Rule "${rule.event}" skipped (conditions not met)`);
        continue;
      }

      // 4. Exécuter les actions
      for (const action of rule.actions) {
        try {
          const result = action(state, payload, ctx);
          // Si l'action retourne un nouveau state, l'appliquer
          if (result && typeof result === "object" && result.completed !== undefined) {
            setState(result);
          }
          actionsExecuted++;
        } catch (err) {
          _log(`Action error in rule "${rule.event}":`, err);
        }
      }

      _log(`Rule "${rule.event}" executed (${rule.actions.length} actions)`);
    }

    return { matched, actionsExecuted };
  }

  /**
   * S'abonner à un événement (listener direct, pas une règle).
   * @param {string} event
   * @param {Function} fn — (state, payload) => void
   * @returns {Function} désabonnement
   */
  function on(event, fn) {
    if (!listeners.has(event)) listeners.set(event, new Set());
    listeners.get(event).add(fn);
    return () => listeners.get(event)?.delete(fn);
  }

  /**
   * Se désabonner.
   */
  function off(event, fn) {
    listeners.get(event)?.delete(fn);
  }

  /**
   * Ajouter une règle dynamiquement.
   * @param {object} rule
   */
  function addRule(rule) {
    _rules.push(rule);
  }

  /**
   * Supprimer une règle par index.
   * @param {number} index
   */
  function removeRule(index) {
    if (index >= 0 && index < _rules.length) _rules.splice(index, 1);
  }

  /**
   * Retourne les règles courantes (pour debug/introspection).
   */
  function getRules() {
    return [..._rules];
  }

  return { emit, on, off, addRule, removeRule, getRules };
}
