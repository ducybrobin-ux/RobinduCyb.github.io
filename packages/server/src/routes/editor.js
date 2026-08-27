/* routes/editor.js — Endpoints /api/editor, /api/editor/images, /api/editor/image,
 *                     /api/editor/reset, /api/qr/export
 *
 * Éditeur de contenu et export QR.
 */
import fs from "node:fs";
import path from "node:path";
import { sendJson, sendOk, sendError, readBody, parseJson, ensureDir } from "../http.js";

export function handleEditor(method, req, res, state) {
  const edFile = path.join(state.root, "admin-data.json");

  if (method === "POST") {
    return handleEditorPost(req, res, edFile);
  }

  if (method === "GET") {
    let obj = {};
    if (fs.existsSync(edFile)) {
      try {
        obj = JSON.parse(fs.readFileSync(edFile, "utf8"));
      } catch {
        obj = {};
      }
    }
    return sendJson(res, 200, { data: obj });
  }

  sendError(res, 405, "method-not-allowed");
}

async function handleEditorPost(req, res, edFile) {
  const body = await readBody(req);
  const payload = parseJson(body);
  if (!payload || typeof payload !== "object") {
    return sendError(res, 400, "invalid-json");
  }

  const data = payload.data || payload;
  if (typeof data !== "object" || data === null) {
    return sendError(res, 400, "invalid-data");
  }

  try {
    ensureDir(path.dirname(edFile));
    fs.writeFileSync(edFile, JSON.stringify(data), "utf8");
    return sendOk(res);
  } catch {
    return sendError(res, 500, "write-failed");
  }
}

export function handleEditorImages(method, req, res, state) {
  if (method !== "GET") return sendError(res, 405, "method-not-allowed");

  const imgDir = path.join(state.root, "img");
  const list = [];

  function walk(dir, prefix) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        walk(path.join(dir, entry.name), rel);
      } else if (/\.(jpg|jpeg|png|gif|svg|webp)$/i.test(entry.name)) {
        list.push(`img/${  rel}`);
      }
    }
  }

  walk(imgDir, "");
  list.sort();
  return sendJson(res, 200, list);
}

export function handleEditorImage(method, req, res, state) {
  if (method !== "POST") return sendError(res, 405, "method-not-allowed");

  return handleImageUpload(req, res, state);
}

async function handleImageUpload(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);
  if (!payload || !payload.name || !payload.data) {
    return sendError(res, 400, "missing-fields");
  }

  const name = String(payload.name);
  if (
    /[\\/]/.test(name) ||
    !/^[A-Za-z0-9_% .\u00C0-\u00FF\-]+\.(jpg|jpeg|png|gif|svg|webp)$/i.test(name)
  ) {
    return sendError(res, 400, "invalid-name");
  }

  let bytes;
  try {
    bytes = Buffer.from(String(payload.data), "base64");
  } catch {
    return sendError(res, 400, "invalid-data");
  }

  if (bytes.length < 16) return sendError(res, 400, "invalid-data");

  const imgDir = path.join(state.root, "img");
  try {
    ensureDir(imgDir);
    fs.writeFileSync(path.join(imgDir, name), bytes);
    return sendOk(res, { url: `img/${name}` });
  } catch {
    return sendError(res, 500, "write-failed");
  }
}

export function handleEditorReset(method, req, res, state) {
  if (method !== "POST") return sendError(res, 405, "method-not-allowed");

  const edFile = path.join(state.root, "admin-data.json");
  try {
    if (fs.existsSync(edFile)) fs.unlinkSync(edFile);
  } catch {}
  return sendOk(res);
}

export function handleQrExport(method, req, res, state) {
  if (method !== "POST") return sendError(res, 405, "method-not-allowed");

  return handleQrExportPost(req, res, state);
}

async function handleQrExportPost(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);
  const files = payload && payload.files ? payload.files : [];
  if (files.length === 0) return sendError(res, 400, "missing-files");

  const qrDir = path.join(state.root, "qrcodes");
  ensureDir(qrDir);

  const saved = [];
  const errors = [];

  for (const f of files) {
    const name = String(f.name || "");
    if (
      /[\\/]/.test(name) ||
      !/^[A-Za-z0-9_ %\u00C0-\u00FF\-]+\.(jpg|jpeg)$/i.test(name)
    ) {
      errors.push(name);
      continue;
    }

    let bytes;
    try {
      bytes = Buffer.from(String(f.data), "base64");
    } catch {
      errors.push(name);
      continue;
    }

    if (bytes.length < 16) {
      errors.push(name);
      continue;
    }

    try {
      fs.writeFileSync(path.join(qrDir, name), bytes);
      saved.push(name);
    } catch {
      errors.push(name);
    }
  }

  return sendJson(res, 200, {
    ok: errors.length === 0,
    saved,
    errors,
    dir: "qrcodes",
  });
}
