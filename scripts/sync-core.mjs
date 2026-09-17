// Pushes the logic layer from THIS repo out to the Omarchy plugin.
//
//   node scripts/sync-core.mjs [path-to-estimation-gym-omarchy]
//
// The direction used to be the other way round: the plugin was the source of
// truth and this script pulled from it. That stopped being true before it was
// written down. Commit 8d1e3f0 ("Pin the reserve following questions round the
// wrap") added a fifty-line test to core/Model.test.js *here*, and the plugin
// never received it - so the app was already ahead of the repo that was
// supposedly authoritative, and nothing noticed.
//
// The app is now the source of truth. `core/` is edited here and the widget
// consumes it. That matches where the work actually happens, and it means a
// change to scoring or the bank no longer has to be made in another repository
// first and copied back.
//
// What has NOT changed: the two surfaces must still describe a result in the
// same words, because the whole point of sharing Model.js is that a score
// means the same thing in a shell bar as it does in the browser. This script
// therefore refuses to push anything the app's own tests do not pass, and
// refuses to leave the widget in a state its tests do not pass either.

import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, "..");
const pluginRoot = resolve(appRoot, process.argv[2] || "../estimation-gym-omarchy");

// app path -> plugin path. The bank sits flat in core/ here and under content/
// in the plugin.
const files = [
  ["core/Model.js", "Model.js"],
  ["core/Model.test.js", "Model.test.js"],
  ["core/questions.js", "content/questions.js"]
];

// One file needs its require path rewritten on the way out, mirroring the
// rewrite that used to happen on the way in.
const rewritten = [
  ["core/questions.test.js", "questions.test.js",
    (t) => t.replace('require("./questions.js")', 'require("./content/questions.js")')]
];

if (!existsSync(pluginRoot)) {
  console.error(`Plugin repo not found at ${pluginRoot}`);
  console.error("Pass its path: node scripts/sync-core.mjs ../estimation-gym-omarchy");
  process.exit(1);
}

console.log(`source: ${appRoot}`);
console.log(`target: ${pluginRoot}`);
console.log("direction: app core/  ->  plugin\n");

// --- refuse to push over uncommitted work -----------------------------------
//
// This script reversed direction, so anyone with the old habit will run it
// expecting a pull and get a push. Overwriting uncommitted widget edits would
// be a silent, unrecoverable way to lose work, and the habit is the exact
// reason to guard it rather than trust the command name.
try {
  const dirty = execFileSync("git", ["status", "--porcelain"], {
    cwd: pluginRoot, encoding: "utf8"
  }).trim();
  if (dirty) {
    console.error("The plugin repo has uncommitted changes:\n");
    console.error(dirty.split("\n").map((l) => "  " + l).join("\n"));
    console.error("\nThis script overwrites those files. Commit or stash them first.");
    console.error("If you meant to bring changes the other way, copy them here by hand");
    console.error("and commit them in this repo - the app is the source of truth now.");
    process.exit(1);
  }
} catch {
  console.error("Could not read git status in the plugin repo - refusing to overwrite it blind.");
  process.exit(1);
}

// --- never propagate a source that does not pass ----------------------------
console.log("checking the source before propagating it...");
for (const t of ["core/Model.test.js", "core/questions.test.js", "presenter.test.js", "storage.test.js"]) {
  execFileSync(process.execPath, [t], { cwd: appRoot, stdio: "inherit" });
}

// --- copy --------------------------------------------------------------------
let changed = 0;

for (const [from, to] of files) {
  const src = resolve(appRoot, from);
  if (!existsSync(src)) {
    console.error(`Missing in the app repo: ${from}`);
    process.exit(1);
  }
  const dest = resolve(pluginRoot, to);
  const before = existsSync(dest) ? readFileSync(dest, "utf8") : null;
  copyFileSync(src, dest);
  const same = before !== null && before === readFileSync(dest, "utf8");
  if (!same) changed++;
  console.log(`${same ? "unchanged" : "synced   "} ${from} -> ${to}`);
}

for (const [from, to, transform] of rewritten) {
  const src = resolve(appRoot, from);
  if (!existsSync(src)) {
    console.error(`Missing in the app repo: ${from}`);
    process.exit(1);
  }
  const dest = resolve(pluginRoot, to);
  const before = existsSync(dest) ? readFileSync(dest, "utf8") : null;
  const next = transform(readFileSync(src, "utf8"));
  writeFileSync(dest, next, "utf8");
  if (before !== next) changed++;
  console.log(`${before === next ? "unchanged" : "synced   "} ${from} -> ${to}`);
}

const bank = readFileSync(resolve(appRoot, "core/questions.js"), "utf8");
console.log(`\nquestion bank holds ${(bank.match(/"id":/g) || []).length} entries`);
console.log(`${changed} file${changed === 1 ? "" : "s"} changed in the plugin repo`);

// --- and make sure the widget still passes with them -------------------------
//
// The app's tests passing says the logic is sound; the plugin's tests passing
// says it is sound *in the plugin's layout*, which is the part a path rewrite
// can break without anything here noticing.
if (changed) {
  console.log("\nchecking the plugin with the new files...");
  for (const t of ["Model.test.js", "questions.test.js"]) {
    execFileSync(process.execPath, [t], { cwd: pluginRoot, stdio: "inherit" });
  }
  console.log("\nPlugin updated and passing. Commit it in that repo.");
} else {
  console.log("\nNothing to do - the plugin was already in step.");
}
