// Pure presentation logic: turns state + today's question into everything the
// screen needs, with no DOM and no platform APIs. The Model is passed in rather
// than imported so this same file drives the web view now and a React Native
// view later. Strings here are kept in step with the Omarchy widget so both
// surfaces describe a result identically.

// Mirrors bandColor() in Widget.qml: Bullseye and Close share the accent,
// Ballpark is plain foreground, Off is the urgent colour.
function toneForBand(band) {
  if (band === "Bullseye" || band === "Close") return "accent"
  if (band === "Ballpark") return "neutral"
  return "urgent"
}

function validateGuess(text) {
  var guess = Number(text)
  if (String(text).trim() === "" || !isFinite(guess) || guess <= 0) {
    return { ok: false, message: "Enter a positive number" }
  }
  return { ok: true, value: guess }
}

function resultView(Model, entry, question) {
  if (!entry) return null
  var decades = entry.distanceDecades
  // The answer comes from the stored entry, not from today's question. Growing
  // the bank reshuffles which question falls on which day, so a guess recorded
  // before an update must still be shown against the value it was scored
  // against rather than whatever now occupies that slot.
  var actual = typeof entry.answerValue === "number" ? entry.answerValue : question.answerValue
  return {
    band: entry.band,
    tone: toneForBand(entry.band),
    points: Model.pointsForBand(entry.band),
    pointsLabel: "+" + Model.pointsForBand(entry.band) + " pts",
    guessLine: "Your guess: " + Model.formatCompact(entry.guess) + " " + question.unit,
    actualLine: "Actual: " + Model.formatCompact(actual) + " " + question.unit,
    decadesLine: "Off by " + (decades !== null && decades !== undefined ? decades.toFixed(2) : "?") +
      " orders of magnitude"
  }
}

function statsView(Model, stats) {
  var bars = []
  for (var i = 0; i < Model.BANDS.length; i++) {
    var band = Model.BANDS[i]
    var tally = stats.counts[band] || 0
    bars.push({
      band: band,
      tone: toneForBand(band),
      tally: tally,
      fraction: stats.played > 0 ? tally / stats.played : 0
    })
  }

  return {
    visible: stats.played > 0,
    played: stats.played,
    totalPoints: stats.totalPoints,
    summary: stats.played + " played · " + Model.formatCompact(stats.totalPoints) + " pts",
    footer: "Best streak " + stats.bestStreak + " · median " +
      (stats.medianDecades !== null ? stats.medianDecades.toFixed(2) : "–") + " decades off",
    // Wording comes from the Model so the app and the Omarchy widget describe
    // a lean identically. Null until there are enough days to mean anything.
    calibration: Model.calibrationLabel(stats),
    bars: bars
  }
}

function viewModel(Model, state, question, day) {
  var answered = Model.hasAnsweredDay(state, day)
  var entry = answered ? state.history[String(day)] : null
  var stats = Model.computeStats(state)

  return {
    // The calendar date rather than the day number: everyone playing on a given
    // date still gets the same question, so it stays a shared identifier, but it
    // does not tell a first-time player they are 980 puzzles behind.
    dateLabel: Model.formatDay(day),
    streakLabel: "Streak " + state.streak + " · Best " + state.bestStreak,
    // Present only on questions whose answer drifts with time; timeless ones
    // (physical constants and the like) carry no year.
    asOfLabel: question && question.asOf !== undefined ? "as of " + question.asOf : null,
    prompt: question ? question.prompt : "No question available",
    unit: question ? question.unit : "",
    placeholder: question ? "Guess (" + question.unit + ")" : "",
    answered: answered,
    result: question ? resultView(Model, entry, question) : null,
    hint: question && answered ? "How to think about it: " + question.decompositionHint : null,
    source: question && answered && question.source ? "Source: " + question.source : null,
    stats: statsView(Model, stats)
  }
}

var BAND_EMOJI = { Bullseye: "🎯", Close: "🟢", Ballpark: "🟡", Off: "🔴" }

// Deliberately omits both the guess and the true value. A shared result has to
// be safe to post before other people have played, and the decade distance
// conveys how it went without giving the answer away.
function shareText(Model, state, question, day, url) {
  if (!Model.hasAnsweredDay(state, day)) return null

  var entry = state.history[String(day)]
  var decades = entry.distanceDecades
  var second = (BAND_EMOJI[entry.band] || "") + " " + entry.band
  if (decades !== null && decades !== undefined) {
    second += " · " + decades.toFixed(2) + " decades off"
  }

  var lines = ["Estimation Gym · " + Model.formatDay(day), second, "Streak " + state.streak]
  if (url) lines.push("", url)
  return lines.join("\n")
}

if (typeof module !== "undefined") {
  module.exports = {
    toneForBand: toneForBand,
    validateGuess: validateGuess,
    viewModel: viewModel,
    shareText: shareText,
    BAND_EMOJI: BAND_EMOJI
  }
}
