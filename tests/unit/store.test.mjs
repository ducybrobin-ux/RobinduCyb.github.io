import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { createStore } from "../../packages/store/src/index.js";

/* ---- Adaptateur storage en mémoire ---- */
function memoryStorage() {
  const map = new Map();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => map.set(k, v),
    removeItem: (k) => map.delete(k),
    clear: () => map.clear(),
    _map: map,
  };
}

function makeStore(overrides = {}) {
  return createStore({
    baliseCount: 5,
    storage: memoryStorage(),
    log: () => {},
    ...overrides,
  });
}

/* ================================================================
   CREATE / DEFAULTS
   ================================================================ */
describe("createStore", () => {
  it("crée un store vide", () => {
    const s = makeStore();
    assert.equal(s.getActive(), null);
    assert.equal(s.getProfiles().length, 0);
  });

  it("settings par défaut", () => {
    const s = makeStore();
    const settings = s.getSettings();
    assert.equal(settings.night, false);
    assert.equal(settings.sound, true);
    assert.equal(settings.difficulty, "facile");
    assert.equal(settings.theme, "defaut");
  });
});

/* ================================================================
   SETTINGS
   ================================================================ */
describe("settings", () => {
  it("setSettings patche", () => {
    const s = makeStore();
    s.setSettings({ night: true, volume: 50 });
    assert.equal(s.getSettings().night, true);
    assert.equal(s.getSettings().volume, 50);
    assert.equal(s.getSettings().sound, true); // pas écrasé
  });
});

/* ================================================================
   PROFILES
   ================================================================ */
describe("profiles", () => {
  it("createProfile crée et active", () => {
    const s = makeStore();
    const p = s.createProfile("Alice", 2, "fox", "🦊");
    assert.equal(p.name, "Alice");
    assert.equal(p.kids, 2);
    assert.equal(p.emoji, "🦊");
    assert.equal(p.seeds, 5);
    assert.equal(s.getActive().id, p.id);
  });

  it("createProfile trime le nom", () => {
    const s = makeStore();
    const p = s.createProfile("  Bob  ", 1, "cat", "");
    assert.equal(p.name, "Bob");
  });

  it("deleteProfile supprime", () => {
    const s = makeStore();
    const p = s.createProfile("Alice", 1, "cat", "");
    s.deleteProfile(p.id);
    assert.equal(s.getActive(), null);
    assert.equal(s.getProfiles().length, 0);
  });

  it("deleteProfile du profil actif bascule sur le suivant", () => {
    const s = makeStore();
    const p1 = s.createProfile("Alice", 1, "cat", "");
    s.updateProfile(p1.id, { id: "p_fixed1" }); // id fixe pour éviter collision Date.now
    s.setActive("p_fixed1");
    const p2 = s.createProfile("Bob", 2, "dog", "");
    s.updateProfile(p2.id, { id: "p_fixed2" });
    s.setActive("p_fixed2");
    s.deleteProfile("p_fixed1");
    assert.equal(s.getActive().id, "p_fixed2");
  });

  it("updateProfile patche", () => {
    const s = makeStore();
    const p = s.createProfile("Alice", 1, "cat", "");
    s.updateProfile(p.id, { name: "Alicia", emoji: "🌟" });
    assert.equal(s.getActive().name, "Alicia");
    assert.equal(s.getActive().emoji, "🌟");
  });

  it("setActive change le profil actif", () => {
    const s = makeStore();
    const p1 = s.createProfile("Alice", 1, "cat", "");
    const p2 = s.createProfile("Bob", 2, "dog", "");
    s.setActive(p1.id);
    assert.equal(s.getActive().id, p1.id);
  });

  it("logout déconnecte", () => {
    const s = makeStore();
    s.createProfile("Alice", 1, "cat", "");
    s.logout();
    assert.equal(s.getActive(), null);
  });
});

/* ================================================================
   PROGRESSION
   ================================================================ */
describe("progression", () => {
  it("isDone retourne false par défaut", () => {
    const s = makeStore();
    s.createProfile("Alice", 1, "cat", "");
    assert.equal(s.isDone("B1"), false);
  });

  it("unlockBalise marque la balise", () => {
    const s = makeStore();
    s.createProfile("Alice", 1, "cat", "");
    s.unlockBalise("B1", "alpha", 3);
    assert.equal(s.isDone("B1"), true);
    assert.equal(s.getActive().birds.includes("alpha"), true);
    assert.equal(s.getActive().stars, 3);
  });

  it("unlockBalise idempotent", () => {
    const s = makeStore();
    s.createProfile("Alice", 1, "cat", "");
    s.unlockBalise("B1", "alpha", 2);
    s.unlockBalise("B1", "alpha", 2);
    assert.equal(s.getActive().completed.length, 1);
    assert.equal(s.getActive().stars, 4); // 2+2
  });

  it("resetProgress réinitialise", () => {
    const s = makeStore();
    const p = s.createProfile("Alice", 1, "cat", "");
    s.unlockBalise("B1", "alpha", 3);
    s.resetProgress(p.id);
    assert.equal(s.isDone("B1"), false);
    assert.equal(s.getActive().stars, 0);
    assert.equal(s.getActive().seeds, 5);
  });
});

/* ================================================================
   GRAINES
   ================================================================ */
describe("seeds", () => {
  it("seedsLeft retourne le nombre initial", () => {
    const s = makeStore();
    const p = s.createProfile("Alice", 1, "cat", "");
    assert.equal(s.seedsLeft(p.id), 5);
  });

  it("canOffer retourne true si seeds > 0", () => {
    const s = makeStore();
    s.createProfile("Alice", 1, "cat", "");
    assert.equal(s.canOffer("B1"), true);
  });

  it("offerSeed décrémente et enregistre", () => {
    const s = makeStore();
    s.createProfile("Alice", 1, "cat", "");
    const ok = s.offerSeed("B1");
    assert.equal(ok, true);
    assert.equal(s.getActive().seeds, 4);
    assert.equal(s.getActive().offeredBirds.includes("B1"), true);
  });

  it("offerSeed retourne false si plus de graines", () => {
    const s = makeStore();
    s.createProfile("Alice", 1, "cat", "");
    for (let i = 0; i < 5; i++) s.offerSeed(`B${i}`);
    assert.equal(s.canOffer("B5"), false);
    assert.equal(s.offerSeed("B5"), false);
  });
});

/* ================================================================
   MODES DE JEU
   ================================================================ */
describe("game modes", () => {
  it("raceEnabled false par défaut", () => {
    const s = makeStore();
    s.createProfile("Alice", 1, "cat", "");
    assert.equal(s.raceEnabled(), false);
  });

  it("raceEnabled true si playMode=race", () => {
    const s = makeStore();
    const p = s.createProfile("Alice", 1, "cat", "");
    s.updateProfile(p.id, { playMode: "race" });
    assert.equal(s.raceEnabled(), true);
  });

  it("randomEnabled false par défaut", () => {
    const s = makeStore();
    s.createProfile("Alice", 1, "cat", "");
    assert.equal(s.randomEnabled(), false);
  });

  it("getRaceOrder retourne un tableau vide par défaut", () => {
    const s = makeStore();
    assert.deepEqual(s.getRaceOrder(), []);
  });

  it("setupRace configure les adversaires", () => {
    const s = makeStore();
    const p = s.createProfile("Alice", 1, "cat", "");
    s.setupRace(p.id, ["team2", "team3"], ["B2", "B1", "B3"]);
    const dump = s._dump();
    const stored = dump.profiles.find((x) => x.id === p.id);
    assert.deepEqual(stored.raceOpponents, ["team2", "team3"]);
    assert.deepEqual(stored.raceOrder, ["B2", "B1", "B3"]);
  });
});

/* ================================================================
   PERSISTANCE
   ================================================================ */
describe("persistence", () => {
  it("les données survivent à un nouveau store avec le même storage", () => {
    const mem = memoryStorage();
    const s1 = createStore({ baliseCount: 5, storage: mem, log: () => {} });
    s1.createProfile("Alice", 1, "cat", "🐱");
    s1.unlockBalise("B1", "alpha", 3);

    const s2 = createStore({ baliseCount: 5, storage: mem, log: () => {} });
    assert.equal(s2.getActive().name, "Alice");
    assert.equal(s2.isDone("B1"), true);
  });

  it("migration depuis la clé legacy jdp_data_v1", () => {
    const mem = memoryStorage();
    mem.setItem("jdp_data_v1", JSON.stringify({
      settings: { night: true },
      profiles: [{ id: "p1", name: "Legacy", completed: ["B1"] }],
      activeProfileId: "p1",
    }));

    const s = createStore({ baliseCount: 5, storage: mem, log: () => {} });
    assert.equal(s.getActive().name, "Legacy");
    assert.equal(s.getSettings().night, true);
    assert.ok(mem.getItem("curios_data_v1")); // migrated
  });
});

/* ================================================================
   PALMARES
   ================================================================ */
describe("palmares", () => {
  it("retourne les profils ayant fini la semaine", () => {
    const s = makeStore();
    const p = s.createProfile("Alice", 1, "cat", "");
    s.finishWeek(p.id);
    const entries = s.palmares();
    assert.equal(entries.length, 1);
    assert.equal(entries[0].name, "Alice");
  });
});
