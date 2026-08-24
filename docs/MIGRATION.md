# MIGRATION — Journal de la migration vers DUCYB

## Étape ROADMAP #3 — Exemple canonique + validation globale (2026-08-24)

**Créé :**

- `content/examples/exemple-quartier.json` : parcours d'exemple **écrit directement
  au format universel** (preuve que le schéma tient sans héritage) — stations GPS
  et purement schématiques, énigmes ×3 niveaux, quiz lié à un personnage, mission
  d'observation, médias avec transcript, récompense, débriefing ;
- `tools/validate-parcours.mjs` : valide tous les documents `ducyb-parcours`
  (`content/ducyb-parcours/` + `content/examples/`) ;
- étape CI « Validation des documents ducyb-parcours ».

**Vérifications :** 5/5 documents valides (4 conversions + 1 exemple). ✔

**PHASE 2 — Normaliser terminée.** Prochaine étape (ROADMAP #4) : extraire
`packages/game-engine` depuis app.js avec les premiers tests unitaires.

## Étape ROADMAP #2 — content-schema + convertisseur (2026-08-24)

**Créé :** [`packages/content-schema`](../packages/content-schema/) — zéro dépendance, modules ES purs :

- `src/legacy.js` : règles de chargement/validation `jdpbc-pack` **extraites telles quelles**
  de `tools/build-data.mjs` (une seule source de vérité ; messages d'erreur identiques) ;
- `src/convert.js` : conversion déterministe pack → `ducyb-parcours` v1 +
  vérification de couverture (stations/missions/personnages/questions/notions) ;
- `src/parcours.js` : validation structurelle d'un document `ducyb-parcours`.

**Modifié :** `tools/build-data.mjs` consomme désormais le package (−138 lignes,
comportement inchangé) ; nouveau CLI `tools/convert-packs.mjs` (`--check` intégré au CI) ;
étape CI « Conversion ducyb-parcours à jour » ajoutée.

**Vérifications :**

1. `node tools/build-data.mjs --check` : OK ✔
2. Régénération complète : `js/data.js` et bundles **inchangés** (git diff vide) ✔
3. 4/4 packs convertis sans perte (couverture + validation) → `content/ducyb-parcours/` ✔
4. `node tools/convert-packs.mjs --check` : OK ✔

## Étape ROADMAP #1 — Copie de la plateforme (2026-08-24)

**Provenance :** dépôt `ducybrobin-ux/jpd`, branche `main`, commit `b9dc7f9`
(état v2.0.3, synchronisé avec `Multi_JDP`).

**Méthode :** extraction exacte de l'arborescence versionnée
(`git archive main`) — aucun fichier modifié.

**Écarts volontaires avec la source :**

| Élément | Décision |
|---|---|
| `.git/`, `data/` | Non copiés (runtime local uniquement) |
| `README.md`, `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md` | Version DUCYB conservée |
| `.gitignore` | Fusion des règles jpd (`data/`, `*.exe`, `qrcodes/`) et DUCYB (`node_modules/`, `dist/`) |
| `docs/AUDIT.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `DATA_MODEL.md` | Ajoutés (documentation fondatrice DUCYB) |

**Vérifications de non-régression effectuées :**

1. Ensemble des fichiers versionnés identique à la source (à l'exception des écarts ci-dessus) ✔
2. `node tools/build-data.mjs --check` : OK — 19 découvertes, 14 notions, 19 balises ✔
3. Syntaxe `js/*.js` : 0 erreur ✔
4. Test VM de `js/data.js` : `allBirds()` = 33 (19+14), `getBird()` OK ✔
5. Nom de fichier accentué `docs/wiki/Règles-du-jeu.md` restauré après corruption d'extraction ✔

**Prochaine étape :** ROADMAP #2 — extraire `packages/content-schema`
depuis `tools/build-data.mjs` + convertisseur pack → `ducyb-parcours`.
