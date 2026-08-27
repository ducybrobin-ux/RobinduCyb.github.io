import { describe, it } from "node:test";
import assert from "node:assert/strict";

/* Mock DOM */
function createMockDOM() {
  const elements = {};
  function addEl(id, text) {
    const el = { textContent: text || "", innerHTML: "", style: {}, classList: { _set: new Set(), add(c) { this._set.add(c); }, remove(c) { this._set.delete(c); }, toggle(c, force) { if (force) this._set.add(c); else this._set.delete(c); } } };
    elements[id] = el;
    return el;
  }
  function $(id) { return elements[id] || null; }
  return { elements, addEl, $ };
}

/* Load the screen IIFE */
import "../../js/screens/palmares.js";

describe("Screens.palmares", () => {
  it("expose render, fmtTime, avatarHTML", () => {
    assert.equal(typeof window.Screens.palmares.render, "function");
    assert.equal(typeof window.Screens.palmares.fmtTime, "function");
    assert.equal(typeof window.Screens.palmares.avatarHTML, "function");
  });

  it("fmtTime formate correctement", () => {
    const { fmtTime } = window.Screens.palmares;
    assert.equal(fmtTime(0), "0 s");
    assert.equal(fmtTime(65), "1 min 5 s");
    assert.equal(fmtTime(3661), "61 min 1 s");
    assert.equal(fmtTime(null), "\u2014");
  });

  it("avatarHTML génère un span avec emoji", () => {
    const { avatarHTML } = window.Screens.palmares;
    const esc = (s) => String(s);
    const html = avatarHTML({ name: "Test", emoji: "\ud83d\udc26", avatar: "#ff0000" }, "", esc);
    assert.ok(html.includes("\ud83d\udc26"));
    assert.ok(html.includes("#ff0000"));
  });

  it("avatarHTML utilise la première lettre si pas d'emoji", () => {
    const { avatarHTML } = window.Screens.palmares;
    const esc = (s) => String(s);
    const html = avatarHTML({ name: "Alice", emoji: "", avatar: "#00ff00" }, "", esc);
    assert.ok(html.includes("A"));
  });

  it("render affiche un message vide si pas de profils", () => {
    const dom = createMockDOM();
    dom.addEl("palmares-list");
    dom.addEl("btn-message");
    dom.addEl("palmares-note");
    const Store = { palmares: () => [], getActive: () => null };
    const I18N = { t: (k) => k };
    const esc = (s) => s;

    window.Screens.palmares.render(dom.$, Store, I18N, esc);
    assert.ok(dom.elements["palmares-list"].innerHTML.includes("Aucune famille"));
  });

  it("render affiche les rangs", () => {
    const dom = createMockDOM();
    dom.addEl("palmares-list");
    dom.addEl("btn-message");
    dom.addEl("palmares-note");
    const Store = {
      palmares: () => [
        { name: "A", avatar: "#f00", emoji: "", stars: 10, seconds: 120, birds: 5, offered: 2, message: "Bon jeu", selfie: "" },
        { name: "B", avatar: "#0f0", emoji: "\ud83e\udd81", stars: 8, seconds: 200, birds: 4, offered: 0, message: "", selfie: "pic.jpg" },
      ],
      getActive: () => ({ name: "A" }),
    };
    const I18N = { t: (k) => k };
    const esc = (s) => String(s);

    window.Screens.palmares.render(dom.$, Store, I18N, esc);
    const html = dom.elements["palmares-list"].innerHTML;
    assert.ok(html.includes("1"));
    assert.ok(html.includes("2"));
    assert.ok(html.includes("10"));
    assert.ok(html.includes("8"));
    assert.ok(html.includes("pic.jpg"));
  });
});
