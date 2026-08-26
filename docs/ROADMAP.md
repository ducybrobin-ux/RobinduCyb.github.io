# ROADMAP — Plan de migration incrémental

> Chaque étape = un livrable vérifiable, une PR reviewable, un critère de non-régression.
> Interdit : merger deux étapes, ou « refactorer au passage ».

## PHASE 1 — Comprendre ✅

- [x] Audit complet de l'organisation → [AUDIT.md](AUDIT.md)
- [x] Architecture cible → [ARCHITECTURE.md](ARCHITECTURE.md)
- [x] Modèle de données → [DATA_MODEL.md](DATA_MODEL.md)
- [x] SERVER.md : documenter les 23 endpoints `/api/*` actuels comme spec de portage
- [x] GAME_ENGINE.md / PEDAGOGY_ENGINE.md / OFFLINE.md / EDITOR.md / AI.md / ACCESSIBILITY.md (rédigés)

## PHASE 2 — Normaliser

| # | Étape | Livrable vérifiable | Non-régression |
|---|---|---|---|
| 1 | Créer `curios`, y copier la plateforme telle quelle | build identique, jeu inchangé | ✅ fait (docs/MIGRATION.md) |
| 2 | Extraire `packages/content-schema` depuis build-data.mjs + convertisseur pack→curios | 6 packs existants convertis et validés | ✅ fait (4 packs du manifest ; TSLE1/CdB suivront à la fusion des éditions) |
| 3 | Documenter le schéma universel v1 + exemples dans content/examples | validation CLI + CI | ✅ fait (exemple-quartier.json + validate-parcours.mjs) |

## PHASE 3 — Extraire

| # | Étape | Livrable | Non-régression |
|---|---|---|---|
| 4 | Extraire `game-engine` (normalize, checkAnswer, makeQuiz, getEnigme) avec **premiers tests unitaires** | moteur importable sans DOM ; app.js consomme le module | ✅ fait (17 tests, smoke VM, CI verte) |
| 5a | Extraire `geolocation` (haversine, bearing, normDeg, cardinal) depuis audio.js/compass.js/app.js | module pur, 28 tests, app.js/compass.js/audio.js consomment GeoMath | ✅ fait (CI verte, smoke-geo, SW v9) |
| 5b | Extraire `offline` (service worker, cache registry, queue de synchronisation) | modules testés | ✅ fait (23 tests, build-sw.mjs, CI verte) |
| 6 | `pedagogy-engine` + débriefing (nouveau, inoffensif si vide) | bilan fin de parcours | ✅ fait (packages/pedagogy-engine, 14 tests, debrief.html) |

## PHASE 4 — Unifier

| # | Étape | Livrable | Non-régression |
|---|---|---|---|
| 7 | Portage serveur Node endpoint par endpoint derrière flag | script de diff réponses API ancien/nouveau | ✅ fait (packages/server, 16 tests, CI verte) |
| 8 | Auth session organisateur (token) pour endpoints sensibles | SECURITY.md appliqué | ✅ fait (auth.js, 25 tests, SECURITY.md) |
| 9 | Fusion des éditions CEMÉA/CdB/TSLE1 en `content/editions/*.json` | une base de code, 4 éditions générées | ✅ fait (4 éditions validées, build-editions.mjs, CI verte) |

## PHASE 5 — Créer

- 10 : Studio (fusion éditeur + atelier), workflow guidé objectifs→public→territoire→missions→tests→publication. ✅ fait (packages/studio, 25 tests, studio.html)

## PHASE 6 — Augmenter

- 11 : analytics locales (blocages, temps par mission), adaptation configurable (indices gradués, missions bonus), assistance IA au Studio uniquement. ✅ fait (packages/analytics, 20 tests, tracker + adaptation)

## PHASE 7 — Distribuer ✅

- 12 : packaging « télécharger → lancer → scanner → jouer » (Windows/Raspberry Pi), documentation formateur + pédagogique, releases GitHub. ✅ fait
  - ✅ documentation : README principal, GUIDE_FORMATEUR, GUIDE_PEDAGOGIQUE, README_STUDIO
  - ✅ packaging : tools/build.mjs (Windows/Linux), tools/cli.mjs, lancer-curios.bat/sh
  - ✅ releases GitHub : .github/workflows/release.yml, tools/version.mjs

## Définition du MVP (plus petit noyau utile)

1. Charger un parcours validé (`content-schema`) — existe via build-data ✅
2. Démarrer une session (`/api/session`, JSON) — ✅ fait (routes/sessions.js)
3. Créer/rejoindre une équipe — `store.js` existe ✅
4. Jouer — player existant (carte/GPS/QR/énigmes/quiz) ✅
5. Progresser — game-engine extrait (unlock, scoring) ✅
6. Terminer — `/api/finish` existe ✅
7. Produire un bilan — écran fin + débriefing ✅ (debriefing.html)

## Règles de collaboration (par étape)

1. Expliquer ce qui va être modifié et pourquoi · 2. Lister les fichiers concernés ·
3. Modification limitée · 4. Tester · 5. Vérifier la non-régression · 6. Documenter ·
7. Étape suivante.
