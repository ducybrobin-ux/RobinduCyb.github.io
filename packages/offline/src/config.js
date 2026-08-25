/**
 * @curios/offline — Configuration du service worker.
 *
 * VERSION   : bumpé à chaque déploiement pour invalider les caches.
 * CACHE     : nom du cache principal (précaché au install).
 * RUNTIME   : nom du cache de secours (rempli au fil des navigations).
 * PRECACHE  : liste statique des fichiers à précacher.
 */

export const VERSION = "curios-v1";
export const CACHE = "curios-core-v1";
export const RUNTIME = "curios-runtime-v1";

/**
 * Fichiers précachés au premier chargement (install du SW).
 * Tous les chemins sont relatifs à la racine du site.
 */
export const PRECACHE = [
  "./",
  "index.html",
  "manifest.json",
  "css/styles.css",
  "js/engine.js",
  "js/geo.js",
  "js/data.js",
  "js/store.js",
  "js/i18n.js",
  "js/audio.js",
  "js/compass.js",
  "js/qr.js",
  "js/jsqr.js",
  "js/qrcode.js",
  "js/birdnet.js",
  "js/dict.js",
  "js/board.js",
  "js/app.js",
  "dashboard.html",
  "editeur.html",
  "questionnaire.html",
  "atelier.html",
  "js/challenges.js",
  "js/atelier.js",
  "docs/fiche-pedagogique-JDP_BC.pdf",
  "img/logo.svg",
  "img/logo-cemea.png",
  "img/logo-cemea-blanc.png",
  "img/icon.svg",
  "img/icon-180.png",
  "img/icon-192.png",
  "img/icon-512.png",
  "img/icon-maskable-512.png",
  "img/flags/fr.svg",
];
