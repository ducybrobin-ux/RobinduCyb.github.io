/* routes/report.js — Endpoint /api/report
 *
 * Rapport complet de l'état du serveur (texte + HTML).
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { sendJson, sendError } from "../http.js";
import { getLocalIPv4 } from "./config.js";

export function handleReport(method, req, res, state, config) {
  if (method !== "GET") return sendError(res, 405, "method-not-allowed");

  const lines = [];
  const now = new Date();

  lines.push("==================================================");
  lines.push("CURIOS — RAPPORT COMPLET");
  lines.push(`Généré le : ${now.toLocaleDateString("fr")} ${now.toLocaleTimeString("fr")}`);
  lines.push("");

  // Accès
  const modeTxt = state.serverMode.internet ? "Internet (tunnel cloudflared)" : "Local";
  const ip = getLocalIPv4();
  const port = config.httpsPort || 8443;
  const lanUrl = `https://${ip}:${port}`;

  lines.push("=== ACCÈS AU SERVEUR ===");
  lines.push(`Mode : ${modeTxt}`);
  lines.push(`URL LAN : ${lanUrl}`);
  if (state.tunnelUrl) lines.push(`URL tunnel : ${state.tunnelUrl}`);
  lines.push("");

  // Validations
  lines.push("=== BALISES VALIDÉES PAR ÉQUIPE ===");
  const valKeys = Object.keys(state.validations).sort();
  if (valKeys.length > 0) {
    for (const k of valKeys) {
      const v = state.validations[k];
      lines.push(`  ${k} : ${v.length} balise(s) — ${v.join(", ")}`);
    }
  } else {
    lines.push("  Aucune validation enregistrée.");
  }
  lines.push("");

  // Finishes
  lines.push("=== ÉQUIPES TERMINÉES ===");
  if (state.finishes.length > 0) {
    const sorted = [...state.finishes].sort(
      (a, b) => (b.stars || 0) - (a.stars || 0) || (a.seconds || 0) - (b.seconds || 0)
    );
    sorted.forEach((f, i) => {
      const msg = f.message ? `\n      Message : ${f.message}` : "";
      lines.push(
        `  ${i + 1}. ${f.team} — ${f.stars || 0} ⭐ — ${f.seconds || 0} s — ${f.balises || 0} balises${msg}`
      );
    });
  } else {
    lines.push("  Aucune équipe terminée.");
  }
  lines.push("");

  // Urgences
  lines.push("=== URGENCES / MESSAGES OUVERTS ===");
  const openUrg = state.urgencies.filter((u) => u.status === "open");
  if (openUrg.length > 0) {
    for (const u of openUrg) {
      const coords = u.lat && u.lng ? ` — ${u.lat}, ${u.lng}` : "";
      lines.push(`  [${u.at}] ${u.team} — ${u.type}${coords}`);
      if (u.message) lines.push(`      ${u.message}`);
    }
  } else {
    lines.push("  Aucune urgence ouverte.");
  }
  lines.push("");

  // Positions
  lines.push("=== POSITIONS DES ÉQUIPES (3 dernières minutes) ===");
  const nowMs = Date.now();
  const fresh = state.positions.filter(
    (p) => p.at && nowMs - p.at.getTime() < 3 * 60 * 1000
  );
  if (fresh.length > 0) {
    for (const p of fresh) {
      lines.push(
        `  ${p.at.toTimeString().slice(0, 8)} — ${p.team} — ${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`
      );
    }
  } else {
    lines.push("  Aucune position récente.");
  }
  lines.push("");

  // Feedback
  lines.push("=== RETOURS TESTEURS ===");
  lines.push(`  Questionnaires reçus : ${state.feedback.length}`);
  lines.push("");

  // Éditeur
  const edFile = path.join(state.root, "admin-data.json");
  let ad = null;
  if (fs.existsSync(edFile)) {
    try { ad = JSON.parse(fs.readFileSync(edFile, "utf8")); } catch {}
  }
  let nSite = 0, nBal = 0, nBirds = 0, nQuiz = 0, nRemB = 0, nRemBird = 0;
  if (ad) {
    if (ad.site) nSite = Object.keys(ad.site).length;
    if (ad.balises) nBal = Object.keys(ad.balises).length;
    if (ad.birds) nBirds = Object.keys(ad.birds).length;
    if (ad.quiz) nQuiz = Object.keys(ad.quiz).length;
    if (ad.removedBalises) nRemB = ad.removedBalises.length;
    if (ad.removedBirds) nRemBird = ad.removedBirds.length;
  }
  lines.push("=== CONTENU ÉDITÉ (admin-data.json) ===");
  lines.push(
    `  Site : ${nSite} · Balises modifiées/ajoutées : ${nBal} · Oiseaux ajoutés : ${nBirds} · Quiz modifiés : ${nQuiz} · Balises supprimées : ${nRemB} · Oiseaux supprimés : ${nRemBird}`
  );
  lines.push("");

  // Système
  const memMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1);
  lines.push("=== SYSTÈME ===");
  lines.push(`  Mémoire serveur : ${memMB} Mo`);
  lines.push(`  Heure UTC : ${now.toISOString()}`);
  lines.push("==================================================");

  const text = lines.join("\r\n");
  const html = `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8"><title>Curios — Rapport</title></head><body><pre>${escapeHtml(text)}</pre></body></html>`;
  const subject = `Curios — Rapport complet ${now.toLocaleDateString("fr")} ${now.toLocaleTimeString("fr")}`;

  return sendJson(res, 200, { ok: true, subject, text, html });
}

function escapeHtml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
