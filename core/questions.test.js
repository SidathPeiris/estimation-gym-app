// Schema and sanity checks for the Fermi Questions bank.
//
//   node core/questions.test.js
//
// The bank is the part of this app most likely to be edited in bulk, and a
// question with a wrong answer is worse than a missing one - it marks a
// correct guess as "Off" and quietly discredits the scoring.
//
// The per-question rules used to be written out here. They now live in
// tools/bank-check.js, because World Records is a second bank that has to obey
// the same ones, and a specification with two copies is a specification that
// drifts. Nothing was relaxed in the move. What stayed here is what is true of
// THIS bank and no other: it may leave asOf off, its ids carry no prefix, and
// its first 1000 entries are a live schedule that can never be reordered.

const assert = require("node:assert/strict")
const QUESTIONS = require("./questions.js")
const Model = require("./Model.js")
const { checkBank, report } = require("../tools/bank-check.js")

const result = checkBank(QUESTIONS, {
  strategies: Object.keys(Model.STRATEGIES),

  // Fermi's ids shipped unprefixed and cannot be renamed: the fingerprint
  // below pins them, and the Worker's D1 tables hold live rows keyed on those
  // exact strings. It is the single allowlisted exception to the id-prefix
  // contract, which core/games.test.js states in full.
  idPrefix: "",

  // Optional here, and deliberately so. Most Fermi questions are about
  // quantities that do not have a year - the number of bacteria on a phone
  // screen is not a record anybody breaks - so requiring one would mean
  // inventing it. World Records is the bank where it is mandatory.
  requireAsOf: false
})

report(QUESTIONS, result)

assert.ok(QUESTIONS.length > 0, "bank is not empty")

// --- the append-only rule ---
//
// The bank's array order IS the daily schedule: day N is served QUESTIONS[N -
// SCHEDULE_ORIGIN]. That is what makes growing the bank safe, but it only
// holds while the existing entries stay put. Inserting, reordering or deleting
// anything inside the frozen span silently re-dates every question after it,
// which is the bug this whole arrangement exists to prevent - it once changed
// the puzzle mid-day for anyone playing.
//
// So the first SCHEDULED_SPAN ids are pinned by checksum. Adding questions to
// the END leaves this untouched and needs no change here. If this fails, the
// bank was edited in place: put it back and append instead.
//
// Deliberately covers ids only. Fixing a wrong answer, a typo or a source on a
// question that is already scheduled is fine and should stay fine - it does
// not move anything.
const SCHEDULED_SPAN = 1000
const SCHEDULE_FINGERPRINT =
  "8d518d2a8f5ffa5482e4c2ee94439f4d63d8f8280f6deeee28baaf7603229013"

assert.ok(
  QUESTIONS.length >= SCHEDULED_SPAN,
  `bank shrank to ${QUESTIONS.length}: questions may be appended but never removed`
)

const fingerprint = require("node:crypto")
  .createHash("sha256")
  .update(QUESTIONS.slice(0, SCHEDULED_SPAN).map((q) => q.id).join(","))
  .digest("hex")

assert.equal(
  fingerprint,
  SCHEDULE_FINGERPRINT,
  "the first " + SCHEDULED_SPAN + " questions changed order. The bank is " +
  "append-only: new questions go at the end, so that days already scheduled " +
  "keep the question they were promised."
)

// The schedule must actually be able to serve every day it claims to cover.
const origin = Model.SCHEDULE_ORIGIN
const served = new Set()
for (let d = origin; d < origin + QUESTIONS.length; d++) {
  const q = Model.questionForDay(d, QUESTIONS)
  assert.ok(q, "day " + d + " has no question")
  assert.ok(!served.has(q.id), "day " + d + " repeats " + q.id + " within one pass")
  served.add(q.id)
}
assert.equal(served.size, QUESTIONS.length, "every question is scheduled exactly once")

console.log(`scheduled:        ${QUESTIONS.length} days from ${Model.formatDay(origin)}`)
console.log("\nAll question bank checks passed.")
