# SECURITY.md — Modèle d'authentification Curios

## Principe

Le serveur Curios utilise une authentification par **token** pour protéger les
endpoints de l'organisateur. Les participants n'ont pas besoin d'authentification.

## Modèle

1. **Premier accès** : `/api/auth/setup` définit le mot de passe organisateur.
2. **Connexion** : `POST /api/auth/login` avec le mot de passe → token aléatoire (32 octets hex).
3. **Requêtes protégées** : le token est envoyé dans le header `Authorization: Bearer <token>`.
4. **Déconnexion** : `POST /api/auth/logout` invalide le token.
5. **Expiration** : les tokens expirent après 24h.

## Endpoints protégés

| Endpoint | Méthode | Protection |
|----------|---------|------------|
| `/api/editor` | POST | Token requis |
| `/api/editor/images` | GET | Token requis |
| `/api/editor/image` | POST | Token requis |
| `/api/editor/reset` | POST | Token requis |
| `/api/qr/export` | POST | Token requis |
| `/api/report` | GET | Token requis |
| `/api/validations/remove` | POST | Token requis |
| `/api/validations/team` | POST | Token requis |
| `/api/server-mode` | POST | Token requis |
| `/api/wifi` | POST | Token requis |
| `/api/map` | POST | Token requis |
| `/api/board` | POST | Token requis |

## Endpoints ouverts (participants)

| Endpoint | Méthode | Rôle |
|----------|---------|------|
| `/api/board` | GET | Lecture état tableau de bord |
| `/api/answer` | POST | Soumettre une réponse |
| `/api/answers` | GET | Lister les réponses |
| `/api/pos` | GET/POST | Positions GPS |
| `/api/finish` | GET/POST | Déclarer fin de parcours |
| `/api/urgency` | GET/POST | Alertes urgence |
| `/api/urgency/resolve` | POST | Résoudre une alerte |
| `/api/validations` | GET/POST | Valider des balises |
| `/api/ip` | GET | Détection réseau |
| `/api/wifi` | GET | Config Wi-Fi (lecture) |
| `/api/map` | GET | URL carte (lecture) |
| `/api/editor` | GET | Contenu édité (lecture) |
| `/api/kml` | GET | Proxy KML |

## Données persistées

- **Mot de passe** : `data/auth.json` (hash non appliqué — mot de passe en clair)
  > Note : dans un déploiement public, utiliser un hash bcrypt ou argon2.
  > Pour un usage local (famille, terrain), le stockage en clair est acceptable.
- **Sessions** : en mémoire uniquement (perdues au redémarrage du serveur).

## Limitations connues

1. Pas de rate limiting sur `/api/auth/login`.
2. Pas de HTTPS dans le serveur Node (à porteur de server.ps1 avec certificat auto-signé).
3. Pas de CSRF protection (les API sont conçues pour du JSON, pas des formulaires).
4. Le mot de passe n'est pas hashé — acceptable pour usage local.

## Recommandations

- Changer le mot de passe après chaque événement.
- Ne pas exposer le serveur sur Internet sans cloudflare tunnel.
- Le tunnel cloudflare fournit déjà le chiffrement HTTPS.
