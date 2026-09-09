// Persistence adapter. The backend is injected (localStorage in the browser,
// AsyncStorage in a future native build) and every call is wrapped, because
// localStorage throws outright in some private-browsing modes rather than
// simply returning null.
//
// The stored shape is deliberately identical to the Omarchy widget's
// state.json, so a state blob can be moved between the two by hand even though
// the two installs keep independent streaks.

var STORAGE_KEY = "estimation-gym-state"

function loadState(Model, backend) {
  try {
    var raw = backend.getItem(STORAGE_KEY)
    if (!raw) return Model.emptyState()
    var parsed = JSON.parse(raw)
    // Same guard as Widget.qml: "{}" parses fine but is not a usable state.
    return (parsed && typeof parsed === "object" && parsed.history !== undefined)
      ? parsed
      : Model.emptyState()
  } catch (e) {
    return Model.emptyState()
  }
}

function saveState(state, backend) {
  try {
    backend.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch (e) {
    return false
  }
}

// Debug affordance: drop one day's answer and rebuild the streak around the
// gap, so the pre-answer screen can be looked at without discarding a run.
//
// bestStreak is deliberately left alone. It is a high-water mark of something
// that genuinely happened, and un-answering a day for a screenshot should not
// quietly rewrite the record books.
function forgetDay(state, dayIdx) {
  var history = {}
  for (var key in state.history) {
    if (key !== String(dayIdx)) history[key] = state.history[key]
  }

  var days = Object.keys(history)
    .map(Number)
    .filter(function (d) { return isFinite(d) })
    .sort(function (a, b) { return b - a })

  // Walk back from the most recent day, stopping at the first gap or the
  // first miss - the same rule recordAnswer applies going forwards.
  var streak = 0
  for (var i = 0; i < days.length; i++) {
    if (i > 0 && days[i] !== days[i - 1] - 1) break
    if (history[String(days[i])].band === "Off") break
    streak++
  }

  return {
    history: history,
    streak: streak,
    bestStreak: state.bestStreak,
    lastCompletedDay: days.length ? days[0] : -1
  }
}

// Rebuilds the streak from a history, using the same rule recordAnswer applies
// going forwards: walk back from the most recent day, stopping at the first
// gap or the first miss.
function streakFrom(history) {
  var days = Object.keys(history)
    .filter(function (k) { var n = Number(k); return isFinite(n) && String(n) === k })
    .map(Number)
    .sort(function (a, b) { return b - a })

  var streak = 0
  for (var i = 0; i < days.length; i++) {
    if (i > 0 && days[i] !== days[i - 1] - 1) break
    if (history[String(days[i])].band === "Off") break
    streak++
  }
  return { streak: streak, lastCompletedDay: days.length ? days[0] : -1 }
}

// Restores an exported history.
//
// Merges rather than replaces, and an existing day always wins. Importing an
// older export can therefore only ever add days back, never silently delete
// the ones played since it was taken - which is the failure that would hurt
// most, because it would look like it worked.
function importState(Model, current, rawText) {
  var parsed
  try {
    parsed = JSON.parse(rawText)
  } catch (e) {
    return { ok: false, message: "That does not look like an exported history." }
  }

  if (!parsed || typeof parsed !== "object" || !parsed.history || typeof parsed.history !== "object") {
    return { ok: false, message: "That does not look like an exported history." }
  }

  var merged = {}
  var key
  for (key in current.history) merged[key] = current.history[key]

  var added = 0
  var skipped = 0
  for (key in parsed.history) {
    var entry = parsed.history[key]
    var day = Number(key)
    // Same validation historyDays applies, so nothing enters the store that
    // the rest of the app would then refuse to display.
    if (!entry || !entry.band || !isFinite(day) || String(day) !== key) { skipped++; continue }
    if (Object.prototype.hasOwnProperty.call(merged, key)) { skipped++; continue }
    merged[key] = entry
    added++
  }

  if (!added) {
    return {
      ok: false,
      message: skipped
        ? "Nothing to restore - those days are already here."
        : "That export contains no days."
    }
  }

  var rebuilt = streakFrom(merged)
  return {
    ok: true,
    added: added,
    skipped: skipped,
    state: {
      history: merged,
      streak: rebuilt.streak,
      // A best streak is a record of something that happened, so the higher of
      // the two is kept rather than whichever file was imported last.
      bestStreak: Math.max(current.bestStreak || 0, parsed.bestStreak || 0, rebuilt.streak),
      lastCompletedDay: rebuilt.lastCompletedDay
    },
    message: added === 1
      ? "Restored 1 day."
      : "Restored " + added + " days."
  }
}

function exportState(state) {
  return JSON.stringify(state, null, 2)
}

if (typeof module !== "undefined") {
  module.exports = {
    STORAGE_KEY: STORAGE_KEY,
    loadState: loadState,
    saveState: saveState,
    forgetDay: forgetDay,
    importState: importState,
    streakFrom: streakFrom,
    exportState: exportState
  }
}
