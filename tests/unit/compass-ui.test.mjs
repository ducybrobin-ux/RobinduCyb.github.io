import { describe, it } from "node:test";
import assert from "node:assert/strict";

/* Mock DOM */
function createMockDOM() {
  const elements = {};
  function addEl(id) {
    const el = { textContent: "", innerHTML: "", style: {}, classList: { _set: new Set(), add(c) { this._set.add(c); }, remove(c) { this._set.delete(c); } } };
    elements[id] = el;
    return el;
  }
  function $(id) { return elements[id] || null; }
  return { elements, addEl, $ };
}

/* Load the service IIFE */
import "../../js/services/compass-ui.js";

describe("CompassUI", () => {
  it("expose createCompassUI", () => {
    assert.equal(typeof window.CompassUI.createCompassUI, "function");
  });

  it("EMOJI_CHAINS contient 4 chaînes", () => {
    assert.equal(Object.keys(window.CompassUI.EMOJI_CHAINS).length, 4);
  });

  describe("smoothDistance", () => {
    it("retourne null pour null", () => {
      const dom = createMockDOM();
      const ui = window.CompassUI.createCompassUI({
        $: dom.$, normDeg: (d) => d, cardinal: () => "N",
        Store: { getSettings: () => ({}) }, I18N: { t: (k) => k },
      });
      assert.equal(ui.smoothDistance(null), null);
    });

    it("lisse la distance", () => {
      const dom = createMockDOM();
      const ui = window.CompassUI.createCompassUI({
        $: dom.$, normDeg: (d) => d, cardinal: () => "N",
        Store: { getSettings: () => ({}) }, I18N: { t: (k) => k },
      });
      const r1 = ui.smoothDistance(100);
      assert.equal(r1, 100);
      const r2 = ui.smoothDistance(200);
      assert.ok(r2 > 100 && r2 < 200);
    });
  });

  describe("proximity", () => {
    it("retourne null pour null", () => {
      const dom = createMockDOM();
      const ui = window.CompassUI.createCompassUI({
        $: dom.$, normDeg: (d) => d, cardinal: () => "N",
        Store: { getSettings: () => ({}) }, I18N: { t: (k) => k },
      });
      assert.equal(ui.proximity(null), null);
    });

    it("détecte la cible (<=6m)", () => {
      const dom = createMockDOM();
      const ui = window.CompassUI.createCompassUI({
        $: dom.$, normDeg: (d) => d, cardinal: () => "N",
        Store: { getSettings: () => ({}) }, I18N: { t: (k) => k },
      });
      const r = ui.proximity(5);
      assert.equal(r.onTarget, true);
      assert.equal(r.t, 1);
    });

    it("détecte l'éloignement", () => {
      const dom = createMockDOM();
      const ui = window.CompassUI.createCompassUI({
        $: dom.$, normDeg: (d) => d, cardinal: () => "N",
        Store: { getSettings: () => ({}) }, I18N: { t: (k) => k },
      });
      ui.proximity(50);
      ui.proximity(70);
      ui.proximity(90);
      const r = ui.proximity(100);
      assert.equal(r.away, true);
    });
  });

  describe("resetLight", () => {
    it("remet à zéro les éléments DOM", () => {
      const dom = createMockDOM();
      dom.addEl("compass-light");
      dom.addEl("compass-emoji");
      dom.addEl("compass-guide");
      dom.addEl("compass-head");
      const ui = window.CompassUI.createCompassUI({
        $: dom.$, normDeg: (d) => d, cardinal: () => "N",
        Store: { getSettings: () => ({ proximityEmoji: "faces" }) }, I18N: { t: (k) => k },
      });
      ui.resetLight();
      assert.equal(dom.elements["compass-light"].style.background, "#000");
      assert.equal(dom.elements["compass-head"].textContent, "\u2026");
    });
  });
});
