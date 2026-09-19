// Schema and sanity checks for the Historical Dates bank.
//
//   node games/dates/questions.test.js
//
// The rules that are not about the answer are the shared ones in
// tools/bank-check.js - the same code that validates Fermi Questions and World
// Records - so three banks cannot drift apart on what a valid question is.
// What is here is what is true of THIS bank only, and the answer is most of it:
// this is the first bank whose answer is a point on the calendar rather than a
// quantity, so none of the numeric checks apply and all of these are new.

const assert = require("node:assert/strict")
const { readFileSync } = require("node:fs")
const path = require("node:path")
const DATES = require("./questions.js")
const Model = require("../../core/Model.js")
const Games = require("../../core/games.js")
const { checkBank, report } = require("../../tools/bank-check.js")

// Day precision claims a specific calendar date, and a calendar date before
// the Gregorian reform is not one thing. Catholic Europe changed in 1582,
// Britain and its colonies in 1752, Russia in 1918 - so a single date can be
// eleven days apart depending on who wrote it down, which is four times the
// Bullseye band.
//
// The half of that a test can enforce is the floor. The other half is the
// author's: an event dated in the Julian calendar by its own sources - pre-1918
// Russia above all - is asked to the year, never to the day, however modern it
// looks.
const GREGORIAN_FLOOR = 1753

const EARLIEST_YEAR = -4000
const CURRENT_YEAR = new Date().getFullYear()

const result = checkBank(DATES, {
  // Every id begins with "dates-", as every bank after Fermi does. The
  // Worker's D1 tables are keyed on a bare question_id with no game column, so
  // the prefix IS the namespace: two banks sharing an id merge their answer
  // distributions into one row and cannot be separated afterwards.
  idPrefix: "dates-",

  // No unit, no answerValue, no strategy, no asOf.
  //
  // The first three have nothing to describe here - the unit is the calendar,
  // the answer is a date, and Model.STRATEGIES is a taxonomy of ways to
  // estimate a quantity. The fourth is the interesting one: a record needs a
  // year because it stops being true the day it is broken, and a historical
  // date does not stop being true at all. A question here that wanted an asOf
  // would be a question about the present wearing the wrong game's clothes.
  required: ["id", "prompt", "precision", "decompositionHint", "source"],
  optional: ["answerYear", "answerDate"],

  // Every prompt in this bank asks the same thing in nearly the same words, so
  // without these the near-duplicate check compares the question frame rather
  // than the subject and every pair looks alike.
  //
  // Only the frame, though. Words like "first", "built" or "founded" are part
  // of the subject and have to keep counting, or two genuinely different
  // questions about two different foundings stop looking different.
  stopWords: ["year", "date", "when", "did", "was", "were", "happen", "happened",
              "which", "around", "into", "with", "its", "one", "made", "given"],

  answer: (q, fail) => {
    const precision = q.precision
    const spec = Model.PRECISIONS[precision]
    if (!spec) {
      fail(`precision "${precision}" is not one of: ${Object.keys(Model.PRECISIONS).join(", ")}`)
      return
    }

    const wantsDate = spec.input === "date"

    // Exactly one answer field, and it must be the one the precision implies.
    // A question carrying both would be scored against whichever the engine
    // looked at first, and the other would sit there looking authoritative.
    if (wantsDate && !("answerDate" in q)) fail("day precision needs an answerDate")
    if (wantsDate && "answerYear" in q) fail("day precision must not also carry an answerYear")
    if (!wantsDate && !("answerYear" in q)) fail(`${precision} precision needs an answerYear`)
    if (!wantsDate && "answerDate" in q) fail(`${precision} precision must not also carry an answerDate`)

    if (wantsDate) {
      if (typeof q.answerDate !== "string" || Model.dayNumberForDate(q.answerDate) === null) {
        fail(`answerDate "${q.answerDate}" is not a real date in YYYY-MM-DD`)
        return
      }
      const year = Number(q.answerDate.slice(0, 4))
      if (year < GREGORIAN_FLOOR) {
        fail(`answerDate is ${year}, before the ${GREGORIAN_FLOOR} Gregorian floor - ` +
             `a calendar date that old is Julian or Gregorian depending on who ` +
             `wrote it, and the two are days apart. Ask this one to the year.`)
      }
      if (year > CURRENT_YEAR) fail(`answerDate ${q.answerDate} is in the future`)
      return
    }

    if (!Number.isInteger(q.answerYear)) {
      fail(`answerYear ${q.answerYear} must be a whole year`)
      return
    }
    // There is no year zero: 1 BC is followed directly by AD 1, which is the
    // convention Model.yearsBetween and Model.formatYear both assume.
    if (q.answerYear === 0) fail("there is no year zero - 1 BC is -1 and AD 1 is 1")
    if (q.answerYear < EARLIEST_YEAR || q.answerYear > CURRENT_YEAR) {
      fail(`answerYear ${q.answerYear} is outside ${EARLIEST_YEAR}..${CURRENT_YEAR}`)
    }
  }
})

// --- the prompt must not contain its own answer ---------------------------
//
// Easy to do without noticing on a question that names a war, a treaty or a
// spacecraft that already carries its year, and it turns the day into a
// reading comprehension test worth a hundred points.
for (const q of DATES) {
  const year = Model.answerForQuestion(q)
  const written = typeof year === "number"
    ? String(Math.abs(year))
    : String(q.answerDate || "").slice(0, 4)
  if (!written) continue
  assert.ok(
    !new RegExp(`\\b${written}\\b`).test(q.prompt),
    `"${q.id}" prints ${written} in its own prompt: ${q.prompt}`
  )
}

// --- the game is triangulation, so the hint has to teach it ---------------
//
// The shared checker enforces a floor of 30 characters, which catches an empty
// one. The bar is higher here for the same reason it is higher in World
// Records: without a way to reason towards the answer, a date question is
// recall, and recall is exactly what this game is not.
//
// A good hint brackets. It names two things the player is likely to be able to
// place and says which side of them this falls on.
for (const q of DATES) {
  assert.ok(
    q.decompositionHint.length >= 60,
    `"${q.id}" has a ${q.decompositionHint.length}-character hint. A date is ` +
    `only an estimation question if there is a way to reason to it.`
  )
}

report(DATES, result, [
  `precisions:       ${Object.keys(Model.PRECISIONS)
    .map((p) => `${p} ${DATES.filter((q) => q.precision === p).length}`)
    .join(", ")}`
])

assert.ok(DATES.length > 0, "the bank is empty")

// --- the registry and the bank must agree ---------------------------------

const game = Games.gameById("dates")
assert.ok(game, "there is no dates game in the registry")
assert.equal(
  game.engine, "date",
  "Historical Dates runs on the date engine - absolute distance in years or " +
  "days, scaled by each question's precision. If that changes, this bank's " +
  "questions are no longer the right shape for it."
)

// --- the bank must still slice out as JSON --------------------------------
//
// The service worker has no payload to read, so it builds the reminder by
// taking everything between this file's first "[" and its last "]" and parsing
// it. A square bracket anywhere in the header - in a comment, in an example -
// moves that start point and the parse fails, which drops this game silently
// out of the notification. It cost a green test run to find the first time.
{
  const raw = readFileSync(path.join(__dirname, "questions.js"), "utf8")
  const start = raw.indexOf("[")
  const end = raw.lastIndexOf("]")
  assert.ok(start >= 0 && end > start, "the bank no longer looks like an array")
  const sliced = JSON.parse(raw.slice(start, end + 1))
  assert.equal(
    sliced.length, DATES.length,
    "the text before the array contains a square bracket, so the service " +
    "worker slices from the wrong place and this bank drops out of the reminder"
  )
}

// --- the append-only rule, now that the game is live ----------------------
//
// The bank's array order IS the calendar: day N serves the entry at N minus
// the schedule origin. While the game was coming-soon this bank could be
// reordered, rewritten and culled freely, because nobody had been promised
// anything. From the day it went live that stopped being true - inserting or
// removing anything inside the pinned span silently re-dates every question
// after it, which once changed the puzzle mid-day on Fermi for anyone playing.
//
// So the ids are pinned by checksum. Appending to the END leaves this
// untouched and needs no change here, which is why the span is a literal
// rather than DATES.length: every question added pushes the wrap date out by
// a day without disturbing a single day already scheduled. If this fails, the
// bank was edited in place - put it back and append instead.
//
// Covers ids only, deliberately. Fixing a wrong answer, a precision, a hint or
// a source on a question already scheduled is fine and should stay fine; none
// of that moves anything.
//
// The whole bank, unlike World Records, which pins a span shorter than its
// length because it has a year of unverified questions at the end that might
// still need removing outright. Everything here is served within ten weeks, so
// there is nothing in this bank that is not already promised.
const SCHEDULED_SPAN = 71
const SCHEDULE_FINGERPRINT =
  "277175dcb3842a0bfbdcf42cb9ea76d821872b8508064dadaf6336b6787baef5"

assert.ok(
  DATES.length >= SCHEDULED_SPAN,
  `bank shrank to ${DATES.length}: questions may be appended but never removed`
)

{
  const fingerprint = require("node:crypto")
    .createHash("sha256")
    .update(DATES.slice(0, SCHEDULED_SPAN).map((q) => q.id).join(","))
    .digest("hex")

  assert.equal(
    fingerprint, SCHEDULE_FINGERPRINT,
    `the first ${SCHEDULED_SPAN} questions changed order or were renamed. The ` +
    "bank is append-only: new questions go at the end, so days already " +
    "scheduled keep the question they were promised."
  )
}

// --- the schedule must serve every day it claims to cover ------------------

{
  const served = new Set()
  for (let d = game.scheduleOrigin; d < game.scheduleOrigin + DATES.length; d++) {
    const q = Model.questionForDay(d, DATES, game.scheduleOrigin)
    assert.ok(q, `day ${d} has no question`)
    assert.ok(!served.has(q.id), `day ${d} repeats ${q.id} within one pass`)
    served.add(q.id)
  }
  assert.equal(served.size, DATES.length, "every question is scheduled exactly once")
}

// --- the bank has to span time, and span it unevenly ----------------------
//
// Two different failures, and a bank can have either without looking wrong.
//
// All one era, and the player learns the era rather than the estimating - the
// same trap the World Records bank guards with its magnitude spread.
//
// All one precision, and the precision field is decoration: a bank of nothing
// but `year` would be a bank that never admits how uncertain ancient dating
// is, and one of nothing but `century` would never ask anyone to be exact.
{
  const years = DATES.map((q) => typeof Model.answerForQuestion(q) === "number"
    ? q.answerYear
    : Number(q.answerDate.slice(0, 4)))

  const centuries = new Set(years.map((y) => Math.floor(y / 100)))
  assert.ok(
    centuries.size >= Math.min(8, DATES.length),
    `the bank covers ${centuries.size} centuries across ${DATES.length} ` +
    `questions. Answers clustered in one era teach the player the bank.`
  )

  const used = new Set(DATES.map((q) => q.precision))
  assert.ok(
    used.size >= Math.min(3, DATES.length),
    `the bank uses ${used.size} of the ${Object.keys(Model.PRECISIONS).length} ` +
    `precisions. If every question is dated the same way, the precision field ` +
    `is not doing anything and the bands may as well be fixed.`
  )
}

// --- every question must actually be scorable -----------------------------
//
// The checker validates the fields; this runs the engine. A question whose
// answer the scorer cannot reach would be a guaranteed Off for everybody, on
// its one day, with nothing anywhere saying why.
for (const q of DATES) {
  const perfect = Model.scoreDate(Model.answerForQuestion(q), q, false)
  assert.equal(
    perfect.band, "Bullseye",
    `"${q.id}" does not score its own answer as a Bullseye - the engine cannot ` +
    `read it, so every player would be marked Off`
  )
  assert.equal(perfect.points, Model.BAND_POINTS.Bullseye)
  assert.ok(Model.formatAnswer(q), `"${q.id}" has an answer that does not render`)
}

console.log(`years covered:    ${Model.formatYear(Math.min(...DATES.map((q) =>
  typeof q.answerYear === "number" ? q.answerYear : Number(q.answerDate.slice(0, 4)))))} .. ${
  Math.max(...DATES.map((q) =>
    typeof q.answerYear === "number" ? q.answerYear : Number(q.answerDate.slice(0, 4))))}`)
console.log("\nAll Historical Dates bank checks passed.")
