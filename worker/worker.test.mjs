// Exercises the Worker's request handling against an in-memory stand-in for
// D1, so the endpoint logic is verified without deploying anything.
//
//   node worker/worker.test.mjs

import assert from "node:assert/strict";
import worker from "./src/index.js";

function fakeDB() {
  const responses = new Map();   // "qid\u0000band" -> tally
  const seen = new Set();        // "qid\u0000client"

  function statement(sql, args = []) {
    return {
      bind: (...a) => statement(sql, a),
      async first() {
        if (sql.startsWith("SELECT 1 FROM seen")) {
          return seen.has(args[0] + "\u0000" + args[1]) ? { 1: 1 } : null;
        }
        return null;
      },
      async all() {
        if (sql.startsWith("SELECT band, tally")) {
          const out = [];
          for (const [k, tally] of responses) {
            const [qid, band] = k.split("\u0000");
            if (qid === args[0]) out.push({ band, tally });
          }
          return { results: out };
        }
        return { results: [] };
      },
      async run() { this._apply(); },
      _apply() {
        if (sql.startsWith("INSERT INTO seen")) seen.add(args[0] + "\u0000" + args[1]);
        if (sql.startsWith("INSERT INTO responses")) {
          const k = args[0] + "\u0000" + args[1];
          responses.set(k, (responses.get(k) || 0) + 1);
        }
      }
    };
  }

  return {
    prepare: (sql) => statement(sql),
    async batch(stmts) { for (const s of stmts) s._apply(); },
    _responses: responses
  };
}

const ORIGIN = "https://sidathpeiris.github.io";
const env = () => ({ DB: fakeDB(), ALLOWED_ORIGIN: ORIGIN });

function post(body, ip = "1.2.3.4") {
  return new Request("https://w.dev/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: ORIGIN, "CF-Connecting-IP": ip },
    body: JSON.stringify(body)
  });
}
const get = (q) =>
  new Request("https://w.dev/dist?q=" + encodeURIComponent(q), { headers: { Origin: ORIGIN } });

// The breakdown is released from the first response; presenting n = 1 honestly
// is the client's job, not the endpoint's.
const MIN_SAMPLE = 1;

// --- a fresh question withholds its shape until there is enough of it ---
let e = env();
let res = await worker.fetch(get("piano-tuners-chicago"), e);
let body = await res.json();
assert.equal(res.status, 200);
assert.equal(body.n, 0);
assert.equal(body.enough, false);
assert.equal(body.counts, undefined, "no breakdown is handed out below the minimum");
console.log("empty question    -> n=0, enough=false, no counts leaked");

// --- submissions accumulate ---
e = env();
for (let i = 0; i < 25; i++) {
  const band = i < 5 ? "Bullseye" : i < 15 ? "Close" : i < 22 ? "Ballpark" : "Off";
  await worker.fetch(post({ questionId: "piano-tuners-chicago", band }, "10.0.0." + i), e);
}
body = await (await worker.fetch(get("piano-tuners-chicago"), e)).json();
assert.equal(body.n, 25);
assert.equal(body.enough, true);
assert.deepEqual(body.counts, { Bullseye: 5, Close: 10, Ballpark: 7, Off: 3 });
console.log("25 submissions    -> " + JSON.stringify(body.counts));

// --- the very first response already carries a breakdown ---
e = env();
let first = await (await worker.fetch(post({ questionId: "cars-in-us", band: "Close" }, "172.16.0.1"), e)).json();
assert.equal(first.n, 1);
assert.equal(first.enough, true, "one response is enough for the endpoint");
assert.deepEqual(first.counts, { Bullseye: 0, Close: 1, Ballpark: 0, Off: 0 });
console.log("first response    -> n=1, breakdown released");

// --- one address counts once per question ---
e = env();
await worker.fetch(post({ questionId: "cars-in-us", band: "Close" }, "9.9.9.9"), e);
let second = await (await worker.fetch(post({ questionId: "cars-in-us", band: "Off" }, "9.9.9.9"), e)).json();
assert.equal(second.n, 1, "a repeat submission from the same address does not count");
assert.equal(second.counted, false);
console.log("repeat submit     -> ignored, n stays 1");

// but the same address may answer a different question
await worker.fetch(post({ questionId: "cars-in-world-2025", band: "Close" }, "9.9.9.9"), e);
assert.equal((await (await worker.fetch(get("cars-in-world-2025"), e)).json()).n, 1);
console.log("different question-> counted");

// --- junk is refused rather than stored ---
e = env();
for (const bad of [
  { questionId: "Not Kebab Case", band: "Close" },
  { questionId: "../../etc/passwd", band: "Close" },
  { questionId: "cars-in-us", band: "Perfect" },
  { questionId: "cars-in-us" },
  {}
]) {
  const r = await worker.fetch(post(bad), e);
  assert.equal(r.status, 400, "rejected: " + JSON.stringify(bad));
}
assert.equal(e.DB._responses.size, 0, "nothing junk reached the table");
console.log("malformed input   -> 400, table untouched");

// --- a foreign origin is refused ---
const foreign = new Request("https://w.dev/dist?q=cars-in-us", {
  headers: { Origin: "https://someone-elses-site.example" }
});
assert.equal((await worker.fetch(foreign, env())).status, 403);
console.log("foreign origin    -> 403");

// --- preflight and unknown routes ---
assert.equal((await worker.fetch(new Request("https://w.dev/submit", { method: "OPTIONS", headers: { Origin: ORIGIN } }), env())).status, 204);
assert.equal((await worker.fetch(new Request("https://w.dev/nope", { headers: { Origin: ORIGIN } }), env())).status, 404);
console.log("preflight/404     -> 204 / 404");

// --- the response carries no identifier ---
const payload = JSON.stringify(body);
for (const leak of ["10.0.0", "9.9.9.9", "client", "ip", "at"]) {
  assert.ok(!payload.includes(leak), "response leaked " + leak);
}
console.log("payload           -> counts only, no identifiers");

console.log("\nAll worker tests passed.");
