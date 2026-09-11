// The migration banner on the old address.
const fs = require("fs"); const vm = require("vm");
const root = require("node:path").resolve(__dirname, "..") + "/";
const html = fs.readFileSync(root + "index.html", "utf8");
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
const initiallyHidden = new Set(
  [...html.matchAll(/<[a-z]+[^>]*>/g)].map((m) => m[0])
    .filter((tag) => / hidden[ >=]/.test(tag))
    .map((tag) => (tag.match(/id="([^"]+)"/) || [])[1]).filter(Boolean)
);
const M = require(root + "core/Model.js");
const Q = require(root + "core/questions.js");

function run({ store = {}, host = "estimationgym.app", hash = "", announce = null, reply = () => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }) } = {}) {
  const calls = [];
  const listeners = {};
  const makeEl = (id) => ({
    id, textContent: "", className: "", dataset: {}, style: {}, children: [],
    hidden: false, attrs: {}, value: "", placeholder: "", title: "",
    selectionStart: 0, selectionEnd: 0, setSelectionRange(a, b) { this.selectionStart = a; this.selectionEnd = b },
    classList: { add() {}, remove() {}, contains: () => false },
    hasAttribute(k) { return k === "hidden" ? this.hidden : (k in this.attrs) },
    setAttribute(k, v) { this.attrs[k] = v; if (k === "hidden") this.hidden = true },
    removeAttribute(k) { delete this.attrs[k]; if (k === "hidden") this.hidden = false },
    append(...c) { this.children.push(...c) }, appendChild(c) { this.children.push(c) },
    replaceChildren(...c) { this.children = c },
    addEventListener(ev, fn) { (listeners[id + ":" + ev] = listeners[id + ":" + ev] || []).push(fn) },
    focus() {},
    // A real <form> has reset(); without it the success path threw inside the
    // .then and was reported as a network failure. The shim has no idea which
    // inputs belong to it, so it records the call for the test to assert on
    // rather than pretending to clear them.
    reset() { this.didReset = true }
  });
  const els = {};
  for (const id of ids) { els[id] = makeEl(id); if (initiallyHidden.has(id)) els[id].hidden = true; }
  const sandbox = {
    console, URLSearchParams, Promise, JSON, Math, encodeURIComponent, Date, Uint8Array,
    atob: (b) => Buffer.from(b, "base64").toString("binary"),
    btoa: (s) => Buffer.from(s, "binary").toString("base64"),
    escape, unescape,
    fetch: (url, opts) => { calls.push({ url, opts }); return reply(url, opts) },
    Image: function () { return {} },
    document: { hidden: false, addEventListener() {}, getElementById: (id) => els[id] || null, createElement: (t) => makeEl("<" + t + ">") },
    window: {
      localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v) }, removeItem: (k) => { delete store[k] } },
      location: { search: "", pathname: "/", hostname: host, hash: hash, reload() {} },
      atob: (b) => Buffer.from(b, "base64").toString("binary"),
      btoa: (v) => Buffer.from(v, "binary").toString("base64"),
      history: { replaceState(a, b, url) { this.replaced = url } },
      navigator: {}, matchMedia: () => ({ matches: false }), addEventListener() {},
      caches: { keys: () => Promise.resolve(["estimation-gym-v29"]) }
    },
    navigator: {}, setTimeout: (fn) => fn && 0
  };
  sandbox.window.window = sandbox.window;
  sandbox.caches = sandbox.window.caches;
  vm.createContext(sandbox);
  for (const f of ["core/Model.js", "core/questions.js", "storage.js", "presenter.js", "app.js"]) {
    let src = fs.readFileSync(root + f, "utf8");
    // The announcement is parked behind a flag while installs stay on the old
    // address. Overriding it here means the banner keeps being tested in full
    // while it is switched off, so it cannot quietly rot before it goes back.
    if (f === "app.js" && announce !== null) {
      const flag = /var MOVE_ANNOUNCED = (?:true|false)/;
      // Not "did the text change": asking for the value it already has is a
      // legitimate run, and treating that as a missing flag failed the moment
      // the override matched what was shipped.
      if (!flag.test(src)) throw new Error("could not find the MOVE_ANNOUNCED flag in app.js");
      src = src.replace(flag, "var MOVE_ANNOUNCED = " + String(announce));
    }
    vm.runInContext(src, sandbox, { filename: f });
  }
  const fire = (id, ev) => (listeners[id + ":" + ev] || []).forEach((f) => f({ preventDefault() {} }));
  return { els, store, fire, calls };
}

// --- owning up to a peek -------------------------------------------------

const M2 = require(root + "core/Model.js");
const Q2 = require(root + "core/questions.js");
const todayIdx = M2.dayIndex(new Date());
const todaysQ = M2.questionForDay(todayIdx, Q2);

const ok = () => Promise.resolve({ ok: true, json: () => Promise.resolve({ ok: true, confessed: 1 }) });

function answer(r, value) {
  r.els["guess-input"].value = String(value);
  r.fire("guess-form", "submit");
}

// --- the confession has to outlive closing the app ----------------------
//
// It used to live in a variable and in the DOM, so shutting the app dismissed
// the question by default. That made owning up the only answer that cost
// anything, which is a poor way to ask for honesty.

// --- moving to estimationgym.app ----------------------------------------
//
// Both addresses run at once while people move across. The old one has to say
// so, and has to carry a history over, because localStorage is per-origin and
// nothing crosses on its own.

const OLD = "sidathpeiris.github.io";
const NEW = "estimationgym.app";

void (async function () {
  // 1. The new address must never show it. Anyone arriving there has arrived.
  let r = run({ host: NEW, announce: true });
  if (!r.els.moved.hidden) throw new Error("the new address is showing a move notice");
  console.log("on the new host    -> no banner");

  // 2. Announced, the old address shows it, played or not.
  r = run({ host: OLD, announce: true });
  if (r.els.moved.hidden) throw new Error("the old address is not warning anyone");
  console.log("on the old host    -> banner shown");

  // 2b. Parked, it shows nowhere at all - including the old address, which is
  //     the only place it would ever appear.
  r = run({ host: OLD, announce: false });
  if (!r.els.moved.hidden) throw new Error("the announcement is parked but the old address still shows it");
  console.log("parked             -> no banner on either host");

  // 2c. And whichever way the flag is shipped, the app agrees with it.
  const shipped = /var MOVE_ANNOUNCED = (true|false)/.exec(
    fs.readFileSync(root + "app.js", "utf8"));
  if (!shipped) throw new Error("app.js has no MOVE_ANNOUNCED flag");
  const live = run({ host: OLD });
  if (live.els.moved.hidden !== (shipped[1] === "false")) {
    throw new Error("shipped flag says " + shipped[1] + " but the old address disagrees");
  }
  console.log("as shipped         -> MOVE_ANNOUNCED = " + shipped[1]);

  // 3. With a history, the link carries it.
  const store = {};
  let played = run({ store, host: OLD, announce: true });
  played.els["guess-input"].value = "12000";
  played.fire("guess-form", "submit");
  played = run({ store, host: OLD, announce: true });

  const href = played.els["moved-go"].attrs.href;
  if (!href || href.indexOf("https://" + NEW) !== 0) throw new Error("the link does not point at the new address: " + href);
  if (href.indexOf("#move=") < 0) throw new Error("the link carries no history");
  console.log("with a history     -> link carries a payload (" + href.length + " chars)");

  // 4. And the payload is a history the other side will accept.
  const packed = href.slice(href.indexOf("#move=") + 6);
  const raw = decodeURIComponent(escape(Buffer.from(packed, "base64").toString("binary")));
  const parsed = JSON.parse(raw);
  if (!parsed.history || !Object.keys(parsed.history).length) throw new Error("the payload has no days in it");
  console.log("payload            -> " + Object.keys(parsed.history).length + " day(s), valid JSON");

  // 5. Arriving on the new address with that fragment imports it, and strips
  //    it - a reload or a shared link must not re-import or leak a history.
  const fresh = {};
  const landed = run({ store: fresh, host: NEW, hash: "#move=" + packed });
  const saved = fresh["estimation-gym-state"];
  if (!saved) throw new Error("the history was not imported on arrival");
  if (!JSON.parse(saved).history || !Object.keys(JSON.parse(saved).history).length) {
    throw new Error("imported, but empty");
  }
  if (!landed.els.moved.hidden) throw new Error("the new address showed the banner after importing");
  console.log("arriving with it   -> imported, " + Object.keys(JSON.parse(saved).history).length + " day(s) kept");

  // 6. Junk in the fragment must not throw or wipe anything.
  const guarded = { "estimation-gym-state": JSON.stringify({ history: {}, streak: 4, bestStreak: 4 }) };
  run({ store: guarded, host: NEW, hash: "#move=not-base64!!" });
  if (JSON.parse(guarded["estimation-gym-state"]).bestStreak !== 4) {
    throw new Error("a malformed fragment damaged an existing history");
  }
  console.log("junk fragment      -> ignored, existing history untouched");

  console.log("\nmigration-banner passed");
})().catch((e) => { console.error(e.message); process.exit(1); });
