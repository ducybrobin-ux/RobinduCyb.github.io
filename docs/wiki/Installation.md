# Installation

## Prérequis

- Windows 10/11 avec **PowerShell 5.1** (inclus) — aucun package à installer
- Un navigateur récent sur le PC (Chrome/Edge recommandé) et sur les téléphones
- Un réseau **Wi-Fi** auquel les téléphones peuvent se connecter (box, routeur de poche ou partage de connexion du PC)

## Lancement en 3 étapes

### 1. Démarrer le serveur local

Double-cliquez sur `demarrer_serveur.cmd` :

- un serveur **HTTPS** démarre sur `https://localhost:8443` (réseau local : port 8080)
- une fenêtre du jeu s'ouvre automatiquement
- fermez la fenêtre (ou Ctrl+C) pour arrêter

> Le HTTPS auto-signé est **indispensable** : le GPS et la caméra ne fonctionnent que sur une origine sécurisée. Au premier accès, acceptez l'avertissement de certificat.

### 2. Préparer le mode hors-ligne

Sur chaque téléphone (ou au moins sur celui qui reste connecté au Wi-Fi) : ouvrez le jeu → Réglages → « ⬇️ Préparer le mode hors-ligne ». Cartes, sons et fiches sont mis en cache par le service worker : tout fonctionne ensuite **sans aucune connexion**.

### 3. Connecter les familles

Depuis le [tableau de bord](Organisation-et-tableau-de-bord), imprimez l'affiche **QR Wi-Fi + QR du jeu** :
1. les téléphones rejoignent le Wi-Fi du site ;
2. ils scannent le QR du jeu (`https://<ip-du-pc>:8080`) et jouent.

## Équipes à distance (optionnel)

Des participants hors de portée du Wi-Fi ? Le tableau de bord peut démarrer un **tunnel public cloudflared** (« Serveur Internet »). Les équipes distantes utilisent alors l'URL publique affichée. Le binaire `cloudflared.exe` n'est pas inclus dans le dépôt ; placez-le dans `data/` si besoin.

## Dépannage rapide

| Symptôme | Solution |
|---|---|
| « Serveur non joignable » depuis un téléphone | Vérifier même réseau Wi-Fi + pare-feu Windows sur le port 8080 |
| GPS ne bouge pas | Autoriser la géolocalisation dans le navigateur + être à l'extérieur |
| Pas de son | Réglages → « Sons et ambiances » activé + volume |
| Certificat refusé en boucle | Passer par l'URL exacte `https://…:8080` puis « Avancé → Continuer » |
