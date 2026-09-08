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
  var points = Model.pointsForBand(entry.band, entry.assisted)
  return {
    band: entry.band,
    tone: toneForBand(entry.band),
    assisted: !!entry.assisted,
    points: points,
    pointsLabel: "+" + points + " pts" + (entry.assisted ? " · hint" : ""),
    guessLine: "Your guess: " + Model.formatCompact(entry.guess) + " " + question.unit,
    actualLine: "Actual: " + Model.formatCompact(actual) + " " + question.unit,
    decadesLine: "Off by " + (decades !== null && decades !== undefined ? decades.toFixed(2) : "?") +
      " orders of magnitude"
  }
}

// How many past days the panel lists before offering to show the rest.
var HISTORY_PAGE = 20

// Past results, newest first.
//
// Only what was actually recorded is shown: the date, the band, the guess and
// the value it was scored against. The question text is deliberately absent -
// it is not stored, and it cannot be looked up by day either, because growing
// the bank reshuffles which question falls on which date. Naming a question
// here would eventually name the wrong one.
function historyView(Model, state, limit) {
  // Selection and ordering come from the Model, shared with the widget's
  // history strip, so the two surfaces cannot disagree about which days
  // exist. Only the formatting below is app-specific.
  var days = Model.historyDays(state)

  var total = days.length
  var shown = (limit > 0 && limit < total) ? days.slice(0, limit) : days

  var rows = shown.map(function (item) {
    var entry = item.entry
    var decades = entry.distanceDecades
    var scoredAgainst = typeof entry.answerValue === "number" ? entry.answerValue : null

    return {
      day: item.day,
      dateLabel: Model.formatDay(item.day),
      band: entry.band,
      tone: toneForBand(entry.band),
      assisted: !!entry.assisted,
      // Present only on days recorded since questionId began being stored.
      // Older rows simply cannot be compared - the question they asked is not
      // recoverable, because growing the bank reshuffles day to question.
      questionId: entry.questionId || null,
      points: Model.pointsForBand(entry.band, entry.assisted),
      guessLabel: Model.formatCompact(entry.guess),
      actualLabel: scoredAgainst !== null ? Model.formatCompact(scoredAgainst) : "?",
      decadesLabel: (decades !== null && decades !== undefined) ? decades.toFixed(2) : "?"
    }
  })

  return { visible: total > 0, rows: rows, total: total, shown: rows.length }
}

// How everyone else did on the same question, as bars in the same visual
// language as the personal stats panel.
//
// `dist` is whatever the distribution endpoint returned, or null when the
// feature is switched off, the request failed, or the app is offline. Every
// one of those is an ordinary state rather than an error: the puzzle does not
// depend on it.
function distributionView(Model, dist, myBand) {
  if (!dist) return { visible: false }

  if (!dist.enough) {
    return {
      visible: true,
      enough: false,
      n: dist.n || 0,
      note: (dist.n || 0) === 1
        ? "1 person has answered this one so far - too few to compare against yet."
        : (dist.n || 0) + " people have answered this one so far - too few to compare against yet."
    }
  }

  var counts = dist.counts || {}
  var total = 0
  for (var i = 0; i < Model.BANDS.length; i++) total += counts[Model.BANDS[i]] || 0
  if (!total) return { visible: false }

  var bars = Model.BANDS.map(function (band) {
    var tally = counts[band] || 0
    return {
      band: band,
      tone: toneForBand(band),
      tally: tally,
      fraction: tally / total,
      mine: band === myBand
    }
  })

  // Bands run best to worst, so everyone in a later band did worse than you.
  // Deliberately "better than", not a percentile: it does not claim to break
  // ties inside your own band.
  var beaten = 0
  var seenMine = false
  for (var j = 0; j < Model.BANDS.length; j++) {
    if (seenMine) beaten += counts[Model.BANDS[j]] || 0
    if (Model.BANDS[j] === myBand) seenMine = true
  }

  // The chart only ever appears on a question the player has answered, so
  // their own response is always inside these counts. At a total of one, that
  // response is the only one there is - reporting "you did better than 0% of
  // them" would be comparing someone against themselves.
  var solo = total === 1

  return {
    visible: true,
    enough: true,
    n: total,
    solo: solo,
    bars: bars,
    summary: solo
      ? "You are the first to answer this one"
      : total + " people have answered this",
    comparison: solo
      ? "Check back once others have played."
      : (myBand
        ? "You did better than " + Math.round((beaten / total) * 100) + "% of them"
        : null)
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
      (stats.medianDecades !== null ? stats.medianDecades.toFixed(2) : "–") + " decades off" +
      (stats.assisted > 0 ? " · " + stats.assisted + " with a hint" : ""),
    // Wording comes from the Model so the app and the Omarchy widget describe
    // a lean identically. Null until there are enough days to mean anything.
    calibration: Model.calibrationLabel(stats),
    bars: bars
  }
}

// `hintShown` is the live UI flag for today, not persisted state: once the day
// is answered the entry's own `assisted` flag is what counts.
// The guide, shaped for rendering. Content comes from the Model so the widget
// and the app teach identical rules.
function howToPlayView(Model) {
  var guide = Model.HOW_TO_PLAY
  return {
    title: guide.title,
    steps: guide.steps,
    scoringIntro: guide.scoringIntro,
    scoring: Model.scoringRows().map(function (row) {
      return {
        band: row.band,
        tone: toneForBand(row.band),
        meaning: row.meaning,
        pointsLabel: row.points + " pts"
      }
    }),
    notes: [guide.streakNote, guide.hintNote, guide.statsNote]
  }
}

function viewModel(Model, state, question, day, historyLimit, hintShown) {
  var answered = Model.hasAnsweredDay(state, day)
  var entry = answered ? state.history[String(day)] : null
  var stats = Model.computeStats(state)
  var limit = historyLimit === undefined ? HISTORY_PAGE : historyLimit
  var strategy = question ? Model.strategyFor(question) : null

  return {
    // The calendar date rather than the day number: everyone playing on a given
    // date still gets the same question, so it stays a shared identifier, but it
    // does not tell a first-time player they are 980 puzzles behind.
    dateLabel: Model.formatDay(day),
    streakLabel: "Streak " + state.streak + " · Best " + state.bestStreak,
    // Present only on questions whose answer drifts with time; timeless ones
    // (physical constants and the like) carry no year.
    asOfLabel: question && question.asOf !== undefined
      ? "as of " + Model.formatAsOf(question.asOf)
      : null,
    prompt: question ? question.prompt : "No question available",
    unit: question ? question.unit : "",
    placeholder: question ? "Guess (" + question.unit + ")" : "",
    answered: answered,
    result: question ? resultView(Model, entry, question) : null,
    // The archetype names the shape of the problem. It is offered before
    // answering (at half points) and shown afterwards regardless, because the
    // shape is the part that transfers to the next question.
    strategyLabel: strategy ? "Approach: " + strategy.label : null,
    strategyGuidance: strategy ? strategy.guidance : null,
    // Offer the button only while it can still be taken.
    hintAvailable: !!(strategy && !answered && !hintShown),
    hintRevealed: !!(strategy && !answered && hintShown),
    hint: question && answered ? "How to think about it: " + question.decompositionHint : null,
    source: question && answered && question.source ? "Source: " + question.source : null,
    stats: statsView(Model, stats),
    history: historyView(Model, state, limit),
    howToPlay: howToPlayView(Model)
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

  if (entry.assisted) second += " · hint"

  var lines = ["Estimation Gym · " + Model.formatDay(day), second, "Streak " + state.streak]
  if (url) lines.push("", url)
  return lines.join("\n")
}

if (typeof module !== "undefined") {
  module.exports = {
    toneForBand: toneForBand,
    validateGuess: validateGuess,
    viewModel: viewModel,
    historyView: historyView,
    distributionView: distributionView,
    howToPlayView: howToPlayView,
    shareText: shareText,
    BAND_EMOJI: BAND_EMOJI,
    HISTORY_PAGE: HISTORY_PAGE
  }
}
