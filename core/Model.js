// Pure logic for Estimation Gym: no QML/Quickshell imports here, so this file
// can be unit tested directly with `node Model.test.js` as well as imported
// from Widget.qml via `import "Model.js" as Model`.

var EPOCH_MS = Date.UTC(2024, 0, 1) // day 0 = 2024-01-01 UTC
var DAY_MS = 24 * 60 * 60 * 1000

var BANDS = ["Bullseye", "Close", "Ballpark", "Off"]

// Day number since a fixed epoch, the same trick Wordle uses to derive a
// stable "puzzle #N" from the calendar date so every player on the same day
// sees the same question without needing a server.
function dayIndex(date) {
  var utcMidnight = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
  return Math.floor((utcMidnight - EPOCH_MS) / DAY_MS)
}

var WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Inverse of dayIndex. Puzzles are still selected by day number, but the number
// is meaningless to a new player - it reads as though they are 980 days behind
// - so the calendar date is what gets shown. Derived from the index rather than
// from the clock, so the date on screen always matches the puzzle being served.
function dateForDay(dayIdx) {
  return new Date(EPOCH_MS + dayIdx * DAY_MS)
}

// Hand-rolled rather than toLocaleDateString: QML's JS engine does not handle
// locale date formatting reliably, the same reason formatCompact exists.
function formatDay(dayIdx) {
  var d = dateForDay(dayIdx)
  return WEEKDAYS[d.getUTCDay()] + " " + d.getUTCDate() + " " + MONTHS[d.getUTCMonth()]
}

// The daily schedule is the bank's own order: day N gets bank[N - SCHEDULE_ORIGIN].
//
// This used to be a seeded shuffle keyed on the bank's length, which had a
// trap in it. Every input to that shuffle - the cycle, the position and the
// permutation itself - changed when the bank grew, so adding questions
// re-dealt every day's puzzle, including days already played. Going from 500
// to 1000 questions did exactly that, changing the question mid-day under
// anyone who had the app open.
//
// Reading the schedule straight off the array makes growth safe: appending a
// question cannot move one that is already scheduled. The rule that keeps it
// that way is that content/questions.js is APPEND-ONLY - never insert,
// reorder or delete. questions.test.js pins the scheduled span so breaking
// that rule fails the build instead of silently rewriting people's calendars.
//
// The origin is the day the schedule was frozen. Days are still counted from
// the 2024 epoch so stored history and streaks keep their keys; only the
// question lookup is re-anchored.
var SCHEDULE_ORIGIN = dayIndex(new Date(2026, 8, 9))

function pickQuestionIndex(dayIdx, bankLength) {
  if (bankLength <= 0) return -1
  var offset = dayIdx - SCHEDULE_ORIGIN

  // The frozen span. Every appended question extends it by another day.
  if (offset >= 0 && offset < bankLength) return offset

  // Outside it, wrap. Both ends are far from any day in play: before the
  // origin is the past, which is read from stored history rather than
  // recomputed, and past the end is a full bank's worth of days away.
  return ((offset % bankLength) + bankLength) % bankLength
}

function questionForDay(dayIdx, bank) {
  var index = pickQuestionIndex(dayIdx, bank.length)
  return index >= 0 ? bank[index] : null
}

// Distance in "decades" (powers of ten) between a guess and the true value -
// this is the whole point of order-of-magnitude scoring instead of exact match.
function log10Distance(guess, answerValue) {
  if (!(guess > 0) || !(answerValue > 0)) return null
  return Math.abs(Math.log10(guess) - Math.log10(answerValue))
}

// Signed counterpart to log10Distance: negative means the guess was too low,
// positive too high. Averaged over many days this exposes a systematic lean,
// which is the part of estimating that can actually be corrected - the
// unsigned distance can only ever say "you were off".
function signedLog10Error(guess, answerValue) {
  if (!(guess > 0) || !(answerValue > 0)) return null
  return Math.log10(guess) - Math.log10(answerValue)
}

function bandForDistance(distanceDecades) {
  if (distanceDecades === null) return "Off"
  if (distanceDecades <= 0.3) return "Bullseye"
  if (distanceDecades <= 1) return "Close"
  if (distanceDecades <= 2) return "Ballpark"
  return "Off"
}

var BAND_POINTS = { Bullseye: 100, Close: 70, Ballpark: 40, Off: 10 }

function pointsForBand(band, assisted) {
  var base = BAND_POINTS[band] || 0
  return assisted ? Math.round(base * HINT_MULTIPLIER) : base
}

function scoreGuess(guess, answerValue, assisted) {
  var distanceDecades = log10Distance(guess, answerValue)
  var band = bandForDistance(distanceDecades)
  return {
    distanceDecades: distanceDecades,
    band: band,
    points: pointsForBand(band, assisted),
    assisted: !!assisted
  }
}

// state shape: { history: {"<dayIndex>": {guess, answerValue, band, distanceDecades}},
//                streak: number, bestStreak: number, lastCompletedDay: number }
function emptyState() {
  return { history: {}, streak: 0, bestStreak: 0, lastCompletedDay: -1 }
}

// Applying the same day's result twice (e.g. a shell restart re-triggering a
// stray submit) must not double-count the streak, so this is idempotent per day.
// questionId is recorded so a past day can be tied back to the question it
// actually asked. It cannot be recovered later: growing the bank reshuffles
// which question falls on which date, so the day number alone would eventually
// name the wrong one - the same trap that once showed the wrong answer value.
function recordAnswer(state, dayIdx, guess, answerValue, assisted, questionId) {
  if (state.history && state.history[String(dayIdx)]) return state

  var result = scoreGuess(guess, answerValue, assisted)
  var isConsecutive = dayIdx === state.lastCompletedDay + 1
  var newStreak = result.band === "Off" ? 0 : (isConsecutive ? state.streak + 1 : 1)

  var newHistory = {}
  for (var key in state.history) newHistory[key] = state.history[key]
  newHistory[String(dayIdx)] = {
    guess: guess,
    answerValue: answerValue,
    band: result.band,
    distanceDecades: result.distanceDecades
  }
  if (assisted) newHistory[String(dayIdx)].assisted = true
  // Only written when known, so entries recorded before this existed stay
  // valid and simply have nothing to link to.
  if (questionId) newHistory[String(dayIdx)].questionId = questionId

  return {
    history: newHistory,
    streak: newStreak,
    bestStreak: Math.max(state.bestStreak, newStreak),
    lastCompletedDay: dayIdx
  }
}

function hasAnsweredDay(state, dayIdx) {
  return !!(state.history && state.history[String(dayIdx)])
}

function medianOf(values) {
  if (!values.length) return null
  var sorted = values.slice().sort(function(a, b) { return a - b })
  var mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

// Points are derived from the stored band rather than read back from history,
// so state files written before scoring was surfaced still total up correctly
// and no migration is needed.
function computeStats(state) {
  var counts = {}
  for (var b = 0; b < BANDS.length; b++) counts[BANDS[b]] = 0

  var played = 0
  var assisted = 0
  var totalPoints = 0
  var distances = []
  var signedErrors = []

  // Iterates the same day list the history panels render, so "N played"
  // here and "N days" there cannot disagree - a hand-edited state file used to
  // make Stats count entries History correctly refused to show.
  var days = historyDays(state)
  for (var d = 0; d < days.length; d++) {
    var entry = days[d].entry
    if (!entry || BANDS.indexOf(entry.band) < 0) continue
    played++
    counts[entry.band]++
    totalPoints += pointsForBand(entry.band, entry.assisted)
    if (entry.assisted) assisted++
    if (typeof entry.distanceDecades === "number" && isFinite(entry.distanceDecades)) {
      distances.push(entry.distanceDecades)
    }
    // Recomputed from the stored guess and answer rather than persisted, so
    // history written before calibration existed still contributes.
    if (!entry.assisted) {
      var signed = signedLog10Error(entry.guess, entry.answerValue)
      if (signed !== null) signedErrors.push(signed)
    }
  }

  return {
    played: played,
    assisted: assisted,
    counts: counts,
    totalPoints: totalPoints,
    medianDecades: medianOf(distances),
    // Median rather than mean: one wild guess can sit ten decades out and
    // would otherwise swamp an honest read of which way someone leans.
    biasDecades: medianOf(signedErrors),
    calibrationSample: signedErrors.length,
    streak: (state && state.streak) || 0,
    bestStreak: (state && state.bestStreak) || 0
  }
}

// Past days, newest first, skipping anything malformed.
//
// Shared so the widget's history strip and the app's history list agree on
// which days exist and in what order; each surface then formats them its own
// way. Returns { day, entry } pairs rather than formatted strings, because the
// two surfaces have very different amounts of room.
function historyDays(state) {
  var history = (state && state.history) || {}
  var days = []

  for (var key in history) {
    var entry = history[key]
    if (!entry || !entry.band) continue
    var day = Number(key)
    // Round-tripping the key rejects things Number() is too forgiving about:
    // "" and " " both come back as 0, which would render a phantom day 0
    // entry dated 1 January 2024. Hand-edited state files are the expected
    // source of keys like these.
    if (!isFinite(day) || String(day) !== key) continue
    days.push({ day: day, entry: entry })
  }

  days.sort(function (a, b) { return b.day - a.day })
  return days
}

// Dates a question for display. Years before the common era are stored
// negative, which is right for arithmetic and wrong on screen: the Library of
// Alexandria question was rendering as "as of -250" rather than "as of 250 BC".
function formatAsOf(year) {
  if (typeof year !== "number" || !isFinite(year)) return ""
  return year < 0 ? Math.abs(year) + " BC" : String(year)
}

// Mirrors "version" in manifest.json. Model.test.js asserts the two match, so
// this cannot quietly drift from what the plugin actually declares - the whole
// point of showing a version is that it is trustworthy.
var PLUGIN_VERSION = "0.1.0"

// Practice: questions to attempt outside the daily puzzle.
//
// A new player can otherwise have exactly one go and then wait a day, which is
// a poor way to discover whether you like something. Practice draws from the
// questions the daily has not used on this device, so it never spoils an
// upcoming day's puzzle for the person playing it, and never repeats one they
// have already had.
//
// Nothing here touches the streak, the stats or the shared distribution. It is
// deliberately a separate pool and a separate verb.
// How far ahead the daily rotation is protected from practice.
//
// Every question becomes a daily eventually - the rotation cycles through the
// whole bank - so practising anything would otherwise spoil a future puzzle,
// and the soonest collision is tomorrow. Questions scheduled inside this
// window are simply not offered, which pushes any repeat far enough away to be
// a fair re-test rather than a spoiler.
//
// Widen it as the bank grows: the cost is only that fewer questions are
// available to practise on.
var PRACTICE_RESERVE_DAYS = 365

// The questions the daily puzzle is about to use, which practice must leave
// alone. Derived from the same deterministic rotation the daily uses, so it
// needs no stored state.
function reservedForDaily(bank, todayIdx, reserveDays) {
  var days = typeof reserveDays === "number" ? reserveDays : PRACTICE_RESERVE_DAYS
  var reserved = {}
  if (!bank.length || days <= 0 || typeof todayIdx !== "number") return reserved

  // Never reserve the whole bank, or there would be nothing left to practise.
  var span = Math.min(days, bank.length - 1)
  for (var offset = 0; offset < span; offset++) {
    var q = questionForDay(todayIdx + offset, bank)
    if (q) reserved[q.id] = true
  }
  return reserved
}

function practicePool(bank, state, alreadyPractised, todayIdx, reserveDays) {
  var answered = {}
  var days = historyDays(state)
  for (var i = 0; i < days.length; i++) {
    var id = days[i].entry.questionId
    if (id) answered[id] = true
  }

  var practised = {}
  if (alreadyPractised) {
    for (var p = 0; p < alreadyPractised.length; p++) practised[alreadyPractised[p]] = true
  }

  var reserved = reservedForDaily(bank, todayIdx, reserveDays)

  var pool = []
  for (var b = 0; b < bank.length; b++) {
    var q = bank[b]
    if (answered[q.id] || practised[q.id] || reserved[q.id]) continue
    pool.push(q)
  }

  // If reserving has left nothing, fall back to ignoring the reserve rather
  // than offering nothing at all. Only reachable on a tiny bank or once
  // almost everything has been played.
  if (!pool.length) {
    for (var f = 0; f < bank.length; f++) {
      var alt = bank[f]
      if (answered[alt.id] || practised[alt.id]) continue
      pool.push(alt)
    }
  }
  return pool
}

// Picks one at random. `random` is injectable so a test can be deterministic.
// Returns null once the pool is empty, which the caller should present as
// having worked through everything rather than as a failure.
function pickPractice(bank, state, alreadyPractised, todayIdx, random) {
  var pool = practicePool(bank, state, alreadyPractised, todayIdx)
  if (!pool.length) return null
  var r = typeof random === "function" ? random() : Math.random()
  var index = Math.floor(r * pool.length)
  if (index < 0) index = 0
  if (index >= pool.length) index = pool.length - 1
  return pool[index]
}

// How the player does on each shape of problem.
//
// The whole point of the archetypes is that recognising the shape transfers,
// so knowing which shapes you are weak on is the most actionable thing the
// stats can say. Attribution needs the questionId recorded on the entry, which
// older days predate - they are counted as unattributed rather than guessed at.
//
// `bank` is the question list; strategies are looked up rather than stored on
// the entry, so re-tagging a question re-attributes past days automatically.
function archetypeStats(state, bank, minPlays) {
  var floor = typeof minPlays === "number" ? minPlays : 3
  var byId = {}
  for (var i = 0; i < bank.length; i++) byId[bank[i].id] = bank[i]

  var groups = {}
  var attributed = 0
  var unattributed = 0

  var days = historyDays(state)
  for (var d = 0; d < days.length; d++) {
    var entry = days[d].entry
    var question = entry.questionId ? byId[entry.questionId] : null
    if (!question || !question.strategy) { unattributed++; continue }
    attributed++

    var key = question.strategy
    if (!groups[key]) groups[key] = { strategy: key, played: 0, distances: [] }
    groups[key].played++
    if (typeof entry.distanceDecades === "number" && isFinite(entry.distanceDecades)) {
      groups[key].distances.push(entry.distanceDecades)
    }
  }

  var rows = []
  for (var k in groups) {
    var g = groups[k]
    var median = medianOf(g.distances)
    rows.push({
      strategy: g.strategy,
      label: (STRATEGIES[g.strategy] && STRATEGIES[g.strategy].label) || g.strategy,
      played: g.played,
      medianDecades: median,
      // Only rank a shape once there is enough of it to mean anything; below
      // the floor it is shown but never called a strength or a weakness.
      ranked: g.played >= floor && median !== null
    })
  }

  // Best first: closest median, then most played to break a tie.
  rows.sort(function (a, b) {
    if (a.ranked !== b.ranked) return a.ranked ? -1 : 1
    if (a.medianDecades === b.medianDecades) return b.played - a.played
    if (a.medianDecades === null) return 1
    if (b.medianDecades === null) return -1
    return a.medianDecades - b.medianDecades
  })

  var ranked = rows.filter(function (r) { return r.ranked })
  return {
    rows: rows,
    attributed: attributed,
    unattributed: unattributed,
    // Named only when there are at least two ranked shapes to compare.
    best: ranked.length >= 2 ? ranked[0] : null,
    worst: ranked.length >= 2 ? ranked[ranked.length - 1] : null
  }
}

// A lean is only worth reporting once there are enough days behind it -
// below this a couple of unlucky guesses read as a personality trait.
var CALIBRATION_MIN_PLAYS = 10

// Shared by the bar widget and the web app so both describe a lean in the
// same words rather than drifting apart.
function calibrationLabel(stats) {
  if (!stats || stats.biasDecades === null || stats.biasDecades === undefined) return null
  if (stats.calibrationSample < CALIBRATION_MIN_PLAYS) return null

  var bias = stats.biasDecades
  if (Math.abs(bias) < 0.15) return "Well calibrated - no consistent lean"

  var factor = Math.pow(10, Math.abs(bias))
  return bias < 0
    ? "You tend to guess low, by about " + factor.toFixed(1) + "×"
    : "You tend to guess high, by about " + factor.toFixed(1) + "×"
}

// Compact display like "1.2 × 10^18" for large/small numbers, plain for
// everyday-sized ones - QML's JS engine doesn't reliably support
// toLocaleString grouping, so this is hand-rolled rather than relied on.
function formatCompact(value) {
  var abs = Math.abs(value)
  if (abs !== 0 && (abs >= 1e6 || abs < 1e-3)) {
    var exponent = Math.floor(Math.log10(abs))
    var mantissa = value / Math.pow(10, exponent)
    return mantissa.toFixed(1) + " × 10^" + exponent
  }
  var rounded = Math.round(value * 100) / 100
  var str = String(rounded)
  var parts = str.split(".")
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  return parts.join(".")
}

// Reasoning archetypes.
//
// Every question carries a `strategy` naming the shape of the reasoning it
// wants. The guidance is written once per archetype rather than once per
// question: a dozen texts to keep correct instead of five hundred, and what it
// teaches transfers - recognising that a problem is population-times-rate helps
// with every such problem, not just today's.
//
// These deliberately never mention the answer. They say how to think, so a
// player who takes the hint still has to do the estimating.
var STRATEGIES = {
  "decompose": {
    label: "Break it into factors",
    guidance: "Split the quantity into two or three factors you can each guess within a factor of ten, then multiply. A chain of rough guesses usually lands closer than one bold guess at the answer, because errors in opposite directions cancel."
  },
  "chain-multiply": {
    label: "Multiply a chain of estimates",
    guidance: "This is a product of a few independent quantities. Write the chain out in units first and check that they cancel down to the unit you are asked for, then put a rough number on each link."
  },
  "rate-time": {
    label: "Rate times time",
    guidance: "Something happens at a steady rate over a span of time. Estimate the rate in whichever unit you have real intuition for - per day is usually easiest - then convert the span into that same unit and multiply."
  },
  "population-rate": {
    label: "People times per-person rate",
    guidance: "Start from how many people are involved, then how often each one does the thing. The population is usually the easy half; the per-person rate is where the uncertainty really sits, so spend your thinking there."
  },
  "divide-total": {
    label: "Divide a total by one unit",
    guidance: "Estimate a total you can actually picture - a mass, a volume, a length, a budget - then divide by the size of a single unit. The total is often much better known than the count you are being asked for."
  },
  "area-density": {
    label: "Area times density",
    guidance: "Estimate how much area or volume is involved and how densely the thing is packed into it, then multiply. A handful of densities per square metre or per litre are worth memorising; they transfer to a lot of questions."
  },
  "volume-packing": {
    label: "Container volume over item volume",
    guidance: "Work out the volume of the container and the volume of one item, then divide. Packing is never perfect - loose spheres waste roughly a quarter of the space - but that correction is small next to an order of magnitude."
  },
  "unit-conversion": {
    label: "Chain the conversion factors",
    guidance: "No real-world guessing is needed here, only conversion factors chained together. Lay them out so the units cancel, and track the powers of ten separately from the leading digits so you do not lose one."
  },
  "stock-flow": {
    label: "Stock equals flow times lifetime",
    guidance: "There is a standing stock and a rate at which it turns over. Stock equals flow times lifetime: if you know how many are made each year and how long each one lasts, you know roughly how many exist right now."
  },
  "energy-balance": {
    label: "Energy per unit times units",
    guidance: "Find the energy per unit - per kilogram, per person, per event - and multiply by how many units there are. Checking the result against something familiar, like a home using about 10 kWh a day, catches most magnitude slips."
  },
  "molar": {
    label: "Mass to moles to molecules",
    guidance: "Go from mass to moles to molecules. Divide the mass in grams by the molar mass, then multiply by Avogadro's number, about 6x10^23. Nearly every 'how many atoms' question is this same three-step path."
  },
  "exponential": {
    label: "Count the doublings",
    guidance: "Something is doubling or halving repeatedly, so count the doublings rather than the units. Ten doublings is very close to a factor of a thousand, which is the shortcut worth committing to memory."
  },
  "combinatorial": {
    label: "Count the arrangements",
    guidance: "You are counting arrangements, not measuring anything. Work out how many choices there are at each position and multiply them together. These numbers grow astronomically fast, so expect an answer far larger than it feels."
  },
  "anchor-scale": {
    label: "Anchor, then scale",
    guidance: "Anchor on something whose size you already know, then scale from it. Asking how many times bigger or smaller the target is than your anchor is far easier to judge than reaching for the absolute quantity."
  },
  "recall-sanity": {
    label: "Recall, then sanity-check",
    guidance: "This one leans on a figure you have probably met before. Pull up whatever number you half-remember, then check its magnitude against a related quantity you are confident about before committing to it."
  }
}

// Falls back rather than returning nothing: a question with an unrecognised or
// missing strategy still gets honest generic advice.
function strategyFor(question) {
  var key = question && question.strategy
  return STRATEGIES[key] || STRATEGIES["decompose"]
}

// Taking the hint halves the points. It deliberately does not touch the streak:
// the streak measures showing up daily, and punishing someone for wanting to
// learn the method would be exactly the wrong incentive.
var HINT_MULTIPLIER = 0.5

// The how-to-play guide.
//
// Lives here rather than in either UI so the widget and the app teach the same
// rules in the same words, the way calibrationLabel and the strategy guidance
// already do.
//
// The scoring rows are derived from BANDS and BAND_POINTS rather than written
// out, so the guide cannot drift away from what the scoring actually does. A
// band added or repriced shows up here automatically.
var BAND_MEANING = {
  Bullseye: "within about 2x",
  Close: "within 10x",
  Ballpark: "within 100x",
  Off: "more than 100x out"
}

function scoringRows() {
  return BANDS.map(function (band) {
    return {
      band: band,
      meaning: BAND_MEANING[band] || "",
      points: BAND_POINTS[band]
    }
  })
}

var HOW_TO_PLAY = {
  title: "How to play",
  steps: [
    "Read today's question and estimate the answer. Nobody expects you to know it - work it out from things you do know.",
    "Type your guess and submit. Scientific notation works for big numbers: 3e12 rather than counting zeroes.",
    "You are scored on how close you get in powers of ten, not on being exact.",
    "Come back tomorrow for a new question. Everyone gets the same one on the same day."
  ],
  scoringIntro: "Being within a factor of ten of a hard question is the skill worth having, so scoring is measured in powers of ten rather than percentages.",
  streakNote: "Anything better than Off extends your streak. An Off resets it to zero. Your best streak is kept alongside your current one.",
  hintNote: "Stuck? Hint tells you how to attack that shape of problem without giving anything away about the answer. It halves the day's points, but it never breaks your streak.",
  statsNote: "After ten days, Stats will tell you which way you lean - whether you habitually guess high or low. That is the part you can actually correct."
}

// The public surface, declared once. Under node this is the module export;
// loaded as a plain script it is a global. Callers therefore get the same
// object either way, so a function added here cannot be missing on one surface
// and present on the other.
var ModelAPI = {
  dayIndex: dayIndex,
  dateForDay: dateForDay,
  formatDay: formatDay,
  SCHEDULE_ORIGIN: SCHEDULE_ORIGIN,
  pickQuestionIndex: pickQuestionIndex,
  questionForDay: questionForDay,
  log10Distance: log10Distance,
  signedLog10Error: signedLog10Error,
  bandForDistance: bandForDistance,
  scoreGuess: scoreGuess,
  pointsForBand: pointsForBand,
  emptyState: emptyState,
  recordAnswer: recordAnswer,
  hasAnsweredDay: hasAnsweredDay,
  historyDays: historyDays,
  archetypeStats: archetypeStats,
  practicePool: practicePool,
  reservedForDaily: reservedForDaily,
  PRACTICE_RESERVE_DAYS: PRACTICE_RESERVE_DAYS,
  pickPractice: pickPractice,
  PLUGIN_VERSION: PLUGIN_VERSION,
  formatAsOf: formatAsOf,
  computeStats: computeStats,
  calibrationLabel: calibrationLabel,
  CALIBRATION_MIN_PLAYS: CALIBRATION_MIN_PLAYS,
  formatCompact: formatCompact,
  HOW_TO_PLAY: HOW_TO_PLAY,
  scoringRows: scoringRows,
  BAND_MEANING: BAND_MEANING,
  STRATEGIES: STRATEGIES,
  strategyFor: strategyFor,
  HINT_MULTIPLIER: HINT_MULTIPLIER,
  BANDS: BANDS,
  BAND_POINTS: BAND_POINTS
}

if (typeof module !== "undefined") module.exports = ModelAPI
