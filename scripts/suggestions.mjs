// Reviews questions people have suggested from inside the app.
//
//   node scripts/suggestions.mjs list            # everything still pending
//   node scripts/suggestions.mjs show <id>
//   node scripts/suggestions.mjs accept <id>     # prints the bank entry to append
//   node scripts/suggestions.mjs reject <id>
//
// Deliberately a local script rather than an admin page on the Worker. A
// hosted review screen would mean another public endpoint holding another
// secret, guarding data that is only ever read by one person - this reaches
// the same rows through wrangler, which is already authenticated as you.
//
// Accepting does NOT publish anything. It marks the row and hands back a bank
// entry to check and append by hand. The answer in that entry is the
// submitter's claim and nothing more: verify it against the source before it
// goes anywhere near the bank, because a wrong answer marks a correct guess as
// wrong and quietly discredits the scoring.

import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workerDir = resolve(dirname(fileURLToPath(import.meta.url)), "..", "worker");
const DB = "estimation-gym";

// Ids are UUIDs this app generated. Anything else is refused rather than
// interpolated into SQL.
const ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// wrangler is reached through npx, which on Windows is a .cmd - and Node
// refuses to execFile a .cmd without a shell. Through a shell, arguments are
// not quoted for us, so the SQL is quoted here.
//
// --file is not an alternative: it runs an import and reports how many
// statements ran, not the rows they returned.
//
// Every query below is written in this file and the only value ever
// interpolated is a UUID that has already been matched against ID, so the
// quoting has no untrusted input to get wrong. The assertion keeps it that way
// if someone adds a query later.
function query(sql) {
  if (sql.includes(String.fromCharCode(34))) {
    throw new Error("a query must not contain a double quote - it is the shell quoting");
  }
  const out = execFileSync(
    "npx",
    ["--yes", "wrangler", "d1", "execute", DB, "--remote", "--command", `"${sql}"`, "--json"],
    {
      cwd: workerDir,
      encoding: "utf8",
      shell: true,
      maxBuffer: 32 * 1024 * 1024,
      env: { ...process.env, NO_COLOR: "1", FORCE_COLOR: "0" }
    }
  );
  // wrangler prints a progress banner before the JSON. Colour is switched off
  // above because an ANSI escape contains a "[" of its own, indistinguishable
  // from the start of the payload; what is wanted is the first "[" that
  // begins a line.
  const start = out.search(/^\[/m);
  if (start < 0) throw new Error("no JSON in wrangler output:\n" + out.slice(-400));
  return JSON.parse(out.slice(start))[0]?.results ?? [];
}

// Rows are text written by strangers. Control characters are already refused
// at the endpoint, but this is what actually prints them to a terminal, and a
// terminal interprets escape sequences - so they are stripped here too.
function safe(value) {
  return String(value ?? "")
    .split("")
    .filter((ch) => {
      const c = ch.codePointAt(0);
      return c >= 0x20 && c !== 0x7f;
    })
    .join("");
}

function kebab(prompt) {
  return safe(prompt)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .split("-")
    .filter((w) => !["how", "many", "much", "are", "is", "there", "the", "a", "an", "of", "in", "would"].includes(w))
    .slice(0, 5)
    .join("-");
}

const [command, id] = process.argv.slice(2);

if (command === "list" || !command) {
  const rows = query(
    "SELECT id, prompt, unit, answer, at FROM suggestions WHERE status = 'pending' ORDER BY at"
  );
  if (!rows.length) {
    console.log("Nothing pending.");
    process.exit(0);
  }
  console.log(`${rows.length} pending:\n`);
  for (const row of rows) {
    console.log(`  ${row.id}`);
    console.log(`    ${safe(row.prompt)}`);
    console.log(`    answer: ${row.answer} ${safe(row.unit)}   (${new Date(row.at).toISOString().slice(0, 10)})\n`);
  }
  console.log("node scripts/suggestions.mjs show <id>");
  process.exit(0);
}

if (!ID.test(id || "")) {
  console.error(`Not a suggestion id: ${id}`);
  process.exit(1);
}

if (command === "show" || command === "accept") {
  const [row] = query(`SELECT * FROM suggestions WHERE id = '${id}'`);
  if (!row) {
    console.error("No such suggestion.");
    process.exit(1);
  }

  console.log(`\n  question: ${safe(row.prompt)}`);
  console.log(`  answer:   ${row.answer} ${safe(row.unit)}   <- the submitter's claim, unverified`);
  console.log(`  source:   ${safe(row.source)}`);
  if (row.note) console.log(`  approach: ${safe(row.note)}`);
  console.log(`  status:   ${row.status}\n`);

  if (command === "accept") {
    query(`UPDATE suggestions SET status = 'accepted' WHERE id = '${id}'`);
    console.log("Marked accepted. Nothing is published yet - append this to the END of");
    console.log("estimation-gym-omarchy/content/questions.js, after checking the answer:\n");
    console.log(JSON.stringify({
      id: kebab(row.prompt) || "rename-me",
      prompt: safe(row.prompt),
      unit: safe(row.unit),
      answerValue: row.answer,
      decompositionHint: safe(row.note) || "TODO: how to reason it out",
      strategy: "TODO: pick an archetype from Model.js STRATEGIES",
      source: safe(row.source)
    }, null, 2));
    console.log("\nAppend only - never insert. The bank's order is the calendar.");
  }
  process.exit(0);
}

if (command === "reject") {
  query(`UPDATE suggestions SET status = 'rejected' WHERE id = '${id}'`);
  console.log("Marked rejected.");
  process.exit(0);
}

console.error("Usage: node scripts/suggestions.mjs [list|show|accept|reject] [id]");
process.exit(1);
