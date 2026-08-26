# GEOLOCATION.md — Module `@curios/geolocation`

> Fonctions pures de géolocalisation. Zéro dépendance. Tout est mathématique élémentaire.
> Extrait de `audio.js` / `compass.js` / `app.js`.
> 28 tests unitaires.

---

## API

### `haversine(lat1, lng1, lat2, lng2): number`

Distance en mètres entre deux points GPS (formule de Haversine).

**Paramètres** : coordonnées en degrés décimaux
**Retour** : distance en mètres

```js
haversine(50.7258, 3.1329, 50.7260, 3.1330)  // ~15 mètres
```

**Précision** : ~0.3% d'erreur (suffisant pour des rayons de 10-100m)

---

### `bearing(lat1, lng1, lat2, lng2): number`

Azimut (cap vrai) depuis un point vers un autre.

**Retour** : degrés [0, 360] (0 = Nord, 90 = Est)

```js
bearing(50.7258, 3.1329, 50.7260, 3.1330)  // ~45° (NE)
```

---

### `normDeg(d): number`

Normalise un angle en degrés dans [-180, 180].

```js
normDeg(370)   // 10
normDeg(-190)  // 170
```

---

### `cardinal(deg): string`

Direction cardinale à partir d'un azimut.

**Retour** : N, NE, E, SE, S, SO, O, NO

```js
cardinal(0)    // "N"
cardinal(45)   // "NE"
cardinal(90)   // "E"
cardinal(180)  // "S"
```

---

## Utilisation typique

```js
import { haversine, bearing, cardinal } from "@curios/geolocation";

// Distance jusqu'à la balise
const dist = haversine(myLat, myLng, stationLat, stationLng);

// Direction vers la balise
const dir = cardinal(bearing(myLat, myLng, stationLat, stationLng));
// → "NE"
```

---

## Tests

```bash
node --test tests/unit/geolocation.test.mjs
```

**28 tests** couvrant les 4 fonctions avec cas limites.
