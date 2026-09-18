// The question bank specification, in executable form.
//
// Not a test. It is the thing both banks' tests run - core/questions.test.js
// for Fermi Questions and games/records/questions.test.js for World Records -
// so that "what makes a question valid" has exactly one definition.
//
// This was Fermi's test file until a second bank needed the same rules. Every
// check below is a straight port; nothing was relaxed in the move, and the
// Fermi test prints the same summary and fails on the same questions as it did
// before. What is new is that the rules a bank does NOT share - which fields
// are required, what its ids must start with, whether it may name a trademark -
// are passed in rather than assumed.
//
// Why it lives in tools/ rather than core/: this never reaches a browser.
// Both exclude lists already drop tools/, and core/ is precached, so putting a
// test-only file there would ship it to every player.

const CURRENT_YEAR = new Date().getFullYear()

const REQUIRED = ["id", "prompt", "unit", "answerValue", "decompositionHint", "strategy", "source"]
const OPTIONAL = ["asOf"]

// Tokens ignored when comparing two prompts for near-duplication. These are
// the words every prompt shares, so leaving them in would make every pair look
// alike.
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

// Returns { problems: [...], dated, magnitudes, units }. The caller decides how
// to report and when to exit - a bank's own test adds its own checks on top.
//
// options:
//   strategies   string[]  the strategy keys Model.js actually implements
//   idPrefix     string    every id must start with this ("" for Fermi)
//   requireAsOf  boolean   asOf is mandatory rather than optional
//   forbidden    [{pattern, why}]  text that must not appear anywhere
function checkBank(questions, options) {
  const opts = options || {}
  const strategies = opts.strategies || []
  const idPrefix = opts.idPrefix || ""
  const forbidden = opts.forbidden || []

  const problems = []
  const fail = (id, message) => problems.push(`${id}: ${message}`)
  const seenIds = new Set()

  for (const q of questions) {
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

      // The id prefix IS the namespace. The Worker's D1 tables are keyed on a
      // bare question_id with no game column, so two banks sharing an id merge
      // their distributions into one row, permanently.
      if (idPrefix && !q.id.startsWith(idPrefix)) {
        fail(id, `id must start with "${idPrefix}" - the prefix is what keeps ` +
                 `this game's answers separate from every other game's in D1`)
      }
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
    } else if (opts.requireAsOf) {
      fail(id, "asOf is required in this bank - a record with no stated year " +
               "becomes wrong the day it is broken, rather than staying true " +
               "about the year it names")
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
    if (typeof q.strategy === "string" && !strategies.includes(q.strategy)) {
      fail(id, `unknown strategy "${q.strategy}" - expected one of: ${strategies.join(", ")}`)
    }

    for (const rule of forbidden) {
      for (const field of ["prompt", "decompositionHint", "source", "unit"]) {
        if (typeof q[field] === "string" && rule.pattern.test(q[field])) {
          fail(id, `${field} ${rule.why}`)
        }
      }
    }
  }

  // --- near-duplicate prompts ---
  // Two prompts about the same quantity in different years are legitimate and
  // intended, so only flag overlap when the questions share a period.
  const prepared = questions.map((q) => ({ id: q.id, asOf: q.asOf, tokens: tokens(q.prompt || "") }))
  for (let i = 0; i < prepared.length; i++) {
    for (let j = i + 1; j < prepared.length; j++) {
      if (prepared[i].asOf !== prepared[j].asOf) continue
      const score = jaccard(prepared[i].tokens, prepared[j].tokens)
      if (score >= 0.7) {
        problems.push(`duplicate-prompt: ${prepared[i].id} ~ ${prepared[j].id} (${score.toFixed(2)})`)
      }
    }
  }

  const magnitudes = questions
    .map((q) => Math.floor(Math.log10(q.answerValue)))
    .filter((m) => isFinite(m))

  return {
    problems,
    dated: questions.filter((q) => "asOf" in q).length,
    magnitudes,
    units: new Set(questions.map((q) => q.unit)).size
  }
}

// Every bank prints the same summary, so two banks are read the same way.
function report(questions, result) {
  console.log(`questions:        ${questions.length}`)
  console.log(`dated (asOf):     ${result.dated}`)
  console.log(`timeless:         ${questions.length - result.dated}`)
  console.log(`magnitude range:  10^${Math.min(...result.magnitudes)} .. 10^${Math.max(...result.magnitudes)}`)
  console.log(`distinct units:   ${result.units}`)

  if (result.problems.length) {
    console.error(`\n${result.problems.length} problem(s):`)
    for (const p of result.problems) console.error(`  ${p}`)
    process.exit(1)
  }
}

module.exports = { checkBank, report, REQUIRED, OPTIONAL }
