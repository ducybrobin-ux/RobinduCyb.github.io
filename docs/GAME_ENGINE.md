# GAME_ENGINE.md — Moteur de jeu `@curios/game-engine`

> Module ES pur, sans DOM, sans dépendance externe.
> Extrait de `js/data.js` (héritage Multi JDP).
> 17 tests unitaires.

---

## Vue d'ensemble

Le moteur de jeu fournit 4 fonctions pures pour gérer le contenu interactif :

| Fonction | Rôle |
|----------|------|
| `normalize` | Normalisation de texte (réponses) |
| `checkAnswer` | Vérification de réponse à une énigme |
| `makeQuiz` | Construction d'un quiz mélangé |
| `getEnigme` | Sélection d'énigme par difficulté |

---

## API

### `normalize(s: string): string`

Normalise une chaîne pour comparaison.

**Étapes** :
1. Minuscules
2. Suppression des accents (NFD → regex)
3. Normalisation des apostrophes (`'` `'` `'` → espace)
4. Unification des espaces

**Exemple** :
```js
normalize("L'arbre de ma grand-mère")
// → "l arbre de ma grand mere"
```

**Propriétés** :
- Pure (même entrée → même sortie)
- Déterministe
- Sans dépendance

---

### `checkAnswer(enigme, answer): boolean`

Vérifie si `answer` correspond à l'une des réponses acceptées.

**Paramètres** :
- `enigme` : `{ reponses?: string[], answers?: string[] }` — énigme avec réponses
- `answer` : `string` — réponse de l'utilisateur

**Logique** :
1. Normalise la réponse utilisateur
2. Compare à chaque réponse normalisée de l'énigme
3. Ignore les articles initiaux (`le`, `la`, `un`, `une`, `l'`)

**Exemple** :
```js
const enigme = { answers: ["chêne", "le chêne"] };
checkAnswer(enigme, "Un chêne")  // true
checkAnswer(enigme, "chene")     // true (accent supprimé)
checkAnswer(enigme, "sapin")     // false
```

**Rétrocompatibilité** : Accepte `reponses` (fr) ou `answers` (en).

---

### `makeQuiz(bird, rng?): QuizQuestion[]`

Construit un quiz mélangé pour une découverte.

**Paramètres** :
- `bird` : `{ id: string, quiz: { q: string, options: string[], reponse: number }[] }`
- `rng` : `() => number` — générateur aléatoire 0-1 (défaut : `Math.random`)

**Retour** :
```js
[
  {
    bird: "id-oiseau",
    num: 0,
    q: "Question ?",
    options: ["A", "B", "C", "D"],  // mélangées
    reponse: 2                        // index de la bonne réponse
  }
]
```

**Propriétés** :
- Mélange les options de chaque question
- Remappe l'index de la bonne réponse
- Injectable `rng` pour tests déterministes

**Exemple** :
```js
const bird = {
  id: "merle",
  quiz: [
    { q: "Couleur ?", options: ["Noir", "Blanc", "Rouge"], reponse: 0 }
  ]
};
const quiz = makeQuiz(bird, () => 0.5);
// options mélangées, reponse remappée
```

---

### `getEnigme(balise, difficulty?): Enigme | null`

Sélectionne l'énigme selon la difficulté.

**Paramètres** :
- `balise` : `{ enigmes?: Record<string, Enigme>, enigme?: Enigme }`
- `difficulty` : `"facile" | "moyen" | "difficile"` (défaut : `"facile"`)

**Logique** :
1. Si `balise.enigmes[difficulty]` existe → le retourner
2. Sinon → retourner `balise.enigme` (fallback)
3. Sinon → `null`

**Exemple** :
```js
const balise = {
  enigmes: {
    facile: { text: "Facile", answers: ["a"] },
    moyen: { text: "Moyen", answers: ["b"] },
    difficile: { text: "Difficile", answers: ["c"] }
  }
};
getEnigme(balise, "moyen")  // { text: "Moyen", answers: ["b"] }
getEnigme(balise, "expert") // { text: "Moyen", answers: ["b"] } (fallback)
```

---

## Structure d'une énigme

```js
{
  text: "Description de l'énigme",
  answers: ["réponse1", "réponse2"],  // réponses acceptées
  ages: [10, 13],                     // tranche d'âge
  indice: "Premier indice",           // indice niveau 1
  saviez: "Le saviez-vous ?",         // indice niveau 2
  media: { id: "img1", type: "image" } // média associé
}
```

---

## Structure d'un quiz

```js
{
  q: "Question ?",
  options: ["A", "B", "C", "D"],
  reponse: 0  // index de la bonne réponse
}
```

---

## Intégration

```js
import { normalize, checkAnswer, makeQuiz, getEnigme } from "@curios/game-engine";

// Dans le client
const enigme = getEnigme(balise, difficulty);
if (checkAnswer(enigme, userAnswer)) {
  // Bonne réponse !
}
```

---

## Tests

```bash
node --test tests/unit/game-engine.test.mjs
```

**17 tests** couvrant :
- `normalize` : accents, apostrophes, espaces
- `checkAnswer` : articles, normalisation, réponses multiples
- `makeQuiz` : mélange, remappage, rng injectable
- `getEnigme` : fallback, difficultés

---

*Document généré depuis `packages/game-engine/src/*.js`*
