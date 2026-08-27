#!/usr/bin/env node
/* build-engine.mjs — Génère js/engine.js (script classique navigateur)
 * à partir des modules ES de packages/game-engine/src/.
 *
 *   node tools/build-engine.mjs            régénère js/engine.js
 *   node tools/build-engine.mjs --check    vérifie la synchro (exit 1 si obsolète)
 *
 * Transforme les déclarations `export` en déclarations classiques et
 * assigne toutes les fonctions à `window.CURIOS_ENGINE`.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(ROOT, "packages", "game-engine", "src");
const OUT = path.join(ROOT, "js", "engine.js");
const checkOnly = process.argv.includes("--check");

/* ---- Utilitaires existants (toujours exposés) ---- */
const CORE_EXPOSED = ["normalize", "checkAnswer", "makeQuiz", "getEnigme"];
const CORE_FILES = ["normalize.js", "answers.js", "quiz.js", "enigmes.js"];

/* ---- Event engine (nouveaux modules) ---- */
const ENGINE_FILES = ["events.js", "conditions.js", "state.js", "engine.js", "rules.js"];
const ENGINE_EXPOSED = [
  // Events
  "BALISE_FOUND", "RIDDLE_SOLVED", "QUIZ_COMPLETED", "BIRD_REVEALED",
  "SEED_OFFERED", "RUN_FINISHED", "PROFILE_CHANGED", "SETTINGS_CHANGED", "SYNC_DONE",
  // Conditions
  "isBaliseDone", "isBalisePending", "isRaceMode", "isClassicMode", "isRandomMode",
  "isRiddleSolved", "isRiddlePending", "isQuizPerfect", "isAdmin", "isNightMode",
  "isOffline", "hasSeeds", "allBalisesDone", "not", "and", "or",
  // State
  "createGameState",
  "reduceBaliseDone", "reduceRiddleSolved", "reduceQuizScore",
  "reduceProfileChange", "reduceSeedOffered", "reduceSettingsChange",
  "reduceTimerTick", "reduceRunFinished",
  // Engine
  "createEngine",
  // Rules
  "DEFAULT_RULES",
  "actionRevealBird", "actionUnlockBalise", "actionSolveRiddle",
  "actionUpdateQuizScore", "actionPlayBirdSong", "actionPostValidation",
];

const ALL_EXPOSED = [...CORE_EXPOSED, ...ENGINE_EXPOSED];

function header() {
  return `/* engine.js — Moteur de jeu Curi🧭s (généré automatiquement depuis packages/game-engine/src/).
 * NE PAS ÉDITER DIRECTEMENT — modifier la source dans packages/game-engine/src/.
 * Régénérer : node tools/build-engine.mjs
 */\n`;
}

function stripExportsAndImports(src) {
  const lines = src.split("\n");
  const out = [];
  let skipBlock = false;
  for (const line of lines) {
    const trimmed = line.trimStart();
    if (skipBlock) {
      if (trimmed.includes("}")) skipBlock = false;
      continue;
    }
    if (trimmed.startsWith("import ")) {
      if (!trimmed.includes("}")) skipBlock = true;
      continue;
    }
    if (trimmed.startsWith("export {")) {
      if (!trimmed.includes("}")) skipBlock = true;
      continue;
    }
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

  // Utilitaires de base
  for (const f of CORE_FILES) {
    const src = fs.readFileSync(path.join(SRC, f), "utf8");
    body += `${stripExportsAndImports(src)}\n`;
  }

  // Event engine
  for (const f of ENGINE_FILES) {
    const src = fs.readFileSync(path.join(SRC, f), "utf8");
    body += `${stripExportsAndImports(src)}\n`;
  }

  body += `\nwindow.CURIOS_ENGINE = { ${ALL_EXPOSED.join(", ")} };\n`;
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
  console.log(`généré : ${path.relative(ROOT, OUT)} (${ALL_EXPOSED.length} fonctions exposées)`);
}
