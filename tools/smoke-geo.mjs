/**
 * smoke-geo — Vérifie que js/geo.js charge sans erreur et expose les 4 fonctions.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const code = readFileSync(resolve(ROOT, "js", "geo.js"), "utf8");

const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(code, ctx);

const G = ctx.window.GeoMath;
if (!G) { console.error("[smoke-geo] window.GeoMath absent !"); process.exit(1); }

const fns = ["haversine", "bearing", "normDeg", "cardinal"];
let ok = true;
for (const fn of fns) {
  if (typeof G[fn] !== "function") {
    console.error(`[smoke-geo] ${fn} manquant ou non-fonction`);
    ok = false;
  }
}

// Quick functional check
const d = G.haversine(48.286282, 4.136816, 48.286282, 4.136816);
if (d !== 0) { console.error(`[smoke-geo] haversine(self) ≠ 0 : ${d}`); ok = false; }

const b = G.bearing(48.286, 4.136, 48.300, 4.136);
if (b > 5 && b < 355) { console.error(`[smoke-geo] bearing(nord) ≠ ~0° : ${b}`); ok = false; }

if (G.normDeg(360) !== 0) { console.error("[smoke-geo] normDeg(360) ≠ 0"); ok = false; }
if (G.cardinal(90) !== "E") { console.error("[smoke-geo] cardinal(90) ≠ E"); ok = false; }

if (ok) {
  console.log("[smoke-geo] OK — 4 fonctions exposées, tests fonctionnels passent.");
} else {
  process.exit(1);
}
