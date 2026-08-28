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
import { sendJson } from "../http.js";

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
