# Curi🧭s

**Créez des expériences qui font apprendre.**

Moteur universel libre pour créer, publier, administrer et jouer des parcours éducatifs — jeux de piste, chasses au trésor, enquêtes, escape games, parcours citoyens, métiers, scientifiques, environnementaux…

> Le jeu n'est pas la finalité : c'est un **vecteur d'apprentissage, d'expérience et d'émancipation**.

---

## Pourquoi Curi🧭s ?

Un parcours éducatif = une application dédiée. Chaque nouveau thème = nouveau code, nouvelle maintenance, nouveau déploiement.

Curi🧭s inverse la logique :

```
1 moteur (Curi🧭s) = N parcours (données interprétables)
```

Un nouveau parcours **ne nécessite aucune modification du code** — seulement un fichier JSON.

## Fonctionnalités

| Capacité | Description |
|----------|-------------|
| **Contenu riche** | Énigmes (3 niveaux × tranches d'âge), quiz, observations, enquêtes, médias |
| **Géolocalisation** | GPS, QR codes, saisie manuelle — fonctionsne même sans réseau |
| **Hors-ligne** | PWA installable, service worker, cache intelligent |
| **Collaboratif** | Équipes, tableau de bord organisateur en temps réel |
| **Multilingue** | Français, anglais, néerlandais, allemand, chinois, japonais |
| **Scoring** | Étoiles, temps, bonus, progression, débriefing |
| **4 éditions** | Base, CEMÉA NPDC, Cristaux de Balto, TSLE1 ornithologie |
| **Studio** | Création guidée de parcours (workflow 6 étapes, export JSON) |

## Installation rapide

### Prérequis

- **Node.js 18+** (pour le serveur)
- **Un navigateur moderne** (Chrome, Firefox, Safari — le jeu fonctionne hors-ligne)

### 1. Cloner et démarrer

```bash
git clone https://github.com/ducybrobin-ux/curios.git
cd curios
```

### 2. Lancer le serveur

```bash
# PowerShell (Windows)
.\server.ps1

# Node.js (cross-platform)
node packages/server
```

Le serveur démarre sur `http://localhost:8080`.

### 3. Scanner et jouer

1. Ouvrez le dashboard organisateur : `http://localhost:8080/dashboard.html`
2. Générez un QR code d'accès Wi-Fi
3. Les participants scannent et jouent — même sans Internet

## Structure du projet

```
curios/
├── packages/              ← modules ES purs, testables, sans DOM
│   ├── game-engine/       ← missions, énigmes, scoring, progression
│   ├── geolocation/       ← GPS, distances, boussole
│   ├── offline/           ← service worker, cache, synchronisation
│   ├── content-schema/    ← validation/conversion du contenu
│   ├── server/            ← Node.js (endpoints /api/*)
│   ├── studio/            ← création guidée de parcours
│   └── analytics/         ← métriques locales, adaptation
├── content/
│   ├── packs/             ← contenu des parcours (balises, énigmes, quiz)
│   ├── editions/          ← fichiers d'édition (thème, branding)
│   └── examples/          ← exemple canonique de parcours
├── tools/                 ← CLI de build et validation
├── docs/                  ← documentation
└── tests/                 ← tests unitaires (node:test)
```

## Documentation

| Document | Contenu |
|----------|---------|
| [docs/GUIDE_FORMATEUR.md](docs/GUIDE_FORMATEUR.md) | Organiser une session Curi🧭s |
| [docs/GUIDE_PEDAGOGIQUE.md](docs/GUIDE_PEDAGOGIQUE.md) | Objectifs, compétences, évaluation |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture technique et choix |
| [docs/DATA_MODEL.md](docs/DATA_MODEL.md) | Schéma universel d'un parcours |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Plan de migration incrémental |
| [docs/AUDIT.md](docs/AUDIT.md) | Cartographie de l'existant |
| [docs/SECURITY.md](docs/SECURITY.md) | Politique de sécurité |

## Éditions disponibles

| Édition | Thème | Balises | Public cible |
|---------|-------|---------|--------------|
| **Base** | Biais cognitifs | 8 | 10-16 ans |
| **CEMÉA NPDC** | Éducation populaire | 11 | 8-14 ans |
| **Cristaux de Balto** | Nature / huskys | 9 | 6-12 ans |
| **TSLE1** | Ornithologie | 10 | 10-16 ans |

## Technologies

- **Client** : Vanilla JS/HTML/CSS — zéro framework, zéro build obligatoire
- **Serveur** : Node.js — zéro dépendance externe
- **Stockage** : localStorage + SQLite (optionnel)
- **Offline** : Service Worker + cache intelligent
- **Licence** : AGPL-3.0 (code) / CC BY-SA (documentation)

## Contribuer

Voir [CONTRIBUTING.md](CONTRIBUTING.md) pour les règles de contribution.

## Héritage

Curi🧭s prolonge [TSLE1](https://github.com/ducybrobin-ux/tsle1-sentier-oiseaux),
[JDP_BC / Multi_JDP](https://github.com/ducybrobin-ux/Multi_JDP) et leurs éditions
[CEMÉA NPDC](https://github.com/ducybrobin-ux/jpd_CEMEAnpdc) /
[Cristaux de Balto](https://github.com/ducybrobin-ux/jpd_CdB).

---

> **Règle d'or** : comprendre → extraire → tester → migrer → supprimer les doublons.
> Jamais « rewrite everything ». Chaque étape est limitée, testée, documentée.
