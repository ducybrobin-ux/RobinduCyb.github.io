/* =========================================================
   E2E navigateur — Vue entière dans un vrai navigateur (Chrome).
   Vérifie par exécution réelle :
     - js/data.js s'exécute (régression normalize/checkAnswer corrigée)
       → BALISES(9), SITE, ACTIVE_PACKS présents au runtime
     - « Choisir un parcours » liste réellement les 9 packs,
       marque le pack actif ACTIVE (phantom-cybersecurite)
     - le bouton « Choisir ce parcours » répond au clic (toast organisateur)
     - le formulaire profil crée réellement un profil actif
     - le bouton « Jouer / continuer » apparaît avec un profil actif

   Exécuter : node --test tests/e2e/parcours-flow.test.mjs
   Nécessite Chrome installé (canal "chrome") + devDependency playwright-core.
   ========================================================= */
import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "../../packages/server/src/index.js";
import { chromium } from "playwright-core";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..");

let server;
let base;
let browser;
let page;
const errors = [];

before(async () => {
  const s = createServer({ root: ROOT, port: 0 });
  server = s.server;
  await new Promise((r) => server.listen(0, r));
  base = `http://localhost:${server.address().port}`;

  browser = await chromium.launch({ channel: "chrome", headless: true });
  page = await browser.newPage();
  page.on("pageerror", (e) => errors.push("PAGEERROR: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("CONSOLE: " + m.text().slice(0, 160)); });

  await page.goto(base + "/", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(2000);
});

after(async () => {
  if (browser) await browser.close();
  if (server) { server.closeAllConnections(); server.close(); }
});

const clickJS = (sel) =>
  page.evaluate((s) => { const el = document.querySelector(s); if (!el) return false; el.click(); return true; }, sel);

describe("E2E navigateur — données du jeu au runtime", () => {
  it("js/data.js s'exécute : BALISES(9), SITE, ACTIVE_PACKS définis et aucune error JS", async () => {
    const data = await page.evaluate(() => ({
      balises: typeof BALISES !== "undefined" ? BALISES.length : -1,
      site: typeof SITE !== "undefined",
      activePacks: typeof ACTIVE_PACKS !== "undefined" ? ACTIVE_PACKS : null,
      hasJDP: typeof window.JDP !== "undefined",
    }));
    assert.equal(data.balises, 9, "BALISES pas définis → data.js ne s'exécute pas");
    assert.equal(data.site, true);
    assert.ok(Array.isArray(data.activePacks) && data.activePacks.includes("phantom-cybersecurite"));
    assert.equal(data.hasJDP, true);
    assert.ok(!errors.some((e) => e.includes("already been declared")), "collision de redéclaration");
  });
});

describe("E2E navigateur — écran « Choisir un parcours »", () => {
  it("liste réellement les packs et marque le pack actif ACTIVE", async () => {
    await clickJS("#btn-choose-parcours");
    await page.waitForTimeout(400);
    const items = await page.evaluate(() => {
      const list = document.getElementById("parcours-list");
      if (!list) return [];
      return [...list.querySelectorAll(".cur-parc-item")].map((it) => ({
        name: (it.querySelector(".parc-name") || {}).textContent || "",
        badge: (it.querySelector(".parc-badge") || {}).textContent || "",
        activateId: (it.querySelector("[data-activate-pack]") || {}).dataset?.activatePack || null,
      }));
    });
    assert.ok(items.length >= 9, `la liste doit contenir les packs (trouvé ${items.length})`);
    const actif = items.find((i) => i.badge.includes("Actif"));
    assert.ok(actif, "aucun pack marqué Actif");
    assert.ok(actif.name.includes("Cyberséc") || actif.name.includes("Phantom"), "le pack actif doit être Phantom");
    // tous les packs non-actifs ont un bouton « Choisir ce parcours »
    const nonActifs = items.filter((i) => i.badge && !i.badge.includes("Actif"));
    assert.ok(nonActifs.length >= 8, "8 packs non-actifs attendus");
    assert.ok(nonActifs.every((i) => i.activateId), "chaque pack non-actif doit avoir un bouton d'activation");
  });

  it("le bouton « Choisir ce parcours » répond au clic (retour organisateur, pas de crash)", async () => {
    await clickJS('[data-activate-pack="passeur-relais"]');
    await page.waitForTimeout(700);
    const txt = await page.evaluate(() => document.body.innerText);
    assert.match(txt, /Sélection réservée à l'organisateur|Hors ligne|Activation impossible/, "le clic doit produire un retour");
    assert.ok(!errors.some((e) => e.startsWith("PAGEERROR")), "aucune pageerror au clic");
  });
});

describe("E2E navigateur — création de profil famille", () => {
  it("le formulaire profil crée réellement un profil actif", async () => {
    await page.evaluate(() => window.JDP.showScreen("profile"));
    await page.waitForTimeout(200);
    const r = await page.evaluate(() => {
      document.getElementById("profile-name").value = "Famille Test";
      document.getElementById("profile-kids").value = "2";
      const form = document.getElementById("profile-form");
      form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
      const Store = window.JDP.Store;
      return { active: Store.getActive(), profiles: Store.getProfiles().length };
    });
    assert.equal(r.profiles, 1);
    assert.ok(r.active, "un profil doit être actif");
    assert.equal(r.active.name, "Famille Test");
  });

  it("avec un profil actif, le bouton « Jouer / continuer » s'affiche", async () => {
    await clickJS("#btn-choose-parcours");
    await page.waitForTimeout(300);
    const hasPlay = await page.evaluate(() => !!document.getElementById("parc-play"));
    assert.equal(hasPlay, true);
  });
});
