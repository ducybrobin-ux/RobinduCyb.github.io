import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  allBirds,
  getBird,
  getBalise,
  getBaliseIndex,
  nextBalise,
} from "../../packages/core/src/data-loader.js";
import { applyAdminData } from "../../packages/core/src/apply-admin.js";

/* ─── Données de test ─── */
const BIRDS = [
  { id: "alpha", nom: "Alpha", emoji: "\u{1F331}" },
  { id: "beta", nom: "Beta", emoji: "\u{1F332}" },
];

const GUIDE = [
  { id: "gamma", nom: "Gamma", emoji: "\u{1F333}" },
];

const BALISES = [
  { id: "B1", bird: "alpha", code: "JDP-B1", label: "B1" },
  { id: "B2", bird: "beta", code: "JDP-B2", label: "B2" },
  { id: "B3", bird: "gamma", code: "JDP-B3", label: "B3" },
];

const SITE = {
  name: "Jeu de piste",
  center: { lat: 50.0, lng: 3.0 },
  proximityRadius: 12,
  hintRadius: 250,
};

const TRAIL = {
  path: [[0, 0], [10, 10]],
  label: "Sentier test",
};

/* ─── data-loader ─── */
describe("allBirds", () => {
  it("concat guide et birds", () => {
    const result = allBirds(BIRDS, GUIDE);
    assert.equal(result.length, 3);
    assert.equal(result[0].id, "alpha");
    assert.equal(result[2].id, "gamma");
  });
});

describe("getBird", () => {
  it("trouve dans birds", () => {
    assert.equal(getBird("alpha", BIRDS, GUIDE).nom, "Alpha");
  });

  it("trouve dans guide", () => {
    assert.equal(getBird("gamma", BIRDS, GUIDE).nom, "Gamma");
  });

  it("retourne undefined si absent", () => {
    assert.equal(getBird("zeta", BIRDS, GUIDE), undefined);
  });
});

describe("getBalise", () => {
  it("trouve par id", () => {
    assert.equal(getBalise("B2", BALISES).bird, "beta");
  });

  it("retourne undefined si absent", () => {
    assert.equal(getBalise("B99", BALISES), undefined);
  });
});

describe("getBaliseIndex", () => {
  it("retourne l'index correct", () => {
    assert.equal(getBaliseIndex("B3", BALISES), 2);
  });

  it("retourne -1 si absent", () => {
    assert.equal(getBaliseIndex("B99", BALISES), -1);
  });
});

describe("nextBalise", () => {
  it("retourne la balise suivante", () => {
    assert.equal(nextBalise("B1", BALISES).id, "B2");
  });

  it("retourne null pour la dernière", () => {
    assert.equal(nextBalise("B3", BALISES), null);
  });

  it("retourne null si id inconnu", () => {
    assert.equal(nextBalise("B99", BALISES), null);
  });
});

/* ─── applyAdminData ─── */
describe("applyAdminData", () => {
  function freshCtx() {
    return {
      site: { ...SITE, center: { ...SITE.center } },
      trail: { ...TRAIL, path: TRAIL.path.map((p) => [...p]) },
      birds: BIRDS.map((b) => ({ ...b })),
      guide: GUIDE.map((g) => ({ ...g })),
      balises: BALISES.map((b) => ({ ...b })),
    };
  }

  it("ne fait rien si admin est null", () => {
    const ctx = freshCtx();
    applyAdminData(null, ctx);
    assert.equal(ctx.birds.length, 2);
  });

  it("patche le site", () => {
    const ctx = freshCtx();
    applyAdminData(
      { site: { name: "Nouveau parc", proximityRadius: 20 } },
      ctx
    );
    assert.equal(ctx.site.name, "Nouveau parc");
    assert.equal(ctx.site.proximityRadius, 20);
    assert.equal(ctx.site.center.lat, 50.0); // pas modifié
  });

  it("patche le centre GPS", () => {
    const ctx = freshCtx();
    applyAdminData({ site: { center: { lat: 48.5 } } }, ctx);
    assert.equal(ctx.site.center.lat, 48.5);
    assert.equal(ctx.site.center.lng, 3.0); // pas modifié
  });

  it("patche le trail", () => {
    const ctx = freshCtx();
    applyAdminData({ trail: { label: "Nouveau sentier" } }, ctx);
    assert.equal(ctx.trail.label, "Nouveau sentier");
  });

  it("ajoute une découverte", () => {
    const ctx = freshCtx();
    applyAdminData(
      { birds: { delta: { nom: "Delta", emoji: "\u{1F42E}" } } },
      ctx
    );
    assert.equal(ctx.birds.length, 3);
    assert.equal(ctx.birds[2].id, "delta");
  });

  it("modifie une découverte existante", () => {
    const ctx = freshCtx();
    applyAdminData({ birds: { alpha: { nom: "Alpha MOD" } } }, ctx);
    assert.equal(ctx.birds[0].nom, "Alpha MOD");
  });

  it("supprime des découvertes", () => {
    const ctx = freshCtx();
    applyAdminData({ removedBirds: ["beta"] }, ctx);
    assert.equal(ctx.birds.length, 1);
    assert.equal(ctx.birds[0].id, "alpha");
  });

  it("supprime les balises orphelines d'un bird supprimé", () => {
    const ctx = freshCtx();
    applyAdminData({ removedBirds: ["alpha"] }, ctx);
    assert.equal(ctx.balises[0].bird, "");
  });

  it("ajoute une balise", () => {
    const ctx = freshCtx();
    applyAdminData(
      { balises: { B10: { bird: "alpha", label: "B10" } } },
      ctx
    );
    assert.equal(ctx.balises.length, 4);
    assert.equal(ctx.balises[3].id, "B10");
  });

  it("supprime des balises", () => {
    const ctx = freshCtx();
    applyAdminData({ removedBalises: ["B2"] }, ctx);
    assert.equal(ctx.balises.length, 2);
  });

  it("surcharge le quiz", () => {
    const ctx = freshCtx();
    ctx.birds[0].quiz = [{ q: "Ancien" }];
    applyAdminData(
      { quiz: { alpha: { q: "Nouveau?", options: ["A", "B"], reponse: 0 } } },
      ctx
    );
    assert.equal(ctx.birds[0].quiz.length, 1);
    assert.equal(ctx.birds[0].quiz[0].q, "Nouveau?");
  });
});
