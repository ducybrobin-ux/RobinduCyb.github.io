 /* packs.js — Liste des packs installés (Pack Manager, Phase 3, tranche A).
 *
 * GET /api/packs : renvoie la liste des packs présents sur le serveur avec
 *   leur état, leurs métadonnées (curios-parcours) et des compteurs.
 *
 * Lecture seule : aucune écriture fichier. Les actions d'activation /
 *   import / export / désactivation arrivent dans une tranche ultérieure.
 *   Zéro dépendance externe.
 */
import fs from "node:fs";
import path from "node:path";
import { sendJson, sendError, sendOk, readBody, parseJson } from "../http.js";
import { regenererDataJs } from "../content-region.mjs";

export const PACK_STATES = {
  ACTIVE: "ACTIVE",
  DISABLED: "DISABLED",
  AVAILABLE: "AVAILABLE",
  ERROR: "ERROR",
};

/** Lis un JSON en retournant null en cas d'erreur (ne bloque pas la liste). */
function readJsonSafe(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

/** État d'un pack selon sa déclaration dans manifest.json. */
function statePour(id, manifestPacks) {
  const entry = manifestPacks ? manifestPacks.find((p) => p && p.id === id) : null;
  if (entry && entry.actif) return PACK_STATES.ACTIVE;
  if (entry) return PACK_STATES.DISABLED;
  return PACK_STATES.AVAILABLE;
}

export function handlePacks(method, req, res, state) {
  if (method !== "GET") {
    return sendJson(res, 405, { ok: false, error: "method-not-allowed" });
  }

  const packsDir = path.join(state.root, "content", "packs");
  const parcoursDir = path.join(state.root, "content", "curios-parcours");
  const manifestFile = path.join(state.root, "content", "manifest.json");
  const problems = [];

  const manifest = readJsonSafe(manifestFile);
  const manifestPacks = Array.isArray(manifest && manifest.packs) ? manifest.packs : [];

  const packs = [];
  const ids = new Set();

  // Packs déclarés dans le manifest mais absents du disque
  for (const entry of manifestPacks) {
    if (!entry || !entry.id) continue;
    if (!fs.existsSync(path.join(packsDir, entry.id, "pack.json")) &&
        !fs.existsSync(path.join(parcoursDir, `${entry.id}.json`))) {
      problems.push(`Pack « ${entry.id} » déclaré dans manifest.json mais introuvable sur le disque.`);
    }
  }

  // Scan des packs installés dans content/packs/
  if (fs.existsSync(packsDir)) {
    for (const id of fs.readdirSync(packsDir).sort()) {
      const idDir = path.join(packsDir, id);
      if (!fs.statSync(idDir).isDirectory()) continue;
      const packJson = readJsonSafe(path.join(idDir, "pack.json"));
      ids.add(id);

      // Métadonnées riches (universel) si disponibles
      const parcours = readJsonSafe(path.join(parcoursDir, `${id}.json`));

      packs.push({
        id,
        name: (parcours && parcours.title) || (packJson && packJson.nom) || id,
        description: (parcours && parcours.description) || (packJson && packJson.description) || "",
        version: (parcours && parcours["$version"]) || (packJson && packJson.version) || null,
        format: (parcours && parcours["$format"]) || "jdpbc-pack",
        author: (parcours && parcours.metadata && parcours.metadata.author) || (packJson && packJson.author) || "",
        organization: (parcours && parcours.metadata && parcours.metadata.organization) || "",
        language: (parcours && parcours.metadata && parcours.metadata.language) || "",
        audience: (parcours && parcours.audience) || (packJson && packJson.ages) || null,
        duration: (parcours && parcours.duration) || null,
        stations: (parcours && Array.isArray(parcours.stations)) ? parcours.stations.length : null,
        missions: (parcours && Array.isArray(parcours.missions)) ? parcours.missions.length : null,
        theme: (parcours && parcours.theme) || (packJson && packJson.theme) || "",
        state: statePour(id, manifestPacks),
        actif: manifestPacks.some((p) => p && p.id === id && p.actif),
      });
    }
  }

  // Packs "curios-parcours" présents mais pas installés en content/packs (incohérence)
  if (fs.existsSync(parcoursDir)) {
    for (const f of fs.readdirSync(parcoursDir).filter((x) => x.endsWith(".json"))) {
      const id = f.replace(/\.json$/, "");
      if (ids.has(id)) continue;
      const parcours = readJsonSafe(path.join(parcoursDir, f));
      packs.push({
        id,
        name: (parcours && parcours.title) || id,
        description: (parcours && parcours.description) || "",
        version: parcours && parcours["$version"],
        format: (parcours && parcours["$format"]) || "curios-parcours",
        author: (parcours && parcours.metadata && parcours.metadata.author) || "",
        organization: (parcours && parcours.metadata && parcours.metadata.organization) || "",
        language: (parcours && parcours.metadata && parcours.metadata.language) || "",
        audience: (parcours && parcours.audience) || null,
        duration: (parcours && parcours.duration) || null,
        stations: (parcours && Array.isArray(parcours.stations)) ? parcours.stations.length : null,
        missions: (parcours && Array.isArray(parcours.missions)) ? parcours.missions.length : null,
        theme: (parcours && parcours.theme) || "",
        state: statePour(id, manifestPacks),
        actif: manifestPacks.some((p) => p && p.id === id && p.actif),
        notInstalled: true,
      });
      ids.add(id);
    }
  }

  packs.sort((a, b) => (a.name || a.id).localeCompare(b.name || b.id));

  return sendJson(res, 200, {
    ok: true,
    total: packs.length,
    states: {
      active: packs.filter((p) => p.state === PACK_STATES.ACTIVE).length,
      disabled: packs.filter((p) => p.state === PACK_STATES.DISABLED).length,
      available: packs.filter((p) => p.state === PACK_STATES.AVAILABLE).length,
      error: packs.filter((p) => p.state === PACK_STATES.ERROR).length,
    },
    packs,
    problems,
    version: "1",
  });
}

/** Écrit content/manifest.json en activant un seul pack (id) et en
 *  désactivant les autres. Retourne false si le pack n'existe pas sur disque. */
function ecrireManifestActif(root, id) {
  const packsDir = path.join(root, "content", "packs");
  const parcoursDir = path.join(root, "content", "curios-parcours");
  const packDir = path.join(packsDir, id);
  const estInstalle =
    fs.existsSync(path.join(packDir, "pack.json")) ||
    fs.existsSync(path.join(parcoursDir, `${id}.json`));
  if (!estInstalle) return { ok: false, error: `pack-introuvable:${id}` };

  const manifestFile = path.join(root, "content", "manifest.json");
  const manifest = (() => {
    try { return JSON.parse(fs.readFileSync(manifestFile, "utf8")); } catch { return { version: 1 }; }
  })();
  const packs = Array.isArray(manifest.packs) ? manifest.packs : [];
  const vus = new Set();
  const liste = packs.map((p) => {
    if (!p || !p.id) return p;
    vus.add(p.id);
    return { id: p.id, actif: p.id === id };
  });
  if (!vus.has(id)) liste.push({ id, actif: true });
  manifest.packs = liste;
  fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)  }\n`, "utf8");
  return { ok: true };
}

/** POST /api/packs/activate — active un pack dans content/manifest.json puis
 *  régénère js/data.js (région contenu) pour que toutes les tablettes
 *  servent le même parcours. Protégé (organisateur). */
export async function handlePacksActivate(method, req, res, state, auth, hubAuth) {
  if (method !== "POST") return sendError(res, 405, "method-not-allowed");
  const hubUser = hubAuth && hubAuth.requireAuth(req, res);
  const organizerOk = auth && auth.requireAuth(req, res);
  if (!hubUser && !organizerOk) return sendError(res, 401, "unauthorized");
  if (hubUser && !["ADMIN", "PROJECT_MANAGER"].includes(hubUser.role)) {
    return sendError(res, 403, "forbidden");
  }
  const body = parseJson(await readBody(req));
  const id = body && typeof body.id === "string" ? body.id.trim() : "";
  if (!id) return sendError(res, 400, "id requis");

  const r = ecrireManifestActif(state.root, id);
  if (!r.ok) return sendError(res, 404, r.error);

  let regen;
  try {
    regen = regenererDataJs(state.root);
  } catch (e) {
    return sendError(res, 500, `regeneration-failed:${e.message}`);
  }
  return sendOk(res, { id, state: "ACTIVE", regenerated: regen });
}

/** GET /api/packs/:id — renvoie le bundle du pack (pack.json + balises +
 *  découvertes + guide) pour affichage des détails côté client. */
export function handlePacksDetail(method, req, res, state, id) {
  if (method !== "GET") return sendError(res, 405, "method-not-allowed");
  const safe = String(id || "").replace(/[^a-z0-9_-]/gi, "");
  const dir = path.join(state.root, "content", "packs", safe);
  if (!fs.existsSync(path.join(dir, "pack.json"))) {
    return sendError(res, 404, "pack-introuvable");
  }
  try {
    const pack = JSON.parse(fs.readFileSync(path.join(dir, "pack.json"), "utf8"));
    const lire = (sub) => {
      const subdir = path.join(dir, sub);
      if (!fs.existsSync(subdir)) return [];
      return fs.readdirSync(subdir).filter((f) => f.endsWith(".json")).sort()
        .map((f) => JSON.parse(fs.readFileSync(path.join(subdir, f), "utf8")));
    };
    const bundle = {
      $format: "jdpbc-pack",
      $version: 1,
      pack,
      decouvertes: lire("decouvertes"),
      guide: lire("guide"),
      balises: lire("balises"),
    };
    return sendOk(res, { id: safe, bundle });
  } catch (e) {
    return sendError(res, 500, `lecture-échec:${e.message}`);
  }
}
