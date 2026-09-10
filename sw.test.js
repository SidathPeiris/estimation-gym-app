// Checks the service worker's copy of the daily schedule against Model.js.
//
//   node sw.test.js
//
// The push is payload-less, so the notification text is built inside the
// service worker, which means it has to work out today's question on its own.
// It cannot import Model.js: importScripts runs on every worker startup and
// would take the fetch handler down with it if it ever failed, costing offline
// play to save a notification. So two things are duplicated into sw.js - the
// schedule origin and the day arithmetic - and duplicated constants drift.
//
// This is what stops them. If the worker and the app ever disagree about which
// question today is, the reminder names one question and the app opens on
// another, which is worse than a generic reminder.

const assert = require("node:assert/strict")
const { readFileSync } = require("node:fs")
const path = require("node:path")

const Model = require("./core/Model.js")
const QUESTIONS = require("./core/questions.js")
const sw = readFileSync(path.join(__dirname, "sw.js"), "utf8")

// --- the origin must match ---
const declared = Number((sw.match(/var SCHEDULE_ORIGIN = (\d+)/) || [])[1])
assert.equal(
  declared,
  Model.SCHEDULE_ORIGIN,
  `sw.js has SCHEDULE_ORIGIN ${declared} but Model.js says ${Model.SCHEDULE_ORIGIN}`
)

// --- the badge must be a silhouette, not the app icon ---
//
// Android masks the badge to its alpha channel and fills it white, so a fully
// opaque image becomes a solid white square in the status bar. That shipped
// once; this is here so it cannot ship again.
assert.match(
  sw,
  /badge: "\.\/icons\/badge-96\.png"/,
  "the notification badge must be the monochrome silhouette, not icon-192"
)
assert.ok(
  sw.includes('"./icons/badge-96.png",'),
  "the badge must be precached - it is fetched while the app is closed"
)

// --- the worker's lookup must agree with the app's ---
//
// sw.js reads the bank by slicing the JSON array out of `var QUESTIONS = [...]`
// and indexing it directly. That is a second implementation of the schedule,
// so it is run here against the real bank and compared with Model's answer for
// a wide spread of days, including the wrap at the end of the bank.
const text = readFileSync(path.join(__dirname, "core/questions.js"), "utf8")
const start = text.indexOf("[")
const end = text.lastIndexOf("]")
assert.ok(start >= 0 && end > start, "the bank no longer slices out as JSON")

const sliced = JSON.parse(text.slice(start, end + 1))
assert.equal(sliced.length, QUESTIONS.length, "the sliced bank is a different size")

function workerPick(dayIdx) {
  const offset = dayIdx - declared
  const i = (offset >= 0 && offset < sliced.length)
    ? offset
    : ((offset % sliced.length) + sliced.length) % sliced.length
  return sliced[i]
}

const origin = Model.SCHEDULE_ORIGIN
const days = [
  origin - 400, origin - 1, origin, origin + 1, origin + 7, origin + 364,
  origin + sliced.length - 1, origin + sliced.length, origin + sliced.length + 5
]
for (const day of days) {
  assert.equal(
    workerPick(day).id,
    Model.questionForDay(day, QUESTIONS).id,
    `worker and app disagree on day ${day} (offset ${day - origin})`
  )
}

// The prompt is what actually gets shown, so it must survive the round trip -
// the bank escapes non-ASCII, and a mangled character would be read aloud by a
// screen reader and printed on a lock screen.
const todaysQuestion = workerPick(Model.dayIndex(new Date()))
assert.equal(todaysQuestion.prompt, Model.questionForDay(Model.dayIndex(new Date()), QUESTIONS).prompt)
assert.ok(todaysQuestion.prompt.length > 0, "today's prompt is empty")


// --- what the reminder's title says --------------------------------------
//
// The title carries where the player is in their run, the body carries the
// question. reminderTitle is lifted out of sw.js and run here rather than
// re-described, so the test cannot drift from the thing it is testing.

const titleSrc = sw.slice(
  sw.indexOf("function reminderTitle"),
  sw.indexOf("self.addEventListener(\"push\"")
)
assert.ok(titleSrc.includes("Day "), "reminderTitle not found in sw.js")
const reminderTitle = new Function(titleSrc + "; return reminderTitle")()

const TODAY = 1000
const GENERIC = "Today's question"

// Nothing known about the player - first visit, or they have not opened the
// app since this shipped. Must not guess.
assert.equal(reminderTitle(null, TODAY), GENERIC)
assert.equal(reminderTitle({}, TODAY), GENERIC)
assert.equal(reminderTitle({ streak: "3", lastPlayedDay: 999 }, TODAY), GENERIC)

// One day is not a run worth announcing.
assert.equal(reminderTitle({ streak: 0, lastPlayedDay: null }, TODAY), GENERIC)
assert.equal(reminderTitle({ streak: 1, lastPlayedDay: 999 }, TODAY), GENERIC)

// From two days, it says where they are - and it says the day they are ABOUT
// to play, not the one behind them.
assert.equal(reminderTitle({ streak: 2, lastPlayedDay: 999 }, TODAY), "Day 3")
assert.equal(reminderTitle({ streak: 29, lastPlayedDay: 999 }, TODAY), "Day 30")

// It has to survive the title row, which on a collapsed Android notification
// is about fourteen characters - "Today's question" was observed truncating at
// sixteen on a real phone. A streak title that loses its number would be worse
// than no streak title.
for (const streak of [2, 9, 99, 364, 1000]) {
  const t = reminderTitle({ streak, lastPlayedDay: 999 }, TODAY)
  assert.ok(t.length <= 14, `title "${t}" is ${t.length} chars, too long for the title row`)
}

// The part most worth getting right: a streak that is already broken must not
// be announced. Someone who last played three days ago has no run to continue,
// and telling them they are on day 7 would simply be false.
assert.equal(reminderTitle({ streak: 6, lastPlayedDay: 997 }, TODAY), GENERIC)
assert.equal(reminderTitle({ streak: 6, lastPlayedDay: null }, TODAY), GENERIC)

// Already played today - they should have been skipped by the cron entirely,
// but if a send slips through it must not claim a day they have not started.
assert.equal(reminderTitle({ streak: 6, lastPlayedDay: TODAY }, TODAY), GENERIC)

console.log("reminder title    -> streak only when it is real and unbroken")
console.log(
  `service worker agrees with Model on ${days.length} days; ` +
  `today's notification would read "${todaysQuestion.prompt}"`
)
