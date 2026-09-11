// The cheat confession, through the real app.js.
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

void (async function () {
  // 1. An ordinary near miss is never asked about.
  let r = run({ reply: ok });
  answer(r, todaysQ.answerValue * 1.05);
  if (!r.els.confess.hidden) throw new Error("a close guess must not be accused of anything");
  console.log("close guess        -> not asked");

  // 2. Exact to the digit gets the question, naming the value and the unit.
  r = run({ reply: ok });
  answer(r, todaysQ.answerValue);
  if (r.els.confess.hidden) throw new Error("an exact match should be asked about");
  const body = r.els["confess-body"].textContent;
  if (!body.includes(todaysQ.unit)) throw new Error("the prompt should name the unit: " + body);
  if (!/exactly right/i.test(body)) throw new Error("unexpected wording: " + body);
  console.log("exact match        -> asked: " + body.slice(0, 62) + "…");

  // 3. Saying no closes it and reports nothing.
  const before = r.calls.length;
  r.fire("confess-no", "click");
  if (!r.els.confess.hidden) throw new Error("answering should dismiss it");
  const confessCalls = r.calls.slice(before).filter((c) => /\/confess$/.test(c.url));
  if (confessCalls.length) throw new Error("an honest 'no' must not be reported as a confession");
  console.log("answered no        -> dismissed, nothing sent");

  // 4. Saying yes reports it, with the question it belongs to.
  r = run({ reply: ok });
  answer(r, todaysQ.answerValue);
  r.fire("confess-yes", "click");
  await new Promise((res) => setImmediate(res));
  const sent = r.calls.filter((c) => /\/confess$/.test(c.url));
  if (sent.length !== 1) throw new Error("expected one confession, got " + sent.length);
  const payload = JSON.parse(sent[0].opts.body);
  if (payload.questionId !== todaysQ.id) {
    throw new Error("confessed against the wrong question: " + payload.questionId);
  }
  if (!r.els.confess.hidden) throw new Error("should close after owning up");
  console.log("answered yes       -> POST /confess for " + payload.questionId);

  // 5. The guess still scores normally - owning up is not a penalty.
  const state = JSON.parse(r.store["estimation-gym-state"]);
  const entry = state.history[String(todayIdx)];
  if (!entry) throw new Error("the answer should still have been recorded");
  if (entry.band !== "Bullseye") throw new Error("an exact guess is still a Bullseye, got " + entry.band);
  console.log("scoring            -> still Bullseye, streak untouched");

  console.log("\nsmoke13 passed");
})().catch((e) => { console.error(e.message); process.exit(1); });
