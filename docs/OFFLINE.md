# OFFLINE.md — Module `@curios/offline`

> Stratégies de cache pour le service worker.
> Fonctions pures testables en Node.js.
> 23 tests unitaires.

---

## Vue d'ensemble

Le module gère le **mode hors-ligne** via un service worker. Il décide quoi mettre en cache, quand aller au réseau, et comment gérer les navigations hors-ligne.

---

## Configuration

| Constante | Valeur | Rôle |
|-----------|--------|------|
| `VERSION` | `"curios-v1"` | Bumpé à chaque déploiement |
| `CACHE` | `"curios-core-v1"` | Cache principal (précaché) |
| `RUNTIME` | `"curios-runtime-v1"` | Cache de secours (rempli au fil des navigations) |
| `PRECACHE` | `string[]` | Fichiers précachés au install |

---

## API

### `shouldBypassCache(url): boolean`

Détermine si la requête doit aller directement au réseau.

**Règles** :
- `/api/*` → toujours frais
- `/admin-data.json` → toujours frais

```js
shouldBypassCache("/api/board")      // true
shouldBypassCache("/index.html")     // false
```

---

### `fetchStrategy({ url, method, mode }): string`

Stratégie de cache pour une requête GET.

**Retour** :
- `"cache"` → utiliser le cache
- `"network"` → aller au réseau
- `"offline-fallback"` → retourner index.html si navigation

```js
fetchStrategy({ url: "/api/board", method: "GET" })  // "network"
fetchStrategy({ url: "/index.html", method: "GET" })  // "cache"
fetchStrategy({ url: "/data.json", method: "POST" })  // "network"
```

---

### `shouldCacheRuntime({ ok, url, origin }): boolean`

Détermine si une réponse doit être mise en cache runtime.

**Règles** :
- Réponse OK
- Même origine

```js
shouldCacheRuntime({ ok: true, url: "http://localhost/index.html", origin: "http://localhost" })
// true
```

---

### `offlineFallback({ mode, matchFn, fallback? }): Promise<Response>`

Gère le fallback hors-ligne pour les navigations.

**Paramètres** :
- `mode` : mode de la requête
- `matchFn` : fonction `cache.match` (injectable)
- `fallback` : URL de fallback (défaut : `"index.html"`)

```js
// En navigation hors-ligne
await offlineFallback({
  mode: "navigate",
  matchFn: (url) => caches.match(url)
});
// → Response de index.html depuis le cache
```

---

### `cachesToDelete(keys, current, runtime): string[]`

Filtre les anciens caches à supprimer.

```js
cachesToDelete(
  ["curios-core-v1", "curios-runtime-v1", "old-cache"],
  "curios-core-v1",
  "curios-runtime-v1"
);
// → ["old-cache"]
```

---

## Service Worker (`sw.js`)

Le SW utilise les fonctions du module :

```js
import { VERSION, CACHE, RUNTIME, PRECACHE } from "./packages/offline/src/config.js";
import { fetchStrategy, shouldBypassCache, offlineFallback, cachesToDelete }
  from "./packages/offline/src/strategy.js";

// Install : précaché
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE))
  );
});

// Activate : supprime les anciens caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      cachesToDelete(keys, CACHE, RUNTIME)
    ).then((toDelete) =>
      Promise.all(toDelete.map((k) => caches.delete(k)))
    )
  );
});

// Fetch : stratégie de cache
self.addEventListener("fetch", (event) => {
  const { url, method, mode } = event.request;
  const strategy = fetchStrategy({ url, method, mode });

  if (strategy === "cache") {
    event.respondWith(caches.match(event.request));
  } else if (strategy === "offline-fallback") {
    event.respondWith(offlineFallback({
      mode,
      matchFn: (url) => caches.match(url)
    }));
  }
  // "network" → la requête passe au réseau
});
```

---

## Tests

```bash
node --test tests/unit/offline.test.mjs
```

**23 tests** couvrant les 5 fonctions.
