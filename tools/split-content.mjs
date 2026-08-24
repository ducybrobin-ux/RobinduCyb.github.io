#!/usr/bin/env node
/* split-content.mjs — Extraction du contenu de js/data.js vers content/
 * (migration one-shot vers l'architecture modulaire)
 * Usage : node tools/split-content.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DATA = path.join(ROOT, "js", "data.js");
const CONTENT = path.join(ROOT, "content");

/* Métadonnées pédagogiques par notion (rédigées à la main une fois) */
const PEDAGO_DECOUVERTES = {
  confirmation: { objectif: "Chercher activement ce qui pourrait contredire une opinion avant de la croire" },
  ancrage:      { objectif: "Reconnaître l'influence du premier chiffre reçu et recalculer avec ses propres repères" },
  disponibilite:{ objectif: "Distinguer ce qui est facile à se rappeler de ce qui est réellement fréquent" },
  dunning:      { objectif: "Mesurer ses progrès pour évaluer son niveau réel et accueillir les retours" },
  cout:         { objectif: "Décider d'après les gains futurs possibles, sans se laisser enfermer par le passé" },
  halo:         { objectif: "Évaluer chaque qualité séparément avant de juger un ensemble" },
  verite:       { objectif: "Vérifier source et preuve avant de croire une information répétée" },
  barnum:       { objectif: "Exiger des descriptions précises et vérifiables plutôt que des phrases universelles" },
};
const PEDAGO_GUIDE = {
  reciprocite: { objectif: "Reconnaître la dette invisible créée par un cadeau et choisir librement" },
  joueur:      { objectif: "Comprendre que chaque tirage aléatoire est indépendant des précédents" },
  apophenie:   { objectif: "Tester une coïncidence avant d'y voir un motif réel" },
  optimisme:   { objectif: "Estimer ses risques avec une marge de sécurité au lieu d'un optimisme aveugle" },
  paille:      { objectif: "Reformuler fidèlement l'argument d'autrui avant de le discuter" },
  statuquo:    { objectif: "Réévaluer les options existantes comme si le choix se faisait aujourd'hui" },
  exposition:  { objectif: "Distinguer la familiarité d'une chose de sa qualité réelle" },
  controle:    { objectif: "Distinguer ce qui relève de l'habileté de ce qui relève du hasard" },
  groupe:      { objectif: "Protéger la parole dissidente pour garder une décision collective lucide" },
  recence:     { objectif: "Remettre les derniers événements dans leur contexte global" },
};

const AGES_NIVEAUX = { facile: [6, 9], moyen: [10, 13], difficile: [14, 99] };

function loadRegion() {
  const src = fs.readFileSync(DATA, "utf8");
  const m1 = src.indexOf("/* ==== DÉBUT CONTENU GÉNÉRÉ");
  const m2 = src.indexOf("/* ==== FIN CONTENU GÉNÉRÉ ==== */");
  if (m1 < 0 || m2 < 0) throw new Error("Marqueurs de région introuvables dans js/data.js");
  const region = src.slice(m1, m2);
  return new Function(region + ";return {SITE,TRAIL,BIRDS,GUIDE,BALISES,DIFFICULTIES}")();
}

function pedago(base, table, id, dureeMin) {
  const p = table[id];
  return {
    ages: [6, 99],
    duree_min: dureeMin,
    objectif: p ? p.objectif : "",
    programme: ["cycle 3", "cycle 4", "lycée"],
    ...base,
  };
}

function writeJson(file, obj) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + "\n", "utf8");
  console.log("écrit", path.relative(ROOT, file));
}

const { SITE, TRAIL, BIRDS, GUIDE, BALISES } = loadRegion();
const PACK = path.join(CONTENT, "packs", "biais-cognitifs");

const pad = (i) => String(i + 1).padStart(2, "0");
BIRDS.forEach((b, i) => {
  const { quiz, ...rest } = b;
  writeJson(path.join(PACK, "decouvertes", `${pad(i)}-${b.id}.json`), {
    type: "decouverte",
    version: 1,
    ...rest,
    pedagogie: pedago({}, PEDAGO_DECOUVERTES, b.id, 8),
    quiz,
  });
});
GUIDE.forEach((g, i) => {
  writeJson(path.join(PACK, "guide", `${pad(i)}-${g.id}.json`), {
    type: "notion-guide",
    version: 1,
    ...g,
    pedagogie: pedago({}, PEDAGO_GUIDE, g.id, 5),
  });
});
BALISES.forEach((bal) => {
  const enigmes = {};
  for (const niv of Object.keys(bal.enigmes || {})) {
    enigmes[niv] = { ...bal.enigmes[niv], ages: AGES_NIVEAUX[niv] || [6, 99] };
  }
  writeJson(path.join(PACK, "balises", `${bal.id}.json`), {
    type: "balise",
    version: 1,
    ...bal,
    enigmes,
  });
});

writeJson(path.join(PACK, "pack.json"), {
  id: "biais-cognitifs",
  nom: "Biais cognitifs",
  theme: "neurosciences & pièges mentaux",
  description: "Huit découvertes du sentier (un biais par balise), dix notions complémentaires et leurs énigmes.",
  version: 1,
  ages: [6, 99],
});

writeJson(path.join(CONTENT, "manifest.json"), {
  version: 1,
  packs: [
    { id: "biais-cognitifs", actif: true },
  ],
});
console.log("\nExtraction terminée.");
