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
const Games = require("./core/games.js")
const sw = readFileSync(path.join(__dirname, "sw.js"), "utf8")

// --- sw.js must at least parse -------------------------------------------
//
// Nothing else in the suite runs it. Every other assertion here reads it as
// text - regexes, string slices, a lifted function or two - and every one of
// those is perfectly happy with a file the browser would refuse to install.
// A stray line break inside a string literal got this far once, and the only
// symptom would have been a service worker that silently failed to register:
// no offline play, no reminder, no error anywhere the app could see.
//
// new Function parses without executing, which is the whole point - the body
// of this file calls self.addEventListener and there is no self here.
assert.doesNotThrow(
  () => new Function(sw),
  "sw.js is not valid JavaScript, so the browser would refuse to install it"
)

// --- the worker's game table must match the registry ---------------------
//
// The reminder covers every live game that claims it, so the worker carries a
// small copy of the registry: each game's name, the asset its bank lives in,
// and the day its calendar starts. Three chances to drift instead of one, and
// they fail differently - a wrong origin names yesterday's question, a wrong
// bank path silently drops a game out of the notification, and a missing entry
// means a live game is never advertised at all.
//
// Lifted out of sw.js and compared against core/games.js in both directions.
const tableSrc = sw.slice(
  sw.indexOf("var REMINDER_GAMES = ["),
  sw.indexOf("]", sw.indexOf("var REMINDER_GAMES = [")) + 1
)
assert.ok(tableSrc.startsWith("var REMINDER_GAMES"), "sw.js no longer declares REMINDER_GAMES")
const REMINDER_GAMES = new Function(tableSrc + "; return REMINDER_GAMES")()

const reminderGames = Games.liveGames().filter((g) => g.reminder === true)
assert.ok(reminderGames.length, "no live game claims the daily reminder")

assert.deepEqual(
  REMINDER_GAMES.map((g) => g.name),
  reminderGames.map((g) => g.name),
  "sw.js and the registry disagree about which games the reminder names, or " +
  "in what order. A game marked reminder: true has to be added here too, or " +
  "it is announced nowhere."
)

for (const game of reminderGames) {
  const entry = REMINDER_GAMES.find((g) => g.name === game.name)
  assert.equal(
    entry.origin, game.scheduleOrigin,
    `sw.js starts ${game.name} on day ${entry.origin}, the registry on ` +
    `${game.scheduleOrigin} - so the reminder would name a different question ` +
    `from the one the app opens.`
  )
  assert.ok(
    game.assets.includes(entry.bank),
    `sw.js reads ${game.name} from "${entry.bank}", which is not one of that ` +
    `game's assets. cache.match would miss and the game would drop out of the ` +
    `notification with no error anywhere.`
  )
}
console.log(`reminder names    -> ${reminderGames.map((g) => g.name).join(", ")}`)

// --- the origin must match ---
//
// Fermi's calendar is Model.SCHEDULE_ORIGIN, which the app and the worker have
// always had to agree on. The other games' origins are pinned above.
const declared = REMINDER_GAMES.find((g) => g.bank === "./core/questions.js").origin
assert.equal(
  declared,
  Model.SCHEDULE_ORIGIN,
  `sw.js starts Fermi on day ${declared} but Model.js says ${Model.SCHEDULE_ORIGIN}`
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

// --- the worker's lookup must agree with the app's ------------------------
//
// sw.js reads each bank by slicing the JSON array out of `var NAME = [...]`
// and indexing it directly. That is a second implementation of the schedule,
// run here against every bank the reminder reads and compared with Model's
// answer across a wide spread of days, including the wrap at the end.
//
// Every game, not just Fermi: the notification names them all, so a bank that
// stopped slicing out as JSON would drop its line and say nothing about it.
const banks = new Map()

for (const game of reminderGames) {
  const entry = REMINDER_GAMES.find((g) => g.name === game.name)
  const text = readFileSync(path.join(__dirname, entry.bank), "utf8")
  const start = text.indexOf("[")
  const end = text.lastIndexOf("]")
  assert.ok(start >= 0 && end > start, `${entry.bank} no longer slices out as JSON`)

  const sliced = JSON.parse(text.slice(start, end + 1))
  const real = require("./" + entry.bank.replace("./", ""))
  assert.equal(sliced.length, real.length, `the sliced ${game.name} bank is a different size`)

  const pick = (dayIdx) => {
    const offset = dayIdx - entry.origin
    const i = (offset >= 0 && offset < sliced.length)
      ? offset
      : ((offset % sliced.length) + sliced.length) % sliced.length
    return sliced[i]
  }

  const o = entry.origin
  const days = [
    o - 400, o - 1, o, o + 1, o + 7, o + 364,
    o + sliced.length - 1, o + sliced.length, o + sliced.length + 5
  ]
  for (const day of days) {
    assert.equal(
      pick(day).id,
      Model.questionForDay(day, real, o).id,
      `worker and app disagree on ${game.name} day ${day} (offset ${day - o})`
    )
  }

  // The prompt is what actually gets shown, so it must survive the round trip -
  // the banks escape non-ASCII, and a mangled character would be read aloud by
  // a screen reader and printed on a lock screen.
  const todays = pick(Model.dayIndex(new Date()))
  assert.equal(todays.prompt, Model.questionForDay(Model.dayIndex(new Date()), real, o).prompt)
  assert.ok(todays.prompt.length > 0, `today's ${game.name} prompt is empty`)
  banks.set(game.name, { days: days.length, prompt: todays.prompt })
}


// --- the body the player actually reads ----------------------------------
//
// reminderBody is the one piece of this that no other assertion reaches: the
// table, the schedules and the destination are all checked above, but nothing
// has run the code that turns them into the two lines on a lock screen.
//
// So it is lifted out of sw.js and run against the real banks, with caches
// stubbed to serve the files off disk. It is the only place the notification
// is exercised end to end outside a real push.
//
// Async, so it runs at the end rather than here: everything else in this file
// is synchronous and reads in the order it is written.
async function checkReminderBody() {
  const src = sw.slice(
    sw.indexOf("var REMINDER_GAMES = ["),
    sw.indexOf("function reminderTitle")
  )
  const cacheStub = {
    open: () => Promise.resolve({
      match: (url) => Promise.resolve(
        url === "./progress" ? null : { text: () => Promise.resolve(readFileSync(path.join(__dirname, url), "utf8")) }
      )
    })
  }
  const lifted = new Function(
    "caches", "CACHE", "STATE_CACHE",
    src + "; return { reminderBody: reminderBody, todayIndex: todayIndex }"
  )(cacheStub, "test", "test-state")

  const body = await lifted.reminderBody()
  const lines = body.split("\n")

  assert.equal(
    lines.length, reminderGames.length,
    `the notification body has ${lines.length} lines for ${reminderGames.length} ` +
    `games:\n${body}`
  )
  for (const game of reminderGames) {
    const line = lines.find((l) => l.startsWith(game.name + ": "))
    assert.ok(line, `no line names ${game.name}:\n${body}`)
    assert.equal(
      line.slice(game.name.length + 2),
      banks.get(game.name).prompt,
      `the line for ${game.name} is not today's prompt for that game`
    )
  }

  // A bank that has gone missing from the cache drops its own line and no more.
  // A notification naming one game still beats one naming none, and one naming
  // none still beats silence on a day the player meant to play.
  const halfCache = {
    open: () => Promise.resolve({
      match: (url) => Promise.resolve(
        url === "./core/questions.js"
          ? { text: () => Promise.resolve(readFileSync(path.join(__dirname, url), "utf8")) }
          : null
      )
    })
  }
  const partial = await new Function(
    "caches", "CACHE", "STATE_CACHE",
    src + "; return reminderBody"
  )(halfCache, "test", "test-state")()
  assert.equal(partial.split("\n").length, 1, "a missing bank took the other lines with it")
  assert.ok(partial.startsWith("Fermi Questions: "), `unexpected partial body: ${partial}`)

  const empty = await new Function(
    "caches", "CACHE", "STATE_CACHE",
    src + "; return reminderBody"
  )({ open: () => Promise.resolve({ match: () => Promise.resolve(null) }) }, "test", "test-state")()
  assert.ok(empty.length > 0, "no bank readable left the notification with an empty body")
  assert.ok(!empty.includes("undefined"), `the fallback body reads "${empty}"`)

  return lines
}

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
const GENERIC = "Today's questions"

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

// --- a tapped reminder must land where its text points --------------------
//
// The destination and the body have to describe the same thing, and the body
// is what decides it. Three shapes have shipped: "./" when the app was one
// game and that URL WAS the question; "./" still, after the home screen turned
// it into a chooser, while the body went on naming one Fermi question - the
// notification advertised a question and handed over a list to find it in;
// then "./#fermi" to fix exactly that.
//
// The body now names every game in REMINDER_GAMES, so the rule generalises:
// name one game and the tap opens that game, name several and the tap opens
// the only screen that shows them all. Both directions fail here.
{
  const route = (sw.match(/var REMINDER_ROUTE = "([^"]+)"/) || [])[1]
  assert.ok(route, "sw.js no longer declares REMINDER_ROUTE")

  const hash = route.indexOf("#")
  const base = hash >= 0 ? route.slice(0, hash) : route

  // The path half must be the precached start URL, or an offline tap gets the
  // browser's error page. A fragment is never sent to the network, which is
  // why it can be added at no cost; a path or a query could not be.
  assert.equal(
    base, "./",
    "the reminder must open the precached start URL - a different path or a " +
    "query string would miss the cache while offline"
  )

  if (REMINDER_GAMES.length > 1) {
    assert.equal(
      hash, -1,
      `the notification names ${REMINDER_GAMES.length} games and then opens ` +
      `"${route}", which is one game's screen. Whichever game is not in that ` +
      `fragment was advertised and then hidden behind a back button.`
    )
  } else {
    assert.ok(hash >= 0, `the notification names one game but opens "${route}", the chooser`)
    const id = route.slice(hash + 1)
    assert.ok(
      Games.isPlayable(id),
      `the reminder opens "#${id}", which is not a live game. The router sends ` +
      `anything it cannot play to the home screen, so the tap would land on ` +
      `the chooser exactly as if the fragment were missing.`
    )
  }

  // And the route has to actually be used. Opening the right URL in the
  // fresh-window branch while an already-open copy is merely focused was the
  // other half of the same bug: focus() does not navigate, so a player with
  // the app open on some other screen stayed on it.
  const click = sw.slice(sw.indexOf('addEventListener("notificationclick"'))
  assert.ok(
    /client\.navigate\(REMINDER_ROUTE\)/.test(click),
    "an already-open copy is focused without being navigated, so a tapped " +
    "reminder leaves the app on whatever screen it was last left on"
  )
  assert.ok(
    /openWindow\(REMINDER_ROUTE\)/.test(click),
    "the fresh-window branch opens a hardcoded URL rather than REMINDER_ROUTE, " +
    "so the two branches can disagree about where a tap lands"
  )
  console.log(`reminder tap      -> "${route}", precached, matching the body`)
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
  `service worker agrees with Model on ${[...banks.values()][0].days} days ` +
  `in each of ${banks.size} banks. Today's notification would read:`
)
for (const [name, bank] of banks) console.log(`  ${name}: ${bank.prompt}`)

checkReminderBody().then((lines) => {
  console.log(`
the notification this would send, right now:`)
  for (const line of lines) console.log(`  ${line}`)
}).catch((err) => {
  console.error(err.message)
  process.exit(1)
})
