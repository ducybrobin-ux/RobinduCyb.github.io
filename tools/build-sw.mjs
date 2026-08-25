#!/usr/bin/env node
/**
 * build-sw.mjs — génère sw.js (service worker) depuis packages/offline.
 * Usage : node tools/build-sw.mjs [--check]
 *
 * Le service worker doit rester un fichier unique (pas d'imports ESM).
 * On génère un IIFE qui contient la config + les event handlers.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "sw.js");
const CHECK = process.argv.includes("--check");

/* ---------- Config depuis packages/offline/src/config.js ---------- */
import { VERSION, CACHE, RUNTIME, PRECACHE } from "../packages/offline/src/config.js";

/* ---------- Stratégies depuis packages/offline/src/strategy.js ---------- */
import { shouldBypassCache, shouldCacheRuntime, cachesToDelete } from "../packages/offline/src/strategy.js";

/* ---------- Génération ---------- */

const precacheItems = PRECACHE.map((p) => `  "${p}"`).join(",\n");

const out = `/* =========================================================
   Curi🧭s — Service worker
   Généré par tools/build-sw.mjs — NE PAS ÉDITER MANUELLEMENT.
   Source : packages/offline/src/{config,strategy}.js
   ========================================================= */

const VERSION = "${VERSION}";
const CACHE = "${CACHE}";
const RUNTIME = "${RUNTIME}";

const PRECACHE = [
${precacheItems},
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
`;

if (CHECK) {
  const old = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  if (old !== out) {
    console.error("[build-sw] Fichier obsolète. Lance `node tools/build-sw.mjs` pour le régénérer.");
    process.exit(1);
  }
  console.log("[build-sw] sw.js est à jour.");
} else {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, out, "utf8");
  console.log("[build-sw] Généré sw.js (" + out.length + " octets).");
}
