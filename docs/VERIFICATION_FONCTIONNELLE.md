# Curi🧭s — Vérification fonctionnelle

Rapport du chantier de réparation fonctionnelle. Date : 2026-08-30.
Périmètre : dépôt `curios`, branche `main`.

## 1. Problèmes constatés (audit)

Le retour terrain des familles signalait trois irritants fonctionnels :

- **« Choisir un parcours » n'affiche aucune liste de parcours.**
- **La création de profil / famille semble sans réaction.**
- **Des boutons semblent « morts »** (espaces Parcours / Administrer).

### Cause racine du parcours vide

La fonction `renderParcours()` (`js/app.js`) alimentait la liste des packs
exclusivement via le serveur :

```
fetch("/api/packs", …)
```

Or l'endpoint `/api/packs` n'est fourni QUE par le serveur Node
(`packages/server`, lancé par `npm run serve`). Le serveur du quotidien
(`server.ps1`, lancé par `demarrer_serveur.cmd`) ne le sert pas, pas plus
que le mode 100 % hors-ligne / GitHub Pages. Le `fetch` échouait donc
systématiquement, et le `catch` affichait :

> « Hors ligne : catalogue indisponible. Le parcours actuel reste jouable. »

→ **Aucune liste de packs ne s'affichait jamais** dans le mode réellement
utilisé par les organisateurs.

## 2. Réparation appliquée (évolution, pas révolution)

Principe conservé : Vanilla JS, offline-first, données embarquées précachées
par le service worker. Aucune refonte.

1. **`tools/build-data.mjs`** : le bloc généré de `js/data.js` expose désormais
   la constante `ACTIVE_PACKS` (ids des packs actifs), issue directement de
   `content/manifest.json` (source de vérité). `node tools/build-data.mjs`
   régénère `js/data.js`.

2. **`js/index.html`** : ajout du script `js/catalogue-data.js` (catalogue
   embarqué, déjà précaché par le service worker) avant `js/app.js`.

3. **`js/app.js` → `renderParcours()`** : la liste des packs est construite
   **localement et immédiatement** depuis `CATALOGUE_DATA.packs` (les
   9 packs installés) avec :
   - le badge **ACTIVE** sur le pack embarqué (`ACTIVE_PACKS`) ;
   - le bouton **« Choisir ce parcours »** sur les packs disponibles ;
   - un enrichissement par `GET /api/packs` **si et seulement si** le serveur
     Node répond (remplace alors la liste par les états réels actif / stations /
     missions).

   Résultat : la liste des parcours est visible partout — `server.ps1`,
   100 % hors-ligne, GitHub Pages et `npm run serve`.

4. **`eslint.config.js`** : `ACTIVE_PACKS` déclaré en global (comme `BALISES`,
   `SITE`, etc.).

### Formulaire de profil / famille — vérifié sain

Le handler `js/app.js` (`profile-form`) est complet : validation du nom,
`Store.createProfile`, gestion des modes classic / random / race, persistance
localStorage, feedback et navigation vers l'intro. La « non-réaction »
perçue provenait du point d'entrée bouché (écran Parcours vide), désormais
réparé.

### Boutons des espaces Parcours / Administrer — vérifiés câblés

`btn-choose-parcours`, `btn-catalogue`, `btn-administer` et les tuiles
`data-go` sont rattachés à des handlers dans `bindEvents()`. La gestion des
profils (renommer / activer / supprimer) est câblée dans `renderProfiles()`.

## 3. Validation automatique

| Contrôle | Commande | Résultat |
|----------|----------|----------|
| Syntaxe ESLint | `node node_modules/eslint/bin/eslint.js .` | **0 erreur** (690 avertissements de style pré-existants) |
| Synchro contenu → data.js | `node tools/build-data.mjs --check` | OK (9 découvertes, 4 notions, 9 balises) |
| Service worker | `node tools/build-sw.mjs --check` | sw.js à jour |
| Tests unitaires existants | `node --test tests/unit/*.test.mjs` | **380/380 passent** |
| Tests E2E de réparation | `node --test tests/unit/e2e-parcours.test.mjs` | **15/15 passent** |

Les 15 tests E2E (`tests/unit/e2e-parcours.test.mjs`) couvrent :

- **Choix de parcours / données**
  - manifest : un pack et un seul actif (`phantom-cybersecurite`) ;
  - `packsActifs` de `chargerContenu` cohérent avec le manifest ;
  - `ACTIVE_PACKS` de `js/data.js` synchronisé avec `content/` ;
  - la réparation est en place dans `js/app.js` (fallback `CATALOGUE_DATA`) ;
  - le catalogue embarqué liste tous les packs du manifest (listable hors-ligne) ;
  - packs Cosmos (« Mission Orion ») et Passeurs (« Relais ») présents ;
  - mapping ACTIVE / AVAILABLE du rendu ;
  - chaque pack a `id` et `nom` non vides.

- **Création de profil famille (Store)**
  - création + activation + persistance ;
  - mode par défaut classic ;
  - mode race ;
  - mode random (`raceOrder`) ;
  - bascule de profil actif ;
  - renommage (`updateProfile`) ;
  - remise à zéro + suppression de profil.

## 4. Fichiers modifiés

| Fichier | Changement |
|---------|------------|
| `tools/build-data.mjs` | expose `ACTIVE_PACKS` dans le bloc généré |
| `js/data.js` | régénéré (ajoute `ACTIVE_PACKS = ["phantom-cybersecurite"]`) |
| `index.html` | charge `js/catalogue-data.js` avant `js/app.js` |
| `js/app.js` | `renderParcours` : liste locale offline + fallback serveur |
| `eslint.config.js` | global `ACTIVE_PACKS` |
| `tests/unit/e2e-parcours.test.mjs` | 15 tests E2E de réparation |
| `docs/VERIFICATION_FONCTIONNELLE.md` | ce document |
