# @curios/game-engine

Moteur de jeu pur pour Curi🧭s — **zéro dépendance**, modules ES, importable en Node.js et dans le navigateur.

| Fonction | Rôle |
|---|---|
| `normalize(s)` | Normalisation de réponse : minuscules, accents, espaces, apostrophes |
| `checkAnswer(enigme, answer)` | Compare une réponse aux réponses acceptées (ignore les articles initiaux) |
| `makeQuiz(bird, rng?)` | Quiz mélangé avec générateur aléatoire injectable pour tests déterministes |
| `getEnigme(balise, difficulty)` | Sélection de l'énigme par difficulté (modulaire ou legacy) |

`packages/game-engine/src/index.js` — réexporte tout ; `tools/build-engine.mjs` génère la version navigateur `js/engine.js`.
