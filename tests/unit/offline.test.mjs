/**
 * Tests unitaires — @curios/offline
 * Stratégies de cache et fonctions de service worker.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  VERSION, CACHE, RUNTIME,
  shouldBypassCache, fetchStrategy, shouldCacheRuntime,
  offlineFallback, cachesToDelete,
} from "../../packages/offline/src/index.js";

/* ================================================================
   CONFIG
   ================================================================ */
describe("config", () => {
  it("VERSION est une chaîne non vide", () => {
    assert.ok(typeof VERSION === "string" && VERSION.length > 0);
  });

  it("CACHE et RUNTIME sont distincts", () => {
    assert.notEqual(CACHE, RUNTIME);
  });
});

/* ================================================================
   shouldBypassCache
   ================================================================ */
describe("shouldBypassCache", () => {
  it("/api/... → bypass", () => {
    assert.equal(shouldBypassCache("http://localhost/api/board"), true);
    assert.equal(shouldBypassCache("http://localhost/api/answer"), true);
  });

  it("/admin-data.json → bypass", () => {
    assert.equal(shouldBypassCache("http://localhost/admin-data.json"), true);
  });

  it("fichier normal → pas de bypass", () => {
    assert.equal(shouldBypassCache("http://localhost/js/app.js"), false);
    assert.equal(shouldBypassCache("http://localhost/index.html"), false);
    assert.equal(shouldBypassCache("http://localhost/css/styles.css"), false);
  });

  it("URL vide → pas de bypass", () => {
    assert.equal(shouldBypassCache(""), false);
  });
});

/* ================================================================
   fetchStrategy
   ================================================================ */
describe("fetchStrategy", () => {
  it("POST → network", () => {
    assert.equal(fetchStrategy({ url: "/api/answer", method: "POST", mode: "cors" }), "network");
  });

  it("GET /api/... → network", () => {
    assert.equal(fetchStrategy({ url: "/api/board", method: "GET", mode: "cors" }), "network");
  });

  it("GET /admin-data.json → network", () => {
    assert.equal(fetchStrategy({ url: "/admin-data.json", method: "GET", mode: "navigate" }), "network");
  });

  it("GET normal → cache", () => {
    assert.equal(fetchStrategy({ url: "/js/app.js", method: "GET", mode: "cors" }), "cache");
  });

  it("GET index.html → cache", () => {
    assert.equal(fetchStrategy({ url: "/index.html", method: "GET", mode: "navigate" }), "cache");
  });
});

/* ================================================================
   shouldCacheRuntime
   ================================================================ */
describe("shouldCacheRuntime", () => {
  const origin = "http://localhost";

  it("réponse OK du même origine → cache", () => {
    assert.equal(shouldCacheRuntime({ ok: true, url: "http://localhost/js/app.js", origin }), true);
  });

  it("réponse non-OK → pas de cache", () => {
    assert.equal(shouldCacheRuntime({ ok: false, url: "http://localhost/js/app.js", origin }), false);
  });

  it("réponse d'un autre origine → pas de cache", () => {
    assert.equal(shouldCacheRuntime({ ok: true, url: "https://cdn.example.com/lib.js", origin }), false);
  });
});

/* ================================================================
   offlineFallback
   ================================================================ */
describe("offlineFallback", () => {
  it("navigation → retourne index.html via matchFn", async () => {
    let calledWith = null;
    const matchFn = (url) => { calledWith = url; return "response-ok"; };
    const result = await offlineFallback({ mode: "navigate", matchFn });
    assert.equal(calledWith, "index.html");
    assert.equal(result, "response-ok");
  });

  it("navigation avec fallback personnalisé", async () => {
    let calledWith = null;
    const matchFn = (url) => { calledWith = url; return "ok"; };
    await offlineFallback({ mode: "navigate", matchFn, fallback: "offline.html" });
    assert.equal(calledWith, "offline.html");
  });

  it("requête non-navigate → undefined", async () => {
    const matchFn = () => "ne devrait pas être appelé";
    const result = await offlineFallback({ mode: "cors", matchFn });
    assert.equal(result, undefined);
  });
});

/* ================================================================
   cachesToDelete
   ================================================================ */
describe("cachesToDelete", () => {
  it("supprime les anciens caches", () => {
    const keys = ["old-v1", "curios-core-v1", "curios-runtime-v1", "ancien-v2"];
    const toDelete = cachesToDelete(keys, "curios-core-v1", "curios-runtime-v1");
    assert.deepEqual(toDelete.sort(), ["ancien-v2", "old-v1"]);
  });

  it("rien à supprimer si seuls les caches courants existent", () => {
    const keys = ["curios-core-v1", "curios-runtime-v1"];
    assert.deepEqual(cachesToDelete(keys, "curios-core-v1", "curios-runtime-v1"), []);
  });

  it("liste vide → rien à supprimer", () => {
    assert.deepEqual(cachesToDelete([], "a", "b"), []);
  });
});
