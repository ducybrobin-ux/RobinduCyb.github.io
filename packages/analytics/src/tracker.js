/* tracker.js — Collecte locale des métriques de jeu
 *
 * Stockage : localStorage key `curios_analytics_v1`
 * Zéro dépendance externe.
 *
 * Métriques trackées :
 *   - Par balise : temps, tentatives énigme, indices utilisés, timestamp
 *   - Par quiz : questions, bonnes/mauvaises, tentatives
 *   - Global : progression, blocages, timeline
 */

const STORAGE_KEY = "curios_analytics_v1";

export function createTracker(storage) {
  // storage : objet avec get(key) et set(key, value)
  // Par défaut, utilise localStorage (côté client)
  const store = storage || defaultStorage();

  function defaultStorage() {
    if (typeof localStorage === "undefined") {
      const mem = {};
      return {
        get: (k) => (mem[k] ? JSON.parse(mem[k]) : null),
        set: (k, v) => { mem[k] = JSON.stringify(v); },
      };
    }
    return {
      get: (k) => {
        try { return JSON.parse(localStorage.getItem(k)); } catch { return null; }
      },
      set: (k, v) => {
        localStorage.setItem(k, JSON.stringify(v));
      },
    };
  }

  function load() {
    return store.get(STORAGE_KEY) || {
      version: 1,
      startedAt: Date.now(),
      balises: {},
      quizzes: {},
      screens: [],
      hints: {},
    };
  }

  function save(data) {
    store.set(STORAGE_KEY, data);
  }

  // --- Balise tracking ---

  function startBalise(baliseId) {
    const data = load();
    if (!data.balises[baliseId]) {
      data.balises[baliseId] = {
        startedAt: Date.now(),
        completedAt: null,
        duration: 0,
        enigmeAttempts: 0,
        enigmeSuccess: false,
        hintsUsed: 0,
        quizAttempts: 0,
        quizScore: 0,
        quizMax: 0,
      };
    }
    data.balises[baliseId].startedAt = Date.now();
    save(data);
    return data.balises[baliseId];
  }

  function completeBalise(baliseId, stars) {
    const data = load();
    const b = data.balises[baliseId];
    if (b) {
      b.completedAt = Date.now();
      b.duration = Math.round((b.completedAt - b.startedAt) / 1000);
      b.stars = stars;
    }
    save(data);
  }

  function recordEnigmeAttempt(baliseId, correct) {
    const data = load();
    const b = data.balises[baliseId] || startBalise(baliseId);
    b.enigmeAttempts = (b.enigmeAttempts || 0) + 1;
    if (correct) b.enigmeSuccess = true;
    save(data);
    return b.enigmeAttempts;
  }

  function recordHintUsed(baliseId) {
    const data = load();
    const b = data.balises[baliseId] || startBalise(baliseId);
    b.hintsUsed = (b.hintsUsed || 0) + 1;
    save(data);
  }

  // --- Quiz tracking ---

  function startQuiz(baliseId, questionCount) {
    const data = load();
    data.quizzes[baliseId] = {
      startedAt: Date.now(),
      questions: questionCount,
      correct: 0,
      incorrect: 0,
      attempts: 0,
      completed: false,
    };
    save(data);
  }

  function recordQuizAnswer(baliseId, correct) {
    const data = load();
    const q = data.quizzes[baliseId];
    if (q) {
      if (correct) q.correct++;
      else q.incorrect++;
    }
    save(data);
  }

  function completeQuiz(baliseId, score, maxScore) {
    const data = load();
    const q = data.quizzes[baliseId];
    if (q) {
      q.completed = true;
      q.completedAt = Date.now();
      q.score = score;
      q.maxScore = maxScore;
      q.attempts = (q.attempts || 0) + 1;
    }
    save(data);
  }

  function retryQuiz(baliseId) {
    const data = load();
    const q = data.quizzes[baliseId];
    if (q) {
      q.attempts = (q.attempts || 0) + 1;
      q.correct = 0;
      q.incorrect = 0;
    }
    save(data);
  }

  // --- Screen tracking ---

  function recordScreen(screenId) {
    const data = load();
    const now = Date.now();
    if (data.screens.length > 0) {
      const last = data.screens[data.screens.length - 1];
      last.duration = Math.round((now - last.at) / 1000);
    }
    data.screens.push({ id: screenId, at: now, duration: 0 });
    // Garder les 200 derniers
    if (data.screens.length > 200) data.screens.splice(0, data.screens.length - 200);
    save(data);
  }

  // --- Hint tracking (indices gradués) ---

  function recordHintLevel(baliseId, level) {
    const data = load();
    if (!data.hints[baliseId]) data.hints[baliseId] = [];
    data.hints[baliseId].push({ level, at: Date.now() });
    save(data);
  }

  // --- Reporting ---

  function getReport() {
    const data = load();
    const balises = Object.entries(data.balises);
    const quizzes = Object.entries(data.quizzes);

    // Stats globales
    const totalBalises = balises.length;
    const completedBalises = balises.filter(([, b]) => b.completedAt).length;
    const totalDuration = balises.reduce((sum, [, b]) => sum + (b.duration || 0), 0);
    const totalEnigmeAttempts = balises.reduce((sum, [, b]) => sum + (b.enigmeAttempts || 0), 0);
    const totalHints = balises.reduce((sum, [, b]) => sum + (b.hintsUsed || 0), 0);

    // Quiz stats
    const totalQuizQuestions = quizzes.reduce((sum, [, q]) => sum + (q.questions || 0), 0);
    const totalQuizCorrect = quizzes.reduce((sum, [, q]) => sum + (q.correct || 0), 0);
    const totalQuizIncorrect = quizzes.reduce((sum, [, q]) => sum + (q.incorrect || 0), 0);

    // Détection de blocages (balise avec > 3 tentatives énigme)
    const blockages = balises
      .filter(([, b]) => (b.enigmeAttempts || 0) > 3)
      .map(([id, b]) => ({
        baliseId: id,
        attempts: b.enigmeAttempts,
        hintsUsed: b.hintsUsed || 0,
      }));

    // Top balises difficiles (par temps)
    const difficult = balises
      .filter(([, b]) => b.completedAt)
      .sort((a, b) => (b[1].duration || 0) - (a[1].duration || 0))
      .slice(0, 5)
      .map(([id, b]) => ({
        baliseId: id,
        duration: b.duration,
        enigmeAttempts: b.enigmeAttempts || 0,
      }));

    // Progression timeline
    const timeline = balises
      .filter(([, b]) => b.completedAt)
      .sort((a, b) => a[1].completedAt - b[1].completedAt)
      .map(([id, b]) => ({
        baliseId: id,
        at: b.completedAt,
        duration: b.duration,
        stars: b.stars,
      }));

    return {
      startedAt: data.startedAt,
      summary: {
        totalBalises,
        completedBalises,
        completionRate: totalBalises > 0 ? Math.round((completedBalises / totalBalises) * 100) : 0,
        totalDuration,
        totalEnigmeAttempts,
        totalHints,
        totalQuizQuestions,
        totalQuizCorrect,
        totalQuizIncorrect,
        quizAccuracy: totalQuizQuestions > 0
          ? Math.round((totalQuizCorrect / totalQuizQuestions) * 100)
          : 0,
      },
      blockages,
      difficult,
      timeline,
      screens: data.screens || [],
      balises: Object.fromEntries(balises.map(([id, b]) => [id, { ...b }])),
      quizzes: Object.fromEntries(quizzes.map(([id, q]) => [id, { ...q }])),
    };
  }

  function clear() {
    save({
      version: 1,
      startedAt: Date.now(),
      balises: {},
      quizzes: {},
      screens: [],
      hints: {},
    });
  }

  return {
    startBalise,
    completeBalise,
    recordEnigmeAttempt,
    recordHintUsed,
    startQuiz,
    recordQuizAnswer,
    completeQuiz,
    retryQuiz,
    recordScreen,
    recordHintLevel,
    getReport,
    clear,
  };
}
