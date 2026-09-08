const assert = require("node:assert/strict")
const Model = require("./core/Model.js")
const QUESTIONS = require("./core/questions.js")
const P = require("./presenter.js")

const question = {
  id: "test",
  prompt: "How many test things?",
  unit: "things",
  answerValue: 100,
  decompositionHint: "Break it down.",
  source: "Made up for the test"
}

// --- tone mapping mirrors bandColor() in Widget.qml ---
assert.equal(P.toneForBand("Bullseye"), "accent")
assert.equal(P.toneForBand("Close"), "accent")
assert.equal(P.toneForBand("Ballpark"), "neutral")
assert.equal(P.toneForBand("Off"), "urgent")

// --- guess validation matches submitGuess() in Widget.qml ---
assert.equal(P.validateGuess("").ok, false)
assert.equal(P.validateGuess("   ").ok, false)
assert.equal(P.validateGuess("0").ok, false)
assert.equal(P.validateGuess("-5").ok, false)
assert.equal(P.validateGuess("abc").ok, false)
assert.equal(P.validateGuess("").message, "Enter a positive number")
assert.equal(P.validateGuess("60").ok, true)
assert.equal(P.validateGuess("60").value, 60)
assert.equal(P.validateGuess("3e12").value, 3e12, "scientific notation is accepted")

// --- unanswered day ---
const fresh = Model.emptyState()
const before = P.viewModel(Model, fresh, question, 981)
assert.equal(before.dateLabel, "Tue 8 Sep", "day 981 is 8 September 2026")
assert.equal(before.dateLabel, Model.formatDay(981), "the label comes from the day index, not the clock")
assert.equal(before.streakLabel, "Streak 0 · Best 0")
assert.equal(before.prompt, "How many test things?")
assert.equal(before.placeholder, "Guess (things)")
assert.equal(before.answered, false)
assert.equal(before.result, null)
assert.equal(before.hint, null, "the hint stays hidden until the guess is locked in")
assert.equal(before.source, null)
assert.equal(before.stats.visible, false, "stats hide until at least one day is played")

// --- answered day ---
let played = Model.recordAnswer(fresh, 981, 60, question.answerValue)
const after = P.viewModel(Model, played, question, 981)
assert.equal(after.answered, true)
assert.equal(after.result.band, "Bullseye")
assert.equal(after.result.tone, "accent")
assert.equal(after.result.points, 100)
assert.equal(after.result.pointsLabel, "+100 pts")
assert.equal(after.result.guessLine, "Your guess: 60 things")
assert.equal(after.result.actualLine, "Actual: 100 things")
assert.equal(after.result.decadesLine, "Off by 0.22 orders of magnitude")
assert.equal(after.hint, "How to think about it: Break it down.")
assert.equal(after.source, "Source: Made up for the test")
assert.equal(after.stats.visible, true)
assert.equal(after.stats.summary, "1 played · 100 pts")

// --- stats bars cover every band and sum to the number played ---
let multi = Model.emptyState()
multi = Model.recordAnswer(multi, 1, 100, 100)   // Bullseye
multi = Model.recordAnswer(multi, 2, 1000, 100)  // Close
multi = Model.recordAnswer(multi, 3, 1e7, 100)   // Off
const vm = P.viewModel(Model, multi, question, 3)
assert.deepEqual(vm.stats.bars.map((b) => b.band), Model.BANDS)
assert.equal(vm.stats.bars.reduce((n, b) => n + b.tally, 0), vm.stats.played)
const bullseye = vm.stats.bars.find((b) => b.band === "Bullseye")
assert.equal(bullseye.tally, 1)
assert.ok(Math.abs(bullseye.fraction - 1 / 3) < 1e-9, "fraction is share of days played")
assert.equal(vm.stats.bars.find((b) => b.band === "Ballpark").fraction, 0, "unused bands render an empty bar")
assert.equal(vm.stats.summary, "3 played · 180 pts")

// --- the result reflects what you were scored against, not today's bank ---
// Growing the question bank reshuffles day-to-question mapping, so a result
// recorded earlier must not be redisplayed against a different question's answer.
let recorded = Model.recordAnswer(Model.emptyState(), 981, 60, 100)
const swapped = Object.assign({}, question, { answerValue: 999999, prompt: "A different question?" })
const afterSwap = P.viewModel(Model, recorded, swapped, 981)
assert.ok(afterSwap.result.actualLine.includes("100"),
  "the actual value comes from the stored entry, not from whatever question now occupies the day")
assert.ok(!afterSwap.result.actualLine.includes("999,999"))
assert.equal(afterSwap.result.band, "Bullseye", "the band recorded at the time still stands")

// --- asOf year ---
assert.equal(before.asOfLabel, null, "a timeless question carries no year")
const datedQuestion = Object.assign({}, question, { asOf: 2025 })
assert.equal(P.viewModel(Model, fresh, datedQuestion, 981).asOfLabel, "as of 2025")

// Every dated question in the shipped bank must render its year, and no
// timeless one may invent a year it does not have.
for (const q of QUESTIONS) {
  const rendered = P.viewModel(Model, Model.emptyState(), q, 1)
  if ("asOf" in q) assert.equal(rendered.asOfLabel, "as of " + q.asOf, `${q.id}: shows its year`)
  else assert.equal(rendered.asOfLabel, null, `${q.id}: timeless, no year shown`)
}

// --- calibration surfaces through the view model ---
assert.equal(vm.stats.calibration, null, "three days is not enough to report a lean")
let leaning = Model.emptyState()
for (let d = 1; d <= Model.CALIBRATION_MIN_PLAYS; d++) leaning = Model.recordAnswer(leaning, d, 10, 100)
const leaningVm = P.viewModel(Model, leaning, question, Model.CALIBRATION_MIN_PLAYS)
assert.ok(leaningVm.stats.calibration.includes("low"), "a consistent low lean is reported once earned")

// --- history view ---
assert.equal(P.historyView(Model, Model.emptyState(), 20).visible, false, "no history to show yet")
assert.deepEqual(P.historyView(Model, Model.emptyState(), 20).rows, [])

let hist = Model.emptyState()
hist = Model.recordAnswer(hist, 979, 10, 100)     // Close, guessed low
hist = Model.recordAnswer(hist, 980, 1e7, 100)    // Off
hist = Model.recordAnswer(hist, 981, 100, 100)    // Bullseye
const view = P.historyView(Model, hist, 20)

assert.equal(view.visible, true)
assert.equal(view.total, 3)
assert.deepEqual(view.rows.map((r) => r.day), [981, 980, 979], "newest day first")
assert.equal(view.rows[0].band, "Bullseye")
assert.equal(view.rows[0].dateLabel, Model.formatDay(981), "each row is dated from its own day index")
assert.equal(view.rows[0].points, 100)
assert.equal(view.rows[1].tone, "urgent", "an Off row is toned as urgent")

// Each row reports the value it was scored against, which is what makes old
// rows survive the bank being reshuffled.
assert.equal(view.rows[2].guessLabel, "10")
assert.equal(view.rows[2].actualLabel, "100")
assert.equal(view.rows[2].decadesLabel, "1.00")

// --- paging ---
let many = Model.emptyState()
for (let d = 900; d <= 950; d++) many = Model.recordAnswer(many, d, 100, 100)
const paged = P.historyView(Model, many, 20)
assert.equal(paged.total, 51, "total counts every played day")
assert.equal(paged.shown, 20, "only a page is returned")
assert.equal(paged.rows[0].day, 950, "the page starts at the most recent day")
assert.equal(P.historyView(Model, many, 0).shown, 51, "a limit of 0 returns everything")

// --- corrupted entries are skipped rather than crashing the list ---
const messy = { history: { "1": null, "2": { band: "Close", guess: 5, answerValue: 10, distanceDecades: 0.3 }, "oops": { band: "Close" } } }
const messyView = P.historyView(Model, messy, 20)
assert.equal(messyView.total, 1, "null entries and non-numeric day keys are skipped")
assert.equal(messyView.rows[0].day, 2)

// An entry missing its answerValue still renders rather than showing NaN.
const noAnswer = { history: { "5": { band: "Off", guess: 3, distanceDecades: null } } }
const noAnswerRow = P.historyView(Model, noAnswer, 20).rows[0]
assert.equal(noAnswerRow.actualLabel, "?")
assert.equal(noAnswerRow.decadesLabel, "?")

// --- history reaches the view model ---
assert.equal(P.viewModel(Model, hist, question, 981).history.total, 3)
assert.equal(P.viewModel(Model, Model.emptyState(), question, 981).history.visible, false)

// --- share text ---
const spoiler = { ...question, answerValue: 137, unit: "widgets" }
assert.equal(P.shareText(Model, Model.emptyState(), spoiler, 981, "https://example.test"), null,
  "nothing to share before answering")

let shared = Model.recordAnswer(Model.emptyState(), 981, 61, 137)
const text = P.shareText(Model, shared, spoiler, 981, "https://example.test")
assert.ok(text.includes("Estimation Gym · Tue 8 Sep"), "names the day by date, not by an opaque number")
assert.ok(!text.includes("#981"), "the day number is no longer surfaced")
assert.ok(text.includes("Close"), "names the band")
assert.ok(text.includes("decades off"), "says how close")
assert.ok(text.includes("Streak 1"), "includes the streak")
assert.ok(text.includes("https://example.test"), "links back to the app")

// The whole point of a shared result is that it can be posted before other
// people have played, so it must not leak the answer or the guess.
assert.ok(!text.includes("137"), "does not reveal the true value")
assert.ok(!text.includes("61"), "does not reveal the guess")
assert.ok(!text.includes(spoiler.prompt), "does not reveal the question itself")

// A URL is optional so the same function serves a native share sheet.
assert.ok(!P.shareText(Model, shared, spoiler, 981).includes("http"))

// Every band produces a distinct emoji so the shared line is scannable.
assert.equal(new Set(Object.values(P.BAND_EMOJI)).size, Model.BANDS.length)
for (const band of Model.BANDS) assert.ok(P.BAND_EMOJI[band], `${band} has an emoji`)

// --- a missing question must not throw (empty or failed bank load) ---
const noQuestion = P.viewModel(Model, Model.emptyState(), null, 7)
assert.equal(noQuestion.prompt, "No question available")
assert.equal(noQuestion.result, null)

// --- every shipped question renders without throwing ---
for (const q of QUESTIONS) {
  let s = Model.recordAnswer(Model.emptyState(), 1, q.answerValue, q.answerValue)
  const rendered = P.viewModel(Model, s, q, 1)
  assert.equal(rendered.result.band, "Bullseye", `${q.id}: guessing the exact answer is a Bullseye`)
  assert.ok(rendered.prompt.length > 0, `${q.id}: has a prompt`)
  assert.ok(rendered.hint.length > 0, `${q.id}: has a hint`)
  assert.ok(rendered.result.actualLine.includes(q.unit), `${q.id}: actual line names the unit`)
}

console.log(`All presenter tests passed (${QUESTIONS.length} questions rendered).`)
