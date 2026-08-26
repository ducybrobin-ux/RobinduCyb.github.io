/* progress.js — Calcul de progression.
 *
 * Calcule la progression d'une équipe à partir de ses validations
 * et de la structure du parcours.
 * Fonction pure, sans dépendance.
 */

/**
 * Calcule la progression complète d'une équipe.
 * @param {object} params
 * @param {Array} params.validations — IDs des balises validées
 * @param {Array} params.stations — Liste des stations du parcours
 * @param {Array} params.progress — Détail des passages (optionnel)
 * @returns {object} Progression structurée
 */
export function computeProgress({ validations, stations, progress }) {
  const totalStations = stations.length;
  const validatedCount = validations.length;
  const completionRate = totalStations > 0
    ? Math.round((validatedCount / totalStations) * 100)
    : 0;

  // Détail par station
  const stationDetails = stations.map((station) => {
    const isValidated = validations.includes(station.id);
    const progressEntry = progress?.find((p) => p.stationId === station.id);

    return {
      id: station.id,
      label: station.label || station.nom || station.id,
      validated: isValidated,
      stars: progressEntry?.stars || 0,
      attempts: progressEntry?.attempts || 0,
      hintsUsed: progressEntry?.hintsUsed || 0,
      timeSpent: progressEntry?.timeSpent || 0,
    };
  });

  // Statistiques
  const totalStars = stationDetails.reduce((sum, s) => sum + s.stars, 0);
  const maxStars = totalStations * 3; // 3 étoiles max par station
  const starsRate = maxStars > 0 ? Math.round((totalStars / maxStars) * 100) : 0;

  const totalTime = stationDetails.reduce((sum, s) => sum + s.timeSpent, 0);
  const totalTimeWithPenalties = totalTime + stationDetails.reduce((sum, s) => sum + (s.hintsUsed * 30), 0);

  // Stations non validées
  const remaining = stationDetails.filter((s) => !s.validated);

  return {
    totalStations,
    validatedCount,
    completionRate,
    totalStars,
    maxStars,
    starsRate,
    totalTime,
    totalTimeWithPenalties,
    stations: stationDetails,
    remaining: remaining.map((s) => s.id),
    isComplete: validatedCount === totalStations,
  };
}

/**
 * Calcule le classement d'une équipe par rapport aux autres.
 * @param {object} params
 * @param {object} params.teamProgress — Progression de l'équipe
 * @param {Array} params.allProgress — Progressions de toutes les équipes
 * @returns {object} Classement
 */
export function computeRanking({ teamProgress, allProgress }) {
  if (!allProgress || allProgress.length === 0) {
    return { rank: 1, total: 1, percentile: 100 };
  }

  // Tri par étoiles décroissantes, puis temps croissant
  const sorted = [...allProgress].sort((a, b) => {
    if (b.totalStars !== a.totalStars) return b.totalStars - a.totalStars;
    return a.totalTime - b.totalTime;
  });

  const rank = sorted.findIndex((p) => p.teamId === teamProgress.teamId) + 1;

  return {
    rank: rank || sorted.length + 1,
    total: sorted.length,
    percentile: Math.round(((sorted.length - rank + 1) / sorted.length) * 100),
  };
}
