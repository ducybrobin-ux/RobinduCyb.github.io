/* state.js — État in-mémoire du serveur Curios
 *
 * Miroir fidèle des variables $script:* de server.ps1.
 * Pas de dépendances externes.
 */
import fs from "node:fs";
import path from "node:path";

export function createState(root) {
  const dataDir = path.join(root, "data");

  function loadJson(filename, fallback) {
    try {
      const fp = path.join(dataDir, filename);
      if (!fs.existsSync(fp)) return fallback;
      const raw = fs.readFileSync(fp, "utf8");
      return JSON.parse(raw);
    } catch {
      return fallback;
    }
  }

  function saveJson(filename, data) {
    try {
      if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
      const fp = path.join(dataDir, filename);
      fs.writeFileSync(fp, JSON.stringify(data), "utf8");
    } catch {}
  }

  const state = {
    root,
    dataDir,

    // --- Board (tableau de bord) ---
    boardMessage: {},
    boardSeq: 0,
    boardChallenge: null,
    challengeSeq: 0,
    answers: [],
    positions: [],
    positionSeq: 0,
    boardLogout: {},
    logoutSeq: 0,
    translateCache: {},

    // --- Persistance ---
    validations: loadJson("validations.json", {}),
    finishes: loadJson("finishes.json", []),
    urgencies: loadJson("urgencies.json", []),
    feedback: loadJson("feedback.json", []),
    sessions: loadJson("sessions.json", []),

    // --- Config ---
    serverMode: loadJson("server-mode.json", { local: true, internet: false }),
    wifi: loadJson("wifi.json", { ssid: "", password: "", security: "WPA" }),
    mapUrl: loadJson("map.json", {}).url || "",

    // --- Tunnel ---
    tunnelStatus: "off",
    tunnelUrl: "",
    tunnelError: "",
    tunnelProcess: null,
  };

  state.saveValidations = () => saveJson("validations.json", state.validations);
  state.saveFinishes = () => saveJson("finishes.json", state.finishes);
  state.saveUrgencies = () => saveJson("urgencies.json", state.urgencies);
  state.saveFeedback = () => saveJson("feedback.json", state.feedback);
  state.saveSessions = () => saveJson("sessions.json", state.sessions);
  state.saveServerMode = () => saveJson("server-mode.json", state.serverMode);
  state.saveWifi = () => saveJson("wifi.json", state.wifi);
  state.saveMap = () => saveJson("map.json", { url: state.mapUrl });

  return state;
}
