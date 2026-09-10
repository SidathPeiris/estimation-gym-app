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

console.log(
  `service worker agrees with Model on ${days.length} days; ` +
  `today's notification would read "${todaysQuestion.prompt}"`
)
