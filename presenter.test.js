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
assert.equal(before.puzzleLabel, "Puzzle #981")
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
