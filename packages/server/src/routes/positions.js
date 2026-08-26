/* routes/positions.js — Endpoints /api/pos, /api/finish
 *
 * Positions GPS des équipes + équipes terminées.
 */
import { sendJson, sendOk, sendError, readBody, parseJson } from "../http.js";

export function handlePos(method, req, res, state) {
  if (method === "POST") return handlePosPost(req, res, state);

  if (method === "GET") {
    const now = Date.now();
    const fresh = state.positions.filter(
      (p) => p.at && now - p.at.getTime() < 3 * 60 * 1000
    );
    const statuses = state.positions.filter(
      (p) => p.seen && now - p.seen.getTime() < 15 * 60 * 1000
    );

    return sendJson(res, 200, {
      seq: state.positionSeq,
      positions: fresh.map((p) => ({
        team: p.team,
        lat: p.lat,
        lng: p.lng,
        at: p.at ? p.at.toTimeString().slice(0, 8) : "",
        acc: p.acc,
      })),
      statuses: statuses.map((p) => ({
        team: p.team,
        bat: p.bat,
        chg: p.chg,
        onl: p.onl,
        net: p.net,
        cam: p.cam,
        acc: p.acc,
        seen: p.seen ? p.seen.toTimeString().slice(0, 8) : "",
        posAt: p.at ? p.at.toTimeString().slice(0, 8) : "",
        lat: p.lat,
        lng: p.lng,
      })),
    });
  }

  sendError(res, 405, "method-not-allowed");
}

async function handlePosPost(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);
  const name = payload ? String(payload.team || "") : "";
  if (!name) return sendError(res, 400, "missing-team");

  let lat = 0,
    lng = 0;
  if (payload) {
    lat = Number(payload.lat) || 0;
    lng = Number(payload.lng) || 0;
  }

  const now = new Date();
  let entry = state.positions.find((p) => p.team.toLowerCase() === name.toLowerCase());

  if (!entry) {
    entry = {
      team: name,
      lat: 0,
      lng: 0,
      at: null,
      seen: now,
      acc: null,
      bat: null,
      chg: null,
      onl: null,
      net: "",
      cam: "",
    };
    state.positions.push(entry);
    if (state.positions.length > 60) state.positions.shift();
  }

  if (lat !== 0 && lng !== 0 && lat > -90 && lat < 90 && lng > -180 && lng < 180) {
    entry.lat = lat;
    entry.lng = lng;
    entry.at = now;
  }
  entry.seen = now;

  for (const k of ["acc", "bat", "onl", "net", "cam"]) {
    if (payload && payload[k] != null && String(payload[k]) !== "") {
      entry[k] = payload[k];
    }
  }
  if (payload && payload.chg != null) entry.chg = Boolean(payload.chg);

  state.positionSeq++;
  return sendOk(res);
}

export function handleFinish(method, req, res, state) {
  if (method === "POST") return handleFinishPost(req, res, state);

  if (method === "GET") {
    return sendJson(res, 200, {
      finishes: state.finishes.map((f) => ({ ...f })),
    });
  }

  sendError(res, 405, "method-not-allowed");
}

async function handleFinishPost(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);
  const name = payload ? String(payload.team || "") : "";
  if (!name) return sendError(res, 400, "missing-team");

  const entry = {
    team: name,
    stars: 0,
    seconds: 0,
    balises: 0,
    offered: 0,
    message: "",
    selfie: "",
    at: new Date().toISOString(),
  };

  if (payload) {
    for (const k of ["stars", "seconds", "balises", "offered", "message", "selfie"]) {
      if (payload[k] != null) entry[k] = payload[k];
    }
  }

  const idx = state.finishes.findIndex(
    (f) => f.team.toLowerCase() === name.toLowerCase()
  );
  if (idx >= 0) {
    state.finishes[idx] = entry;
  } else {
    state.finishes.push(entry);
    if (state.finishes.length > 60) state.finishes.shift();
  }

  state.saveFinishes();
  return sendOk(res);
}
