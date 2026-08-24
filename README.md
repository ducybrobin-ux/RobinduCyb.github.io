# DUCYB — Du Cyb / Robin du Cyb

**Moteur universel libre pour créer, publier, administrer et jouer des parcours éducatifs** — jeux de piste, chasses au trésor, enquêtes, escape games, parcours citoyens, métiers, scientifiques, environnementaux…

> Le jeu n'est pas la finalité : c'est un **vecteur d'apprentissage, d'expérience et d'émmancipation**.

## Principe

Passer de `1 application = 1 parcours` à :

```
1 moteur (DUCYB) = N parcours (données interprétables)
```

Un nouveau parcours **ne doit pas nécessiter de modifier le cœur**.

## Statut actuel — PHASE 1 : Comprendre

Le projet part de l'existant éprouvé de [ducybrobin-ux](https://github.com/ducybrobin-ux) :
TSLE1 → JDP_BC → Multi_JDP (+ éditions CEMÉA NPDC et Cristaux de Balto), soit déjà
un moteur multi-packs fonctionnel, offline-first, avec serveur local, tableau de bord
organisateur et éditeur de contenu.

| Document | Contenu |
|---|---|
| [docs/AUDIT.md](docs/AUDIT.md) | Cartographie complète + diagnostic conserver/refactoriser/fusionner |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture cible et choix techniques argumentés |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Plan de migration incrémental (7 étapes vérifiables) |
| [docs/DATA_MODEL.md](docs/DATA_MODEL.md) | Schéma universel versionné d'un parcours |

## Critère de réussite architecturale

TSLE1, JDP_BC et Multi_JDP fonctionnent avec **le même moteur, le même format de
données, le même système de session, le même serveur, le même dashboard**, en
conservant leurs spécificités — puis un formateur crée un 4e parcours **sans toucher
au cœur**.

## Règle d'or

```
comprendre → extraire → tester → migrer → supprimer les doublons
```

Jamais « rewrite everything ». Chaque étape est limitée, testée, documentée.

## Licence

- Code : **AGPL-3.0**
- Documentation & contenus pédagogiques : CC BY-SA (voir LICENSE-DOCS à venir)
