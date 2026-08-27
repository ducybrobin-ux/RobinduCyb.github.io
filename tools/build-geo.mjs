#!/usr/bin/env node
/**
 * build-geo — génère js/geo.js (ES5, navigateur) depuis packages/geolocation.
 * Usage : node tools/build-geo.mjs [--check]
 *
 * Expose window.GeoMath avec { haversine, bearing, normDeg, cardinal }.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const OUT = resolve(ROOT, "js", "geo.js");
const CHECK = process.argv.includes("--check");

/* ---------- fonctions (reprises telles quelles de packages/geolocation/src/index.js) ---------- */

const srcFunctions = [
  /* haversine */
  `function haversine(lat1,lng1,lat2,lng2){var R=6371e3,r=Math.PI/180,dLat=(lat2-lat1)*r,dLng=(lng2-lng1)*r,a=Math.sin(dLat/2)**2+Math.cos(lat1*r)*Math.cos(lat2*r)*Math.sin(dLng/2)**2;return R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))}`,
  /* bearing */
  `function bearing(lat1,lng1,lat2,lng2){var r=Math.PI/180,p1=lat1*r,p2=lat2*r,dl=(lng2-lng1)*r,y=Math.sin(dl)*Math.cos(p2),x=Math.cos(p1)*Math.sin(p2)-Math.sin(p1)*Math.cos(p2)*Math.cos(dl);return((180*Math.atan2(y,x)/Math.PI)%360+360)%360}`,
  /* normDeg */
  `function normDeg(d){return((((d%360)+360)%360)+180)%360-180}`,
  /* cardinal */
  `var _DIRS=["N","NE","E","SE","S","SO","O","NO"];function cardinal(d){return _DIRS[Math.round((((d%360)+360)%360)/45)%8]}`,
];

const out =
  `/* Auto-généré par tools/build-geo.mjs — NE PAS ÉDITER MANUELLEMENT */\n` +
  `(function(){\n` +
  `window.GeoMath = {};\n${ 
  srcFunctions.map((fn) => `  ${fn};`).join("\n")  }\n` +
  `  window.GeoMath.haversine = haversine;\n` +
  `  window.GeoMath.bearing = bearing;\n` +
  `  window.GeoMath.normDeg = normDeg;\n` +
  `  window.GeoMath.cardinal = cardinal;\n` +
  `})();\n`;

if (CHECK) {
  const old = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  if (old !== out) {
    console.error("[build-geo] Fichier obsolète. Lance `node tools/build-geo.mjs` pour le régénérer.");
    process.exit(1);
  }
  console.log("[build-geo] js/geo.js est à jour.");
} else {
  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, out, "utf8");
  console.log(`[build-geo] Généré js/geo.js (${  out.length  } octets).`);
}
