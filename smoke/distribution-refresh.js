// Does the distribution actually refresh when you come back to the app?
//
const fs = require("fs"); const vm = require("vm");
const root = require("node:path").resolve(__dirname, "..") + "/";
const html = fs.readFileSync(root + "index.html", "utf8");
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
const M = require(root + "core/Model.js");

function run({ server } = {}) {
  const listeners = {}, docListeners = {};
  const calls = [];
  let now = Date.now();

  const makeEl = (id) => ({
    id, textContent: "", className: "", dataset: {}, style: {}, children: [],
    hidden: false, attrs: {}, value: "", placeholder: "", title: "",
    selectionStart: 0, selectionEnd: 0, setSelectionRange() {},
    classList: { add() {}, remove() {}, contains: () => false },
    setAttribute(k, v) { this.attrs[k] = v; if (k === "hidden") this.hidden = true },
    removeAttribute(k) { delete this.attrs[k]; if (k === "hidden") this.hidden = false },
    append(...c) { this.children.push(...c) }, appendChild(c) { this.children.push(c) },
    replaceChildren(...c) { this.children = c },
    addEventListener(ev, fn) { (listeners[id + ":" + ev] = listeners[id + ":" + ev] || []).push(fn) },
    focus() {}
  });
  const els = {}; for (const id of ids) els[id] = makeEl(id);
  const store = {};

  class FakeDate extends Date {
    constructor(...a) { if (!a.length) super(now); else super(...a); }
    static now() { return now }
  }

  const sandbox = {
    console, URLSearchParams, Promise, JSON, Math, encodeURIComponent, Date: FakeDate,
    fetch: (url, opts) => {
      calls.push({ url, method: (opts && opts.method) || "GET" });
      // Always the current server truth, so a refetch is the only way the
      // client can learn about a change.
      return Promise.resolve({ ok: true, json: () => Promise.resolve(JSON.parse(JSON.stringify(server))) });
    },
    Image: function () { return {} },
    document: { hidden: false, addEventListener(ev, fn) { (docListeners[ev] = docListeners[ev] || []).push(fn) },
      getElementById: (id) => els[id] || null, createElement: (t) => makeEl("<" + t + ">") },
    window: {
      localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v) }, removeItem: (k) => { delete store[k] } },
      location: { search: "", pathname: "/", reload() {} }, history: { replaceState() {} },
      navigator: {}, matchMedia: () => ({ matches: false }), addEventListener() {},
      caches: { keys: () => Promise.resolve(["estimation-gym-v22"]) }
    },
    navigator: {}, setTimeout: (fn) => fn && 0
  };
  sandbox.window.window = sandbox.window;
  sandbox.caches = sandbox.window.caches;
  vm.createContext(sandbox);
  for (const f of ["core/Model.js", "core/questions.js", "storage.js", "presenter.js", "app.js"]) {
    let code = fs.readFileSync(root + f, "utf8");
    if (f === "app.js") code = code.replace(/var DISTRIBUTION_URL = "[^"]*"/, 'var DISTRIBUTION_URL = "https://w.example"');
    vm.runInContext(code, sandbox, { filename: f });
  }
  return {
    els, calls,
    submit(v) { els["guess-input"].value = v; (listeners["guess-form:submit"] || []).forEach((f) => f({ preventDefault() {} })); },
    resume() { (docListeners["visibilitychange"] || []).forEach((f) => f()) },
    advance(ms) { now += ms },
    gets: () => calls.filter((c) => c.method === "GET").length
  };
}

const settle = () => new Promise((r) => setImmediate(r));

(async () => {
  const two = { questionId: "x", n: 2, enough: true, counts: { Bullseye: 0, Close: 1, Ballpark: 0, Off: 1 } };
  const five = { questionId: "x", n: 5, enough: true, counts: { Bullseye: 1, Close: 2, Ballpark: 1, Off: 1 } };

  const server = JSON.parse(JSON.stringify(two));
  const r = run({ server });
  r.submit("1000");
  await settle(); await settle();
  console.log("after answering   -> " + r.els["dist-summary"].textContent);
  if (!/2 people/.test(r.els["dist-summary"].textContent)) throw new Error("expected the count to start at 2");

  // Three more people answer while the app is in the background.
  Object.assign(server, five);

  // Straight back in: still fresh, so no extra request.
  const before = r.gets();
  r.resume();
  await settle();
  if (r.gets() !== before) throw new Error("refetched while still fresh");
  console.log("resume immediately-> no refetch (still fresh), " + r.gets() + " GETs total");

  // Away for two minutes, then back: it goes and looks again.
  r.advance(2 * 60 * 1000);
  r.resume();
  await settle(); await settle();
  if (r.gets() !== before + 1) throw new Error("expected exactly one refetch, saw " + (r.gets() - before));
  console.log("resume 2 min later-> refetched, " + r.gets() + " GETs total");
  console.log("updated to        -> " + r.els["dist-summary"].textContent);
  if (!/5 people/.test(r.els["dist-summary"].textContent)) throw new Error("did not pick up the newer count");

  console.log("\nsmoke8 passed");
})();
