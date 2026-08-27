import { describe, it } from "node:test";
import assert from "node:assert/strict";

import "../../js/screens/guide.js";

describe("Screens.guide", () => {
  it("expose render, shuffle, shade, birdSvg", () => {
    assert.equal(typeof window.Screens.guide.render, "function");
    assert.equal(typeof window.Screens.guide.shuffle, "function");
    assert.equal(typeof window.Screens.guide.shade, "function");
    assert.equal(typeof window.Screens.guide.birdSvg, "function");
  });

  it("shuffle retourne un tableau de même longueur", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = window.Screens.guide.shuffle(arr);
    assert.equal(result.length, arr.length);
    assert.deepEqual(result.sort(), arr.sort());
  });

  it("shade éclaircit ou assombrit une couleur hex", () => {
    const lighter = window.Screens.guide.shade("#5a5a5a", 32);
    assert.ok(lighter.startsWith("#"));
    assert.notEqual(lighter, "#5a5a5a");
  });

  it("shade gère les couleurs invalides", () => {
    assert.equal(window.Screens.guide.shade("invalid", 10), "invalid");
  });

  it("birdSvg génère un SVG pour un oiseau", () => {
    const bird = { id: "merle", nom: "Merle noir", couleur: "#1a1a1a" };
    const svg = window.Screens.guide.birdSvg(bird);
    assert.ok(svg.includes("<svg"));
    assert.ok(svg.includes("Merle noir"));
    assert.ok(svg.includes("</svg>"));
  });

  it("birdSvg gère les espèces avec accent spécial", () => {
    const species = ["pinson", "hirondelle", "verdier", "grive", "chouette", "hibou", "pic"];
    for (const id of species) {
      const svg = window.Screens.guide.birdSvg({ id, nom: id, couleur: "#5a5a5a" });
      assert.ok(svg.includes("<svg"), `Échec pour ${id}`);
    }
  });

  it("render affiche les cartes oiseaux dans le grid", () => {
    const elements = {};
    function $(id) {
      if (!elements[id]) {
        elements[id] = { innerHTML: "", querySelectorAll: () => [] };
      }
      return elements[id];
    }
    const birds = [
      { id: "merle", nom: "Merle", latin: "Turdus merula", taille: "Moyen", couleur: "#1a1a1a" },
      { id: "rouge", nom: "Rouge", latin: "Erithacus rubecula", taille: "Petit", couleur: "#c8302e" },
    ];
    let clickedId = null;
    const App = {};
    window.Screens.guide.render({
      $,
      esc: (s) => String(s),
      allBirds: () => birds,
      birdLabel: (b) => b.nom,
      getBird: (id) => birds.find((b) => b.id === id),
      App,
      showBirdOnly: (b) => { clickedId = b.id; },
    });
    const html = elements["guide-grid"].innerHTML;
    assert.ok(html.includes("Merle"));
    assert.ok(html.includes("Rouge"));
    assert.ok(html.includes("Turdus merula"));
  });
});
