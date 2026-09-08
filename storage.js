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

function exportState(state) {
  return JSON.stringify(state, null, 2)
}

if (typeof module !== "undefined") {
  module.exports = {
    STORAGE_KEY: STORAGE_KEY,
    loadState: loadState,
    saveState: saveState,
    exportState: exportState
  }
}
