# DATA MODEL — Schéma universel de parcours `ducyb-parcours` v1

## 0. Stratégie

- **Extension directe** du format pack existant (`balise/découverte/guide/thème`) :
  rétrocompatibilité maximale, conversion mécanique possible.
- Versionné par `$version`, validé à la compilation (CLI) **et** au chargement runtime.
- Un parcours = donnée pure. Le moteur ignore tout ce qu'il ne connaît pas
  (champs inconnus préservés pour compatibilité ascendante).

## 1. Document principal

```jsonc
{
  "$format": "ducyb-parcours",
  "$version": 1,
  "id": "parcours-001",
  "title": "Les mystères du territoire",

  "metadata": {
    "author": "", "organization": "",
    "language": "fr", "license": "",
    "createdAt": "", "updatedAt": ""
  },

  "audience": { "minAge": 12, "maxAge": 16 },
  "duration": { "minimum": 60, "maximum": 120 },   // minutes

  "pedagogy": {
    "objectives":    [],        // « distinguer fait et opinion »
    "skills":        [],        // « esprit-critique »
    "competencies":  [],        // « cps-cooperation » (compétences psychosociales)
    "evaluation": [ { "indicator": "", "observable": "" } ]
  },

  "game": {
    "mode": "cooperative|courses|libre",
    "scoring": { "starsPerStation": 3, "timeBonus": true, "penalties": {} },
    "rules":   { "order": "lineaire|libre|conditionnel" }
  },

  "location": {
    "provider": "schematic|osm-offline",
    "center":   { "lat": 0, "lng": 0 },
    "trail":    []              // polyligne schématique ou géographique
  },

  "stations": [
    {
      "id": "B1", "label": "La porte des Cristaux",
      "code": "JDP-B1",                       // validation QR / saisie manuelle
      "lat": 50.7258178, "lng": 3.1329639,
      "radius": 12,                           // rayon GPS propre (défaut 12 m)
      "missions": ["m1"],
      "accessibility": { "alternativeToGps": "qr|manuel|accompagne", "transcript": "" }
    }
  ],

  "missions": [
    {
      "id": "m1",
      "type": "enigme|quiz|observation|enquete|media",
      "difficultyLevels": {
        "facile":   { "text": "", "answers": [], "ages": [6,9]  },
        "moyen":    { "text": "", "answers": [], "ages": [10,13] },
        "difficile":{ "text": "", "answers": [], "ages": [14,99] }
      },
      "hints": [ { "level": 1, "text": "" }, { "level": 2, "text": "" } ],
      "onSuccess": [],                        // ids missions débloquées
      "onFail":    [],
      "bonusIfFast": ""
    }
  ],

  "characters": [],                            // PNJ / mascottes / découvertes
  "media":     [ { "id": "", "kind": "audio|image|video", "src": "", "transcript": "" } ],
  "rewards":   [],                             // badges, graines…

  "debriefing": {
    "participantQuestions": [],
    "facilitatorReport":    [],
    "skillsObserved":       []
  }
}
```

## 2. Session serveur (SQLite)

```jsonc
{
  "session": {
    "id": "", "parcoursId": "", "editionId": "", "startedAt": "", "endedAt": null,
    "teams": [
      {
        "name": "Famille Martin",
        "state": "ok|bloquee|avance|retard",
        "progress": [ { "stationId": "B1", "missionId": "m1", "at": "", "mode": "gps|qr|question|code|manuel", "stars": 3 } ],
        "telemetry": { "online": true, "netType": "wifi", "battery": 87, "charging": false,
                       "camera": "granted", "gpsAcc": 8, "lastSeen": "" }   // optionnel, minimisé
      }
    ],
    "events": [ { "at": "", "type": "urgence|message|validation|debriefing", "payload": {} } ]
  }
}
```

Principes données : pseudonymes uniquement, rétention configurable, purge en fin
de session, export/suppression sur demande. La télémétrie est **optionnelle**.

## 3. Édition (remplace les forks)

```jsonc
{
  "$format": "ducyb-edition", "$version": 1,
  "id": "jpd-cdb",
  "name": "Les Cristaux de Balto",
  "branding": { "logo": "img/logo-cdb.png", "themeColor": "#0c2233", "swPrefix": "jdpcdb" },
  "themes": ["nuit-nordique"],
  "packs": [ { "id": "cristaux-de-balto", "actif": true } ],
  "home": { "heroText": "", "links": [] },
  "manifest": { "name": "…", "short_name": "…", "description": "…" }
}
```

Le build génère une variante par édition (index, manifest PWA, SW préfixé) —
une seule base de code, N sites publiés.

## 4. Conversion depuis le format actuel

Convertisseur : `tools/convert-packs.mjs` (implémenté dans
[`packages/content-schema`](../packages/content-schema/)). Conversion **pure et
déterministe**, contrôlée par une vérification de couverture (aucune entité
perdue) puis validation structurelle. CI : `node tools/convert-packs.mjs --check`.

| Format actuel (`jdpbc-pack`) | `ducyb-parcours` v1 |
|---|---|
| `pack.{id,nom,description,theme,ages}` | racine `{id,title,description,theme}`, `audience.{minAge,maxAge}` |
| `balise` | `station` (+ `discoveryId` vers le personnage) |
| `balise.enigmes.{facile\|moyen\|difficile}` | `mission.type:"enigme"` → `difficultyLevels[niveau]` |
| `enigme.{text,reponses[],ages[]}` | `{text, answers[], ages[]}` |
| `enigme.indice` / `enigme.saviez` | `hint` / `knowMore` |
| `découverte` | `character` (+ mission `type:"quiz"`) |
| `quiz[]{q,options[],reponse}` | `questions[]{q,options[],answer}` |
| `pedagogie.{ages,duree_min,objectif,programme}` | `pedagogy.{ages,dureeMin,objectif,programme}` |
| `notion-guide` | `pedagogy.competencies[]` (+ objectifs agrégés) |
| `chant{tempo,notes[]}`, `audioFile` | conservés tels quels sur `character` (universalisation ultérieure) |
| `thème` (content/themes/) | non converti en v1 — partagé entre parcours, deviendra `edition.themes` |

Rétro-références ajoutées à la conversion : `station.missions[]` ↔
`mission.stationId`, `character` ↔ `mission.characterId`.
Sorties versionnées dans `content/ducyb-parcours/<id>.json` (4 packs convertis,
zéro perte vérifiée en CI).
