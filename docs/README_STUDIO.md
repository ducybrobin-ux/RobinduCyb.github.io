# Curi🧭s Studio — Créer un parcours

Le Studio est l'outil de création de parcours Curi🧭s. Il guide pas à pas la conception d'un parcours éducatif complet, de l'idée à l'export JSON.

---

## Accès

Ouvrez `studio.html` dans un navigateur. Aucune installation requise.

## Workflow en 6 étapes

Le Studio suit un workflow guidé :

```
1. Objectifs → 2. Public → 3. Territoire → 4. Missions → 5. Tests → 6. Publication
```

Chaque étape est **indépendante** : vous pouvez revenir en arrière à tout moment.

---

### Étape 1 : Objectifs

**Définir ce que les participants vont apprendre.**

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Titre** | Nom du parcours | « Les mystères du bocage » |
| **Description** | Résumé en 2-3 phrases | « Parcours de découverte de la biodiversité locale » |
| **Objectifs pédagogiques** | Ce que les participants retiendront | « Identifier 5 espèces d'oiseaux » |
| **Compétences visées** | Compétences psychosociales | « Observation, coopération, esprit critique » |

**Conseils** :
- Restez concis : un objectif = une phrase
- Pensez aux **verbes d'action** : identifier, comparer, expliquer, créer
- Adaptez au public cible

---

### Étape 2 : Public

**Définir les participants.**

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Tranche d'âge** | Âge min/max | 8-14 ans |
| **Nombre de participants** | Min/max | 10-40 |
| **Durée** | Minutes | 60-90 min |
| **Prérequis** | Connaissances nécessaires | « Aucun » |

**Conseils** :
- Un parcours = un public cible
- La durée idéale : 60-90 min (3 balises = 20 min chacune)
- Prévoyez 10% de marge pour les imprévus

---

### Étape 3 : Territoire

**Définir le lieu.**

| Champ | Description | Exemple |
|-------|-------------|---------|
| **Nom du lieu** | Identifiant | « Parc municipal de X » |
| **Adresse** | Localisation | « Rue de la Paix, 59000 Lille » |
| **Type** | Intérieur/extérieur/mixte | Extérieur |
| **Nombre de balises** | Stations | 5-10 |

**Conseils** :
- Visitez le lieu avant de créer le parcours
- Balises = points d'intérêt (arbres, bâtiments, œuvres)
- Distance idéale entre balises : 200-400 mètres

---

### Étape 4 : Missions

**Créer les énigmes et quiz.**

#### Types de missions

| Type | Description | Usage |
|------|-------------|-------|
| **Énigme** | Question avec réponse | Test de connaissances |
| **Quiz** | Choix multiples | Vérification rapide |
| **Observation** | Tâche d'observation | Développer l'œil |
| **Enquête** | Investigation | Raisonnement |
| **Média** | Audio/image/video | Multimodalité |

#### Structure d'une mission

```json
{
  "id": "m1",
  "type": "enigme",
  "difficultyLevels": {
    "facile": { "text": "...", "answers": ["réponse1"] },
    "moyen": { "text": "...", "answers": ["réponse1", "réponse2"] },
    "difficile": { "text": "...", "answers": ["réponse1"] }
  },
  "hints": [
    { "level": 1, "text": "Premier indice..." },
    { "level": 2, "text": "Deuxième indice..." }
  ]
}
```

**Conseils** :
- 1-3 missions par balise
- 3 niveaux de difficulté par mission
- Indices progressifs (pas de spoiler)
- Réponses flexibles (synonymes acceptés)

---

### Étape 5 : Tests

**Valider le parcours.**

| Test | Critère |
|------|---------|
| **Validation schéma** | JSON conforme au standard |
| **Cohérence** | Toutes les balises ont des missions |
| **Complétude** | Pas de champs vides critiques |
| **Test humain** | Parcourir soi-même le parcours |

**Erreurs courantes** :
- Réponses trop strictes (« arbre » vs « le chêne »)
- Indices trop évidents
- Balises inaccessibles
- Trop de missions → fatigue

---

### Étape 6 : Publication

**Exporter et partager.**

| Format | Usage |
|--------|-------|
| **JSON** | Import dans Curi🧭s |
| **Markdown** | Documentation imprimable |

**Options d'export** :
- Export complet (parcours + métadonnées)
- Export minimal (missions uniquement)
- Copie dans le presse-papier

---

## Raccourcis clavier

| Touche | Action |
|--------|--------|
| `Ctrl+S` | Exporter le parcours |
| `Ctrl+Z` | Annuler (undo) |
| `Ctrl+Y` | Rétablir (redo) |
| `←` | Étape précédente |
| `→` | Étape suivante |

## Historique

Le Studio conserve les **50 dernières actions**. Utilisez Ctrl+Z/Y pour naviguer.

## Exemple

Voir `content/examples/exemple-quartier.json` pour un parcours canonique complet.

---

## FAQ

**Q : Peut-on modifier un parcours exporté ?**
Oui. Le JSON est lisible et modifiable. Réimportez-le dans le Studio pour le modifier.

**Q : Combien de balises maximum ?**
Techniquement : illimité. Recommandé : 5-10 (durée limitée).

**Q : Peut-on ajouter des images ?**
Pas encore. Prévoyez les descriptions pour les alternatives textuelles.

**Q : Le parcours fonctionne-t-il hors-ligne ?**
Oui. Le JSON est statique. Le serveur n'est nécessaire que pour le temps réel.

---

*Version 1.0 — Curi🧭s Studio*
