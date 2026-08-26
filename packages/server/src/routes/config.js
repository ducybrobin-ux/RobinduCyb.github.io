/* routes/config.js — Endpoints /api/wifi, /api/map, /api/server-mode, /api/ip
 *
 * Configuration du serveur et du site.
 */
import os from "node:os";
import { sendJson, sendOk, sendError, readBody, parseJson } from "../http.js";

export function getLocalIPv4() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (
        iface.family === "IPv4" &&
        !iface.internal &&
        !iface.address.startsWith("169.254")
      ) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
}

export function handleIp(method, req, res, state, config) {
  if (method !== "GET") return sendError(res, 405, "method-not-allowed");

  const ip = getLocalIPv4();
  const port = config.httpsPort || 8443;
  const lanUrl = `https://${ip}:${port}`;
  const tunnelUp = state.tunnelStatus === "on" && state.tunnelUrl;
  const primary =
    state.serverMode.internet && tunnelUp ? state.tunnelUrl : lanUrl;

  return sendJson(res, 200, {
    ip,
    port,
    url: primary,
    lanUrl,
    tunnelUrl: state.tunnelUrl,
    internet: state.serverMode.internet,
  });
}

export function handleServerMode(method, req, res, state, config) {
  if (method === "GET") {
    return sendJson(res, 200, buildServerModePayload(state, config));
  }

  if (method === "POST") {
    return handleServerModePost(req, res, state, config);
  }

  sendError(res, 405, "method-not-allowed");
}

async function handleServerModePost(req, res, state, config) {
  const body = await readBody(req);
  const payload = parseJson(body);
  if (!payload) return sendError(res, 400, "invalid-payload");

  let newLocal = Boolean(state.serverMode.local);
  let newInternet = Boolean(state.serverMode.internet);

  if (payload.local != null) newLocal = Boolean(payload.local);
  if (payload.internet != null) newInternet = Boolean(payload.internet);

  if (!newLocal && !newInternet) {
    return sendError(res, 400, "no-mode");
  }

  state.serverMode.local = newLocal;
  state.serverMode.internet = newInternet;
  state.saveServerMode();

  return sendJson(res, 200, buildServerModePayload(state, config));
}

function buildServerModePayload(state, config) {
  const ip = getLocalIPv4();
  const port = config.httpsPort || 8443;
  const lanUrl = `https://${ip}:${port}`;
  const tunnelUp = state.tunnelStatus === "on" && state.tunnelUrl;
  const primary =
    state.serverMode.internet && tunnelUp ? state.tunnelUrl : lanUrl;

  return {
    local: Boolean(state.serverMode.local),
    internet: Boolean(state.serverMode.internet),
    tunnelStatus: state.tunnelStatus,
    tunnelUrl: state.tunnelUrl,
    tunnelError: state.tunnelError,
    lanUrl,
    url: primary,
  };
}

export function handleWifi(method, req, res, state) {
  if (method === "GET") {
    return sendJson(res, 200, {
      ssid: state.wifi.ssid,
      password: state.wifi.password,
      security: state.wifi.security,
      hasWifi: state.wifi.ssid !== "",
    });
  }

  if (method === "POST") {
    return handleWifiPost(req, res, state);
  }

  sendError(res, 405, "method-not-allowed");
}

async function handleWifiPost(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);
  if (!payload) return sendError(res, 400, "invalid-payload");

  let sec = String(payload.security || "WPA");
  if (!["WPA", "WEP", "nopass"].includes(sec)) sec = "WPA";

  state.wifi.ssid = String(payload.ssid || "");
  state.wifi.password = String(payload.password || "");
  state.wifi.security = sec;
  state.saveWifi();

  return sendOk(res, {
    ssid: state.wifi.ssid,
    security: state.wifi.security,
    hasWifi: state.wifi.ssid !== "",
  });
}

export function handleWifiDetect(method, req, res) {
  if (method !== "GET") return sendError(res, 405, "method-not-allowed");

  // Détection Wi-Fi non disponible sur Node.js (nécessite netsh sur Windows)
  return sendOk(res, { ssid: "", signal: "", detected: false });
}

export function handleMap(method, req, res, state) {
  if (method === "GET") {
    return sendJson(res, 200, {
      url: state.mapUrl,
      hasMap: state.mapUrl !== "",
    });
  }

  if (method === "POST") {
    return handleMapPost(req, res, state);
  }

  sendError(res, 405, "method-not-allowed");
}

async function handleMapPost(req, res, state) {
  const body = await readBody(req);
  const payload = parseJson(body);
  if (!payload) return sendError(res, 400, "invalid-payload");

  state.mapUrl = String(payload.url || "");
  state.saveMap();

  return sendOk(res, {
    url: state.mapUrl,
    hasMap: state.mapUrl !== "",
  });
}
