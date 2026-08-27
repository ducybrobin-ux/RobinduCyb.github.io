import { describe, it } from "node:test";
import assert from "node:assert/strict";

/* Simule le DOM minimal pour les tests du router */
function createMockDOM() {
  const screens = {};
  const navBtns = [];
  const elements = {};
  const documentStub = {
    querySelectorAll: (sel) => {
      if (sel === ".screen") return Object.values(screens);
      if (sel === ".nav-btn") return navBtns;
      return [];
    },
  };
  globalThis.document = documentStub;
  globalThis.window = globalThis.window || {};
  globalThis.window.scrollTo = () => {};

  function addScreen(name) {
    const el = { classList: { _set: new Set(), add(c) { this._set.add(c); }, remove(c) { this._set.delete(c); }, toggle(c, force) { if (force) this._set.add(c); else this._set.delete(c); } } };
    screens[`screen-${name}`] = el;
    return el;
  }
  function addNavBtn(dataGo) {
    const el = { dataset: { go: dataGo }, classList: { _set: new Set(), add(c) { this._set.add(c); }, remove(c) { this._set.delete(c); }, toggle(c, force) { if (force) this._set.add(c); else this._set.delete(c); } } };
    navBtns.push(el);
    return el;
  }
  function addEl(id, text) {
    const el = { textContent: text || "", style: {}, dataset: {} };
    elements[id] = el;
    return el;
  }
  /** Lookup combiné screens + elements */
  function $(id) { return screens[id] || elements[id] || null; }

  return { screens, navBtns, elements, addScreen, addNavBtn, addEl, $ };
}

/* Load the router IIFE */
import "../../js/router.js";

describe("Router.createRouter", () => {
  it("expose Router.createRouter", () => {
    assert.equal(typeof window.Router.createRouter, "function");
  });

  it("navigate affiche le bon screen et cache les autres", () => {
    const dom = createMockDOM();
    const s1 = dom.addScreen("home");
    const s2 = dom.addScreen("map");
    dom.addNavBtn("home");
    dom.addNavBtn("map");
    dom.addEl("page-title");
    dom.addEl("btn-home");

    const state = { screen: "home", cameraOn: false, compassOn: false };
    const router = window.Router.createRouter({
      $: dom.$, t: (k) => k, state,
      effects: { stopCamera: () => {}, stopCompass: () => {}, stopAudio: () => {}, stopVoice: () => {}, onIntro: () => {} },
    });

    router.navigate("map");
    assert.equal(state.screen, "map");
    assert.ok(s2.classList._set.has("active"));
    assert.ok(!s1.classList._set.has("active"));
  });

  it("met à jour le titre de la page", () => {
    const dom = createMockDOM();
    dom.addScreen("home");
    dom.addScreen("map");
    dom.addEl("page-title");
    dom.addEl("btn-home");

    const state = { screen: "home", cameraOn: false, compassOn: false };
    const router = window.Router.createRouter({
      $: dom.$, t: (k) => k === "title_map" ? "Carte" : k, state,
      effects: { stopCamera: () => {}, stopCompass: () => {}, stopAudio: () => {}, stopVoice: () => {}, onIntro: () => {} },
    });

    router.navigate("map");
    assert.equal(dom.elements["page-title"].textContent, "Carte");
  });

  it("masque btn-home sur l'écran home", () => {
    const dom = createMockDOM();
    dom.addScreen("home");
    dom.addEl("page-title");
    const btnHome = dom.addEl("btn-home");

    const state = { screen: "map", cameraOn: false, compassOn: false };
    const router = window.Router.createRouter({
      $: dom.$, t: (k) => k, state,
      effects: { stopCamera: () => {}, stopCompass: () => {}, stopAudio: () => {}, stopVoice: () => {}, onIntro: () => {} },
    });

    router.navigate("home");
    assert.equal(btnHome.style.visibility, "hidden");
  });

  it("historique de navigation", () => {
    const dom = createMockDOM();
    dom.addScreen("home");
    dom.addScreen("map");
    dom.addScreen("quiz");
    dom.addEl("page-title");
    dom.addEl("btn-home");

    const state = { screen: "home", cameraOn: false, compassOn: false };
    const router = window.Router.createRouter({
      $: dom.$, t: (k) => k, state,
      effects: { stopCamera: () => {}, stopCompass: () => {}, stopAudio: () => {}, stopVoice: () => {}, onIntro: () => {} },
    });

    assert.equal(router.canGoBack(), false);
    router.navigate("map");
    assert.equal(router.canGoBack(), true);
    assert.equal(router.current(), "map");
    router.goBack();
    assert.equal(router.current(), "home");
  });

  it("appelle stopCamera si on quitte l'écran scan", () => {
    const dom = createMockDOM();
    dom.addScreen("scan");
    dom.addScreen("home");
    dom.addEl("page-title");
    dom.addEl("btn-home");

    let cameraStopped = false;
    const state = { screen: "scan", cameraOn: true, compassOn: false };
    const router = window.Router.createRouter({
      $: dom.$, t: (k) => k, state,
      effects: { stopCamera: () => { cameraStopped = true; }, stopCompass: () => {}, stopAudio: () => {}, stopVoice: () => {}, onIntro: () => {} },
    });

    router.navigate("home");
    assert.equal(cameraStopped, true);
    assert.equal(state.cameraOn, false);
  });

  it("appelle onIntro quand on navigue vers intro", () => {
    const dom = createMockDOM();
    dom.addScreen("intro");
    dom.addEl("page-title");
    dom.addEl("btn-home");

    let introCalled = false;
    const state = { screen: "home", cameraOn: false, compassOn: false };
    const router = window.Router.createRouter({
      $: dom.$, t: (k) => k, state,
      effects: { stopCamera: () => {}, stopCompass: () => {}, stopAudio: () => {}, stopVoice: () => {}, onIntro: () => { introCalled = true; } },
    });

    router.navigate("intro");
    assert.equal(introCalled, true);
  });

  it("goBack ne fait rien si pas d'historique", () => {
    const dom = createMockDOM();
    dom.addScreen("home");
    dom.addEl("page-title");
    dom.addEl("btn-home");

    const state = { screen: "home", cameraOn: false, compassOn: false };
    const router = window.Router.createRouter({
      $: dom.$, t: (k) => k, state,
      effects: { stopCamera: () => {}, stopCompass: () => {}, stopAudio: () => {}, stopVoice: () => {}, onIntro: () => {} },
    });

    router.goBack();
    assert.equal(state.screen, "home");
  });
});
