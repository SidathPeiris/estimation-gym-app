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

// --- the schedule is not frozen yet --------------------------------------
//
// Fermi pins the first 1000 ids by checksum, because those days are live: a
// reorder would re-date a question somebody has already been promised. This
// bank has never been served to anybody, so it can still be reordered,
// rewritten and culled freely - which is the whole point of building it while
// the game is coming-soon.
//
// The day the registry entry flips to "live", that stops being true. This
// block is what turns the rule on, and the assertion below is here so it
// cannot be forgotten: a live game with an unpinned schedule is exactly the
// bug the Fermi fingerprint exists to prevent.
assert.equal(
  game.status, "coming-soon",
  "World Records is live, so its schedule must be pinned the way Fermi's is: " +
  "set SCHEDULED_SPAN to the number of days already promised and add the " +
  "SHA-256 of those ids, so the bank becomes append-only from that day on."
)

console.log(`registry:         ${game.name}, ${game.status}, engine ${game.engine}`)
console.log(`schedule:         not yet pinned - the game is not live`)
console.log(`years covered:    ${Math.min(...RECORDS.map((q) => q.asOf))} .. ${Math.max(...RECORDS.map((q) => q.asOf))}`)
console.log("\nAll World Records bank checks passed.")
