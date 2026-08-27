/* routes/hub-crud.js — CRUD for projets, parcours, packs
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
  return user && ["ADMIN", "PROJECT_MANAGER", "PEDAGOGICAL_EDITOR", "CONTENT_VALIDATOR"].includes(user.role);
}

function canDelete(user) {
  return user && ["ADMIN", "PROJECT_MANAGER"].includes(user.role);
}

function parseId(url) {
  const m = url.match(/\/([a-z0-9-]+)$/i);
  return m ? m[1] : null;
}

/* ---- Projets ---- */

export function handleHubProjets(method, req, res, hubAuth, root) {
  const user = hubAuth.requireAuth(req, res);
  if (!user) return sendError(res, 401, "unauthorized");

  const filePath = path.join(root, "data", "hub-projets.json");
  const data = loadJson(filePath, []);

  if (method === "GET") {
    return sendOk(res, { items: data });
  }
  if (method === "POST") {
    if (!canWrite(user)) return sendError(res, 403, "forbidden");
    return handleCreate(req, res, filePath, data, "projet", user.id);
  }
  return sendError(res, 405, "method-not-allowed");
}

export function handleHubProjet(method, req, res, hubAuth, root) {
  const user = hubAuth.requireAuth(req, res);
  if (!user) return sendError(res, 401, "unauthorized");

  const url = new URL(req.url, "http://localhost");
  const id = url.pathname.split("/").pop();
  const filePath = path.join(root, "data", "hub-projets.json");
  const data = loadJson(filePath, []);
  const item = data.find(x => x.id === id);

  if (method === "GET") {
    if (!item) return sendError(res, 404, "not-found");
    return sendOk(res, { item });
  }
  if (method === "PUT") {
    if (!canWrite(user)) return sendError(res, 403, "forbidden");
    if (!item) return sendError(res, 404, "not-found");
    return handleUpdate(req, res, filePath, data, item);
  }
  if (method === "DELETE") {
    if (!canDelete(user)) return sendError(res, 403, "forbidden");
    if (!item) return sendError(res, 404, "not-found");
    return handleDelete(req, res, filePath, data, item);
  }
  return sendError(res, 405, "method-not-allowed");
}

/* ---- Parcours ---- */

export function handleHubParcours(method, req, res, hubAuth, root) {
  const user = hubAuth.requireAuth(req, res);
  if (!user) return sendError(res, 401, "unauthorized");

  const filePath = path.join(root, "data", "hub-parcours.json");
  const data = loadJson(filePath, []);

  if (method === "GET") {
    return sendOk(res, { items: data });
  }
  if (method === "POST") {
    if (!canWrite(user)) return sendError(res, 403, "forbidden");
    return handleCreate(req, res, filePath, data, "parcours", user.id);
  }
  return sendError(res, 405, "method-not-allowed");
}

export function handleHubParcoursItem(method, req, res, hubAuth, root) {
  const user = hubAuth.requireAuth(req, res);
  if (!user) return sendError(res, 401, "unauthorized");

  const url = new URL(req.url, "http://localhost");
  const id = url.pathname.split("/").pop();
  const filePath = path.join(root, "data", "hub-parcours.json");
  const data = loadJson(filePath, []);
  const item = data.find(x => x.id === id);

  if (method === "GET") {
    if (!item) return sendError(res, 404, "not-found");
    return sendOk(res, { item });
  }
  if (method === "PUT") {
    if (!canWrite(user)) return sendError(res, 403, "forbidden");
    if (!item) return sendError(res, 404, "not-found");
    return handleUpdate(req, res, filePath, data, item);
  }
  if (method === "DELETE") {
    if (!canDelete(user)) return sendError(res, 403, "forbidden");
    if (!item) return sendError(res, 404, "not-found");
    return handleDelete(req, res, filePath, data, item);
  }
  return sendError(res, 405, "method-not-allowed");
}

/* ---- Packs ---- */

export function handleHubPacks(method, req, res, hubAuth, root) {
  const user = hubAuth.requireAuth(req, res);
  if (!user) return sendError(res, 401, "unauthorized");

  const filePath = path.join(root, "data", "hub-packs.json");
  const data = loadJson(filePath, []);

  if (method === "GET") {
    return sendOk(res, { items: data });
  }
  if (method === "POST") {
    if (!canWrite(user)) return sendError(res, 403, "forbidden");
    return handleCreate(req, res, filePath, data, "pack", user.id);
  }
  return sendError(res, 405, "method-not-allowed");
}

export function handleHubPack(method, req, res, hubAuth, root) {
  const user = hubAuth.requireAuth(req, res);
  if (!user) return sendError(res, 401, "unauthorized");

  const url = new URL(req.url, "http://localhost");
  const id = url.pathname.split("/").pop();
  const filePath = path.join(root, "data", "hub-packs.json");
  const data = loadJson(filePath, []);
  const item = data.find(x => x.id === id);

  if (method === "GET") {
    if (!item) return sendError(res, 404, "not-found");
    return sendOk(res, { item });
  }
  if (method === "PUT") {
    if (!canWrite(user)) return sendError(res, 403, "forbidden");
    if (!item) return sendError(res, 404, "not-found");
    return handleUpdate(req, res, filePath, data, item);
  }
  if (method === "DELETE") {
    if (!canDelete(user)) return sendError(res, 403, "forbidden");
    if (!item) return sendError(res, 404, "not-found");
    return handleDelete(req, res, filePath, data, item);
  }
  return sendError(res, 405, "method-not-allowed");
}

/* ---- Shared helpers ---- */

async function handleCreate(req, res, filePath, data, type, userId) {
  const body = await readBody(req);
  const p = parseJson(body);
  if (!p || !p.name) return sendError(res, 400, "missing-name");

  const item = {
    id: type + "-" + Date.now(),
    name: p.name.trim(),
    description: (p.description || "").trim(),
    status: "draft",
    createdBy: userId,
    created: Date.now(),
    updated: Date.now(),
    ...p,
    id: type + "-" + Date.now(), // ensure id is set after spread
  };

  data.push(item);
  saveJson(filePath, data);
  return sendOk(res, { item });
}

async function handleUpdate(req, res, filePath, data, item) {
  const body = await readBody(req);
  const p = parseJson(body);
  if (!p) return sendError(res, 400, "invalid-body");

  const idx = data.indexOf(item);
  const updated = { ...item, ...p, id: item.id, created: item.created, updated: Date.now() };
  data[idx] = updated;
  saveJson(filePath, data);
  return sendOk(res, { item: updated });
}

async function handleDelete(req, res, filePath, data, item) {
  const idx = data.indexOf(item);
  data.splice(idx, 1);
  saveJson(filePath, data);
  return sendOk(res);
}
