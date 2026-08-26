#!/usr/bin/env node
/* cli.js — Point d'entrée CLI pour le serveur Curios
 *
 * Usage :
 *   node packages/server/src/cli.js [--port 8080]
 */
import { startServer } from "./index.js";

const port = parseInt(
  process.argv.find((_, i, a) => a[i - 1] === "--port") || "8080",
  10
);
const httpsPort = parseInt(
  process.argv.find((_, i, a) => a[i - 1] === "--https-port") || "8443",
  10
);

startServer({ port, httpsPort });
