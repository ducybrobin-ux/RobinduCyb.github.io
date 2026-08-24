# AUDIT — Cartographie et diagnostic de l'existant

> Audit réalisé le 2026-08-24 sur l'organisation [ducybrobin-ux](https://github.com/ducybrobin-ux).
> Principe : ne rien supprimer avant d'avoir expliqué ce que fait chaque élément,
> où il est utilisé, s'il est réutilisable, à refactorer, remplacer ou abandonner.

## 1. Les 6 dépôts de l'organisation

| Dépôt | Rôle | État |
|---|---|---|
| `tsle` | Prototype ornitho historique (Creuse) | Archivé de fait |
| `tsle1-sentier-oiseaux` | **TSLE1** « La toile sous les étoiles » : référence fondatrice (PWA offline, serveur local + dashboard, god mode, 5 langues) | Stable |
| `jpd` (JDP_BC) | Plateforme « biais cognitifs » devenue moteur multi-packs | Actif, v2.0.3 |
| `Multi_JDP` | Vitrine multi-packs | Miroir exact de `jpd` |
| `jpd_CEMEAnpdc` | Édition dédiée CEMÉA NPDC (11 balises) | Fork rethémé, v1.3.0 |
| `jpd_CdB` | Édition dédiée Cristaux de Balto (9 balises, élevage huskys) | Fork rethémé, v1.1.0 |

## 2. Stack réelle mesurée (plateforme `jpd` / Multi_JDP)

**Zéro dépendance npm, zéro build obligatoire, zéro framework.** Vanilla JS/HTML/CSS.

### Client (~500 Ko de JS)
| Fichier | Lignes | Rôle |
|---|---|---|
| `app.js` | 2 572 | Orchestrateur : 15 écrans (accueil, carte, scan QR, énigme, fiche découverte, quiz, carnet, palmarès, réglages, god mode…) |
| `data.js` | 3 111 | **Généré** par build-data depuis content/ (BIRDS/GUIDE/BALISES/THEMES + fonctions moteur : getBird, getEnigme, checkAnswer, makeQuiz, applyAdminData…) |
| `store.js` | 200 | Profils/équipes en localStorage (progression, scores, graines) |
| `audio.js` | 274 | AudioSys : synthèse WebAudio des signatures d'approche (aucun asset MP3) |
| `compass.js` + `declination.js` | 335 | Boussole magnétique + déclinaison |
| `i18n.js` | 431 | 6 langues (fr/en/nl/de/zh/ja) |
| `qr.js`/`jsqr.js`/`qrcode.js` | ~2 000 | Scan + génération QR (vendored) |
| `challenges.js` + `board.js` | 249 | Épreuves aléatoires diffusées par l'organisateur |
| `birdnet.js` | 110 | Reconnaissance chant (expérimental, plugin-like) |
| `dict.js` | 90 | Dictée vocale des réponses |

### Serveur
**`server.ps1` (PowerShell 5.1, ~1 600 lignes)** — HTTP + HTTPS auto-signé :
- 18 endpoints `/api/*` : board/messages traduits, answers, map, wifi(+détection), ip, pos (+ télémétrie batterie/réseau/caméra), finish, urgency(+resolve), feedback, validations (+remove/team, validation à distance GPS/manuel/question/code), report, editor(+images), qr/export, kml, server-mode (tunnel cloudflared).
- Dashboard organisateur temps réel (`dashboard.html`, ~1 700 l.) : carte des équipes, urgences avec alarme, validations multi-modes, QR d'accès Wi-Fi+jeu imprimables.
- Mono-thread, état majoritairement en mémoire, persistance JSON partielle (`validations.json`, `finishes.json`, …).

### Contenu & outils
```
content/
├─ manifest.json          (4 packs : 2 actifs, 2 en réserve)
├─ packs/<id>/balises|decouvertes|guide/*.json   (schéma validé)
├─ themes/*.json          (thèmes CSS protégés par mot de passe, défaut « Sam »)
└─ bundles/*.json         (packs exportables vers atelier)
tools/build-data.mjs      (générateur VALIDANT : champs requis, quiz complets,
                           unicité inter-packs, cohérence balise→découverte, --check CI)
```

### Admin & offline
- `editeur.html` (99 Ko) : édition balises/découvertes/thèmes → surcouche `admin-data.json`.
- `atelier.html` : import/export de bundles de packs.
- `questionnaire.html` : retours testeurs beta.
- `sw.js` : précache + runtime cache versionné (v7). Profils localStorage ⇒ **offline-first réel**.

### Docs
README, CONTRIBUTING, CHANGELOG, LICENSE AGPL-3.0 + LICENSE-DOCS, NOTICE, wikis × 4 dépôts.

## 3. Ce qui est déjà universel (capital à préserver)

1. **Modèle contenu/moteur fonctionnel** : un pack JSON = parcours jouable sans code (prouvé ×4 packs).
2. Générateur validant = embryon de `content-schema`.
3. Trio serveur local + dashboard + QR d'accès + mode terrain (GPS/KML/distances/rayons).
4. Offline-first réel (PWA installable, synthèse audio, zéro CDN).
5. Mécaniques génériques riches : énigmes ×3 difficultés avec tranches d'âge, indices, quiz, scoring étoiles/temps, bonus, thèmes, i18n, urgences auto-traduites.

## 4. Diagnostic par élément

| Élément | Verdict | Justification |
|---|---|---|
| Modèle contenu JSON | **Conserver + étendre** | Solide ; manque pédagogie explicite, débriefing, missions conditionnelles |
| `build-data.mjs` | **Conserver** | Devient le cœur de la validation du schéma universel |
| Client vanilla | **Refactoriser progressivement** | Extraire game-engine/scoring/teams en modules ES testables ; pas de réécriture |
| `server.ps1` | **Remplacer (incrémental) par Node.js** | Non testable sous CI Linux, difficile sur RPi, pas de vraie persistance ; les contrats `/api/*` deviennent la spec |
| `sw.js` | Conserver | Simple, efficace ; hachage de contenu plus tard |
| localStorage profils | Conserver + compléter | IndexedDB pour médias/queue de synchro |
| Dashboard/éditeur inline | Fusionner dans DUCYB puis découper | Fonctionnels mais monolithiques |
| **Éditions = forks complets** | **Fusionner (supprimer à terme)** | ~90 % de code dupliqué ; preuves de dérive : SW CdB jamais rethémé (`jdpep-v4`), features divergentes. Une édition doit devenir une **donnée** (pack + thème + branding) |
| Bug `allBirds()` (2026-08-24) | Leçon structurante | Régression silencieuse passée en prod ⇒ tests unitaires obligatoires dès PHASE 2 |
| Auth `/api` | **À créer** | Aucune authentification : via tunnel public, quiconque connaît l'URL peut kicker/valider/déclencher une alerte |
| `birdnet.js`, `declination.js` | Conserver | Modèles du futur système de plugins |

## 5. Risques & dettes principales

1. **Duplication par fork** des éditions (dérive garantie sans fusion).
2. **Zéro test automatisé** (la CI vérifie seulement la synchro bundle + syntaxe).
3. Serveur PowerShell mono-thread, non persistant, non portable.
4. Endpoints publics sans authentification.
5. Accessibilité non auditée (bonnes pratiques présentes çà et là, pas systématiques).
6. `dashboard.html`/`editeur.html` monolithiques difficiles à faire évoluer.
