// Checks the How to play toggle through the real app.js.
const fs = require("fs"); const vm = require("vm");
const root = require("node:path").resolve(__dirname, "..") + "/";
const html = fs.readFileSync(root + "index.html", "utf8");
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);

function run({ store = {} } = {}) {
  const listeners = {};
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
  const sandbox = {
    console, URLSearchParams, Image: function () { return {} },
    document: { hidden: false, addEventListener() {}, getElementById: (id) => els[id] || null, createElement: (t) => makeEl("<" + t + ">") },
    window: {
      localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v) }, removeItem: (k) => { delete store[k] } },
      location: { search: "", pathname: "/" }, history: { replaceState() {} },
      navigator: {}, matchMedia: () => ({ matches: false }), addEventListener() {}
    },
    navigator: {}, setTimeout: () => {}
  };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  for (const f of ["core/Model.js", "core/questions.js", "storage.js", "presenter.js", "app.js"])
    vm.runInContext(fs.readFileSync(root + f, "utf8"), sandbox, { filename: f });
  const fire = (id, ev) => (listeners[id + ":" + ev] || []).forEach((fn) => fn({ preventDefault() {} }));
  return { els, fire };
}

const M = require(root + "core/Model.js");
const today = M.dayIndex(new Date());

// 1. First-ever visit: the guide is already open, because that is the question.
let r = run();
if (r.els["howto-body"].hidden) throw new Error("guide should be open on a first visit");
console.log("first visit       -> guide open: " + !r.els["howto-body"].hidden +
  ", chevron " + r.els["howto-chev"].textContent);
console.log("steps rendered    -> " + r.els["howto-steps"].children.length);
console.log("scoring rows      -> " + r.els["howto-scoring"].children.length +
  ": " + r.els["howto-scoring"].children.map((tr) =>
    tr.children[0].textContent + " " + tr.children[2].textContent).join(", "));
console.log("notes             -> " + r.els["howto-notes"].children.length);
if (r.els["howto-scoring"].children.length !== M.BANDS.length) throw new Error("scoring table incomplete");
if (!r.els["howto-steps"].children.length) throw new Error("no steps rendered");

// The table must state the real award for each band.
r.els["howto-scoring"].children.forEach((tr) => {
  const band = tr.children[0].textContent;
  const shown = tr.children[2].textContent;
  const expected = M.BAND_POINTS[band] + " pts";
  if (shown !== expected) throw new Error(band + " shows " + shown + ", scoring awards " + expected);
});
console.log("points match real scoring: yes");

// 2. Toggle shuts it.
r.fire("howto-toggle", "click");
if (!r.els["howto-body"].hidden) throw new Error("clicking should collapse it");
console.log("click             -> collapsed, chevron " + r.els["howto-chev"].textContent +
  ", aria-expanded " + r.els["howto-toggle"].attrs["aria-expanded"]);
r.fire("howto-toggle", "click");
if (r.els["howto-body"].hidden) throw new Error("clicking again should reopen");
console.log("click again       -> reopened");

// 3. A returning player gets it collapsed, out of the way of the puzzle.
const played = { "estimation-gym-state": JSON.stringify(M.recordAnswer(M.emptyState(), today - 1, 100, 100)) };
const r2 = run({ store: played });
if (!r2.els["howto-body"].hidden) throw new Error("should start collapsed once someone has played");
console.log("returning player  -> collapsed by default, toggle still present: " + !r2.els.howto.hidden);

console.log("\nsmoke4 passed");
