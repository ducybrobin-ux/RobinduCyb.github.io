#!/usr/bin/env node
/* import-pack.mjs — Installe un bundle exporté par l'atelier (atelier.html)
 *
 *   node tools/import-pack.mjs mon-pack.jdpbc.json [--actif] [--id=nouvel-id]
 *
 * - Valide le bundle (mêmes règles que build-data.mjs)
 * - Éclate le bundle en fichiers : content/packs/<id>/pack.json,
 *   decouvertes/NN-<id>.json, guide/NN-<id>.json, balises/<B-id>.json
 * - Ajoute le pack à content/manifest.json (inactif par défaut, --actif pour l'activer)
 * Ensuite : node tools/build-data.mjs  (régénère js/data.js + bundles)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT = path.join(ROOT, "content");

const args = process.argv.slice(2);
const fileArg = args.find((a) => !a.startsWith("--"));
const actif = args.includes("--actif");
const idOverride = (args.find((a) => a.startsWith("--id=")) || "").slice(5);

if (!fileArg) {
  console.error("Usage : node tools/import-pack.mjs <bundle.jdpbc.json> [--actif] [--id=nouvel-id]");
  process.exit(2);
}

function fail(msg) { console.error("❌ " + msg); process.exit(1); }

let bundle;
try {
  bundle = JSON.parse(fs.readFileSync(path.resolve(fileArg), "utf8"));
} catch (e) {
  fail(`Impossible de lire le bundle : ${e.message}`);
}
if (bundle.$format !== "jdpbc-pack") fail("$format ≠ jdpbc-pack — ce fichier ne vient pas de l'atelier ?");

const pack = bundle.pack || {};
pack.id = idOverride || pack.id;
if (!pack.id || !/^[a-z0-9-]+$/.test(pack.id)) fail("id de pack manquant ou invalide (minuscules, chiffres, tirets)");
if (!Array.isArray(bundle.decouvertes) || !bundle.decouvertes.length) fail("aucune découverte dans le bundle");

/* --- validations (alignées sur build-data.mjs / atelier.js) --- */
const ids = new Set();
const uniq = (scope, id) => {
  if (!id) fail(`${scope} : id manquant`);
  if (ids.has(id)) fail(`${scope} : identifiant dupliqué « ${id} »`);
  ids.add(id);
};
for (const d of bundle.decouvertes) {
  uniq("découverte", d.id);
  for (const k of ["nom", "latin", "taille"]) if (!String(d[k] || "").trim()) fail(`découverte ${d.id} : champ requis « ${k} »`);
  if (!Array.isArray(d.quiz) || !d.quiz.length) fail(`découverte ${d.id} : quiz requis`);
}
for (const g of bundle.guide || []) {
  uniq("notion", g.id);
  if (!g.description) fail(`notion ${g.id} : description requise`);
}
const birdIds = new Set(bundle.decouvertes.map((d) => d.id));
for (const b of bundle.balises || []) {
  if (!birdIds.has(b.bird)) fail(`balise ${b.id} → découverte inconnue « ${b.bird} »`);
}

/* --- écriture des fichiers --- */
const dir = path.join(CONTENT, "packs", pack.id);
if (fs.existsSync(dir)) fail(`le pack existe déjà : content/packs/${pack.id} (choisissez un autre --id=…)`);
const pad = (i) => String(i + 1).padStart(2, "0");
const write = (rel, obj) => {
  const f = path.join(dir, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, JSON.stringify(obj, null, 2) + "\n", "utf8");
};

write("pack.json", {
  id: pack.id, nom: pack.nom || pack.id, theme: pack.theme || "",
  description: pack.description || "", version: pack.version || 1,
  ages: Array.isArray(pack.ages) ? pack.ages : [6, 99],
});
bundle.decouvertes.forEach((d, i) => write(path.join("decouvertes", `${pad(i)}-${d.id}.json`), d));
(bundle.guide || []).forEach((g, i) => write(path.join("guide", `${pad(i)}-${g.id}.json`), g));
(bundle.balises || []).forEach((b) => write(path.join("balises", `${b.id}.json`), b));

/* --- manifest --- */
const manifestFile = path.join(CONTENT, "manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestFile, "utf8"));
if (!manifest.packs.some((p) => p.id === pack.id)) {
  manifest.packs.push({ id: pack.id, actif: !!actif });
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2) + "\n", "utf8");
}

console.log(`✅ Pack installé : content/packs/${pack.id}`);
console.log(`   (${bundle.decouvertes.length} découvertes, ${(bundle.guide || []).length} notions, ${(bundle.balises || []).length} balises — actif : ${actif ? "oui" : "non"})`);
if (!actif) console.log("   Pour l'activer : passez \"actif\": true dans content/manifest.json");
console.log("   Puis régénérez : node tools/build-data.mjs");
