/* state.js — État global du jeu.
 *
 * GameState est un objet pur, sans effet de bord.
 * Les mutations se font via des fonctions dédiées (state-reducer pattern).
 * Le state est sérialisable en JSON (pour sauvegarde / migration).
 */

/**
 * Crée un GameState vide avec des valeurs par défaut.
 * @param {object} [defaults] — surcharge des valeurs par défaut
 * @returns {object}
 */
export function createGameState(defaults = {}) {
  return {
    /* ---- Profil ---- */
    profileId: null,
    profileName: "",
    isAdmin: false,

    /* ---- Progression ---- */
    completed: [],       // IDs des balises validées
    discovered: [],      // IDs des oiseaux découverts
    riddles: {},         // { baliseId: true } énigmes résolues

    /* ---- Quiz ---- */
    quizScore: 0,
    quizTotal: 0,

    /* ---- Mode de jeu ---- */
    playMode: "classic", // "classic" | "race" | "random"
    night: false,
    sound: true,
    difficulty: "facile",

    /* ---- Graines ---- */
    seeds: 0,
    offered: [],

    /* ---- Timer ---- */
    seconds: 0,
    startTime: null,

    /* ---- Sync ---- */
    lastSync: null,

    ...defaults,
  };
}

/* ---- Reducers : fonctions pures qui retournent un NOUVEAU state ---- */

/**
 * Valider une balise.
 */
export function reduceBaliseDone(state, baliseId, birdId) {
  if (state.completed.includes(baliseId)) return state;
  return {
    ...state,
    completed: [...state.completed, baliseId],
    discovered: birdId && !state.discovered.includes(birdId)
      ? [...state.discovered, birdId]
      : state.discovered,
  };
}

/**
 * Résoudre une énigme.
 */
export function reduceRiddleSolved(state, baliseId) {
  if (state.riddles?.[baliseId]) return state;
  return {
    ...state,
    riddles: { ...state.riddles, [baliseId]: true },
  };
}

/**
 * Mettre à jour le score du quiz.
 */
export function reduceQuizScore(state, score, total) {
  return { ...state, quizScore: score, quizTotal: total };
}

/**
 * Changer de profil.
 */
export function reduceProfileChange(state, profile) {
  return {
    ...state,
    profileId: profile?.id ?? null,
    profileName: profile?.name ?? "",
    isAdmin: !!profile?.isAdmin,
    completed: profile?.completed ?? [],
    discovered: profile?.birds ?? [],
    riddles: profile?.riddles ?? {},
    seeds: profile?.seeds ?? 0,
    offered: profile?.offered ?? [],
    seconds: profile?.seconds ?? 0,
    startTime: profile?.startTime ?? null,
    playMode: profile?.playMode ?? "classic",
  };
}

/**
 * Offrir une graine.
 */
export function reduceSeedOffered(state) {
  if (state.seeds <= 0) return state;
  return { ...state, seeds: state.seeds - 1 };
}

/**
 * Changer les settings.
 */
export function reduceSettingsChange(state, settings) {
  return {
    ...state,
    night: settings?.night ?? state.night,
    sound: settings?.sound ?? state.sound,
    difficulty: settings?.difficulty ?? state.difficulty,
    playMode: settings?.race ? "race" : state.playMode,
  };
}

/**
 * Ticker du timer (toutes les N secondes).
 */
export function reduceTimerTick(state) {
  return { ...state, seconds: state.seconds + 20 };
}

/**
 * Marquer la fin du run.
 */
export function reduceRunFinished(state) {
  return { ...state, finishedAt: Date.now() };
}
