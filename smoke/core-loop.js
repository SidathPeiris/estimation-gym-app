// Runs the real app.js against a minimal DOM shim built from the ids actually
// present in index.html. Catches the failure that has bitten twice: a render
// path referencing something that does not exist, throwing, and leaving a
// blank page.
const fs = require("fs");
const vm = require("vm");
const root = require("node:path").resolve(__dirname, "..") + "/";

const html = fs.readFileSync(root + "index.html", "utf8");
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);

const listeners = {};
function makeEl(id) {
  return {
    id, textContent: "", classList: { add() {}, remove() {}, contains: () => false, toggle() {} }, className: "", placeholder: "", title: "",
    dataset: {}, style: {}, children: [], hidden: false, attrs: {},
    setAttribute(k, v) { this.attrs[k] = v; if (k === "hidden") this.hidden = true },
    removeAttribute(k) { delete this.attrs[k]; if (k === "hidden") this.hidden = false },
    append(...c) { this.children.push(...c) },
    appendChild(c) { this.children.push(c) },
    replaceChildren(...c) { this.children = c },
    addEventListener(ev, fn) { (listeners[id + ":" + ev] = listeners[id + ":" + ev] || []).push(fn) },
    focus() {}, value: ""
  };
}
const els = {};
for (const id of ids) els[id] = makeEl(id);

const store = {};
const sandbox = {
  console,
  // The app now posts results to a distribution endpoint; stub it so this
  // harness exercises the UI rather than the network.
  fetch: () => Promise.resolve({ ok: false }),
  document: {
    hidden: false,
    addEventListener() {},
    getElementById: (id) => els[id] || null,
    createElement: (tag) => makeEl("<" + tag + ">")
  },
  window: {
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v) },
      removeItem: (k) => { delete store[k] }
    },
    addEventListener() {}
  },
  navigator: {},
  setTimeout: () => {}
};
sandbox.window.window = sandbox.window;
vm.createContext(sandbox);

for (const f of ["core/Model.js", "core/questions.js", "storage.js", "presenter.js", "app.js"]) {
  vm.runInContext(fs.readFileSync(root + f, "utf8"), sandbox, { filename: f });
}

function fire(id, ev, arg) {
  const fns = listeners[id + ":" + ev] || [];
  if (!fns.length) throw new Error("no " + ev + " listener on " + id);
  for (const fn of fns) fn(arg || { preventDefault() {} });
}

// 1. First load: prompt rendered, hint offered, no result yet.
if (!els.prompt.textContent || els.prompt.textContent === "Loading…") throw new Error("prompt did not render");
console.log("prompt:        " + els.prompt.textContent.slice(0, 70));
console.log("date:          " + els.puzzle.textContent);
if (els["hint-toggle"].hidden) throw new Error("hint should be offered before answering");
if (!els.strategy.hidden) throw new Error("guidance should be hidden until the hint is taken");
if (!els.result.hidden) throw new Error("result should be hidden before answering");
console.log("hint offered:  yes");

// 2. Take the hint.
fire("hint-toggle", "click");
if (els.strategy.hidden) throw new Error("guidance did not appear");
if (!els["hint-toggle"].hidden) throw new Error("offer should withdraw once taken");
console.log("approach:      " + els["strategy-label"].textContent);
console.log("guidance:      " + els["strategy-guidance"].textContent.slice(0, 68) + "...");

// 3. Answer exactly right; a hinted Bullseye must score 50, not 100.
els["guess-input"].value = String(
  vm.runInContext("ModelAPI.questionForDay(ModelAPI.dayIndex(new Date()), QUESTIONS).answerValue", sandbox)
);
fire("guess-form", "submit");
if (els.result.hidden) throw new Error("result did not appear");
console.log("band/points:   " + els.band.textContent + "  " + els.points.textContent);
if (els.points.textContent !== "+50 pts · hint") throw new Error("expected a halved, marked score, got " + els.points.textContent);
if (!els["guess-form"].hidden) throw new Error("guess form should retire once answered");
if (els.approach.hidden) throw new Error("approach line should show after answering");
console.log("after answer:  " + els.approach.textContent);
console.log("stats footer:  " + els["stats-footer"].textContent);
if (!els["stats-footer"].textContent.includes("with a hint")) throw new Error("stats should note the hinted day");

console.log("\nsmoke passed: hint offered -> taken -> halved score -> recorded");
