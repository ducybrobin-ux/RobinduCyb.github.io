/* normalize.js — Normalisation d'une réponse textuelle.
 *
 * Minuscules, suppression des accents, normalisation des apostrophes
 * et des espaces. Fonction déterministe, pure, sans dépendance.
 *
 * Extrait de js/data.js (héritage Multi JDP).
 */

/**
 * Normalise une chaîne : minuscules, accents supprimés, espaces unifiés.
 * @param {*} s
 * @returns {string}
 */
export function normalize(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[''\u2019]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
