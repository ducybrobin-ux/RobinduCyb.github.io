#!/usr/bin/env node
/* cli.js — Point d'entrée CLI pour Curi>s
 *
 * Usage :
 *   node tools/cli.mjs build [--target windows|linux|all]
 *   node tools/cli.mjs validate [--check]
 *   node tools/cli.mjs convert
 *   node tools/cli.mjs serve [--port 8080]
 */
import { execSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const commands = {
  build: {
    desc: "Génère les distributions (Windows/Linux/all)",
    usage: "node tools/cli.mjs build [--target windows|linux|all]",
    run: (args) => exec(`node tools/build.mjs ${args.join(" ")}`, ROOT),
  },
  validate: {
    desc: "Valide les parcours contre le schéma",
    usage: "node tools/cli.mjs validate [--check]",
    run: (args) =>
      exec(`node tools/validate-parcours.mjs ${args.join(" ")}`, ROOT),
  },
  convert: {
    desc: "Convertit les packs legacy en curios-parcours",
    usage: "node tools/cli.mjs convert",
    run: (args) => exec("node tools/convert-packs.mjs", ROOT),
  },
  serve: {
    desc: "Lance le serveur de développement",
    usage: "node tools/cli.mjs serve [--port 8080]",
    run: (args) => exec(`node packages/server/src/cli.js ${args.join(" ")}`, ROOT),
  },
  test: {
    desc: "Lance les tests unitaires",
    usage: "node tools/cli.mjs test [pattern]",
    run: (args) => {
      const pattern = args[0] || "tests/unit/*.test.mjs";
      exec(`node --test ${pattern}`, ROOT);
    },
  },
  editions: {
    desc: "Valide les éditions",
    usage: "node tools/cli.mjs editions",
    run: (args) => exec("node tools/build-editions.mjs --check", ROOT),
  },
  version: {
    desc: "Gestion de version (major/minor/patch/x.y.z)",
    usage: "node tools/cli.mjs version [major|minor|patch|x.y.z]",
    run: (args) => exec(`node tools/version.mjs ${args.join(" ")}`, ROOT),
  },
  help: {
    desc: "Affiche l'aide",
    usage: "node tools/cli.mjs help",
    run: () => printHelp(),
  },
};

function exec(cmd, cwd) {
  try {
    execSync(cmd, { cwd, stdio: "inherit" });
  } catch (err) {
    process.exit(err.status || 1);
  }
}

function printHelp() {
  console.log(`
Curi>s CLI — Outils de build et validation

Usage : node tools/cli.mjs <commande> [options]

Commandes :
`);

  for (const [name, cmd] of Object.entries(commands)) {
    console.log(`  ${name.padEnd(12)} ${cmd.desc}`);
  }

  console.log(`
Exemples :
  node tools/cli.mjs build --target windows
  node tools/cli.mjs validate --check
  node tools/cli.mjs serve --port 3000
  node tools/cli.mjs test game-engine
`);
}

// Parse command
const [command, ...args] = process.argv.slice(2);

if (!command || command === "help") {
  printHelp();
  process.exit(0);
}

if (!commands[command]) {
  console.error(`Commande inconnue : ${command}`);
  console.error("Utilisez 'node tools/cli.mjs help' pour voir les commandes disponibles.");
  process.exit(1);
}

commands[command].run(args);
