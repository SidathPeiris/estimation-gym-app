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

// --- a tapped reminder must land on the question it named ---
//
// The reminder names a specific Fermi question in its body. It used to open
// "./", which was that question back when the app was one game - and became
// the chooser the day the home screen shipped, so the notification advertised
// a question and then handed over a list of games to find it in.
//
// Two halves, both needed. The route has to carry a fragment, and that
// fragment has to name a game the router will actually open: an id that is
// coming-soon, renamed or misspelt gets bounced straight back to home, which
// is the bug wearing a different hat.
{
  const Games = require("./core/games.js")
  const route = (sw.match(/var REMINDER_ROUTE = "([^"]+)"/) || [])[1]
  assert.ok(route, "sw.js no longer declares REMINDER_ROUTE")

  const hash = route.indexOf("#")
  assert.ok(
    hash >= 0,
    `the reminder opens "${route}", which has no fragment - so it lands on the ` +
    `game chooser rather than on the question the notification just named`
  )

  const id = route.slice(hash + 1)
  assert.ok(
    Games.isPlayable(id),
    `the reminder opens "#${id}", which is not a live game. The router sends ` +
    `anything it cannot play to the home screen, so the tap would land on the ` +
    `chooser exactly as if the fragment were missing.`
  )

  // The path half must still be the precached one, or an offline tap gets the
  // browser's error page. A fragment is never sent to the network, which is
  // why it can be added here at no cost; a path or a query could not be.
  assert.equal(
    route.slice(0, hash), "./",
    "the reminder must open the precached start URL with a fragment appended - " +
    "a different path or a query string would miss the cache while offline"
  )

  // And it has to actually be used. Opening the right URL in the fresh-window
  // branch while an already-open copy is merely focused was the other half of
  // the same bug: focus() does not navigate, so a player with the app open on
  // the home screen stayed there.
  const click = sw.slice(sw.indexOf('addEventListener("notificationclick"'))
  assert.ok(
    /client\.navigate\(REMINDER_ROUTE\)/.test(click),
    "an already-open copy is focused without being navigated, so a reminder " +
    "tapped while the app sits on the home screen leaves it on the home screen"
  )
  assert.ok(
    !/openWindow\("\.\/"\)/.test(click),
    'the fresh-window branch still opens "./", which is the chooser'
  )
  console.log(`reminder tap      -> "${route}", a live game, precached path`)
}

// --- the precache must revalidate, and must not re-download ---
//
// Two failures, opposite directions, one line of code between them.
//
// Reuse the HTTP cache without checking, and a new cache version gets filled
// with the previous build - the deploy looks like it landed while the app keeps
// running old code. That happened, to core/Model.js.
//
// Skip the HTTP cache entirely, and every asset is downloaded in full on every
// version bump: 853KB a deploy, 391KB of it a question bank that almost never
// changes, growing with each game added.
//
// "no-cache" is the only mode that avoids both: always revalidate, reuse on a
// 304. It reads like the weaker option and is not - "reload" means do not look
// in the cache, "no-cache" means always ask before reusing.
{
  // Comments stripped first. The block explains at length why it is not
  // "reload", and matching that prose would fail the very thing it documents.
  const install = sw
    .slice(sw.indexOf('addEventListener("install"'), sw.indexOf('addEventListener("activate"'))
    .split("\n")
    .filter((line) => !line.trim().startsWith("//"))
    .join("\n")

  assert.match(
    install, /cache:\s*"no-cache"/,
    "the precache must request with { cache: \"no-cache\" } so an unchanged " +
    "asset revalidates to a 304 instead of being downloaded again"
  )
  assert.ok(
    !/cache:\s*"reload"/.test(install),
    'the precache uses { cache: "reload" }, which skips the HTTP cache and ' +
    "re-downloads every asset on every version bump"
  )
  assert.ok(
    !/cache:\s*"(default|force-cache|only-if-cached)"/.test(install),
    "the precache must never reuse a cached body without revalidating - that " +
    "is how a new cache version gets filled with the previous build"
  )
  console.log("precache mode     -> no-cache: revalidates, reuses on 304")
}

// --- the offline navigation fallback must point at something precached ---
//
// This is the guard that was missing. The fetch handler fell back to
// caches.match("./index.html") for a navigation that misses the cache while
// offline, and that URL has never been in ASSETS - version.test.js forbids it,
// because Cloudflare 307s it and cache.addAll rejects on a redirect. So the
// match resolved to undefined, respondWith(undefined) threw, and the player got
// the browser's error page instead of the app. It looked like it worked only
// because an installed copy launches at start_url "./", which is precached.
//
// Asserting the URL is in the precache list is the generalisable form: it
// catches this bug and any future one where the fallback is pointed at
// something that is not actually held offline.
{
  const fallback = (sw.match(/mode === "navigate"\)\s*\{?\s*\n?\s*return caches\.match\("([^"]+)"/) || [])[1]
  assert.ok(fallback, "could not find the navigation fallback in sw.js")

  const open = sw.indexOf("var ASSETS = [")
  const close = sw.indexOf("]", open)
  const assets = sw.slice(open, close)
    .split("\n").map((l) => l.trim())
    .filter((l) => l.startsWith('"'))
    .map((l) => l.split('"')[1])

  assert.ok(
    assets.includes(fallback),
    `the offline navigation fallback serves "${fallback}", which is not in the ` +
    `precache list - so it resolves to undefined and the player gets the ` +
    `browser's error page rather than the app`
  )
  console.log(`offline fallback  -> "${fallback}", which is precached`)
}
console.log(
  `service worker agrees with Model on ${days.length} days; ` +
  `today's notification would read "${todaysQuestion.prompt}"`
)
