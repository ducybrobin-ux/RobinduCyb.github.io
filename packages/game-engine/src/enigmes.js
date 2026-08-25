/* enigmes.js — Sélection d'une énigme par difficulté.
 *
 * Priorité au contenu modulaire (enigmes.{difficulty}),
 * fallback sur l'ancien champ `balise.enigme`.
 *
 * Extrait de js/data.js (héritage Multi JDP).
 */

/**
 * Retourne l'énigme d'une balise selon la difficulté choisie.
 * @param {{ enigmes?: Record<string, unknown>, enigme?: unknown }|null} balise
 * @param {string} [difficulty="facile"]
 * @returns {object|null}
 */
export function getEnigme(balise, difficulty) {
  if (!balise) return null;
  const d = difficulty || "facile";
  if (balise.enigmes && balise.enigmes[d]) return balise.enigmes[d];
  return balise.enigme || null;
}
