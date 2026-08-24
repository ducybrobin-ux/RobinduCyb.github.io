/* legacy.js — Chargement et validation du contenu historique « jdpbc-pack ».
 *
 * Règles extraites telles quelles de tools/build-data.mjs (héritage Multi JDP)
 * afin qu'il n'existe qu'UNE source de vérité pour la validation des packs.
 * Aucune dépendance. Les messages d'erreur sont conservés à l'identique.
 */
import fs from "node:fs";
import path from "node:path";

export function readJson(p, root) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch (e) {
    throw new Error(`${path.relative(root, p)} : JSON invalide (${e.message})`);
  }
}

/* Base pour l'affichage des chemins d'erreur (racine du dépôt consommateur). */
let REL_BASE = process.cwd();
export function setRelBase(p) { REL_BASE = p; }

function fail(file, msg) {
  throw new Error(`${path.relative(REL_BASE, file)} : ${msg}`);
}

/* ---- Validation légère (zéro dépendance) ---- */
export function validerDecouverte(f, d) {
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

export function validerGuide(f, g) {
  for (const k of ["id", "nom", "description"]) {
    if (!g[k]) fail(f, `champ requis manquant : ${k}`);
  }
  if (!g.pedagogie || !g.pedagogie.objectif) fail(f, "pedagogie.objectif requis");
}

export function validerBalise(f, b) {
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

export function validerTheme(f, t) {
  for (const k of ["id", "nom", "emoji"]) {
    if (!t[k]) fail(f, `champ requis manquant : ${k}`);
  }
  if (!t.vars || typeof t.vars !== "object" || !Object.keys(t.vars).length) fail(f, "vars{} requis (variables CSS)");
}

/* ---- Chargement des packs actifs ---- */
export function sortedJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort()
    .map((f) => path.join(dir, f));
}

export function chargerPack(dir, root) {
  const pack = readJson(path.join(dir, "pack.json"), root);
  const decouvertes = [], guide = [], balises = [];
  for (const f of sortedJsonFiles(path.join(dir, "decouvertes"))) {
    const d = readJson(f, root); validerDecouverte(f, d); decouvertes.push(d);
  }
  for (const f of sortedJsonFiles(path.join(dir, "guide"))) {
    const g = readJson(f, root); validerGuide(f, g); guide.push(g);
  }
  for (const f of sortedJsonFiles(path.join(dir, "balises"))) {
    const b = readJson(f, root); validerBalise(f, b); balises.push(b);
  }
  return { pack, decouvertes, guide, balises };
}

export function chargerThemes(contentDir, root) {
  const dir = path.join(contentDir, "themes");
  if (!fs.existsSync(dir)) return [];
  const themes = [];
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith(".json")).sort()) {
    const p = path.join(dir, f);
    const t = readJson(p, root);
    validerTheme(p, t);
    themes.push(t);
  }
  return themes;
}

export function chargerContenu(contentDir, root) {
  const manifest = readJson(path.join(contentDir, "manifest.json"), root);
  const vus = new Set();
  for (const entry of manifest.packs) {
    if (vus.has(entry.id)) fail(path.join(contentDir, "manifest.json"), `pack « ${entry.id} » déclaré deux fois dans manifest.json`);
    vus.add(entry.id);
  }
  const decouvertes = [], guide = [], balises = [];
  const packsActifs = [], packsCharges = [];
  for (const entry of manifest.packs) {
    if (!entry.actif) continue;
    const dir = path.join(contentDir, "packs", entry.id);
    const p = chargerPack(dir, root);
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
        fail(path.join(contentDir, "manifest.json"), `${quoi} « ${x.id} » présent dans plusieurs packs actifs (${vus2.get(x.id)} et un autre) — désactivez l'un des deux ou renommez`);
      }
      vus2.set(x.id, quoi);
    }
  };
  verifierUnicite(decouvertes, "découverte");
  verifierUnicite(guide, "notion");
  verifierUnicite(balises, "balise");
  const codesVus = new Set();
  for (const b of balises) {
    if (codesVus.has(b.code)) fail(path.join(contentDir, "manifest.json"), `code de validation dupliqué « ${b.code} » (balise ${b.id})`);
    codesVus.add(b.code);
  }

  /* Cohérence croisée : chaque balise pointe vers une découverte active */
  const ids = new Set(decouvertes.map((d) => d.id));
  for (const b of balises) {
    if (!ids.has(b.bird)) fail(path.join(contentDir, "manifest.json"), `balise ${b.id} → découverte inconnue ou inactive « ${b.bird} »`);
  }
  return { decouvertes, guide, balises, themes: chargerThemes(contentDir, root), packsActifs, packsCharges };
}
