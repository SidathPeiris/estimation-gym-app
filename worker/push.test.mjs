// The reminder path: subscribing, the hourly cron, and who actually gets sent
// a push. Run with: node worker/push.test.mjs
import assert from "node:assert/strict";
import worker from "./src/index.js";
import { localHour, localDayIndex, vapidHeaders } from "./src/push.js";

const ORIGIN = "https://sidathpeiris.github.io";
const PUSH = "https://fcm.googleapis.com/fcm/send/";

// A private key generated for the test only; never the real one.
const { webcrypto } = await import("node:crypto");
const kp = await webcrypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]);
const jwk = await webcrypto.subtle.exportKey("jwk", kp.privateKey);
const TEST_ENV_KEYS = {
  VAPID_PRIVATE_KEY: JSON.stringify({ kty: jwk.kty, crv: jwk.crv, x: jwk.x, y: jwk.y, d: jwk.d }),
  VAPID_PUBLIC_KEY: "BTestPublicKey",
  VAPID_SUBJECT: "mailto:test@example.com"
};

function fakeDB() {
  const subs = new Map();   // endpoint -> {tz_offset, last_played_day}
  function stmt(sql, args = []) {
    return {
      bind: (...a) => stmt(sql, a),
      async first() { return null },
      async all() {
        if (sql.includes("FROM subscriptions")) {
          return { results: [...subs].map(([endpoint, v]) => ({ endpoint, ...v })) };
        }
        return { results: [] };
      },
      async run() {
        if (sql.startsWith("INSERT INTO subscriptions")) {
          const [endpoint, tz] = args;
          const prev = subs.get(endpoint);
          subs.set(endpoint, { tz_offset: tz, last_played_day: prev ? prev.last_played_day : null });
        }
        if (sql.startsWith("DELETE FROM subscriptions")) subs.delete(args[0]);
        if (sql.startsWith("UPDATE subscriptions SET last_played_day")) {
          const row = subs.get(args[1]);
          if (row) row.last_played_day = args[0];
        }
      }
    };
  }
  return { prepare: (sql) => stmt(sql), async batch(s) { for (const x of s) await x.run(); }, _subs: subs };
}

const env = () => Object.assign({ DB: fakeDB(), ALLOWED_ORIGIN: ORIGIN }, TEST_ENV_KEYS);
const post = (path, body) => new Request("https://w.dev" + path, {
  method: "POST", headers: { "Content-Type": "application/json", Origin: ORIGIN }, body: JSON.stringify(body)
});

// --- subscribing ---
let e = env();
let r = await worker.fetch(post("/subscribe", { endpoint: PUSH + "abc", tzOffset: -600 }), e);
assert.equal(r.status, 200);
assert.equal(e.DB._subs.size, 1);
console.log("subscribe          -> stored, tz kept");

// Re-subscribing updates the offset rather than duplicating (travel, DST).
await worker.fetch(post("/subscribe", { endpoint: PUSH + "abc", tzOffset: 0 }), e);
assert.equal(e.DB._subs.size, 1);
assert.equal(e.DB._subs.get(PUSH + "abc").tz_offset, 0);
console.log("re-subscribe       -> offset updated, no duplicate");

// --- what is refused ---
for (const bad of [
  { endpoint: "http://insecure.example/x", tzOffset: 0 },
  { endpoint: "not-a-url", tzOffset: 0 },
  { endpoint: PUSH + "x", tzOffset: 9999 },
  { endpoint: PUSH + "x" },
  {}
]) {
  const res = await worker.fetch(post("/subscribe", bad), env());
  assert.equal(res.status, 400, "should refuse " + JSON.stringify(bad));
}
console.log("bad subscriptions  -> 400, nothing stored");

// --- unsubscribing ---
e = env();
await worker.fetch(post("/subscribe", { endpoint: PUSH + "z", tzOffset: 0 }), e);
await worker.fetch(post("/unsubscribe", { endpoint: PUSH + "z" }), e);
assert.equal(e.DB._subs.size, 0);
console.log("unsubscribe        -> removed");

// --- the hourly run ---
// Sydney (-600) and UTC (0). At 23:00 UTC it is 09:00 in Sydney only.
function envWith(rows) {
  const en = env();
  for (const [endpoint, tz, played] of rows) en.DB._subs.set(endpoint, { tz_offset: tz, last_played_day: played });
  return en;
}
function stubFetch(status) {
  const sent = [];
  globalThis.fetch = async (url) => { sent.push(String(url)); return { ok: status === 201, status }; };
  return sent;
}

e = envWith([[PUSH + "syd", -600, null], [PUSH + "utc", 0, null]]);
let sent = stubFetch(201);
await worker.scheduled({ scheduledTime: Date.parse("2026-09-08T23:00:00Z") }, e, {});
assert.deepEqual(sent, [PUSH + "syd"], "only the subscriber for whom it is 9am");
console.log("cron 23:00 UTC     -> pushed to Sydney only (9am there), not UTC");

// Twelve hours later it is UTC's turn and not Sydney's.
e = envWith([[PUSH + "syd", -600, null], [PUSH + "utc", 0, null]]);
sent = stubFetch(201);
await worker.scheduled({ scheduledTime: Date.parse("2026-09-09T09:00:00Z") }, e, {});
assert.deepEqual(sent, [PUSH + "utc"]);
console.log("cron 09:00 UTC     -> pushed to UTC only");

// --- already played: say nothing ---
const nowSyd9am = Date.parse("2026-09-08T23:00:00Z");
const sydDay = localDayIndex(nowSyd9am, -600);
e = envWith([[PUSH + "syd", -600, sydDay]]);
sent = stubFetch(201);
await worker.scheduled({ scheduledTime: nowSyd9am }, e, {});
assert.deepEqual(sent, [], "someone who already played today is not nudged");
console.log("already played     -> no push");

// Having played yesterday is not having played today.
e = envWith([[PUSH + "syd", -600, sydDay - 1]]);
sent = stubFetch(201);
await worker.scheduled({ scheduledTime: nowSyd9am }, e, {});
assert.equal(sent.length, 1);
console.log("played yesterday   -> pushed");

// --- dead subscriptions are dropped ---
e = envWith([[PUSH + "dead", -600, null]]);
stubFetch(410);
await worker.scheduled({ scheduledTime: nowSyd9am }, e, {});
assert.equal(e.DB._subs.size, 0, "a 410 subscription is forgotten");
console.log("push returns 410   -> subscription removed");

// A transient failure must not delete anything.
e = envWith([[PUSH + "flaky", -600, null]]);
stubFetch(500);
await worker.scheduled({ scheduledTime: nowSyd9am }, e, {});
assert.equal(e.DB._subs.size, 1, "a 500 is not treated as gone");
console.log("push returns 500   -> kept, will retry tomorrow");

// --- the VAPID header is well formed ---
const headers = await vapidHeaders(PUSH + "abc", TEST_ENV_KEYS);
assert.ok(headers.Authorization.startsWith("vapid t="));
const jwt = headers.Authorization.slice("vapid t=".length).split(",")[0];
const [h, pl, sg] = jwt.split(".");
const decode = (x) => JSON.parse(Buffer.from(x.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString());
assert.equal(decode(h).alg, "ES256");
assert.equal(decode(pl).aud, "https://fcm.googleapis.com", "audience is the push service origin, not the endpoint");
assert.ok(decode(pl).exp > Math.floor(Date.now() / 1000));
assert.equal(Buffer.from(sg.replace(/-/g, "+").replace(/_/g, "/"), "base64").length, 64, "raw r||s signature");
assert.equal(headers["Content-Length"], "0", "payload-less push");
console.log("VAPID header       -> ES256, aud=" + decode(pl).aud + ", 64-byte signature, no payload");

console.log("\nAll push tests passed.");
