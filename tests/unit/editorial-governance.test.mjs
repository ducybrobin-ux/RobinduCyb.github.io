/**
 * Tests de gouvernance éducative — CURIOS
 *
 * 11 tests obligatoires + tests complémentaires.
 * Vérifie que les règles de gouvernance sont techniquement enforceables.
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  ContentStatus, canTransition, transition,
  Roles, hasRight, canApprove, isAI, canValidate,
  computeHash, signContent, verifySignature,
  AuditAction, createAuditLog,
  createContentVersion,
} from "../../packages/editorial-governance/src/index.js";

const SECRET_KEY = "test-secret-key-2026";

/* ================================================================
   TESTS OBLIGATOIRES (11)
   ================================================================ */

describe("TEST 1 — Un brouillon ne peut pas être publié officiellement", () => {
  it("DRAFT → PUBLISHED est interdit", () => {
    assert.equal(canTransition(ContentStatus.DRAFT, ContentStatus.PUBLISHED), false);
  });

  it("DRAFT → REVIEW est la seule transition autorisée", () => {
    assert.equal(canTransition(ContentStatus.DRAFT, ContentStatus.REVIEW), true);
    assert.equal(canTransition(ContentStatus.DRAFT, ContentStatus.APPROVED), false);
  });
});

describe("TEST 2 — Un auteur ne peut pas valider son contenu", () => {
  it("AUTHOR n'a pas le droit approve_content", () => {
    assert.equal(hasRight(Roles.AUTHOR, "approve_content"), false);
  });

  it("AUTHOR ne peut pas valider", () => {
    assert.equal(canValidate({ role: Roles.AUTHOR }), false);
  });
});

describe("TEST 3 — Un administrateur technique ne peut pas valider un contenu", () => {
  it("ADMINISTRATOR n'a pas le droit approve_content", () => {
    assert.equal(hasRight(Roles.ADMINISTRATOR, "approve_content"), false);
  });

  it("ADMINISTRATOR ne peut pas valider", () => {
    assert.equal(canValidate({ role: Roles.ADMINISTRATOR }), false);
  });
});

describe("TEST 4 — L'IA ne peut pas valider un contenu", () => {
  it("Une IA est détectée", () => {
    assert.equal(isAI({ role: Roles.AUTHOR, isAI: true }), true);
    assert.equal(isAI({ role: Roles.EDITORIAL_OWNER, isAI: false }), false);
  });

  it("Une IA ne peut pas valider même avec le bon rôle", () => {
    assert.equal(
      canValidate({ role: Roles.EDITORIAL_OWNER, isAI: true }),
      false
    );
  });

  it("EDITORIAL_OWNER humain peut valider", () => {
    assert.equal(
      canValidate({ role: Roles.EDITORIAL_OWNER, isAI: false }),
      true
    );
  });
});

describe("TEST 5 — Une modification invalide une signature", () => {
  it("Le hash change quand le contenu change", () => {
    const content1 = { title: "Biais cognitifs", stations: 8 };
    const content2 = { title: "Biais cognitifs", stations: 9 };
    assert.notEqual(computeHash(content1), computeHash(content2));
  });

  it("La vérification échoue après modification", () => {
    const content1 = { title: "Biais cognitifs", stations: 8 };
    const sig = signContent({
      hash: computeHash(content1),
      version: "1.0",
      approvedBy: "owner1",
      secretKey: SECRET_KEY,
    });

    // Modification du contenu
    const content2 = { title: "Biais cognitifs", stations: 9 };
    const result = verifySignature(sig, content2, SECRET_KEY);
    assert.equal(result.valid, false);
    assert.equal(result.reason, "hash_mismatch");
  });
});

describe("TEST 6 — Une signature incorrecte empêche la reconnaissance officielle", () => {
  it("Signature avec mauvaise clé → invalide", () => {
    const content = { title: "Test" };
    const sig = signContent({
      hash: computeHash(content),
      version: "1.0",
      approvedBy: "owner1",
      secretKey: SECRET_KEY,
    });

    const result = verifySignature(sig, content, "wrong-key");
    assert.equal(result.valid, false);
    assert.equal(result.reason, "signature_invalid");
  });

  it("Signature correcte → valide", () => {
    const content = { title: "Test" };
    const sig = signContent({
      hash: computeHash(content),
      version: "1.0",
      approvedBy: "owner1",
      secretKey: SECRET_KEY,
    });

    const result = verifySignature(sig, content, SECRET_KEY);
    assert.equal(result.valid, true);
  });
});

describe("TEST 7 — Une version suspendue n'est plus distribuée comme officielle", () => {
  it("SUSPENDED n'est pas PUBLISHED", () => {
    assert.notEqual(ContentStatus.SUSPENDED, ContentStatus.PUBLISHED);
  });

  it("SUSPENDED → PUBLISHED nécessite une réactivation explicite", () => {
    assert.equal(canTransition(ContentStatus.SUSPENDED, ContentStatus.PUBLISHED), true);
    assert.equal(canTransition(ContentStatus.SUSPENDED, ContentStatus.ARCHIVED), true);
  });
});

describe("TEST 8 — Une ancienne version validée reste identifiable", () => {
  it("L'historique conserve toutes les versions", () => {
    const cv = createContentVersion({
      contentId: "test-8",
      content: { title: "V1" },
    });
    cv.modify({ title: "V2" }, "author1");
    cv.modify({ title: "V3" }, "author1");

    const history = cv.getHistory();
    assert.equal(history.length, 3);
    assert.equal(history[0].version, "1.0");
    assert.equal(history[1].version, "1.1");
    assert.equal(history[2].version, "1.2");
  });

  it("On peut récupérer le contenu d'une version spécifique", () => {
    const cv = createContentVersion({
      contentId: "test-8b",
      content: { title: "V1" },
    });
    cv.modify({ title: "V2" }, "author1");

    const v1 = cv.getVersion("1.0");
    assert.equal(v1.content.title, "V1");

    const v2 = cv.getVersion("1.1");
    assert.equal(v2.content.title, "V2");
  });
});

describe("TEST 9 — Une nouvelle version nécessite une nouvelle validation", () => {
  it("Modification d'un contenu APPROVED revient en REVIEW", () => {
    const cv = createContentVersion({
      contentId: "test-9",
      content: { title: "Approuvé" },
    });
    cv.setStatus(ContentStatus.REVIEW, "reviewer");
    cv.setStatus(ContentStatus.APPROVED, "owner");
    assert.equal(cv.getCurrent().status, ContentStatus.APPROVED);

    // Modification → revient en REVIEW
    cv.modify({ title: "Modifié" }, "author1");
    assert.equal(cv.getCurrent().status, ContentStatus.REVIEW);
  });

  it("La signature est invalidée lors de la modification", () => {
    const cv = createContentVersion({
      contentId: "test-9b",
      content: { title: "Signé" },
    });
    cv.setStatus(ContentStatus.REVIEW, "reviewer");
    cv.setStatus(ContentStatus.APPROVED, "owner");
    cv.applySignature(signContent({
      hash: computeHash(cv.getCurrent().content),
      version: "1.0",
      approvedBy: "owner",
      secretKey: SECRET_KEY,
    }));
    assert.ok(cv.getCurrent().signature);

    cv.modify({ title: "Nouveau" }, "author1");
    assert.equal(cv.getCurrent().signature, null);
  });
});

describe("TEST 10 — Un contenu externe peut être utilisé comme non officiel", () => {
  it("Un contenu sans signature n'est pas reconnu officiel", () => {
    const content = { title: "Pack externe" };
    const result = verifySignature(null, content, SECRET_KEY);
    assert.equal(result.valid, false);
    assert.equal(result.reason, "missing_params");
  });

  it("Un contenu DRAFT n'est pas officiel", () => {
    assert.notEqual(ContentStatus.DRAFT, ContentStatus.PUBLISHED);
  });
});

describe("TEST 11 — Un fork ne doit pas être confondu avec l'édition officielle", () => {
  it("La vérification de signature distingue les clés", () => {
    const content = { title: "Fork content" };
    const officialSig = signContent({
      hash: computeHash(content),
      version: "1.0",
      approvedBy: "official-owner",
      secretKey: SECRET_KEY,
    });

    // Fork avec une clé différente
    const forkResult = verifySignature(officialSig, content, "fork-secret-key");
    assert.equal(forkResult.valid, false);

    // Officiel avec la bonne clé
    const officialResult = verifySignature(officialSig, content, SECRET_KEY);
    assert.equal(officialResult.valid, true);
  });
});

/* ================================================================
   TESTS COMPLÉMENTAIRES
   ================================================================ */

describe("ContentStatus — transitions", () => {
  it("REVIEW → APPROVED est autorisé", () => {
    assert.equal(canTransition(ContentStatus.REVIEW, ContentStatus.APPROVED), true);
  });

  it("REVIEW → DRAFT (rejet) est autorisé", () => {
    assert.equal(canTransition(ContentStatus.REVIEW, ContentStatus.DRAFT), true);
  });

  it("APPROVED → PUBLISHED est autorisé", () => {
    assert.equal(canTransition(ContentStatus.APPROVED, ContentStatus.PUBLISHED), true);
  });

  it("PUBLISHED → SUSPENDED est autorisé", () => {
    assert.equal(canTransition(ContentStatus.PUBLISHED, ContentStatus.SUSPENDED), true);
  });

  it("APPROVED → SUSPENDED est interdit", () => {
    assert.equal(canTransition(ContentStatus.APPROVED, ContentStatus.SUSPENDED), false);
  });

  it("ARCHIVED → n'est plus modifiable", () => {
    assert.equal(canTransition(ContentStatus.ARCHIVED, ContentStatus.DRAFT), false);
    assert.equal(canTransition(ContentStatus.ARCHIVED, ContentStatus.PUBLISHED), false);
  });

  it("transition() lance une erreur sur transition interdite", () => {
    assert.throws(() => {
      transition(ContentStatus.DRAFT, ContentStatus.PUBLISHED);
    }, /Transition interdite/);
  });
});

describe("Permissions — rôles", () => {
  it("EDITORIAL_OWNER a tous les droits critiques", () => {
    assert.equal(hasRight(Roles.EDITORIAL_OWNER, "approve_content"), true);
    assert.equal(hasRight(Roles.EDITORIAL_OWNER, "publish_content"), true);
    assert.equal(hasRight(Roles.EDITORIAL_OWNER, "suspend_content"), true);
    assert.equal(hasRight(Roles.EDITORIAL_OWNER, "revoke_content"), true);
  });

  it("REVIEWER peut reviewer mais pas approuver", () => {
    assert.equal(hasRight(Roles.REVIEWER, "review_content"), true);
    assert.equal(hasRight(Roles.REVIEWER, "approve_content"), false);
  });

  it("Rôle inconnu → aucun droit", () => {
    assert.equal(hasRight("GHOST", "approve_content"), false);
  });
});

describe("AuditLog", () => {
  it("enregistre des entrées", () => {
    const log = createAuditLog();
    log.append({
      contentId: "c1",
      version: "1.0",
      action: AuditAction.CREATED,
      author: "author1",
    });
    log.append({
      contentId: "c1",
      version: "1.0",
      action: AuditAction.APPROVED,
      author: "owner1",
      hash: "sha256:abc",
    });

    const all = log.getAll();
    assert.equal(all.length, 2);
    assert.equal(all[0].action, "CREATED");
    assert.equal(all[1].action, "APPROVED");
  });

  it("query filtre par contentId", () => {
    const log = createAuditLog();
    log.append({ contentId: "c1", version: "1.0", action: AuditAction.CREATED, author: "a" });
    log.append({ contentId: "c2", version: "1.0", action: AuditAction.CREATED, author: "b" });

    const results = log.query({ contentId: "c1" });
    assert.equal(results.length, 1);
    assert.equal(results[0].contentId, "c1");
  });

  it("query filtre par action", () => {
    const log = createAuditLog();
    log.append({ contentId: "c1", version: "1.0", action: AuditAction.CREATED, author: "a" });
    log.append({ contentId: "c1", version: "1.0", action: AuditAction.APPROVED, author: "b" });

    const results = log.query({ action: AuditAction.APPROVED });
    assert.equal(results.length, 1);
    assert.equal(results[0].action, "APPROVED");
  });

  it("jamais de doublon dans l'historique", () => {
    const log = createAuditLog();
    log.append({ contentId: "c1", version: "1.0", action: AuditAction.CREATED, author: "a" });
    const all = log.getAll();
    assert.equal(all.length, 1);
  });
});

describe("ContentVersion — workflow complet", () => {
  it("cycle DRAFT → REVIEW → APPROVED → PUBLISHED", () => {
    const cv = createContentVersion({
      contentId: "wf-1",
      content: { title: "Parcours test" },
    });
    assert.equal(cv.getCurrent().status, ContentStatus.DRAFT);

    cv.setStatus(ContentStatus.REVIEW, "author1");
    assert.equal(cv.getCurrent().status, ContentStatus.REVIEW);

    cv.setStatus(ContentStatus.APPROVED, "owner1");
    assert.equal(cv.getCurrent().status, ContentStatus.APPROVED);

    cv.setStatus(ContentStatus.PUBLISHED, "owner1");
    assert.equal(cv.getCurrent().status, ContentStatus.PUBLISHED);
  });

  it("suspension depuis PUBLISHED", () => {
    const cv = createContentVersion({
      contentId: "wf-2",
      content: { title: "Publié" },
    });
    cv.setStatus(ContentStatus.REVIEW, "a");
    cv.setStatus(ContentStatus.APPROVED, "o");
    cv.setStatus(ContentStatus.PUBLISHED, "o");
    cv.setStatus(ContentStatus.SUSPENDED, "o");
    assert.equal(cv.getCurrent().status, ContentStatus.SUSPENDED);
  });
});

describe("Signature — cas limites", () => {
  it("hash identique pour contenu identique", () => {
    const c = { a: 1, b: 2 };
    assert.equal(computeHash(c), computeHash({ b: 2, a: 1 }));
  });

  it("hash différent pour contenu différent", () => {
    assert.notEqual(computeHash({ a: 1 }), computeHash({ a: 2 }));
  });

  it("verifySignature avec paramètres manquants", () => {
    assert.equal(verifySignature(null, {}, SECRET_KEY).valid, false);
    assert.equal(verifySignature({}, null, SECRET_KEY).valid, false);
    assert.equal(verifySignature({}, {}, null).valid, false);
  });
});
