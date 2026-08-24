# ROADMAP — Plan de migration incrémental

> Chaque étape = un livrable vérifiable, une PR reviewable, un critère de non-régression.
> Interdit : merger deux étapes, ou « refactorer au passage ».

## PHASE 1 — Comprendre ✅ (en cours)

- [x] Audit complet de l'organisation → [AUDIT.md](AUDIT.md)
- [x] Architecture cible → [ARCHITECTURE.md](ARCHITECTURE.md)
- [x] Modèle de données → [DATA_MODEL.md](DATA_MODEL.md)
- [ ] SERVER.md : documenter les 18 endpoints `/api/*` actuels comme spec de portage
- [ ] GAME_ENGINE.md / PEDAGOGY_ENGINE.md / OFFLINE.md / EDITOR.md / AI.md /
      ACCESSIBILITY.md (rédigés juste avant leur implémentation)

## PHASE 2 — Normaliser

| # | Étape | Livrable vérifiable | Non-régression |
|---|---|---|---|
| 1 | Créer `ducyb`, y copier la plateforme telle quelle | build identique, jeu inchangé | diff comportemental nul |
| 2 | Extraire `packages/content-schema` depuis build-data.mjs + convertisseur pack→ducyb | 6 packs existants convertis et validés | aller-retour JSON identique |
| 3 | Documenter le schéma universel v1 + exemples dans content/examples | validation CLI + CI | — |

## PHASE 3 — Extraire

| # | Étape | Livrable | Non-régression |
|---|---|---|---|
| 4 | Extraire `game-engine` (unlock, checkAnswer, quiz, scoring) avec **premiers tests unitaires** | moteur importable sans DOM ; app.js consomme le module | parcours rejoué à l'identique |
| 5 | Extraire `geolocation` + `offline` (code existant déplacé) | modules testés | idem |
| 6 | `pedagogy-engine` + débriefing (nouveau, inoffensif si vide) | bilan fin de parcours | optionnel |

## PHASE 4 — Unifier

| # | Étape | Livrable | Non-régression |
|---|---|---|---|
| 7 | Portage serveur Node endpoint par endpoint derrière flag | script de diff réponses API ancien/nouveau | dashboard fonctionne sur les deux serveurs |
| 8 | Auth session organisateur (token) pour endpoints sensibles | SECURITY.md appliqué | participants non affectés |
| 9 | Fusion des éditions CEMÉA/CdB en `content/editions/*.json` | une base de code, 4 éditions générées | Pages + releases identiques aux forks |

## PHASE 5 — Créer

- 10 : Studio (fusion éditeur + atelier), workflow guidé objectifs→public→territoire→missions→tests→publication.

## PHASE 6 — Augmenter

- 11 : analytics locales (blocages, temps par mission), adaptation configurable (indices gradués, missions bonus), assistance IA au Studio uniquement.

## PHASE 7 — Distribuer

- 12 : packaging « télécharger → lancer → scanner → jouer » (Windows/Raspberry Pi), documentation formateur + pédagogique, releases GitHub.

## Définition du MVP (plus petit noyau utile)

1. Charger un parcours validé (`content-schema`) — existe via build-data
2. Démarrer une session (`/api/session`, SQLite) — nouveau, trivial
3. Créer/rejoindre une équipe — `store.js` existe
4. Jouer — player existant (carte/GPS/QR/énigmes/quiz)
5. Progresser — game-engine extrait (unlock, scoring)
6. Terminer — `/api/finish` existe
7. Produire un bilan — écran fin + première question de débriefing

## Règles de collaboration (par étape)

1. Expliquer ce qui va être modifié et pourquoi · 2. Lister les fichiers concernés ·
3. Modification limitée · 4. Tester · 5. Vérifier la non-régression · 6. Documenter ·
7. Étape suivante.
