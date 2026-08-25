/**
 * @curios/offline — Stratégies de cache pour le service worker.
 *
 * Fonctions pures testables en Node.js. Chaque fonction prend un objet
 * décrivant la requête et retourne une décision : "cache", "network",
 * ou "offline-fallback".
 */

/**
 * Détermine si la requête doit aller directement au réseau (jamais mis en cache).
 * - Appels API /api/* → toujours frais
 * - Surcharges éditeur /admin-data.json → toujours frais
 *
 * @param {string} url — URL de la requête
 * @returns {boolean} true si la requête doit contourner le cache
 */
export function shouldBypassCache(url) {
  if (url.includes("/api/")) return true;
  if (url.includes("/admin-data.json")) return true;
  return false;
}

/**
 * Stratégie de cache pour une requête GET.
 *
 * Retourne :
 * - "cache"           → utiliser caches.match(req)
 * - "network"         → aller au réseau (bypass)
 * - "offline-fallback" → retourner index.html si navigation, sinon erreur
 *
 * @param {object} params
 * @param {string} params.url     — URL de la requête
 * @param {string} params.method  — méthode HTTP
 * @param {string} params.mode    — mode de la requête ("navigate", "cors", etc.)
 * @returns {"cache"|"network"|"offline-fallback"}
 */
export function fetchStrategy({ url, method, mode }) {
  if (method !== "GET") return "network";
  if (shouldBypassCache(url)) return "network";
  return "cache";
}

/**
 * Détermine si une réponse doit être mise en cache runtime.
 * Seules les réponses OK du même origine sont cachées.
 *
 * @param {object} params
 * @param {boolean} params.ok        — resp.ok
 * @param {string}  params.url       — URL de la requête
 * @param {string}  params.origin    — origine du SW (self.location.origin)
 * @returns {boolean}
 */
export function shouldCacheRuntime({ ok, url, origin }) {
  if (!ok) return false;
  if (!url.startsWith(origin)) return false;
  return true;
}

/**
 * Gère le fallback hors-ligne pour les navigations.
 * Si la requête est une navigation et qu'on est hors-ligne,
 * retourne la réponse cache de index.html.
 *
 * @param {object}  params
 * @param {string}  params.mode      — mode de la requête
 * @param {Function} params.matchFn  — fonction cache.match (injectable pour les tests)
 * @param {string}  params.fallback  — URL de fallback (défaut : "index.html")
 * @returns {Promise<Response|undefined>}
 */
export async function offlineFallback({ mode, matchFn, fallback = "index.html" }) {
  if (mode === "navigate") {
    return matchFn(fallback);
  }
  return undefined;
}

/**
 * Filtre les anciens caches à supprimer lors de l'activation.
 * Conserve uniquement les caches CACHE et RUNTIME.
 *
 * @param {string[]} keys     — liste des noms de cache existants
 * @param {string}   current  — cache principal à conserver
 * @param {string}   runtime  — cache runtime à conserver
 * @returns {string[]} noms de caches à supprimer
 */
export function cachesToDelete(keys, current, runtime) {
  return keys.filter((k) => k !== current && k !== runtime);
}
