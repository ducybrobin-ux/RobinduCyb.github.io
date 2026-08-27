# AUDIT CURIOS 2.0

> Date : 2026-08-26
> Dépôt : https://github.com/ducybrobin-ux/curios/
> Branche : main
> Dernier commit : 97655a0

---

## 1. ÉTAT ACTUEL

CURIOS est un jeu de piste éducatif familial, initié comme fork de Multi JDP (Jeu de Piste Biodiversité Campagne). Le projet a été progressivement transformé en une plateforme modulaire via 7 phases d'extraction et de migration.

### Chiffres clés

| Métrique | Valeur |
|----------|--------|
| Fichiers JS racine | 17 (dont app.js = 2 741 lignes, data.js = 3 105 lignes) |
| Packages modulaires | 8 (game-engine, geolocation, offline, content-schema, server, studio, analytics, pedagogy-engine) |
| Pages HTML | 7 (index, dashboard, editeur, studio, atelier, debriefing, questionnaire) |
| CSS | 1 fichier partagé (871 lignes) + styles inlinés dans dashboard/editeur/studio |
| Tests unitaires | ~149 (7 suites) |
| Éditions | 5 (base, cemea, cdb, phantom, tsle1) |
| Packs de contenu | 7 |
| Endpoints API | 27 |
| CI | 19 étapes (syntax + sync + tests + build) |
| Documentation | 25 fichiers (docs/ + wiki/) |
| Service Worker | 1 (généré, 103 lignes) |
| Taille JS totale (racine) | ~7 800 lignes (app.js + data.js + autres) |

---

## 2. FORCES

1. **Modèle de contenu JSON** — Les packs, balises, découvertes et guides sont des documents JSON structurés, validables, et convertibles. Le format `curios-parcours` v1 est bien défini.

2. **Offline-first fonctionnel** — Le service worker fonctionne, les données sont précachées, l'application est utilisable sans connexion. La stratégie de cache est correctement abstraite dans `@curios/offline`.

3. **Extraction modulaire réussie** — Les 8 packages sont purs (zéro dépendance), testables en Node.js, et les fichiers bundle (`js/engine.js`, `js/geo.js`, `sw.js`) sont auto-générés et vérifiés en CI.

4. **Server Node.js complet** — 27 endpoints, authentification par token, state in-memory avec persistance JSON, whitelist/denylister les endpoints. Remplacement fonctionnel de `server.ps1`.

5. **Richesse fonctionnelle** — QR code, GPS, compass, audio synthétique, reconnaissance sonore, dictée vocale, mode course, thèmes, nuit, palmarès, guestsbook selfie, urgence, dashboard organisateur. Le produit est déjà utilisable sur le terrain.

6. **Tests intégration serveur** — `server.test.mjs` lance un vrai serveur HTTP et teste tous les endpoints, y compris la sécurité (réponse challenge strip, auth).

7. **Workflow CI robuste** — Vérification syntaxe, synchronisation packages→bundles, validation schéma, 7 suites de tests, build distribution. Toutes les étapes passent.

8. **Identité visuelle cohérente** — Thème sombre/clair, palette `#0c3b2e` / `#00A6A6` / `#20B878` / `#F5A623`, logos SVG, icônes maskables PWA.

---

## 3. FAIBLESSES

### 3.1 Architecture frontend

| Problème | Sévérité | Détail |
|----------|----------|--------|
| **God file app.js** | CRITIQUE | 2 741 lignes dans une seule IIFE. Contient : routing, rendu de 10+ écrans, GPS, compass, audio, telemetry, selfie, QR, admin, settings, events. N'importe quelle modification risque de casser une fonctionnalité non liée. |
| **Données en dur dans data.js** | CRITIQUE | 3 105 lignes contenant les constantes BIRDS (1 200 lignes), BALISES (1 160 lignes), GUIDE (420 lignes) ET des fonctions (applyAdminData, allBirds, getBird). Devrait être du JSON chargé dynamiquement. |
| **Aucun module system** | MAJEUR | Tous les fichiers JS de la racine utilisent des variables globales (`window.*`). Pas d'ES modules, pas de bundler, pas d'imports. Les packages internes sont ESM mais les bundles concaténés écrasent les modules. |
| **Couplage par variables globales** | MAJEUR | `BALISES`, `BIRDS`, `SITE`, `Store`, `I18N`, `AudioSys`, `Compass`, `Board` sont tous des globaux. Chaque fichier lit/écrit des états partagés sans injection de dépendances. |
| **Duplication de fonctions** | IMPORTANT | `esc()` définie dans app.js, board.js, editeur.html, studio.html, questionnaire.html. `$()` défini dans app.js et board.js. Code de validation serveur dupliqué entre editeur.html inline et outils. |
| **Rendu DOM impératif** | IMPORTANT | Chaque `render*()` construit du HTML via template literals + `innerHTML`, puis réattache les event listeners. Pas de virtual DOM, pas de templating, pas de composants réutilisables. |
| **Styles inlinés** | MINEUR | dashboard.html contient 240 lignes de `<style>`, editeur.html contient des styles inline sur des éléments dynamiques, debriefing.html est auto-contenu avec sa propre palette. |

### 3.2 Backend

| Problème | Sévérité | Détail |
|----------|----------|--------|
| **Pas de WebSocket/SSE** | MAJEUR | Le dashboard poll `/api/board` toutes les 5 secondes. Les positions sont pollées toutes les 10 secondes. Avec 30+ clients, cela génère un trafic important et un latency de 5s. |
| **State in-memory uniquement** | MAJEUR | Les sessions, positions, validations, urgences ne survivent pas à un redémarrage du serveur. Seuls les JSON disque (validations, finishes, urgencies, wifi, etc.) persistent. |
| **Pas de rate limiting** | IMPORTANT | Aucune limitation des requêtes. Un participant malveillant peut inonder le serveur de positions/réponses/urgences. |
| **Pas de HTTPS natif** | IMPORTANT | Le serveur Node.js ne supporte que HTTP. HTTPS nécessite un tunnel externe (cloudflare). |
| **Mot de passe en clair** | IMPORTANT | Le mot de passe organisateur est stocké en clair dans `data/auth.json`. Pas de hachage bcrypt/argon2. |
| **CORS `*`** | IMPORTANT | `Access-Control-Allow-Origin: *` sur tous les endpoints API. Acceptable en mode local, risqué en mode tunnel public. |
| **Pas de validation de schéma** | MINEUR | Les payloads API sont parsés mais pas validés contre un schéma. Un payload malformé peut provoquer des erreurs silencieuses. |

### 3.3 PWA / Offline

| Problème | Sévérité | Détail |
|----------|----------|--------|
| **Pas de file d'attente hors-ligne** | MAJEUR | Si un participant soumet une réponse/position/validation hors-ligne, la requête échoue silencieusement. Pas de retry automatique quand la connexion revient. |
| **Cache non versionné dynamiquement** | IMPORTANT | Le VERSION est `curios-v1` (statique). Pas de mécanisme de bump automatique ni d'invalidation des anciens caches côté client. |
| **Precache liste statique** | MINEUR | La liste PRECACHE est générée au build mais ne couvre pas les fichiers de packs de contenu dynamiques. Les images/media des packs ne sont pas précachés. |
| **Pas de Background Sync** | MINEUR | L'API Background Sync n'est pas utilisée pour les soumissions hors-ligne. |

### 3.4 Sécurité

| Problème | Sévérité | Détail |
|----------|----------|--------|
| **Pas de CSP** | MAJEUR | Aucune Content-Security-Policy définie. Les scripts inline dans les HTML sont nombreux. XSS possible via les inputs non sanitizés. |
| **innerHTML sans sanitization** | MAJEUR | Les rendus utilisent massivement `innerHTML` avec des template literals. Si un contenu d'utilisateur (nom d'équipe, message, réponse) contient du HTML/JS, il sera exécuté. |
| **Pas de rate limiting login** | IMPORTANT | Le endpoint `/api/auth/login` peut être brute-forcé. Pas de lockout, pas de délai. |
| **Token Bearer sans HTTPS** | IMPORTANT | Les tokens d'auth sont transmis en clair sur HTTP. Interceptables en MITM sur le réseau local. |
| **Pas de CSRF protection** | MINEUR | Les requêtes POST ne vérifient pas l'origine. Un site malveillant sur le même réseau peut envoyer des requêtes. |
| **Mots de passe WiFi en clair** | MINEUR | Le SSID et mot de passe WiFi sont stockés en clair dans `data/wifi.json` et servis via `/api/wifi`. |
| **admin-data.json exposé** | MINEUR | Le fichier `admin-data.json` est accessible publiquement et peut révéler la structure du contenu. |

### 3.5 Accessibilité

| Problème | Sévérité | Détail |
|----------|----------|--------|
| **Pas de `prefers-reduced-motion`** | MAJEUR | Les animations (pulse, dict-pulse, breath, urgency-pulse) tournent sans tenir compte de `prefers-reduced-motion: reduce`. |
| **`role="img"` sans alternative texte** | IMPORTANT | La carte SVG utilise `role="img" aria-label` mais le contenu SVG n'a pas de fallback texte. |
| **Contraste des états désactivés** | IMPORTANT | Les boutons `disabled` perdent leur contraste sans indication visuelle alternative (pas d'opacité réduite, pas d'icône de verrou). |
| **Navigation clavier incomplète** | IMPORTANT | Les overlays (guestbook, urgency, race) n'implémentent pas le piège à focus (focus trap). Un utilisateur clavier peut naviguer hors de l'overlay. |
| **Pas d'alternatives aux QR/GPS** | IMPORTANT | Les balises nécessitent un scan QR ou un GPS. Pas de mode de substitution pour les appareils sans caméra ni GPS (saisie manuelle existe mais pas évidente). |
| **Absence de landmarks ARIA** | MINEUR | Pas de `<nav>` (sauf bottombar), pas de `<aside>`, pas de `<section>` avec `aria-labelledby`. La structure sémantique est basique. |

### 3.6 Tests

| Problème | Sévérité | Détail |
|----------|----------|--------|
| **Aucun test frontend** | CRITIQUE | Les 2 741 lignes de app.js, 3 105 de data.js, 228 de store.js, 439 de i18n.js, etc. n'ont aucun test unitaire. |
| **Aucun test E2E** | MAJEUR | Pas de Playwright/Cypress. Le parcours complet (création → session → jeu → débriefing) n'est pas testé automatiquement. |
| **Pas de couverture de code** | IMPORTANT | Aucun outil de couverture (c8, istanbul) configuré. On ne sait pas quel % du code est couvert. |
| **Pas de linting** | IMPORTANT | Pas d'ESLint, pas de Prettier. La cohérence de code repose uniquement sur la vigilance humaine. |
| **Tests serveur dépendants du filesystem** | MINEUR | `server.test.mjs` crée/lit `data/auth.json`. Un test précédent peut influencer les suivants si le nettoyage échoue. |

### 3.7 Performance

| Problème | Sévérité | Détail |
|----------|----------|--------|
| **Pas de minification** | IMPORTANT | Les bundles (engine.js, geo.js) ne sont pas minifiés. Le CSS n'est pas minifié. Le build copie les fichiers tels quels. |
| **Pas de tree-shaking** | MINEUR | Pas de bundler (Vite/esbuild) pour éliminer le code mort. Les packages sont copiés entièrement dans dist/. |
| **data.js chargé entièrement** | MINEUR | Les 3 105 lignes sont parsées même si l'utilisateur n'utilise qu'un sous-ensemble du contenu. |
| **Pas de lazy loading** | MINEUR | Toutes les pages chargent tous les scripts. Les pages secondaires (dashboard, editeur, studio) chargent des scripts inutiles (compass, qr, audio). |

---

## 4. RISQUES

### 4.1 Risques techniques

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| **app.js devient ingérable** | Chaque modification prend 10x plus de temps, les régressions se multiplient | Élevée | Décomposer en modules ES独立 |
| **XSS via innerHTML** | Données d'équipe/message injectées dans le DOM → exécution de code | Élevée | Sanitiser toutes les insertions DOM |
| **Perte de state serveur** | Redémarrage → perte de toutes les sessions en cours | Moyenne | Persister en SQLite ou au moins en JSON atomique |
| **Pas de file d'attente offline** | Participants hors-ligne perdent leurs données de progression | Moyenne | Implémenter IndexedDB queue + retry |
| **Doublons data.js / JSON content** | Le contenu existe en double (data.js hardcoded + content/*.json) | Élevée | Unifier en une seule source JSON |

### 4.2 Risques produit

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| **Monolingue** | Impossibilité d'exporter/internationaliser | Élevée | Compléter i18n + traductions |
| **Expérience dégradée à 30+ joueurs** | Polling HTTP inefficace, latence visible | Moyenne | Passer en SSE ou WebSocket |
| **Pas de sauvegarde côté participant** | Changement de téléphone → perte totale | Élevée | Export/import de profil ou synchronisation serveur |
| **Complexité de déploiement** | Nécessite Node.js, pas de conteneur/docker | Moyenne | Fournir un binaire ou un Dockerfile |
| **Pas de multi-événement** | Un seul serveur = un seul événement à la fois | Basse | Architecture stateless ou multi-tenant |

---

## 5. DETTE TECHNIQUE

| Dette | Sévérité | Effort estimé | Priorité |
|-------|----------|---------------|----------|
| Décomposer app.js en modules ES | CRITIQUE | 3-5 jours | P0 |
| Extraire data.js en JSON + loaders | CRITIQUE | 2-3 jours | P0 |
| Sanitizer les insertions DOM (innerHTML → textContent/template) | MAJEUR | 2-3 jours | P1 |
| Ajouter un CSP au serveur | MAJEUR | 1 jour | P1 |
| Hacher les mots de passe (bcrypt/argon2) | MAJEUR | 0.5 jour | P1 |
| Ajouter prefers-reduced-motion | IMPORTANT | 0.5 jour | P1 |
| File d'attente offline (IndexedDB) | MAJEUR | 2-3 jours | P1 |
| Focus trap sur les overlays | IMPORTANT | 1 jour | P2 |
| WebSocket/SSE pour le dashboard | MAJEUR | 2-3 jours | P2 |
| Persistance SQLite côté serveur | MAJEUR | 2 jours | P2 |
| ESLint + Prettier | IMPORTANT | 0.5 jour | P2 |
| Tests E2E (Playwright) | MAJEUR | 3-5 jours | P2 |
| Minification build | IMPORTANT | 1 jour | P3 |
| Internationalisation complète | MAJEUR | 3-5 jours | P3 |
| Rate limiting | IMPORTANT | 0.5 jour | P2 |

---

## 6. ARCHITECTURE ACTUELLE

```
CURIOS (racine)
│
├── index.html              ← Player SPA (écrans: home, map, scan, riddle, quiz, carnet, palmares, settings, god)
├── dashboard.html          ← Dashboard organisateur (inline JS ~900 lignes)
├── editeur.html            ← Éditeur de contenu (inline JS ~1780 lignes)
├── studio.html             ← Studio de création (ES modules)
├── atelier.html            ← Atelier de packs (delegue à js/atelier.js)
├── debriefing.html         ← Écran de débriefing (auto-contenu)
├── questionnaire.html      ← Questionnaire bêta (inline JS ~325 lignes)
│
├── js/
│   ├── app.js              ← 2 741 lignes — GOD FILE (routing, UI, GPS, compass, audio, telemetry, admin, settings)
│   ├── data.js             ← 3 105 lignes — Données + fonctions (BIRDS, BALISES, GUIDE, SITE, TRAIL, THEMES)
│   ├── store.js            ← 228 lignes — localStorage persistence (profils, settings, progression)
│   ├── i18n.js             ← 439 lignes — Internationalisation (FR uniquement)
│   ├── audio.js            ← 296 lignes — Synthèse audio, proximity, alerts
│   ├── compass.js          ← 146 lignes — Boussole device orientation + GPS
│   ├── board.js            ← 161 lignes — Polling dashboard (/api/board toutes les 5s)
│   ├── engine.js           ← 102 lignes — Bundle généré depuis packages/game-engine/
│   ├── geo.js              ← 12 lignes — Bundle généré depuis packages/geolocation/
│   ├── qr.js / jsqr.js / qrcode.js — QR code scanning + generation
│   ├── birdnet.js          — Reconnaissance sonore (BirdNET API externe)
│   ├── dict.js             — Dictée vocale (Web Speech API)
│   ├── declination.js      — Déclinaison magnétique (WMM)
│   └── challenges.js       ← 106 lignes — Défis aléatoires (dashboard uniquement)
│
├── css/styles.css          ← 871 lignes — Styles partagés (thème jour/nuit, responsive, composants)
│
├── packages/
│   ├── game-engine/        ← normalize, checkAnswer, makeQuiz, getEnigme (0 deps)
│   ├── geolocation/        ← haversine, bearing, normDeg, cardinal (0 deps)
│   ├── offline/            ← SW config + cache strategies (0 deps)
│   ├── content-schema/     ← Validation + conversion packs → curios-parcours (1 dep: fs)
│   ├── server/             ← Serveur HTTP Node.js, 27 endpoints, auth, state (0 deps externes)
│   ├── studio/             ← Workflow wizard, history undo/redo (0 deps)
│   ├── analytics/          ← Tracker métriques + adaptation pédagogique (0 deps)
│   └── pedagogy-engine/    ← Debrief, skills, progress, ranking (0 deps)
│
├── content/
│   ├── packs/ (7 packs)    ← Balises, découvertes, guides, thèmes
│   ├── editions/ (5)       ← Configurations de déploiement
│   ├── schemas/ (3)        ← JSON Schema de validation
│   ├── curios-parcours/ (4) ← Parcours convertis au format universel
│   └── themes/ (5)         ← Thèmes visuels CSS
│
├── tools/                  ← 14 scripts build/validate/convert
├── tests/unit/             ← 7 suites de tests (~149 tests)
├── dist/                   ← 3 distributions (generic, windows, linux)
└── .github/workflows/      ← ci.yml (19 étapes), release.yml
```

### Architecture actuelle : flux de données

```
content/*.json → tools/build-data.mjs → js/data.js (constantes globales)
packages/game-engine/ → tools/build-engine.mjs → js/engine.js (window.CURIOS_ENGINE)
packages/geolocation/ → tools/build-geo.mjs → js/geo.js (window.GeoMath)
packages/offline/ → tools/build-sw.mjs → sw.js (service worker)

index.html ← charge: engine.js, geo.js, data.js, store.js, i18n.js, audio.js,
                         compass.js, qr.js, jsqr.js, qrcode.js, dict.js,
                         birdnet.js, board.js, app.js

dashboard.html ← charge: engine.js, data.js, challenges.js, i18n.js, qrcode.js, dict.js + inline JS

editeur.html ← charge: engine.js, data.js, dict.js + inline JS (1780 lignes)
```

---

## 7. ARCHITECTURE CIBLE

```
CURIOS 2.0
│
├── apps/
│   ├── player/             ← index.html + modules ES (remplace app.js monolithique)
│   ├── dashboard/          ← dashboard.html + modules ES (remplace inline JS)
│   ├── studio/             ← studio.html (déjà ESM, à compléter)
│   ├── editeur/            ← editeur.html + modules ES (remplace inline JS)
│   └── server/             ← packages/server/ (déjà fonctionnel)
│
├── packages/
│   ├── core/               ← Store, I18N, Router, EventBus, DOM utils
│   ├── game-engine/        ← (existant, conserver)
│   ├── event-engine/       ← NOUVEAU : EVENT → CONDITION → ACTION → STATE
│   ├── pedagogy-engine/    ← (existant, étendre)
│   ├── content-schema/     ← (existant, unifier avec data.js)
│   ├── geolocation/        ← (existant, conserver)
│   ├── offline/            ← (existant, ajouter queue + sync)
│   ├── scoring/            ← NOUVEAU : abstraction du scoring (séparé du store)
│   ├── teams/              ← NOUVEAU : gestion des équipes (séparé du store)
│   ├── media/              ← NOUVEAU : abstraction caméra/audio/NFC
│   ├── accessibility/      ← NOUVEAU : focus trap, reduced motion, ARIA utils
│   ├── analytics/          ← (existant, conserver)
│   └── shared/             ← esc(), $(), sanitize(), debounce(), etc.
│
├── content/
│   ├── packs/              ← (existant, conserver)
│   ├── editions/           ← (existant, conserver)
│   └── examples/           ← 3 parcours showcase (phantom, historique, metiers)
│
├── docs/
├── tests/
│   ├── unit/               ← packages + core
│   ├── integration/        ← server + event-engine + session
│   └── e2e/                ← Playwright (parcours complet)
│
└── tools/
```

### Principes directeurs de l'architecture cible

1. **Le parcours est une DONNÉE** — Aucune modification du moteur pour un nouveau parcours
2. **Le moteur est un pipeline** — EVENT → CONDITION → ACTION → STATE CHANGE
3. **Les packages sont purs** — Zéro dépendance externe, testables en Node.js
4. **Les apps sont des consommateurs** — Elles assemblent les packages mais n'en contiennent pas
5. **Le contenu est JSON** — Chargé dynamiquement, validé au build, jamais hardcodé
6. **Le serveur est un中间层** — Il ne contient pas de logique métier, juste de la synchronisation

---

## 8. FONCTIONNALITÉS EXISTANTES

| Fonctionnalité | Statut | Localisation |
|----------------|--------|--------------|
| Profils familles | Fonctionnel | store.js + app.js |
| Carte SVG du sentier | Fonctionnel | app.js (buildSvgMap) |
| Scan QR code | Fonctionnel | qr.js + jsqr.js |
| Validation GPS | Fonctionnel | app.js + geo.js |
| Énigmes 3 niveaux | Fonctionnel | data.js + engine.js |
| Quiz à choix multiples | Fonctionnel | data.js + engine.js |
| Synthèse audio oiseaux | Fonctionnel | audio.js |
| Boussole directionnelle | Fonctionnel | compass.js |
| Mode course | Fonctionnel | app.js |
| Mode aléatoire | Fonctionnel | app.js |
| Palmarès hebdomadaire | Fonctionnel | store.js |
| Carnet d'observation | Fonctionnel | app.js |
| Livre d'or (selfie) | Fonctionnel | app.js |
| Tableau de bord organisateur | Fonctionnel | dashboard.html + board.js |
| Messages diffusés | Fonctionnel | board.js + /api/board |
| Défis aléatoires | Fonctionnel | challenges.js |
| Suivi GPS des équipes | Fonctionnel | dashboard.html + /api/pos |
| Urgences/sécourisme | Fonctionnel | app.js + /api/urgency |
| Validations manuelles | Fonctionnel | dashboard.html + /api/validations |
| Mode nuit | Fonctionnel | store.js + styles.css |
| Dictée vocale | Fonctionnel | dict.js (Web Speech API) |
| Lecture à voix haute | Fonctionnel | app.js (speechSynthesis) |
| Multi-langues (infrastructure) | Partiel | i18n.js (FR uniquement) |
| Authentification organisateur | Fonctionnel | server auth.js |
| Éditeur de contenu | Fonctionnel | editeur.html (1780 lignes inline) |
| Studio de création | Fonctionnel | studio.html + packages/studio |
| Atelier de packs | Fonctionnel | atelier.html + js/atelier.js |
| Conversion packs → curios-parcours | Fonctionnel | packages/content-schema |
| Analytics + adaptation | Fonctionnel | packages/analytics |
| Bilan pédagogique | Fonctionnel | packages/pedagogy-engine |
| Débriefing | Partiel | debriefing.html (données démo, pas connecté au jeu) |
| Reconnaissance sonore | Partiel | birdnet.js (API externe, nécessite Internet) |

---

## 9. FONCTIONNALITÉS MANQUANTES

| Fonctionnalité | Priorité | Impact |
|----------------|----------|--------|
| **Event Engine** (EVENT → CONDITION → ACTION → STATE) | CRITIQUE | Permet des scénarios complexes sans modifier le moteur |
| **File d'attente offline** (IndexedDB + retry) | MAJEUR | Les données hors-ligne ne sont jamais perdues |
| **WebSocket/SSE** pour le dashboard | MAJEUR | Temps réel pour le suivi des équipes |
| **Persistance serveur** (SQLite) | MAJEUR | Survie au redémarrage |
| **Sanitization DOM** | MAJEUR | Protection XSS |
| **Focus trap overlays** | IMPORTANT | Accessibilité clavier |
| **prefers-reduced-motion** | IMPORTANT | Accessibilité |
| **Rate limiting** | IMPORTANT | Sécurité |
| **CSP** | IMPORTANT | Sécurité |
| **Tests E2E** | IMPORTANT | Fiabilité |
| **Multi-langues** | IMPORTANT | Rayonnement |
| **Export/import profil** | IMPORTANT | Rétention utilisateur |
| **Schema de session** (teams, progression, events) | MAJEUR | Base pour le débriefing natif |
| **Moteur de débriefing connecté** | IMPORTANT | Le débriefing actuel est un démo, pas lié au vrai jeu |
| **Packaging exécutable** ( Electron/binaire) | MINEUR | Simplicité de déploiement |

---

## 10. DÉPENDANCES

### Dépendances externes (npm)

**Aucune.** Tous les packages déclarent `dependencies: {}`. Le serveur utilise uniquement les modules natifs de Node.js (`http`, `fs`, `path`, `crypto`, `os`).

### Dépendances CDN/incluses

| Fichier | Origine | Usage |
|---------|---------|-------|
| js/jsqr.js | Bibliothèque incluse | Décodage QR code (lecture) |
| js/qrcode.js | Bibliothèque incluse | Génération QR code (affichage) |

### APIs browser utilisées

| API | Usage | Fallback |
|-----|-------|----------|
| Geolocation | GPS balises | Saisie manuelle |
| MediaDevices | Caméra QR + selfie | Saisie manuelle + upload fichier |
| DeviceOrientation | Boussole | Pas de boussole |
| Web Audio | Synthèse sons | Pas de son |
| Web Speech (SpeechRecognition) | Dictée vocale | Clavier |
| Web Speech (SpeechSynthesis) | Lecture à voix haute | Pas de lecture |
| Service Worker | Offline | Pas de mode offline |
| localStorage | Persistance client | Pas de persistance |
| Notification | Alerte urgence | Pas de notification |
| Share API | Partage résultats | Copier dans le presse-papier |
| SpeechSynthesis | TTS accessibilité | Pas de TTS |

---

## 11. SÉCURITÉ

### Menaces identifiées

| Menace | Sévérité | Statut |
|--------|----------|--------|
| XSS via innerHTML | CRITIQUE | NON TRAITÉ — tous les rendus utilisent innerHTML |
| Brute-force login | IMPORTANT | NON TRAITÉ — pas de rate limiting |
| Token intercepté (HTTP) | IMPORTANT | NON TRAITÉ — pas de HTTPS natif |
| Mot de passe en clair | IMPORTANT | NON TRAITÉ — pas de hachage |
| CORS wildcard | IMPORTANT | NON TRAITÉ — `*` sur tous les endpoints |
| Injection via admin-data.json | MINEUR | PARTIEL — le serveur valide le format mais pas le contenu |
| Données WiFi exposées | MINEUR | NON TRAITÉ — stocké en clair, servi via API |
| Absence de CSP | MAJEUR | NON TRAITÉ — aucune politique de sécurité des contenus |
| Pas de Subresource Integrity | MINEUR | NON TRAITÉ — les scripts ne vérifient pas leur intégrité |

### Protections existantes

- Authentification par token (32 bytes hex, 24h expiry)
- Challenge answer stripped avant envoi aux participants
- `X-Content-Type-Options: nosniff` sur toutes les réponses
- `resolvePathSafe()` vérifie que les chemins ne remontent pas au-dessus de la racine
- Participants n'ont pas besoin d'auth (pas de donnée personnelle collectée)

---

## 12. ACCESSIBILITÉ

### Conformité WCAG 2.2 AA

| Critère | Statut | Notes |
|---------|--------|-------|
| 1.1.1 Contenu non textuel | PARTIEL | `alt` sur les images principales, `aria-label` sur la carte SVG, mais pas d'alternative aux QR codes |
| 1.3.1 Info et relations | PARTIEL | `<h1>`-`<h3>`, `<form>`, `<label>`, mais pas de landmarks ARIA complets |
| 1.4.3 Contraste (minimum) | BON | Thème jour et nuit ont des contrastes élevés |
| 1.4.11 Contraste (non-texte) | BON | Bordures et icônes ont un contraste suffisant |
| 2.1.1 Clavier | PARTIEL | Navigation basique clavier, mais pas de focus trap sur overlays |
| 2.3.1 Flashs | BON | Pas d'animations clignotantes |
| 2.4.1 Bypass blocks | BON | Skip link présent |
| 2.4.3 Focus order | PARTIEL | Ordre de tabulation généralement logique |
| 2.4.7 Focus visible | BON | `outline: 3px solid var(--primary)` sur les formulaires |
| 3.1.1 Langue de la page | BON | `lang="fr"` sur toutes les pages |
| 4.1.2 Name, role, value | PARTIEL | `aria-label` sur la carte SVG, `role="status"` sur le toast, mais pas sur tous les boutons iconiques |

### Ce qui manque

- `prefers-reduced-motion` — Aucune animation n'est désactivée
- Focus trap sur les overlays (guestbook, urgency, race)
- `aria-live` régions pour les mises à jour dynamiques (positions, messages)
- Alternatives audio aux notifications sonores
- Mode contraste élevé optionnel
- Taille de texte minimale garantie (pas de `rem`/`em` partout)

---

## 13. PWA

| Élément | Statut | Notes |
|---------|--------|-------|
| manifest.json | Fonctionnel | name, short_name, icons (192, 512, maskable, SVG), display: standalone, orientation: portrait |
| service-worker.js | Fonctionnel | Install (precache), activate (delete old caches), fetch (cache-first), message (skip waiting) |
| theme_color | Cohérent | `#0c2a3b` dans manifest, `#0c3b2e` dans meta tag (légère différence) |
| Icons | Complètes | icon-192.png, icon-512.png, icon-maskable-512.png, icon.svg |
| apple-touch-icon | Présent | icon-180.png |
| Offline | Fonctionnel | Precomplete de 46 fichiers, runtime cache, fallback index.html |
| Install prompt | Non géré | Pas de `beforeinstallprompt` handler, pas de bouton d'installation |
| Update prompt | Basique | Bouton "Vérifier et mettre à jour" qui envoie `SKIP_WAITING` au SW |
| Background Sync | Non implémenté | Pas de file d'attente hors-ligne |
| Push Notifications | Non implémenté | Pas de push pour les messages organisateur |

---

## 14. OFFLINE

| Aspect | Statut | Notes |
|--------|--------|-------|
| Pre-cache | Fonctionnel | 46 fichiers statiques précachés au install |
| Runtime cache | Fonctionnel | Les ressources naviguées sont cachées automatiquement |
| Fallback navigation | Fonctionnel | `index.html` retourné si la ressource n'est pas en cache |
| API bypass | Fonctionnel | `/api/*` toujours passé au réseau |
| Mise à jour cache | Basique | `SKIP_WAITING` manuel, pas de prompt automatique |
| Données hors-ligne | Limité | Les données de jeu sont dans localStorage (déjà offline), mais les échanges serveur échouent silencieusement |
| Reprise après coupure | Partiel | La page se recharge, le SW reprend le cache, mais les requêtes en vol sont perdues |
| Sync automatique | NON | Pas de mécanisme de re-synchronisation après retour en ligne |

---

## 15. PERFORMANCE

| Aspect | Statut | Notes |
|--------|--------|-------|
| Taille totale JS | ~200 KB | app.js (2741 lignes ≈ 80 KB), data.js (3105 lignes ≈ 100 KB), autres ≈ 20 KB |
| Taille CSS | ~25 KB | styles.css (871 lignes) |
| Taille images | Inconnue | SVG logos + PNG icons, pas d'images lourdes identifiées |
| First Paint | Rapide | Pas de framework, pas de bundler, le HTML est servi directement |
| Time to Interactive | Rapide | Les scripts sont petits et synchrones |
| Bundle size | NON optimisé | Pas de minification, pas de gzip/brotli serveur |
| Mémoire | Potentiel fuite | 5+ setInterval sans cleanup, AudioContext potentiellement non fermé |
| Batterie | Consommateur | Le polling GPS + compass + audio peut être gourmand |

---

## 16. UX

| Aspect | Statut | Notes |
|--------|--------|-------|
| Navigation | Claire | Bottom bar (Carte, Carnet, Palmarès, Réglages) + Home grid |
| Feedback utilisateur | Bon | Toast notifications, statut visuel, animations subtiles |
| Erreur | Basique | `toast()` pour les erreurs, pas de page d'erreur dédiée |
| Onboarding | Fonctionnel | Écran d'accueil → Introduction → Profil → Carte |
| Responsive | Mobile-first | Breakpoint 700px pour desktop, padding safe-area pour iPhone |
| Mode nuit | Fonctionnel | bascule via store, thème complet |
| Accessibilité | Partielle | Skip link, focus visible, mais pas de reduced-motion ni focus trap |
| Chargement | Pas de skeleton | Les données sont chargées en bloc, pas de loading states |
| Offline UX | Pas de signal | Le statut "Hors-ligne — tout est prêt" s'affiche mais sans détails |

---

## 17. PLAN DE MIGRATION

### Principe

**Évolution, pas de révolution.** Chaque étape améliore le système sans casser ce qui fonctionne.

### Stratégie

1. **Extraire, pas réécrire** — Les modules existants sont bons. On les réorganise sans changer leur logique métier.
2. **Écrans indépendants** — Chaque page HTML devient un point d'entrée autonome avec ses propres modules.
3. **Événements, pas d'état global** — Un EventBus central remplace les lectures/écritures directes de variables globales.
4. **JSON, pas de JS** — Les données de contenu deviennent du JSON chargé dynamiquement, plus de constantes JS.
5. **Tests d'abord** — Chaque extraction est validée par des tests existants + nouveaux.

### Ordre de migration

```
Phase 0 : Audit + roadmap ← NOUS SOMMES ICI
   ↓
Phase 1 : Fondation (EventBus, Router, core utils, tests couverture)
   ↓
Phase 2 : Données (extraire data.js → JSON, unifier content-schema)
   ↓
Phase 3 : Event Engine (EVENT → CONDITION → ACTION → STATE)
   ↓
Phase 4 : Session Engine (session, teams, progression, events côté serveur)
   ↓
Phase 5 : Offline amélioré (IndexedDB queue, retry, sync)
   ↓
Phase 6 : Player (décomposer app.js, modules indépendants)
   ↓
Phase 7 : Dashboard (remplacer inline JS, SSE/WebSocket)
   ↓
Phase 8 : Studio + Editeur (compléter, modulariser)
   ↓
Phase 9 : Pedagogy Engine (débriefing natif, connecté au jeu)
   ↓
Phase 10 : PHANTOM (parcours showcase complet)
   ↓
Phase 11 : IA assistée (Studio only, validation humaine)
   ↓
Phase 12 : Packaging (binaires, Docker, distributions optimisées)
```

---

## PRÉAMBULE

Ce document est le résultat d'un audit complet du dépôt CURIOS effectué le 2026-08-26. Il analyse l'architecture, le frontend, le backend, l'offline, le game engine, la sécurité, l'accessibilité, les tests et la performance.

La priorité absolue est de **préserver ce qui fonctionne** tout en identifiant les axes d'amélioration critiques.

Les prochaines étapes sont décrites dans `docs/ROADMAP_CURIOS_2.md`.
