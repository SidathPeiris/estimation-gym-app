// Pure presentation logic: turns state + today's question into everything the
// screen needs, with no DOM and no platform APIs. The Model is passed in rather
// than imported so this same file drives the web view now and a React Native
// view later.
//
// The strings here were written to match the Omarchy widget word for word, so
// a result read the same in a 300px shell bar as in the browser. That widget is
// finished and takes no further changes, so the constraint is lifted: these
// words are now only answerable to this app. They are still good words - the
// discipline of fitting a bar made them plainer than they would otherwise have
// been - so change them because something is better, not because nothing is
// stopping you.

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

// A year, as typed into the year field with the era toggle applied.
//
// The era is a separate control rather than a minus sign because a phone's
// numeric keypad has no minus, which is the same reason the exponent button
// exists on the other two games.
function validateYear(text, bc, Model) {
  var raw = String(text === undefined || text === null ? "" : text).trim()
  if (raw === "") return { ok: false, message: "Enter a year" }
  if (!/^\d{1,6}$/.test(raw)) return { ok: false, message: "Enter a year as digits" }

  var year = Number(raw)
  // There is no year zero, and nobody has ever written one down. Rejected
  // rather than quietly nudged to 1, which would score a guess the player did
  // not make.
  if (year === 0) return { ok: false, message: "There is no year zero" }
  if (!bc && year > new Date().getFullYear() + 1) {
    return { ok: false, message: "That year has not happened yet" }
  }
  return { ok: true, value: bc ? -year : year }
}

// A calendar date, as the date field produces it: always YYYY-MM-DD, whatever
// order the browser chose to show the player.
function validateDate(text, Model) {
  var raw = String(text === undefined || text === null ? "" : text).trim()
  if (raw === "") return { ok: false, message: "Pick a date" }
  if (Model.dayNumberForDate(raw) === null) return { ok: false, message: "That is not a real date" }
  return { ok: true, value: raw }
}

// A result on the date engine.
//
// Deliberately the same keys resultView returns, so the renderer writes the
// same elements for both games and there is no second result card to keep in
// step. What differs is every string, because none of them can say "orders of
// magnitude" about a year.
function dateResultView(Model, entry, question) {
  if (!entry) return null
  var points = Model.pointsForBand(entry.band, entry.assisted)

  // From the stored entry, not from today's question. Growing a bank
  // reshuffles which question falls on which day, so a guess recorded before
  // an update must still be shown against what it was actually scored against.
  var answer = entry.answerValue !== undefined ? entry.answerValue : Model.answerForQuestion(question)
  var asDate = typeof answer === "string"

  var error = entry.error
  var unit = entry.errorUnit || "years"
  var missed = (error === null || error === undefined || !isFinite(error))
    ? "?"
    : (error === 0 ? "Exactly right" : "Off by " + error + " " + (error === 1 ? unit.replace(/s$/, "") : unit))

  return {
    band: entry.band,
    tone: toneForBand(entry.band),
    assisted: !!entry.assisted,
    points: points,
    pointsLabel: "+" + points + " pts" + (entry.assisted ? " · hint" : ""),
    guessLine: "Your answer: " + (asDate ? Model.formatFullDate(entry.guess) : Model.formatYear(entry.guess)),
    actualLine: "Actual: " + (asDate ? Model.formatFullDate(answer) : Model.formatYear(answer)),
    decadesLine: missed,
    // Nothing to draw on a log scale. The percentile strip reads this and
    // hides itself when it is null, which is the right answer for a game
    // whose distance is not a ratio.
    decades: null
  }
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
      " orders of magnitude",
    // The same distance as a number rather than a sentence, for a view that
    // wants to draw it instead of state it. decadesLine stays the wording of
    // record - the Omarchy widget reads that and nothing else - so this is
    // additive and nothing downstream has to change to ignore it. null when
    // the distance is unknown, which is the case decadesLine renders as "?".
    decades: decades !== null && decades !== undefined ? decades : null
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

    // Which engine recorded this row, read off the row itself rather than
    // passed in. A date entry carries errorUnit and no distanceDecades, so a
    // history list formats correctly without knowing which game it belongs to -
    // and a state file that somehow held both would still render both.
    if (entry.errorUnit) {
      var asDate = typeof entry.answerValue === "string"
      var format = asDate
        ? function (v) { return Model.formatFullDate(v) }
        : function (v) { return Model.formatYear(v) }
      return {
        day: item.day,
        dateLabel: Model.formatDay(item.day),
        band: entry.band,
        tone: toneForBand(entry.band),
        assisted: !!entry.assisted,
        questionId: entry.questionId || null,
        points: Model.pointsForBand(entry.band, entry.assisted),
        guessLabel: format(entry.guess),
        actualLabel: entry.answerValue !== undefined ? format(entry.answerValue) : "?",
        decadesLabel: (typeof entry.error === "number" && isFinite(entry.error))
          ? entry.error + " " + entry.errorUnit
          : "?"
      }
    }

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
// How the confession count reads. Kept here rather than in app.js so the
// wording is testable, and phrased lightly - the whole point of asking is that
// it is a joke, not an accusation.
function confessionNote(n) {
  if (!n) return null
  return n === 1
    ? "1 person has owned up to looking this one up."
    : n + " people have owned up to looking this one up."
}

// Where a guess landed among everyone who answered the same question.
//
// The four bands are too coarse to answer "how did I do" honestly - Ballpark
// covers everything from 10x to 100x, so two people in the same bar can be an
// order of magnitude apart. The decade spread is already collected, so this
// costs nothing to say.
//
// Only people strictly further off are counted as beaten. Decades are whole
// numbers, so ties are common and claiming them would inflate every score;
// "closer than" should mean closer, not "at least as close as".
var PERCENTILE_MIN = 5

function percentileView(dist, myDecades) {
  if (!dist || !dist.enough) return null
  if (typeof myDecades !== "number" || !isFinite(myDecades)) return null

  var spread = dist.decades
  if (!spread) return null

  var sample = 0
  var beaten = 0
  var tied = 0
  for (var key in spread) {
    if (!Object.prototype.hasOwnProperty.call(spread, key)) continue
    var tally = spread[key]
    if (typeof tally !== "number" || tally <= 0) continue
    var decade = Number(key)
    sample += tally
    if (decade > myDecades) beaten += tally
    else if (decade === myDecades) tied += tally
  }

  // Below this it is arithmetic about a handful of people dressed up as a
  // ranking. One other player makes every answer 0% or 100%.
  if (sample < PERCENTILE_MIN) return null

  // Your own submission is in the table. Comparing yourself with yourself is
  // not a comparison, so take it out of both the tie count and the sample.
  var others = sample - 1
  if (others < 1) return null
  if (tied > 0) tied -= 1

  var fraction = beaten / others
  var percent = Math.round(fraction * 100)

  var text
  if (percent >= 99 && beaten === others) text = "Closer than everyone else who answered."
  else if (percent <= 1 && beaten === 0) text = "Everyone else got closer than you on this one."
  else text = "Closer than " + percent + "% of the " + others + " others who answered."

  return {
    visible: true,
    percent: percent,
    beaten: beaten,
    tied: tied,
    others: others,
    text: text
  }
}

function distributionView(Model, dist, myBand) {
  if (!dist) return { visible: false }
  var confessed = confessionNote(dist.confessed)

  if (!dist.enough) {
    return {
      visible: true,
      enough: false,
      n: dist.n || 0,
      confessed: confessed,
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
    confessed: confessed,
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

// Which shapes of problem the player is strong and weak on, ready to render.
//
// Deliberately quiet when it has nothing trustworthy to say: no headline until
// two shapes have enough plays to compare, and a plain note when older days
// cannot be attributed at all.
function archetypeView(Model, state, bank) {
  var a = Model.archetypeStats(state, bank)

  if (!a.rows.length) {
    return {
      visible: a.unattributed > 0,
      headline: null,
      note: a.unattributed > 0
        ? "Your earlier days were recorded before the app tracked which question was which, so they cannot be broken down by type. Days from here on will be."
        : null,
      rows: []
    }
  }

  var rows = a.rows.map(function (r) {
    return {
      label: r.label,
      played: r.played,
      ranked: r.ranked,
      medianLabel: r.medianDecades === null ? "–" : r.medianDecades.toFixed(2) + " dec",
      detail: r.played === 1 ? "1 played" : r.played + " played"
    }
  })

  var headline = null
  if (a.best && a.worst && a.best.strategy !== a.worst.strategy) {
    headline = "Strongest on " + a.best.label.toLowerCase() +
      ". Weakest on " + a.worst.label.toLowerCase() + "."
  }

  var note = null
  if (!headline) {
    note = "Play a few more days and this will tell you which kinds of question you are best and worst at."
  } else if (a.unattributed > 0) {
    note = a.unattributed === 1
      ? "1 earlier day is not included — it predates the app recording which question was asked."
      : a.unattributed + " earlier days are not included — they predate the app recording which question was asked."
  }

  return { visible: true, headline: headline, note: note, rows: rows }
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

// The practice card: the same question, drawn from a pool instead of from the
// calendar.
//
// This function exists to end a duplication the comment below has been
// complaining about for two releases. renderPractice used to re-derive the
// band tone, the points label and both result lines by hand, and the copies
// had already drifted from the daily's. Now practice and the daily build their
// result from the same two functions - resultView on the log engine,
// dateResultView on the date engine - and the renderer writes the same
// elements for both.
//
// `result` is what scoreGuess or scoreDate returned, with the guess attached.
// It is not a stored history entry and never becomes one: practice is scored
// and then forgotten, so nothing here reads or writes state.
var PRACTICE_POINTS_LABEL = "practice"

function practiceView(Model, game, question, result) {
  var isDate = !!game && game.engine === "date"

  if (!question) {
    return {
      exhausted: true,
      intro: "You have worked through every question the daily puzzle has not used yet. " +
        "Nothing left to practise on — which is quite the achievement.",
      prompt: null,
      asOfLabel: null,
      input: "number",
      placeholder: "",
      answered: false,
      result: null,
      strategyLabel: null,
      hint: null,
      source: null
    }
  }

  // Which of the three answer controls this question wants. The log engine has
  // one; the date engine chooses between a year and a calendar date the same
  // way the daily does, from the question's own precision.
  var input = isDate ? Model.inputForPrecision(question.precision) : "number"

  var view = null
  if (result) {
    view = isDate
      ? dateResultView(Model, result, question)
      : resultView(Model, result, question)
    // The one string practice does not share. Practice earns nothing, and a
    // number in this slot would say otherwise.
    view.pointsLabel = PRACTICE_POINTS_LABEL
  }

  return {
    exhausted: false,
    intro: "A question the daily puzzle has not given you. Scored the same way, " +
      "but it does not touch your streak, your stats, or what other players see.",
    prompt: question.prompt,
    // Only the log engine has one. A historical date does not go stale.
    asOfLabel: question.asOf !== undefined ? "as of " + Model.formatAsOf(question.asOf) : null,
    input: input,
    placeholder: isDate ? (input === "date" ? "" : "Year") : "Guess (" + question.unit + ")",
    answered: !!result,
    result: view,
    // The archetype taxonomy is about ways to estimate a quantity, so the date
    // engine has nothing to name here.
    strategyLabel: isDate ? null : "Approach: " + Model.strategyFor(question).label,
    hint: "How to think about it: " + question.decompositionHint,
    source: question.source ? "Source: " + question.source : null
  }
}

// `hintShown` is the live UI flag for today, not persisted state: once the day
// is answered the entry's own `assisted` flag is what counts.
// The home screen: one card per game.
//
// Every string a player reads on that screen comes from here rather than from
// the renderer. That rule exists because of renderPractice, which is the app's
// only other second render path: it re-derived the band, the points label and
// the result lines inline instead of calling resultView, and the two have since
// drifted - the daily's points label comes from the presenter, practice's is a
// hardcoded string. Duplicating DOM writes is fine. Duplicating wording is how
// two surfaces start saying different things about the same event.
//
// `statesById` maps a game id to its loaded state, or leaves it out. A game
// with no state has simply never been played, which is not an error and reads
// as no streak rather than a zero.
function homeView(Model, games, statesById, today) {
  var cards = (games || []).map(function (game) {
    var card = {
      id: game.id,
      name: game.name,
      // The name of a drawing, not a drawing. The renderer turns it into a
      // class and app.css turns that into a mask - so this stays a view model
      // of words and identifiers, with no markup in it.
      icon: game.icon || null,
      tagline: game.tagline,
      playable: game.status === "live",
      status: game.status === "live" ? null : "Coming soon"
    }
    if (!card.playable) return card

    var state = (statesById && statesById[game.id]) || null
    var streak = state && state.streak ? state.streak : 0
    var played = !!(state && Model.hasAnsweredDay(state, today))

    // A streak of zero is not worth a line. Someone who has never played, and
    // someone whose run has just broken, both want the game rather than the
    // scoreboard.
    card.streakLabel = streak > 0 ? "Streak " + streak : null
    card.played = played
    card.statusLabel = played ? "Played today" : "Not played yet"
    return card
  })

  return { cards: cards }
}

// The guide, shaped for rendering. Content comes from the Model so the widget
// and the app teach identical rules.
function howToPlayView(Model, engine) {
  var guide = engine === "date" ? Model.HOW_TO_PLAY_DATES : Model.HOW_TO_PLAY
  return {
    title: guide.title,
    steps: guide.steps,
    scoringIntro: guide.scoringIntro,
    scoring: Model.scoringRows(engine).map(function (row) {
      return {
        band: row.band,
        tone: toneForBand(row.band),
        meaning: row.meaning,
        pointsLabel: row.points + " pts"
      }
    }),
    notes: [guide.streakNote, guide.hintNote, guide.statsNote],

    // App-only, and deliberately not in Model.HOW_TO_PLAY: that guide is
    // shared with the Omarchy widget, which has no notifications and would be
    // describing something it cannot do.
    reminder: {
      title: "The daily reminder",
      intro: "Tap the 🔔 on the games list to get one nudge a day, naming every game's question. Tap it again to stop.",
      steps: [
        "Install the app to your home screen first. On iPhone this is required — Apple only allows notifications for web apps that have been added to the Home Screen, so a browser tab will never get one.",
        "Open it from the home screen and tap the 🔔 in the top right of the games list.",
        "Say yes when your browser asks permission. The bell turns blue and reads On."
      ],
      notes: [
        "It arrives around 9am your time, wherever you are — the app remembers your timezone, not your location.",
        "One nudge covers every game, and it names each day's question so you know what is waiting.",
        "You will not be nudged on a day you have already finished every game. It is a reminder, not a nag.",
        "If you say no by accident, your browser will not ask twice. You would have to allow notifications for this site in your browser settings, then tap the bell again.",
        "Turning it off deletes the subscription. Nothing about your guesses, scores or streak is ever sent with it."
      ]
    }
  }
}

// engine is a trailing optional, defaulting to the one the app had when it
// had only one: every existing call site keeps working untouched, which is the
// same shape the optional predicates on streakFrom and forgetDay take.
function viewModel(Model, state, question, day, historyLimit, hintShown, bank, engine) {
  var answered = Model.hasAnsweredDay(state, day)
  var entry = answered ? state.history[String(day)] : null
  var stats = Model.computeStats(state)
  var limit = historyLimit === undefined ? HISTORY_PAGE : historyLimit
  var isDate = engine === "date"

  // On the date engine the hint IS the decomposition hint - there is no
  // archetype taxonomy, because Model.STRATEGIES describes ways to estimate a
  // quantity and none of them are ways to place a year. So the button reveals
  // the bracketing advice at half points, and the same text is shown to
  // everyone afterwards, exactly as the strategy guidance is.
  var strategy = (question && !isDate) ? Model.strategyFor(question) : null
  var hintBody = isDate
    ? (question && question.decompositionHint ? question.decompositionHint : null)
    : (strategy ? strategy.guidance : null)
  var input = isDate && question ? Model.inputForPrecision(question.precision) : null

  if (isDate) {
    return {
      dateLabel: Model.formatDay(day),
      streakLabel: "Streak " + state.streak + " · Best " + state.bestStreak,
      // A historical date does not drift, so there is never a year to qualify
      // it with. The bank rejects the field outright rather than leaving it
      // optional - see games/dates/questions.test.js.
      asOfLabel: null,
      prompt: question ? question.prompt : "No question available",
      unit: "",
      // Which control to show, and what it should say before it is touched.
      input: input,
      placeholder: input === "date" ? "" : "Year",
      answered: answered,
      result: question ? dateResultView(Model, entry, question) : null,
      // No archetype line: there is nothing to name.
      strategyLabel: null,
      strategyGuidance: hintBody,
      hintAvailable: !!(hintBody && !answered && !hintShown),
      hintRevealed: !!(hintBody && !answered && hintShown),
      hint: question && answered ? "How to think about it: " + question.decompositionHint : null,
      source: question && answered && question.source ? "Source: " + question.source : null,
      stats: statsView(Model, stats),
      // Nothing to chart: the archetype panel is a breakdown by estimation
      // strategy, and this game has none.
      archetypes: null,
      history: historyView(Model, state, limit),
      howToPlay: howToPlayView(Model, "date")
    }
  }

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
    // The bank is passed in rather than reached for, so this file stays
    // free of globals and testable on its own.
    archetypes: archetypeView(Model, state, bank || []),
    history: historyView(Model, state, limit),
    howToPlay: howToPlayView(Model)
  }
}

var BAND_EMOJI = { Bullseye: "\uD83C\uDFAF", Close: "\uD83D\uDFE2", Ballpark: "\uD83D\uDFE1", Off: "\uD83D\uDD34" }

// A day inside the shared window that was not played.
var MISSED_EMOJI = "\u2B1C"

// How many calendar days the shared run covers.
var SHARE_WINDOW = 7

// The run of recent days, oldest to newest, as band squares.
//
// Calendar days rather than played days, so a gap reads as a gap instead of
// being quietly closed up - the streak is the point, and hiding the misses
// would misrepresent it. Leading gaps are trimmed, so someone sharing their
// first ever day posts one square rather than six blanks and a square.
function shareRun(state, day, windowDays) {
  var span = windowDays || SHARE_WINDOW
  var squares = []

  for (var offset = span - 1; offset >= 0; offset--) {
    var entry = state.history && state.history[String(day - offset)]
    squares.push(entry && entry.band ? (BAND_EMOJI[entry.band] || MISSED_EMOJI) : null)
  }

  while (squares.length && squares[0] === null) squares.shift()
  return squares.map(function (s) { return s === null ? MISSED_EMOJI : s }).join("")
}

// The app is Estimation Gym; the game inside it is Fermi Questions. They were
// the same thing until the app became a home for more than one game, and the
// share card is the one place both names have to appear - the brand first
// because that is what gets recognised and searched for, the game second
// because a shared result has to say which game produced it.
//
// GAME_NAME moves into the game registry once that exists. It is a constant
// here rather than a literal inside shareText so there is exactly one place to
// change when it does.
var APP_NAME = "Estimation Gym"
var GAME_NAME = "Fermi Questions"

// Deliberately omits both the guess and the true value. A shared result has to
// be safe to post before other people have played, and a band conveys how it
// went without giving the answer away.
// `gameName` is optional and trailing, defaulting to Fermi Questions - the
// codebase's idiom for widening a function without touching a caller or a
// test. The share card names the game rather than the app alone, because two
// games' cards would otherwise be indistinguishable to whoever receives one.
function shareText(Model, state, question, day, url, gameName) {
  if (!Model.hasAnsweredDay(state, day)) return null

  var entry = state.history[String(day)]
  var decades = entry.distanceDecades

  var today = (BAND_EMOJI[entry.band] || "") + " " + entry.band
  if (decades !== null && decades !== undefined) {
    today += " \u00b7 " + decades.toFixed(2) + " decades off"
  } else if (entry.errorUnit && typeof entry.error === "number" && isFinite(entry.error)) {
    // A date result, which has no decades to quote. Without this the shared
    // line said only the band, and lost the part that makes a share worth
    // reading - how close it actually was.
    today += " \u00b7 " + (entry.error === 0
      ? "exact"
      : entry.error + " " + (entry.error === 1 ? entry.errorUnit.replace(/s$/, "") : entry.errorUnit) + " off")
  }
  if (entry.assisted) today += " \u00b7 hint"

  var lines = [
    APP_NAME + " \u00b7 " + (gameName || GAME_NAME) + " \u00b7 " + Model.formatDay(day),
    shareRun(state, day),
    today,
    "Streak " + state.streak
  ]
  if (url) lines.push("", url)
  return lines.join("\n")
}

if (typeof module !== "undefined") {
  module.exports = {
    toneForBand: toneForBand,
    validateGuess: validateGuess,
    validateYear: validateYear,
    validateDate: validateDate,
    dateResultView: dateResultView,
    practiceView: practiceView,
    viewModel: viewModel,
    historyView: historyView,
    distributionView: distributionView,
    percentileView: percentileView,
    PERCENTILE_MIN: PERCENTILE_MIN,
    confessionNote: confessionNote,
    archetypeView: archetypeView,
    howToPlayView: howToPlayView,
    homeView: homeView,
    shareText: shareText,
    shareRun: shareRun,
    SHARE_WINDOW: SHARE_WINDOW,
    BAND_EMOJI: BAND_EMOJI,
    HISTORY_PAGE: HISTORY_PAGE,
    APP_NAME: APP_NAME,
    GAME_NAME: GAME_NAME
  }
}
