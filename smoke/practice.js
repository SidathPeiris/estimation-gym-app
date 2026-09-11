// Practice mode, through the real app.js.
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

function run({ store = {} } = {}) {
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
    focus() {}
  });
  const els = {};
  for (const id of ids) { els[id] = makeEl(id); if (initiallyHidden.has(id)) els[id].hidden = true; }
  const sandbox = {
    console, URLSearchParams, Promise, JSON, Math, encodeURIComponent, Date, Uint8Array,
    atob: (b) => Buffer.from(b, "base64").toString("binary"),
    fetch: () => Promise.resolve({ ok: false }),
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
  return { els, store, fire };
}

const KEY = "estimation-gym-state";
const PRACTISED = "estimation-gym-practised";
const today = M.dayIndex(new Date());

// 1. Collapsed until asked for, and nothing is drawn behind it.
let r = run();
if (!r.els["practice-body"].hidden) throw new Error("practice should start collapsed");
console.log("collapsed          -> yes");

// 2. Opening it offers a question that is not today's.
r.fire("practice-toggle", "click");
if (r.els["practice-body"].hidden) throw new Error("should open");
const prompt = r.els["practice-prompt"].textContent;
if (!prompt) throw new Error("no practice question offered");
const todaysPrompt = M.questionForDay(today, Q).prompt;
if (prompt === todaysPrompt) throw new Error("practice served today's own question");
console.log("opened             -> " + prompt.slice(0, 52) + "…");
if (r.els["practice-form"].hidden) throw new Error("input should be available");
if (!r.els["practice-result"].hidden) throw new Error("no result before answering");

// 3. Answering scores it but records nothing against the streak.
const stateBefore = r.store[KEY];
r.els["practice-input"].value = "1";
r.fire("practice-form", "submit");
if (r.els["practice-result"].hidden) throw new Error("no result shown");
console.log("answered           -> band " + r.els["practice-band"].textContent +
  ", points slot reads \"" + r.els["practice-points"].textContent + "\"");
if (r.els["practice-points"].textContent !== "practice") throw new Error("practice must not award points");
if (r.store[KEY] !== stateBefore) throw new Error("practice changed the saved daily state");
console.log("streak/stats       -> untouched (" + (stateBefore === undefined ? "still nothing saved" : "unchanged") + ")");
if (r.els["practice-form"].hidden !== true) throw new Error("form should retire after answering");
if (r.els["practice-next"].hidden) throw new Error("Another question should be offered");
if (r.els["practice-approach"].hidden || r.els["practice-hint"].hidden) throw new Error("approach and hint should show");

// 4. The question just practised is remembered, so it does not come round again.
const remembered = JSON.parse(r.store[PRACTISED]);
if (remembered.length !== 1) throw new Error("expected 1 practised id, got " + remembered.length);
console.log("remembered         -> " + remembered[0]);

// 5. Another question gives a different one.
r.fire("practice-next", "click");
const second = r.els["practice-prompt"].textContent;
if (second === prompt) throw new Error("served the same question again");
if (!r.els["practice-result"].hidden) throw new Error("result should clear for the new question");
console.log("another            -> " + second.slice(0, 52) + "…");

// 6. Practice never serves a question already played as a daily.
let played = M.emptyState();
const target = Q[7];
played = M.recordAnswer(played, today - 1, 1, target.answerValue, false, target.id);
r = run({ store: { [KEY]: JSON.stringify(played) } });
r.fire("practice-toggle", "click");
const pool = M.practicePool(Q, played, []);
if (pool.some((q) => q.id === target.id)) throw new Error("a question already played as a daily is still in the pool");
console.log("already played     -> excluded from the pool (" + pool.length + " of " + Q.length + " left)");

// 7. A bad guess is rejected without scoring.
r = run();
r.fire("practice-toggle", "click");
r.els["practice-input"].value = "abc";
r.fire("practice-form", "submit");
if (r.els["practice-error"].hidden) throw new Error("no error shown for junk");
if (!r.els["practice-result"].hidden) throw new Error("junk was scored");
console.log("bad guess          -> " + r.els["practice-error"].textContent + ", nothing scored");

// 8. Exhausting the pool says so instead of breaking.
r = run({ store: { [PRACTISED]: JSON.stringify(Q.map((q) => q.id)) } });
r.fire("practice-toggle", "click");
if (!r.els["practice-prompt"].hidden) throw new Error("should offer no question when exhausted");
console.log("pool exhausted     -> " + r.els["practice-intro"].textContent.slice(0, 58) + "…");

// 9. Practice must never offer a question the daily is about to use, the
//    worst case being the very next day.
{
  const upcoming = new Set();
  for (let d = today; d < today + M.PRACTICE_RESERVE_DAYS; d++) upcoming.add(M.questionForDay(d, Q).id);
  // Keyed on prompt AND the as-of year, not the prompt alone. Six questions in
  // the bank share two prompts - four askings of "What was the world's total
  // human population?" and two of the life-expectancy one - and they are
  // distinguished by their year, which both the daily and the practice panel
  // display. Matching on prompt alone made this fail whenever the reserve
  // window happened to contain one twin while another sat in the pool, which
  // depends on the date and so looked like flakiness.
  const key = (prompt, asof) => prompt + " | " + (asof || "");
  const upcomingKeys = new Set([...upcoming].map((id) => {
    const q = Q.find((x) => x.id === id) || {};
    return key(q.prompt, q.asOf === undefined ? "" : "as of " + M.formatAsOf(q.asOf));
  }));

  const seen = [];
  for (let i = 0; i < 40; i++) {
    const probe = run();
    probe.fire("practice-toggle", "click");
    const shown = probe.els["practice-prompt"].textContent;
    const asof = probe.els["practice-asof"].hidden ? "" : probe.els["practice-asof"].textContent;
    if (shown) seen.push({ prompt: shown, key: key(shown, asof) });
  }
  const spoiled = seen.filter((s) => upcomingKeys.has(s.key));
  console.log("drew " + seen.length + " practice questions -> due within " + M.PRACTICE_RESERVE_DAYS + " days: " + spoiled.length);
  if (spoiled.length) throw new Error("practice offered a question the daily is about to use");
  const tomorrow = M.questionForDay(today + 1, Q);
  const tomorrowKey = key(tomorrow.prompt, tomorrow.asOf === undefined ? "" : "as of " + M.formatAsOf(tomorrow.asOf));
  if (seen.some((s) => s.key === tomorrowKey)) throw new Error("practice offered the next day puzzle");
  console.log("next day question  -> never offered");
}

console.log("\nsmoke11 passed");
