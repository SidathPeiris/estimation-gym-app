// Export -> restore, round-tripped through the real app.js.
const fs = require("fs"); const vm = require("vm");
const root = require("node:path").resolve(__dirname, "..") + "/";
const html = fs.readFileSync(root + "index.html", "utf8");
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);

// Which elements the markup itself starts hidden. Without this every element
// begins visible, which is not what a browser does and would let a panel that
// should be shut look open.
const initiallyHidden = new Set(
  [...html.matchAll(/<[a-z]+[^>]*>/g)]
    .map((m) => m[0])
    .filter((tag) => / hidden[ >=]/.test(tag))
    .map((tag) => (tag.match(/id="([^"]+)"/) || [])[1])
    .filter(Boolean)
);
const M = require(root + "core/Model.js");
const S = require(root + "storage.js");

function run({ store = {} } = {}) {
  const listeners = {};
  let copied = null;
  const makeEl = (id) => ({
    id, textContent: "", className: "", dataset: {}, style: {}, children: [],
    hidden: false, attrs: {}, value: "", placeholder: "", title: "",
    selectionStart: 0, selectionEnd: 0, setSelectionRange() {},
    classList: { add() {}, remove() {}, contains: () => false },
    hasAttribute(k) { return k === "hidden" ? this.hidden : (k in this.attrs) },
    setAttribute(k, v) { this.attrs[k] = v; if (k === "hidden") this.hidden = true },
    removeAttribute(k) { delete this.attrs[k]; if (k === "hidden") this.hidden = false },
    append(...c) { this.children.push(...c) }, appendChild(c) { this.children.push(c) },
    replaceChildren(...c) { this.children = c },
    addEventListener(ev, fn) { (listeners[id + ":" + ev] = listeners[id + ":" + ev] || []).push(fn) },
    focus() {}
  });
  const els = {};
  for (const id of ids) {
    els[id] = makeEl(id);
    if (initiallyHidden.has(id)) els[id].hidden = true;
  }
  const sandbox = {
    console, URLSearchParams, Promise, JSON, Math, encodeURIComponent, Date, Uint8Array,
    atob: (b) => Buffer.from(b, "base64").toString("binary"),
    fetch: () => Promise.resolve({ ok: false }),
    Image: function () { return {} },
    document: { hidden: false, addEventListener() {}, getElementById: (id) => els[id] || null, createElement: (t) => makeEl("<" + t + ">") },
    window: {
      localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v) }, removeItem: (k) => { delete store[k] } },
      location: { search: "", pathname: "/", reload() {} }, history: { replaceState() {} },
      navigator: { clipboard: { writeText: (t) => { copied = t; return Promise.resolve() } } },
      matchMedia: () => ({ matches: false }), addEventListener() {},
      caches: { keys: () => Promise.resolve(["estimation-gym-v26"]) }
    },
    navigator: { clipboard: { writeText: (t) => { copied = t; return Promise.resolve() } } },
    setTimeout: (fn) => fn && 0
  };
  sandbox.window.window = sandbox.window;
  sandbox.caches = sandbox.window.caches;
  vm.createContext(sandbox);
  for (const f of ["core/Model.js", "core/questions.js", "storage.js", "presenter.js", "app.js"])
    vm.runInContext(fs.readFileSync(root + f, "utf8"), sandbox, { filename: f });
  const fire = (id, ev) => (listeners[id + ":" + ev] || []).forEach((f) => f({ preventDefault() {} }));
  return { els, store, fire, copied: () => copied };
}

const KEY = "estimation-gym-state";
const today = M.dayIndex(new Date());

// A device with three days of history.
let donor = M.emptyState();
donor = M.recordAnswer(donor, today - 2, 100, 100, false, "q-a");
donor = M.recordAnswer(donor, today - 1, 100, 100, false, "q-b");
const blob = S.exportState(donor);

// 1. The panel is shut until asked for.
let r = run();
if (!r.els["restore-panel"].hidden) throw new Error("restore panel should start closed");
r.fire("restore-toggle", "click");
if (r.els["restore-panel"].hidden) throw new Error("clicking should open it");
console.log("panel              -> closed by default, opens on click");

// 2. A fresh device restores the donor's days.
r.els["restore-input"].value = blob;
r.fire("restore-go", "click");
const after = JSON.parse(r.store[KEY]);
console.log("restore onto empty -> " + r.els["restore-note"].textContent +
  "  days=" + Object.keys(after.history).length + " streak=" + after.streak);
if (Object.keys(after.history).length !== 2) throw new Error("expected 2 days restored");
if (after.streak !== 2) throw new Error("streak should be rebuilt to 2");
if (r.els["restore-input"].value !== "") throw new Error("input should clear after a successful restore");

// 3. Restoring the same thing again adds nothing and says so.
r.els["restore-input"].value = blob;
r.fire("restore-go", "click");
console.log("restore again      -> " + r.els["restore-note"].textContent);
if (!/already here/.test(r.els["restore-note"].textContent)) throw new Error("should say nothing to restore");

// 4. Junk is refused without touching what is stored.
const beforeJunk = r.store[KEY];
r.els["restore-input"].value = "hello";
r.fire("restore-go", "click");
if (r.store[KEY] !== beforeJunk) throw new Error("junk changed the stored state");
console.log("junk paste         -> " + r.els["restore-note"].textContent + "  (state untouched)");

// 5. A device that has since played more keeps its own days.
let local = M.emptyState();
local = M.recordAnswer(local, today, 42, 100, false, "q-today");
r = run({ store: { [KEY]: JSON.stringify(local) } });
r.fire("restore-toggle", "click");
r.els["restore-input"].value = blob;
r.fire("restore-go", "click");
const merged = JSON.parse(r.store[KEY]);
console.log("merge onto newer   -> " + r.els["restore-note"].textContent +
  "  days=" + Object.keys(merged.history).sort().join(",") + " streak=" + merged.streak);
if (merged.history[String(today)].guess !== 42) throw new Error("the local day was overwritten");
if (Object.keys(merged.history).length !== 3) throw new Error("expected 3 days after merge");
if (merged.streak !== 3) throw new Error("streak should span the joined run");

// 6. Export still works, and what it produces is what restore accepts.
r.fire("export", "click");
const round = S.importState(M, M.emptyState(), r.copied());
if (!round.ok || round.added !== 3) throw new Error("exported blob did not restore cleanly");
console.log("export -> restore  -> round trips, " + round.added + " days");

console.log("\nsmoke10 passed");
