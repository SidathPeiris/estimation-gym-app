// Exercises the Worker's request handling against an in-memory stand-in for
// D1, so the endpoint logic is verified without deploying anything.
//
//   node worker/worker.test.mjs

import assert from "node:assert/strict";
import worker from "./src/index.js";

function fakeDB() {
  const responses = new Map();   // "qid\u0000band" -> tally
  const suggestions = [];        // rows, in insertion order
  const confessions = new Set(); // "qid|client"
  const seen = new Set();        // "qid\u0000client"

  function statement(sql, args = []) {
    return {
      bind: (...a) => statement(sql, a),
      async first() {
        if (sql.startsWith("SELECT 1 FROM seen")) {
          return seen.has(args[0] + "\u0000" + args[1]) ? { 1: 1 } : null;
        }
        if (sql.startsWith("SELECT COUNT(*) AS n FROM confessions")) {
          let n = 0;
          for (const k of confessions) if (k.split("|")[0] === args[0]) n++;
          return { n };
        }
        if (sql.startsWith("SELECT COUNT(*) AS n FROM suggestions")) {
          const [client, since] = args;
          return { n: suggestions.filter((s) => s.client === client && s.at > since).length };
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
        if (sql.startsWith("INSERT OR IGNORE INTO confessions")) {
          confessions.add(args[0] + "|" + args[1]);
        }
        if (sql.startsWith("INSERT INTO suggestions")) {
          const [id, prompt, unit, answer, source, note, client, at] = args;
          suggestions.push({ id, prompt, unit, answer, source, note, status: "pending", client, at });
        }
      }
    };
  }

  return {
    prepare: (sql) => statement(sql),
    async batch(stmts) { for (const s of stmts) s._apply(); },
    _responses: responses,
    _suggestions: suggestions,
    _confessions: confessions
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


// --- suggestions ---------------------------------------------------------
//
// Free text written by strangers, on its way to a bank whose contents get
// rendered by a QML widget. The endpoint is the only place this is filtered,
// so the refusals below are the point of the feature, not an afterthought.

const suggest = (body, ip = "1.2.3.4") =>
  new Request("https://w.dev/suggest", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: ORIGIN, "CF-Connecting-IP": ip },
    body: JSON.stringify(body)
  });

const GOOD = {
  prompt: "How many bricks are in the Great Wall of China?",
  unit: "bricks",
  answer: "3.9e9",
  source: "Wall length and typical brick dimensions",
  note: "Length times cross-section, divided by the volume of one brick."
};

// --- a well-formed suggestion is stored as pending ---
e = env();
let sres = await worker.fetch(suggest(GOOD), e);
assert.equal(sres.status, 200);
assert.deepEqual(await sres.json(), { ok: true });
assert.equal(e.DB._suggestions.length, 1);
assert.equal(e.DB._suggestions[0].status, "pending", "never anything but pending on arrival");
assert.equal(e.DB._suggestions[0].answer, 3.9e9, "scientific notation survives as a number");
assert.ok(e.DB._suggestions[0].client.length === 64, "the address is stored hashed, not bare");
assert.ok(
  !JSON.stringify(e.DB._suggestions[0]).includes("1.2.3.4"),
  "the submitter's address is nowhere in the row"
);
console.log("good suggestion   -> stored pending, address hashed");

// --- markup is refused, because the widget would render it ---
//
// Qt's Text treats anything HTML-shaped as rich text unless pinned to
// PlainText. The widget is pinned, but defence in depth: a prompt carrying
// angle brackets never enters the system in the first place.
e = env();
for (const bad of [
  { ...GOOD, prompt: "How many <b>bricks</b> are in the Great Wall?" },
  { ...GOOD, prompt: "How many bricks <img src=x onerror=alert(1)> are there?" },
  { ...GOOD, unit: "<script>" },
  { ...GOOD, source: "see <a href=evil>here</a>" },
  { ...GOOD, note: "first <hr> then" }
]) {
  const r = await worker.fetch(suggest(bad), e);
  assert.equal(r.status, 400, "markup rejected: " + JSON.stringify(bad).slice(0, 60));
}
assert.equal(e.DB._suggestions.length, 0, "no markup reached the table");
console.log("markup            -> 400, table untouched");

// --- and so is everything else that is not a usable question ---
e = env();
for (const bad of [
  { ...GOOD, prompt: "too short?" },
  { ...GOOD, prompt: "x".repeat(201) },
  { ...GOOD, unit: "" },
  { ...GOOD, answer: "about a billion" },
  { ...GOOD, answer: "0" },
  { ...GOOD, answer: "-5" },
  { ...GOOD, answer: "Infinity" },
  { ...GOOD, source: "" },
  { ...GOOD, note: "n".repeat(501) },
  {}
]) {
  const r = await worker.fetch(suggest(bad), e);
  assert.equal(r.status, 400, "rejected: " + JSON.stringify(bad).slice(0, 60));
}
assert.equal(e.DB._suggestions.length, 0);
console.log("unusable input    -> 400, table untouched");

// --- the note is genuinely optional ---
e = env();
const { note, ...noNote } = GOOD;
assert.equal((await worker.fetch(suggest(noNote), e)).status, 200);
assert.equal(e.DB._suggestions[0].note, "", "a missing note is stored as empty, not as null junk");
console.log("no note           -> accepted");

// --- one address cannot flood the queue ---
e = env();
for (let i = 0; i < 5; i++) {
  assert.equal((await worker.fetch(suggest(GOOD, "5.5.5.5"), e)).status, 200, "submission " + i);
}
const flooded = await worker.fetch(suggest(GOOD, "5.5.5.5"), e);
assert.equal(flooded.status, 429, "the sixth in a day is refused");
assert.equal(e.DB._suggestions.length, 5);

// but someone else is unaffected by their neighbour's limit
assert.equal((await worker.fetch(suggest(GOOD, "6.6.6.6"), e)).status, 200);
console.log("rate limit        -> 5/day per address, others unaffected");

// --- a foreign origin cannot post suggestions either ---
const foreignSuggest = new Request("https://w.dev/suggest", {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: "https://someone-elses-site.example" },
  body: JSON.stringify(GOOD)
});
assert.equal((await worker.fetch(foreignSuggest, env())).status, 403);
console.log("foreign origin    -> 403 on /suggest too");


// --- confessions ---------------------------------------------------------
//
// The answers ship with the app so it can play offline, so anyone who reads
// the source has them. An exact match is asked about in fun, and the honest
// answers land here - counted apart from the bands, so owning up never moves
// the chart it sits under.

const confess = (body, ip = "1.2.3.4") =>
  new Request("https://w.dev/confess", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: ORIGIN, "CF-Connecting-IP": ip },
    body: JSON.stringify(body)
  });

e = env();
let c = await worker.fetch(confess({ questionId: "sheep-in-new-zealand" }), e);
assert.equal(c.status, 200);
assert.deepEqual(await c.json(), { ok: true, confessed: 1 });
assert.equal(e.DB._confessions.size, 1);
console.log("confession        -> counted");

// Owning up twice is still one confession; the primary key sees to it.
await worker.fetch(confess({ questionId: "sheep-in-new-zealand" }), e);
assert.equal((await (await worker.fetch(confess({ questionId: "sheep-in-new-zealand" }), e)).json()).confessed, 1);
assert.equal(e.DB._confessions.size, 1, "the same person cannot inflate the count");

// Someone else can, though.
assert.equal((await (await worker.fetch(confess({ questionId: "sheep-in-new-zealand" }, "8.8.8.8"), e)).json()).confessed, 2);
console.log("repeat confession -> ignored; a second person counts");

// It rides along on /dist without touching the response counts.
await worker.fetch(post({ questionId: "sheep-in-new-zealand", band: "Bullseye" }, "3.3.3.3"), e);
const withConfessions = await (await worker.fetch(get("sheep-in-new-zealand"), e)).json();
assert.equal(withConfessions.confessed, 2);
assert.equal(withConfessions.n, 1, "two confessions did not become two responses");
assert.deepEqual(withConfessions.counts, { Bullseye: 1, Close: 0, Ballpark: 0, Off: 0 });
console.log("dist payload      -> confessed=2 alongside n=1, bands untouched");

// A question nobody has owned up to reports zero rather than nothing.
assert.equal((await (await worker.fetch(get("cars-in-us"), e)).json()).confessed, 0);

// Junk is refused, same as everywhere else.
for (const bad of [{ questionId: "Not Kebab" }, { questionId: "../../etc/passwd" }, {}]) {
  assert.equal((await worker.fetch(confess(bad), e)).status, 400, "rejected: " + JSON.stringify(bad));
}
const foreignConfess = new Request("https://w.dev/confess", {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: "https://someone-elses-site.example" },
  body: JSON.stringify({ questionId: "sheep-in-new-zealand" })
});
assert.equal((await worker.fetch(foreignConfess, env())).status, 403);
console.log("bad confession    -> 400, foreign origin -> 403");
console.log("\nAll worker tests passed.");
