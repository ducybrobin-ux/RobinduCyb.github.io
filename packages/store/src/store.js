/* store.js — Persistance locale normalisée.
 *
 * Adaptateur de stockage injectable (localStorage, mémoire, etc.).
 * Aucune dépendance globale : BALISES, toast injectés via config.
 * Clé normalisée : "curios_data_v1" (migration automatique depuis "jdp_data_v1").
 *
 * Usage :
 *   const store = createStore({ baliseCount: 19, log: console.warn });
 *   store.createProfile("Alice", 2, "fox", "🦊");
 */

const STORAGE_KEY = "curios_data_v1";
const LEGACY_KEY = "jdp_data_v1";

const DEFAULT_SETTINGS = {
  night: false,
  sound: true,
  hints: true,
  volume: 80,
  lang: "fr",
  difficulty: "facile",
  adminOff: false,
  proximityEmoji: "faces",
  race: false,
  testerQ: false,
  alertSound: "signature",
  alertCustom: "",
  theme: "defaut",
  themePass: "Sam",
};

/**
 * Crée un store persistant.
 * @param {object} [config]
 * @param {number} [config.baliseCount=0] — nombre de balises (pour seeds par défaut)
 * @param {Function} [config.log] — fonction de log (défaut: console.warn)
 * @param {object} [config.storage] — adaptateur storage (défaut: localStorage)
 * @returns {object} — API publique du store
 */
export function createStore(config = {}) {
  const baliseCount = config.baliseCount ?? 0;
  const log = config.log ?? console.warn;
  const storage = config.storage ?? (typeof localStorage !== "undefined" ? localStorage : null);

  function _read(key) {
    if (!storage) return null;
    try { return storage.getItem(key); } catch { return null; }
  }

  function _write(key, value) {
    if (!storage) return;
    try { storage.setItem(key, value); } catch { log("Storage write failed (full?)"); }
  }

  /* ---- Migration depuis l'ancienne clé ---- */
  function migrate() {
    if (!storage) return _defaults();
    const raw = _read(STORAGE_KEY);
    if (raw) return _parse(raw);
    const legacy = _read(LEGACY_KEY);
    if (legacy) {
      const data = _parse(legacy);
      _write(STORAGE_KEY, JSON.stringify(data));
      return data;
    }
    return _defaults();
  }

  function _defaults() {
    return JSON.parse(JSON.stringify({
      settings: { ...DEFAULT_SETTINGS },
      profiles: [],
      activeProfileId: null,
    }));
  }

  function _parse(raw) {
    try {
      const parsed = JSON.parse(raw);
      return {
        settings: { ...DEFAULT_SETTINGS, ...(parsed.settings || {}) },
        profiles: Array.isArray(parsed.profiles) ? parsed.profiles : [],
        activeProfileId: parsed.activeProfileId ?? null,
      };
    } catch {
      return _defaults();
    }
  }

  const data = migrate();

  function save() {
    _write(STORAGE_KEY, JSON.stringify(data));
  }

  /* ---- Réglages ---- */
  function getSettings() { return data.settings; }

  function setSettings(patch) {
    Object.assign(data.settings, patch);
    save();
  }

  /* ---- Profils ---- */
  function getProfiles() { return data.profiles; }

  function getActive() {
    return data.profiles.find((p) => p.id === data.activeProfileId) || null;
  }

  function setActive(id) {
    data.activeProfileId = id;
    save();
  }

  function logout() {
    data.activeProfileId = null;
    save();
  }

  function createProfile(name, kids, avatar, emoji) {
    const profile = {
      id: `p${Date.now()}`,
      name: name.trim(),
      kids,
      avatar,
      emoji: emoji || "",
      introSeen: false,
      created: Date.now(),
      completed: [],
      birds: [],
      stars: 0,
      seconds: 0,
      startTime: Date.now(),
      week: weekKey(),
      seeds: baliseCount,
      offered: 0,
      offeredBirds: [],
      message: "",
      selfie: "",
      raceOpponents: [],
      raceOrder: null,
    };
    data.profiles.push(profile);
    data.activeProfileId = profile.id;
    save();
    return profile;
  }

  function deleteProfile(id) {
    data.profiles = data.profiles.filter((p) => p.id !== id);
    if (data.activeProfileId === id) {
      data.activeProfileId = data.profiles[0]?.id || null;
    }
    save();
  }

  function updateProfile(id, patch) {
    const p = data.profiles.find((x) => x.id === id);
    if (p) Object.assign(p, patch);
    save();
  }

  function resetProgress(id) {
    const p = data.profiles.find((x) => x.id === id);
    if (p) {
      p.completed = [];
      p.birds = [];
      p.stars = 0;
      p.seconds = 0;
      p.startTime = Date.now();
      p.seeds = baliseCount;
      p.offered = 0;
      p.offeredBirds = [];
    }
    save();
  }

  /* ---- Progression ---- */
  function isDone(baliseId) {
    const p = getActive();
    return p ? p.completed.includes(baliseId) : false;
  }

  function unlockBalise(baliseId, birdId, stars) {
    const p = getActive();
    if (!p) return;
    if (!p.completed.includes(baliseId)) p.completed.push(baliseId);
    if (birdId && !p.birds.includes(birdId)) p.birds.push(birdId);
    p.stars = (p.stars || 0) + (stars || 0);
    save();
  }

  function tickTimer() {
    const p = getActive();
    if (!p) return;
    const now = Date.now();
    const el = Math.round((now - (p.lastTickAt || p.startTime)) / 1000);
    p.seconds = (p.seconds || 0) + el;
    p.lastTickAt = now;
    save();
  }

  function finishWeek(profileId) {
    const p = data.profiles.find((x) => x.id === profileId);
    if (p) {
      p.finishedWeek = weekKey();
      p.finishedAt = Date.now();
    }
    save();
  }

  /* ---- Graines / connexions ---- */
  function seedsLeft(id) {
    const p = data.profiles.find((x) => x.id === id);
    return typeof p?.seeds === "number" ? p.seeds : baliseCount;
  }

  function canOffer(baliseId) {
    const p = getActive();
    return !!p && seedsLeft(p.id) > 0 && !(p.offeredBirds || []).includes(baliseId);
  }

  function offerSeed(baliseId) {
    const p = getActive();
    if (!canOffer(baliseId)) return false;
    p.seeds = seedsLeft(p.id) - 1;
    p.offeredBirds = p.offeredBirds || [];
    p.offeredBirds.push(baliseId);
    p.offered = (p.offered || 0) + 1;
    save();
    return true;
  }

  /* ---- Modes de jeu ---- */
  function raceEnabled() {
    const p = getActive();
    if (p) {
      if (p.playMode === "race") return true;
      if (p.playMode === "random" || p.playMode === "classic") return false;
    }
    return !!data.settings.race;
  }

  function randomEnabled() {
    const p = getActive();
    return !!(p && p.playMode === "random" && Array.isArray(p.raceOrder) && p.raceOrder.length);
  }

  function getRaceOrder(p) {
    if (p && Array.isArray(p.raceOrder) && p.raceOrder.length) return p.raceOrder;
    return [];
  }

  function setupRace(profileId, opponents, order) {
    const p = data.profiles.find((x) => x.id === profileId);
    if (!p) return;
    p.raceOpponents = (opponents || []).slice();
    p.raceOrder = (order || []).slice();
    save();
  }

  /* ---- Palmarès ---- */
  function weekKey() {
    const d = new Date();
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay());
    return start.toISOString().slice(0, 10);
  }

  function palmares() {
    const wk = weekKey();
    return data.profiles
      .filter((p) => p.finishedWeek === wk || (p.completed && p.completed.length >= baliseCount))
      .map((p) => ({
        name: p.name,
        avatar: p.avatar,
        emoji: p.emoji || "",
        stars: p.stars || 0,
        seconds: p.seconds || 0,
        birds: (p.birds || []).length,
        offered: p.offered || 0,
        message: p.message || "",
        selfie: p.selfie || "",
      }))
      .sort((a, b) => (b.stars - a.stars) || (a.seconds - b.seconds));
  }

  /* ---- Debug / introspection ---- */
  function _dump() {
    return JSON.parse(JSON.stringify(data));
  }

  return {
    getSettings, setSettings,
    getProfiles, getActive, setActive, logout,
    createProfile, deleteProfile, updateProfile, resetProgress,
    isDone, unlockBalise, tickTimer, finishWeek, weekKey, palmares,
    raceEnabled, randomEnabled, getRaceOrder, setupRace,
    canOffer, offerSeed, seedsLeft,
    _dump,
  };
}
