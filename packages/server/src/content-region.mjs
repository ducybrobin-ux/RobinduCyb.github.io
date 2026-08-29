/* content-region.mjs — Régénération de la région « contenu » de js/data.js
 *
 * Miroir serveur de tools/build-data.mjs : recompile SITE/TRAIL/BIRDS/GUIDE/
 * BALISES/THEMES dans js/data.js d'après content/manifest.json (packs actifs)
 * + content/config. Utilisé par POST /api/packs/activate.
 */
import fs from "node:fs";
import path from "node:path";
import {
  setRelBase,
  readJson,
  chargerContenu,
} from "../../content-schema/src/index.js";

const M_DEBUT = "/* ==== DÉBUT CONTENU GÉNÉRÉ — NE PAS ÉDITER ====";
const M_FIN = "/* ==== FIN CONTENU GÉNÉRÉ ==== */";

function regionGeneree({ decouvertes, guide, balises, themes, packsActifs, site, trail }) {
  const j = (o) => JSON.stringify(o, null, 2);
  return `${M_DEBUT}
   Source de vérité : content/ (config + packs JSON modulaires).
   Packs actifs : ${packsActifs.join(", ")}
   Régénérer : node tools/build-data.mjs
   Vérifier la synchro : node tools/build-data.mjs --check ==== */

const SITE = ${j(site)};

const TRAIL = ${j(trail)};

const BIRDS = ${j(decouvertes)};

const GUIDE = ${j(guide)};

const BALISES = ${j(balises)};

const DIFFICULTIES = [
  { id: "facile", label: "Facile" },
  { id: "moyen", label: "Moyen" },
  { id: "difficile", label: "Difficile" },
];

/* Thèmes visuels sélectionnables dans Réglages (content/themes/) */
const THEMES = ${j(themes)};
${M_FIN}`;
}

/** Réécrit js/data.js depuis content/. Retourne un résumé. Lève si erreur. */
export function regenererDataJs(root) {
  setRelBase(root);
  const DATA = path.join(root, "js", "data.js");
  const CONTENT = path.join(root, "content");

  const src = fs.readFileSync(DATA, "utf8");
  const i1 = src.indexOf(M_DEBUT);
  const i2 = src.indexOf(M_FIN);
  if (i1 < 0 || i2 < 0 || i2 < i1) {
    throw new Error("Marqueurs DÉBUT/FIN CONTENU GÉNÉRÉ introuvables dans js/data.js");
  }

  const contenu = chargerContenu(CONTENT, root);
  const site = readJson(path.join(CONTENT, "config", "site.json"), root);
  const trail = readJson(path.join(CONTENT, "config", "trail.json"), root);
  const region = regionGeneree({ ...contenu, site, trail });
  const nouveau = src.slice(0, i1) + region + src.slice(i2 + M_FIN.length);
  fs.writeFileSync(DATA, nouveau, "utf8");

  return {
    decouvertes: contenu.decouvertes.length,
    guide: contenu.guide.length,
    balises: contenu.balises.length,
    packsActifs: contenu.packsActifs,
    bundles: contenu.packsCharges.map((p) => p.pack.id),
  };
}
