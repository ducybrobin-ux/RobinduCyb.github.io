/* routes/hub-resources.js — CRUD for clients, materiel, sessions, planning, commercial
 *
 * JSON file storage, role-based access.
 * Zero dependencies.
 */
import fs from "node:fs";
import path from "node:path";
import { sendOk, sendError, readBody, parseJson } from "../http.js";

function loadJson(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    }
  } catch {}
  return fallback;
}

function saveJson(filePath, data) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function canWrite(user) {
  return user && ["ADMIN", "PROJECT_MANAGER", "FORMATOR", "CONTENT_VALIDATOR"].includes(user.role);
}

function canDelete(user) {
  return user && ["ADMIN", "PROJECT_MANAGER"].includes(user.role);
}

function createGeneric(type, filePath, req, res, user) {
  if (!canWrite(user)) return sendError(res, 403, "forbidden");
  const data = loadJson(filePath, []);
  return readBody(req).then(body => {
    const p = parseJson(body);
    if (!p || !p.name) return sendError(res, 400, "missing-name");
    const id = type + "-" + Date.now();
    const item = {
      name: p.name.trim(),
      description: (p.description || "").trim(),
      status: "draft",
      createdBy: user.id,
      created: Date.now(),
      updated: Date.now(),
      ...p,
      id,
    };
    data.push(item);
    saveJson(filePath, data);
    return sendOk(res, { item });
  });
}

function updateGeneric(filePath, data, id, req, res, user) {
  if (!canWrite(user)) return sendError(res, 403, "forbidden");
  const item = data.find(x => x.id === id);
  if (!item) return sendError(res, 404, "not-found");
  return readBody(req).then(body => {
    const p = parseJson(body);
    if (!p) return sendError(res, 400, "invalid-body");
    const idx = data.indexOf(item);
    const updated = { ...item, ...p, id: item.id, created: item.created, updated: Date.now() };
    data[idx] = updated;
    saveJson(filePath, data);
    return sendOk(res, { item: updated });
  });
}

function deleteGeneric(filePath, data, id, res, user) {
  if (!canDelete(user)) return sendError(res, 403, "forbidden");
  const item = data.find(x => x.id === id);
  if (!item) return sendError(res, 404, "not-found");
  data.splice(data.indexOf(item), 1);
  saveJson(filePath, data);
  return sendOk(res);
}

function handleCollection(type, filePath, method, req, res, hubAuth, root) {
  const user = hubAuth.requireAuth(req, res);
  if (!user) return sendError(res, 401, "unauthorized");
  const data = loadJson(filePath, []);
  if (method === "GET") return sendOk(res, { items: data });
  if (method === "POST") return createGeneric(type, filePath, req, res, user);
  return sendError(res, 405, "method-not-allowed");
}

function handleItem(filePath, method, req, res, hubAuth) {
  const user = hubAuth.requireAuth(req, res);
  if (!user) return sendError(res, 401, "unauthorized");
  const url = new URL(req.url, "http://localhost");
  const id = url.pathname.split("/").pop();
  const data = loadJson(filePath, []);
  if (method === "GET") {
    const item = data.find(x => x.id === id);
    if (!item) return sendError(res, 404, "not-found");
    return sendOk(res, { item });
  }
  if (method === "PUT") return updateGeneric(filePath, data, id, req, res, user);
  if (method === "DELETE") return deleteGeneric(filePath, data, id, res, user);
  return sendError(res, 405, "method-not-allowed");
}

/* ---- Clients ---- */
export function handleHubClients(method, req, res, hubAuth, root) {
  return handleCollection("client", path.join(root, "data", "hub-clients.json"), method, req, res, hubAuth, root);
}
export function handleHubClient(method, req, res, hubAuth, root) {
  return handleItem(path.join(root, "data", "hub-clients.json"), method, req, res, hubAuth);
}

/* ---- Materiel ---- */
export function handleHubMateriel(method, req, res, hubAuth, root) {
  return handleCollection("materiel", path.join(root, "data", "hub-materiel.json"), method, req, res, hubAuth, root);
}
export function handleHubMaterielItem(method, req, res, hubAuth, root) {
  return handleItem(path.join(root, "data", "hub-materiel.json"), method, req, res, hubAuth);
}

/* ---- Sessions ---- */
export function handleHubSessions(method, req, res, hubAuth, root) {
  return handleCollection("session", path.join(root, "data", "hub-sessions-data.json"), method, req, res, hubAuth, root);
}
export function handleHubSessionItem(method, req, res, hubAuth, root) {
  return handleItem(path.join(root, "data", "hub-sessions-data.json"), method, req, res, hubAuth);
}

/* ---- Planning ---- */
export function handleHubPlanning(method, req, res, hubAuth, root) {
  return handleCollection("event", path.join(root, "data", "hub-planning.json"), method, req, res, hubAuth, root);
}
export function handleHubPlanningItem(method, req, res, hubAuth, root) {
  return handleItem(path.join(root, "data", "hub-planning.json"), method, req, res, hubAuth);
}

/* ---- Commercial ---- */
export function handleHubCommercial(method, req, res, hubAuth, root) {
  return handleCollection("devis", path.join(root, "data", "hub-commercial.json"), method, req, res, hubAuth, root);
}
export function handleHubCommercialItem(method, req, res, hubAuth, root) {
  return handleItem(path.join(root, "data", "hub-commercial.json"), method, req, res, hubAuth);
}

/* ---- Analytics (read-only aggregate) ---- */
export function handleHubAnalytics(method, req, res, hubAuth, root) {
  const user = hubAuth.requireAuth(req, res);
  if (!user) return sendError(res, 401, "unauthorized");
  if (method !== "GET") return sendError(res, 405, "method-not-allowed");

  const projets = loadJson(path.join(root, "data", "hub-projets.json"), []);
  const parcours = loadJson(path.join(root, "data", "hub-parcours.json"), []);
  const packs = loadJson(path.join(root, "data", "hub-packs.json"), []);
  const clients = loadJson(path.join(root, "data", "hub-clients.json"), []);
  const sessions = loadJson(path.join(root, "data", "hub-sessions-data.json"), []);
  const materiel = loadJson(path.join(root, "data", "hub-materiel.json"), []);
  const commercial = loadJson(path.join(root, "data", "hub-commercial.json"), []);

  const now = Date.now();
  const weekAgo = now - 7 * 24 * 60 * 60 * 1000;
  const monthAgo = now - 30 * 24 * 60 * 60 * 1000;

  return sendOk(res, {
    totals: {
      projets: projets.length,
      parcours: parcours.length,
      packs: packs.length,
      clients: clients.length,
      sessions: sessions.length,
      materiel: materiel.length,
      devis: commercial.length,
    },
    recent: {
      projetsThisWeek: projets.filter(p => p.created > weekAgo).length,
      sessionsThisMonth: sessions.filter(s => s.created > monthAgo).length,
      devisThisMonth: commercial.filter(d => d.created > monthAgo).length,
    },
    byStatus: {
      projetsActive: projets.filter(p => p.status === "active").length,
      projetsDraft: projets.filter(p => p.status === "draft").length,
      sessionsActive: sessions.filter(s => s.status === "active").length,
    },
  });
}
