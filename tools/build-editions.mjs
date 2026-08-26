#!/usr/bin/env node
/* build-editions.mjs — Valide et liste les éditions Curios
 *
 *   node tools/build-editions.mjs            liste les éditions valides
 *   node tools/build-editions.mjs --check    vérifie la validité (exit 1 si erreur)
 *   node tools/build-editions.mjs --id X     valide une édition spécifique
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const EDITIONS_DIR = path.join(ROOT, "content", "editions");

/* ---- Validation d'une édition ---- */
function validateEdition(doc) {
  const errs = [];
  const err = (m) => errs.push(m);

  if (doc.$format !== "curios-edition") err(`$format attendu "curios-edition", reçu "${doc.$format}"`);
  if (doc.$version !== 1) err(`$version 1 attendue, reçue ${doc.$version}`);
  if (!doc.id) err("id requis");
  if (!doc.name) err("name requis");

  /* branding */
  if (doc.branding) {
    if (!doc.branding.themeColor) err("branding.themeColor requis");
    if (!doc.branding.swPrefix) err("branding.swPrefix requis");
  } else {
    err("bloc branding requis");
  }

  /* packs */
  if (!Array.isArray(doc.packs) || doc.packs.length === 0) {
    err("packs[] requis et non vide");
  } else {
    for (const p of doc.packs) {
      if (!p.id) err("pack sans id");
      if (typeof p.actif !== "boolean") err(`pack ${p.id} : actif requis (boolean)`);
    }
  }

  /* site (optionnel mais recommandé) */
  if (doc.site) {
    if (!doc.site.center) err("site.center requis");
    else {
      if (typeof doc.site.center.lat !== "number") err("site.center.lat requis (number)");
      if (typeof doc.site.center.lng !== "number") err("site.center.lng requis (number)");
    }
  }

  return errs;
}

/* ---- Main ---- */
const checkOnly = process.argv.includes("--check");
const specificId = process.argv.includes("--id")
  ? process.argv[process.argv.indexOf("--id") + 1]
  : null;

if (!fs.existsSync(EDITIONS_DIR)) {
  console.error("Dossier content/editions/ introuvable");
  process.exit(2);
}

const files = fs.readdirSync(EDITIONS_DIR).filter((f) => f.endsWith(".json"));
if (files.length === 0) {
  console.error("Aucun fichier .json dans content/editions/");
  process.exit(2);
}

let hasErrors = false;
const editions = [];

for (const file of files) {
  const filePath = path.join(EDITIONS_DIR, file);
  try {
    const raw = fs.readFileSync(filePath, "utf8");
    const doc = JSON.parse(raw);

    if (specificId && doc.id !== specificId) continue;

    const errs = validateEdition(doc);
    if (errs.length > 0) {
      hasErrors = true;
      console.error(`❌ ${file} :`);
      for (const e of errs) console.error(`   - ${e}`);
    } else {
      editions.push(doc);
      if (!checkOnly) {
        console.log(`✅ ${doc.id} — ${doc.name} (${doc.packs.length} pack(s))`);
      }
    }
  } catch (e) {
    hasErrors = true;
    console.error(`❌ ${file} : JSON invalide — ${e.message}`);
  }
}

if (checkOnly || specificId) {
  if (hasErrors) {
    console.error(`\nÉchec : ${editions.length} édition(s) valide(s) sur ${files.length}`);
    process.exit(1);
  } else {
    console.log(`OK : ${editions.length} édition(s) valide(s)`);
    for (const e of editions) {
      console.log(`  - ${e.id} — ${e.name}`);
      console.log(`    Packs : ${e.packs.map((p) => p.id).join(", ")}`);
      console.log(`    Thèmes : ${(e.themes || []).join(", ") || "defaut"}`);
      if (e.site) console.log(`    Centre GPS : ${e.site.center.lat}, ${e.site.center.lng}`);
    }
  }
} else {
  console.log(`\n${editions.length} édition(s) valide(s) :`);
  for (const e of editions) {
    console.log(`  - ${e.id} — ${e.name}`);
  }
}
