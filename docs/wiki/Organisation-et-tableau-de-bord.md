# Organisation et tableau de bord

Le tableau de bord (`/dashboard`) est la console de l'organisateur. Il se pilote depuis le PC du site et se met à jour toutes les 5 secondes.

## Accès des familles

- **1️⃣ QR Wi-Fi** : saisissez SSID + mot de passe (détection automatique possible), l'application génère un QR à imprimer.
- **2️⃣ QR du jeu** : QR vers l'URL locale (ou tunnel public). Les deux QR s'assemblent sur une affiche A4 prête à imprimer (PDF/JPEG, export, envoi par mail).

## Message aux participants

Écrivez un message en français et diffusez-le : il apparaît en bannière sur l'écran des équipes, même hors connexion. La dictée vocale 🎤 est disponible.

## Épreuves en direct

- 🎲 **Tirage aléatoire** parmi les épreuves (enquête 🔍, signature sonore 🎵, observation 👀, rapidité ⚡).
- Ajoutez un indice optionnel puis « Diffuser » : l'épreuve s'affiche chez toutes les équipes.
- « Arrêter » retire l'épreuve en cours.

## Suivi des équipes

- 🗺️ Positions GPS rafraîchies automatiquement sur la carte du parcours.
- ✅ Balises validées par équipe (clic pour valider/dévalider manuellement).
- 🏁 Liste des équipes terminées.
- 🆘 Panneau **urgences** : les familles peuvent appeler à l'aide ; alerte sonore côté organisateur.
- ⏻ Déconnexion forcée d'un appareil si besoin.

## Mode admin

Un profil nommé **« Admin »** (0 enfant) débloque : codes de toutes les balises, QR codes, navigation directe, rapport d'état et réinitialisation complète. L'interrupteur se trouve dans Réglages.

## Serveur

| Mode | Usage | URL |
|---|---|---|
| 🏠 Local | Équipes sur le Wi-Fi du site | `https://<ip-du-pc>:8080` |
| 🌍 Internet | Équipes à distance via tunnel cloudflared | URL publique affichée |

Au moins un mode doit rester actif.
