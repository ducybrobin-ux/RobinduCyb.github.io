/* escape.js — Échappement HTML.
 *
 * Fonction pure, zéro dépendance.
 * Empêche l'injection HTML/JS via les insertions DOM.
 *
 * Extrait de js/app.js (héritage Multi JDP).
 */

const ESC_MAP = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const ESC_RE = /[&<>"']/g;

/**
 * Échappe les caractères HTML dangereux dans une chaîne.
 * @param {*} s — valeur à échapper (convertie en string)
 * @returns {string}
 */
export function esc(s) {
  return String(s == null ? "" : s).replace(ESC_RE, (c) => ESC_MAP[c]);
}
