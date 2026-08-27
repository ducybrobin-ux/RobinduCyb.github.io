/* data-loader.js — Accès aux données du parcours.
 *
 * Fonctions pures, injectables. Aucune dépendance globale.
 * Les tableaux (birds, balises, guide) sont passés en paramètre.
 * Compatible Node.js (tests) et navigateur.
 */

/**
 * Toutes les découvertes : parcours + guide.
 * @param {Array} birds
 * @param {Array} guide
 * @returns {Array}
 */
export function allBirds(birds, guide) {
  return birds.concat(guide);
}

/**
 * Recherche une découverte par id.
 * @param {string} id
 * @param {Array} birds
 * @param {Array} guide
 * @returns {object|undefined}
 */
export function getBird(id, birds, guide) {
  return allBirds(birds, guide).find((b) => b.id === id);
}

/**
 * Recherche une balise par id.
 * @param {string} id
 * @param {Array} balises
 * @returns {object|undefined}
 */
export function getBalise(id, balises) {
  return balises.find((b) => b.id === id);
}

/**
 * Index d'une balise dans le tableau.
 * @param {string} id
 * @param {Array} balises
 * @returns {number} -1 si introuvable
 */
export function getBaliseIndex(id, balises) {
  return balises.findIndex((b) => b.id === id);
}

/**
 * Balise suivante dans la séquence.
 * @param {string} id
 * @param {Array} balises
 * @returns {object|null}
 */
export function nextBalise(id, balises) {
  const i = getBaliseIndex(id, balises);
  return i >= 0 && i < balises.length - 1 ? balises[i + 1] : null;
}
