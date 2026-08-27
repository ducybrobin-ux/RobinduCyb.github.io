/* hub.test.mjs — Hub auth + CRUD routes tests */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import http from "node:http";
import { createServer } from "../../packages/server/src/index.js";

function request(server, method, url, { token, body } = {}) {
  const addr = server.address();
  const headers = {};
  if (token) headers.Authorization = "Bearer " + token;
  if (body) headers["Content-Type"] = "application/json";
  return new Promise((resolve, reject) => {
    const req = http.request(
      { host: "127.0.0.1", port: addr.port, path: url, method, headers },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          let json = {};
          try { json = JSON.parse(data); } catch {}
          resolve({ status: res.statusCode, json });
        });
      }
    );
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function setup() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "hub-test-"));
  const created = createServer({ root: dir, port: 0 });
  const server = created.server;
  server.listen(0);
  return { server, dir };
}

test("Hub auth: register creates admin + login works", async () => {
  const { server } = setup();
  try {
    // First user = ADMIN
    const reg = await request(server, "POST", "/api/hub/auth/register", {
      body: { name: "Alice", email: "alice@test.fr", password: "secret123" },
    });
    assert.equal(reg.status, 200);
    assert.equal(reg.json.user.role, "ADMIN");
    assert.ok(reg.json.token);

    // Duplicate email
    const dup = await request(server, "POST", "/api/hub/auth/register", {
      body: { name: "Alice2", email: "alice@test.fr", password: "secret123" },
    });
    assert.equal(dup.status, 409);

    // Login
    const login = await request(server, "POST", "/api/hub/auth/login", {
      body: { email: "alice@test.fr", password: "secret123" },
    });
    assert.equal(login.status, 200);
    assert.ok(login.json.token);

    // Wrong password
    const bad = await request(server, "POST", "/api/hub/auth/login", {
      body: { email: "alice@test.fr", password: "wrong" },
    });
    assert.equal(bad.status, 401);

    // Me
    const me = await request(server, "GET", "/api/hub/auth/me", {
      token: login.json.token,
    });
    assert.equal(me.status, 200);
    assert.equal(me.json.user.email, "alice@test.fr");

    // Me without token
    const meNo = await request(server, "GET", "/api/hub/auth/me");
    assert.equal(meNo.status, 401);
  } finally {
    server.close();
  }
});

test("Hub CRUD: projets create/list/update/delete", async () => {
  const { server } = setup();
  try {
    const reg = await request(server, "POST", "/api/hub/auth/register", {
      body: { name: "Admin", email: "a@test.fr", password: "secret123" },
    });
    const token = reg.json.token;

    // No auth
    const noAuth = await request(server, "GET", "/api/hub/projets");
    assert.equal(noAuth.status, 401);

    // Create
    const create = await request(server, "POST", "/api/hub/projets", {
      token, body: { name: "Projet A" },
    });
    assert.equal(create.status, 200);
    const id = create.json.item.id;
    assert.ok(id);

    // List
    const list = await request(server, "GET", "/api/hub/projets", { token });
    assert.equal(list.status, 200);
    assert.equal(list.json.items.length, 1);
    assert.equal(list.json.items[0].name, "Projet A");

    // Get
    const get = await request(server, "GET", "/api/hub/projets/" + id, { token });
    assert.equal(get.status, 200);
    assert.equal(get.json.item.name, "Projet A");

    // Update
    const upd = await request(server, "PUT", "/api/hub/projets/" + id, {
      token, body: { name: "Projet B", status: "active" },
    });
    assert.equal(upd.status, 200);
    assert.equal(upd.json.item.name, "Projet B");
    assert.equal(upd.json.item.status, "active");

    // Delete
    const del = await request(server, "DELETE", "/api/hub/projets/" + id, { token });
    assert.equal(del.status, 200);
    const after = await request(server, "GET", "/api/hub/projets", { token });
    assert.equal(after.json.items.length, 0);
  } finally {
    server.close();
  }
});

test("Hub CRUD: non-admin cannot write", async () => {
  const { server } = setup();
  try {
    // First user admin
    await request(server, "POST", "/api/hub/auth/register", {
      body: { name: "Admin", email: "admin@test.fr", password: "secret123" },
    });
    // Second user = CLIENT
    const reg2 = await request(server, "POST", "/api/hub/auth/register", {
      body: { name: "Client", email: "client@test.fr", password: "secret123" },
    });
    const token = reg2.json.token;
    assert.equal(reg2.json.user.role, "CLIENT");

    // Client cannot create
    const create = await request(server, "POST", "/api/hub/packs", {
      token, body: { name: "Pack X" },
    });
    assert.equal(create.status, 403);

    // Client can read
    const list = await request(server, "GET", "/api/hub/packs", { token });
    assert.equal(list.status, 200);
  } finally {
    server.close();
  }
});

test("Hub CRUD: sessions/clients/materiel/planning/commercial", async () => {
  const { server } = setup();
  try {
    const reg = await request(server, "POST", "/api/hub/auth/register", {
      body: { name: "Admin", email: "a@test.fr", password: "secret123" },
    });
    const token = reg.json.token;

    // Clients
    const client = await request(server, "POST", "/api/hub/clients", {
      token, body: { name: "École Jules Ferry" },
    });
    assert.equal(client.status, 200);

    // Materiel
    const mat = await request(server, "POST", "/api/hub/materiel", {
      token, body: { name: "Kit balises x6", quantity: 6 },
    });
    assert.equal(mat.status, 200);

    // Sessions
    const sess = await request(server, "POST", "/api/hub/sessions-data", {
      token, body: { name: "Session CM2", status: "active", teamCount: 4 },
    });
    assert.equal(sess.status, 200);

    // Planning
    const ev = await request(server, "POST", "/api/hub/planning", {
      token, body: { name: "Sortie parc", date: "2026-09-15" },
    });
    assert.equal(ev.status, 200);

    // Commercial
    const dev = await request(server, "POST", "/api/hub/commercial", {
      token, body: { name: "Devis école", amount: 1200 },
    });
    assert.equal(dev.status, 200);

    // Analytics aggregates
    const ana = await request(server, "GET", "/api/hub/analytics", { token });
    assert.equal(ana.status, 200);
    assert.equal(ana.json.totals.clients, 1);
    assert.equal(ana.json.totals.materiel, 1);
    assert.equal(ana.json.totals.sessions, 1);
    assert.equal(ana.json.totals.devis, 1);

    // Analytics no auth
    const anaNo = await request(server, "GET", "/api/hub/analytics");
    assert.equal(anaNo.status, 401);
  } finally {
    server.close();
  }
});
