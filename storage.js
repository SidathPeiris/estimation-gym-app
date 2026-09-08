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

function exportState(state) {
  return JSON.stringify(state, null, 2)
}

if (typeof module !== "undefined") {
  module.exports = {
    STORAGE_KEY: STORAGE_KEY,
    loadState: loadState,
    saveState: saveState,
    forgetDay: forgetDay,
    exportState: exportState
  }
}
