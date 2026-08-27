/* audit-log.js — Journal immuable des décisions éditoriales.
 *
 * Chaque événement enregistre :
 *   contenu, version, action, auteur, date, hash, résultat
 *
 * Le journal est append-only : on ne supprime jamais une entrée.
 * Les données personnelles inutiles ne sont pas enregistrées.
 */

/**
 * Actions tracées dans le journal.
 */
export const AuditAction = Object.freeze({
  CREATED: "CREATED",
  MODIFIED: "MODIFIED",
  SUBMITTED_FOR_REVIEW: "SUBMITTED_FOR_REVIEW",
  REJECTED: "REJECTED",
  APPROVED: "APPROVED",
  PUBLISHED: "PUBLISHED",
  SUSPENDED: "SUSPENDED",
  REVOKED: "REVOKED",
  ARCHIVED: "ARCHIVED",
});

/**
 * Crée un audit log en mémoire (append-only).
 * @returns {{ log, append, query, getAll }}
 */
export function createAuditLog() {
  /** @type {Array<object>} */
  const entries = [];

  /**
   * Ajoute une entrée au journal.
   * @param {object} params
   * @param {string} params.contentId — identifiant du contenu
   * @param {string} params.version — numéro de version
   * @param {string} params.action — action tracée (AuditAction)
   * @param {string} params.author — identifiant de l'auteur de l'action
   * @param {string} [params.hash] — hash du contenu concerné
   * @param {string} [params.result] — résultat (ok, rejected, etc.)
   * @returns {object} — l'entrée créée
   */
  function append({ contentId, version, action, author, hash, result }) {
    const entry = {
      contentId,
      version,
      action,
      author,
      timestamp: new Date().toISOString(),
      hash: hash ?? null,
      result: result ?? "ok",
    };
    entries.push(entry);
    return { ...entry };
  }

  /**
   * Interroge le journal.
   * @param {object} [filter]
   * @param {string} [filter.contentId]
   * @param {string} [filter.action]
   * @param {string} [filter.author]
   * @returns {object[]}
   */
  function query(filter = {}) {
    return entries.filter((e) => {
      if (filter.contentId && e.contentId !== filter.contentId) return false;
      if (filter.action && e.action !== filter.action) return false;
      if (filter.author && e.author !== filter.author) return false;
      return true;
    });
  }

  /**
   * Retourne toutes les entrées (copie).
   */
  function getAll() {
    return entries.map((e) => ({ ...e }));
  }

  return { append, query, getAll };
}
