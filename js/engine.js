/* engine.js — Moteur de jeu Curi🧭s (généré automatiquement depuis packages/game-engine/src/).
 * NE PAS ÉDITER DIRECTEMENT — modifier la source dans packages/game-engine/src/.
 * Régénérer : node tools/build-engine.mjs
 */
/* normalize.js — Normalisation d'une réponse textuelle.
 *
 * Minuscules, suppression des accents, normalisation des apostrophes
 * et des espaces. Fonction déterministe, pure, sans dépendance.
 *
 * Extrait de js/data.js (héritage Multi JDP).
 */

/**
 * Normalise une chaîne : minuscules, accents supprimés, espaces unifiés.
 * @param {*} s
 * @returns {string}
 */
function normalize(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[''\u2019]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* answers.js — Vérification de réponse à une énigme.
 *
 * compare une réponse utilisateur aux réponses acceptées (normalisées),
 * en ignorant les articles initiaux (le/la/un/une/l').
 *
 * Extrait de js/data.js (héritage Multi JDP).
 */

/**
 * Vérifie si `answer` correspond à l'une des réponses de `enigme`.
 * @param {{ reponses?: string[], answers?: string[] }} enigme
 * @param {string} answer
 * @returns {boolean}
 */
function checkAnswer(enigme, answer) {
  const a = normalize(answer);
  if (!a) return false;
  const list = enigme.reponses ?? enigme.answers ?? [];
  return list.some(
    (r) => normalize(r) === a || normalize(r) === a.replace(/^(le |la |un |une |l )/, "")
  );
}

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
function makeQuiz(bird, rng = Math.random) {
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

/* enigmes.js — Sélection d'une énigme par difficulté.
 *
 * Priorité au contenu modulaire (enigmes.{difficulty}),
 * fallback sur l'ancien champ `balise.enigme`.
 *
 * Extrait de js/data.js (héritage Multi JDP).
 */

/**
 * Retourne l'énigme d'une balise selon la difficulté choisie.
 * @param {{ enigmes?: Record<string, unknown>, enigme?: unknown }|null} balise
 * @param {string} [difficulty="facile"]
 * @returns {object|null}
 */
function getEnigme(balise, difficulty) {
  if (!balise) return null;
  const d = difficulty || "facile";
  if (balise.enigmes && balise.enigmes[d]) return balise.enigmes[d];
  return balise.enigme || null;
}


window.CURIOS_ENGINE = { normalize, checkAnswer, makeQuiz, getEnigme };
