// Persistence adapter. The backend is injected (localStorage in the browser,
// AsyncStorage in a future native build) and every call is wrapped, because
// localStorage throws outright in some private-browsing modes rather than
// simply returning null.
//
// The stored shape is deliberately identical to the Omarchy widget's
// state.json, so a state blob can be moved between the two by hand even though
// the two installs keep independent streaks.

var STORAGE_KEY = "estimation-gym-state"

// Fermi Questions' streak rule, and the default for the two functions below
// that rebuild a streak backwards from history.
//
// This duplicates Model.extendsStreak rather than calling it, because Model is
// injected per call here - storage.js never imports it - and these two
// functions are reachable without one. Duplicated constants drift, so
// storage.test.js pins the two to agree, exactly as sw.test.js pins the
// service worker's copy of SCHEDULE_ORIGIN.
function defaultExtendsStreak(entry) {
  return !!entry && entry.band !== "Off"
}

// One localStorage key per game, and no nesting. Ever.
//
// The obvious multi-game shape is { history, streak, …, games: { … } }. It
// cannot work here: Model.recordAnswer returns a fresh four-key object literal
// rather than spreading state, and so do forgetDay and importState below. Any
// extra top-level key is therefore destroyed on the next answer - not only by
// stale cached code, but by any code at all.
//
// Separate keys sidestep it completely. Fermi keeps the legacy unnamespaced
// key so existing players need no migration whatsoever, and a second game's key
// is invisible to old code, which cannot read it and cannot clobber it. There
// is no migration function in this file because there is nothing to migrate.
function keyFor(game) {
  if (!game) return STORAGE_KEY
  if (typeof game === "string") {
    return game === "fermi" ? STORAGE_KEY : STORAGE_KEY + ":" + game
  }
  return game.storageKey || STORAGE_KEY
}

function loadState(Model, backend, game) {
  try {
    var raw = backend.getItem(keyFor(game))
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

function saveState(state, backend, game) {
  try {
    backend.setItem(keyFor(game), JSON.stringify(state))
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
function forgetDay(state, dayIdx, extendsStreak) {
  var keeps = typeof extendsStreak === "function" ? extendsStreak : defaultExtendsStreak
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
    if (!keeps(history[String(days[i])])) break
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
//
// `extendsStreak` is optional and defaults to Fermi Questions' rule, which is
// Model.extendsStreak - "anything better than Off". It is a parameter because a
// game scored continuously out of 100 needs a threshold instead of a band name,
// and this function should not have to know which game it is rebuilding. Same
// idiom as reservedForDaily's reserveDays and pickPractice's random: optional,
// trailing, defaulted, so no existing caller changes.
function streakFrom(history, extendsStreak) {
  var keeps = typeof extendsStreak === "function" ? extendsStreak : defaultExtendsStreak
  var days = Object.keys(history)
    .filter(function (k) { var n = Number(k); return isFinite(n) && String(n) === k })
    .map(Number)
    .sort(function (a, b) { return b - a })

  var streak = 0
  for (var i = 0; i < days.length; i++) {
    if (i > 0 && days[i] !== days[i - 1] - 1) break
    if (!keeps(history[String(days[i])])) break
    streak++
  }
  return { streak: streak, lastCompletedDay: days.length ? days[0] : -1 }
}

// Permissive reader, conservative writer.
//
// A file pasted into the Restore box may be a bare blob taken from any build
// ever shipped, or a multi-game wrapper taken from a later one. This accepts
// both; exportState below still emits the bare shape, because an export taken
// today may be pasted into a browser running a stale cached build that would
// reject anything it did not recognise.
function historyFrom(parsed, gameId) {
  if (!parsed || typeof parsed !== "object") return null

  // A wrapper: { games: { fermi: {history,…}, records: {history,…} } }
  if (parsed.games && typeof parsed.games === "object") {
    var section = parsed.games[gameId || "fermi"]
    if (!section || typeof section !== "object" || !section.history) return null
    return section
  }

  // A bare blob. Every export written before games existed is Fermi's.
  if (parsed.history && typeof parsed.history === "object") return parsed

  return null
}

// Restores an exported history.
//
// Merges rather than replaces, and an existing day always wins. Importing an
// older export can therefore only ever add days back, never silently delete
// the ones played since it was taken - which is the failure that would hurt
// most, because it would look like it worked.
function importState(Model, current, rawText, gameId) {
  var outer
  try {
    outer = JSON.parse(rawText)
  } catch (e) {
    return { ok: false, message: "That does not look like an exported history." }
  }

  var parsed = historyFrom(outer, gameId)
  if (!parsed) {
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
    keyFor: keyFor,
    historyFrom: historyFrom,
    defaultExtendsStreak: defaultExtendsStreak,
    exportState: exportState
  }
}
