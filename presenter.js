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
  return {
    band: entry.band,
    tone: toneForBand(entry.band),
    points: Model.pointsForBand(entry.band),
    pointsLabel: "+" + Model.pointsForBand(entry.band) + " pts",
    guessLine: "Your guess: " + Model.formatCompact(entry.guess) + " " + question.unit,
    actualLine: "Actual: " + Model.formatCompact(question.answerValue) + " " + question.unit,
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
    puzzleLabel: "Puzzle #" + day,
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

if (typeof module !== "undefined") {
  module.exports = {
    toneForBand: toneForBand,
    validateGuess: validateGuess,
    viewModel: viewModel
  }
}
