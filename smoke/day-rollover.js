// Drives the real app.js across a simulated midnight.
const fs = require("fs"); const vm = require("vm");
const root = require("node:path").resolve(__dirname, "..") + "/";
const html = fs.readFileSync(root + "index.html", "utf8");
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
const M = require(root + "core/Model.js");
const Q = require(root + "core/questions.js");

function run({ store = {}, startDate } = {}) {
  const listeners = {};
  const docListeners = {};
  let reloaded = 0;
  let clock = startDate;

  const makeEl = (id) => ({
    id, textContent: "", classList: { add() {}, remove() {}, contains: () => false, toggle() {} }, className: "", dataset: {}, style: {}, children: [], hidden: false, attrs: {},
    setAttribute(k, v) { this.attrs[k] = v; if (k === "hidden") this.hidden = true },
    removeAttribute(k) { delete this.attrs[k]; if (k === "hidden") this.hidden = false },
    append(...c) { this.children.push(...c) }, appendChild(c) { this.children.push(c) },
    replaceChildren(...c) { this.children = c },
    addEventListener(ev, fn) { (listeners[id + ":" + ev] = listeners[id + ":" + ev] || []).push(fn) },
    focus() {}, value: "", placeholder: "", title: ""
  });
  const els = {}; for (const id of ids) els[id] = makeEl(id);

  class FakeDate extends Date {
    constructor(...a) { if (!a.length) super(clock.getTime()); else super(...a); }
    static now() { return clock.getTime() }
  }

  const sandbox = {
    console, URLSearchParams, Date: FakeDate,
    // The app now talks to a distribution endpoint; stub it so these harnesses

    // exercise the UI rather than the network.

    fetch: () => Promise.resolve({ ok: false }),
    Image: function () { return {} },
    Promise,
    document: {
      hidden: false,
      getElementById: (id) => els[id] || null,
      createElement: (t) => makeEl("<" + t + ">"),
      addEventListener(ev, fn) { (docListeners[ev] = docListeners[ev] || []).push(fn) }
    },
    window: {
      localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v) }, removeItem: (k) => { delete store[k] } },
      location: { search: "", pathname: "/", reload() { reloaded++ } },
      history: { replaceState() {} },
      navigator: {}, matchMedia: () => ({ matches: false }),
      addEventListener() {},
      caches: { keys: () => Promise.resolve(["estimation-gym-v11"]) }
    },
    navigator: {}, setTimeout: (fn) => fn && 0
  };
  sandbox.window.window = sandbox.window;
  sandbox.caches = sandbox.window.caches;
  vm.createContext(sandbox);
  for (const f of ["core/Model.js", "core/questions.js", "storage.js", "presenter.js", "app.js"])
    vm.runInContext(fs.readFileSync(root + f, "utf8"), sandbox, { filename: f });

  return {
    els, store,
    advanceTo(d) { clock = d },
    resume() { (docListeners["visibilitychange"] || []).forEach((fn) => fn()) },
    reloadCount: () => reloaded,
    fire: (id, ev) => (listeners[id + ":" + ev] || []).forEach((fn) => fn({ preventDefault() {} }))
  };
}

(async () => {
const day1 = new Date(Date.UTC(2026, 8, 9, 10, 0, 0));   // Wed 9 Sep
const day2 = new Date(Date.UTC(2026, 8, 10, 10, 0, 0));  // Thu 10 Sep
const i1 = M.dayIndex(day1), i2 = M.dayIndex(day2);
if (i2 !== i1 + 1) throw new Error("test dates are not consecutive days");

const q1 = M.questionForDay(i1, Q).prompt;
const q2 = M.questionForDay(i2, Q).prompt;
if (q1 === q2) throw new Error("the two days happen to share a question; pick different dates");

const r = run({ startDate: day1 });
console.log("on open (9 Sep)  -> " + r.els.puzzle.textContent + " | " + r.els.prompt.textContent.slice(0, 46) + "...");
if (r.els.prompt.textContent !== q1) throw new Error("wrong question on day 1");

// Left open overnight, then brought back to the foreground.
r.advanceTo(day2);
console.log("clock rolls over to 10 Sep, app still in memory");
r.resume();
console.log("after resume     -> " + r.els.puzzle.textContent + " | " + r.els.prompt.textContent.slice(0, 46) + "...");
if (r.els.puzzle.textContent !== M.formatDay(i2)) throw new Error("date did not roll over");
if (r.els.prompt.textContent !== q2) throw new Error("question did not roll over");

// The build line is filled from caches.keys(), a promise, so let the
// microtask queue drain before reading it.
await new Promise((res) => setImmediate(res));
console.log("build line       -> " + r.els.build.textContent);
if (!r.els.build.textContent.startsWith("v11")) throw new Error("build line missing the version");
if (!r.els.build.textContent.includes(M.formatDay(i2))) throw new Error("build line missing the puzzle date");

// Resuming on the same day must not churn.
const before = r.els.prompt.textContent;
r.resume();
if (r.els.prompt.textContent !== before) throw new Error("same-day resume changed the question");
console.log("same-day resume  -> unchanged, no churn");

// A half-typed guess must survive an update rather than being reloaded away.
const r2 = run({ startDate: day1 });
r2.els["guess-input"].value = "4.2e9";
r2.resume();
if (r2.reloadCount() !== 0) throw new Error("reloaded while a guess was being typed");
console.log("typed guess      -> update deferred, " + r2.reloadCount() + " reloads");

console.log("\nsmoke5 passed");
})();
