/* content-version.js — Gestion des versions d'un contenu.
 *
 * Chaque modification substantielle crée une nouvelle version.
 * Une modification d'un contenu APPROVED/PUBLISHED doit revenir en REVIEW.
 * Conserve l'historique complet des versions.
 */

import { ContentStatus, canTransition } from "./content-status.js";
import { computeHash } from "./signature.js";

/**
 * Crée un gestionnaire de versions pour un contenu.
 * @param {object} params
 * @param {string} params.contentId — identifiant unique du contenu
 * @param {object} params.content — contenu initial
 * @param {string} [params.author] — auteur initial
 * @returns {object} — API de gestion des versions
 */
export function createContentVersion({ contentId, content, author = "system" }) {
  /** @type {Array<object>} */
  const versions = [];
  let currentVersion = "1.0";
  let currentStatus = ContentStatus.DRAFT;
  let currentContent = content;
  let currentSignature = null;

  // Version initiale
  versions.push({
    version: currentVersion,
    content: JSON.parse(JSON.stringify(content)),
    hash: computeHash(content),
    status: currentStatus,
    author,
    createdAt: new Date().toISOString(),
    signature: null,
  });

  /**
   * Retourne la version courante.
   */
  function getCurrent() {
    return {
      contentId,
      version: currentVersion,
      content: currentContent,
      hash: computeHash(currentContent),
      status: currentStatus,
      signature: currentSignature,
    };
  }

  /**
   * Retourne l'historique complet.
   */
  function getHistory() {
    return versions.map((v) => ({ ...v, content: undefined })); // pas de copie du contenu
  }

  /**
   * Retourne le contenu d'une version spécifique.
   * @param {string} version
   */
  function getVersion(version) {
    return versions.find((v) => v.version === version) ?? null;
  }

  /**
   * Modifie le contenu. Crée une nouvelle version.
   * Si le statut est APPROVED ou PUBLISHED, revient en REVIEW.
   * @param {object} newContent — nouveau contenu
   * @param {string} author — auteur de la modification
   * @returns {object} — la nouvelle version
   */
  function modify(newContent, author = "system") {
    // Incrémentation de version (patch)
    const parts = currentVersion.split(".");
    const minor = parseInt(parts[1] ?? "0", 10) + 1;
    const newVer = `${parts[0]}.${minor}`;

    // Si le contenu est validé, revenir en REVIEW
    if (
      currentStatus === ContentStatus.APPROVED ||
      currentStatus === ContentStatus.PUBLISHED
    ) {
      currentStatus = ContentStatus.REVIEW;
      currentSignature = null;
    }

    currentVersion = newVer;
    currentContent = newContent;

    const entry = {
      version: currentVersion,
      content: JSON.parse(JSON.stringify(newContent)),
      hash: computeHash(newContent),
      status: currentStatus,
      author,
      createdAt: new Date().toISOString(),
      signature: null,
    };
    versions.push(entry);

    return { ...entry, content: undefined };
  }

  /**
   * Change le statut du contenu.
   * @param {string} newStatus
   * @param {string} author
   * @returns {object} — le changement
   */
  function setStatus(newStatus, author = "system") {
    if (!canTransition(currentStatus, newStatus)) {
      throw new Error(`Transition interdite : ${currentStatus} → ${newStatus}`);
    }
    currentStatus = newStatus;
    return { from: versions.at(-1)?.status, to: newStatus, version: currentVersion, author };
  }

  /**
   * Applique une signature à la version courante.
   * @param {object} signatureData
   */
  function applySignature(signatureData) {
    currentSignature = signatureData;
    const last = versions.at(-1);
    if (last) last.signature = signatureData;
  }

  return { getCurrent, getHistory, getVersion, modify, setStatus, applySignature };
}
