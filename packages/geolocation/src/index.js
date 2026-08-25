/* @curios/geolocation — fonctions pures de géolocalisation.
   Zéro dépendance. Tout est mathématique élémentaire. */

/**
 * Distance en mètres entre deux points GPS (formule de Haversine).
 * Extraite de AudioSys.haversine (audio.js) — ici elle n'a rien à faire.
 */
export function haversine(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Azimut (cap vrai) depuis un point vers un autre, en degrés [0, 360].
 * Extraite de Compass.bearing (compass.js).
 */
export function bearing(lat1, lng1, lat2, lng2) {
  const toRad = (d) => (d * Math.PI) / 180;
  const toDeg = (r) => (r * 180) / Math.PI;
  const p1 = toRad(lat1), p2 = toRad(lat2);
  const dl = toRad(lng2 - lng1);
  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

/**
 * Normalise un angle en degrés dans [-180, 180].
 * Extraite de normDeg (app.js L1970).
 */
export function normDeg(d) {
  return ((((d % 360) + 360) % 360) + 180) % 360 - 180;
}

/**
 * Direction cardinale à partir d'un azimut en degrés [0, 360].
 * Retourne : N, NE, E, SE, S, SO, O, NO.
 * Extraite de cardinal (app.js L2048).
 */
const DIRS = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
export function cardinal(deg) {
  return DIRS[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
}
