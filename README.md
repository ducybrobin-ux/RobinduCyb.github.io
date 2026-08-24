# DUCYB — Du Cyb / Robin du Cyb

**Moteur universel libre pour créer, publier, administrer et jouer des parcours éducatifs** — jeux de piste, chasses au trésor, enquêtes, escape games, parcours citoyens, métiers, scientifiques, environnementaux…

> Le jeu n'est pas la finalité : c'est un **vecteur d'apprentissage, d'expérience et d'émmancipation**.

## Principe

Passer de `1 application = 1 parcours` à :

```
1 moteur (DUCYB) = N parcours (données interprétables)
```

Un nouveau parcours **ne doit pas nécessiter de modifier le cœur**.

## Statut actuel — PHASE 2 : Normaliser (étape 1/3 ✅)

La plateforme de référence (Multi JDP v2.0.3) est copiée fidèlement dans ce dépôt
([docs/MIGRATION.md](docs/MIGRATION.md)). Prochaine étape : extraction du
`content-schema` + convertisseur vers le format universel `ducyb-parcours`.

| Document | Contenu |
|---|---|
| [docs/AUDIT.md](docs/AUDIT.md) | Cartographie complète + diagnostic conserver/refactoriser/fusionner |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture cible et choix techniques argumentés |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Plan de migration incrémental (7 étapes vérifiables) |
| [docs/DATA_MODEL.md](docs/DATA_MODEL.md) | Schéma universel versionné d'un parcours |
| [docs/MIGRATION.md](docs/MIGRATION.md) | Journal de la migration (provenance + vérifications) |

## Héritage

Ce dépôt prolonge [TSLE1](https://github.com/ducybrobin-ux/tsle1-sentier-oiseaux),
[JDP_BC / Multi_JDP](https://github.com/ducybrobin-ux/Multi_JDP) et leurs éditions
[CEMÉA NPDC](https://github.com/ducybrobin-ux/jpd_CEMEAnpdc) /
[Cristaux de Balto](https://github.com/ducybrobin-ux/jpd_CdB) — qui restent
fonctionnels et publiés pendant toute la migration.

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
