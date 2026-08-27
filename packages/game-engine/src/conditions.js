/* conditions.js — Conditions évaluables par le moteur.
 *
 * Chaque condition est une fonction pure : (state, payload) -> boolean.
 * Le state est l'objet game state courant.
 * Le payload est celui de l'événement déclencheur.
 *
 * Conditions composites : NOT, AND, OR pour combiner les conditions.
 */

/**
 * La balise est déjà validée.
 */
export function isBaliseDone(state, payload) {
  return state.completed.includes(payload?.balise?.id);
}

/**
 * La balise n'est PAS encore validée.
 */
export function isBalisePending(state, payload) {
  return !isBaliseDone(state, payload);
}

/**
 * Mode course activé.
 */
export function isRaceMode(state) {
  return state.playMode === "race";
}

/**
 * Mode classique (pas course, pas aléatoire).
 */
export function isClassicMode(state) {
  return state.playMode === "classic";
}

/**
 * Mode aléatoire activé.
 */
export function isRandomMode(state) {
  return state.playMode === "random";
}

/**
 * L'énigme a déjà été résolue pour cette balise.
 */
export function isRiddleSolved(state, payload) {
  const id = payload?.balise?.id;
  return !!(state.riddles && state.riddles[id]);
}

/**
 * L'énigme n'a pas encore été résolue.
 */
export function isRiddlePending(state, payload) {
  return !isRiddleSolved(state, payload);
}

/**
 * Le quiz a été réussi (score parfait).
 */
export function isQuizPerfect(state, payload) {
  return payload?.score === payload?.total && payload?.total > 0;
}

/**
 * Le profil est admin (god mode).
 */
export function isAdmin(state) {
  return state.isAdmin;
}

/**
 * Mode nuit activé.
 */
export function isNightMode(state) {
  return state.night;
}

/**
 * Le joueur est hors-ligne.
 */
export function isOffline() {
  return typeof navigator !== "undefined" && !navigator.onLine;
}

/**
 * Des graines sont disponibles pour ce profil.
 */
export function hasSeeds(state) {
  return (state.seeds ?? 0) > 0;
}

/**
 * Toutes les balises sont validées.
 */
export function allBalisesDone(state, _payload, ctx) {
  const total = ctx?.balisesCount ?? 0;
  return total > 0 && state.completed.length >= total;
}

/**
 * Negation d'une condition.
 * @param {Function} cond — condition à inverser
 * @returns {Function}
 */
export function not(cond) {
  return (state, payload, ctx) => !cond(state, payload, ctx);
}

/**
 * Toutes les conditions doivent être vraies (ET logique).
 * @param  {...Function} conds — conditions à combiner
 * @returns {Function}
 */
export function and(...conds) {
  return (state, payload, ctx) => conds.every((c) => c(state, payload, ctx));
}

/**
 * Au moins une condition doit être vraie (OU logique).
 * @param  {...Function} conds — conditions à combiner
 * @returns {Function}
 */
export function or(...conds) {
  return (state, payload, ctx) => conds.some((c) => c(state, payload, ctx));
}
