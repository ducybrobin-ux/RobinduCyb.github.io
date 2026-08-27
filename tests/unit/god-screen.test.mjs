import { describe, it } from "node:test";
import assert from "node:assert/strict";

/* Mock DOM */
function createMockDOM() {
  const elements = {};
  function addEl(id) {
    const el = { textContent: "", innerHTML: "", style: {}, onclick: null, classList: { _set: new Set(), add(c) { this._set.add(c); }, remove(c) { this._set.delete(c); } }, querySelectorAll: () => [], closest: () => null, dataset: {} };
    elements[id] = el;
    return el;
  }
  function $(id) { return elements[id] || null; }
  return { elements, addEl, $ };
}

/* Load the screen IIFE */
import "../../js/screens/god.js";

describe("Screens.god", () => {
  it("expose render et makeQR", () => {
    assert.equal(typeof window.Screens.god.render, "function");
    assert.equal(typeof window.Screens.god.makeQR, "function");
  });

  it("makeQR retourne une chaîne vide si qrcode absent", () => {
    assert.equal(window.Screens.god.makeQR("TEST"), "");
  });

  it("render affiche un message si pas god profile", () => {
    const dom = createMockDOM();
    dom.addEl("god-list");
    dom.addEl("god-photos");
    const Store = { getActive: () => ({ name: "Test" }) };
    const I18N = { t: (k) => k };
    const esc = (s) => s;
    const isGodProfile = () => false;

    window.Screens.god.render({
      $: dom.$, Store, I18N, esc, isGodProfile,
      BALISES: [], SITE: { photos: [] }, getBalise: () => null, getBird: () => null,
      showRiddle: () => {}, showBirdOnly: () => {}, App: {}, toggleBalise: () => {},
      renderHome: () => {}, toast: () => {},
    });
    assert.ok(dom.elements["god-list"].innerHTML.includes("god_sam_only"));
  });

  it("render affiche les balises pour un god profile", () => {
    const dom = createMockDOM();
    dom.addEl("god-list");
    dom.addEl("god-photos");
    dom.addEl("btn-god-all-done");
    dom.addEl("btn-god-all-reset");
    const Store = {
      getActive: () => ({ name: "Sam" }),
      isDone: () => false,
    };
    const I18N = { t: (k) => k };
    const esc = (s) => String(s);
    const isGodProfile = () => true;
    const BALISES = [
      { id: "B1", label: "Test Balise", code: "CODE1", lat: 48.1, lng: 5.2, bird: "merle" },
    ];
    const SITE = { photos: [] };

    window.Screens.god.render({
      $: dom.$, Store, I18N, esc, isGodProfile,
      BALISES, SITE, getBalise: () => BALISES[0], getBird: () => null,
      showRiddle: () => {}, showBirdOnly: () => {}, App: {}, toggleBalise: () => {},
      renderHome: () => {}, toast: () => {},
    });
    const html = dom.elements["god-list"].innerHTML;
    assert.ok(html.includes("B1"));
    assert.ok(html.includes("Test Balise"));
    assert.ok(html.includes("CODE1"));
  });
});
