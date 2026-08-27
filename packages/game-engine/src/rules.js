/* rules.js — Règles de jeu par défaut.
 *
 * Chaque règle lie un type d'événement à des conditions et des actions.
 * Les actions sont des fonctions pures : (state, payload, ctx) => newState | void.
 *
 * Ces règles modélisent le flux de jeu standard :
 *   BALISE_FOUND → (pending? show riddle or reveal bird)
 *   RIDDLE_SOLVED → (reveal bird)
 *   QUIZ_COMPLETED → (validate balise)
 *   BIRD_REVEALED → (play sound, track discovery)
 *   RUN_FINISHED → (congratulate)
 */

import {
  BALISE_FOUND, RIDDLE_SOLVED, QUIZ_COMPLETED, BIRD_REVEALED, RUN_FINISHED,
} from "./events.js";
import {
  isBalisePending, isRiddlePending, isRaceMode, isQuizPerfect,
} from "./conditions.js";
import { reduceBaliseDone, reduceRiddleSolved, reduceQuizScore } from "./state.js";

/* ---- Actions ---- */

/**
 * Révèle la découverte (carte oiseau).
 * Retourne un payload enrichi pour les règles suivantes.
 */
export function actionRevealBird(state, payload) {
  // Le reveal est un signal — le DOM gère l'affichage
  return { ...payload, revealed: true };
}

/**
 * Marque la balise comme validée dans le state.
 */
export function actionUnlockBalise(state, payload) {
  return reduceBaliseDone(state, payload?.balise?.id, payload?.balise?.bird);
}

/**
 * Marque l'énigme comme résolue.
 */
export function actionSolveRiddle(state, payload) {
  return reduceRiddleSolved(state, payload?.balise?.id);
}

/**
 * Met à jour le score du quiz.
 */
export function actionUpdateQuizScore(state, payload) {
  return reduceQuizScore(state, payload?.score, payload?.total);
}

/**
 * Joue le chant de l'oiseau (signal au DOM).
 */
export function actionPlayBirdSong(state, payload) {
  // Signal pour AudioSys — le DOM écoute via le listener
  return { ...payload, playSong: true };
}

/**
 * Envoie la validation au serveur.
 */
export function actionPostValidation(state, payload, _ctx) {
  // Signal pour le sync manager
  return { ...payload, postValidation: true };
}

/* ---- Règles par défaut ---- */

export const DEFAULT_RULES = [
  {
    event: BALISE_FOUND,
    conditions: [isBalisePending, isRaceMode],
    actions: [actionUnlockBalise, actionPostValidation, actionRevealBird],
    priority: 10,
  },
  {
    event: BALISE_FOUND,
    conditions: [isBalisePending, (s) => !isRaceMode(s)],
    actions: [actionRevealBird],
    priority: 20,
  },
  {
    event: RIDDLE_SOLVED,
    conditions: [isRiddlePending],
    actions: [actionSolveRiddle, actionUnlockBalise, actionRevealBird, actionPostValidation],
    priority: 10,
  },
  {
    event: QUIZ_COMPLETED,
    conditions: [isQuizPerfect],
    actions: [actionUpdateQuizScore, actionUnlockBalise, actionRevealBird],
    priority: 10,
  },
  {
    event: QUIZ_COMPLETED,
    conditions: [(s, p) => !isQuizPerfect(s, p)],
    actions: [actionUpdateQuizScore, actionUnlockBalise],
    priority: 20,
  },
  {
    event: BIRD_REVEALED,
    conditions: [],
    actions: [actionPlayBirdSong],
    priority: 10,
  },
  {
    event: RUN_FINISHED,
    conditions: [],
    actions: [],
    priority: 10,
  },
];
