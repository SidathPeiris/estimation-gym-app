// Checks the install page against the question bank.
//
//   node install.test.js
//
// The page shows a worked example of the game - a question, the input, and the
// four scoring bands - because someone arriving from a video otherwise has to
// install the thing before finding out what it is.
//
// That example must never be a real question. The bank is append-only and
// cycles, so any question in it lands on someone's calendar eventually, and an
// install page is a poor place to learn tomorrow's puzzle. Every obvious Fermi
// classic is already in the bank - piano tuners, golf balls in a school bus,
// ping-pong balls in a double-decker bus, hairs on a head - so the example was
// chosen precisely because it is not, and that is easy to undo by accident
// when someone adds a batch of questions.

const assert = require("node:assert/strict")
const { readFileSync } = require("node:fs")
const path = require("node:path")

const QUESTIONS = require("./core/questions.js")
const page = readFileSync(path.join(__dirname, "install/index.html"), "utf8")

// --- pull the example question out of the page ---
const shown = (page.match(/<p class="demo-q">([^<]+)<\/p>/) || [])[1]
assert.ok(shown, "the install page no longer shows an example question")

const words = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ")
const example = new Set(words(shown))

// --- it must not BE a question in the bank ---
for (const q of QUESTIONS) {
  assert.notEqual(
    q.prompt.trim().toLowerCase(),
    shown.trim().toLowerCase(),
    `the install page's example is now a real question (${q.id}) - pick another`
  )
}

// --- nor should it be a near-miss ---
//
// An exact-match check would pass on a question that differs by a word, which
// would still be a spoiler. This flags anything sharing most of its
// distinctive words with a real prompt.
const COMMON = new Set(words(
  "how many much are is there the a an of in do does would fit fits it one two " +
  "at on to and or for per by with what year years day days"
))
const distinctive = [...example].filter((w) => !COMMON.has(w) && w.length > 2)
assert.ok(distinctive.length >= 2, "the example has too few distinctive words to check")

for (const q of QUESTIONS) {
  const other = new Set(words(q.prompt))
  const shared = distinctive.filter((w) => other.has(w))
  assert.ok(
    shared.length < distinctive.length,
    `the install page's example overlaps ${q.id} on every distinctive word ` +
    `(${shared.join(", ")}) - it would spoil that question`
  )
}

// --- and the page must say so ---
//
// A reader who cannot tell the example from the real thing may believe they
// have seen tomorrow's question.
assert.match(
  page,
  /not one of the real questions/i,
  "the example must be labelled as an example"
)

console.log(
  `install page example is not in the bank: "${shown}" ` +
  `(checked against ${QUESTIONS.length} questions)`
)
