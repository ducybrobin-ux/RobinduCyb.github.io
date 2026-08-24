#!/usr/bin/env node
/* validate-parcours.mjs — Valide tous les documents « ducyb-parcours » v1 :
 *   - content/ducyb-parcours/*.json  (convertis depuis les packs historiques)
 *   - content/examples/*.json        (exemples canoniques)
 *
 *   node tools/validate-parcours.mjs [fichiers...]   exit 1 si invalide
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateParcours } from "../packages/content-schema/src/index.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");

function fichiers(args) {
  if (args.length) return args.map((a) => path.resolve(a));
  const dirs = ["ducyb-parcours", "examples"];
  const out = [];
  for (const d of dirs) {
    const p = path.join(CONTENT, d);
    if (!fs.existsSync(p)) continue;
    out.push(...fs.readdirSync(p).filter((f) => f.endsWith(".json")).sort().map((f) => path.join(p, f)));
  }
  return out;
}

const files = fichiers(process.argv.slice(2));
if (!files.length) {
  console.error("aucun document ducyb-parcours à valider");
  process.exit(2);
}

let failures = 0;
for (const f of files) {
  let doc = null;
  try {
    doc = JSON.parse(fs.readFileSync(f, "utf8"));
  } catch (e) {
    console.error(`✗ ${path.relative(ROOT, f)} : JSON invalide (${e.message})`);
    failures++;
    continue;
  }
  const errs = validateParcours(doc);
  if (errs.length) {
    console.error(`✗ ${path.relative(ROOT, f)} :`);
    for (const e of errs) console.error(`   - ${e}`);
    failures++;
  } else {
    console.log(`OK ${path.relative(ROOT, f)} (${doc.stations?.length ?? 0} stations, ${doc.missions?.length ?? 0} missions)`);
  }
}

if (failures) {
  console.error(`${failures} document(s) invalide(s)`);
  process.exit(1);
}
console.log(`OK : ${files.length} parcours valides`);
