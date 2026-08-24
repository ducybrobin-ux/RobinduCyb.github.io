# ARCHITECTURE — DUCYB

## 0. Principe directeur

**Évolution, pas révolution.** On garde le duo gagnant « fichiers statiques offline-first +
serveur local simple » et on industrialise : modularité, tests, fusion des forks.

Interdits : réécriture massive, dépendance framework non justifiée, verrouillage
fournisseur (cartes/IA/hébergement), fonctionnalités nécessitant Internet obligatoire.

## 1. Vue cible

```
ducyb/                          (monorepo unique remplaçant progressivement les forks)
├─ apps/
│  ├─ player/        ← app participant (héritier de index.html + app.js)
│  ├─ dashboard/     ← maître du jeu (héritier de dashboard.html)
│  ├─ studio/        ← création de parcours (fusion editeur.html + atelier.html)
│  └─ server/        ← Node.js (port des endpoints /api/* de server.ps1, SQLite)
├─ packages/         ← modules ES purs, SANS DOM, testables :
│  ├─ core/          event bus, états, i18n, erreurs
│  ├─ game-engine/   missions, conditions, énigmes, indices, scoring, progression
│  ├─ pedagogy-engine/ objectifs, compétences (CPS), indicateurs observables, bilan
│  ├─ geolocation/   best-fix GPS, rayons par balise, haversine, KML (code existant)
│  ├─ content-schema/ validation + conversion pack↔ducyb (héritier build-data.mjs)
│  ├─ offline/       adaptateur service worker + queue de synchronisation différée
│  ├─ teams/ scoring/ media/ accessibility/ analytics/ shared/
│  └─ plugins/       qr (existe), nfc, arduino… interfaces sans toucher au cœur
├─ content/
│  ├─ packs/         tsle1/, jdp-bc/, cemea-npdc/, cristaux-de-balto/, examples/
│  └─ editions/*.json  nom + thème + logo + préfixe SW ⇒ REMPLACE LES FORKS
├─ docs/
└─ tests/            unit (node:test) · intégration (serveur) · e2e (playwright) · offline
```

## 2. Choix techniques argumentés

| Sujet | Décision | Pourquoi |
|---|---|---|
| Framework UI | **Aucun au départ** — modules ES + HTML/CSS modernes ; JSDoc typé (TS optionnel plus tard) | Le besoin critique est testabilité/modularité, pas réactivité UI ; les écrans marchent ; zéro build = robustesse terrain |
| Build | Vite en devDependency **optionnel** ; le site doit rester servable sans build | Déploiement « dézipper → lancer » préservé |
| Serveur | **Node.js remplace PowerShell** endpoint par endpoint | Testable CI Linux, Raspberry Pi, SQLite natif, WebSocket possible ; `server.ps1` conservé en repli jusqu'à parité |
| Base de données | SQLite côté serveur (sessions, équipes, progression) ; IndexedDB client (médias, queue synchro) | Fichier unique = sauvegarde/copie USB triviale ; zéro service à installer |
| Cartographie | Abstraction `MapProvider` : fond SVG schématique (déjà là, offline par défaut) ; tuiles OSM préchargées en option | Aucune dépendance Google Maps |
| Temps réel | Polling `/api` actuel suffisant ; WebSocket seulement si mesuré nécessaire | Simplicité d'abord |
| IA | Jamais dans le chemin d'exécution. Studio uniquement : propositions → JSON validé par le schéma → revue humaine obligatoire | Un parcours doit tourner sans Internet ni compte externe |

## 3. Règles transverses

1. **Offline-first** : toute fonctionnalité doit fonctionner `smartphone ↔ Wi-Fi local ↔ serveur`, Internet facultatif.
2. **Sécurité par minimisation** : pseudonymes, sessions temporaires, aucune donnée personnelle inutile, tout reste local sauf choix explicite.
3. **Accessibilité WCAG** dès la conception des packages (alternatives GPS/vision/audition/motricité).
4. **Plugins** : matériel (QR/NFC/capteurs) derrière interfaces ; le moteur ignore le matériel.
5. **Chaque abstraction nouvelle doit prouver qu'aucune abstraction existante ne convient.**

## 4. Contrats stables hérités

- Endpoints `/api/*` documentés dans SERVER.md (à venir) — ils sont la spec du portage Node.
- Schéma de pack v1 (balise/découverte/guide/thème) — base du schéma universel (voir DATA_MODEL.md).
- Format bundle atelier (`$format: "jdpbc-pack"`) — deviendra `$format: "ducyb-parcours"` avec convertisseur.
