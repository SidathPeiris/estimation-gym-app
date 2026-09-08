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

// Deterministic small PRNG (mulberry32) so a given seed always produces the
// same shuffle - needed because Math.random() would make different players
// (or the same player after a restart) see different question orders.
function seededRandom(seed) {
  var state = seed >>> 0
  return function() {
    state = (state + 0x6D2B79F5) >>> 0
    var t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffledIndices(length, seed) {
  var indices = []
  for (var i = 0; i < length; i++) indices.push(i)
  var rand = seededRandom(seed)
  for (var j = length - 1; j > 0; j--) {
    var k = Math.floor(rand() * (j + 1))
    var tmp = indices[j]
    indices[j] = indices[k]
    indices[k] = tmp
  }
  return indices
}

// Cycles through every question in the bank (in a shuffled order) before any
// repeat, and reshuffles (with a new deterministic seed) for the next pass.
function pickQuestionIndex(dayIdx, bankLength) {
  if (bankLength <= 0) return -1
  var cycle = Math.floor(dayIdx / bankLength)
  var position = ((dayIdx % bankLength) + bankLength) % bankLength
  return shuffledIndices(bankLength, cycle)[position]
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

function pointsForBand(band) {
  return BAND_POINTS[band] || 0
}

function scoreGuess(guess, answerValue) {
  var distanceDecades = log10Distance(guess, answerValue)
  var band = bandForDistance(distanceDecades)
  return {
    distanceDecades: distanceDecades,
    band: band,
    points: BAND_POINTS[band]
  }
}

// state shape: { history: {"<dayIndex>": {guess, answerValue, band, distanceDecades}},
//                streak: number, bestStreak: number, lastCompletedDay: number }
function emptyState() {
  return { history: {}, streak: 0, bestStreak: 0, lastCompletedDay: -1 }
}

// Applying the same day's result twice (e.g. a shell restart re-triggering a
// stray submit) must not double-count the streak, so this is idempotent per day.
function recordAnswer(state, dayIdx, guess, answerValue) {
  if (state.history && state.history[String(dayIdx)]) return state

  var result = scoreGuess(guess, answerValue)
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
  var history = (state && state.history) || {}
  var counts = {}
  for (var b = 0; b < BANDS.length; b++) counts[BANDS[b]] = 0

  var played = 0
  var totalPoints = 0
  var distances = []
  var signedErrors = []

  for (var key in history) {
    var entry = history[key]
    if (!entry || BANDS.indexOf(entry.band) < 0) continue
    played++
    counts[entry.band]++
    totalPoints += pointsForBand(entry.band)
    if (typeof entry.distanceDecades === "number" && isFinite(entry.distanceDecades)) {
      distances.push(entry.distanceDecades)
    }
    // Recomputed from the stored guess and answer rather than persisted, so
    // history written before calibration existed still contributes.
    var signed = signedLog10Error(entry.guess, entry.answerValue)
    if (signed !== null) signedErrors.push(signed)
  }

  return {
    played: played,
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

if (typeof module !== "undefined") {
  module.exports = {
    dayIndex: dayIndex,
    seededRandom: seededRandom,
    shuffledIndices: shuffledIndices,
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
    computeStats: computeStats,
    calibrationLabel: calibrationLabel,
    CALIBRATION_MIN_PLAYS: CALIBRATION_MIN_PLAYS,
    formatCompact: formatCompact,
    BANDS: BANDS,
    BAND_POINTS: BAND_POINTS
  }
}
