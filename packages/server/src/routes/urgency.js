/* routes/urgency.js — Endpoints /api/urgency, /api/urgency/resolve
 *
 * Alertes urgence des participants.
 */
import { sendJson, sendOk, sendError, readBody, parseJson } from "../http.js";

export function handleUrgency(method, req, res, state) {
  if (method === "POST") return handleUrgencyPost(req, res, state);

  if (method === "GET") {
    const open = state.urgencies.filter((u) => u.status === "open");
    return sendJson(res, 200, {
      urgencies: open.map((u) => ({
        team: u.team,
        type: u.type,
        lat: u.lat,
        lng: u.lng,
        at: u.at,
        message: u.message,
        messageOrig: u.messageOrig,
        lang: u.lang,
      })),
    });
  }

  sendError(res, 405, "method-not-allowed");
}

async function handleUrgencyPost(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);
  const name = payload ? String(payload.team || "") : "";
  const type = payload ? String(payload.type || "") : "";

  if (!name || !["lost", "emergency", "message"].includes(type)) {
    return sendError(res, 400, "invalid-payload");
  }

  let lat = 0,
    lng = 0;
  if (payload) {
    lat = Number(payload.lat) || 0;
    lng = Number(payload.lng) || 0;
  }

  const rawMessage = type === "message" ? String(payload.message || "") : "";
  if (type === "message" && !rawMessage.trim()) {
    return sendError(res, 400, "empty-message");
  }

  const entry = {
    team: name,
    type,
    lat,
    lng,
    message: rawMessage,
    messageOrig: rawMessage,
    lang: String(payload.lang || "fr"),
    at: new Date().toISOString(),
    status: "open",
  };

  // Remplacer si déjà ouvert pour cette équipe
  const idx = state.urgencies.findIndex(
    (u) => u.status === "open" && u.team.toLowerCase() === name.toLowerCase()
  );
  if (idx >= 0) {
    state.urgencies[idx] = entry;
  } else {
    state.urgencies.push(entry);
    if (state.urgencies.length > 100) state.urgencies.shift();
  }

  state.saveUrgencies();
  return sendOk(res);
}

export function handleUrgencyResolve(method, req, res, state) {
  if (method !== "POST") return sendError(res, 405, "method-not-allowed");

  return handleResolvePost(req, res, state);
}

async function handleResolvePost(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);
  const name = payload ? String(payload.team || "") : "";
  if (!name) return sendError(res, 400, "missing-team");

  for (const u of state.urgencies) {
    if (u.status === "open" && u.team.toLowerCase() === name.toLowerCase()) {
      u.status = "resolved";
      u.resolvedAt = new Date().toISOString();
    }
  }

  state.saveUrgencies();
  return sendOk(res);
}
