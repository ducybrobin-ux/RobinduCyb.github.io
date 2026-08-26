# SERVER.md — Référence des endpoints `/api/*`

> Portage Node.js de `server.ps1` — specification pour la migration.
> Serveur : `packages/server/` (Node.js, zéro dépendance externe).

---

## Table des matières

- [Authentication](#authentication)
- [Board (Messages & Épreuves)](#board-messages-épreuves)
- [Positions GPS](#positions-gps)
- [Validations](#validations)
- [Urgence](#urgence)
- [Configuration](#configuration)
- [Éditeur](#éditeur)
- [Rapport](#rapport)
- [KML](#kml)

---

## Authentication

### POST /api/auth/login

Authentifie l'organisateur. Premier appel = définit le mot de passe.

**Request** :
```json
{ "password": "string" }
```

**Response 200** :
```json
{ "ok": true, "token": "string", "firstLogin": true }
```

**Response 401** :
```json
{ "ok": false, "error": "invalid-password" }
```

**Sécurité** : Token aléatoire 32 octets, expire après 24h. `crypto.timingSafeEqual` pour la comparaison.

---

### POST /api/auth/logout

Détruit la session.

**Headers** : `Authorization: Bearer <token>`

**Response 200** : `{ "ok": true }`

---

### GET /api/auth/me

Vérifie si l'utilisateur est authentifié.

**Headers** : `Authorization: Bearer <token>`

**Response 200** : `{ "ok": true, "authenticated": true }`

**Response 401** : `{ "ok": false, "error": "unauthorized" }`

---

### POST /api/auth/setup

Définit le mot de passe (uniquement si pas encore défini).

**Request** : `{ "password": "string" }` (min 4 caractères)

**Response 200** : `{ "ok": true, "token": "string" }`

---

## Board (Messages & Épreuves)

### GET /api/board

Récupère le message diffusé, l'épreuve en cours, et les déconnexions.

**Response 200** :
```json
{
  "seq": 1,
  "message": { "fr": "...", "en": "...", "nl": "...", "de": "...", "zh": "...", "ja": "..." },
  "challenge": { "id": "...", "question": "...", "options": [...] },
  "challengeSeq": 1,
  "logoutTeams": ["team1"],
  "logoutSeq": 1
}
```

---

### POST /api/board

Envoie un message ou gère les épreuves.

**Actions** :

| action | Description | Payload |
|--------|-------------|---------|
| `message` | Diffuse un message | `{ "messages": { "fr": "...", ... } }` |
| `challenge` | Publie une épreuve | `{ "challenge": { "id": "...", "question": "..." } }` |
| `clear` | Efface message + épreuve | `{}` |
| `logout` | Déconnecte une équipe | `{ "team": "..." }` |
| `logoutAck` | Accuse réception déconnexion | `{ "team": "..." }` |

**Authentification requise** pour : message, challenge, clear

---

### POST /api/answer

Enregistre la réponse d'une équipe à une épreuve.

**Request** :
```json
{
  "team": "string",
  "text": "string",
  "challengeId": "string"
}
```

**Response 200** : `{ "ok": true }`

---

### GET /api/answers

Récupère les 60 dernières réponses.

**Response 200** :
```json
{
  "answers": [
    { "team": "...", "text": "...", "challengeId": "...", "at": "14:30:25" }
  ]
}
```

---

## Positions GPS

### GET /api/pos

Récupère les positions récentes (< 3 min) et statuts des équipes.

**Response 200** :
```json
{
  "seq": 5,
  "positions": [
    { "team": "...", "lat": 50.7258, "lng": 3.1329, "at": "14:30:25", "acc": 8 }
  ],
  "statuses": [
    {
      "team": "...", "bat": 87, "chg": false, "onl": true,
      "net": "wifi", "cam": "granted", "acc": 8,
      "seen": "14:30:25", "posAt": "14:30:25", "lat": 50.7258, "lng": 3.1329
    }
  ]
}
```

---

### POST /api/pos

Envoie la position GPS d'une équipe.

**Request** :
```json
{
  "team": "string",
  "lat": 50.7258,
  "lng": 3.1329,
  "acc": 8,
  "bat": 87,
  "chg": false,
  "onl": true,
  "net": "wifi",
  "cam": "granted"
}
```

**Response 200** : `{ "ok": true }`

---

### GET /api/finish

Récupère la liste des équipes ayant terminé.

**Response 200** :
```json
{
  "finishes": [
    {
      "team": "...", "stars": 15, "seconds": 3600,
      "balises": 5, "offered": 0, "message": "", "selfie": "",
      "at": "2026-08-25T14:30:00.000Z"
    }
  ]
}
```

---

### POST /api/finish

Enregistre qu'une équipe a terminé.

**Request** :
```json
{
  "team": "string",
  "stars": 15,
  "seconds": 3600,
  "balises": 5,
  "offered": 0,
  "message": "string",
  "selfie": "string"
}
```

**Response 200** : `{ "ok": true }`

**Persistance** : `data/finishes.json`

---

## Validations

### GET /api/validations

Récupère toutes les validations (équipes → balises).

**Response 200** :
```json
{
  "validations": {
    "team1": ["B1", "B2", "B3"],
    "team2": ["B1"]
  }
}
```

---

### POST /api/validations

Valide une balise pour une équipe.

**Request** : `{ "team": "string", "balise": "B1" }`

**Response 200** : `{ "ok": true, "balises": ["B1"] }`

**Persistance** : `data/validations.json`

---

### POST /api/validations/remove

Supprime une validation.

**Request** : `{ "team": "string", "balise": "B1" }`

**Response 200** : `{ "ok": true, "balises": [] }`

---

### POST /api/validations/team

Crée une entrée vide pour une équipe.

**Request** : `{ "team": "string" }`

**Response 200** : `{ "ok": true }`

---

## Urgence

### GET /api/urgency

Récupère les alertes ouvertes.

**Response 200** :
```json
{
  "urgencies": [
    {
      "team": "...", "type": "lost|emergency|message",
      "lat": 50.7258, "lng": 3.1329, "at": "...",
      "message": "...", "lang": "fr"
    }
  ]
}
```

---

### POST /api/urgency

Crée une alerte urgence.

**Types** : `lost` (perdu), `emergency` (urgence), `message` (message libre)

**Request** :
```json
{
  "team": "string",
  "type": "lost|emergency|message",
  "lat": 50.7258,
  "lng": 3.1329,
  "message": "string",
  "lang": "fr"
}
```

**Response 200** : `{ "ok": true }`

**Persistance** : `data/urgencies.json`

---

### POST /api/urgency/resolve

Marque une urgence comme résolue.

**Request** : `{ "team": "string" }`

**Response 200** : `{ "ok": true }`

---

## Configuration

### GET /api/ip

Récupère l'IP locale et les URLs d'accès.

**Response 200** :
```json
{
  "ip": "192.168.1.100",
  "port": 8443,
  "url": "https://192.168.1.100:8443",
  "lanUrl": "https://192.168.1.100:8443",
  "tunnelUrl": "",
  "internet": false
}
```

---

### GET /api/server-mode

Récupère le mode de fonctionnement.

**Response 200** :
```json
{
  "local": true,
  "internet": false,
  "tunnelStatus": "off",
  "tunnelUrl": "",
  "tunnelError": "",
  "lanUrl": "https://192.168.1.100:8443",
  "url": "https://192.168.1.100:8443"
}
```

---

### POST /api/server-mode

Change le mode de fonctionnement.

**Request** : `{ "local": true, "internet": false }`

**Authentification requise**

---

### GET /api/wifi

Récupère les informations Wi-Fi.

**Response 200** :
```json
{ "ssid": "Curios", "password": "...", "security": "WPA", "hasWifi": true }
```

---

### POST /api/wifi

Configure le Wi-Fi.

**Request** : `{ "ssid": "string", "password": "string", "security": "WPA" }`

**Authentification requise**

---

### GET /api/wifi/detect

Détecte le réseau Wi-Fi actuel (non disponible sur Node.js).

**Response 200** : `{ "ssid": "", "signal": "", "detected": false }`

---

### GET /api/map

Récupère l'URL de la carte.

**Response 200** : `{ "url": "string", "hasMap": true }`

---

### POST /api/map

Configure l'URL de la carte.

**Request** : `{ "url": "string" }`

**Authentification requise**

---

## Éditeur

### GET /api/editor

Récupère le contenu édité (admin-data.json).

**Response 200** : `{ "data": { ... } }`

---

### POST /api/editor

Sauvegarde le contenu édité.

**Request** : `{ "data": { ... } }`

**Authentification requise**

---

### GET /api/editor/images

Liste les images disponibles.

**Response 200** : `["img/photo1.jpg", "img/logo.png"]`

---

### POST /api/editor/image

Upload une image.

**Request** :
```json
{ "name": "photo.jpg", "data": "base64..." }
```

**Authentification requise**

---

### POST /api/editor/reset

Supprime admin-data.json.

**Authentification requise**

---

### POST /api/qr/export

Exporte des QR codes en images.

**Request** :
```json
{ "files": [{ "name": "qr-wifi.jpg", "data": "base64..." }] }
```

**Response 200** :
```json
{ "ok": true, "saved": ["qr-wifi.jpg"], "errors": [], "dir": "qrcodes" }
```

---

## Rapport

### GET /api/report

Génère un rapport complet de l'état du serveur.

**Authentification requise**

**Response 200** :
```json
{
  "ok": true,
  "subject": "Curios — Rapport complet 25/08/2026",
  "text": "...",
  "html": "<!DOCTYPE html>..."
}
```

---

## KML

### GET /api/kml?u=...

Proxy CORS pour import KML Google My Maps.

**Paramètres** : `u` = URL Google Maps KML

**Response 200** : XML KML

---

## Sessions

### POST /api/session

Crée une nouvelle session de jeu.

**Request** :
```json
{
  "parcoursId": "string",
  "editionId": "string",
  "title": "string"
}
```

**Response 200** :
```json
{
  "ok": true,
  "sessionId": "string",
  "startedAt": "2026-08-25T14:30:00.000Z"
}
```

---

### GET /api/session

Récupère les sessions actives.

**Paramètres** : `id` (optionnel) — ID d'une session spécifique

**Response 200** :
```json
{
  "sessions": [
    {
      "id": "string",
      "parcoursId": "string",
      "title": "string",
      "startedAt": "string",
      "teamCount": 3
    }
  ]
}
```

---

### POST /api/session/team

Ajoute une équipe à une session.

**Request** :
```json
{
  "sessionId": "string",
  "teamName": "string"
}
```

**Response 200** :
```json
{
  "ok": true,
  "teamId": "string",
  "joinedAt": "string",
  "alreadyExists": false
}
```

---

### POST /api/session/progress

Enregistre la progression d'une équipe.

**Request** :
```json
{
  "sessionId": "string",
  "teamId": "string",
  "stationId": "B1",
  "missionId": "m1",
  "mode": "gps|qr|manuel",
  "stars": 3
}
```

**Response 200** : `{ "ok": true, "progressCount": 5 }`

---

### POST /api/session/end

Termine une session.

**Request** : `{ "sessionId": "string" }`

**Response 200** :
```json
{
  "ok": true,
  "endedAt": "string",
  "teamCount": 3
}
```

---

## Endpoints protégés

Les endpoints suivants nécessitent un token d'authentification :

- `POST /api/board` (message, challenge, clear)
- `POST /api/editor`
- `GET /api/editor/images`
- `POST /api/editor/image`
- `POST /api/editor/reset`
- `POST /api/qr/export`
- `GET /api/report`
- `POST /api/validations/remove`
- `POST /api/validations/team`
- `POST /api/server-mode`
- `POST /api/wifi`
- `POST /api/map`

---

## Persistance

| Donnée | Fichier |
|--------|---------|
| Validations | `data/validations.json` |
| Finishes | `data/finishes.json` |
| Urgences | `data/urgencies.json` |
| Wi-Fi | `data/wifi.json` |
| Mode serveur | `data/server-mode.json` |
| Carte | `data/map.json` |
| Mot de passe | `data/auth.json` |
| Feedback | `data/feedback.json` |

---

*Document généré depuis `packages/server/src/routes/*.js`*
