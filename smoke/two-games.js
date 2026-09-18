// Two games, one screen, two streaks that never touch.
//
// This is the harness the whole multi-game design exists to satisfy. Fermi
// Questions and World Records share the engine, the markup and every one of
// the ~90 writes in render() - so the only thing keeping them apart is that
// `game`, `bank`, `question` and `state` are swapped on the way in.
//
// The failure it is written against is the quiet one: World Records answers
// landing in Fermi's localStorage key. That would inflate a real streak with
// days nobody played, and it would look like it had worked.
const fs = require("fs"); const vm = require("vm");
const root = require("node:path").resolve(__dirname, "..") + "/";
const html = fs.readFileSync(root + "index.html", "utf8");
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
const initiallyHidden = new Set(
  [...html.matchAll(/<[a-z]+[^>]*>/g)].map((m) => m[0])
    .filter((tag) => / hidden[ >=]/.test(tag))
    .map((tag) => (tag.match(/id="([^"]+)"/) || [])[1]).filter(Boolean)
);

function run({ hash = "", store = {} } = {}) {
  const listeners = {};
  const makeEl = (id) => ({
    id, textContent: "", className: "", dataset: {}, style: {}, children: [],
    hidden: false, attrs: {}, value: "", placeholder: "", title: "", type: "",
    classList: { add() {}, remove() {}, contains: () => false, toggle() {} },
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

  const loc = { hash, search: "", pathname: "/", origin: "https://estimationgym.app", reload() {} };
  const win = {
    location: loc,
    localStorage: {
      getItem: (k) => (k in store ? store[k] : null),
      setItem: (k, v) => { store[k] = String(v) },
      removeItem: (k) => { delete store[k] }
    },
    history: { replaceState() {} },
    navigator: {}, matchMedia: () => ({ matches: false }),
    addEventListener(ev, fn) { (listeners["window:" + ev] = listeners["window:" + ev] || []).push(fn) },
    atob: (b) => Buffer.from(b, "base64").toString("binary")
  };

  const sandbox = {
    console, URLSearchParams, Promise, JSON, Math, Date,
    encodeURIComponent, decodeURIComponent, escape, unescape,
    Image: function () { return {} },
    fetch: () => Promise.resolve({ ok: false }),
    location: loc,
    document: {
      hidden: false, addEventListener() {},
      getElementById: (id) => els[id] || null,
      createElement: (t) => makeEl("<" + t + ">")
    },
    window: win, navigator: {}, setTimeout: (fn) => fn && 0
  };
  sandbox.window.window = sandbox.window;
  vm.createContext(sandbox);
  for (const f of ["core/Model.js", "core/games.js", "core/questions.js",
                   "games/records/questions.js", "storage.js", "presenter.js", "app.js"]) {
    vm.runInContext(fs.readFileSync(root + f, "utf8"), sandbox, { filename: f });
  }

  const fire = (id, ev) => {
    const fns = listeners[id + ":" + ev] || [];
    if (!fns.length) throw new Error("no " + ev + " listener on " + id);
    fns.forEach((fn) => fn({ preventDefault() {} }));
  };
  const fireWindow = (ev) => (listeners["window:" + ev] || []).forEach((fn) => fn({}));

  // Answer today's question with whatever is on screen.
  const answer = (value) => { els["guess-input"].value = String(value); fire("guess-form", "submit"); };

  return { els, fire, fireWindow, answer, loc, store };
}

const M = require(root + "core/Model.js");
const G = require(root + "core/games.js");
const QUESTIONS = require(root + "core/questions.js");
const RECORDS = require(root + "games/records/questions.js");

const today = M.dayIndex(new Date());
const fermi = G.gameById("fermi");
const records = G.gameById("records");
const FERMI_KEY = fermi.storageKey;
const RECORDS_KEY = records.storageKey;

// 0. The premise. If these two ever resolve to the same key, every assertion
//    below passes for the wrong reason.
if (FERMI_KEY === RECORDS_KEY) throw new Error("both games claim the same storage key");
if (RECORDS_KEY.indexOf(":") < 0) throw new Error("the second game's key is not namespaced");
console.log("keys               -> " + FERMI_KEY + "  |  " + RECORDS_KEY);

// 1. #records opens World Records, not Fermi, and says so.
{
  const r = run({ hash: "#records" });
  if (r.els.home.hidden === false) throw new Error("#records should leave the home screen");
  if (r.els["game-screen"].hidden) throw new Error("#records should open the game screen");
  if (r.els["game-name"].textContent !== records.name) {
    throw new Error("the card is titled '" + r.els["game-name"].textContent + "', not World Records");
  }
  if (r.els["game-icon"].className !== "qcard-mode-icon icon-" + records.icon) {
    throw new Error("the eyebrow is wearing the wrong icon: " + r.els["game-icon"].className);
  }

  // The prompt has to come from the records bank, which is the thing an id
  // swap alone would not catch.
  const expected = M.questionForDay(today, RECORDS, records.scheduleOrigin);
  if (r.els.prompt.textContent !== expected.prompt) {
    throw new Error("expected today's record question, got: " + r.els.prompt.textContent);
  }
  if (r.els["guess-input"].placeholder.indexOf(expected.unit) < 0) {
    throw new Error("the unit hint does not name the record's unit");
  }
  console.log("#records           -> " + r.els.prompt.textContent.slice(0, 58) + "…");
}

// 2. Fermi still gets Fermi's question on the same shared screen.
{
  const r = run({ hash: "#fermi" });
  if (r.els["game-name"].textContent !== fermi.name) throw new Error("#fermi is titled wrongly");
  const expected = M.questionForDay(today, QUESTIONS, fermi.scheduleOrigin);
  if (r.els.prompt.textContent !== expected.prompt) throw new Error("#fermi lost its own bank");
  console.log("#fermi             -> unchanged, same screen, own bank");
}

// 3. The one that matters. Answering World Records must write its own key and
//    leave Fermi's alone - including when Fermi has a real streak sitting in
//    it, which is the state every existing player is actually in.
{
  const played = M.recordAnswer(M.emptyState(), today - 1, 100, 100);
  const store = { [FERMI_KEY]: JSON.stringify(played) };
  const before = store[FERMI_KEY];

  const r = run({ hash: "#records", store });
  r.answer(1);   // deliberately terrible, so the band is Off and nothing is ambiguous

  if (store[FERMI_KEY] !== before) {
    throw new Error("answering World Records rewrote Fermi's key - this is the failure this file exists for");
  }
  if (!store[RECORDS_KEY]) throw new Error("World Records saved nothing at its own key");

  const saved = JSON.parse(store[RECORDS_KEY]);
  const entry = saved.history[String(today)];
  if (!entry) throw new Error("no entry recorded for today");

  // The recorded question id must be the record's, prefixed - that prefix is
  // the only thing keeping the two games' D1 rows apart.
  if (entry.questionId.indexOf(records.idPrefix) !== 0) {
    throw new Error("recorded '" + entry.questionId + "', which is not namespaced to this game");
  }
  console.log("answer records     -> " + RECORDS_KEY + " written, Fermi byte-identical");
  console.log("recorded id        -> " + entry.questionId);
}

// 4. Streaks are independent in both directions, within one session.
{
  const store = {};
  const r = run({ hash: "#fermi", store });
  r.answer(M.questionForDay(today, QUESTIONS, fermi.scheduleOrigin).answerValue);  // exact: Bullseye

  r.loc.hash = "#records";
  r.fireWindow("hashchange");
  r.answer(1);  // Off, so it cannot extend a streak

  const f = JSON.parse(store[FERMI_KEY]);
  const w = JSON.parse(store[RECORDS_KEY]);
  if (f.streak !== 1) throw new Error("Fermi's streak should be 1, got " + f.streak);
  if (w.streak !== 0) throw new Error("an Off day should not start a streak, got " + w.streak);
  if (Object.keys(f.history).length !== 1) throw new Error("Fermi picked up an extra day");
  if (Object.keys(w.history).length !== 1) throw new Error("World Records picked up an extra day");
  console.log("streaks            -> Fermi " + f.streak + ", World Records " + w.streak + ", neither touched the other");
}

// 5. The parts of the screen that belong to Fermi rather than to the engine.
//    Each is hidden on World Records for a reason written down in the
//    registry; a bell here would turn on a reminder about a different game.
{
  const onRecords = run({ hash: "#records" });
  const onFermi = run({ hash: "#fermi" });

  for (const [id, flag] of [["practice", "practice"], ["suggest", "suggest"], ["remind", "reminder"]]) {
    if (fermi[flag] !== true) throw new Error("fermi should declare " + flag);
    if (records[flag] === true) throw new Error("records should not declare " + flag);
    if (!onRecords.els[id].hidden) {
      throw new Error("#" + id + " is showing on World Records, which does not claim " + flag);
    }
  }
  // Practice and Suggest are shown on Fermi. The bell is not asserted here:
  // it also depends on push support, which this sandbox does not have.
  if (onFermi.els.practice.hidden) throw new Error("Practice should still show on Fermi");
  if (onFermi.els.suggest.hidden) throw new Error("Suggest should still show on Fermi");
  console.log("fermi-only parts   -> practice, suggest and the bell, hidden on World Records");
}

// 6. Switching games mid-session must not carry state across. A hint taken on
//    one game is not a hint taken on the other.
{
  const r = run({ hash: "#fermi" });
  r.fire("hint-toggle", "click");
  r.fire("hint-confirm-yes", "click");
  if (r.els.strategy.hidden) throw new Error("the hint did not open on Fermi");

  r.loc.hash = "#records";
  r.fireWindow("hashchange");
  if (!r.els.strategy.hidden) throw new Error("Fermi's hint followed the player to World Records");
  if (r.els["hint-toggle"].hidden) throw new Error("World Records should offer its own hint");

  // …and going back must not have quietly refunded it.
  r.loc.hash = "#fermi";
  r.fireWindow("hashchange");
  if (r.els.strategy.hidden) throw new Error("Fermi's hint was forgotten, which would refund the points");
  console.log("hint state         -> per game, and remembered across a switch");
}

// 7. The answer box must not carry a guess from one game into the other.
//
//    Both games share one input because they share one screen, and nothing
//    cleared it. Two consequences, and the invisible one is worse: a guess
//    typed into Fermi was offered back on World Records as if it were yours,
//    and applyUpdate() holds back a service worker reload while a guess is
//    half-typed - so a leftover value quietly stopped the app taking new
//    versions until the player emptied the box themselves.
{
  const r = run({ hash: "#fermi" });
  r.els["guess-input"].value = "12345";

  r.loc.hash = "#records";
  r.fireWindow("hashchange");
  if (r.els["guess-input"].value !== "") {
    throw new Error("the Fermi guess followed the player to World Records: '" +
      r.els["guess-input"].value + "'");
  }

  // And back the other way, so the fix is not one-directional.
  r.els["guess-input"].value = "999";
  r.loc.hash = "#fermi";
  r.fireWindow("hashchange");
  if (r.els["guess-input"].value !== "") {
    throw new Error("a World Records guess followed the player back to Fermi");
  }

  // An answered day must still clear it, rather than the box being left with
  // whatever was submitted.
  const store = {};
  const r2 = run({ hash: "#fermi", store });
  r2.answer(M.questionForDay(today, QUESTIONS, fermi.scheduleOrigin).answerValue);
  r2.loc.hash = "#records";
  r2.fireWindow("hashchange");
  if (r2.els["guess-input"].value !== "") throw new Error("a submitted guess survived the switch");
  console.log("answer box         -> cleared on every game switch, both directions");
}

console.log("\nsmoke passed: two games, two banks, two streaks, one screen");
