// Runs every smoke harness in this directory.
//
//   node smoke/run.mjs
//
// These drive the real app.js against a minimal DOM shim built from the ids in
// index.html, so they cover the wiring that the other suites cannot: event
// handlers, what gets shown and hidden, what is written to storage, and the
// exact shape of every request that leaves the device.
//
// Model.test.js, presenter.test.js and the rest test pure functions. Nothing
// else in the project tests app.js, which is where most of the behaviour lives
// and where most of the bugs have been.
//
// Each file is run in its own process. They share a working directory and one
// of them simulates a clock change, so keeping them isolated stops any of that
// leaking sideways. A harness passes by exiting zero; it fails by throwing,
// and the message is printed as-is.

import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

const harnesses = readdirSync(here)
  .filter((f) => f.endsWith(".js") && f !== "run.mjs")
  .sort();

if (!harnesses.length) {
  console.error("no smoke harnesses found in " + here);
  process.exit(1);
}

const failures = [];
const started = Date.now();

for (const file of harnesses) {
  const name = file.replace(/\.js$/, "");
  const run = spawnSync(process.execPath, [join(here, file)], {
    encoding: "utf8",
    cwd: join(here, "..")
  });

  if (run.status === 0) {
    console.log("  ok    " + name);
    continue;
  }

  failures.push(name);
  console.log("  FAIL  " + name);
  // The harnesses throw with an explanatory message; print it rather than a
  // stack, then the tail of stdout so it is clear how far it got.
  const err = (run.stderr || "").split("\n").filter(Boolean);
  const msg = err.find((l) => /Error:/.test(l)) || err[0] || "(no error output)";
  console.log("        " + msg.trim());
  const out = (run.stdout || "").split("\n").filter(Boolean).slice(-2);
  for (const line of out) console.log("        last: " + line.trim());
}

const secs = ((Date.now() - started) / 1000).toFixed(1);

if (failures.length) {
  console.error(
    `\n${failures.length} of ${harnesses.length} smoke harnesses failed: ` +
    failures.join(", ")
  );
  process.exit(1);
}

console.log(`\nAll ${harnesses.length} smoke harnesses passed (${secs}s).`);
