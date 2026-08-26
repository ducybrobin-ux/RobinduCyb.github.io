/* routes/kml.js — Endpoint /api/kml
 *
 * Proxy CORS pour import Google My Maps KML.
 */
import https from "node:https";
import { sendJson, sendError } from "../http.js";

export function handleKml(method, req, res) {
  if (method !== "GET") return sendError(res, 405, "method-not-allowed");

  const url = new URL(req.url, "http://localhost");
  const u = url.searchParams.get("u");

  if (!u) return sendError(res, 400, "missing-url");

  let parsed;
  try {
    parsed = new URL(u);
  } catch {
    return sendError(res, 400, "invalid-url");
  }

  if (
    parsed.hostname.toLowerCase() !== "www.google.com" ||
    parsed.pathname.toLowerCase() !== "/maps/d/kml"
  ) {
    return sendError(res, 400, "url-not-allowed");
  }

  https
    .get(u, { timeout: 15000 }, (upstream) => {
      const chunks = [];
      upstream.on("data", (c) => chunks.push(c));
      upstream.on("end", () => {
        const body = Buffer.concat(chunks).toString("utf8");
        res.writeHead(200, {
          "Content-Type": "text/xml; charset=utf-8",
          "Cache-Control": "no-cache",
        });
        res.end(body);
      });
      upstream.on("error", () => {
        sendError(res, 502, "kml-fetch-failed");
      });
    })
    .on("error", () => {
      sendError(res, 502, "kml-fetch-failed");
    });
}
