// Re-copies the logic layer from the Omarchy plugin repo, which stays the
// single source of truth for scoring and the question bank. Run this after
// changing either one there, then commit the result here.
//
//   node scripts/sync-core.mjs [path-to-estimation-gym-omarchy]

import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, "..");
const pluginRoot = resolve(appRoot, process.argv[2] || "../estimation-gym-omarchy");

const files = [
  ["Model.js", "core/Model.js"],
  ["Model.test.js", "core/Model.test.js"],
  ["content/questions.js", "core/questions.js"]
];

// Vendored verbatim apart from one path: the bank sits under content/ in the
// plugin repo and flat in core/ here. Worth carrying across rather than
// leaving behind, because it holds the append-only check that keeps the
// daily schedule from being re-dealt.
const rewritten = [
  ["questions.test.js", "core/questions.test.js",
    (t) => t.replace('require("./content/questions.js")', 'require("./questions.js")')]
];

if (!existsSync(pluginRoot)) {
  console.error(`Plugin repo not found at ${pluginRoot}`);
  console.error("Pass its path: node scripts/sync-core.mjs ../estimation-gym-omarchy");
  process.exit(1);
}

for (const [from, to] of files) {
  const src = resolve(pluginRoot, from);
  if (!existsSync(src)) {
    console.error(`Missing in plugin repo: ${from}`);
    process.exit(1);
  }
  copyFileSync(src, resolve(appRoot, to));
  console.log(`synced ${from} -> ${to}`);
}

for (const [from, to, transform] of rewritten) {
  const src = resolve(pluginRoot, from);
  if (!existsSync(src)) {
    console.error(`Missing in plugin repo: ${from}`);
    process.exit(1);
  }
  writeFileSync(resolve(appRoot, to), transform(readFileSync(src, "utf8")), "utf8");
  console.log(`synced ${from} -> ${to}`);
}

const bank = readFileSync(resolve(appRoot, "core/questions.js"), "utf8");
const count = (bank.match(/"id":/g) || []).length;
console.log(`question bank now holds ${count} entries`);

// The whole point of syncing is that the app keeps behaving like the widget,
// so refuse to leave the tree in a state where that is unverified.
execFileSync(process.execPath, ["core/Model.test.js"], { cwd: appRoot, stdio: "inherit" });
execFileSync(process.execPath, ["core/questions.test.js"], { cwd: appRoot, stdio: "inherit" });
execFileSync(process.execPath, ["presenter.test.js"], { cwd: appRoot, stdio: "inherit" });
execFileSync(process.execPath, ["storage.test.js"], { cwd: appRoot, stdio: "inherit" });
