// Schema and sanity checks for the World Records bank.
//
//   node games/records/questions.test.js
//
// The per-question rules are the shared ones in tools/bank-check.js - the same
// code that validates Fermi Questions, so the two banks cannot drift apart on
// what a valid question is. What is here is what is true of THIS bank only.

const assert = require("node:assert/strict")
const RECORDS = require("./questions.js")
const Model = require("../../core/Model.js")
const Games = require("../../core/games.js")
const { checkBank, report } = require("../../tools/bank-check.js")

const result = checkBank(RECORDS, {
  strategies: Object.keys(Model.STRATEGIES),

  // Every id begins with "records-". The Worker's D1 tables are keyed on a
  // bare question_id with no game column, so the prefix IS the namespace: two
  // banks sharing an id merge their answer distributions into one row, and
  // there is no way to separate them afterwards.
  idPrefix: "records-",

  // Mandatory here, optional for Fermi. A record is a fact with an expiry
  // date - Saturn had 274 confirmed moons in March 2025 and 285 a year later -
  // so a record with no stated year is simply wrong as soon as it is broken,
  // while one that names its year stays true forever.
  requireAsOf: true,

  // Individual records are facts and facts are free. Somebody else's curated
  // list of them is neither: "Guinness World Records" is a registered
  // trademark, commercial use of the name needs a licence, and a compilation
  // can attract UK database rights. Every value here is sourced to the body
  // that actually certifies it instead. Rejected outright rather than left to
  // vigilance, because it would creep back in through a source line.
  forbidden: [{
    pattern: /guinness/i,
    why: "names Guinness World Records - use the certifying authority " +
         "instead (a sport federation, a scientific body, an agency). The " +
         "name is a trademark and the compilation is theirs; the underlying " +
         "facts are not."
  }]
})

report(RECORDS, result)

assert.ok(RECORDS.length > 0, "the bank is empty")

// --- the registry and the bank must agree --------------------------------

const game = Games.gameById("records")
assert.ok(game, "there is no records game in the registry")
assert.equal(
  game.engine, "numeric-log",
  "World Records runs on Fermi's engine - same input, same log-distance " +
  "scoring, same four bands. If that changes, this bank's questions are no " +
  "longer the right shape for it."
)

// --- every record must be worth asking -----------------------------------
//
// This is the one that decides whether the game is any good, and it is worth
// stating in code even though only part of it can be checked.
//
// Bullseye is 0.3 decades, which is a factor of two. So a record everybody
// already knows to within a factor of two - the 100m sprint, the marathon, the
// tallest human - is a free 100 points and teaches nothing. Those do not
// belong here, and no test can tell that a question is too easy.
//
// What a test CAN do is insist the bank keeps its spread. A bank whose answers
// all sit in one or two decades would be a bank of questions with the same
// shape, and the player would learn the shape rather than the estimating.
{
  const decades = new Set(result.magnitudes)
  assert.ok(
    decades.size >= Math.min(8, RECORDS.length),
    `the bank spans only ${decades.size} orders of magnitude across ` +
    `${RECORDS.length} questions. Answers that all live in the same decade ` +
    `teach the player the bank rather than the estimating.`
  )
}

// Every question needs a hint that does work. The shared checker enforces a
// floor of 30 characters, which is enough to catch an empty one; here the bar
// is higher, because a record question with a weak hint collapses into recall
// and recall is exactly what this game is not.
for (const q of RECORDS) {
  assert.ok(
    q.decompositionHint.length >= 60,
    `"${q.id}" has a ${q.decompositionHint.length}-character hint. A record ` +
    `is only an estimation question if there is a way to reason to the ` +
    `magnitude, and the hint is where that reasoning is written down.`
  )
}

// --- the append-only rule, now that the game is live ----------------------
//
// The bank's array order IS the calendar: day N is served
// RECORDS[N - scheduleOrigin]. While the game was coming-soon this bank could
// be reordered, rewritten and culled freely, because nobody had been promised
// anything. From the day it went live that stopped being true - inserting or
// removing anything inside the pinned span silently re-dates every question
// after it, which once changed the puzzle mid-day on Fermi for anyone playing.
//
// So the ids are pinned by checksum. Appending to the END leaves this
// untouched and needs no change here, and every question appended pushes the
// wrap date out by another day. If this fails, the bank was edited in place:
// put it back and append instead.
//
// Covers ids only, deliberately. Fixing a wrong answer, a typo, a source or a
// hint on a question that is already scheduled is fine and should stay fine -
// none of that moves anything.
// Extended from 49 to the whole bank once it reached a year's worth. Anyone
// can work out what tomorrow's question is by reading this file, so every day
// in here is promised, not just the ones already served.
//
// The 49 that were live before the extension are the first 49 entries and
// their order is unchanged - which is what made the rest of the bank safe to
// edit, cull and rewrite right up until this line was changed.
// The whole bank, since September 2026.
//
// It sat at 365 while the tail was unverified, because the pin blocks removal
// as well as reordering and verification had twice turned up a question that
// had to come out rather than be repriced. Every question in the bank has now
// been checked against a source - see VERIFICATION.md - so the reason for
// holding the span short has gone.
//
// The pin still covers ids and not values, so a wrong answer found later can
// always be corrected in place. Only reordering and removal are blocked, and
// both of those re-date questions that people have already been promised.
const SCHEDULED_SPAN = 463
const SCHEDULE_FINGERPRINT =
  "df138aec3753f3df78521dd36cec11c2a6f8f380ed8c5205d21a06d826d4d414"

assert.ok(
  RECORDS.length >= SCHEDULED_SPAN,
  `bank shrank to ${RECORDS.length}: questions may be appended but never removed`
)

const fingerprint = require("node:crypto")
  .createHash("sha256")
  .update(RECORDS.slice(0, SCHEDULED_SPAN).map((q) => q.id).join(","))
  .digest("hex")

assert.equal(
  fingerprint, SCHEDULE_FINGERPRINT,
  `the first ${SCHEDULED_SPAN} questions changed order. The bank is ` +
  "append-only: new questions go at the end, so that days already scheduled " +
  "keep the question they were promised."
)

// The schedule must be able to serve every day it claims to cover.
const served = new Set()
for (let d = game.scheduleOrigin; d < game.scheduleOrigin + RECORDS.length; d++) {
  const q = Model.questionForDay(d, RECORDS, game.scheduleOrigin)
  assert.ok(q, `day ${d} has no question`)
  assert.ok(!served.has(q.id), `day ${d} repeats ${q.id} within one pass`)
  served.add(q.id)
}
assert.equal(served.size, RECORDS.length, "every question is scheduled exactly once")

console.log(`registry:         ${game.name}, ${game.status}, engine ${game.engine}`)
console.log(`scheduled:        ${RECORDS.length} days from ${Model.formatDay(game.scheduleOrigin)}`)
console.log(`years covered:    ${Math.min(...RECORDS.map((q) => q.asOf))} .. ${Math.max(...RECORDS.map((q) => q.asOf))}`)
console.log("\nAll World Records bank checks passed.")
