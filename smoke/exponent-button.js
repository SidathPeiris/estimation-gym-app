// The scientific-notation button, through the real app.js.
const fs = require("fs"); const vm = require("vm");
const root = require("node:path").resolve(__dirname, "..") + "/";
const html = fs.readFileSync(root + "index.html", "utf8");
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
const M = require(root + "core/Model.js");
const P = require(root + "presenter.js");

function run() {
  const listeners = {};
  const makeEl = (id) => ({
    id, textContent: "", className: "", dataset: {}, style: {}, children: [],
    hidden: false, attrs: {}, value: "", placeholder: "", title: "",
    selectionStart: 0, selectionEnd: 0,
    setSelectionRange(a, b) { this.selectionStart = a; this.selectionEnd = b },
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
  const sandbox = {
    console, URLSearchParams, Promise, JSON, Math, encodeURIComponent,
    fetch: () => Promise.resolve({ ok: false }),
    Image: function () { return {} },
    document: { hidden: false, addEventListener() {}, getElementById: (id) => els[id] || null, createElement: (t) => makeEl("<" + t + ">") },
    window: {
      localStorage: { getItem: (k) => (k in store ? store[k] : null), setItem: (k, v) => { store[k] = String(v) }, removeItem: (k) => { delete store[k] } },
      location: { search: "", pathname: "/", reload() {} }, history: { replaceState() {} },
      navigator: {}, matchMedia: () => ({ matches: false }), addEventListener() {},
      caches: { keys: () => Promise.resolve(["estimation-gym-v20"]) }
    },
    navigator: {}, setTimeout: (fn) => fn && 0
  };
  sandbox.window.window = sandbox.window;
  sandbox.caches = sandbox.window.caches;
  vm.createContext(sandbox);
  for (const f of ["core/Model.js", "core/questions.js", "storage.js", "presenter.js", "app.js"])
    vm.runInContext(fs.readFileSync(root + f, "utf8"), sandbox, { filename: f });
  return {
    els,
    tapExp: () => (listeners["exp:click"] || []).forEach((f) => f({ preventDefault() {} })),
    type(v) { const i = els["guess-input"]; i.value = v; i.selectionStart = i.selectionEnd = v.length }
  };
}

// 1. The everyday case: type digits, tap the button, type the exponent.
let r = run();
r.type("3");
r.tapExp();
if (r.els["guess-input"].value !== "3e") throw new Error("expected 3e, got " + r.els["guess-input"].value);
r.els["guess-input"].value += "12";
const parsed = P.validateGuess(r.els["guess-input"].value);
console.log("typed 3 -> tap -> 12  =>  " + r.els["guess-input"].value + "  parses to " + parsed.value);
if (!parsed.ok || parsed.value !== 3e12) throw new Error("did not parse to 3e12");

// 2. Caret position lands after the e, so the exponent goes in the right place.
if (r.els["guess-input"].selectionStart !== 2) throw new Error("caret should sit after the e");
console.log("caret                =>  after the e, ready for the exponent");

// 3. Inserting mid-value respects the caret rather than appending.
r = run();
r.els["guess-input"].value = "35";
r.els["guess-input"].selectionStart = r.els["guess-input"].selectionEnd = 1;
r.tapExp();
if (r.els["guess-input"].value !== "3e5") throw new Error("expected 3e5, got " + r.els["guess-input"].value);
console.log("caret inside '35'    =>  " + r.els["guess-input"].value);

// 4. A second tap is refused: "3e4e5" is not a number and would be rejected
//    later with no explanation of why.
r = run();
r.type("3");
r.tapExp();
r.els["guess-input"].value += "4";
r.tapExp();
if (r.els["guess-input"].value !== "3e4") throw new Error("second exponent was inserted: " + r.els["guess-input"].value);
console.log("second tap           =>  refused, still " + r.els["guess-input"].value);

// 5. Tapping on an empty field is harmless - "e" alone is simply not valid,
//    and the existing message covers it.
r = run();
r.tapExp();
console.log("tap on empty field   =>  '" + r.els["guess-input"].value + "', validate says: " + P.validateGuess(r.els["guess-input"].value).message);

// 6. Plain digits still work untouched - the common case is not disturbed.
r = run();
r.type("450000000");
const plain = P.validateGuess(r.els["guess-input"].value);
if (!plain.ok || plain.value !== 450000000) throw new Error("plain digits broke");
console.log("plain digits         =>  " + plain.value);

console.log("\nsmoke7 passed");
