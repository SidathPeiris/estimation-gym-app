// Same shim as smoke2, but with an endpoint configured, to check the install
// counter actually fires - and fires exactly once.
const fs = require("fs");
const vm = require("vm");
const root = require("node:path").resolve(__dirname, "..") + "/";
const html = fs.readFileSync(root + "index.html", "utf8");
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
const ENDPOINT = "https://example.test/count?p=/installed";

function run({ store = {}, standalone = false } = {}) {
  const listeners = {};
  const imagesRequested = [];
  const makeEl = (id) => ({
    id, textContent: "", className: "", placeholder: "", title: "",
    dataset: {}, style: {}, children: [], hidden: false, attrs: {},
    setAttribute(k, v) { this.attrs[k] = v; if (k === "hidden") this.hidden = true },
    removeAttribute(k) { delete this.attrs[k]; if (k === "hidden") this.hidden = false },
    append(...c) { this.children.push(...c) }, appendChild(c) { this.children.push(c) },
    replaceChildren(...c) { this.children = c },
    addEventListener(ev, fn) { (listeners[id + ":" + ev] = listeners[id + ":" + ev] || []).push(fn) },
    focus() {}, value: ""
  });
  const els = {};
  for (const id of ids) els[id] = makeEl(id);

  const sandbox = {
    console, URLSearchParams,
    Image: function () { const o = {}; Object.defineProperty(o, "src", { set(v) { imagesRequested.push(v) } }); return o },
    document: { hidden: false, addEventListener() {}, getElementById: (id) => els[id] || null, createElement: (t) => makeEl("<" + t + ">") },
    window: {
      localStorage: {
        getItem: (k) => (k in store ? store[k] : null),
        setItem: (k, v) => { store[k] = String(v) },
        removeItem: (k) => { delete store[k] }
      },
      location: { search: "", pathname: "/estimation-gym-app/" },
      history: { replaceState() {} },
      navigator: { standalone },
      matchMedia: () => ({ matches: standalone }),
      addEventListener(ev, fn) { (listeners["window:" + ev] = listeners["window:" + ev] || []).push(fn) }
    },
    navigator: {}, setTimeout: () => {}
  };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  for (const f of ["core/Model.js", "core/questions.js", "storage.js", "presenter.js", "app.js"]) {
    let code = fs.readFileSync(root + f, "utf8");
    if (f === "app.js") {
      const before = code;
      code = code.replace(/var INSTALL_PING_URL = "[^"]*"/, 'var INSTALL_PING_URL = "' + ENDPOINT + '"');
      if (code === before) throw new Error("could not find INSTALL_PING_URL to configure");
    }
    vm.runInContext(code, sandbox, { filename: f });
  }
  const fire = (id, ev) => (listeners[id + ":" + ev] || []).forEach((fn) => fn({ preventDefault() {} }));
  return { els, store, fire, imagesRequested };
}

const M = require(root + "core/Model.js");
const today = M.dayIndex(new Date());
const KEY = "estimation-gym-state";
const answered = () => ({ [KEY]: JSON.stringify(M.recordAnswer(M.emptyState(), today, 100, 100)) });

const r = run({ store: answered(), standalone: true });
console.log("standalone launch -> requests: " + r.imagesRequested.length);
console.log("                     " + r.imagesRequested[0]);
if (r.imagesRequested.length !== 1) throw new Error("expected exactly one count");
if (!/^https:\/\/example\.test\/count\?p=\/installed&t=\d+$/.test(r.imagesRequested[0])) {
  throw new Error("malformed count URL: " + r.imagesRequested[0]);
}
if (!r.store["estimation-gym-install-counted"]) throw new Error("dedupe flag not written");

const r2 = run({ store: r.store, standalone: true });
r2.fire("window", "appinstalled");
console.log("relaunch + event  -> requests: " + r2.imagesRequested.length + "  (deduped)");
if (r2.imagesRequested.length !== 0) throw new Error("counted twice");

const r3 = run({ store: answered(), standalone: false });
console.log("plain browser tab -> requests: " + r3.imagesRequested.length + "  (not an install)");
if (r3.imagesRequested.length !== 0) throw new Error("a non-installed visit was counted");

const r4 = run({ store: answered(), standalone: false });
r4.fire("window", "appinstalled");
console.log("appinstalled evt  -> requests: " + r4.imagesRequested.length);
if (r4.imagesRequested.length !== 1) throw new Error("appinstalled did not count");

// Nothing about the player may ride along on the request.
const url = r.imagesRequested[0];
for (const leak of ["streak", "history", "guess", "band", "points", KEY]) {
  if (url.toLowerCase().includes(leak.toLowerCase())) throw new Error("leaked " + leak);
}
console.log("payload check     -> no state, no identifier, cache-buster only");

console.log("\nping behaviour verified");
