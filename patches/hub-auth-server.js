/* hub-auth-server.js — Auth Hub : register, login, me, logout
 *
 * Extension du système auth existant pour le CURIOS Project Hub.
 * Ajoute : register (email+password), login email-based, me, logout.
 * Le mot de passe est hashé avec PBKDF2 (Node.js crypto natif).
 *
 * Fichier à ajouter dans packages/server/src/hub-auth-server.js
 * et à importer dans index.js.
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const ITERATIONS = 100000;
const KEY_LENGTH = 64;
const DIGEST = "sha512";
const TOKEN_LENGTH = 32;
const TOKEN_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours

function hashPassword(password, salt) {
  const s = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, s, ITERATIONS, KEY_LENGTH, DIGEST).toString("hex");
  return { salt: s, hash: hash };
}

function verifyPassword(password, stored) {
  const result = hashPassword(password, stored.salt);
  return crypto.timingSafeEqual(Buffer.from(result.hash, "hex"), Buffer.from(stored.hash, "hex"));
}

export function createHubAuth(root) {
  const usersFile = path.join(root, "data", "hub-users.json");
  const sessionsFile = path.join(root, "data", "hub-sessions.json");

  const state = {
    users: [],      // [{ id, name, email, password: { salt, hash }, role, createdAt }]
    sessions: new Map(), // token → { userId, createdAt }
  };

  function load() {
    try {
      if (fs.existsSync(usersFile)) {
        state.users = JSON.parse(fs.readFileSync(usersFile, "utf8"));
      }
    } catch {}
    try {
      if (fs.existsSync(sessionsFile)) {
        const arr = JSON.parse(fs.readFileSync(sessionsFile, "utf8"));
        arr.forEach(function (s) { state.sessions.set(s.token, s); });
      }
    } catch {}
  }

  function saveUsers() {
    try {
      const dir = path.dirname(usersFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(usersFile, JSON.stringify(state.users, null, 2), "utf8");
    } catch {}
  }

  function saveSessions() {
    try {
      const dir = path.dirname(sessionsFile);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const arr = [];
      state.sessions.forEach(function (v, k) {
        arr.push({ token: k, userId: v.userId, createdAt: v.createdAt });
      });
      fs.writeFileSync(sessionsFile, JSON.stringify(arr, null, 2), "utf8");
    } catch {}
  }

  function generateToken() {
    return crypto.randomBytes(TOKEN_LENGTH).toString("hex");
  }

  function generateId() {
    return Date.now().toString(36) + crypto.randomBytes(4).toString("hex");
  }

  // --- Public API ---

  function register(name, email, password) {
    const existing = state.users.find(function (u) {
      return u.email.toLowerCase() === email.toLowerCase();
    });
    if (existing) return { error: "email-exists" };

    const pw = hashPassword(password);
    const user = {
      id: generateId(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: pw,
      role: state.users.length === 0 ? "ADMIN" : "PROJECT_MANAGER",
      createdAt: new Date().toISOString(),
    };
    state.users.push(user);
    saveUsers();

    const token = generateToken();
    state.sessions.set(token, { userId: user.id, createdAt: Date.now() });
    saveSessions();

    return {
      token: token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  function login(email, password) {
    const user = state.users.find(function (u) {
      return u.email.toLowerCase() === email.toLowerCase();
    });
    if (!user) return { error: "invalid-credentials" };
    if (!verifyPassword(password, user.password)) return { error: "invalid-credentials" };

    const token = generateToken();
    state.sessions.set(token, { userId: user.id, createdAt: Date.now() });
    saveSessions();

    return {
      token: token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    };
  }

  function me(token) {
    const session = state.sessions.get(token);
    if (!session) return { error: "unauthorized" };
    if (Date.now() - session.createdAt > TOKEN_EXPIRY_MS) {
      state.sessions.delete(token);
      saveSessions();
      return { error: "unauthorized" };
    }
    const user = state.users.find(function (u) { return u.id === session.userId; });
    if (!user) return { error: "unauthorized" };
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  }

  function logout(token) {
    state.sessions.delete(token);
    saveSessions();
  }

  function extractToken(req) {
    const auth = req.headers["authorization"];
    if (auth && auth.startsWith("Bearer ")) return auth.slice(7);
    return null;
  }

  function requireHubAuth(req, res) {
    const token = extractToken(req);
    if (!token) return null;
    const session = state.sessions.get(token);
    if (!session) return null;
    if (Date.now() - session.createdAt > TOKEN_EXPIRY_MS) {
      state.sessions.delete(token);
      return null;
    }
    const user = state.users.find(function (u) { return u.id === session.userId; });
    return user || null;
  }

  function cleanupSessions() {
    const now = Date.now();
    for (const [token, session] of state.sessions) {
      if (now - session.createdAt > TOKEN_EXPIRY_MS) {
        state.sessions.delete(token);
      }
    }
    saveSessions();
  }

  load();

  return {
    state: state,
    register: register,
    login: login,
    me: me,
    logout: logout,
    extractToken: extractToken,
    requireHubAuth: requireHubAuth,
    cleanupSessions: cleanupSessions,
  };
}
