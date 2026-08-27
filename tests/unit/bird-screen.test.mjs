import { describe, it } from "node:test";
import assert from "node:assert/strict";

import "../../js/screens/bird.js";

describe("Screens.bird", () => {
  it("expose renderCard", () => {
    assert.equal(typeof window.Screens.bird.renderCard, "function");
  });

  it("renderCard affiche les infos de l'oiseau", () => {
    const elements = {};
    function $(id) {
      if (!elements[id]) elements[id] = { innerHTML: "", classList: { add() {}, remove() {} }, addEventListener() {}, querySelectorAll() { return []; } };
      return elements[id];
    }
    const bird = {
      id: "merle", nom: "Merle noir", latin: "Turdus merula", taille: "Moyen",
      couleur: "#1a1a1a", emoji: "\ud83d\udc26", categorie: "diurne",
      anecdotes: ["Chante t\u00f4t le matin"], description: "Un oiseau commun"
    };
    window.Screens.bird.renderCard({
      $, showScreen: () => {}, esc: (s) => String(s), I18N: { t: (k) => k },
      AudioSys: { playBird: () => {} }, App: { backScreen: "map" },
      bird, birdLabel: (b) => b.nom, BALISES: [], renderGod: () => {},
      renderGuide: () => {}, renderCarnet: () => {},
    });
    const html = elements["bird-card"].innerHTML;
    assert.ok(html.includes("Merle noir"));
    assert.ok(html.includes("Turdus merula"));
    assert.ok(html.includes("Moyen"));
    assert.ok(html.includes("Chante t\u00f4t le matin"));
  });
});

describe("Screens.carnet", () => {
  it("expose render", () => {
    assert.equal(typeof window.Screens.carnet.render, "function");
  });

  it("render affiche un message si pas de profil", () => {
    const elements = {};
    function $(id) {
      if (!elements[id]) elements[id] = { innerHTML: "", textContent: "" };
      return elements[id];
    }
    window.Screens.carnet.render({
      $, esc: (s) => String(s), I18N: { t: (k) => k },
      Store: { getActive: () => null }, BIRDS: [], BALISES: [],
      birdLabel: () => "", getBird: () => null, App: {},
      showScreen: () => {}, showBirdOnly: () => {},
    });
    assert.ok(elements["carnet-summary"].textContent.includes("profil"));
  });

  it("render affiche les cartes d'oiseaux", () => {
    const elements = {};
    function $(id) {
      if (!elements[id]) elements[id] = { innerHTML: "", textContent: "", querySelectorAll() { return []; } };
      return elements[id];
    }
    const birds = [
      { id: "merle", emoji: "\ud83d\udc26", categorie: "diurne" },
      { id: "hibou", emoji: "\ud83e\udd89", categorie: "nocturne" },
    ];
    window.Screens.carnet.render({
      $, esc: (s) => String(s), I18N: { t: (k) => k },
      Store: { getActive: () => ({ name: "Test", birds: ["merle"] }) },
      BIRDS: birds, BALISES: [],
      birdLabel: (b) => b.id, getBird: () => birds[0], App: {},
      showScreen: () => {}, showBirdOnly: () => {},
    });
    const html = elements["carnet-grid"].innerHTML;
    assert.ok(html.includes("merle"));
    assert.ok(html.includes("hibou"));
    assert.ok(html.includes("\ud83d\udc26"));
  });
});
