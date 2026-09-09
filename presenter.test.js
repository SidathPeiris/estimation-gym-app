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

// BC years are stored negative for arithmetic but must not be shown that way.
const bcQuestion = Object.assign({}, question, { asOf: -250 })
assert.equal(P.viewModel(Model, fresh, bcQuestion, 981).asOfLabel, "as of 250 BC")

// Every dated question in the shipped bank must render its year, and no
// timeless one may invent a year it does not have. Formatting comes from the
// Model so the widget dates a question identically.
for (const q of QUESTIONS) {
  const rendered = P.viewModel(Model, Model.emptyState(), q, 1)
  if ("asOf" in q) {
    assert.equal(rendered.asOfLabel, "as of " + Model.formatAsOf(q.asOf), `${q.id}: shows its year`)
    assert.ok(rendered.asOfLabel.indexOf("-") < 0, `${q.id}: no stray minus sign`)
  } else {
    assert.equal(rendered.asOfLabel, null, `${q.id}: timeless, no year shown`)
  }
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

// --- hints ---
// The test question carries no strategy, so it exercises the fallback path a
// contributed question would hit before it is tagged.
const hintFresh = Model.emptyState()
const hintOffered = P.viewModel(Model, hintFresh, question, 1, undefined, false)
assert.equal(hintOffered.hintAvailable, true, "an unanswered day offers the hint")
assert.equal(hintOffered.hintRevealed, false)
assert.ok(hintOffered.strategyGuidance.length > 60, "there is guidance behind the offer")

const hintRevealedVm = P.viewModel(Model, hintFresh, question, 1, undefined, true)
assert.equal(hintRevealedVm.hintAvailable, false, "the offer is withdrawn once taken")
assert.equal(hintRevealedVm.hintRevealed, true)

// Once the day is answered neither the offer nor the reveal applies; the
// archetype label is shown regardless, because the shape is what transfers.
const hintDone = Model.recordAnswer(hintFresh, 1, 100, 100)
const afterView = P.viewModel(Model, hintDone, question, 1, undefined, true)
assert.equal(afterView.hintAvailable, false)
assert.equal(afterView.hintRevealed, false)
assert.ok(afterView.strategyLabel.startsWith("Approach: "))

// A hinted day scores half and says so, in the result and in history.
const aided = Model.recordAnswer(Model.emptyState(), 1, 100, 100, true)
const aidedView = P.viewModel(Model, aided, question, 1)
assert.equal(aidedView.result.points, 50)
assert.equal(aidedView.result.assisted, true)
assert.ok(aidedView.result.pointsLabel.includes("hint"))
assert.equal(aidedView.history.rows[0].assisted, true)
assert.equal(aidedView.history.rows[0].points, 50)

const unaidedView = P.viewModel(Model, hintDone, question, 1)
assert.equal(unaidedView.result.points, 100)
assert.equal(unaidedView.result.assisted, false)
assert.ok(!unaidedView.result.pointsLabel.includes("hint"))
assert.equal(unaidedView.history.rows[0].assisted, false)

// A shared result must not quietly pass off a hinted score as unaided.
assert.ok(P.shareText(Model, aided, question, 1, "").includes("hint"))
assert.ok(!P.shareText(Model, hintDone, question, 1, "").includes("hint"))

// Stats mention hinted days only when there are some.
assert.ok(P.viewModel(Model, aided, question, 1).stats.footer.includes("1 with a hint"))
assert.ok(!P.viewModel(Model, hintDone, question, 1).stats.footer.includes("hint"))

// --- archetype breakdown ---
{
  const pop = QUESTIONS.filter((q) => q.strategy === "population-rate").slice(0, 4)
  const vol = QUESTIONS.filter((q) => q.strategy === "volume-packing").slice(0, 4)
  const day = 700
  const vm = (s) => P.viewModel(Model, s, question, 1, 20, false, QUESTIONS).archetypes

  // Nothing to say yet, and it does not pretend otherwise.
  assert.equal(vm(Model.emptyState()).visible, false)

  // One play each: both shown, neither ranked, no headline.
  let thin = Model.recordAnswer(Model.emptyState(), day, pop[0].answerValue, pop[0].answerValue, false, pop[0].id)
  thin = Model.recordAnswer(thin, day + 1, vol[0].answerValue * 50, vol[0].answerValue, false, vol[0].id)
  const thinView = vm(thin)
  assert.equal(thinView.visible, true)
  assert.equal(thinView.headline, null, "two single plays are not a comparison")
  assert.ok(thinView.rows.every((r) => !r.ranked))
  assert.ok(thinView.note.length > 0)

  // Enough of each: the headline names the best and worst shape.
  let rich = Model.emptyState()
  let d = day
  for (const q of pop) rich = Model.recordAnswer(rich, d++, q.answerValue, q.answerValue, false, q.id)
  for (const q of vol) rich = Model.recordAnswer(rich, d++, q.answerValue * 1000, q.answerValue, false, q.id)
  const richView = vm(rich)
  assert.match(richView.headline, /^Strongest on /)
  assert.match(richView.headline, /Weakest on /)
  assert.ok(richView.headline.includes("people times per-person rate"))
  assert.ok(richView.headline.includes("container volume over item volume"))
  assert.equal(richView.note, null, "nothing to caveat when every day is attributed")
  assert.equal(richView.rows[0].medianLabel, "0.00 dec")

  // Days predating questionId are called out rather than silently missing.
  const withLegacy = vm(Model.recordAnswer(rich, 900, 100, 100))
  assert.match(withLegacy.note, /1 earlier day is not included/)

  // The bank must be passed in; without it the view stays quiet rather than
  // throwing or inventing attribution.
  const noBank = P.viewModel(Model, rich, question, 1, 20, false).archetypes
  assert.equal(noBank.rows.length, 0)
}

// --- the shared run of squares ---
{
  const day = 800
  const BULLSEYE = "🎯", GREEN = "🟢", RED = "🔴", BLANK = "⬜"

  // A first ever day shares one square, not six blanks and a square.
  const first = Model.recordAnswer(Model.emptyState(), day, 100, 100, false, "q")
  assert.equal(P.shareRun(first, day), BULLSEYE)

  // A full week reads oldest to newest.
  let week = Model.emptyState()
  for (let i = 0; i < 7; i++) {
    // Day-6 is an Off, the rest are Bullseyes, so position is checkable.
    const guess = i === 0 ? 1e9 : 100
    week = Model.recordAnswer(week, day - 6 + i, guess, 100, false, "q" + i)
  }
  const run = P.shareRun(week, day)
  assert.equal([...run].length, 7, "seven days, seven squares")
  assert.ok(run.startsWith(RED), "the oldest day comes first")
  assert.ok(run.endsWith(BULLSEYE), "today comes last")

  // A gap in the middle stays a gap: closing it up would misrepresent a streak.
  let gappy = Model.recordAnswer(Model.emptyState(), day - 5, 100, 100, false, "a")
  gappy = Model.recordAnswer(gappy, day, 100, 100, false, "b")
  const gapRun = P.shareRun(gappy, day)
  assert.equal([...gapRun].length, 6, "trimmed to the first played day, gaps kept")
  assert.equal([...gapRun].filter((c) => c === BLANK).length, 4)

  // A day with no history at all shares nothing.
  assert.equal(P.shareRun(Model.emptyState(), day), "")
}

// --- the full share text ---
{
  const day = 810
  let s = Model.recordAnswer(Model.emptyState(), day - 1, 100, 100, false, "a")
  s = Model.recordAnswer(s, day, 60, 100, false, "b")
  const text = P.shareText(Model, s, question, day, "https://example.test/")
  const lines = text.split("\n")

  assert.match(lines[0], /^Estimation Gym · /)
  assert.equal([...lines[1]].length, 2, "the run is its own line")
  assert.match(lines[2], /decades off/)
  assert.match(lines[3], /^Streak /)
  assert.equal(lines[4], "")
  assert.equal(lines[5], "https://example.test/")

  // Still spoiler-free: neither the guess nor the answer may appear anywhere.
  assert.ok(!text.includes("60"), "the guess must not be shared")
  assert.ok(!text.includes("100"), "the answer must not be shared")

  // A hinted day still says so.
  const hinted = Model.recordAnswer(Model.emptyState(), day, 100, 100, true, "b")
  assert.ok(P.shareText(Model, hinted, question, day, "").includes("hint"))

  // Nothing to share before answering.
  assert.equal(P.shareText(Model, Model.emptyState(), question, day, ""), null)
}

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
