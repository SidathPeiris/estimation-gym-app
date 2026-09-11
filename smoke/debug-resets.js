// Drives the real app.js through a DOM shim to check the ?reset debug params
// and the install counter end to end. Scratch harness; not committed.
const fs = require("fs");
const vm = require("vm");
const root = require("node:path").resolve(__dirname, "..") + "/";
const html = fs.readFileSync(root + "index.html", "utf8");
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);

function run({ search = "", store = {}, standalone = false } = {}) {
  const listeners = {};
  const imagesRequested = [];
  const makeEl = (id) => ({
    id, textContent: "", classList: { add() {}, remove() {}, contains: () => false, toggle() {} }, className: "", placeholder: "", title: "",
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

  let replacedTo = null;
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
      location: { search, pathname: "/estimation-gym-app/" },
      history: { replaceState: (a, b, url) => { replacedTo = url } },
      navigator: { standalone },
      matchMedia: () => ({ matches: standalone }),
      addEventListener(ev, fn) { (listeners["window:" + ev] = listeners["window:" + ev] || []).push(fn) }
    },
    navigator: {}, setTimeout: () => {}
  };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  for (const f of ["core/Model.js", "core/questions.js", "storage.js", "presenter.js", "app.js"]) {
    vm.runInContext(fs.readFileSync(root + f, "utf8"), sandbox, { filename: f });
  }
  const fire = (id, ev, arg) => (listeners[id + ":" + ev] || []).forEach((fn) => fn(arg || { preventDefault() {} }));
  return { els, store, fire, replacedTo, imagesRequested, sandbox };
}

const today = require(root + "core/Model.js").dayIndex(new Date());
const KEY = "estimation-gym-state";

function answeredStore(extraDays = []) {
  const M = require(root + "core/Model.js");
  let s = M.emptyState();
  for (const d of extraDays) s = M.recordAnswer(s, d, 100, 100);
  s = M.recordAnswer(s, today, 100, 100);
  return { [KEY]: JSON.stringify(s) };
}

// 1. Baseline: an answered day shows the result and retires the input.
let r = run({ store: answeredStore() });
if (r.els.result.hidden) throw new Error("expected an answered day to show a result");
console.log("answered day      -> result shown, form hidden: " + r.els["guess-form"].hidden);

// 2. ?reset=today puts the guess form back without touching earlier days.
r = run({ search: "?reset=today", store: answeredStore([today - 2, today - 1]) });
if (!r.els.result.hidden) throw new Error("?reset=today should un-answer today");
if (r.els["guess-form"].hidden) throw new Error("the guess form should be back");
if (r.els["hint-toggle"].hidden) throw new Error("the hint should be on offer again");
const after = JSON.parse(r.store[KEY]);
console.log("?reset=today      -> form back, history kept: " +
  Object.keys(after.history).length + " earlier days, streak " + after.streak +
  ", best " + after.bestStreak);
if (Object.keys(after.history).length !== 2) throw new Error("earlier days should survive");
if (after.bestStreak !== 3) throw new Error("bestStreak should not be rewritten");
if (r.replacedTo !== "/estimation-gym-app/") throw new Error("the query string should be stripped");
console.log("                     url stripped to " + r.replacedTo);

// 3. ?reset=all wipes everything back to a first run.
r = run({ search: "?reset=all", store: answeredStore([today - 2, today - 1]) });
const wiped = JSON.parse(r.store[KEY]);
if (Object.keys(wiped.history).length !== 0) throw new Error("?reset=all should empty the history");
console.log("?reset=all        -> history " + Object.keys(wiped.history).length +
  ", streak " + wiped.streak + ", best " + wiped.bestStreak +
  ", stats hidden: " + r.els.stats.hidden);

// 4. A junk value must be ignored, not treated as a wipe.
r = run({ search: "?reset=lol", store: answeredStore() });
if (Object.keys(JSON.parse(r.store[KEY]).history).length !== 1) throw new Error("junk reset value wiped data");
console.log("?reset=lol        -> ignored, data intact, url untouched: " + (r.replacedTo === null));

// 5. Install counter: now configured, so a standalone launch counts exactly
// once and a plain browser tab never does. (smoke3.js covers this in depth.)
r = run({ store: answeredStore(), standalone: true });
r.fire("window", "appinstalled");
if (r.imagesRequested.length !== 1) throw new Error("expected exactly one count, got " + r.imagesRequested.length);
if (!r.store["estimation-gym-install-counted"]) throw new Error("dedupe flag not written");
console.log("install ping      -> standalone: 1 request, deduped after");
console.log("                     " + r.imagesRequested[0].replace(/&t=d+$/, "&t=..."));

const tab = run({ store: answeredStore(), standalone: false });
if (tab.imagesRequested.length !== 0) throw new Error("a plain browser visit was counted");
console.log("                     plain browser tab: 0 requests");

console.log("\nsmoke2 passed");
