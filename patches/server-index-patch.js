/* server-index-patch.js — Patch pour packages/server/src/index.js
 *
 * Ajouter ces imports et routes dans le fichier index.js existant.
 * Voir README-PATCHES.md pour les instructions.
 */

// === 1. AJOUTER LES IMPORTS (en haut du fichier, après les autres imports) ===
// import { createHubAuth } from "./hub-auth-server.js";

// === 2. AJOUTER LA CRÉATION DE L'INSTANCE HUB AUTH (dans createServer, après createAuth) ===
// const hubAuth = createHubAuth(root);

// === 3. AJOUTER LES ROUTES HUB (dans handleRequest, APRÈS les routes /api/* existantes) ===

function handleHubRoutes(apiPath, method, req, res, state, hubAuth) {
  // --- Hub Auth ---
  if (apiPath === "/api/auth/register" && method === "POST") {
    return handleHubRegister(req, res, hubAuth);
  }
  if (apiPath === "/api/auth/login" && method === "POST") {
    return handleHubLogin(req, res, hubAuth);
  }
  if (apiPath === "/api/auth/me" && method === "GET") {
    return handleHubMe(req, res, hubAuth);
  }
  if (apiPath === "/api/auth/logout" && method === "POST") {
    return handleHubLogout(req, res, hubAuth);
  }

  // --- Hub Stats ---
  if (apiPath === "/api/hub/stats" && method === "GET") {
    return handleHubStats(req, res, state);
  }

  return false; // non géré
}

// === 4. FONCTIONS DE HANDLER ===

import { sendJson, sendOk, sendError, readBody, parseJson } from "./http.js";

async function handleHubRegister(req, res, hubAuth) {
  const body = await readBody(req);
  const payload = parseJson(body);
  if (!payload || !payload.name || !payload.email || !payload.password) {
    return sendError(res, 400, "missing-fields");
  }
  if (payload.password.length < 6) {
    return sendError(res, 400, "password-too-short");
  }
  const result = hubAuth.register(payload.name, payload.email, payload.password);
  if (result.error) {
    return sendError(res, 409, result.error);
  }
  return sendOk(res, result);
}

async function handleHubLogin(req, res, hubAuth) {
  const body = await readBody(req);
  const payload = parseJson(body);
  if (!payload || !payload.email || !payload.password) {
    return sendError(res, 400, "missing-fields");
  }
  const result = hubAuth.login(payload.email, payload.password);
  if (result.error) {
    return sendError(res, 401, result.error);
  }
  return sendOk(res, result);
}

function handleHubMe(req, res, hubAuth) {
  const token = hubAuth.extractToken(req);
  if (!token) return sendError(res, 401, "unauthorized");
  const result = hubAuth.me(token);
  if (result.error) {
    return sendError(res, 401, result.error);
  }
  return sendOk(res, result);
}

function handleHubLogout(req, res, hubAuth) {
  const token = hubAuth.extractToken(req);
  if (token) hubAuth.logout(token);
  return sendOk(res, { ok: true });
}

function handleHubStats(req, res, state) {
  const sessions = state.sessions || [];
  const activeSessions = sessions.filter(function (s) { return s.status === "active"; });
  return sendOk(res, {
    projects: 0,
    activeSessions: activeSessions.length,
    totalSessions: sessions.length,
    packs: 0,
    teams: activeSessions.reduce(function (sum, s) { return sum + (s.teams ? s.teams.length : 0); }, 0),
  });
}

/* ============================================================
   INSTRUCTIONS D'INTÉGRATION
   ============================================================

   1. Copiez hub-auth-server.js dans packages/server/src/

   2. Dans packages/server/src/index.js, ajoutez :
      - Import : import { createHubAuth } from "./hub-auth-server.js";
      - Dans createServer() : const hubAuth = createHubAuth(root);
      - Passez hubAuth à handleRequest

   3. Dans handleRequest, avant le return sendError(404), ajoutez :
      const hubResult = handleHubRoutes(apiPath, method, req, res, state, hubAuth);
      if (hubResult !== false) return;

   4. Nettoyage : ajoutez setInterval(() => hubAuth.cleanupSessions(), 60*60*1000)

   ============================================================ */
