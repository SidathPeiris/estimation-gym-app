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

console.log("All storage tests passed.")
