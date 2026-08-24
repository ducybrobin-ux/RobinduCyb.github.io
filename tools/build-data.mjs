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

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "js", "data.js");
const CONTENT = path.join(ROOT, "content");

const M_DEBUT = "/* ==== DÉBUT CONTENU GÉNÉRÉ — NE PAS ÉDITER ====";
const M_FIN = "/* ==== FIN CONTENU GÉNÉRÉ ==== */";

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    throw new Error(`${path.relative(ROOT, p)} : JSON invalide (${e.message})`);
  }
}

function fail(file, msg) {
  throw new Error(`${path.relative(ROOT, file)} : ${msg}`);
}

/* ---- Validation légère (zéro dépendance) ---- */
function validerDecouverte(f, d) {
  for (const k of ["id", "nom", "latin", "emoji", "couleur", "categorie", "taille"]) {
    if (!d[k]) fail(f, `champ requis manquant : ${k}`);
  }
  if (!Array.isArray(d.anecdotes) || d.anecdotes.length < 1) fail(f, "anecdotes[] requis (>=1)");
  if (!Array.isArray(d.quiz) || d.quiz.length < 1) fail(f, "quiz[] requis (>=1)");
  d.quiz.forEach((q, i) => {
    if (!q.q || !Array.isArray(q.options) || q.options.length < 2) fail(f, `quiz[${i}] incomplet`);
    if (!(q.reponse >= 0 && q.reponse < q.options.length)) fail(f, `quiz[${i}].reponse hors limites`);
  });
  if (!d.pedagogie || !d.pedagogie.objectif) fail(f, "pedagogie.objectif requis");
  if (!Array.isArray(d.pedagogie?.ages)) fail(f, "pedagogie.ages requis ([min,max])");
}

function validerGuide(f, g) {
  for (const k of ["id", "nom", "description"]) {
    if (!g[k]) fail(f, `champ requis manquant : ${k}`);
  }
  if (!g.pedagogie || !g.pedagogie.objectif) fail(f, "pedagogie.objectif requis");
}

function validerBalise(f, b) {
  for (const k of ["id", "bird", "code", "label"]) {
    if (!b[k]) fail(f, `champ requis manquant : ${k}`);
  }
  const nivs = ["facile", "moyen", "difficile"];
  for (const n of nivs) {
    const e = b.enigmes?.[n];
    if (!e || !e.text || !Array.isArray(e.reponses) || e.reponses.length < 1) {
      fail(f, `enigmes.${n} incomplet (text + reponses[])`);
    }
    if (!e.indice || !e.saviez) fail(f, `enigmes.${n} : indice/saviez requis`);
    if (!Array.isArray(e.ages)) fail(f, `enigmes.${n}.ages requis ([min,max])`);
  }
}

function validerTheme(f, t) {
  for (const k of ["id", "nom", "emoji"]) {
    if (!t[k]) fail(f, `champ requis manquant : ${k}`);
  }
  if (!t.vars || typeof t.vars !== "object" || !Object.keys(t.vars).length) fail(f, "vars{} requis (variables CSS)");
}

/* ---- Chargement des packs actifs ---- */
function chargerPack(dir) {
  const pack = readJson(path.join(dir, "pack.json"));
  const decouvertes = [], guide = [], balises = [];
  for (const f of sortedJsonFiles(path.join(dir, "decouvertes"))) {
    const d = readJson(f); validerDecouverte(f, d); decouvertes.push(d);
  }
  for (const f of sortedJsonFiles(path.join(dir, "guide"))) {
    const g = readJson(f); validerGuide(f, g); guide.push(g);
  }
  for (const f of sortedJsonFiles(path.join(dir, "balises"))) {
    const b = readJson(f); validerBalise(f, b); balises.push(b);
  }
  return { pack, decouvertes, guide, balises };
}

function sortedJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort()
    .map((f) => path.join(dir, f));
}

function chargerContenu() {
  const manifest = readJson(path.join(CONTENT, "manifest.json"));
  const vus = new Set();
  for (const entry of manifest.packs) {
    if (vus.has(entry.id)) fail(CONTENT, `pack « ${entry.id} » déclaré deux fois dans manifest.json`);
    vus.add(entry.id);
  }
  const decouvertes = [], guide = [], balises = [];
  const packsActifs = [], packsCharges = [];
  for (const entry of manifest.packs) {
    if (!entry.actif) continue;
    const dir = path.join(CONTENT, "packs", entry.id);
    const p = chargerPack(dir);
    packsActifs.push(p.pack.id);
    packsCharges.push(p);
    decouvertes.push(...p.decouvertes);
    guide.push(...p.guide);
    balises.push(...p.balises);
  }
  /* --- Anti-doublons entre packs actifs --- */
  const verifierUnicite = (liste, quoi) => {
    const vus2 = new Map();
    for (const x of liste) {
      if (vus2.has(x.id)) {
        fail(CONTENT, `${quoi} « ${x.id} » présent dans plusieurs packs actifs (${vus2.get(x.id)} et un autre) — désactivez l'un des deux ou renommez`);
      }
      vus2.set(x.id, quoi);
    }
  };
  verifierUnicite(decouvertes, "découverte");
  verifierUnicite(guide, "notion");
  verifierUnicite(balises, "balise");
  const codesVus = new Set();
  for (const b of balises) {
    if (codesVus.has(b.code)) fail(CONTENT, `code de validation dupliqué « ${b.code} » (balise ${b.id})`);
    codesVus.add(b.code);
  }

  /* Cohérence croisée : chaque balise pointe vers une découverte active */
  const ids = new Set(decouvertes.map((d) => d.id));
  for (const b of balises) {
    if (!ids.has(b.bird)) fail(CONTENT, `balise ${b.id} → découverte inconnue ou inactive « ${b.bird} »`);
  }
  return { decouvertes, guide, balises, themes: chargerThemes(), packsActifs, packsCharges };
}

function chargerThemes() {
  const dir = path.join(CONTENT, "themes");
  if (!fs.existsSync(dir)) return [];
  const themes = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
    const p = path.join(dir, f);
    const t = readJson(p);
    validerTheme(p, t);
    themes.push(t);
  }
  return themes;
}

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

const contenu = chargerContenu();
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
