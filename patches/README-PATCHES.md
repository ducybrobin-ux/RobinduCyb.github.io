# CURIOS Project Hub — Notes d'intégration

> **Mise à jour :** les routes Hub sont désormais **intégrées nativement** dans le serveur.
> Les fichiers `hub-auth-server.js` / `server-index-patch.js` sont conservés comme
> référence historique de la première PR. Le code actif se trouve dans
> `packages/server/src/routes/` (voir ci-dessous).

## Code actif (nativement intégré)

Le serveur `packages/server/src/index.js` inclut directement les routes Hub :

| Fichier | Contenu |
|---------|---------|
| `packages/server/src/routes/hub-auth.js` | Auth multi-utilisateurs : register, login, me, logout (PBKDF2, rôles, premier user = ADMIN) |
| `packages/server/src/routes/hub-crud.js` | CRUD projets, parcours, packs |
| `packages/server/src/routes/hub-resources.js` | CRUD clients, matériel, sessions, planning, commercial + analytics agrégées |

## Endpoints

```
POST/GET /api/hub/auth/register|login|me|logout
GET/POST  /api/hub/projets      GET/PUT/DELETE /api/hub/projets/:id
GET/POST  /api/hub/parcours     GET/PUT/DELETE /api/hub/parcours/:id
GET/POST  /api/hub/packs        GET/PUT/DELETE /api/hub/packs/:id
GET/POST  /api/hub/clients      GET/PUT/DELETE /api/hub/clients/:id
GET/POST  /api/hub/materiel     GET/PUT/DELETE /api/hub/materiel/:id
GET/POST  /api/hub/sessions-data GET/PUT/DELETE /api/hub/sessions-data/:id
GET/POST  /api/hub/planning     GET/PUT/DELETE /api/hub/planning/:id
GET/POST  /api/hub/commercial   GET/PUT/DELETE /api/hub/commercial/:id
GET       /api/hub/analytics
```

## Persistance

Les données sont stockées en JSON dans `data/` :

```
data/hub-users.json          ← utilisateurs (hash PBKDF2 + sel + rôle)
data/hub-sessions.json       ← sessions tokens (7 jours)
data/hub-projets.json        ← projets
data/hub-parcours.json       ← parcours
data/hub-packs.json          ← packs
data/hub-clients.json        ← clients
data/hub-materiel.json       ← matériel
data/hub-sessions-data.json  ← sessions du Hub
data/hub-planning.json       ← planning
data/hub-commercial.json     ← devis / factures
```

## RBAC (8 rôles)

`ADMIN`, `PROJECT_MANAGER`, `PEDAGOGICAL_EDITOR`, `CONTENT_VALIDATOR`,
`FORMATOR`, `OBSERVER`, `CLIENT`, `PLAYER`

- **Écriture** : ADMIN, PROJECT_MANAGER, PEDAGOGICAL_EDITOR, CONTENT_VALIDATOR, FORMATOR
- **Suppression** : ADMIN, PROJECT_MANAGER
- **Lecture** : tous les utilisateurs authentifiés
- **Premier utilisateur enregistré = ADMIN**

## Tester

```bash
node packages/server/src/index.js
# Ouvrir http://localhost:8080/hub/login.html
```

Tests unitaires :

```bash
npm test        # inclut tests/unit/hub.test.mjs (auth + CRUD + RBAC + analytics)
```

