/* sw-patch.js — Fichiers à ajouter au PRECACHE dans build-sw.mjs
 *
 * Ajouter ces fichiers au tableau PRECACHE dans tools/build-sw.mjs
 */

const HUB_PRECACHE = [
  "index.html",
  "curios.html",
  "contact.html",
  "documentation.html",
  "hub/login.html",
  "hub/app.html",
  "css/hub.css",
  "css/public.css",
  "js/hub-auth.js",
  "js/hub-shell.js",
  "js/hub-pages/dashboard.js",
  "img/logo.svg",
  "img/icon.svg",
];

/* ============================================================
   INTEGRATION DANS build-sw.mjs
   ============================================================

   1. Ouvrir tools/build-sw.mjs

   2. Ajouter les fichiers hub au tableau PRECACHE :

      const PRECACHE = [
        // ... fichiers existants ...
        ...HUB_PRECACHE,
      ];

   3. OU ajouter manuellement chaque fichier :

      "index.html",
      "curios.html",
      "contact.html",
      "documentation.html",
      "hub/login.html",
      "hub/app.html",
      "css/hub.css",
      "css/public.css",
      "js/hub-auth.js",
      "js/hub-shell.js",
      "js/hub-pages/dashboard.js",

   ============================================================ */
