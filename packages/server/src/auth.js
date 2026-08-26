/* auth.js — Authentification session organisateur
 *
 * Modèle simple : mot de passe → token aléatoire.
 * Les participants n'ont pas besoin d'auth.
 *
 * Endpoints protégés (organisateur uniquement) :
 *   /api/editor, /api/editor/images, /api/editor/image, /api/editor/reset
 *   /api/qr/export
 *   /api/report
 *   /api/validations/remove, /api/validations/team
 *   /api/server-mode POST
 *   /api/wifi POST, /api/wifi/detect
 *   /api/map POST
 *   /api/board POST (message, challenge, clear, logout)
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const TOKEN_LENGTH = 32;
const TOKEN_EXPIRY_MS = 24 * 60 * 60 * 1000; // 24h

export function createAuth(root) {
  const configFile = path.join(root, "data", "auth.json");
  const state = {
    password: null,
    sessions: new Map(), // token → { createdAt, ip }
  };

  // Charger le mot de passe depuis la config
  function loadPassword() {
    try {
      if (fs.existsSync(configFile)) {
        const data = JSON.parse(fs.readFileSync(configFile, "utf8"));
        state.password = data.password || null;
      }
    } catch {}
  }

  // Sauvegarder la config
  function savePassword(password) {
    state.password = password;
    const dir = path.dirname(configFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(configFile, JSON.stringify({ password }), "utf8");
  }

  // Générer un token aléatoire
  function generateToken() {
    return crypto.randomBytes(TOKEN_LENGTH).toString("hex");
  }

  // Vérifier un mot de passe
  function checkPassword(password) {
    if (!state.password) return false;
    const a = Buffer.from(password);
    const b = Buffer.from(state.password);
    if (a.length !== b.length) return false;
    return crypto.timingSafeEqual(a, b);
  }

  // Créer une session
  function createSession(ip) {
    const token = generateToken();
    state.sessions.set(token, {
      createdAt: Date.now(),
      ip: ip || "unknown",
    });
    return token;
  }

  // Valider un token
  function validateToken(token) {
    if (!token) return false;
    const session = state.sessions.get(token);
    if (!session) return false;

    // Vérifier l'expiration
    if (Date.now() - session.createdAt > TOKEN_EXPIRY_MS) {
      state.sessions.delete(token);
      return false;
    }

    return true;
  }

  // Supprimer une session (logout)
  function destroySession(token) {
    state.sessions.delete(token);
  }

  // Nettoyer les sessions expirées
  function cleanupSessions() {
    const now = Date.now();
    for (const [token, session] of state.sessions) {
      if (now - session.createdAt > TOKEN_EXPIRY_MS) {
        state.sessions.delete(token);
      }
    }
  }

  // Extraire le token de la requête
  function extractToken(req) {
    // Header Authorization: Bearer <token>
    const auth = req.headers["authorization"];
    if (auth && auth.startsWith("Bearer ")) {
      return auth.slice(7);
    }
    return null;
  }

  // Middleware de vérification
  function requireAuth(req, res) {
    const token = extractToken(req);
    if (!validateToken(token)) {
      return false;
    }
    return true;
  }

  loadPassword();

  return {
    state,
    loadPassword,
    savePassword,
    checkPassword,
    createSession,
    validateToken,
    destroySession,
    cleanupSessions,
    extractToken,
    requireAuth,
  };
}
