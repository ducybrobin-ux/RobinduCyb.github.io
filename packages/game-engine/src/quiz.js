/* quiz.js — Construction d'un quiz mélangé à partir d'une découverte.
 *
 * Mélange les options de chaque question, remappe l'index de la bonne
 * réponse. Accepte un générateur aléatoire injectable (`rng`) pour
 * permettre des tests déterministes.
 *
 * Extrait de js/data.js (héritage Multi JDP).
 */

/**
 * Construit un quiz mélangé pour une découverte donnée.
 * @param {{ id: string, quiz: { q: string, options: string[], reponse: number }[] }} bird
 * @param {() => number} [rng=Math.random]  Générateur aléatoire 0-1 (injectable pour tests)
 * @returns {{ bird: string, num: number, q: string, options: string[], reponse: number }[]}
 */
export function makeQuiz(bird, rng = Math.random) {
  return bird.quiz.map((q, i) => {
    const entries = q.options.map((opt, j) => ({ opt, j }));
    entries.sort(() => rng() - 0.5);
    return {
      bird: bird.id,
      num: i,
      q: q.q,
      options: entries.map((e) => e.opt),
      reponse: entries.findIndex((e) => e.j === q.reponse),
    };
  });
}
