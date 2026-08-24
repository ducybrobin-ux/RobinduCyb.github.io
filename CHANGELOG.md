# Journal des modifications

Historique DUCYB (moteur universel) puis héritage Multi JDP.
Format inspiré de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/) — versionnement sémantique.

## [DUCYB 0.1.0] — 2026-08-24

### Ajouté
- Dépôt fondateur : copie fidèle de la plateforme Multi JDP v2.0.3 (commit `b9dc7f9`) comme base de migration
- Documentation fondatrice : AUDIT, ARCHITECTURE, ROADMAP (7 phases), DATA_MODEL (`ducyb-parcours` v1), MIGRATION
- Gouvernance : README, CONTRIBUTING, SECURITY (dette auth `/api` documentée), CODE_OF_CONDUCT
- CI reprise de la plateforme (syntaxe JS, synchronisation content↔data.js, JSON)

### Vérifié
- Non-régression complète de la copie (voir docs/MIGRATION.md)

## [Multi JDP 2.0.3] — 2026-08-24

### Corrigé
- **Blocage après la validation d'une énigme** : la fonction `allBirds()` (découvertes + guide) avait été perdue lors du passage au contenu modulaire — `getBird()` échouait, la fiche découverte ne s'affichait plus (plus de boussole, d'émojis ni de son). Fonction restaurée dans le moteur

### Ajouté
- **Panneau « 📱 Familles »** dans le tableau de bord : état de connexion de chaque famille en direct — en ligne/hors ligne + type de réseau (wifi/4g…), batterie (%) et charge ⚡, autorisation caméra 📷, précision GPS 🛰️ (± m) avec heure du dernier fix, balises validées ✅ n/N, dernier signe de vie 👁️ — et bouton ⏻ pour déconnecter la famille
- **Télémétrie des appareils** : l'application envoie désormais toutes les 20 s batterie/réseau/caméra/GPS au serveur (en plus des positions), visibles par l'organisateur
- **Validation à distance multi-modes** : dans « Balises validées par équipe », cliquer une balise ouvre le choix ✋ Manuel · 🛰️ GPS (vérifie que la famille est bien sur place via sa dernière position) · ❓ Question (affiche l'énigme et les réponses acceptées) · 🔑 Code (saisie du code de la balise)

### Modifié
- Première balise de chaque pack repositionnée sur le point de départ commun des événements (50.7258178, 3.1329639)
- Service worker reversionné (v7)

## [2.0.2] — 2026-08-23

### Ajouté
- **Panneau « 📏 Terrain »** dans l'éditeur : distances réelles entre balises consécutives, longueur totale du parcours, alerte quand les cercles de validation GPS se chevauchent (→ QR code ou rayon plus petit)
- **Rayon GPS par balise éditable** : champ « Rayon GPS propre » dans le formulaire de chaque balise

### Modifié
- **Mot de passe des thèmes toujours visible** dans Réglages dès que la protection est active, avec rappel du mot de passe par défaut (Sam) — plus besoin de tenter un changement pour découvrir le champ
- Service workers reversionnés (v5 / v3) pour invalider les caches des visiteurs

## [2.0.1] — 2026-08-23

### Ajouté
- **Précision GPS maximale** : acquisition à la meilleure fixe (`watchPosition` jusqu'à ±5 m ou fin de fenêtre) dans l'éditeur ET dans le jeu ; cercle d'incertitude affiché sur la carte de l'éditeur
- **Mode terrain ⛓️** : après chaque capture réussie, la balise suivante s'ouvre automatiquement — placement sur site en une marche
- **Rayon de validation par balise** : champ optionnel `radius` (mètres) dans les balises JSON ; défaut global resserré de 30 m à **12 m**
- **Pack CEMÉA étendu à 11 balises** : nouvelles découvertes Éducation du Dehors, Erasmus+, Yakamédia, Économie sociale, Accueillir tout·es — parcours CEMÉA complet positionné sur les repères GPS réels du site (import depuis Google My Maps)
- **Éditeur de carte** : import KML / Google My Maps par URL (proxy serveur `/api/kml`, anti-CORS) ou fichier `.kml` ; attribution des repères aux balises dans l'ordre, recentrage automatique
- **Recherche dans l'éditeur de carte** : retrouvez une balise par numéro, code ou nom et centrez la carte dessus
- **Ajustement de la carte du jeu** : projection automatique des coordonnées GPS vers la carte schématique (répartition en ellipse si le terrain est compact) et régénération du tracé

### Modifié
- Identité visuelle CEMÉA Nord-Pas-de-Calais : logo officiel (variante blanche pour le mode nuit), mise à jour des écrans

## [2.0.0] — 2026-08-23

### Ajouté
- **Plateforme multi-packs** : le parcours combine les packs actifs de `content/manifest.json` — 🧠 `biais-cognitifs` + 🤝 `cemea-education-populaire` (14 découvertes, 14 notions, 14 balises) ; modules 🛡️ `harcelement-scolaire` (cycle 3/4) et 🚜 `metiers-tension` (orientation 3e) livrés prêts à activer
- **Thèmes visuels** (`content/themes/*.json`) : Nuit étoilée, Nature, Espace, Futuriste, Rétro — appliqués en direct, anti-flash au démarrage, meta theme-color synchronisée
- **Mot de passe organisateur** sur le changement de thème (défaut `Sam`, modifiable depuis Réglages par le profil Admin) ; déverrouillage valable pour la session
- Schéma balise assoupli : codes multi-packs (`B1`, `C1`, `HS1`, `MT1`…)

### Modifié
- Habillage neutre et inclusif (« Multi Jeu de Piste », métaphore des graines 🌱) ; les contenus spécifiques restent dans leurs packs

### Compatibilité
- Identifiants historiques conservés (`BIRDS`, `chant`, préfixes éditeur) ; données de partie locales inchangées

## [1.1.1] — 2026-08-23

### Ajouté
- **Atelier de packs** (`atelier.html` + `js/atelier.js`) : application embarquée de création de contenu — pack metadata, découvertes avec quiz et objectifs pédagogiques, notions du guide, balises avec énigmes par niveau d'âge, validation en direct, export/import de bundles
- `tools/import-pack.mjs` : installe un bundle exporté par l'atelier (validation, éclatement en fichiers, mise à jour du manifest)
- `tools/build-data.mjs` génère désormais aussi `content/bundles/<id>.json` (bundle complet par pack, ouvrable dans l'atelier)
- Lien « Atelier de packs » dans l'éditeur ; atelier préchargé hors-ligne (cache SW v2)

## [1.1.0] — 2026-08-23

### Ajouté
- **Architecture de contenu modulaire** : le contenu pédagogique vit dans `content/` — un fichier JSON par notion (8 découvertes, 10 notions du guide, 8 balises), regroupés en packs activables via `manifest.json`
- Métadonnées pédagogiques par notion : `ages`, `duree_min`, `objectif`, `programme` ; tranches d'âge par niveau d'énigme (facile 6-9, moyen 10-13, difficile 14+)
- Schémas JSON Schema (draft-07) dans `content/schemas/` comme contrat pour les contributions
- `tools/build-data.mjs` : régénération validée de `js/data.js` depuis les packs + mode `--check` (contrôle de synchronisation exécuté en CI)
- `tools/split-content.mjs` : migration one-shot de l'ancien `data.js` monolithique vers les packs

### Modifié
- `js/data.js` : la région contenu est désormais générée (marqueurs explicites) ; SITE, TRAIL et les fonctions moteur restent manuels

### Compatibilité
- Aucun changement d'interface runtime : éditeur, serveur, PDF et PWA fonctionnent à l'identique

## [1.0.0] — 2026-08-23

### Ajouté
- Jeu complet : 8 balises sur le sentier, 8 pièges cognitifs (énigmes, quiz 3 niveaux, antidotes), guide de 10 notions supplémentaires
- Avertisseur d'approche au choix : signature sonore, radar, bip-bip, pulsation — ou enregistrement micro personnalisé (5 s max)
- Fiche pédagogique PDF (4 pages) générée depuis les données du jeu, consultable hors-ligne depuis l'écran Guide
- Tableau de bord organisateur : messages aux équipes, épreuves en direct (enquête, son, observation, rapidité), suivi GPS, panneau urgences, affiche QR Wi-Fi + jeu imprimable
- Éditeur intégré (`/editeur`) : site, balises, découvertes, quiz, guide — export/import JSON
- Modes classique / aléatoire / course chronométrée ; palmarès hebdomadaire ; carnet de terrain ; livre d'or avec selfie
- Mode hors-ligne complet via service worker (`jdpbc-*`)
- Serveur local HTTPS PowerShell (`server.ps1`) avec tunnel cloudflared optionnel
- Accessibilité : dictée vocale, lecture d'écran, mode nuit
- Démo statique sur GitHub Pages

### Dérivation
- Œuvre dérivée de TSLE1 « La toile sous les étoiles » (ornithologie) : mécanique de jeu conservée, thème remplacé par les biais cognitifs, interface entièrement francisée — voir NOTICE.md

[1.0.0]: https://github.com/ducybrobin-ux/jpd/releases/tag/v1.0.0
