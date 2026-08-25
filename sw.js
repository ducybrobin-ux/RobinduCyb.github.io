/* =========================================================
   Curi🧭s — Service worker
   Généré par tools/build-sw.mjs — NE PAS ÉDITER MANUELLEMENT.
   Source : packages/offline/src/{config,strategy}.js
   ========================================================= */

const VERSION = "curios-v1";
const CACHE = "curios-core-v1";
const RUNTIME = "curios-runtime-v1";

const PRECACHE = [
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
        cachesToDelete(keys, CACHE, RUNTIME).map((k) => caches.delete(k))
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

  if (shouldBypassCache(req.url)) {
    e.respondWith(fetch(req).catch(() => Response.error()));
    return;
  }

  e.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((resp) => {
          if (shouldCacheRuntime({ ok: resp.ok, url: req.url, origin: self.location.origin })) {
            const copy = resp.clone();
            caches.open(RUNTIME).then((c) => c.put(req, copy));
          }
          return resp;
        })
        .catch(() => {
          if (req.mode === "navigate") return caches.match("index.html");
          return Response.error();
        });
    })
  );
});
