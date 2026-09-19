// Historical Dates, through the real app.js.
//
// The first game on a second engine, and the first with more than one answer
// control. Everything the other two games share - the prompt, the result card,
// the hint, the streak, the storage key - is already covered elsewhere. What is
// only true here is the answer row: which control appears, what it accepts,
// what the era button does to the number beside it, and whether a date entered
// in one game can leak into another.
//
// The failure this is written against is the silent one. A year submitted
// through the numeric path would be scored by log distance, and log distance
// calls 1969 and 1970 a perfect answer - so a wiring mistake here does not
// throw, it hands out hundreds of points and looks like the game working.
const fs = require("fs"); const vm = require("vm");
const root = require("node:path").resolve(__dirname, "..") + "/";
const html = fs.readFileSync(root + "index.html", "utf8");
const ids = [...html.matchAll(/id="([^"]+)"/g)].map((m) => m[1]);
const initiallyHidden = new Set(
  [...html.matchAll(/<[a-z]+[^>]*>/g)].map((m) => m[0])
    .filter((tag) => / hidden[ >=]/.test(tag))
    .map((tag) => (tag.match(/id="([^"]+)"/) || [])[1]).filter(Boolean)
);

function run({ hash = "#dates", store = {} } = {}) {
  const listeners = {};
  const makeEl = (id) => ({
    id, textContent: "", className: "", dataset: {}, style: {}, children: [],
    hidden: false, attrs: {}, value: "", placeholder: "", title: "", type: "",
    selectionStart: 0, selectionEnd: 0, setSelectionRange() {},
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
                   "games/records/questions.js", "games/dates/questions.js",
                   "storage.js", "presenter.js", "app.js"]) {
    vm.runInContext(fs.readFileSync(root + f, "utf8"), sandbox, { filename: f });
  }

  const fire = (id, ev) => {
    const fns = listeners[id + ":" + ev] || [];
    if (!fns.length) throw new Error("no " + ev + " listener on " + id);
    fns.forEach((fn) => fn({ preventDefault() {} }));
  };

  return {
    els, fire, loc, store,
    tapEra: () => fire("era", "click"),
    answerYear: (v) => { els["guess-input"].value = String(v); fire("guess-form", "submit"); },
    answerDate: (v) => { els["date-input"].value = String(v); fire("guess-form", "submit"); },
    goTo: (id) => { loc.hash = "#" + id; fire("back-to-games", "click"); }
  };
}

const M = require(root + "core/Model.js");
const G = require(root + "core/games.js");
const DATES = require(root + "games/dates/questions.js");

const today = M.dayIndex(new Date());
const dates = G.gameById("dates");
const KEY = dates.storageKey;

// Which question today actually serves, so every assertion below is about the
// question the player would really see rather than about one picked here.
const todays = M.questionForDay(today, DATES, dates.scheduleOrigin);
const mode = M.inputForPrecision(todays.precision);

// 0. The premise.
if (dates.engine !== "date") throw new Error("the dates game is not on the date engine");
if (KEY === G.gameById("fermi").storageKey) throw new Error("dates shares Fermi's storage key");
console.log("today              -> " + todays.id + " (" + todays.precision + ", " + mode + " input)");

// 1. The answer row shows one input and the right modifier button.
{
  const r = run();
  const { els } = r;

  if (mode === "date") {
    if (els["date-input"].hidden) throw new Error("the date field is hidden on a day-precision question");
    if (!els["guess-input"].hidden) throw new Error("the text field is showing alongside the date field");
    if (!els.era.hidden) throw new Error("the era toggle is showing on a date question");
  } else {
    if (els["guess-input"].hidden) throw new Error("the text field is hidden on a year question");
    if (!els["date-input"].hidden) throw new Error("the date field is showing on a year question");
    if (els.era.hidden) throw new Error("the era toggle is hidden on a year question");
    if (els["guess-input"].inputMode !== "numeric") throw new Error("a year field should ask for a numeric keypad");
  }

  // The exponent button belongs to the other engine and must never appear here:
  // it would insert an "e" into a field that rejects anything but digits.
  if (!els.exp.hidden) throw new Error("the exponent button is showing on the date engine");

  // Practice is no longer Fermi's: every live game has a pool of its own now,
  // drawn from its own bank and reserved off its own schedule origin.
  if (els.practice.hidden) throw new Error("Practice is missing on Historical Dates");
  // Suggest still is Fermi's, because submissions land in one D1 table with no
  // game column and would arrive unattributable.
  if (!els.suggest.hidden) throw new Error("Suggest is showing on Historical Dates");
  if (!els.asof.hidden) throw new Error("an 'as of' line is showing - a date does not drift");
  console.log("answer row         -> one input, the right modifier, no Suggest form");
}

// 2. A correct answer scores a hundred and starts a streak, in the right key.
{
  const r = run();
  const answer = M.answerForQuestion(todays);
  if (mode === "date") r.answerDate(answer);
  else {
    // The era button is how a BC year is entered, so a BC answer has to be
    // given the way a player would give it rather than as a negative number.
    if (answer < 0) r.tapEra();
    r.answerYear(Math.abs(answer));
  }

  const saved = JSON.parse(r.store[KEY]);
  const entry = saved.history[String(today)];
  if (!entry) throw new Error("nothing was recorded for today");
  if (entry.band !== "Bullseye") throw new Error("the exact answer did not score a Bullseye, got " + entry.band);
  if (entry.error !== 0) throw new Error("the exact answer was scored " + entry.error + " out");
  if (saved.streak !== 1) throw new Error("a scoring answer did not start a streak");

  // The marker that tells every reader which engine wrote this row.
  // The capsule in the card's corner, which is a different control from the
  // Practice disclosure checked above and is gated on a different thing: the
  // day being answered as well as the game having a pool.
  if (r.els["practice-offer"].hidden) {
    throw new Error("the Practice capsule is not offered after a scored day on Historical Dates");
  }

  if (!entry.errorUnit) throw new Error("the entry carries no errorUnit, so history cannot format it");
  if ("distanceDecades" in entry) throw new Error("a date entry carries distanceDecades, which is not a thing it has");
  if (entry.questionId !== todays.id) throw new Error("the wrong question id was recorded");

  // The four keys, unchanged. Anything extra at the top level is destroyed by
  // the next answer, in any game, by any version of the code.
  const keys = Object.keys(saved).sort().join(",");
  if (keys !== "bestStreak,history,lastCompletedDay,streak") {
    throw new Error("the state grew a fifth top-level key: " + keys);
  }
  console.log("exact answer       -> Bullseye, streak 1, recorded under " + KEY);
}

// 3. Nothing was written to the other games' keys.
{
  const r = run();
  const answer = M.answerForQuestion(todays);
  if (mode === "date") r.answerDate(answer);
  else { if (answer < 0) r.tapEra(); r.answerYear(Math.abs(answer)); }

  for (const other of G.liveGames().filter((g) => g.id !== "dates")) {
    if (r.store[other.storageKey] !== undefined) {
      throw new Error("answering Historical Dates wrote to " + other.storageKey);
    }
  }
  console.log("isolation          -> no other game's key was touched");
}

// 4. The era toggle changes what the number means.
//
// This is the assertion the control exists for. Without it a BC year is simply
// unreachable, and the failure is invisible: 753 entered on a question whose
// answer is 753 BC is 1505 years out, which is Off - indistinguishable from
// somebody guessing badly.
{
  const q = { precision: "year", answerYear: -753 };
  if (M.scoreDate(753, q, false).band !== "Off") {
    throw new Error("a positive year scored against a BC answer should be Off");
  }
  if (M.scoreDate(-753, q, false).band !== "Bullseye") {
    throw new Error("the BC answer itself did not score");
  }

  const r = run();
  if (mode !== "date") {
    const before = r.els.era.textContent;
    r.tapEra();
    const after = r.els.era.textContent;
    if (before === after) throw new Error("the era button did not change when tapped");
    if (!(before === "AD" && after === "BC")) throw new Error("the era button reads " + before + " then " + after);
    if (r.els.era.dataset.bc !== "true") throw new Error("the era button is not marked BC for styling");
    // A control whose visible label changes cannot also be a toggle to a screen
    // reader, so the accessible name has to state the era that is selected.
    if (!/BC/.test(r.els.era.attrs["aria-label"] || "")) {
      throw new Error("the era button's accessible name does not say which era is selected");
    }
    r.tapEra();
    if (r.els.era.textContent !== "AD") throw new Error("the era button did not toggle back");
  }
  console.log("era toggle         -> AD and BC, and BC is reachable at all");
}

// 5. A bad answer is refused rather than scored.
{
  const r = run();
  if (mode === "date") {
    r.answerDate("1969-02-30");
    if (r.els.error.hidden) throw new Error("an impossible date was accepted");
  } else {
    r.answerYear("nineteen eighty nine");
    if (r.els.error.hidden) throw new Error("a year in words was accepted");
    r.answerYear("0");
    if (r.els.error.hidden) throw new Error("year zero was accepted, and there is no year zero");
  }
  if (r.store[KEY] !== undefined) throw new Error("a refused answer was still recorded");
  console.log("bad input          -> refused, nothing recorded");
}

// 6. Moving between games leaves nothing behind in either control.
//
// The same bug that was reported on the Fermi-to-World-Records switch, now with
// two controls to leak through. A stale value is worse than untidy: applyUpdate
// defers a service worker reload while an answer is half-typed, so one left in
// a hidden field stops the app taking new versions at all.
{
  const r = run({ hash: "#fermi" });
  r.els["guess-input"].value = "12345";
  r.loc.hash = "#dates";
  r.fire("window", "hashchange");
  if (r.els["guess-input"].value !== "") throw new Error("the text field kept Fermi's answer into Historical Dates");
  if (r.els["date-input"].value !== "") throw new Error("the date field was not cleared on the way in");

  r.els["date-input"].value = "1969-07-20";
  r.els["guess-input"].value = "1989";
  r.loc.hash = "#records";
  r.fire("window", "hashchange");
  if (r.els["guess-input"].value !== "") throw new Error("a year was carried into World Records");
  if (r.els["date-input"].value !== "") throw new Error("a date was carried into World Records");
  console.log("switching games    -> both controls cleared, in both directions");
}

// 7. The hint is the bracketing advice, and taking it halves the day.
{
  const r = run();
  if (!r.els["hint-toggle"].hidden === false) { /* offered; nothing to assert yet */ }
  r.fire("hint-toggle", "click");
  r.fire("hint-confirm-yes", "click");

  const answer = M.answerForQuestion(todays);
  if (mode === "date") r.answerDate(answer);
  else { if (answer < 0) r.tapEra(); r.answerYear(Math.abs(answer)); }

  const entry = JSON.parse(r.store[KEY]).history[String(today)];
  if (!entry.assisted) throw new Error("the hint was not recorded against the day");
  if (entry.band !== "Bullseye") throw new Error("a hinted exact answer should still be a Bullseye");
  const full = M.BAND_POINTS.Bullseye;
  if (M.pointsForBand(entry.band, true) !== Math.round(full * M.HINT_MULTIPLIER)) {
    throw new Error("a hint did not halve the points");
  }
  // And the streak survives it, as it does in every other game.
  if (JSON.parse(r.store[KEY]).streak !== 1) throw new Error("taking a hint broke the streak");
  console.log("hint               -> halves the points, keeps the streak");
}

// 8. Every question in the bank is answerable through the real submit path.
//
// The engine's own test proves each answer scores; this proves the app can
// carry it there. A question whose control the renderer picks wrongly would be
// unanswerable on its one day, with nothing anywhere saying why.
{
  let checked = 0;
  for (const q of DATES) {
    const expected = M.inputForPrecision(q.precision);
    const answer = M.answerForQuestion(q);
    if (expected === "date" && typeof answer !== "string") throw new Error(q.id + " wants a date and has none");
    if (expected === "year" && typeof answer !== "number") throw new Error(q.id + " wants a year and has none");
    if (M.scoreDate(answer, q, false).band !== "Bullseye") throw new Error(q.id + " cannot score its own answer");
    checked++;
  }
  console.log("whole bank         -> " + checked + " questions, each answerable and scorable");
}

// 9. The How to play panel describes THIS game.
//
// It was built once at boot from a hardcoded Fermi view model, which was true
// while every game shared one guide and silently wrong the moment this one
// brought its own - a date question explaining how to type scientific
// notation. Nothing threw; it just said the wrong thing.
{
  const r = run();
  const steps = r.els["howto-steps"].children.map((c) => c.textContent).join(" ");
  if (/scientific notation/i.test(steps)) throw new Error("the dates guide still explains scientific notation");
  if (/powers of ten/i.test(steps)) throw new Error("the dates guide still talks about powers of ten");
  if (!/BC/.test(steps)) throw new Error("the dates guide never says how to enter a BC year");

  // And it goes back when the player does.
  r.loc.hash = "#fermi";
  r.fire("window", "hashchange");
  const fermiSteps = r.els["howto-steps"].children.map((c) => c.textContent).join(" ");
  if (!/scientific notation/i.test(fermiSteps)) throw new Error("the guide did not change back on Fermi");
  console.log("how to play        -> the dates guide here, the Fermi one there");
}

// 10. Practice on the date engine.
//
// The practice card was written for one game and one engine: a number, a log
// distance, an "orders of magnitude" line. Pointing it at this bank without
// giving it the other two controls would leave a year question with a decimal
// keypad and no era button - and the failure is the silent one this whole file
// is written against, because a year typed into the numeric path scores as a
// log distance and a log distance calls 1969 and 1970 perfect.
{
  const r = run();
  r.fire("practice-toggle", "click");

  const q = r.els["practice-prompt"].textContent;
  if (!q) throw new Error("no practice question was offered on Historical Dates");
  if (!DATES.some((d) => d.prompt === q)) {
    throw new Error("the practice question did not come from the dates bank: " + q);
  }
  if (q === todays.prompt) throw new Error("practice served today's own daily question");

  // Exactly one control, and the right modifier beside it.
  const asked = DATES.find((d) => d.prompt === q);
  const want = M.inputForPrecision(asked.precision);
  if (want === "date") {
    if (r.els["practice-date-input"].hidden) throw new Error("no date field on a day-precision practice question");
    if (!r.els["practice-input"].hidden) throw new Error("the text field is showing alongside the practice date field");
    if (!r.els["practice-era"].hidden) throw new Error("the era toggle is showing on a practice date question");
  } else {
    if (r.els["practice-input"].hidden) throw new Error("no text field on a year practice question");
    if (!r.els["practice-date-input"].hidden) throw new Error("the date field is showing on a year practice question");
    if (r.els["practice-era"].hidden) throw new Error("no era toggle on a year practice question");
    if (r.els["practice-input"].inputMode !== "numeric") {
      throw new Error("the practice year field asks for a decimal keypad");
    }
  }
  if (!r.els["practice-exp"].hidden) throw new Error("the exponent button is showing on the date engine");

  // The exact answer, given the way a player would give it.
  const answer = M.answerForQuestion(asked);
  if (want === "date") {
    r.els["practice-date-input"].value = String(answer);
  } else {
    if (answer < 0) r.fire("practice-era", "click");
    r.els["practice-input"].value = String(Math.abs(answer));
  }
  r.fire("practice-form", "submit");

  if (r.els["practice-result"].hidden) throw new Error("the practice answer was not scored");
  if (r.els["practice-band"].textContent !== "Bullseye") {
    throw new Error("the exact answer scored " + r.els["practice-band"].textContent);
  }
  if (r.els["practice-points"].textContent !== "practice") {
    throw new Error("practice awarded points: " + r.els["practice-points"].textContent);
  }
  // The wording has to be the date engine's, not the log engine's.
  if (/orders of magnitude/.test(r.els["practice-decades"].textContent)) {
    throw new Error("the practice result talks about orders of magnitude on the date engine");
  }
  // Nothing to draw on a log scale, so the strip stays down.
  if (!r.els["practice-decades-ruler"].hidden) {
    throw new Error("the decades ruler is drawn for a date result, which has no ratio to show");
  }
  // The approach line names an estimation archetype, which this engine has none of.
  if (!r.els["practice-approach"].hidden) {
    throw new Error("an approach line is shown on the date engine, which has no archetypes");
  }

  // Scored and forgotten: the daily state is untouched, and the only thing
  // written is this game's own practised list.
  if (r.store[KEY] !== undefined) throw new Error("practice wrote to the daily state");
  const practised = JSON.parse(r.store["estimation-gym-practised:dates"] || "[]");
  if (practised[0] !== asked.id) throw new Error("the practised id was not recorded under the dates key");
  if (r.store["estimation-gym-practised"] !== undefined) {
    throw new Error("a dates practice question was written into Fermi's practised list");
  }
  console.log("practice           -> " + want + " input, Bullseye, no points, " +
              practised.length + " id under its own key");
}

// 11. The practice card does not carry a question between games.
//
// Same class of bug as the answer row above, and worse: a Fermi prompt left on
// screen under World Records would be scored against the wrong bank, and its
// id written into the wrong game's practised list.
{
  const r = run({ hash: "#fermi" });
  r.fire("practice-toggle", "click");
  const fermiPrompt = r.els["practice-prompt"].textContent;
  if (!fermiPrompt) throw new Error("no practice question on Fermi");

  r.loc.hash = "#dates";
  r.fire("window", "hashchange");
  const after = r.els["practice-prompt"].textContent;
  if (after === fermiPrompt) throw new Error("Fermi's practice question survived the move to Historical Dates");
  if (!DATES.some((d) => d.prompt === after)) {
    throw new Error("the practice card is not showing a dates question after the move: " + after);
  }
  if (r.els["practice-date-input"].value !== "") throw new Error("the practice date field was not cleared");
  if (r.els["practice-input"].value !== "") throw new Error("the practice text field was not cleared");
  console.log("practice switch    -> a fresh question from the game you moved to");
}

console.log("\ndates passed");
