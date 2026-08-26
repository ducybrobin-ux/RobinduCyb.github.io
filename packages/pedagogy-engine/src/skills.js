/* skills.js — Évaluation des compétences.
 *
 * Évalue les compétences psychosociales (CPS) et pédagogiques
 * à partir des actions observées pendant le parcours.
 * Fonction pure, sans dépendance.
 */

// Compétences psychosociales (OMS)
const SKILL_DEFINITIONS = {
  cooperation: {
    label: "Coopération",
    description: "Travailler ensemble vers un objectif commun",
    indicators: ["team-completion", "help-requested"],
  },
  communication: {
    label: "Communication",
    description: "S'exprimer et écouter les autres",
    indicators: ["messages-exchanged", "debriefing-participation"],
  },
  criticalThinking: {
    label: "Esprit critique",
    description: "Analyser, évaluer, juger",
    indicators: ["hints-refused", "correct-answers"],
  },
  perseverance: {
    label: "Persévérance",
    description: "Continuer malgré les difficultés",
    indicators: ["retries", "completed-despite-difficulty"],
  },
  observation: {
    label: "Observation",
    description: "Remarquer et décrire le territoire",
    indicators: ["stations-completed", "observation-missions"],
  },
  problemSolving: {
    label: "Résolution de problèmes",
    description: "Trouver des solutions créatives",
    indicators: ["enigme-solved", "quiz-correct"],
  },
};

/**
 * Évalue les compétences à partir de la progression.
 * @param {object} params
 * @param {Array} params.progress — Progression de l'équipe
 * @param {object} params.analytics — Données analytics (optionnel)
 * @returns {object} Compétences évaluées avec niveaux
 */
export function assessSkills({ progress, analytics }) {
  const results = {};

  for (const [skillId, def] of Object.entries(SKILL_DEFINITIONS)) {
    const score = computeSkillScore(skillId, progress, analytics);
    results[skillId] = {
      id: skillId,
      label: def.label,
      description: def.description,
      level: scoreToLevel(score),
      score,
    };
  }

  return results;
}

function computeSkillScore(skillId, progress, analytics) {
  if (!progress || progress.length === 0) return 0;

  let score = 0;
  const stationCount = progress.length;
  const totalStars = progress.reduce((sum, p) => sum + (p.stars || 0), 0);
  const avgStars = stationCount > 0 ? totalStars / stationCount : 0;

  switch (skillId) {
    case "cooperation":
      // Basé sur la progression globale (équipes qui avancent ensemble)
      score = Math.min(10, stationCount * 2);
      break;

    case "communication":
      // Basé sur la participation au débriefing (si disponible)
      score = analytics?.debriefingParticipation ? 8 : 5;
      break;

    case "criticalThinking":
      // Basé sur le ratio étoiles sans indices
      const hintsUsed = analytics?.totalHints || 0;
      score = hintsUsed === 0 && avgStars >= 2 ? 9 : Math.max(3, 7 - hintsUsed);
      break;

    case "perseverance":
      // Basé sur les tentatives et la complétion
      const attempts = analytics?.totalEnigmeAttempts || stationCount;
      score = attempts > stationCount ? 7 : 5;
      break;

    case "observation":
      // Basé sur les balises complétées
      score = Math.min(10, stationCount * 1.5);
      break;

    case "problemSolving":
      // Basé sur le score moyen
      score = Math.round(avgStars * 3);
      break;

    default:
      score = 5;
  }

  return Math.max(0, Math.min(10, score));
}

function scoreToLevel(score) {
  if (score >= 8) return "avancé";
  if (score >= 6) return "intermédiaire";
  if (score >= 4) return "débutant";
  return "à dévelloper";
}

/**
 * Retourne la liste des compétences disponibles.
 * @returns {object[]}
 */
export function getSkillDefinitions() {
  return Object.entries(SKILL_DEFINITIONS).map(([id, def]) => ({
    id,
    ...def,
  }));
}
