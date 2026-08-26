/* routes/sessions.js — Endpoints /api/session
 *
 * Gestion des sessions de jeu.
 * Persistance JSON (extensible vers SQLite).
 */
import { sendJson, sendOk, sendError, readBody, parseJson } from "../http.js";

export function handleSession(method, req, res, state) {
  if (method === "POST") return handleSessionPost(req, res, state);
  if (method === "GET") return handleSessionGet(req, res, state);

  sendError(res, 405, "method-not-allowed");
}

async function handleSessionPost(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);

  if (!payload || !payload.parcoursId) {
    return sendError(res, 400, "missing-parcoursId");
  }

  const sessionId = generateId();
  const now = new Date().toISOString();

  const session = {
    id: sessionId,
    parcoursId: payload.parcoursId,
    editionId: payload.editionId || "",
    title: payload.title || "",
    startedAt: now,
    endedAt: null,
    teams: [],
    events: [],
    status: "active",
  };

  state.sessions = state.sessions || [];
  state.sessions.push(session);

  // Persistance
  state.saveSessions();

  return sendOk(res, {
    sessionId: session.id,
    startedAt: session.startedAt,
  });
}

function handleSessionGet(req, res, state) {
  const url = new URL(req.url, "http://localhost");
  const sessionId = url.searchParams.get("id");

  if (!sessionId) {
    // Retourner toutes les sessions actives
    const active = (state.sessions || []).filter((s) => s.status === "active");
    return sendJson(res, 200, {
      sessions: active.map((s) => ({
        id: s.id,
        parcoursId: s.parcoursId,
        title: s.title,
        startedAt: s.startedAt,
        teamCount: s.teams.length,
      })),
    });
  }

  // Retourner une session spécifique
  const session = (state.sessions || []).find((s) => s.id === sessionId);
  if (!session) {
    return sendError(res, 404, "session-not-found");
  }

  return sendJson(res, 200, { session });
}

export function handleSessionTeam(method, req, res, state) {
  if (method === "POST") return handleSessionTeamPost(req, res, state);

  sendError(res, 405, "method-not-allowed");
}

async function handleSessionTeamPost(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);

  if (!payload || !payload.sessionId || !payload.teamName) {
    return sendError(res, 400, "missing-fields");
  }

  const session = (state.sessions || []).find((s) => s.id === payload.sessionId);
  if (!session) {
    return sendError(res, 404, "session-not-found");
  }

  // Vérifier si l'équipe existe déjà
  const existing = session.teams.find(
    (t) => t.name.toLowerCase() === payload.teamName.toLowerCase()
  );
  if (existing) {
    return sendOk(res, { teamId: existing.id, alreadyExists: true });
  }

  const teamId = generateId();
  const team = {
    id: teamId,
    name: payload.teamName,
    state: "ok",
    progress: [],
    joinedAt: new Date().toISOString(),
  };

  session.teams.push(team);
  state.saveSessions();

  return sendOk(res, { teamId: team.id, joinedAt: team.joinedAt });
}

export function handleSessionProgress(method, req, res, state) {
  if (method === "POST") return handleSessionProgressPost(req, res, state);

  sendError(res, 405, "method-not-allowed");
}

async function handleSessionProgressPost(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);

  if (!payload || !payload.sessionId || !payload.teamId || !payload.stationId) {
    return sendError(res, 400, "missing-fields");
  }

  const session = (state.sessions || []).find((s) => s.id === payload.sessionId);
  if (!session) {
    return sendError(res, 404, "session-not-found");
  }

  const team = session.teams.find((t) => t.id === payload.teamId);
  if (!team) {
    return sendError(res, 404, "team-not-found");
  }

  // Ajouter la progression
  const progress = {
    stationId: payload.stationId,
    missionId: payload.missionId || "",
    at: new Date().toISOString(),
    mode: payload.mode || "gps",
    stars: payload.stars || 0,
  };

  team.progress.push(progress);
  state.saveSessions();

  return sendOk(res, { progressCount: team.progress.length });
}

export function handleSessionEnd(method, req, res, state) {
  if (method === "POST") return handleSessionEndPost(req, res, state);

  sendError(res, 405, "method-not-allowed");
}

async function handleSessionEndPost(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);

  if (!payload || !payload.sessionId) {
    return sendError(res, 400, "missing-sessionId");
  }

  const session = (state.sessions || []).find((s) => s.id === payload.sessionId);
  if (!session) {
    return sendError(res, 404, "session-not-found");
  }

  session.endedAt = new Date().toISOString();
  session.status = "ended";
  state.saveSessions();

  return sendOk(res, {
    endedAt: session.endedAt,
    teamCount: session.teams.length,
  });
}

// Fonction utilitaire pour générer un ID unique
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}
