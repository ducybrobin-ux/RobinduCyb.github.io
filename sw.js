/* =========================================================
   JDP — Service worker
   Mode hors-ligne : toutes les données (cartes, sons,
   fiches) sont mises en cache au premier chargement sur le
   Wi-Fi du site, puis disponibles en zone blanche.
   ========================================================= */

const VERSION = "jdpbc-v7";
const CACHE = "jdpbc-core-v7";
const RUNTIME = "jdpbc-runtime-v7";

const PRECACHE = [
  "./",
  "index.html",
  "manifest.json",
  "css/styles.css",
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

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((k) => k !== CACHE && k !== RUNTIME)
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "CACHE") {
    e.waitUntil(
      caches.open(CACHE).then((c) => c.addAll(PRECACHE))
    );
  }
  if (e.data && e.data.type === "SKIP_WAITING") {
    e.waitUntil(self.skipWaiting());
  }
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;

  // Les appels API doivent toujours être frais : jamais mis en cache.
  if (req.url.includes("/api/")) {
    e.respondWith(fetch(req).catch(() => Response.error()));
    return;
  }

  // Les surcharges éditeur doivent toujours être fraîches.
  if (req.url.includes("/admin-data.json")) {
    e.respondWith(fetch(req, { cache: "no-store" }).catch(() => Response.error()));
    return;
  }

  // Stratégie : cache d'abord, réseau en secours (offline-first).
  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((resp) => {
          if (resp && resp.ok && req.url.startsWith(self.location.origin)) {
            const copy = resp.clone();
            caches.open(RUNTIME).then((c) => c.put(req, copy));
          }
          return resp;
        })
        .catch(() => {
          // Navigation hors-ligne : retour à l'accueil.
          if (req.mode === "navigate") return caches.match("index.html");
          return Response.error();
        });
    })
  );
});
