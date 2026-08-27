# CURIOS Project Hub — Premiere PR

## Contenu

```
curios-hub-public/
├── index.html                    ← Landing page publique
├── curios.html                   ← Page présentation CURIOS
├── contact.html                  ← Formulaire contact
├── documentation.html            ← Docs techniques
├── hub/
│   ├── login.html                ← Login / Register
│   └── app.html                  ← App Shell Hub (SPA)
├── css/
│   ├── hub.css                   ← Design system Hub (400+ composants)
│   └── public.css                ← Styles site public
├── js/
│   ├── hub-auth.js               ← Auth client (login, token, roles)
│   ├── hub-shell.js              ← App Shell (topbar, routing, nav)
│   └── hub-pages/
│       └── dashboard.js          ← Dashboard initial
├── patches/
│   ├── hub-auth-server.js        ← Auth serveur (register, login, me)
│   ├── server-index-patch.js     ← Patch pour index.js serveur
│   └── README-PATCHES.md         ← Instructions d'intégration
└── player/                       ← (vide — copier l'existant ici)
```

## Installation

### 1. Copier dans le dépôt public

```bash
# Depuis la racine de RobinduCyb.github.io
cp -r curios-hub-public/* .
```

### 2. Copier le player existant

```bash
# Copier tout le player depuis ducyb/ vers player/
cp -r /path/to/ducyb/* player/
# Garder uniquement les fichiers du player
rm -rf player/hub player/css/hub.css player/js/hub-*
```

### 3. Intégrer les patches serveur

Voir `patches/README-PATCHES.md` pour les instructions détaillées.

### 4. Tester

```bash
# Depuis la racine du projet
node packages/server/src/index.js
# Ouvrir http://localhost:8080
```

## Ce qui fonctionne

- **Landing page** : hero, features, CTA, footer
- **Hub login** : register + login + token auth
- **Hub App Shell** : topbar horizontale, navigation 11 pages, routing hash
- **Dashboard** : stats, accès rapides, outils de création
- **Pages Hub** : projets, parcours, packs, sessions, clients, matériel, planning, commercial, analytics, settings (toutes avec placeholder structuré)
- **Auth** : register (premier user = ADMIN), login, logout, token 7 jours
- **Responsive** : mobile-first, hamburger menu
- **Dark mode** : via prefers-color-scheme

## Ce qui reste à faire (Phases 2+)

- Connecter le dashboard aux vraies données serveur (/api/session, /api/hub/stats)
- CRUD complet pour projets, parcours, packs
- Gestion clients et prescripteurs
- Planning avec calendrier
- Devis et factures
- Analytics agrégées côté serveur
- RBAC complet (8 rôles)
- Site public complet (10 pages)
- Tests E2E
