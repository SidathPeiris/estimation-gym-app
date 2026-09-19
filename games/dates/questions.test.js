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

// --- a source must not name a year its answer contradicts ----------------
//
// This is the check that would have caught the one error a whole verification
// pass missed in World Records: the longest eclipse of the twentieth century
// had the right duration, 428 seconds, sourced to the 30 June 1973 eclipse -
// which ran four seconds shorter. The number was 1955's. Nothing about the
// entry looked wrong, because both halves were true about different things.
//
// So wherever a source names a year, that year has to fall inside the
// question's own Bullseye band. It will not catch a source that names no year,
// but a mismatched one is exactly the shape of that failure.
//
// The exceptions are real and there are four: a document written about an
// earlier event carries its own later date, which is not a contradiction.
{
  const LATER_DOCUMENT = new Set([
    "dates-jenner-vaccination",        // the 1796 inoculation, in Jenner's 1798 book
    "dates-little-bighorn",            // the 1876 battle, in the 1879 Army inquiry
    "dates-norse-reach-north-america", // a c.1000 settlement, dated by a 2021 paper
    "dates-greek-independence-war"     // the 1821 outbreak, in the 1832 treaty ending it
  ])

  for (const q of DATES) {
    if (LATER_DOCUMENT.has(q.id)) continue

    const answer = q.precision === "day"
      ? Number(q.answerDate.slice(0, 4))
      : q.answerYear

    // Sources for antiquity rarely carry a year at all, and when they do it is
    // the modern edition's.
    if (answer < 1000) continue

    const named = [...String(q.source).matchAll(/\b(1[0-9]{3}|20[0-2][0-9])\b/g)].map((m) => Number(m[1]))
    if (!named.length) continue

    // A day-precision question is pinned to its year; everything else gets the
    // band it is actually scored on.
    const tolerance = q.precision === "day" ? 1 : Model.PRECISIONS[q.precision].bands[0]

    assert.ok(
      named.some((y) => Math.abs(y - answer) <= tolerance),
      `"${q.id}" answers ${Model.formatAnswer(q)} but its source names ` +
      `${named.join(", ")}: ${q.source}\n  Either the answer belongs to a ` +
      `different event from the one the source describes, or the source is ` +
      `a later document about it - in which case add the id to LATER_DOCUMENT ` +
      `with the reason.`
    )
  }
}

// --- a hint must not hand over its own answer -----------------------------
//
// The prompt is already checked for this. Hints are the easier place to do it
// by accident, because they are built out of other dates on purpose: "two
// years before X", "the same year as Y". Naming the year itself turns a
// half-points hint into a full answer.
//
// The second half catches a hint that has drifted onto a different subject.
// Every bracket in this bank is within a few centuries of what it brackets, so
// anything further is a hint that was written for another question.
for (const q of DATES) {
  const answer = q.precision === "day"
    ? Number(q.answerDate.slice(0, 4))
    : q.answerYear

  for (const m of q.decompositionHint.matchAll(/\b(1[0-9]{3}|20[0-2][0-9])\b/g)) {
    const named = Number(m[1])
    assert.notEqual(
      named, answer,
      `"${q.id}" prints ${named} in its hint, which is its own answer`
    )
    assert.ok(
      Math.abs(named - answer) <= 300,
      `"${q.id}" answers ${Model.formatAnswer(q)} and its hint names ${named}, ` +
      `${Math.abs(named - answer)} years away. A bracket that far off is a hint ` +
      `written for a different question.`
    )
  }
}

// --- the wording and the scoring must agree -------------------------------
//
// "Around what year" promises the player that an approximate answer is wanted,
// and the precision is what decides whether that promise is kept. A hedged
// prompt scored to the year would punish exactly the player who read it
// carefully.
{
  // Asks for a specific year but is scored to the decade. Allowed, and the one
  // case where the mismatch favours the player: the traditional date is exact,
  // the history behind it is not.
  const ALLOWED = new Set(["dates-rome-founded-traditional"])

  for (const q of DATES) {
    if (ALLOWED.has(q.id)) continue
    const hedged = /^(around|roughly) what year/i.test(q.prompt)
    const loose = q.precision === "decade" || q.precision === "century"
    assert.equal(
      hedged, loose,
      hedged
        ? `"${q.id}" says "around what year" but is scored to the ${q.precision}`
        : `"${q.id}" asks for an exact year but is scored to the ${q.precision}, ` +
          `so the prompt should say "around what year"`
    )
  }
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
// Half the bank rather than all of it, deliberately, and for the reason World
// Records keeps a short span too.
//
// Anyone can read this file and work out what any future day holds, so in one
// sense every question in it is already promised. But the pin blocks removal
// as well as reordering, and verification has repeatedly found questions that
// had to come out rather than be corrected - a contested date that cannot
// honestly be asked, a prompt that gives itself away. Pinning a question a
// year before it is served would trade a real risk for no benefit.
//
// The span was 180 while only part of the bank had been verified. Every one of
// the 500 is now checked against a source - the first 367 in a pass after the
// fact, the 133 that followed as they were written - so there is nothing left
// that a later check could force out, and the pin covers the whole bank the way
// World Records does. The bank wraps in September 2027.
const SCHEDULED_SPAN = 500
const SCHEDULE_FINGERPRINT =
  "18a16b5150b62af517563284c10c68db230de840a1cce1dffc51cc0e9534811c"

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
