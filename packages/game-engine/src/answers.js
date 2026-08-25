/* answers.js — Vérification de réponse à une énigme.
 *
 * compare une réponse utilisateur aux réponses acceptées (normalisées),
 * en ignorant les articles initiaux (le/la/un/une/l').
 *
 * Extrait de js/data.js (héritage Multi JDP).
 */
import { normalize } from "./normalize.js";

/**
 * Vérifie si `answer` correspond à l'une des réponses de `enigme`.
 * @param {{ reponses?: string[], answers?: string[] }} enigme
 * @param {string} answer
 * @returns {boolean}
 */
export function checkAnswer(enigme, answer) {
  const a = normalize(answer);
  if (!a) return false;
  const list = enigme.reponses ?? enigme.answers ?? [];
  return list.some(
    (r) => normalize(r) === a || normalize(r) === a.replace(/^(le |la |un |une |l )/, "")
  );
}
