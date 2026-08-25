# Curi🧭s

**Créez des expériences qui font apprendre.**

Moteur universel libre pour créer, publier, administrer et jouer des parcours éducatifs — jeux de piste, chasses au trésor, enquêtes, escape games, parcours citoyens, métiers, scientifiques, environnementaux…

> Le jeu n'est pas la finalité : c'est un **vecteur d'apprentissage, d'expérience et d'émancipation**.

## Principe

Passer de `1 application = 1 parcours` à :

```
1 moteur (Curi🧭s) = N parcours (données interprétables)
```

Un nouveau parcours **ne doit pas nécessiter de modifier le cœur**.

## Statut actuel — PHASE 3 : Extraire ✅

Le moteur de jeu pur (`packages/game-engine`) est extrait et testé (17 tests).
`packages/geolocation` extrait (28 tests, haversine/bearing/normDeg/cardinal).
`packages/offline` extrait (23 tests, service worker → module testable).
68 tests total, CI verte.
[Schéma universel documenté](content/examples/exemple-quartier.json) avec exemple canonique.
Prochaine étape : PHASE 4 — Migrer.

| Document | Contenu |
|---|---|
| [docs/AUDIT.md](docs/AUDIT.md) | Cartographie complète + diagnostic conserver/refactoriser/fusionner |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture cible et choix techniques argumentés |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Plan de migration incrémental (7 phases, étapes vérifiables) |
| [docs/DATA_MODEL.md](docs/DATA_MODEL.md) | Schéma universel versionné d'un parcours |
| [docs/MIGRATION.md](docs/MIGRATION.md) | Journal de la migration (provenance + vérifications) |

## Héritage

Curi🧭s prolonge [TSLE1](https://github.com/ducybrobin-ux/tsle1-sentier-oiseaux),
[JDP_BC / Multi_JDP](https://github.com/ducybrobin-ux/Multi_JDP) et leurs éditions
[CEMÉA NPDC](https://github.com/ducybrobin-ux/jpd_CEMEAnpdc) /
[Cristaux de Balto](https://github.com/ducybrobin-ux/jpd_CdB) — qui restent
fonctionnels et publiés pendant toute la migration.

## Règle d'or

```
comprendre → extraire → tester → migrer → supprimer les doublons
```

Jamais « rewrite everything ». Chaque étape est limitée, testée, documentée.

## Licence

- Code : **AGPL-3.0**
- Documentation & contenus pédagogiques : CC BY-SA
