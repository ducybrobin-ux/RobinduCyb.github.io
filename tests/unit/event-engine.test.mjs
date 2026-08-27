import { describe, it } from "node:test";
import assert from "node:assert/strict";

import {
  createEngine, createGameState,
  BALISE_FOUND, RIDDLE_SOLVED, QUIZ_COMPLETED, BIRD_REVEALED, RUN_FINISHED,
  isBaliseDone, isBalisePending, isRaceMode, isClassicMode,
  isRiddleSolved, isRiddlePending, isQuizPerfect,
  not, and, or,
  reduceBaliseDone, reduceRiddleSolved, reduceQuizScore,
  reduceProfileChange, reduceSettingsChange, reduceTimerTick,
  DEFAULT_RULES,
} from "../../packages/game-engine/src/index.js";

/* ================================================================
   STATE
   ================================================================ */
describe("createGameState", () => {
  it("crée un state avec des défauts", () => {
    const s = createGameState();
    assert.equal(s.completed.length, 0);
    assert.equal(s.playMode, "classic");
    assert.equal(s.difficulty, "facile");
  });

  it("accepte des overrides", () => {
    const s = createGameState({ profileId: "p1", seeds: 5 });
    assert.equal(s.profileId, "p1");
    assert.equal(s.seeds, 5);
  });
});

describe("reduceBaliseDone", () => {
  it("ajoute la balise et l'oiseau", () => {
    const s = createGameState();
    const s2 = reduceBaliseDone(s, "B1", "alpha");
    assert.deepEqual(s2.completed, ["B1"]);
    assert.deepEqual(s2.discovered, ["alpha"]);
  });

  it("n'ajoute pas en double", () => {
    const s = createGameState({ completed: ["B1"], discovered: ["alpha"] });
    const s2 = reduceBaliseDone(s, "B1", "alpha");
    assert.deepEqual(s2.completed, ["B1"]);
  });

  it("ne plante pas sans birdId", () => {
    const s = createGameState();
    const s2 = reduceBaliseDone(s, "B1", null);
    assert.deepEqual(s2.completed, ["B1"]);
    assert.deepEqual(s2.discovered, []);
  });
});

describe("reduceRiddleSolved", () => {
  it("marque l'énigme résolue", () => {
    const s = createGameState();
    const s2 = reduceRiddleSolved(s, "B1");
    assert.equal(s2.riddles.B1, true);
  });

  it("idempotent", () => {
    const s = createGameState({ riddles: { B1: true } });
    const s2 = reduceRiddleSolved(s, "B1");
    assert.equal(s2.riddles.B1, true);
  });
});

describe("reduceQuizScore", () => {
  it("met à jour le score", () => {
    const s = createGameState();
    const s2 = reduceQuizScore(s, 3, 4);
    assert.equal(s2.quizScore, 3);
    assert.equal(s2.quizTotal, 4);
  });
});

describe("reduceProfileChange", () => {
  it("applique le profil", () => {
    const s = createGameState();
    const s2 = reduceProfileChange(s, {
      id: "p1", name: "Alice", completed: ["B1"], birds: ["a"], seeds: 3,
    });
    assert.equal(s2.profileId, "p1");
    assert.equal(s2.profileName, "Alice");
    assert.deepEqual(s2.completed, ["B1"]);
    assert.equal(s2.seeds, 3);
  });
});

describe("reduceSettingsChange", () => {
  it("met à jour les settings", () => {
    const s = createGameState();
    const s2 = reduceSettingsChange(s, { night: true, difficulty: "difficile" });
    assert.equal(s2.night, true);
    assert.equal(s2.difficulty, "difficile");
  });
});

describe("reduceTimerTick", () => {
  it("incrémente de 20s", () => {
    const s = createGameState({ seconds: 40 });
    const s2 = reduceTimerTick(s);
    assert.equal(s2.seconds, 60);
  });
});

/* ================================================================
   CONDITIONS
   ================================================================ */
describe("conditions", () => {
  const state = createGameState({
    completed: ["B1"],
    riddles: { B1: true },
    playMode: "classic",
  });
  const balisePayload = { balise: { id: "B1" } };
  const balisePending = { balise: { id: "B2" } };

  it("isBaliseDone", () => {
    assert.equal(isBaliseDone(state, balisePayload), true);
    assert.equal(isBaliseDone(state, balisePending), false);
  });

  it("isBalisePending", () => {
    assert.equal(isBalisePending(state, balisePayload), false);
    assert.equal(isBalisePending(state, balisePending), true);
  });

  it("isRaceMode", () => {
    assert.equal(isRaceMode(state), false);
    assert.equal(isRaceMode({ playMode: "race" }), true);
  });

  it("isClassicMode", () => {
    assert.equal(isClassicMode(state), true);
  });

  it("isRiddleSolved", () => {
    assert.equal(isRiddleSolved(state, balisePayload), true);
    assert.equal(isRiddleSolved(state, balisePending), false);
  });

  it("isQuizPerfect", () => {
    assert.equal(isQuizPerfect(state, { score: 4, total: 4 }), true);
    assert.equal(isQuizPerfect(state, { score: 3, total: 4 }), false);
  });
});

describe("conditions combinators", () => {
  const T = () => true;
  const F = () => false;

  it("not", () => {
    assert.equal(not(T)(), false);
    assert.equal(not(F)(), true);
  });

  it("and", () => {
    assert.equal(and(T, T)(), true);
    assert.equal(and(T, F)(), false);
  });

  it("or", () => {
    assert.equal(or(F, T)(), true);
    assert.equal(or(F, F)(), false);
  });
});

/* ================================================================
   ENGINE
   ================================================================ */
describe("createEngine", () => {
  it("émet un événement et exécute les listeners", () => {
    let received = null;
    const state = createGameState();
    const engine = createEngine({
      getState: () => state,
      setState: () => {},
    });
    engine.on(BALISE_FOUND, (_s, payload) => { received = payload; });
    engine.emit(BALISE_FOUND, { balise: { id: "B1" }, mode: "qr" });
    assert.equal(received.balise.id, "B1");
  });

  it("exécute les règles matching", () => {
    let actionsRun = 0;
    const state = createGameState({ completed: [], playMode: "race" });
    let newState = state;
    const engine = createEngine({
      rules: [{
        event: BALISE_FOUND,
        conditions: [isBalisePending, isRaceMode],
        actions: [(s, p) => { actionsRun++; return reduceBaliseDone(s, p.balise.id, p.balise.bird); }],
      }],
      getState: () => newState,
      setState: (s) => { newState = s; },
    });
    engine.emit(BALISE_FOUND, { balise: { id: "B1", bird: "alpha" }, mode: "gps" });
    assert.equal(actionsRun, 1);
    assert.deepEqual(newState.completed, ["B1"]);
  });

  it("skip les règles si conditions non matchées", () => {
    let actionsRun = 0;
    const state = createGameState({ completed: ["B1"], playMode: "classic" });
    const engine = createEngine({
      rules: [{
        event: BALISE_FOUND,
        conditions: [isBalisePending],
        actions: [() => { actionsRun++; }],
      }],
      getState: () => state,
      setState: () => {},
    });
    engine.emit(BALISE_FOUND, { balise: { id: "B1" } });
    assert.equal(actionsRun, 0);
  });

  it("addRule dynamiquement", () => {
    let called = false;
    const state = createGameState();
    const engine = createEngine({
      getState: () => state,
      setState: () => {},
    });
    engine.addRule({
      event: BALISE_FOUND,
      conditions: [],
      actions: [() => { called = true; }],
    });
    engine.emit(BALISE_FOUND, {});
    assert.equal(called, true);
  });

  it("off désabonne un listener", () => {
    let count = 0;
    const state = createGameState();
    const engine = createEngine({
      getState: () => state,
      setState: () => {},
    });
    const unsub = engine.on(BALISE_FOUND, () => { count++; });
    engine.emit(BALISE_FOUND, {});
    assert.equal(count, 1);
    unsub();
    engine.emit(BALISE_FOUND, {});
    assert.equal(count, 1);
  });

  it("getRules retourne une copie", () => {
    const engine = createEngine({
      rules: DEFAULT_RULES,
      getState: () => createGameState(),
      setState: () => {},
    });
    const rules = engine.getRules();
    assert.equal(rules.length, DEFAULT_RULES.length);
    rules.pop(); // Ne doit pas modifier les originales
    assert.equal(engine.getRules().length, DEFAULT_RULES.length);
  });

  it("gère les erreurs dans les listeners sans planter", () => {
    const state = createGameState();
    let logged = false;
    const engine = createEngine({
      getState: () => state,
      setState: () => {},
      log: () => { logged = true; },
    });
    engine.on(BALISE_FOUND, () => { throw new Error("boom"); });
    engine.emit(BALISE_FOUND, {});
    assert.equal(logged, true);
  });

  it("multi-règles avec priorité", () => {
    const order = [];
    const state = createGameState({ completed: [], playMode: "classic" });
    const engine = createEngine({
      rules: [
        {
          event: BALISE_FOUND,
          conditions: [],
          actions: [() => { order.push("low"); }],
          priority: 20,
        },
        {
          event: BALISE_FOUND,
          conditions: [],
          actions: [() => { order.push("high"); }],
          priority: 10,
        },
      ],
      getState: () => state,
      setState: () => {},
    });
    engine.emit(BALISE_FOUND, {});
    assert.deepEqual(order, ["low", "high"]);
  });
});

/* ================================================================
   DEFAULT RULES
   ================================================================ */
describe("DEFAULT_RULES", () => {
  it("contient des règles pour BALISE_FOUND", () => {
    const rules = DEFAULT_RULES.filter((r) => r.event === BALISE_FOUND);
    assert.ok(rules.length >= 2);
  });

  it("contient des règles pour RIDDLE_SOLVED", () => {
    const rules = DEFAULT_RULES.filter((r) => r.event === RIDDLE_SOLVED);
    assert.ok(rules.length >= 1);
  });

  it("contient des règles pour QUIZ_COMPLETED", () => {
    const rules = DEFAULT_RULES.filter((r) => r.event === QUIZ_COMPLETED);
    assert.ok(rules.length >= 2);
  });

  it("chaque règle a event, conditions, actions", () => {
    for (const rule of DEFAULT_RULES) {
      assert.ok(typeof rule.event === "string");
      assert.ok(Array.isArray(rule.conditions));
      assert.ok(Array.isArray(rule.actions));
    }
  });
});
