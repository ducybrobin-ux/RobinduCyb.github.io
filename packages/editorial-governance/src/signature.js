/* signature.js — Signature numérique du contenu.
 *
 * Chaque version approuvée est associée à :
 *   content_hash, version, approved_at, approved_by, signature
 *
 * Le hash est calculé sur le contenu JSON sérialisé.
 * La signature est une empreinte HMAC du hash + métadonnées.
 *
 * Note : en production, la clé privée ne doit JAMAIS être
 * dans le code source. Cette implémentation utilise une clé
 * injectable pour les tests.
 */

import { createHash, createHmac } from "node:crypto";

/**
 * Calcule le hash SHA-256 d'un contenu.
 * @param {object} content — objet JSON sérialisable
 * @returns {string} — "sha256:hexdigest"
 */
export function computeHash(content) {
  const json = JSON.stringify(content, Object.keys(content).sort());
  const digest = createHash("sha256").update(json).digest("hex");
  return `sha256:${digest}`;
}

/**
 * Signe un contenu avec une clé secrète.
 * @param {object} params
 * @param {string} params.hash — hash du contenu
 * @param {string} params.version — numéro de version
 * @param {string} params.approvedBy — identifiant du validateur
 * @param {string} params.secretKey — clé secrète (jamais exposée)
 * @returns {{ hash, version, approved_at, approved_by, signature }}
 */
export function signContent({ hash, version, approvedBy, secretKey }) {
  const approved_at = new Date().toISOString();
  const payload = `${hash}:${version}:${approvedBy}:${approved_at}`;
  const signature = createHmac("sha256", secretKey).update(payload).digest("hex");

  return {
    hash,
    version,
    approved_at,
    approved_by: approvedBy,
    signature,
  };
}

/**
 * Vérifie la signature d'un contenu.
 * @param {object} signatureData — { hash, version, approved_at, approved_by, signature }
 * @param {object} content — contenu actuel à vérifier
 * @param {string} secretKey — clé secrète
 * @returns {{ valid: boolean, reason?: string }}
 */
export function verifySignature(signatureData, content, secretKey) {
  if (!signatureData || !content || !secretKey) {
    return { valid: false, reason: "missing_params" };
  }

  // 1. Vérifier que le hash correspond au contenu actuel
  const currentHash = computeHash(content);
  if (currentHash !== signatureData.hash) {
    return { valid: false, reason: "hash_mismatch" };
  }

  // 2. Vérifier la signature HMAC
  const payload = `${signatureData.hash}:${signatureData.version}:${signatureData.approved_by}:${signatureData.approved_at}`;
  const expectedSig = createHmac("sha256", secretKey).update(payload).digest("hex");

  if (expectedSig !== signatureData.signature) {
    return { valid: false, reason: "signature_invalid" };
  }

  return { valid: true };
}
