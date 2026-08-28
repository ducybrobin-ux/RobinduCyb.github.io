/* =========================================================
   Curi🧭s — Service worker
   Généré par tools/build-sw.mjs — NE PAS ÉDITER MANUELLEMENT.
   Source : packages/offline/src/{config,strategy}.js
   ========================================================= */

const VERSION = "curios-v3";
const CACHE = "curios-core-v3";
const RUNTIME = "curios-runtime-v3";

const PRECACHE = [
  "./",
  "atelier.html",
  "css/curios-design-system.css",
  "css/curios-tokens.css",
  "css/styles.css",
  "dashboard.html",
  "debriefing.html",
  "docs/design-system-preview.html",
  "docs/fiche-pedagogique-JDP_BC.pdf",
  "editeur.html",
  "img/flags/fr.svg",
  "img/icon-180.png",
  "img/icon-192.png",
  "img/icon-512.png",
  "img/icon-maskable-512.png",
  "img/icon.svg",
  "img/logo.svg",
  "img/qrcode-localhost.png",
  "index.html",
  "js/app.js",
  "js/atelier.js",
  "js/audio.js",
  "js/birdnet.js",
  "js/board.js",
  "js/challenges.js",
  "js/compass.js",
  "js/dashboard.js",
  "js/data.js",
  "js/declination.js",
  "js/dict.js",
  "js/editeur.js",
  "js/engine-helpers.js",
  "js/engine.js",
  "js/game-flow.js",
  "js/geo.js",
  "js/i18n.js",
  "js/jsqr.js",
  "js/qr.js",
  "js/qrcode.js",
  "js/questionnaire.js",
  "js/router.js",
  "js/screens/bird.js",
  "js/screens/god.js",
  "js/screens/guide.js",
  "js/screens/palmares.js",
  "js/services/compass-ui.js",
  "js/store.js",
  "manifest.json",
  "questionnaire.html",
  "studio.html",
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
