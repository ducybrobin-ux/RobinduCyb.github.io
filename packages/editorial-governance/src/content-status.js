/* content-status.js — États explicites d'un contenu éducatif.
 *
 * Transitions autorisées :
 *   DRAFT → REVIEW → APPROVED → PUBLISHED
 *   REVIEW → DRAFT (rejet)
 *   PUBLISHED → SUSPENDED
 *   SUSPENDED → PUBLISHED (réactivation)
 *   SUSPENDED → ARCHIVED
 *   TOUT → ARCHIVED
 *
 * Règle critique : toute modification substantielle d'un contenu
 * APPROVED ou PUBLISHED doit revenir en REVIEW.
 */

/**
 * Énumération des statuts de contenu.
 */
export const ContentStatus = Object.freeze({
  DRAFT: "DRAFT",
  REVIEW: "REVIEW",
  CORRECTION_REQUIRED: "CORRECTION_REQUIRED",
  APPROVED: "APPROVED",
  PUBLISHED: "PUBLISHED",
  SUSPENDED: "SUSPENDED",
  ARCHIVED: "ARCHIVED",
});

/**
 * Transitions autorisées (de → vers).
 * @type {Map<string, Set<string>>}
 */
const TRANSITIONS = new Map([
  [ContentStatus.DRAFT, new Set([ContentStatus.REVIEW])],
  [ContentStatus.REVIEW, new Set([ContentStatus.DRAFT, ContentStatus.APPROVED, ContentStatus.CORRECTION_REQUIRED])],
  [ContentStatus.CORRECTION_REQUIRED, new Set([ContentStatus.REVIEW])],
  [ContentStatus.APPROVED, new Set([ContentStatus.PUBLISHED, ContentStatus.REVIEW])],
  [ContentStatus.PUBLISHED, new Set([ContentStatus.SUSPENDED, ContentStatus.ARCHIVED])],
  [ContentStatus.SUSPENDED, new Set([ContentStatus.PUBLISHED, ContentStatus.ARCHIVED])],
  [ContentStatus.ARCHIVED, new Set()],
]);

/**
 * Vérifie si une transition de statut est autorisée.
 * @param {string} from — statut actuel
 * @param {string} to — statut cible
 * @returns {boolean}
 */
export function canTransition(from, to) {
  return TRANSITIONS.get(from)?.has(to) ?? false;
}

/**
 * Liste les transitions possibles depuis un statut.
 * @param {string} from
 * @returns {string[]}
 */
export function possibleTransitions(from) {
  return [...(TRANSITIONS.get(from) ?? [])];
}

/**
 * Applique une transition. Lance une erreur si non autorisée.
 * @param {string} from
 * @param {string} to
 * @returns {string} — le nouveau statut
 * @throws {Error} si la transition est interdite
 */
export function transition(from, to) {
  if (!canTransition(from, to)) {
    throw new Error(`Transition interdite : ${from} → ${to}`);
  }
  return to;
}
