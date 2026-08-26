/* debrief.js — Génération du bilan de parcours.
 *
 * Produit un résumé pédagogique à partir de la progression d'une équipe.
 * Fonction pure, sans dépendance.
 */

/**
 * Génère le bilan de fin de parcours.
 * @param {object} params
 * @param {string} params.teamName — Nom de l'équipe
 * @param {Array} params.progress — Liste des passages aux balises
 * @param {number} params.totalStars — Total d'étoiles gagnées
 * @param {number} params.durationSeconds — Durée en secondes
 * @param {object} params.parcours — Données du parcours (optionnel)
 * @returns {object} Bilan structuré
 */
export function generateDebrief({ teamName, progress, totalStars, durationSeconds, parcours }) {
  const stationCount = progress.length;
  const avgStars = stationCount > 0 ? (totalStars / stationCount).toFixed(1) : 0;

  // Calcul du temps moyen par balise
  const avgTimePerStation = stationCount > 0
    ? Math.round(durationSeconds / stationCount)
    : 0;

  // Identification des points forts et faibles
  const strengths = [];
  const weaknesses = [];

  for (const p of progress) {
    if (p.stars >= 3) strengths.push(p.stationId || p.station || "Balise");
    if (p.stars <= 1) weaknesses.push(p.stationId || p.station || "Balise");
  }

  // Messages selon la performance
  const performance = getPerformanceLevel(avgStars);

  // Questions de débriefing adaptées
  const questions = generateQuestions(performance, stationCount);

  return {
    team: teamName,
    summary: {
      totalStars,
      stationCount,
      avgStars: Number(avgStars),
      durationSeconds,
      avgTimePerStation,
      performance,
    },
    strengths,
    weaknesses,
    questions,
    message: getMessage(performance, teamName),
  };
}

function getPerformanceLevel(avgStars) {
  if (avgStars >= 2.5) return "excellent";
  if (avgStars >= 2) return "good";
  if (avgStars >= 1.5) return "average";
  return "needs-improvement";
}

function getMessage(performance, teamName) {
  const messages = {
    excellent: `Bravo ${teamName} ! Vous avez realizado un parcours exceptionnel. Vos observations et réflexions étaient remarquables.`,
    good: `Très bien ${teamName} ! Votre parcours était solide. Vous avez su coopérer et observer le territoire.`,
    average: `Bien joué ${teamName} ! Vous avez complété le parcours. Il y a toujours place à l'amélioration.`,
    "needs-improvement": `${teamName}, vous avez persévéré jusqu'au bout ! Chaque tentative est un apprentissage.`,
  };
  return messages[performance] || messages.average;
}

function generateQuestions(performance, stationCount) {
  const base = [
    "Qu'avez-vous appris aujourd'hui ?",
    "Comment avez-vous travaillé en équipe ?",
  ];

  if (performance === "excellent") {
    return [
      ...base,
      "Quelle stratégie avez-vous utilisée pour résoudre les énigmes ?",
      "Que retiendrez-vous de cette expérience ?",
    ];
  }

  if (performance === "needs-improvement") {
    return [
      ...base,
      "Qu'est-ce qui était le plus difficile ?",
      "Comment pourriez-vous faire mieux la prochaine fois ?",
    ];
  }

  return [
    ...base,
    "Quelle balise préférez-vous et pourquoi ?",
    "Avez-vous utilisé les indices ? Était-ce utile ?",
  ];
}
