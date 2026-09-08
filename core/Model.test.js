const assert = require("node:assert/strict")
const Model = require("./Model.js")

// --- dayIndex ---
assert.equal(Model.dayIndex(new Date(Date.UTC(2024, 0, 1))), 0)
assert.equal(Model.dayIndex(new Date(Date.UTC(2024, 0, 2))), 1)
assert.equal(Model.dayIndex(new Date(Date.UTC(2023, 11, 31))), -1)

// --- dateForDay / formatDay: the date shown must match the puzzle served ---
assert.equal(Model.formatDay(0), "Mon 1 Jan", "day 0 is the epoch, 1 January 2024, a Monday")
assert.equal(Model.formatDay(1), "Tue 2 Jan")
assert.equal(Model.formatDay(-1), "Sun 31 Dec", "days before the epoch still resolve")

// Round trip: formatting the index of a date must name that same date.
for (const [y, m, d, expected] of [
  [2024, 0, 1, "Mon 1 Jan"],
  [2024, 1, 29, "Thu 29 Feb"],   // leap day
  [2025, 11, 25, "Thu 25 Dec"],
  [2026, 8, 8, "Tue 8 Sep"]
]) {
  const idx = Model.dayIndex(new Date(Date.UTC(y, m, d)))
  assert.equal(Model.formatDay(idx), expected, `${y}-${m + 1}-${d} formats as ${expected}`)
}

// The date must track the index, not the wall clock, or a shared result could
// name a different day than the puzzle it describes.
assert.notEqual(Model.formatDay(500), Model.formatDay(501))

// --- question selection: deterministic, covers full bank before repeating ---
const bank = ["a", "b", "c", "d", "e"]
const seenInFirstPass = new Set()
for (let day = 0; day < bank.length; day++) {
  const idx = Model.pickQuestionIndex(day, bank.length)
  assert.ok(idx >= 0 && idx < bank.length, "index in range")
  assert.ok(!seenInFirstPass.has(idx), "no repeat within first pass")
  seenInFirstPass.add(idx)
}
assert.equal(seenInFirstPass.size, bank.length, "every question seen exactly once in a full pass")

// Same day always yields the same index (determinism across restarts).
assert.equal(Model.pickQuestionIndex(3, bank.length), Model.pickQuestionIndex(3, bank.length))

// A different cycle (second full pass) should reorder rather than repeat pass 1's order.
const pass1 = []
const pass2 = []
for (let i = 0; i < bank.length; i++) {
  pass1.push(Model.pickQuestionIndex(i, bank.length))
  pass2.push(Model.pickQuestionIndex(i + bank.length, bank.length))
}
assert.notDeepEqual(pass1, pass2, "second pass reshuffles rather than repeating the exact same order")

// --- scoring bands ---
assert.equal(Model.scoreGuess(100, 100).band, "Bullseye")
assert.equal(Model.scoreGuess(150, 100).band, "Bullseye") // ~0.176 decades off
assert.equal(Model.scoreGuess(1000, 100).band, "Close") // exactly 1 decade off
assert.equal(Model.scoreGuess(10000, 100).band, "Ballpark") // exactly 2 decades off
assert.equal(Model.scoreGuess(100000, 100).band, "Off") // 3 decades off
assert.equal(Model.scoreGuess(0, 100).band, "Off") // invalid guess handled, not a crash
assert.equal(Model.scoreGuess(-5, 100).band, "Off")

// --- streaks ---
let state = Model.emptyState()
state = Model.recordAnswer(state, 10, 100, 100) // Bullseye, first answer -> streak 1
assert.equal(state.streak, 1)
assert.equal(state.bestStreak, 1)

state = Model.recordAnswer(state, 11, 100, 100) // consecutive day, Bullseye -> streak 2
assert.equal(state.streak, 2)
assert.equal(state.bestStreak, 2)

state = Model.recordAnswer(state, 12, 1, 1e9) // consecutive day but way Off -> streak resets to 0
assert.equal(state.streak, 0)
assert.equal(state.bestStreak, 2, "best streak is preserved even after a reset")

state = Model.recordAnswer(state, 14, 100, 100) // day 13 skipped -> not consecutive, restarts at 1
assert.equal(state.streak, 1)

// Re-recording the same day must not double count (idempotent).
const beforeReplay = Model.recordAnswer(Model.emptyState(), 5, 100, 100)
const afterReplay = Model.recordAnswer(beforeReplay, 5, 999, 1)
assert.deepEqual(afterReplay, beforeReplay, "answering the same day twice is a no-op")

assert.equal(Model.hasAnsweredDay(beforeReplay, 5), true)
assert.equal(Model.hasAnsweredDay(beforeReplay, 6), false)

// --- emptyState shape (Widget.qml's loadState() trusts this shape check) ---
const fresh = Model.emptyState()
assert.deepEqual(Object.keys(fresh).sort(), ["bestStreak", "history", "lastCompletedDay", "streak"])
assert.equal(fresh.streak, 0)
assert.equal(fresh.bestStreak, 0)

// --- points ---
assert.equal(Model.pointsForBand("Bullseye"), 100)
assert.equal(Model.pointsForBand("Close"), 70)
assert.equal(Model.pointsForBand("Ballpark"), 40)
assert.equal(Model.pointsForBand("Off"), 10)
assert.equal(Model.pointsForBand("nonsense"), 0, "unknown band scores nothing rather than NaN")
assert.equal(Model.scoreGuess(100, 100).points, 100)
assert.equal(Model.scoreGuess(1e9, 1).points, 10)

// --- signed error (calibration direction) ---
assert.equal(Model.signedLog10Error(100, 100), 0)
assert.equal(Model.signedLog10Error(10, 100), -1, "guessing low is negative")
assert.equal(Model.signedLog10Error(1000, 100), 1, "guessing high is positive")
assert.equal(Model.signedLog10Error(0, 100), null)
assert.equal(Model.signedLog10Error(100, 0), null)
assert.equal(Model.signedLog10Error(-5, 100), null)

// --- computeStats ---
const emptyStats = Model.computeStats(Model.emptyState())
assert.equal(emptyStats.played, 0)
assert.equal(emptyStats.totalPoints, 0)
assert.equal(emptyStats.medianDecades, null, "no games played means no median to report")
assert.deepEqual(emptyStats.counts, { Bullseye: 0, Close: 0, Ballpark: 0, Off: 0 })

let statState = Model.emptyState()
statState = Model.recordAnswer(statState, 1, 100, 100) // Bullseye, 0 decades
statState = Model.recordAnswer(statState, 2, 1000, 100) // Close, 1 decade
statState = Model.recordAnswer(statState, 3, 1e6, 100) // Off, 4 decades
const stats = Model.computeStats(statState)
assert.equal(stats.played, 3)
assert.equal(stats.counts.Bullseye, 1)
assert.equal(stats.counts.Close, 1)
assert.equal(stats.counts.Off, 1)
assert.equal(stats.totalPoints, 100 + 70 + 10)
assert.equal(stats.medianDecades, 1, "median of 0, 1 and 4 decades is 1")
assert.equal(stats.bestStreak, statState.bestStreak)

// --- calibration bias ---
assert.equal(emptyStats.biasDecades, null, "no plays means no lean to report")
assert.equal(emptyStats.calibrationSample, 0)

// Someone who guesses low every single day should read as underestimating.
let lowState = Model.emptyState()
lowState = Model.recordAnswer(lowState, 1, 10, 100)    // -1 decade
lowState = Model.recordAnswer(lowState, 2, 20, 100)    // ~-0.7
lowState = Model.recordAnswer(lowState, 3, 5, 100)     // ~-1.3
const lowStats = Model.computeStats(lowState)
assert.ok(lowStats.biasDecades < 0, "consistently low guesses give a negative bias")
assert.equal(lowStats.biasDecades, -1, "median of -1.3, -1 and -0.7 is -1")
assert.equal(lowStats.calibrationSample, 3)

let highState = Model.emptyState()
highState = Model.recordAnswer(highState, 1, 1000, 100)
highState = Model.recordAnswer(highState, 2, 10000, 100)
assert.ok(Model.computeStats(highState).biasDecades > 0, "consistently high guesses give a positive bias")

// A single wild outlier must not flip the read of someone otherwise accurate,
// which is the whole reason this is a median and not a mean.
let outlierState = Model.emptyState()
outlierState = Model.recordAnswer(outlierState, 1, 100, 100)
outlierState = Model.recordAnswer(outlierState, 2, 100, 100)
outlierState = Model.recordAnswer(outlierState, 3, 100, 100)
outlierState = Model.recordAnswer(outlierState, 4, 1e12, 100) // ten decades high
const outlierStats = Model.computeStats(outlierState)
assert.ok(Math.abs(outlierStats.biasDecades) < 0.6,
  "one absurd guess does not swamp an otherwise well-calibrated record")

// --- calibration wording (shared by the widget and the web app) ---
function playedDays(count, guess, answer) {
  let s = Model.emptyState()
  for (let d = 1; d <= count; d++) s = Model.recordAnswer(s, d, guess, answer)
  return Model.computeStats(s)
}

assert.equal(Model.calibrationLabel(Model.computeStats(Model.emptyState())), null,
  "nothing to say with no history")
assert.equal(Model.calibrationLabel(playedDays(Model.CALIBRATION_MIN_PLAYS - 1, 10, 100)), null,
  "a lean is withheld until there are enough days to mean anything")

const leanLow = Model.calibrationLabel(playedDays(Model.CALIBRATION_MIN_PLAYS, 10, 100))
assert.ok(leanLow.includes("low"), "guessing 10x under reads as leaning low")
assert.ok(leanLow.includes("10.0"), "the lean is expressed as a linear factor, not just decades")

const leanHigh = Model.calibrationLabel(playedDays(Model.CALIBRATION_MIN_PLAYS, 1000, 100))
assert.ok(leanHigh.includes("high"))

const accurate = Model.calibrationLabel(playedDays(Model.CALIBRATION_MIN_PLAYS, 100, 100))
assert.ok(accurate.includes("Well calibrated"), "exact guesses report no lean")

// Stats must survive a hand-edited or partially corrupted state file.
const corrupted = { history: { "1": null, "2": { band: "Bogus" }, "3": { band: "Close" } }, streak: 1, bestStreak: 4 }
const corruptedStats = Model.computeStats(corrupted)
assert.equal(corruptedStats.played, 1, "entries with unknown or missing bands are skipped")
assert.equal(corruptedStats.totalPoints, 70)
assert.equal(corruptedStats.bestStreak, 4)
assert.equal(Model.computeStats({}).played, 0, "a state with no history field does not throw")

// --- formatCompact ---
assert.equal(Model.formatCompact(100), "100")
assert.equal(Model.formatCompact(1234), "1,234")
assert.equal(Model.formatCompact(1.2e18), "1.2 × 10^18")

// --- strategies / hints ---
// Every archetype used by the bank must have guidance, or a player pressing
// Hint on that day gets nothing.
// The bank sits at content/questions.js here and directly alongside this file
// once vendored into the app repo, so resolve whichever layout is present.
const questionBank = require(
  require("node:fs").existsSync(require("node:path").join(__dirname, "content"))
    ? "./content/questions.js"
    : "./questions.js"
)
const used = [...new Set(questionBank.map((q) => q.strategy))]
for (const key of used) {
  assert.ok(Model.STRATEGIES[key], `bank uses strategy "${key}" with no guidance text`)
}
for (const [key, s] of Object.entries(Model.STRATEGIES)) {
  assert.ok(s.label && s.label.length > 3, `${key} needs a label`)
  assert.ok(s.guidance && s.guidance.length > 60, `${key} guidance is too thin to help`)
}

// An unknown or missing strategy still yields honest generic advice.
assert.equal(Model.strategyFor({ strategy: "no-such-archetype" }), Model.STRATEGIES["decompose"])
assert.equal(Model.strategyFor({}), Model.STRATEGIES["decompose"])
assert.equal(Model.strategyFor(null), Model.STRATEGIES["decompose"])

// --- assisted scoring ---
assert.equal(Model.pointsForBand("Bullseye"), 100)
assert.equal(Model.pointsForBand("Bullseye", true), 50, "taking the hint halves the points")
assert.equal(Model.pointsForBand("Off", true), 5)
assert.equal(Model.scoreGuess(100, 100, true).points, 50)
assert.equal(Model.scoreGuess(100, 100).assisted, false)

// The flag is only persisted when true, so state files written before hints
// existed stay valid and read back as unassisted days.
const unaided = Model.recordAnswer(Model.emptyState(), 5, 100, 100)
assert.ok(!("assisted" in unaided.history["5"]), "unassisted days carry no flag")
const aided = Model.recordAnswer(Model.emptyState(), 5, 100, 100, true)
assert.equal(aided.history["5"].assisted, true)

// Taking the hint must not cost a streak - the streak measures showing up.
assert.equal(aided.streak, 1)
assert.equal(Model.computeStats(aided).streak, unaided.streak)

// Assisted days count as played and score half, but are excluded from
// calibration: they measure the hint as much as the player.
let mixed = Model.emptyState()
mixed = Model.recordAnswer(mixed, 0, 1, 100)          // unaided, two decades low
mixed = Model.recordAnswer(mixed, 1, 1000, 10, true)  // hinted, two decades high
const mixedStats = Model.computeStats(mixed)
assert.equal(mixedStats.played, 2)
assert.equal(mixedStats.assisted, 1)
assert.equal(mixedStats.totalPoints, 40 + 20, "the hinted Ballpark scores half")
assert.equal(mixedStats.calibrationSample, 1, "the hinted day is left out of calibration")
assert.ok(mixedStats.biasDecades < 0, "so the surviving lean is the unaided one")

// --- how to play ---
// The guide must describe the scoring that actually runs, so it is derived
// rather than written out. These pin that derivation.
const rows = Model.scoringRows()
assert.equal(rows.length, Model.BANDS.length, "every band appears in the guide")
for (const row of rows) {
  assert.ok(Model.BANDS.includes(row.band))
  assert.equal(row.points, Model.BAND_POINTS[row.band], `${row.band} guide points match the real award`)
  assert.ok(row.meaning.length > 0, `${row.band} says what it means in plain words`)
}
assert.deepEqual(rows.map((r) => r.band), Model.BANDS, "and in scoring order, best first")

// A guess exactly on each band boundary must earn the points the guide claims.
for (const [guess, band] of [[100, "Bullseye"], [1000, "Close"], [10000, "Ballpark"], [1e7, "Off"]]) {
  const scored = Model.scoreGuess(guess, 100)
  assert.equal(scored.band, band)
  const promised = rows.find((r) => r.band === band).points
  assert.equal(scored.points, promised, `the guide promises ${promised} for ${band}`)
}

assert.ok(Model.HOW_TO_PLAY.steps.length >= 3, "the guide has usable steps")
for (const step of Model.HOW_TO_PLAY.steps) assert.ok(step.length > 20)
for (const key of ["scoringIntro", "streakNote", "hintNote", "statsNote"]) {
  assert.ok(Model.HOW_TO_PLAY[key] && Model.HOW_TO_PLAY[key].length > 30, `${key} is present`)
}

console.log("All Model.js tests passed.")
