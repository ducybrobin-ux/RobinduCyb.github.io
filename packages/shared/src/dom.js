/* dom.js — Utilitaires DOM.
 *
 * Fonctions pures, zéro dépendance.
 * Raccourcis pour les opérations DOM les plus courantes.
 */

/**
 * Raccourci vers document.getElementById.
 * @param {string} id
 * @returns {HTMLElement|null}
 */
export function $(id) {
  return document.getElementById(id);
}

/**
 * Affiche un élément (supprime la classe 'hidden').
 * @param {HTMLElement|string} el — élément ou id
 */
export function show(el) {
  const node = typeof el === "string" ? $(el) : el;
  if (node) node.classList.remove("hidden");
}

/**
 * Masque un élément (ajoute la classe 'hidden').
 * @param {HTMLElement|string} el — élément ou id
 */
export function hide(el) {
  const node = typeof el === "string" ? $(el) : el;
  if (node) node.classList.add("hidden");
}

/**
 * Bascule la visibilité d'un élément.
 * @param {HTMLElement|string} el — élément ou id
 */
export function toggle(el) {
  const node = typeof el === "string" ? $(el) : el;
  if (node) node.classList.toggle("hidden");
}

/**
 * Définit le texte d'un élément (textContent).
 * @param {HTMLElement|string} el — élément ou id
 * @param {string} text
 */
export function setText(el, text) {
  const node = typeof el === "string" ? $(el) : el;
  if (node) node.textContent = text;
}

/**
 * Définit le HTML d'un élément (innerHTML).
 * ATTENTION : utiliser esc() pour les données utilisateur.
 * @param {HTMLElement|string} el — élément ou id
 * @param {string} html
 */
export function setHTML(el, html) {
  const node = typeof el === "string" ? $(el) : el;
  if (node) node.innerHTML = html;
}

/**
 * Ajoute un écouteur d'événement de manière safe.
 * @param {HTMLElement|string} el — élément ou id
 * @param {string} event
 * @param {Function} handler
 */
export function on(el, event, handler) {
  const node = typeof el === "string" ? $(el) : el;
  if (node) node.addEventListener(event, handler);
}
