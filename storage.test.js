const assert = require("node:assert/strict")
const Model = require("./core/Model.js")
const S = require("./storage.js")
const Games = require("./core/games.js")

function fakeBackend(initial) {
  const map = new Map(initial ? Object.entries(initial) : [])
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, v),
    dump: () => map
  }
}

function throwingBackend() {
  return {
    getItem() { throw new Error("SecurityError: storage disabled") },
    setItem() { throw new Error("QuotaExceededError") }
  }
}

// --- empty backend yields a fresh state ---
assert.deepEqual(S.loadState(Model, fakeBackend()), Model.emptyState())

// --- round trip ---
let state = Model.recordAnswer(Model.emptyState(), 12, 60, 100)
const backend = fakeBackend()
assert.equal(S.saveState(state, backend), true)
assert.deepEqual(S.loadState(Model, backend), state, "state survives a save/load round trip")

// --- the stored blob matches the widget's state.json shape ---
const stored = JSON.parse(backend.getItem(S.STORAGE_KEY))
assert.deepEqual(Object.keys(stored).sort(), ["bestStreak", "history", "lastCompletedDay", "streak"])

// --- junk and partial values fall back rather than crashing ---
assert.deepEqual(S.loadState(Model, fakeBackend({ [S.STORAGE_KEY]: "not json" })), Model.emptyState())
assert.deepEqual(S.loadState(Model, fakeBackend({ [S.STORAGE_KEY]: "{}" })), Model.emptyState(),
  "an empty object is not a usable state, same guard as Widget.qml")
assert.deepEqual(S.loadState(Model, fakeBackend({ [S.STORAGE_KEY]: "null" })), Model.emptyState())

// --- a backend that throws (private browsing, storage disabled) must not break the app ---
assert.deepEqual(S.loadState(Model, throwingBackend()), Model.emptyState(),
  "a throwing backend still yields a playable empty state")
assert.equal(S.saveState(state, throwingBackend()), false,
  "a failed save reports false rather than throwing")

// --- export is human-readable and re-importable ---
const exported = S.exportState(state)
assert.deepEqual(JSON.parse(exported), state)
assert.ok(exported.includes("\n"), "exported blob is pretty printed for copy/paste")


// --- forgetDay (the ?reset=today debug affordance) ---

let run = Model.emptyState()
run = Model.recordAnswer(run, 10, 100, 100)   // Bullseye
run = Model.recordAnswer(run, 11, 100, 100)   // Bullseye
run = Model.recordAnswer(run, 12, 100, 100)   // Bullseye
assert.equal(run.streak, 3)
assert.equal(run.bestStreak, 3)

const undone = S.forgetDay(run, 12)
assert.equal(undone.history["12"], undefined, "the day is gone")
assert.equal(undone.history["11"].band, "Bullseye", "the other days survive")
assert.equal(undone.streak, 2, "the streak is rebuilt around the gap")
assert.equal(undone.lastCompletedDay, 11, "so the next answer counts as consecutive")
assert.equal(undone.bestStreak, 3, "the high-water mark is not rewritten")

// Answering again after un-answering must rebuild the same streak, not skip it.
const redone = Model.recordAnswer(undone, 12, 100, 100)
assert.equal(redone.streak, 3)

// A gap in the middle stops the rebuilt streak at the gap.
let gapped = Model.emptyState()
gapped = Model.recordAnswer(gapped, 20, 100, 100)
gapped = Model.recordAnswer(gapped, 21, 100, 100)
gapped = Model.recordAnswer(gapped, 22, 100, 100)
assert.equal(S.forgetDay(gapped, 21).streak, 1, "only day 22 survives contiguously")

// A miss stops it too, exactly as recordAnswer would going forwards.
let missed = Model.emptyState()
missed = Model.recordAnswer(missed, 30, 1, 100000000)   // Off
missed = Model.recordAnswer(missed, 31, 100, 100)
missed = Model.recordAnswer(missed, 32, 100, 100)
assert.equal(S.forgetDay(missed, 32).streak, 1)

// Removing the only day returns something a fresh run can build on.
const emptied = S.forgetDay(Model.recordAnswer(Model.emptyState(), 7, 100, 100), 7)
assert.equal(emptied.streak, 0)
assert.equal(emptied.lastCompletedDay, -1)
assert.deepEqual(emptied.history, {})

// Removing a day that was never answered changes nothing meaningful.
assert.equal(S.forgetDay(run, 999).streak, 3)

// --- importState: restoring an exported history ---
// Export existed with no import at all, so a copied blob could never be put
// back. These pin the behaviour that makes it worth copying.

// A clean restore onto an empty device.
let donor = Model.emptyState()
donor = Model.recordAnswer(donor, 10, 100, 100, false, "q-a")
donor = Model.recordAnswer(donor, 11, 100, 100, false, "q-b")
donor = Model.recordAnswer(donor, 12, 100, 100, false, "q-c")
const blob = S.exportState(donor)

let restored = S.importState(Model, Model.emptyState(), blob)
assert.equal(restored.ok, true)
assert.equal(restored.added, 3)
assert.equal(Object.keys(restored.state.history).length, 3)
assert.equal(restored.state.streak, 3, "the streak is rebuilt, not taken on trust")
assert.equal(restored.state.lastCompletedDay, 12)

// An existing day always wins, so importing an older export cannot delete
// anything played since it was taken.
let newer = Model.emptyState()
newer = Model.recordAnswer(newer, 12, 999, 100, false, "q-c")   // different guess
newer = Model.recordAnswer(newer, 13, 100, 100, false, "q-d")
const onto = S.importState(Model, newer, blob)
assert.equal(onto.ok, true)
assert.equal(onto.added, 2, "days 10 and 11 come back")
assert.equal(onto.skipped, 1, "day 12 is already here and is left alone")
assert.equal(onto.state.history["12"].guess, 999, "the day already on this device is untouched")
assert.equal(onto.state.history["13"].guess, 100, "and nothing already here is lost")
assert.deepEqual(Object.keys(onto.state.history).sort(), ["10", "11", "12", "13"])
assert.equal(onto.state.streak, 4, "the merged run is recomputed across the join")

// A best streak is a record of something that happened.
const keepsBest = S.importState(Model, { history: {}, streak: 0, bestStreak: 9, lastCompletedDay: -1 }, blob)
assert.equal(keepsBest.state.bestStreak, 9, "an existing best streak is not lowered by an import")

// Rubbish in is refused rather than half-applied.
for (const junk of ["", "not json", "[]", "null", '{"nope":1}', '{"history":"no"}']) {
  const res = S.importState(Model, Model.emptyState(), junk)
  assert.equal(res.ok, false, "should refuse: " + junk)
  assert.ok(res.message.length > 0)
}

// Malformed days inside an otherwise valid export are skipped, not stored.
const messyBlob = JSON.stringify({
  history: {
    "20": { guess: 1, answerValue: 1, band: "Close", distanceDecades: 0 },
    "": { band: "Close" },
    "notanumber": { band: "Close" },
    "21": null,
    "22": { guess: 1 }
  },
  streak: 5, bestStreak: 5, lastCompletedDay: 22
})
const messyResult = S.importState(Model, Model.emptyState(), messyBlob)
assert.equal(messyResult.added, 1, "only the one usable day is taken")
assert.deepEqual(Object.keys(messyResult.state.history), ["20"])
assert.equal(messyResult.state.streak, 1, "and the streak reflects what was actually restored, not the claim of 5")

// Importing the same export twice adds nothing the second time.
const once = S.importState(Model, Model.emptyState(), blob)
const twice = S.importState(Model, once.state, blob)
assert.equal(twice.ok, false)
assert.match(twice.message, /already here/)

// A miss breaks the rebuilt streak exactly as it would going forwards.
let withMiss = Model.emptyState()
withMiss = Model.recordAnswer(withMiss, 30, 1, 100000000, false, "q-x")   // Off
withMiss = Model.recordAnswer(withMiss, 31, 100, 100, false, "q-y")
withMiss = Model.recordAnswer(withMiss, 32, 100, 100, false, "q-z")
const afterMiss = S.importState(Model, Model.emptyState(), S.exportState(withMiss))
assert.equal(afterMiss.state.streak, 2, "the run stops at the Off, it does not count through it")


// --- the duplicated streak rule must agree with the Model ---
//
// storage.js cannot import Model - it is injected per call - so it carries its
// own copy of "does this day keep a run alive" as the default for forgetDay and
// streakFrom. Duplicated rules drift, so they are pinned here, the same way
// sw.test.js pins the service worker copy of SCHEDULE_ORIGIN.
//
// Both are also exercised through a custom predicate, because the whole point
// of making it a parameter is that a game scored out of 100 will pass its own.
for (const band of ["Bullseye", "Close", "Ballpark", "Off"]) {
  assert.equal(
    S.defaultExtendsStreak({ band }),
    Model.extendsStreak({ band }),
    `storage.js and Model.js disagree about whether "${band}" extends a streak`
  )
}
assert.equal(S.defaultExtendsStreak(null), false, "a missing entry never extends a run")
assert.equal(Model.extendsStreak(null), false)

{
  // A predicate that only counts Bullseye: the run of Close days must stop.
  let strict = Model.emptyState()
  strict = Model.recordAnswer(strict, 40, 100, 100)    // Bullseye
  strict = Model.recordAnswer(strict, 41, 1000, 100)   // Close
  const onlyBullseye = (e) => !!e && e.band === "Bullseye"

  assert.equal(S.streakFrom(strict.history).streak, 2, "the default rule counts both days")
  assert.equal(
    S.streakFrom(strict.history, onlyBullseye).streak, 0,
    "a stricter rule stops at the most recent day, which is only Close"
  )
  assert.equal(
    S.forgetDay(strict, 41, onlyBullseye).streak, 1,
    "forgetDay honours the predicate too"
  )
  console.log("streak rule       -> shared with the Model, and overridable per game");
}

// --- one key per game, and no migration ---
//
// The whole multi-game state design rests on this: Fermi keeps the legacy
// unnamespaced key and every other game gets a suffixed one. Nothing is
// nested, so nothing needs migrating, and old cached code cannot see or
// clobber another game's key.
{
  assert.equal(S.keyFor(), S.STORAGE_KEY, "no game means Fermi, for every existing caller")
  assert.equal(S.keyFor("fermi"), S.STORAGE_KEY, "Fermi keeps the bare legacy key")
  assert.equal(S.keyFor("records"), "estimation-gym-state:records")
  assert.equal(
    S.keyFor(Games.gameById("fermi")), S.STORAGE_KEY,
    "a registry entry resolves to the key it declares"
  )

  // Two games must not be able to read each other.
  const store = {}
  const backend = {
    getItem: (k) => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v) }
  }

  let fermi = Model.recordAnswer(Model.emptyState(), 900, 100, 100)   // Bullseye
  S.saveState(fermi, backend, "fermi")

  let records = Model.recordAnswer(Model.emptyState(), 900, 1, 1e9)   // Off
  S.saveState(records, backend, "records")

  assert.deepEqual(Object.keys(store).sort(), ["estimation-gym-state", "estimation-gym-state:records"])
  assert.equal(S.loadState(Model, backend, "fermi").streak, 1)
  assert.equal(S.loadState(Model, backend, "records").streak, 0, "a separate streak, not a shared one")
  assert.equal(
    S.loadState(Model, backend).streak, 1,
    "an old caller passing no game still gets Fermi"
  )

  // The downgrade case, which is the one that would cost someone their streak:
  // code that knows nothing about games reads the bare key and finds Fermi
  // exactly as it left it.
  const legacyRead = JSON.parse(store["estimation-gym-state"])
  assert.deepEqual(
    Object.keys(legacyRead).sort(), ["bestStreak", "history", "lastCompletedDay", "streak"],
    "Fermi's blob keeps the exact four-key shape old code expects"
  )
  console.log("per-game keys     -> separate streaks, Fermi unchanged at the legacy key")
}

// --- import accepts a bare blob and a multi-game wrapper ---
{
  let played = Model.recordAnswer(Model.emptyState(), 500, 100, 100)
  const bare = S.exportState(played)

  assert.equal(
    JSON.parse(bare).games, undefined,
    "exportState still writes the bare shape, so an export taken today can be " +
    "pasted into a browser running a stale cached build"
  )

  // A bare blob restores as Fermi, which is what every export ever written is.
  const fromBare = S.importState(Model, Model.emptyState(), bare)
  assert.equal(fromBare.ok, true)
  assert.equal(fromBare.added, 1)

  // A wrapper restores the named game's section.
  const wrapper = JSON.stringify({
    games: {
      fermi: played,
      records: Model.recordAnswer(Model.emptyState(), 600, 100, 100)
    }
  })
  const asFermi = S.importState(Model, Model.emptyState(), wrapper, "fermi")
  assert.equal(asFermi.ok, true)
  assert.ok(asFermi.state.history["500"], "took Fermi's section")
  assert.ok(!asFermi.state.history["600"], "and not another game's")

  const asRecords = S.importState(Model, Model.emptyState(), wrapper, "records")
  assert.ok(asRecords.state.history["600"], "took the records section")

  // A wrapper that has no section for the game being restored into is not
  // silently merged into it - that would put one game's days in another.
  const missing = S.importState(Model, Model.emptyState(), wrapper, "crossword")
  assert.equal(missing.ok, false, "a wrapper with no matching game is refused")

  console.log("import            -> bare blob and wrapper, without mixing games up")
}


console.log("All storage tests passed.")
