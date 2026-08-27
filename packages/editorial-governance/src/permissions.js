/* permissions.js — Rôles et droits de la gouvernance éditoriale.
 *
 * Principe : ADMINISTRATOR ≠ EDITORIAL_OWNER.
 * Un administrateur technique peut administrer le serveur sans pouvoir
 * valider pédagogiquement un contenu.
 *
 * L'IA ne possède aucun droit approve_content.
 */

/**
 * Rôles disponibles.
 */
export const Roles = Object.freeze({
  AUTHOR: "AUTHOR",
  DESIGNER: "DESIGNER",
  EDUCATOR: "EDUCATOR",
  REVIEWER: "REVIEWER",
  ADMINISTRATOR: "ADMINISTRATOR",
  EDITORIAL_OWNER: "EDITORIAL_OWNER",
});

/**
 * Droits associés à chaque rôle.
 * @type {Map<string, Set<string>>}
 */
const ROLE_RIGHTS = new Map([
  [Roles.AUTHOR, new Set(["create_content", "edit_own_content", "submit_for_review"])],
  [Roles.DESIGNER, new Set(["create_content", "edit_own_content", "submit_for_review", "preview_content"])],
  [Roles.EDUCATOR, new Set(["review_content", "comment_content"])],
  [Roles.REVIEWER, new Set(["review_content", "comment_content", "request_changes"])],
  [Roles.ADMINISTRATOR, new Set(["manage_server", "manage_users", "view_audit_log"])],
  [Roles.EDITORIAL_OWNER, new Set([
    "create_content", "edit_own_content", "submit_for_review",
    "review_content", "approve_content", "reject_content",
    "publish_content", "suspend_content", "revoke_content",
    "view_audit_log",
  ])],
]);

/**
 * Vérifie si un rôle possède un droit.
 * @param {string} role
 * @param {string} right
 * @returns {boolean}
 */
export function hasRight(role, right) {
  return ROLE_RIGHTS.get(role)?.has(right) ?? false;
}

/**
 * Liste les droits d'un rôle.
 * @param {string} role
 * @returns {string[]}
 */
export function getRights(role) {
  return [...(ROLE_RIGHTS.get(role) ?? [])];
}

/**
 * Vérifie si un rôle peut approuver du contenu.
 * @param {string} role
 * @returns {boolean}
 */
export function canApprove(role) {
  return hasRight(role, "approve_content");
}

/**
 * Vérifie si un utilisateur est une IA.
 * @param {object} user — { role, isAI? }
 * @returns {boolean}
 */
export function isAI(user) {
  return user?.isAI === true;
}

/**
 * Vérifie si un utilisateur peut valider un contenu.
 * Doit être EDITORIAL_OWNER et ne pas être une IA.
 * @param {object} user — { role, isAI? }
 * @returns {boolean}
 */
export function canValidate(user) {
  if (isAI(user)) return false;
  return canApprove(user?.role);
}
