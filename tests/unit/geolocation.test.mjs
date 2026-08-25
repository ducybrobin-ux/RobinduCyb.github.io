/**
 * Tests unitaires — @curios/geolocation
 * Fonctions pures : haversine, bearing, normDeg, cardinal
 *
 * Point de contrôle : haul Saint-Gobain, Aube 10450 (exemple-quartier.json)
 *   lat 48.286282  lng 4.136816
 */

import { describe, it } from "node:test";
import assert from "node:assert/strict";

/* Import direct ESM (source, non le bundle navigateur) */
import { haversine, bearing, normDeg, cardinal } from "../../packages/geolocation/src/index.js";

/* ── Tolérances ── */
const M1 = 1;      // 1 mètre pour Haversine court
const M5 = 5;      // 5 mètres pour Haversine long
const M500 = 500;  // 500 mètres pour très longue distance
const DEG1 = 1;    // 1 degré pour bearing

/* ================================================================
   HAVESINE
   ================================================================ */
describe("haversine", () => {
  it("distance nulle (même point)", () => {
    assert.equal(haversine(48.286282, 4.136816, 48.286282, 4.136816), 0);
  });

  it("Bar-le-Duc ↔ Saint-Dizier : ~50 km", () => {
    const d = haversine(48.7728, 5.5917, 48.6367, 4.9394);
    assert.ok(d > 48000 && d < 53000, `reçu ${d.toFixed(0)} m`);
  });

  it("symétrie : A→B = B→A", () => {
    const d1 = haversine(48.286282, 4.136816, 48.7728, 5.5917);
    const d2 = haversine(48.7728, 5.5917, 48.286282, 4.136816);
    assert.equal(d1, d2);
  });

  it("pôle Nord ↔ équateur : ~10 008 km", () => {
    const d = haversine(90, 0, 0, 0);
    assert.ok(Math.abs(d - 10007543) < M500, `reçu ${(d / 1000).toFixed(0)} km`);
  });
});

/* ================================================================
   BEARING
   ================================================================ */
describe("bearing", () => {
  it("vers le nord → 0°", () => {
    const b = bearing(48.286, 4.136, 48.300, 4.136);
    assert.ok(b < 5 || b > 355, `reçu ${b.toFixed(1)}°`);
  });

  it("vers l'est → 90°", () => {
    const b = bearing(48.286, 4.136, 48.286, 4.200);
    assert.ok(Math.abs(b - 90) < DEG1, `reçu ${b.toFixed(1)}°`);
  });

  it("vers le sud → 180°", () => {
    const b = bearing(48.300, 4.136, 48.286, 4.136);
    assert.ok(Math.abs(b - 180) < DEG1, `reçu ${b.toFixed(1)}°`);
  });

  it("point identique → 0° (edge case, atan2(0,0))", () => {
    const b = bearing(48.286, 4.136, 48.286, 4.136);
    assert.equal(b, 0);
  });
});

/* ================================================================
   NORMDEG
   ================================================================ */
describe("normDeg", () => {
  it("0 → 0", () => assert.equal(normDeg(0), 0));
  it("180 → -180", () => assert.equal(normDeg(180), -180));
  it("360 → 0", () => assert.equal(normDeg(360), 0));
  it("-90 → -90", () => assert.equal(normDeg(-90), -90));
  it("270 → -90", () => assert.equal(normDeg(270), -90));
  it("450 → 90", () => assert.equal(normDeg(450), 90));
  it("-270 → 90", () => assert.equal(normDeg(-270), 90));
  it("123.456 → 123.456", () => assert.ok(Math.abs(normDeg(123.456) - 123.456) < 1e-10));
  it("-123.456 → -123.456", () => assert.ok(Math.abs(normDeg(-123.456) - (-123.456)) < 1e-10));
});

/* ================================================================
   CARDINAL
   ================================================================ */
describe("cardinal", () => {
  const cases = [
    [0, "N"], [45, "NE"], [90, "E"], [135, "SE"],
    [180, "S"], [225, "SO"], [270, "O"], [315, "NO"],
    [360, "N"],
  ];
  for (const [deg, expected] of cases) {
    it(`${deg}° → ${expected}`, () => {
      assert.equal(cardinal(deg), expected);
    });
  }
  it("22.5° → NE (arrondi à la borne haute)", () => assert.equal(cardinal(22.5), "NE"));
  it("22.4° → N (pas encore NE)", () => assert.equal(cardinal(22.4), "N"));
});
