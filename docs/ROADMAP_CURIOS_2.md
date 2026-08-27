# ROADMAP CURIOS 2.0

> Organisation par dépendances — chaque phase ne commence que lorsque la précédente est validée.
> Référence : `docs/AUDIT_CURIOS_2.md`

---

## Vue d'ensemble

```
PHASE 0  Audit                              ← TERMINÉ
   ↓
PHASE 1  Fondation                          ← DÉBUTER ICI
   │   core (EventBus, Router, DOM utils)
   │   + ESLint/Prettier
   │   + tests couverture
   │
   ↓
PHASE 2  Données
   │   extraire data.js → JSON
   │   unifier content-schema + data.js
   │
   ↓
PHASE 3  Event Engine
   │   EVENT → CONDITION → ACTION → STATE
   │   + scénarios PHANTOM comme validation
   │
   ↓
PHASE 4  Session Engine
   │   SQLite côté serveur
   │   schema session (teams, progression, events)
   │   + persistence state
   │
   ↓
PHASE 5  Offline amélioré
   │   IndexedDB queue
   │   retry automatique
   │   sync post-reconnexion
   │
   ↓
PHASE 6  Player
   │   décomposer app.js → modules ES
   │   router, screens, telemetry, compass-ui
   │
   ↓
PHASE 7  Dashboard
   │   SSE/WebSocket temps réel
   │   remplacer inline JS
   │   modules indépendants
   │
   ↓
PHASE 8  Studio + Éditeur
   │   compléter le wizard
   │   modulariser editeur.html
   │   preview temps réel
   │
   ↓
PHASE 9  Pedagogy Engine
   │   débriefing natif connecté
   │   bilan pédagogique automatique
   │
   ↓
PHASE 10 PHANTOM
   │   parcours showcase complet
   │   exploitation maximale des capacités
   │
   ↓
PHASE 11 IA assistée
   │   Studio only
   │   proposition → validation humaine
   │
   ↓
PHASE 12 Packaging
       binaires, Docker
       distributions optimisées
```

---

## PHASE 0 — AUDIT ✅

**Statut :** Terminé

**Livrables :**
- `docs/AUDIT_CURIOS_2.md`
- `docs/ROADMAP_CURIOS_2.md` (ce document)

---

## PHASE 1 — FONDATION

**Objectif :** Poser les bases techniques pour toutes les phases suivantes.

**Dépendances :** Aucune (point de départ).

### Étape 1.1 — Outils de qualité

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Ajouter ESLint + configuration | `eslint.config.js`, `package.json` (racine) | HAUTE |
| Ajouter Prettier + configuration | `.prettierrc`, `package.json` (racine) | HAUTE |
| Linter tout le code existant | Tous les fichiers JS | HAUTE |
| Ajouter c8 pour la couverture | `package.json`, scripts | MOYENNE |
| Couverture cible : > 80% sur packages/ | Tests existants | MOYENNE |

### Étape 1.2 — Core (utils partagés)

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Créer `packages/shared/` | `packages/shared/src/{escape.js,dom.js,debounce.js,throttle.js}` | HAUTE |
| Extraire `esc()` dedans | `js/app.js`, `js/board.js`, `editeur.html`, `studio.html` → import shared | HAUTE |
| Extraire `$()` dedans | `js/app.js`, `js/board.js` → import shared | HAUTE |
| Créer un EventBus simple | `packages/shared/src/event-bus.js` | HAUTE |
| Tests pour shared | `tests/unit/shared.test.mjs` | HAUTE |

### Étape 1.3 — Tests couverture

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Analyser la couverture actuelle | `c8 node --test tests/unit/*.test.mjs` | HAUTE |
| Identifier les zones non couvertes | Rapport c8 | HAUTE |
| Ajouter tests pour les zones critiques | `tests/unit/` | HAUTE |

**Validation :**
- ESLint passe sans erreur
- Prettier格式统一
- Couverture > 80% sur packages/
- `node tools/cli.mjs test` passe

---

## PHASE 2 — DONNÉES

**Objectif :** Unifier les sources de données. Le contenu JSON est la seule source de vérité.

**Dépendances :** Phase 1 (shared utils).

### Étape 2.1 — Extraire data.js en JSON

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Convertir BIRDS en JSON | `content/data/birds.json` | CRITIQUE |
| Convertir BALISES en JSON | `content/data/balises.json` | CRITIQUE |
| Convertir GUIDE en JSON | `content/data/guide.json` | CRITIQUE |
| Convertir SITE en JSON | `content/data/site.json` | CRITIQUE |
| Convertir TRAIL en JSON | `content/data/trail.json` | CRITIQUE |
| Convertir THEMES en JSON | `content/data/themes.json` (existe déjà) | HAUTE |
| Créer un loader | `packages/core/src/data-loader.js` | CRITIQUE |
| Remplacer les constantes globales | `js/data.js` → import dynamique | CRITIQUE |

### Étape 2.2 — Unifier content-schema

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Fusionner les validateurs | `packages/content-schema/src/` | HAUTE |
| Unifier les formats | `jdpbc-pack` → `curios-parcours` v1 | HAUTE |
| Ajouter une validation pack→JSON | `tools/validate-data.mjs` | HAUTE |
| Mettre à jour le build pipeline | `tools/build-data.mjs` | HAUTE |

### Étape 2.3 — applyAdminData → Éditeur

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Déplacer `applyAdminData()` | `js/data.js` → `packages/core/src/admin-override.js` | MOYENNE |
| Tests unitaires | `tests/unit/admin-override.test.mjs` | MOYENNE |

**Validation :**
- Les JSON sont valides et couvrent toutes les entités
- Le loader fonctionne en Node.js et dans le navigateur
- Les données existantes ne changent pas
- Le build pipeline produit les mêmes bundles

---

## PHASE 3 — EVENT ENGINE

**Objectif :** Créer un moteur d'événements générique. Un parcours est décrit comme une séquence EVENT → CONDITION → ACTION → STATE CHANGE.

**Dépendances :** Phase 2 (données structurées).

### Étape 3.1 — Schéma d'événements

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Définir les types d'événements | `packages/event-engine/src/events.js` | CRITIQUE |
| Définir les types de conditions | `packages/event-engine/src/conditions.js` | CRITIQUE |
| Définir les types d'actions | `packages/event-engine/src/actions.js` | CRITIQUE |
| Définir les transitions d'état | `packages/event-engine/src/state.js` | CRITIQUE |

### Étape 3.2 — Moteur central

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Implémenter `createEventEngine()` | `packages/event-engine/src/index.js` | CRITIQUE |
| Implémenter `processEvent(event)` | `packages/event-engine/src/engine.js` | CRITIQUE |
| Implémenter `evaluateConditions()` | `packages/event-engine/src/conditions.js` | CRITIQUE |
| Implémenter `executeActions()` | `packages/event-engine/src/actions.js` | CRITIQUE |
| Implémenter `updateState()` | `packages/event-engine/src/state.js` | CRITIQUE |

### Étape 3.3 — Événements standards

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| QR_SCANNED | `packages/event-engine/src/events.js` | HAUTE |
| GPS_REACHED | idem | HAUTE |
| ANSWER_SUBMITTED | idem | HAUTE |
| TIMER_EXPIRED | idem | HAUTE |
| ITEM_FOUND | idem | HAUTE |
| MISSION_COMPLETED | idem | HAUTE |
| PLAYER_JOINED | idem | HAUTE |
| TEAM_CREATED | idem | HAUTE |

### Étape 3.4 — Actions standards

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| UNLOCK_MISSION | `packages/event-engine/src/actions.js` | HAUTE |
| LOCK_MISSION | idem | HAUTE |
| GIVE_HINT | idem | HAUTE |
| ADD_SCORE | idem | HAUTE |
| PLAY_AUDIO | idem | HAUTE |
| SHOW_MESSAGE | idem | HAUTE |
| VIBRATE | idem | HAUTE |
| COMPLETE_GAME | idem | HAUTE |

### Étape 3.5 — Validation avec PHANTOM

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Décrire PHANTOM en événements | `content/packs/phantom-cybersecurite/events.json` | HAUTE |
| Simuler le scénario complet | `tests/integration/phantom-scenario.test.mjs` | HAUTE |
| Vérifier que le moteur gère le scénario sans code spécifique | Tests | HAUTE |

### Étape 3.6 — Documentation + tests

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Documenter l'Event Engine | `docs/EVENT_ENGINE.md` | HAUTE |
| Tests unitaires complets | `tests/unit/event-engine.test.mjs` | CRITIQUE |
| Tests d'intégration scénarios | `tests/integration/` | HAUTE |

**Validation :**
- Le moteur peut exécuter le scénario PHANTOM complet
- Aucune modification du moteur n'est nécessaire pour un nouveau parcours
- Tous les événements standards fonctionnent
- Tests > 90% de couverture

---

## PHASE 4 — SESSION ENGINE

**Objectif :** Gérer les sessions de jeu côté serveur avec persistance.

**Dépendances :** Phase 3 (event engine pour les événements de session).

### Étape 4.1 — SQLite

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Ajouter better-sqlite3 ou sql.js | `packages/server/package.json` | HAUTE |
| Créer le schéma DB | `packages/server/src/db/schema.sql` | HAUTE |
| Créer le layer d'accès | `packages/server/src/db/store.js` | HAUTE |
| Migrer les données JSON → SQLite | `packages/server/src/db/migrate.js` | HAUTE |

### Étape 4.2 — Modèle de session

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Schema : sessions, teams, events, progress | `packages/server/src/db/schema.sql` | CRITIQUE |
| Routes : session CRUD | `packages/server/src/routes/sessions.js` | CRITIQUE |
| Routes : team CRUD | idem | CRITIQUE |
| Routes : event log | idem | CRITIQUE |
| Routes : progress read | idem | CRITIQUE |

### Étape 4.3 — Persistance

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Remplacer le state in-memory | `packages/server/src/state.js` → DB | HAUTE |
| Sauvegarde automatique | DB WAL mode | HAUTE |
| Survie au redémarrage | Tests | HAUTE |
| Purge configurable | TTL sur les données | MOYENNE |

### Étape 4.4 — Débriefing connecté

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Route : GET /api/session/:id/debrief | `packages/server/src/routes/sessions.js` | HAUTE |
| Connecter debriefing.html à la vraie session | `debriefing.html` | HAUTE |
| Utiliser pedagogy-engine pour le bilan | `packages/pedagogy-engine/` | HAUTE |

**Validation :**
- Le serveur survit à un redémarrage sans perte de données
- Les sessions, teams et events sont persistés
- Le débriefing affiche les vraies données de la session
- Tests d'intégration complets

---

## PHASE 5 — OFFLINE AMÉLIORÉ

**Objectif :** Les données hors-ligne ne sont jamais perdues. La re-synchronisation est automatique.

**Dépendances :** Phase 4 (session engine pour la synchronisation).

### Étape 5.1 — IndexedDB

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Créer un wrapper IndexedDB | `packages/offline/src/idb.js` | HAUTE |
| Créer une file d'attente | `packages/offline/src/queue.js` | HAUTE |
| Stash les requêtes en échec | `packages/offline/src/strategy.js` | HAUTE |
| Retry automatique au retour en ligne | `packages/offline/src/sync.js` | HAUTE |
| Tests | `tests/unit/offline-queue.test.mjs` | HAUTE |

### Étape 5.2 — Versioning cache

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Bump automatique du VERSION | `tools/build-sw.mjs` | MOYENNE |
| Prompt de mise à jour | `sw.js` + UI | MOYENNE |
| Nettoyage des anciens caches | `sw.js` | MOYENNE |

### Étape 5.3 — Background Sync

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Enregistrer une sync tag | `sw.js` | MOYENNE |
| Traiter la file au sync | `sw.js` | MOYENNE |
| Notifier l'utilisateur du sync | UI | MOYENNE |

### Étape 5.4 — PWA améliorée

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Gérer `beforeinstallprompt` | `js/app.js` | MOYENNE |
| Ajouter un bouton d'installation | UI home | MOYENNE |
| Notification push (optionnel) | `sw.js` | BASSE |

**Validation :**
- Soumettre une réponse hors-ligne → elle est synchronisée au retour
- Changer de téléphone → profil restauré depuis le serveur
- Le cache se met à jour proprement sans artefacts
- Le prompt d'installation s'affiche

---

## PHASE 6 — PLAYER

**Objectif :** Décomposer app.js en modules indépendants et réutilisables.

**Dépendances :** Phase 1 (core), Phase 2 (données), Phase 3 (event engine), Phase 5 (offline).

### Étape 6.1 — Router

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Créer un routeur simple | `packages/core/src/router.js` | HAUTE |
| Extraire `showScreen()` | `js/app.js` → router | HAUTE |
| Gérer l'historique de navigation | router | HAUTE |
| Tests | `tests/unit/router.test.mjs` | HAUTE |

### Étape 6.2 — Screen modules

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Extraire Home screen | `apps/player/screens/home.js` | HAUTE |
| Extraire Map screen | `apps/player/screens/map.js` | HAUTE |
| Extraire Scan screen | `apps/player/screens/scan.js` | HAUTE |
| Extraire Riddle screen | `apps/player/screens/riddle.js` | HAUTE |
| Extraire Quiz screen | `apps/player/screens/quiz.js` | HAUTE |
| Extraire Carnet screen | `apps/player/screens/carnet.js` | HAUTE |
| Extraire Palmares screen | `apps/player/screens/palmares.js` | HAUTE |
| Extraire Settings screen | `apps/player/screens/settings.js` | HAUTE |
| Extraire God/Admin screen | `apps/player/screens/god.js` | HAUTE |

### Étape 6.3 — Services

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Extraire GPS service | `apps/player/services/gps.js` | HAUTE |
| Extraire Camera service | `apps/player/services/camera.js` | HAUTE |
| Extraire Compass UI | `apps/player/services/compass-ui.js` | HAUTE |
| Extraire Telemetry | `apps/player/services/telemetry.js` | HAUTE |
| Extraire Validation sync | `apps/player/services/validation-sync.js` | HAUTE |
| Extraire Guestbook | `apps/player/services/guestbook.js` | MOYENNE |
| Extraire Urgency | `apps/player/services/urgency.js` | MOYENNE |

### Étape 6.4 — Intégration event engine

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Connecter les actions UI à l'event engine | `apps/player/screens/` | HAUTE |
| Remplacer les appels directs par des events | `js/app.js` → refactor | HAUTE |
| Tests d'intégration | `tests/integration/player.test.mjs` | HAUTE |

**Validation :**
- Le player fonctionne exactement comme avant
- Chaque screen est testable indépendamment
- app.js passe de 2 741 lignes à < 200 lignes (bootstrap)
- Les modules sont importables en Node.js

---

## PHASE 7 — DASHBOARD

**Objectif :** Remplacer le JS inline par des modules. Passer en temps réel.

**Dépendances :** Phase 4 (session engine), Phase 6 (pattern de modularisation).

### Étape 7.1 — SSE / WebSocket

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Ajouter SSE endpoints | `packages/server/src/routes/events.js` | HAUTE |
| Implémenter `GET /api/events/stream` | idem | HAUTE |
| Émettre les événements en temps réel | `packages/server/src/state.js` | HAUTE |
| Client SSE dans le dashboard | `apps/dashboard/services/events.js` | HAUTE |
| Fallback polling si SSE indisponible | idem | HAUTE |

### Étape 7.2 — Modules dashboard ✅ EXTRACTION INLINE

| Tâche | Fichiers | Priorité | Statut |
|-------|----------|----------|--------|
| Extraire le JS inline | `js/dashboard.js` (1336 lignes) | HAUTE | ✅ |
| Extraire questionnaire inline | `js/questionnaire.js` (326 lignes) | HAUTE | ✅ |
| Extraire Communication module | `apps/dashboard/modules/communication.js` | HAUTE | TODO |
| Extraire Suivi module | `apps/dashboard/modules/tracking.js` | HAUTE | TODO |
| Extraire Configuration module | `apps/dashboard/modules/config.js` | HAUTE | TODO |
| Extraire Validations module | `apps/dashboard/modules/validations.js` | HAUTE | TODO |
| Extraire Urgences module | `apps/dashboard/modules/urgency.js` | HAUTE | TODO |
| Extraire QR Export module | `apps/dashboard/modules/qr-export.js` | MOYENNE | TODO |

### Étape 7.3 — Performance

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Remplacer le polling par SSE | `dashboard.html` | HAUTE |
| Réduire le trafic réseau | idem | HAUTE |
| Ajouter des loading states | idem | MOYENNE |

**Validation :**
- Le dashboard affiche les positions en temps réel (< 1s de latency)
- Le message diffusé apparaît instantanément sur les clients
- Le dashboard fonctionne toujours si SSE est indisponible (fallback)
- Le JS inline passe de ~900 lignes à < 100 lignes (bootstrap)

---

## PHASE 8 — STUDIO + ÉDITEUR

**Objectif :** Compléter l'expérience de création. Modulariser l'éditeur.

**Dépendances :** Phase 2 (données), Phase 3 (event engine).

### Étape 8.1 — Studio complété

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Ajouter l'étape "Événements" | `packages/studio/src/workflow.js` | HAUTE |
| Ajouter l'étape "Débriefing" | idem | HAUTE |
| Connecter à l'event engine | idem | HAUTE |
| Export curios-parcours complet | idem | HAUTE |
| Preview temps réel | `studio.html` | MOYENNE |

### Étape 8.2 — Éditeur modulaire ✅ EXTRACTION INLINE

| Tâche | Fichiers | Priorité | Statut |
|-------|----------|----------|--------|
| Extraire le JS inline | `js/editeur.js` (1786 lignes) | HAUTE | ✅ |
| Site editor, Trail editor, Balises editor | `js/editeur.js` | HAUTE | ✅ |
| Birds editor, Guide editor | `js/editeur.js` | HAUTE | ✅ |
| Map editor (Leaflet) | `js/editeur.js` | HAUTE | ✅ |
| Image browser | `js/editeur.js` | MOYENNE | ✅ |
| Validation editor | `js/editeur.js` | HAUTE | ✅ |

### Étape 8.3 — Atelier ✅ COMPLÉ

| Tâche | Fichiers | Priorité | Statut |
|-------|----------|----------|--------|
| Compléter le pack builder | `js/atelier.js` | MOYENNE | ✅ |
| Connecter à content-schema | idem | MOYENNE | ✅ |
| Preview du parcours | idem + `atelier.html` | MOYENNE | ✅ |
| Événements editor | `js/atelier.js` + `atelier.html` | HAUTE | ✅ |

**Validation :**
- Le Studio produit un curios-parcours v1 complet et valide
- L'éditeur fonctionne sans code inline
- Le pack builder crée des packs conformes au schéma

---

## PHASE 9 — PEDAGOGY ENGINE

**Objectif :** Le débriefing est natif, connecté au jeu, et produit un bilan pédagogique automatique.

**Dépendances :** Phase 4 (session engine), Phase 6 (player), Phase 3 (event engine).

### Étape 9.1 — Collecte de données

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Tracker les décisions du joueur | `packages/analytics/` | HAUTE |
| Tracker le temps par station | idem | HAUTE |
| Tracker les indices utilisés | idem | HAUTE |
| Tracker les erreurs et tentatives | idem | HAUTE |
| Tracker la coopération (équipes) | idem | HAUTE |

### Étape 9.2 — Analyse

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Générer le bilan pédagogique | `packages/pedagogy-engine/src/debrief.js` | HAUTE |
| Évaluer les compétences | `packages/pedagogy-engine/src/skills.js` | HAUTE |
| Calculer la progression | `packages/pedagogy-engine/src/progress.js` | HAUTE |
| Produire les questions de débriefing | idem | HAUTE |
| Éviter le profilage individuel | idem | HAUTE |

### Étape 9.3 — Interface

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Connecter debriefing.html aux données réelles | `debriefing.html` | HAUTE |
| Afficher les stats d'équipe | idem | HAUTE |
| Afficher les compétences développées | idem | HAUTE |
| Afficher les questions de réflexion | idem | HAUTE |
| Export PDF du bilan | idem | MOYENNE |

**Validation :**
- Le débriefing affiche les vraies données de la session
- Les compétences sont évaluées correctement
- Le bilan est généré automatiquement
- Aucune donnée personnelle n'est collectée inutilement

---

## PHASE 10 — PHANTOM

**Objectif :** Créer le parcours showcase qui démontre toutes les capacités de CURIOS.

**Dépendances :** Toutes les phases précédentes.

### Étape 10.1 — Contenu

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Compléter les 9 stations | `content/packs/phantom-cybersecurite/` | HAUTE |
| Créer les scénarios event engine | `content/packs/phantom-cybersecurite/events.json` | HAUTE |
| Créer les médias (audio, images) | idem | HAUTE |
| Créer le débriefing | idem | HAUTE |

### Étape 10.2 — Scénario

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Décrire le scénario complet | `content/packs/phantom-cybersecurite/scenario.json` | HAUTE |
| Inclure : QR, GPS, caméra, audio, événements, temps, équipes, indices, scoring, dashboard, offline, débriefing | idem | HAUTE |
| Tester le scénario complet | `tests/integration/phantom.test.mjs` | HAUTE |

### Étape 10.3 — Démonstration

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Script de démonstration | `docs/DEMO.md` | MOYENNE |
| Vidéo de démonstration | (externe) | BASSE |

**Validation :**
- PHANTOM fonctionne de bout en bout
- Toutes les capacités sont exploitées
- Le parcours peut être lancé sans modification du moteur
- Le débriefing produit un bilan complet

---

## PHASE 11 — IA ASSISTÉE

**Objectif :** L'IA assiste la création dans le Studio, jamais dans le runtime.

**Dépendances :** Phase 8 (studio), Phase 3 (event engine).

### Étape 11.1 — Infrastructure

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Créer un provider abstraction | `packages/ai/src/provider.js` | HAUTE |
| Implémenter un provider local (optionnel) | `packages/ai/src/local.js` | MOYENNE |
| Implémenter un provider cloud (optionnel) | `packages/ai/src/cloud.js` | MOYENNE |

### Étape 11.2 — Assistances

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Proposer un scénario | `packages/ai/src/scenario.js` | HAUTE |
| Générer des variantes d'énigmes | `packages/ai/src/enigmes.js` | HAUTE |
| Proposer des indices | `packages/ai/src/hints.js` | MOYENNE |
| Produire des textes | `packages/ai/src/texts.js` | MOYENNE |
| Questions de débriefing | `packages/ai/src/debrief.js` | MOYENNE |

### Étape 11.3 — Validation

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Toujours : IA → proposition → validation humaine → parcours | idem | CRITIQUE |
| Un parcours publié fonctionne sans IA | idem | CRITIQUE |
| Pas d'IA dans le chemin d'exécution du jeu | idem | CRITIQUE |

**Validation :**
- L'IA propose, l'humain valide
- Le parcours result ne contient pas de dépendance IA
- Le mode hors-ligne fonctionne toujours

---

## PHASE 12 — PACKAGING

**Objectif :** Rendre CURIOS facile à déployer sur tout type de machine.

**Dépendances :** Toutes les phases précédentes.

### Étape 12.1 — Binaires

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Bundle avec esbuild | `tools/bundle.mjs` | HAUTE |
| Créer un binaire Windows | `tools/package-win.mjs` | MOYENNE |
| Créer un binaire Linux | `tools/package-linux.mjs` | MOYENNE |
| Créer un binaire macOS | `tools/package-mac.mjs` | MOYENNE |

### Étape 12.2 — Docker

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Créer un Dockerfile | `Dockerfile` | MOYENNE |
| Créer un docker-compose.yml | `docker-compose.yml` | MOYENNE |
| Image multi-platform | idem | MOYENNE |

### Étape 12.3 — Distribution optimisée

| Tâche | Fichiers | Priorité |
|-------|----------|----------|
| Minifier les bundles | `tools/build.mjs` | MOYENNE |
| Gzip/Brotli les assets | idem | MOYENNE |
| Créer les archives | idem | MOYENNE |
| Checksums + signatures | idem | BASSE |
| Publish npm (packages uniquement) | `package.json` | BASSE |

**Validation :**
- `curios-server` fonctionne sur Windows, Linux, macOS
- L'image Docker démarre et sert l'application
- Les binaires font < 50 MB
- Les distributions sont < 10 MB gzippées

---

## RÉSUMÉ DES PRIORITÉS

### P0 — Doit être fait en premier
1. Phase 1.1 — ESLint + Prettier
2. Phase 1.2 — Core (EventBus, shared utils)
3. Phase 2.1 — Extraire data.js en JSON
4. Phase 3 — Event Engine (scénarios complexes)

### P1 — Critique pour la suite
5. Phase 4 — Session Engine (SQLite)
6. Phase 5 — Offline amélioré (IndexedDB queue)
7. Phase 6 — Player modulaire
8. Phase 7 — Dashboard temps réel

### P2 — Important
9. Phase 8 — Studio + Éditeur
10. Phase 9 — Pedagogy Engine
11. Phase 10 — PHANTOM showcase

### P3 — Souhaitable
12. Phase 11 — IA assistée
13. Phase 12 — Packaging

---

## ESTIMATIONS

| Phase | Jours estimés | Complexité |
|-------|---------------|------------|
| Phase 1 | 2-3 jours | Faible |
| Phase 2 | 3-4 jours | Moyenne |
| Phase 3 | 5-7 jours | Élevée |
| Phase 4 | 4-5 jours | Élevée |
| Phase 5 | 3-4 jours | Moyenne |
| Phase 6 | 5-7 jours | Élevée |
| Phase 7 | 4-5 jours | Moyenne |
| Phase 8 | 4-5 jours | Moyenne |
| Phase 9 | 3-4 jours | Moyenne |
| Phase 10 | 3-4 jours | Faible |
| Phase 11 | 5-7 jours | Élevée |
| Phase 12 | 3-4 jours | Faible |
| **TOTAL** | **44-59 jours** | |

---

## RÈGLES DE MIGRATION

Pour chaque étape :

1. **Expliquer le problème** — Pourquoi cette modification est nécessaire
2. **Expliquer la solution** — Ce qui va changer et pourquoi
3. **Identifier les fichiers** — Exactement quels fichiers seront touchés
4. **Modifier le minimum** — Ne changer que le strict nécessaire
5. **Tester** — Valider que les tests existants passent + nouveaux tests
6. **Vérifier les régressions** — S'assurer que rien n'est cassé
7. **Documenter** — Mettre à jour la documentation si nécessaire
8. **Montrer le résultat** — Démontrer que le système fonctionne
9. **Passer à l'étape suivante** — Ne pas s'arrêter sur une perfection inutile

**INTERDICTION** de produire une gigantesque refonte en une seule opération.

---

## CRITÈRE DE SUCCÈS FINAL

Une personne qui ne connaît pas le code doit pouvoir :

1. Télécharger CURIOS
2. Démarrer le serveur
3. Ouvrir CURIOS Studio
4. Créer un parcours simple
5. Le publier
6. Lancer une session
7. Faire rejoindre 4 équipes
8. Jouer
9. Suivre les équipes
10. Terminer
11. Obtenir le bilan

**Avec le minimum d'assistance technique.**
