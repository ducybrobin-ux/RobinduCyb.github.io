# AI.md — Assistance IA

> L'IA dans Curi>s est utilisée **uniquement** dans le Studio pour proposer des contenus.
> Elle n'est jamais dans le chemin d'exécution du jeu.

---

## Principes

1. **Jamais dans le chemin d'exécution** — le parcours doit tourner sans Internet ni compte externe
2. **Propositions uniquement** — l'IA suggère, l'humain valide
3. **JSON validé** — tout contenu IA est validé contre le schéma `curios-parcours`
4. **Transparence** — l'utilisateur sait que l'IA a contribué

---

## Cas d'usage dans le Studio

### 1. Génération de quiz

L'IA peut proposer des questions de quiz basées sur le thème du parcours.

**Entrée** : thème + difficulté
**Sortie** : tableau de questions avec options

```json
[
  {
    "q": "Quel est le rôle du pollinisateur ?",
    "options": ["Transporter le pollen", "Manger les fleurs", "Arroser les plantes", "Protéger les graines"],
    "reponse": 0
  }
]
```

### 2. Suggestions d'énigmes

L'IA peut proposer des énigmes adaptées au public cible.

**Entrée** : thème + tranche d'âge + difficulté
**Sortie** : texte de l'énigme + réponses acceptées

### 3. Descriptions de balises

L'IA peut rédiger des descriptions pour les balises.

**Entrée** : nom + lieu + thème
**Sortie** : description courte

---

## Intégration technique

L'assistance IA est déconnectée du moteur de jeu :

```
Studio → API IA (optionnel) → JSON → Validation schéma → Enregistrement
    ↓
Moteur de jeu → Lit le JSON → Jamais d'appel IA
```

**Modules concernés** :
- `packages/studio/` — propose l'intégration IA
- `packages/content-schema/` — valide le JSON généré

---

## Limitations

| Limite | Raison |
|--------|--------|
| Pas d'IA en temps réel | Offline-first |
| Pas de tracking | Données locales |
| Pas de compte externe | Sécurité vie privée |
| Validation obligatoire | Qualité du contenu |

---

## Futur

Si une intégration IA est ajoutée :

1. **Module optionnel** `@curios/ai` dans `packages/ai/`
2. **Clé API configurable** (pas de clé par défaut)
3. **Cache local** des suggestions (éviter les appels répétés)
4. **Fallback gracieux** si pas d'Internet (contenu par défaut)
5. **Attribution** marquée dans le JSON (`"aiGenerated": true`)

---

## Alternative : contenu par défaut

Sans IA, le Studio fournit des templates de contenu par défaut :

- Quiz standards (culture générale, observation, logique)
- Énigmes types (devinettes, associations, calculs)
- Descriptions génériques modifiables

Ces templates sont inclus dans `packages/studio/templates/`.
