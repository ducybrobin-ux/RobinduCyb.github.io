/* adaptation.js — Module d'adaptation configurable
 *
 * Système d'indices gradués et de missions bonus.
 * L'adaptation se base sur les analytics locales pour ajuster la difficulté.
 *
 * Niveaux d'indice :
 *   1. Indice léger (description contextuelle)
 *   2. Indice moyen (piste plus précise)
 *   3. Indice fort (réponse presque donnée)
 *
 * Missions bonus :
 *   - Débloquées après un certain score ou un certain temps
 *   - Enrichissent le parcours sans le bloquer
 */

export function createAdaptation(analytics, config = {}) {
  const defaults = {
    // Seuils de déclenchement des indices
    hintThresholds: {
      facile: { afterAttempts: 2, afterSeconds: 30 },
      moyen: { afterAttempts: 1, afterSeconds: 45 },
      difficile: { afterAttempts: 1, afterSeconds: 60 },
    },

    // Missions bonus débloquées par score
    bonusThresholds: [
      { minStars: 3, bonusId: "bonus-decouverte" },
      { minStars: 6, bonusId: "bonus-observation" },
      { minStars: 9, bonusId: "bonus-enquete" },
    ],

    // Missions bonus débloquées par temps (secondes)
    timeBonusThresholds: [
      { maxSeconds: 600, bonusId: "bonus-rapidite" },
    ],

    // Nombre max d'indices par balise
    maxHintsPerBalise: 3,

    // Seuil de blocage (nombre de tentatives avant aide renforcée)
    blockageThreshold: 3,
  };

  const cfg = { ...defaults, ...config };

  function shouldShowHint(baliseId, difficulty, attemptCount, elapsedSeconds) {
    const threshold = cfg.hintThresholds[difficulty] || cfg.hintThresholds.moyen;

    if (attemptCount >= threshold.afterAttempts) return true;
    if (elapsedSeconds >= threshold.afterSeconds) return true;

    return false;
  }

  function getHintLevel(baliseId, hintsUsed) {
    if (hintsUsed >= cfg.maxHintsPerBalise) return null;
    return hintsUsed + 1;
  }

  function getAvailableHints(enigme) {
    if (!enigme) return [];
    const hints = [];

    // Niveau 1 : première lettre ou catégorie
    if (enigme.indice) {
      hints.push({
        level: 1,
        text: enigme.indice,
        type: "description",
      });
    }

    // Niveau 2 : plus de contexte
    if (enigme.saviez) {
      hints.push({
        level: 2,
        text: enigme.saviez,
        type: "context",
      });
    }

    // Niveau 3 : réponse partielle
    if (enigme.answers && enigme.answers.length > 0) {
      const answer = enigme.answers[0];
      const firstLetter = answer.charAt(0).toUpperCase();
      hints.push({
        level: 3,
        text: `La réponse commence par "${firstLetter}" (${answer.length} lettres)`,
        type: "partial",
      });
    }

    return hints;
  }

  function getBonusMissions(totalStars, elapsedSeconds) {
    const bonuses = [];

    // Missions bonus par score
    for (const threshold of cfg.bonusThresholds) {
      if (totalStars >= threshold.minStars) {
        bonuses.push({
          id: threshold.bonusId,
          type: "score",
          threshold: threshold.minStars,
        });
      }
    }

    // Missions bonus par temps
    for (const threshold of cfg.timeBonusThresholds) {
      if (elapsedSeconds <= threshold.maxSeconds) {
        bonuses.push({
          id: threshold.bonusId,
          type: "time",
          threshold: threshold.maxSeconds,
        });
      }
    }

    return bonuses;
  }

  function isBlockage(baliseId) {
    if (!analytics) return false;
    const report = analytics.getReport();
    const baliseData = report.balises[baliseId];
    if (!baliseData) return false;

    return (baliseData.enigmeAttempts || 0) >= cfg.blockageThreshold;
  }

  function getSuggestedDifficulty(baliseId) {
    if (!analytics) return "moyen";
    const report = analytics.getReport();
    const baliseData = report.balises[baliseId];
    if (!baliseData) return "moyen";

    const attempts = baliseData.enigmeAttempts || 0;
    const hints = baliseData.hintsUsed || 0;
    const score = baliseData.stars || 0;

    // Si beaucoup de tentatives et d'indices → difficulté plus facile
    if (attempts > 3 || hints > 2) return "facile";
    // Si tout va bien → garder la difficulté demandée
    if (attempts <= 1 && hints === 0 && score > 0) return "difficile";
    return "moyen";
  }

  return {
    shouldShowHint,
    getHintLevel,
    getAvailableHints,
    getBonusMissions,
    isBlockage,
    getSuggestedDifficulty,
    config: cfg,
  };
}
