# Architecture technique

## Vue d'ensemble

JDP_BC est une **PWA sans build** : aucun framework, aucune dépendance npm, aucun processus de compilation. Des modules JavaScript classiques chargés par `<script>` partagent un scope global minimal.

```
index.html          écran familles (SPA par sections .screen)
dashboard.html      console organisateur (i18n interne fr)
editeur.html        éditeur de contenu → export JSON
questionnaire.html  questionnaire testeurs
js/
  data.js     SITE, TRAIL, BIRDS (8 biais), GUIDE (10 notions), BALISES, quiz
  store.js    persistance localStorage (profils, réglages, progression) — clés jdp_*
  i18n.js     interface française (monolingue)
  audio.js    Web Audio : signatures synthétiques + avertisseurs (radar/bip/pulse/custom)
  compass.js  boussole + indice lumineux d'approche
  qr.js       lecture QR (caméra) — jsqr.js — génération QR — qrcode.js
  birdnet.js  reconnaissance sonore en ligne (« Shazam des ambiances »)
  dict.js     dictée vocale (Web Speech API)
  board.js    réception messages/épreuves côté participants
  challenges.js  épreuves du tableau de bord
  declination.js déclinaison magnétique (nord vrai)
  app.js      orchestration (écrans, énigmes, quiz, carnet, palmarès…)
server.ps1      serveur HTTPS local PowerShell (+ proxy cloudflared optionnel)
sw.js           service worker : precache complet → 100 % hors-ligne
docs/           fiche pédagogique PDF + sources du wiki
```

## Choix notables

- **Identifiants historiques conservés** : `BIRDS`, `getBird`, `chant` désignent désormais les découvertes/pièges — héritage du projet d'origine TSLE1, renommés uniquement dans l'interface.
- **Avertisseurs d'approche** : `AudioSys.startProxSound()` choisit entre la signature de la découverte et l'avertisseur sélectionné (`alertSound` : `radar`, `bip`, `pulse`, `custom`). Le mode custom stocke un enregistrement micro (≤ 5 s) en data-URL dans les réglages, décodé en `AudioBuffer` puis rejoué avec vitesse/gain selon la distance.
- **Hors-ligne** : `PRECACHE` liste tout le nécessaire (y compris le PDF pédagogique) ; caches versionnés `jdpbc-*`.
- **Serveur** : `server.ps1` crée un certificat auto-signé au premier lancement et sert l'app en HTTPS ; WebSocket/long-polling léger pour le temps réel du tableau de bord.

## Données & vie privée

- Tout fonctionne en local : profils, progression, photos et enregistrements restent sur les appareils / le PC du site.
- Aucun télémétrage, aucun compte en ligne. La reconnaissance sonore est le seul appel sortant optionnel.
- Les données runtime vont dans `data/` (non versionnée).

## Contribuer

1. Forkez, créez une branche, modifiez (éditeur intégré `/editeur` pour le contenu).
2. Vérifiez la syntaxe : `node --check js/*.js`.
3. Pull request bienvenue — licence AGPL-3.0 maintenue.
