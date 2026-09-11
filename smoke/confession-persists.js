// The cheat confession surviving a reload.
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

function run({ store = {}, reply = () => Promise.resolve({ ok: false, json: () => Promise.resolve({}) }) } = {}) {
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
    fetch: (url, opts) => { calls.push({ url, opts }); return reply(url, opts) },
    Image: function () { return {} },
    document: { hidden: false, addEventListener() {}, getElementById: (id) => els[id] || null, createElement: (t) => makeEl("<" + t + ">") },
    window: {
      localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v) }, removeItem: (k) => { delete store[k] } },
      location: { search: "", pathname: "/", reload() {} }, history: { replaceState() {} },
      navigator: {}, matchMedia: () => ({ matches: false }), addEventListener() {},
      caches: { keys: () => Promise.resolve(["estimation-gym-v29"]) }
    },
    navigator: {}, setTimeout: (fn) => fn && 0
  };
  sandbox.window.window = sandbox.window;
  sandbox.caches = sandbox.window.caches;
  vm.createContext(sandbox);
  for (const f of ["core/Model.js", "core/questions.js", "storage.js", "presenter.js", "app.js"])
    vm.runInContext(fs.readFileSync(root + f, "utf8"), sandbox, { filename: f });
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

void (async function () {
  // 1. Answer exactly right, then walk away without answering the question.
  const store = {};
  let r = run({ store, reply: ok });
  r.els["guess-input"].value = String(todaysQ.answerValue);
  r.fire("guess-form", "submit");
  if (r.els.confess.hidden) throw new Error("should have been asked");
  console.log("asked              -> yes");

  // 2. Reopen the app. Same storage, fresh page.
  r = run({ store, reply: ok });
  if (r.els.confess.hidden) throw new Error("the question vanished on reload - that is the bug");
  if (!/exactly right/.test(r.els["confess-body"].textContent)) {
    throw new Error("the prompt was not rebuilt: " + r.els["confess-body"].textContent);
  }
  console.log("after a reload     -> still asking");

  // 3. And again. Ignoring it must not wear it down.
  r = run({ store, reply: ok });
  if (r.els.confess.hidden) throw new Error("gave up on the second reload");
  console.log("and again          -> still asking");

  // 4. Answering it is what ends it.
  r.fire("confess-no", "click");
  if (!r.els.confess.hidden) throw new Error("answering should dismiss it");
  const after = run({ store, reply: ok });
  if (!after.els.confess.hidden) throw new Error("it came back after being answered");
  console.log("answered no        -> gone, and stays gone");

  // 5. Owning up also ends it, and reports once.
  const store2 = {};
  let y = run({ store: store2, reply: ok });
  y.els["guess-input"].value = String(todaysQ.answerValue);
  y.fire("guess-form", "submit");
  y.fire("confess-yes", "click");
  await new Promise((res) => setImmediate(res));
  const sent = y.calls.filter((c) => /\/confess$/.test(c.url));
  if (sent.length !== 1) throw new Error("expected one report, got " + sent.length);
  const reopened = run({ store: store2, reply: ok });
  if (!reopened.els.confess.hidden) throw new Error("still asking after owning up");
  console.log("answered yes       -> reported once, then gone");

  // 6. A pending question must not outlive the day it belongs to. Yesterday's
  //    prompt above today's question would be nonsense.
  const stale = { "estimation-gym-confess": "some-other-question-id" };
  const s = run({ store: stale, reply: ok });
  if (!s.els.confess.hidden) throw new Error("a stale confession was shown against the wrong question");
  if (stale["estimation-gym-confess"]) throw new Error("the stale entry was not cleared");
  console.log("stale entry        -> dropped, not shown");

  console.log("\nsmoke14 passed");
})().catch((e) => { console.error(e.message); process.exit(1); });
