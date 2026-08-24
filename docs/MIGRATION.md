# MIGRATION — Journal de la migration vers DUCYB

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
