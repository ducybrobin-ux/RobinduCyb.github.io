/* events.js — Types d'événements du jeu.
 *
 * Constantes string-based pour éviter les fautes de frappe.
 * Chaque événement porte un payload décrit dans le JSDoc.
 */

/** Balise trouvée (QR, GPS ou manuel). Payload: { balise, mode } */
export const BALISE_FOUND = "balise:found";

/** Énigme réussie. Payload: { balise, answer } */
export const RIDDLE_SOLVED = "riddle:solved";

/** Quiz terminé (toutes les questions répondues). Payload: { bird, score, total } */
export const QUIZ_COMPLETED = "quiz:completed";

/** Découverte révélée (carte oiseau affichée). Payload: { bird, balise } */
export const BIRD_REVEALED = "bird:revealed";

/** Graine offerte à un coéquipier. Payload: { baliseId, targetProfileId } */
export const SEED_OFFERED = "seed:offered";

/** Parcours terminé (toutes les balises validées). Payload: { profile } */
export const RUN_FINISHED = "run:finished";

/** Changement de profil. Payload: { profile } */
export const PROFILE_CHANGED = "profile:changed";

/** Changement de settings. Payload: { settings } */
export const SETTINGS_CHANGED = "settings:changed";

/** Sync serveur terminée. Payload: { ok, count } */
export const SYNC_DONE = "sync:done";
