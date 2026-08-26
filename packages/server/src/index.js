/* index.js — Serveur HTTP/HTTPS Curios
 *
 * Remplacement Node.js de server.ps1.
 * Zéro dépendance externe — Node.js natif uniquement.
 */
import http from "node:http";
import https from "node:https";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createState } from "./state.js";
import { createAuth } from "./auth.js";
import {
  resolvePathSafe,
  serveFile,
  sendJson,
  sendError,
} from "./http.js";
import { handleBoard, handleAnswer, handleAnswers } from "./routes/board.js";
import { handlePos, handleFinish } from "./routes/positions.js";
import { handleUrgency, handleUrgencyResolve } from "./routes/urgency.js";
import {
  handleIp,
  handleServerMode,
  handleWifi,
  handleWifiDetect,
  handleMap,
} from "./routes/config.js";
import {
  handleEditor,
  handleEditorImages,
  handleEditorImage,
  handleEditorReset,
  handleQrExport,
} from "./routes/editor.js";
import {
  handleValidations,
  handleValidationsRemove,
  handleValidationsTeam,
} from "./routes/validations.js";
import { handleReport } from "./routes/report.js";
import { handleKml } from "./routes/kml.js";
import {
  handleLogin,
  handleLogout,
  handleMe,
  handleSetup,
} from "./routes/auth.js";
import {
  handleSession,
  handleSessionTeam,
  handleSessionProgress,
  handleSessionEnd,
} from "./routes/sessions.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..", "..", "..");

// Endpoints protégés (organisateur uniquement) — GET autorisés librement
const PROTECTED_POST = new Set([
  "/api/editor",
  "/api/editor/image",
  "/api/editor/reset",
  "/api/qr/export",
  "/api/validations/remove",
  "/api/validations/team",
  "/api/server-mode",
  "/api/wifi",
  "/api/map",
]);

// Endpoints toujours protégés (même GET)
const PROTECTED_ALWAYS = new Set([
  "/api/report",
  "/api/editor/images",
]);

export function createServer(options = {}) {
  const root = options.root || ROOT;
  const port = options.port || 8080;
  const httpsPort = options.httpsPort || 8443;

  const state = createState(root);
  const auth = createAuth(root);
  const config = { port, httpsPort };

  // Nettoyer les sessions expirées toutes les heures (unref pour ne pas bloquer l'arrêt)
  const cleanupInterval = setInterval(() => auth.cleanupSessions(), 60 * 60 * 1000);
  cleanupInterval.unref();

  const server = http.createServer((req, res) => {
    handleRequest(req, res, state, auth, config);
  });

  return { server, state, auth, config };
}

function handleRequest(req, res, state, auth, config) {
  const method = req.method;
  const url = new URL(req.url, "http://localhost");
  const apiPath = url.pathname;

  // --- API routes ---
  if (apiPath.startsWith("/api/")) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

    if (method === "OPTIONS") {
      res.writeHead(204);
      return res.end();
    }

    // Vérification d'auth pour les endpoints protégés
    if (
      (PROTECTED_POST.has(apiPath) && method === "POST") ||
      PROTECTED_ALWAYS.has(apiPath)
    ) {
      if (!auth.requireAuth(req, res)) {
        return sendError(res, 401, "unauthorized");
      }
    }

    try {
      // Auth
      if (apiPath === "/api/auth/login") return handleLogin(method, req, res, auth, state);
      if (apiPath === "/api/auth/logout") return handleLogout(method, req, res, auth);
      if (apiPath === "/api/auth/me") return handleMe(method, req, res, auth);
      if (apiPath === "/api/auth/setup") return handleSetup(method, req, res, auth);

      // Board
      if (apiPath === "/api/board") return handleBoard(method, req, res, state);
      if (apiPath === "/api/answer") return handleAnswer(method, req, res, state);
      if (apiPath === "/api/answers") return handleAnswers(method, req, res, state);

      // Positions & finish
      if (apiPath === "/api/pos") return handlePos(method, req, res, state);
      if (apiPath === "/api/finish") return handleFinish(method, req, res, state);

      // Urgency
      if (apiPath === "/api/urgency") return handleUrgency(method, req, res, state);
      if (apiPath === "/api/urgency/resolve") return handleUrgencyResolve(method, req, res, state);

      // Config
      if (apiPath === "/api/ip") return handleIp(method, req, res, state, config);
      if (apiPath === "/api/server-mode") return handleServerMode(method, req, res, state, config);
      if (apiPath === "/api/wifi") return handleWifi(method, req, res, state);
      if (apiPath === "/api/wifi/detect") return handleWifiDetect(method, req, res);
      if (apiPath === "/api/map") return handleMap(method, req, res, state);

      // Editor
      if (apiPath === "/api/editor") return handleEditor(method, req, res, state);
      if (apiPath === "/api/editor/images") return handleEditorImages(method, req, res, state);
      if (apiPath === "/api/editor/image") return handleEditorImage(method, req, res, state);
      if (apiPath === "/api/editor/reset") return handleEditorReset(method, req, res, state);
      if (apiPath === "/api/qr/export") return handleQrExport(method, req, res, state);

      // Validations
      if (apiPath === "/api/validations") return handleValidations(method, req, res, state);
      if (apiPath === "/api/validations/remove") return handleValidationsRemove(method, req, res, state);
      if (apiPath === "/api/validations/team") return handleValidationsTeam(method, req, res, state);

      // Report
      if (apiPath === "/api/report") return handleReport(method, req, res, state, config);

      // KML
      if (apiPath === "/api/kml") return handleKml(method, req, res);

      // Sessions
      if (apiPath === "/api/session") return handleSession(method, req, res, state);
      if (apiPath === "/api/session/team") return handleSessionTeam(method, req, res, state);
      if (apiPath === "/api/session/progress") return handleSessionProgress(method, req, res, state);
      if (apiPath === "/api/session/end") return handleSessionEnd(method, req, res, state);

      return sendError(res, 404, "endpoint-not-found");
    } catch (err) {
      console.error(`[API ERROR] ${apiPath}:`, err.message);
      return sendError(res, 500, "internal-error");
    }
  }

  // --- Static files ---
  const filePath = resolvePathSafe(state.root, req.url);
  if (!filePath) {
    res.writeHead(404);
    return res.end("404 Not Found");
  }

  const stat = fs.statSync(filePath);
  if (stat.isDirectory()) {
    const index = path.join(filePath, "index.html");
    if (fs.existsSync(index)) {
      return serveFile(res, index, state.root);
    }
    res.writeHead(403);
    return res.end("403 Forbidden");
  }

  serveFile(res, filePath, state.root);
}

export function startServer(options = {}) {
  const { server, state, auth, config } = createServer(options);

  server.listen(config.port, () => {
    console.log(`Curios server started`);
    console.log(`  Directory  : ${state.root}`);
    console.log(`  HTTP       : http://localhost:${config.port}`);
    if (!auth.state.password) {
      console.log(`  Auth       : no password set (first login will set it)`);
    }
    console.log(`  Ctrl+C to stop`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${config.port} is already in use.`);
      process.exit(1);
    }
    throw err;
  });

  return { server, state, auth, config };
}
