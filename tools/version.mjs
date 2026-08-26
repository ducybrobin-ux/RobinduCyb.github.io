#!/usr/bin/env node
/* version.mjs — Gestion de version pour Curi>s
 *
 * Usage :
 *   node tools/version.mjs major   (1.0.0 → 2.0.0)
 *   node tools/version.mjs minor   (1.0.0 → 1.1.0)
 *   node tools/version.mjs patch   (1.0.0 → 1.0.1)
 *   node tools/version.mjs 1.2.3   (version spécifique)
 */
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const CHANGELOG_PATH = join(ROOT, "CHANGELOG.md");

async function getCurrentVersion() {
  const content = await readFile(CHANGELOG_PATH, "utf8");
  const match = content.match(/## \[(\d+\.\d+\.\d+)\]/);
  if (!match) return "0.0.0";
  return match[1];
}

function bump(version, type) {
  const [major, minor, patch] = version.split(".").map(Number);
  switch (type) {
    case "major":
      return `${major + 1}.0.0`;
    case "minor":
      return `${major}.${minor + 1}.0`;
    case "patch":
      return `${major}.${minor}.${patch + 1}`;
    default:
      return type; // Specific version
  }
}

async function updateChangelog(version, changes) {
  const content = await readFile(CHANGELOG_PATH, "utf8");
  const today = new Date().toISOString().split("T")[0];
  
  const newEntry = `## [${version}] - ${today}

${changes || "Release automatisée"}

`;
  
  // Insert after header
  const lines = content.split("\n");
  const headerEnd = lines.findIndex((l) => l.startsWith("## ["));
  if (headerEnd === -1) {
    // No existing version, add after first blank line
    const insertAt = lines.findIndex((l) => l === "") + 1;
    lines.splice(insertAt, 0, "", newEntry);
  } else {
    lines.splice(headerEnd, 0, newEntry);
  }
  
  await writeFile(CHANGELOG_PATH, lines.join("\n"));
}

async function commitAndTag(version) {
  try {
    execSync(`git add CHANGELOG.md`, { cwd: ROOT });
    execSync(`git commit -m "release: v${version}"`, { cwd: ROOT });
    execSync(`git tag v${version}`, { cwd: ROOT });
    console.log(`Tag v${version} créé`);
    console.log("Pour publier : git push origin main --tags");
  } catch (err) {
    console.error("Erreur git :", err.message);
  }
}

async function main() {
  const type = process.argv[2];
  
  if (!type || type === "help") {
    console.log(`
Curi>s Version Manager

Usage :
  node tools/version.mjs major   (1.0.0 → 2.0.0)
  node tools/version.mjs minor   (1.0.0 → 1.1.0)
  node tools/version.mjs patch   (1.0.0 → 1.0.1)
  node tools/version.mjs 1.2.3   (version spécifique)
`);
    process.exit(0);
  }
  
  const current = await getCurrentVersion();
  const next = bump(current, type);
  
  console.log(`Version actuelle : ${current}`);
  console.log(`Nouvelle version : ${next}`);
  
  await updateChangelog(next);
  await commitAndTag(next);
  
  console.log(`
Release v${next} préparée !

Prochaines étapes :
1. Vérifiez le CHANGELOG.md
2. Poussez : git push origin main --tags
3. Le workflow GitHub Actions créera la release automatiquement
`);
}

main().catch(console.error);
