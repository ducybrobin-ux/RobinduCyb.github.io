#!/usr/bin/env node
/* build-engine.mjs — Génère js/engine.js (script classique navigateur)
 * à partir des modules ES de packages/game-engine/src/.
 *
 *   node tools/build-engine.mjs            régénère js/engine.js
 *   node tools/build-engine.mjs --check    vérifie la synchro (exit 1 si obsolète)
 *
 * Transforme les déclarations `export` en déclarations classiques et
 * assigne toutes les fonctions à `window.DUCYB_ENGINE`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "packages", "game-engine", "src");
const OUT = path.join(ROOT, "js", "engine.js");
const checkOnly = process.argv.includes("--check");

const EXPOSED = ["normalize", "checkAnswer", "makeQuiz", "getEnigme"];
const SRC_FILES = ["normalize.js", "answers.js", "quiz.js", "enigmes.js"];

function header() {
  return `/* engine.js — Moteur de jeu DUCYB (généré automatiquement depuis packages/game-engine/src/).
 * NE PAS ÉDITER DIRECTEMENT — modifier la source dans packages/game-engine/src/.
 * Régénérer : node tools/build-engine.mjs
 */\n`;
}

function stripExportsAndImports(src) {
  const lines = src.split("\n");
  const out = [];
  for (const line of lines) {
    const trimmed = line.trimStart();
    if (trimmed.startsWith("import ")) continue;            // supprime imports ESM
    if (trimmed.startsWith("export {")) continue;           // supprime réexport index
    if (trimmed.startsWith("export function")) {
      out.push(line.replace("export function", "function"));
    } else if (trimmed.startsWith("export const")) {
      out.push(line.replace("export const", "const"));
    } else {
      out.push(line);
    }
  }
  return out.join("\n");
}

function generate() {
  let body = "";
  for (const f of SRC_FILES) {
    const src = fs.readFileSync(path.join(SRC, f), "utf8");
    body += stripExportsAndImports(src) + "\n";
  }
  body += `\nwindow.DUCYB_ENGINE = { ${EXPOSED.join(", ")} };\n`;
  return header() + body;
}

const nouveau = generate();

if (checkOnly) {
  if (!fs.existsSync(OUT) || fs.readFileSync(OUT, "utf8") !== nouveau) {
    console.error(`✗ ${path.relative(ROOT, OUT)} obsolète — lancez : node tools/build-engine.mjs`);
    process.exit(1);
  }
  console.log(`OK ${path.relative(ROOT, OUT)} synchronisé avec packages/game-engine/src/`);
} else {
  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, nouveau, "utf8");
  console.log(`généré : ${path.relative(ROOT, OUT)} (${EXPOSED.length} fonctions exposées)`);
}
