// Schema and sanity checks for the question bank. Kept as a plain node test
// like Model.test.js so it runs with no dependencies:
//
//   node questions.test.js
//
// The bank is the part of this plugin most likely to be edited in bulk, and a
// question with a wrong answer is worse than a missing one - it marks a
// correct guess as "Off" and quietly discredits the scoring.

const assert = require("node:assert/strict")
const QUESTIONS = require("./questions.js")
const Model = require("./Model.js")

const REQUIRED = ["id", "prompt", "unit", "answerValue", "decompositionHint", "strategy", "source"]
const OPTIONAL = ["asOf"]
// The strategy selects which hint a player sees, so an invented one would
// silently fall back to generic advice rather than failing loudly.
const STRATEGIES = Object.keys(Model.STRATEGIES)
const CURRENT_YEAR = new Date().getFullYear()

let problems = []
function fail(id, message) { problems.push(`${id}: ${message}`) }

const seenIds = new Set()

for (const q of QUESTIONS) {
  const id = q && q.id ? q.id : "(missing id)"

  for (const field of REQUIRED) {
    if (!(field in q)) { fail(id, `missing required field "${field}"`); continue }
    if (typeof q[field] === "string" && q[field].trim() === "") fail(id, `empty "${field}"`)
  }

  for (const field of Object.keys(q)) {
    if (!REQUIRED.includes(field) && !OPTIONAL.includes(field)) fail(id, `unknown field "${field}"`)
  }

  if (typeof q.id === "string") {
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(q.id)) fail(id, "id must be kebab-case")
    if (seenIds.has(q.id)) fail(id, "duplicate id")
    seenIds.add(q.id)
  }

  if (typeof q.answerValue !== "number" || !isFinite(q.answerValue)) {
    fail(id, "answerValue must be a finite number")
  } else if (q.answerValue <= 0) {
    // Scoring is log based, so a non-positive answer can never be scored.
    fail(id, "answerValue must be positive")
  } else if (q.answerValue < 1e-40 || q.answerValue > 1e100) {
    // Loose enough for real physics at both ends - one fission event is
    // 3.2e-11 joules, and the observable universe holds ~10^80 atoms - while
    // still catching a stray exponent.
    fail(id, `answerValue ${q.answerValue} is outside the plausible range`)
  }

  if ("asOf" in q) {
    if (!Number.isInteger(q.asOf)) fail(id, "asOf must be a whole year")
    // Negative years are BCE, so the floor is deep enough for antiquity.
    else if (q.asOf < -10000 || q.asOf > CURRENT_YEAR + 1) fail(id, `asOf ${q.asOf} is out of range`)
  }

  // A prompt that pins itself to a date in prose should carry the structured
  // field instead, otherwise no refresh script can ever find it.
  if (typeof q.prompt === "string" && /\bas of\b/i.test(q.prompt) && !("asOf" in q)) {
    fail(id, "prompt says 'as of' but has no asOf field")
  }

  // Contains rather than ends with, since a prompt may legitimately trail a
  // parenthetical after the question mark.
  if (typeof q.prompt === "string" && !q.prompt.includes("?")) {
    fail(id, "prompt should be a question")
  }
  if (typeof q.decompositionHint === "string" && q.decompositionHint.trim().length < 30) {
    fail(id, "decompositionHint is too short to teach anything")
  }
  // Nothing in a question is ever meant to be markup. The widget renders it
  // as plain text and the app sets it via textContent, but a contributed
  // question carrying tags is a sign something is wrong either way.
  for (const field of ["prompt", "decompositionHint", "source", "unit"]) {
    const value = q[field]
    if (typeof value === "string" && /[<>]/.test(value)) {
      fail(id, `${field} contains angle brackets - questions are plain text`)
    }
  }
  if (typeof q.strategy === "string" && !STRATEGIES.includes(q.strategy)) {
    fail(id, `unknown strategy "${q.strategy}" - expected one of: ${STRATEGIES.join(", ")}`)
  }
}

// --- near-duplicate prompts ---
// Two prompts about the same quantity in different years are legitimate and
// intended, so only flag overlap when the questions share a period.
const STOP = new Set(["how", "many", "much", "the", "a", "an", "are", "is", "there", "in",
                      "of", "on", "at", "to", "for", "and", "or", "does", "do", "would",
                      "what", "roughly", "approximately", "about", "per", "you", "your",
                      "it", "take", "as", "single", "average", "typical"])

function tokens(prompt) {
  return new Set(
    prompt.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/)
      .filter((w) => w.length > 2 && !STOP.has(w))
  )
}

function jaccard(a, b) {
  let shared = 0
  for (const t of a) if (b.has(t)) shared++
  const union = a.size + b.size - shared
  return union === 0 ? 0 : shared / union
}

const prepared = QUESTIONS.map((q) => ({ id: q.id, asOf: q.asOf, tokens: tokens(q.prompt || "") }))
const nearDuplicates = []
for (let i = 0; i < prepared.length; i++) {
  for (let j = i + 1; j < prepared.length; j++) {
    if (prepared[i].asOf !== prepared[j].asOf) continue
    const score = jaccard(prepared[i].tokens, prepared[j].tokens)
    if (score >= 0.7) nearDuplicates.push(`${prepared[i].id} ~ ${prepared[j].id} (${score.toFixed(2)})`)
  }
}
for (const pair of nearDuplicates) fail("duplicate-prompt", pair)

// --- report ---
const dated = QUESTIONS.filter((q) => "asOf" in q)
const magnitudes = QUESTIONS.map((q) => Math.floor(Math.log10(q.answerValue)))
  .filter((m) => isFinite(m))

console.log(`questions:        ${QUESTIONS.length}`)
console.log(`dated (asOf):     ${dated.length}`)
console.log(`timeless:         ${QUESTIONS.length - dated.length}`)
console.log(`magnitude range:  10^${Math.min(...magnitudes)} .. 10^${Math.max(...magnitudes)}`)
console.log(`distinct units:   ${new Set(QUESTIONS.map((q) => q.unit)).size}`)

if (problems.length) {
  console.error(`\n${problems.length} problem(s):`)
  for (const p of problems) console.error(`  ${p}`)
  process.exit(1)
}

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
