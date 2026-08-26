# EDITOR.md — Éditeur de contenu

> Édition des balises, découvertes, thèmes et quiz via `editeur.html`.
> Surcouche sur `admin-data.json`.

---

## Vue d'ensemble

L'éditeur permet de modifier le contenu du parcours **sans toucher aux fichiers sources**. Les modifications sont sauvegardées dans `admin-data.json` qui est chargé par le client et superposé aux données de base.

---

## Accès

Ouvrez `editeur.html` dans un navigateur. L'éditeur est accessible sans authentification (usage local uniquement).

---

## Fonctionnalités

### 1. Balises

| Action | Description |
|--------|-------------|
| **Modifier** | Changer le nom, la description, les coordonnées |
| **Ajouter** | Créer une nouvelle balise |
| **Supprimer** | Masquer une balise existante |

### 2. Découvertes (oiseaux / personnages)

| Action | Description |
|--------|-------------|
| **Modifier** | Changer le nom, la description, les quiz |
| **Ajouter** | Créer une nouvelle découverte |
| **Supprimer** | Masquer une découverte existante |

### 3. Quiz

| Action | Description |
|--------|-------------|
| **Modifier** | Changer les questions et réponses |
| **Ajouter** | Ajouter une question |
| **Supprimer** | Supprimer une question |

### 4. Thèmes

| Action | Description |
|--------|-------------|
| **Sélectionner** | Choisir le thème visuel |
| **Personnaliser** | Modifier les couleurs |

### 5. Images

| Action | Description |
|--------|-------------|
| **Upload** | Ajouter des images via `/api/editor/image` |
| **Supprimer** | Supprimer des images |
| **Lister** | Voir les images disponibles |

---

## Structure de `admin-data.json`

```json
{
  "site": {
    "title": "Mon parcours",
    "description": "Description du parcours"
  },
  "balises": {
    "B1": {
      "nom": "La Source",
      "description": "Une source d'eau fraîche"
    }
  },
  "birds": {
    "merle": {
      "nom": "Merle noir",
      "description": "Un oiseau noir au chant mélodieux"
    }
  },
  "quiz": {
    "merle": [
      {
        "q": "Quelle est la couleur du merle ?",
        "options": ["Noir", "Blanc", "Rouge", "Bleu"],
        "reponse": 0
      }
    ]
  },
  "removedBalises": ["B5"],
  "removedBirds": ["pie"]
}
```

---

## API associée

| Endpoint | Méthode | Rôle |
|----------|---------|------|
| `/api/editor` | GET | Récupérer admin-data.json |
| `/api/editor` | POST | Sauvegarder admin-data.json |
| `/api/editor/images` | GET | Lister les images |
| `/api/editor/image` | POST | Upload une image |
| `/api/editor/reset` | POST | Supprimer admin-data.json |

---

## Flux de travail

1. Ouvrir `editeur.html`
2. Modifier le contenu
3. Cliquer « Sauvegarder »
4. Les modifications sont appliquées au prochain rechargement

---

## Sécurité

L'éditeur est conçu pour un usage **local** (même réseau). En production, les endpoints POST nécessitent un token d'authentification.
