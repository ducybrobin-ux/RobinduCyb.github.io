#!/usr/bin/env node
/* build-data.mjs — Génère la région « contenu » de js/data.js depuis content/
 *
 *   node tools/build-data.mjs            régénère js/data.js
 *   node tools/build-data.mjs --check    vérifie la synchro (exit 1 si obsolète)
 *
 * La région délimitée par les marqueurs DÉBUT/FIN CONTENU GÉNÉRÉ est le seul
 * endroit modifié ; SITE, TRAIL et toutes les fonctions moteur restent intacts.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  setRelBase, readJson, chargerContenu,
} from "../packages/content-schema/src/index.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "js", "data.js");
const CONTENT = path.join(ROOT, "content");
setRelBase(ROOT);

const M_DEBUT = "/* ==== DÉBUT CONTENU GÉNÉRÉ — NE PAS ÉDITER ====";
const M_FIN = "/* ==== FIN CONTENU GÉNÉRÉ ==== */";

/* ---- Régénération de la région ---- */
function regionGeneree({ decouvertes, guide, balises, themes, packsActifs }) {
  const j = (o) => JSON.stringify(o, null, 2);
  return `${M_DEBUT}
   Source de vérité : content/ (packs JSON modulaires).
   Packs actifs : ${packsActifs.join(", ")}
   Régénérer : node tools/build-data.mjs
   Vérifier la synchro : node tools/build-data.mjs --check ==== */

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

/* ---- Bundle par pack (pour l'atelier : atelier.html#content/bundles/<id>.json) ---- */
function ecrireBundles(packsCharges) {
  const dir = path.join(CONTENT, "bundles");
  fs.mkdirSync(dir, { recursive: true });
  for (const { pack, decouvertes, guide, balises } of packsCharges) {
    const bundle = { $format: "jdpbc-pack", $version: 1, pack, decouvertes, guide, balises };
    const file = path.join(dir, `${pack.id}.json`);
    fs.writeFileSync(file, JSON.stringify(bundle, null, 2) + "\n", "utf8");
    console.log("bundle :", path.relative(ROOT, file));
  }
}

const checkOnly = process.argv.includes("--check");
const src = fs.readFileSync(DATA, "utf8");
const i1 = src.indexOf(M_DEBUT);
const i2 = src.indexOf(M_FIN);
if (i1 < 0 || i2 < 0 || i2 < i1) {
  console.error("Marqueurs DÉBUT/FIN CONTENU GÉNÉRÉ introuvables dans js/data.js");
  process.exit(2);
}

const contenu = chargerContenu(CONTENT, ROOT);
const region = regionGeneree(contenu);
const nouveau = src.slice(0, i1) + region + src.slice(i2 + M_FIN.length);

if (checkOnly) {
  if (nouveau !== src) {
    console.error("js/data.js n'est pas synchronisé avec content/ — lancez : node tools/build-data.mjs");
    process.exit(1);
  }
  console.log("OK : js/data.js synchronisé avec content/",
    `(${contenu.decouvertes.length} découvertes, ${contenu.guide.length} notions, ${contenu.balises.length} balises)`);
} else {
  fs.writeFileSync(DATA, nouveau, "utf8");
  ecrireBundles(contenu.packsCharges);
  console.log("js/data.js régénéré :", 
    `${contenu.decouvertes.length} découvertes, ${contenu.guide.length} notions, ${contenu.balises.length} balises`,
    `(packs : ${contenu.packsActifs.join(", ")})`);
}
