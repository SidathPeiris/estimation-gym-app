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

// --- question selection: deterministic, covers full bank, stable under growth ---
const bank = ["a", "b", "c", "d", "e"]
const origin = Model.SCHEDULE_ORIGIN
const seenInFirstPass = new Set()
for (let day = origin; day < origin + bank.length; day++) {
  const idx = Model.pickQuestionIndex(day, bank.length)
  assert.ok(idx >= 0 && idx < bank.length, "index in range")
  assert.ok(!seenInFirstPass.has(idx), "no repeat within first pass")
  seenInFirstPass.add(idx)
}
assert.equal(seenInFirstPass.size, bank.length, "every question seen exactly once in a full pass")

// Same day always yields the same index (determinism across restarts).
assert.equal(Model.pickQuestionIndex(3, bank.length), Model.pickQuestionIndex(3, bank.length))

// The property the whole schedule exists to guarantee: growing the bank must
// not move a question that is already scheduled. This is what the old
// length-seeded shuffle got wrong - it re-dealt every day, including days
// already played, so a player mid-day saw their question swapped underneath
// them. Days before the origin are exempt: they are read from stored history,
// never recomputed.
for (let grown = bank.length; grown <= bank.length + 20; grown++) {
  for (let day = origin; day < origin + bank.length; day++) {
    assert.equal(
      Model.pickQuestionIndex(day, grown),
      Model.pickQuestionIndex(day, bank.length),
      "day " + (day - origin) + " moved when the bank grew to " + grown
    )
  }
}

// Each appended question extends the frozen span by exactly one day, rather
// than being scattered through it.
assert.equal(Model.pickQuestionIndex(origin + bank.length, bank.length + 1), bank.length)

// The origin is a real day, not a magic number: 2026-09-09, when the schedule
// was frozen. Days keep counting from the 2024 epoch so history keys survive.
assert.equal(origin, Model.dayIndex(new Date(2026, 8, 9)))
assert.equal(Model.formatDay(origin), "Wed 9 Sep")

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

// --- historyDays: shared by the app's list and the widget's strip ---
let hist = Model.emptyState()
hist = Model.recordAnswer(hist, 5, 100, 100)
hist = Model.recordAnswer(hist, 7, 1, 100)
hist = Model.recordAnswer(hist, 6, 100, 100)

const ordered = Model.historyDays(hist)
assert.deepEqual(ordered.map((d) => d.day), [7, 6, 5], "newest first")
assert.equal(ordered[0].entry.band, "Ballpark", "entries travel with their day")

// Malformed rows must be skipped rather than reaching a UI that will render
// them: a hand-edited state file is the expected source of these.
const messy = {
  history: {
    "3": { guess: 1, answerValue: 1, band: "Close", distanceDecades: 0 },
    "4": null,
    "5": { guess: 1 },              // no band
    "notanumber": { band: "Close" },
    "": { band: "Close" }
  },
  streak: 1, bestStreak: 1, lastCompletedDay: 3
}
assert.deepEqual(Model.historyDays(messy).map((d) => d.day), [3])

assert.deepEqual(Model.historyDays(Model.emptyState()), [], "an unplayed state has no days")
assert.deepEqual(Model.historyDays({}), [], "a state with no history field does not throw")
assert.deepEqual(Model.historyDays(null), [], "nor does no state at all")

// Days before the epoch sort correctly alongside later ones.
let spanEpoch = Model.emptyState()
spanEpoch = Model.recordAnswer(spanEpoch, 0, 100, 100)
spanEpoch = Model.recordAnswer(spanEpoch, -1, 100, 100)
assert.deepEqual(Model.historyDays(spanEpoch).map((d) => d.day), [0, -1])

// Stats and History are two panels on one screen, so they must count the same
// days. A hand-edited state file used to make Stats say "5 played" while
// History correctly listed 3.
const handEdited = {
  history: {
    "10": { guess: 100, answerValue: 100, band: "Bullseye", distanceDecades: 0 },
    "11": { guess: 1, answerValue: 100, band: "Ballpark", distanceDecades: 2 },
    "": { guess: 1, answerValue: 1, band: "Close", distanceDecades: 0 },
    "notanumber": { guess: 1, answerValue: 1, band: "Close", distanceDecades: 0 },
    " 12": { guess: 1, answerValue: 1, band: "Close", distanceDecades: 0 }
  },
  streak: 2, bestStreak: 2, lastCompletedDay: 11
}
assert.equal(Model.historyDays(handEdited).length, 2, "History shows only real days")
assert.equal(Model.computeStats(handEdited).played, 2, "and Stats counts the same ones")
assert.equal(Model.computeStats(handEdited).totalPoints, 100 + 40, "points follow too")

// --- PLUGIN_VERSION must match what the plugin declares ---
// The widget shows this at the foot of the panel. A version display is only
// worth having if it is trustworthy, so the constant is pinned to the manifest
// rather than trusted to be updated alongside it.
//
// Skipped when running from the app repo, where the manifest does not travel
// with the vendored copy.
{
  const path = require("node:path")
  const manifestPath = path.join(__dirname, "manifest.json")
  if (require("node:fs").existsSync(manifestPath)) {
    const manifest = require(manifestPath)
    assert.equal(
      Model.PLUGIN_VERSION,
      manifest.version,
      `Model.js PLUGIN_VERSION is "${Model.PLUGIN_VERSION}" but manifest.json says "${manifest.version}" - bump both`
    )
  }
}

// --- the version is three numbers, and none of them may be padded ---
// major.minor.patch, meaning: a full release, a feature added within that
// release, and a fix or small change within that. Padding a field to two
// digits ("01.02.03") reads tidily but is not a valid version - leading zeros
// are forbidden, every field would cap at 99, and anything that parses
// versions either rejects it or sorts it wrongly.
assert.match(
  Model.PLUGIN_VERSION,
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/,
  `version "${Model.PLUGIN_VERSION}" must be major.minor.patch with no leading zeros`
)

// --- formatAsOf: BC years are stored negative but must not be shown that way ---
assert.equal(Model.formatAsOf(2025), "2025")
assert.equal(Model.formatAsOf(1800), "1800")
assert.equal(Model.formatAsOf(-250), "250 BC", "the Library of Alexandria is not 'as of -250'")
assert.equal(Model.formatAsOf(-10000), "10000 BC")
assert.equal(Model.formatAsOf(undefined), "")
assert.equal(Model.formatAsOf(null), "")

// Every dated question in the bank renders without a stray minus sign.
for (const q of questionBank) {
  if (q.asOf === undefined) continue
  const shown = Model.formatAsOf(q.asOf)
  assert.ok(shown.length > 0, `${q.id}: asOf ${q.asOf} rendered empty`)
  assert.ok(shown.indexOf("-") < 0, `${q.id}: asOf renders as "${shown}"`)
}

// --- questionId on history entries ---
// Needed to tie a past day back to the question it actually asked; the day
// number cannot do it, because growing the bank reshuffles the mapping.
const withId = Model.recordAnswer(Model.emptyState(), 3, 100, 100, false, "piano-tuners-chicago")
assert.equal(withId.history["3"].questionId, "piano-tuners-chicago")

// Absent when not supplied, so entries written before this existed stay valid
// and simply have nothing to link to.
const withoutId = Model.recordAnswer(Model.emptyState(), 3, 100, 100)
assert.ok(!("questionId" in withoutId.history["3"]))

// It must not disturb anything else about the entry.
assert.equal(withId.history["3"].band, "Bullseye")
assert.equal(withId.streak, 1)
assert.equal(Model.computeStats(withId).played, 1)
assert.equal(Model.historyDays(withId)[0].entry.questionId, "piano-tuners-chicago")

// --- archetypeStats: which shapes of problem you are weak on ---
{
  const pop = questionBank.filter((q) => q.strategy === "population-rate").slice(0, 3)
  const vol = questionBank.filter((q) => q.strategy === "volume-packing").slice(0, 3)

  let s = Model.emptyState()
  let day = 200
  for (const q of pop) s = Model.recordAnswer(s, day++, q.answerValue, q.answerValue, false, q.id)
  for (const q of vol) s = Model.recordAnswer(s, day++, q.answerValue * 1000, q.answerValue, false, q.id)

  const a = Model.archetypeStats(s, questionBank)
  assert.equal(a.attributed, 6)
  assert.equal(a.unattributed, 0)
  assert.equal(a.rows.length, 2)
  assert.equal(a.best.strategy, "population-rate", "the shape answered exactly is the strongest")
  assert.equal(a.worst.strategy, "volume-packing", "the shape answered 1000x out is the weakest")
  assert.equal(a.best.medianDecades, 0)
  assert.equal(a.worst.medianDecades, 3)
  assert.ok(a.rows[0].label.length > 3, "rows carry the human label, not just the key")

  // Days recorded before questionId existed cannot be attributed, and are
  // counted as such rather than being guessed at or silently dropped.
  const legacy = Model.recordAnswer(s, 300, 100, 100)
  const withLegacy = Model.archetypeStats(legacy, questionBank)
  assert.equal(withLegacy.attributed, 6)
  assert.equal(withLegacy.unattributed, 1)

  // A questionId that is no longer in the bank is unattributed too, rather
  // than throwing.
  const removed = Model.recordAnswer(s, 301, 100, 100, false, "no-such-question-any-more")
  assert.equal(Model.archetypeStats(removed, questionBank).unattributed, 1)

  // Below the floor a shape is listed but never called best or worst.
  let thin = Model.emptyState()
  thin = Model.recordAnswer(thin, 400, pop[0].answerValue, pop[0].answerValue, false, pop[0].id)
  thin = Model.recordAnswer(thin, 401, vol[0].answerValue * 100, vol[0].answerValue, false, vol[0].id)
  const thinStats = Model.archetypeStats(thin, questionBank)
  assert.equal(thinStats.rows.length, 2, "both shapes are still shown")
  assert.ok(thinStats.rows.every((r) => !r.ranked), "one play each is not enough to rank")
  assert.equal(thinStats.best, null)
  assert.equal(thinStats.worst, null)

  // One ranked shape is not a comparison either.
  let single = Model.emptyState()
  let d2 = 500
  for (const q of pop) single = Model.recordAnswer(single, d2++, q.answerValue, q.answerValue, false, q.id)
  assert.equal(Model.archetypeStats(single, questionBank).best, null, "needs two shapes to name a best and worst")

  // An empty history does not throw.
  const none = Model.archetypeStats(Model.emptyState(), questionBank)
  assert.deepEqual(none.rows, [])
  assert.equal(none.best, null)

  // Strategies are looked up from the bank, not stored on the entry, so
  // re-tagging a question re-attributes past days.
  const retagged = questionBank.map((q) => q.id === pop[0].id ? Object.assign({}, q, { strategy: "molar" }) : q)
  const afterRetag = Model.archetypeStats(s, retagged)
  assert.ok(afterRetag.rows.some((r) => r.strategy === "molar"), "a re-tagged question moves shape")
}

// --- practice must not spoil an upcoming daily ---
{
  const today = 1000

  const pool = Model.practicePool(questionBank, Model.emptyState(), [], today)
  assert.ok(pool.length > 0, "there is still something to practise on")

  // The property that matters: nothing the daily is about to serve.
  const upcoming = new Set()
  for (let d = today; d < today + Model.PRACTICE_RESERVE_DAYS; d++) {
    upcoming.add(Model.questionForDay(d, questionBank).id)
  }
  const leaked = pool.filter((q) => upcoming.has(q.id))
  assert.equal(leaked.length, 0, `practice offered ${leaked.length} question(s) due within the reserve window`)

  // Tomorrow's question in particular, which was the worst case.
  const tomorrow = Model.questionForDay(today + 1, questionBank).id
  assert.ok(!pool.some((q) => q.id === tomorrow), "practice must never hand over tomorrow's puzzle")

  // Reserving must not swallow the whole bank.
  assert.ok(pool.length > questionBank.length * 0.3, "a useful fraction is still practisable")

  // Already answered and already practised are still excluded.
  let played = Model.recordAnswer(Model.emptyState(), today - 400, 1, 1, false, pool[0].id)
  const afterPlay = Model.practicePool(questionBank, played, [], today)
  assert.ok(!afterPlay.some((q) => q.id === pool[0].id), "a question played as a daily is not offered")
  const afterPractice = Model.practicePool(questionBank, Model.emptyState(), [pool[1].id], today)
  assert.ok(!afterPractice.some((q) => q.id === pool[1].id), "a question already practised is not offered again")

  // pickPractice honours the same reserve.
  const picked = Model.pickPractice(questionBank, Model.emptyState(), [], today, () => 0)
  assert.ok(picked && !upcoming.has(picked.id), "the picked question is not one that is due soon")

  // A reserve wider than the bank must not leave nothing to play.
  const huge = Model.practicePool(questionBank, Model.emptyState(), [], today, 99999)
  assert.ok(huge.length > 0, "an over-wide reserve falls back rather than offering nothing")

  // With no day supplied nothing is reserved, and it still works.
  assert.equal(Object.keys(Model.reservedForDaily(questionBank, undefined)).length, 0)
  assert.ok(Model.practicePool(questionBank, Model.emptyState(), []).length > 0)
}

console.log("All Model.js tests passed.")
