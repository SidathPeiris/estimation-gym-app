const assert = require("node:assert/strict")
const Model = require("./core/Model.js")
const S = require("./storage.js")

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

console.log("All storage tests passed.")
