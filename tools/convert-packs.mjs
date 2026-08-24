#!/usr/bin/env node
/* convert-packs.mjs — Convertit les packs historiques vers le format universel
 * « ducyb-parcours » v1 (voir docs/DATA_MODEL.md).
 *
 *   node tools/convert-packs.mjs            convertit tous les packs du manifest → content/ducyb-parcours/<id>.json
 *   node tools/convert-packs.mjs --check    vérifie que les fichiers sont à jour (exit 1 sinon)
 *
 * Chaque conversion est contrôlée : couverture totale (aucune entité perdue)
 * + validation structurelle du document produit.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  setRelBase, readJson, chargerPack, chargerThemes,
  parcoursFromPack, verifierCouverture, validateParcours,
} from "../packages/content-schema/src/index.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");
const OUT = path.join(CONTENT, "ducyb-parcours");
setRelBase(ROOT);

const checkOnly = process.argv.includes("--check");
const manifest = readJson(path.join(CONTENT, "manifest.json"), ROOT);
fs.mkdirSync(OUT, { recursive: true });

let failures = 0;
const produits = [];

for (const entry of manifest.packs) {
  const dir = path.join(CONTENT, "packs", entry.id);
  const src = chargerPack(dir, ROOT);           // validation héritée complète
  const doc = parcoursFromPack(src);

  const errs = [
    ...verifierCouverture(src, doc),
    ...validateParcours(doc),
  ];
  if (errs.length) {
    console.error(`✗ ${entry.id} :`);
    for (const e of errs) console.error(`   - ${e}`);
    failures++;
    continue;
  }

  const json = JSON.stringify(doc, null, 2) + "\n";
  const file = path.join(OUT, `${entry.id}.json`);

  if (checkOnly) {
    if (!fs.existsSync(file) || fs.readFileSync(file, "utf8") !== json) {
      console.error(`✗ ${path.relative(ROOT, file)} obsolète — lancez : node tools/convert-packs.mjs`);
      failures++;
    } else {
      console.log(`OK ${path.relative(ROOT, file)} (${doc.stations.length} stations, ${doc.missions.length} missions, ${doc.characters.length} personnages)`);
    }
  } else {
    fs.writeFileSync(file, json, "utf8");
    console.log(`converti : ${path.relative(ROOT, file)} (${doc.stations.length} stations, ${doc.missions.length} missions, ${doc.characters.length} personnages, ${doc.pedagogy.competencies.length} notions)`);
    produits.push(entry.id);
  }
}

if (!checkOnly && produits.length) {
  /* Les thèmes restent partagés entre parcours (non convertis en v1). */
  const themes = chargerThemes(CONTENT, ROOT);
  console.log(`thèmes partagés non convertis (v1) : ${themes.map((t) => t.id).join(", ")}`);
}

if (failures) {
  console.error(`${failures} pack(s) en échec`);
  process.exit(1);
}
console.log(checkOnly ? `OK : ${manifest.packs.length}/${manifest.packs.length} parcours à jour` : "conversion terminée sans perte");
