// Cache-first service worker. The whole app is static and offline play is the
// point, so every asset is precached on install and served from the cache
// thereafter. The cache is named for the app version, so bump the version in
// package.json for every deploy however small -- with a versioned cache name
// plus skipWaiting/claim, a deploy replaces the old copy on next launch rather
// than stranding people on a stale build. version.test.js pins the two
// together; shipping twice under one version is the failure it cannot catch.
//
// Bumping CACHE is necessary but not sufficient: the precache itself has to
// bypass the HTTP cache, or the new version is filled with old files. See the
// install handler.
//
// Note this caches code only. Play history lives in localStorage, which the
// cache never touches, so a version bump can never cost anyone their streak.

var CACHE = "estimation-gym-v1.27.0"

// A second cache, deliberately unversioned, holding one small record the
// service worker needs but cannot otherwise reach: the streak.
//
// The streak lives in localStorage, which a service worker cannot read, and
// when a push arrives the app is closed so there are no clients to ask. This
// is the smallest place both sides can see. It survives version bumps - the
// activate handler below exempts it - because it is state, not an asset.
var STATE_CACHE = "estimation-gym-progress"

var ASSETS = [
  // "./" is the URL the app is actually opened at, and it is what a navigation
  // matches. "./index.html" used to sit here too, harmlessly, because GitHub
  // Pages served it as 200.
  //
  // Cloudflare redirects /index.html to / with a 307, and cache.addAll rejects
  // the whole batch on a non-ok response - so the worker never finished
  // installing, and Chrome will not offer to install an app whose service
  // worker has not activated. One redundant entry made the app uninstallable
  // on the new host while the page itself worked perfectly.
  "./",
  "./app.css",
  "./app.js",
  "./presenter.js",
  "./storage.js",
  "./core/Model.js",
  "./core/games.js",
  "./core/questions.js",
  "./games/records/questions.js",
  "./games/dates/questions.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/badge-96.png",
  "./icons/icon-192-maskable.png",
  "./icons/icon-512-maskable.png",
  // The brand's three faces, self-hosted so an installed copy renders in its
  // own type with no network at all. One variable file per family per subset -
  // see fonts/README.md. Adding a font here without adding it to app.css, or
  // the other way round, is the failure worth watching for.
  "./fonts/bricolage-grotesque-latin.woff2",
  "./fonts/bricolage-grotesque-latin-ext.woff2",
  "./fonts/schibsted-grotesk-latin.woff2",
  "./fonts/schibsted-grotesk-latin-ext.woff2",
  "./fonts/jetbrains-mono-latin.woff2",
  "./fonts/jetbrains-mono-latin-ext.woff2"
]

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function (cache) {
        // Every precache request must check with the server before reusing
        // anything. Without that, addAll is free to satisfy these from the
        // HTTP cache, which means a fresh cache version can be populated with
        // the *previous* build - the deploy then looks like it landed (new
        // cache name, new service worker) while the app quietly keeps running
        // old code. Observed happening to core/Model.js.
        //
        // This was { cache: "reload" }, which skips the HTTP cache entirely and
        // downloads every byte of every asset on every version bump. That is
        // 853KB a deploy, 391KB of it a question bank that almost never
        // changes, and it grows with each game added.
        //
        // { cache: "no-cache" } keeps the guarantee and drops the cost. It is
        // not the weaker option its name suggests: "reload" means do not look
        // in the cache, "no-cache" means always revalidate before reusing what
        // is there. So a stale body still cannot slip through - the server is
        // always asked - but an unchanged file comes back 304 with no body.
        //
        // This relies on the host sending validators. Every asset here is
        // served with an ETag, and /core/* additionally carries
        // max-age=0, must-revalidate (see _headers). Verified against
        // production: a conditional request for core/questions.js returns 304
        // and 0 bytes where a full fetch transfers 399,982.
        return cache.addAll(ASSETS.map(function (url) {
          return new Request(url, { cache: "no-cache" })
        }))
      })
      .then(function () { return self.skipWaiting() })
  )
})

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (names) {
        return Promise.all(names.map(function (name) {
          // STATE_CACHE is exempt: it holds progress, not a stale copy of the
          // app, and wiping it on every deploy would silently reset what the
          // reminder knows.
          if (name === CACHE || name === STATE_CACHE) return null
          return caches.delete(name)
        }))
      })
      .then(function () { return self.clients.claim() })
  )
})

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") return

  event.respondWith(
    caches.match(event.request).then(function (hit) {
      if (hit) return hit
      return fetch(event.request).catch(function () {
        // A navigation that misses the cache while offline still gets the app
        // shell rather than the browser's error page.
        //
        // This fell back to "./index.html" for a long time and never once
        // worked. That URL is deliberately NOT precached - Cloudflare answers
        // it with a 307 to "./", cache.addAll rejects the whole batch on a
        // redirect, and the worker then never activates - and version.test.js
        // forbids ever adding it. So the match resolved to undefined,
        // respondWith(undefined) threw, and the player got the browser's error
        // page anyway. It looked fine only because an installed copy launches
        // at start_url "./", which is precached exactly.
        //
        // ignoreSearch because the cache key includes the query string, so
        // "./?reset=today" missed "./" and took this same broken path.
        if (event.request.mode === "navigate") {
          return caches.match("./", { ignoreSearch: true })
        }
        return Response.error()
      })
    })
  )
})

// --- Daily reminder ---------------------------------------------------------
//
// The push carries no payload, so the wording lives here rather than being
// sent over the wire. That keeps the subscription record down to an endpoint
// and a timezone, with no message content in transit and no encryption keys
// stored server-side.

// Which games the reminder speaks for, and where each one's bank and calendar
// are.
//
// It used to be Fermi's reminder: one bank, one question named, and a bell
// that appeared on Fermi's screen alone because a nudge about a question you
// could not reach from there would have been a lie. With a second game live
// that shape leaves the second game unadvertised, and silences the nudge for
// both of them the moment either one is answered. So it is the app's reminder
// now, and this is the list it is about.
//
// Duplicated from core/games.js for the same reason the day arithmetic below
// is duplicated from Model.js: a service worker cannot importScripts either
// without running it on every worker startup and taking the fetch handler down
// with it if it ever fails, which would cost offline play to save a
// notification. sw.test.js pins this table to the registry entry by entry, so
// a third live game cannot quietly ship outside the reminder.
var REMINDER_GAMES = [
  { name: "Fermi Questions", bank: "./core/questions.js", origin: 982 },
  { name: "World Records", bank: "./games/records/questions.js", origin: 991 },
  { name: "Historical Dates", bank: "./games/dates/questions.js", origin: 992 }
]

var EPOCH_MS = Date.UTC(2024, 0, 1)
var DAY_MS = 24 * 60 * 60 * 1000

function todayIndex() {
  var d = new Date()
  return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - EPOCH_MS) / DAY_MS)
}

// One game's question for one day, read out of its cached bank.
//
// The push carries no payload - that is deliberate, and it is why no
// encryption keys are stored for any subscriber - so the text has to be built
// here. Naming the actual question turns the reminder from an errand into a
// hook, and it gives nothing away: seeing the question early is no help,
// because the whole game is working the number out.
function questionFor(game, day) {
  return caches.open(CACHE)
    .then(function (cache) { return cache.match(game.bank) })
    .then(function (res) { return res ? res.text() : null })
    .then(function (text) {
      if (!text) return null
      // Every bank is written as `var NAME = [ ...json... ]`, so the array
      // slices out as valid JSON. Parsed, never evaluated - this is untrusted
      // in principle and eval in a service worker is not worth the risk.
      var start = text.indexOf("[")
      var end = text.lastIndexOf("]")
      if (start < 0 || end <= start) return null
      var bank = JSON.parse(text.slice(start, end + 1))
      if (!bank.length) return null
      var offset = day - game.origin
      var i = (offset >= 0 && offset < bank.length)
        ? offset
        : ((offset % bank.length) + bank.length) % bank.length
      return bank[i] || null
    })
    .catch(function () { return null })
}

// What the app last told us about the player's run. Absent on a first visit,
// and absent for anyone who has not opened the app since this shipped, so
// every read has to cope with nothing being there.
function progress() {
  return caches.open(STATE_CACHE)
    .then(function (cache) { return cache.match("./progress") })
    .then(function (res) { return res ? res.json() : null })
    .catch(function () { return null })
}

// One line per game, each naming that game's question for today.
//
// The prompt goes in the body rather than the title because the median one is
// 61 characters and Android truncates a title at roughly 40, while a body
// wraps to two lines and expands on a tap. With more than one game each line
// has to say which game it belongs to, or the body reads as a single run-on
// prompt and neither question is legible.
//
// A bank that is missing from the cache or has stopped slicing out as JSON
// drops its line rather than the whole notification: a nudge naming one game
// is still worth sending, and one naming none is still better than silence on
// a day the player meant to play.
function reminderBody() {
  var day = todayIndex()
  return Promise.all(REMINDER_GAMES.map(function (game) {
    return questionFor(game, day).then(function (q) {
      return q ? game.name + ": " + q.prompt : null
    })
  })).then(function (lines) {
    var named = lines.filter(Boolean)
    if (named.length) return named.join("\n")
    return REMINDER_GAMES.length > 1
      ? "One question in each game, about a minute each."
      : "One question, about a minute."
  })
}

// The title carries where they are, the body carries the questions.
//
// A reminder that treats day 1 and day 30 identically wastes the strongest
// reason anyone has to come back. Only claimed from two days onward, because
// "day 1" is not an achievement, and only when yesterday was actually played -
// otherwise the streak is already broken and saying a number out loud would be
// wrong.
//
// Kept to a handful of characters. The title shares its row with the app name,
// the timestamp and the expand chevron, so a collapsed Android notification
// gives it around fourteen characters - observed on a real device, where even
// "Today's question" came through as "Today's questi...". That truncation is
// still readable; "Day 12 of your streak" would have arrived as "Day 12 of
// your..." and lost the only word carrying the meaning.
// Plural since the reminder covers every live game. The streak it names is
// the longest run still alive across them, which is what the app writes into
// the progress record - see saveProgress in app.js, and why it refuses to pair
// one game's streak with another game's last-played day.
function reminderTitle(state, today) {
  if (!state || typeof state.streak !== "number" || state.streak < 2) {
    return "Today's questions"
  }
  if (state.lastPlayedDay !== today - 1) return "Today's questions"
  return "Day " + (state.streak + 1)
}

self.addEventListener("push", function (event) {
  event.waitUntil(
    Promise.all([reminderBody(), progress()]).then(function (both) {
      // The title stays short and is not the app name, which Android already
      // prints in the header above it.
      var title = reminderTitle(both[1], todayIndex())
      return self.registration.showNotification(title, {
        body: both[0],
        icon: "./icons/icon-192.png",
        // Monochrome silhouette on transparency. Android masks this to its
        // alpha and fills it white, so the full-colour icon rendered as a
        // solid white square in the status bar.
        badge: "./icons/badge-96.png",
        // A single reminder replaces an unread one rather than stacking, so
        // missing a few days never leaves a pile of notifications.
        tag: "estimation-gym-daily",
        renotify: false
      })
    })
  )
})

// Where a tapped reminder lands: the destination has to match what the body
// just said, and the body decides it.
//
// Three shapes, in order. When the app was one game, "./" WAS the question.
// When the home screen shipped, "./" silently became a chooser while the body
// still named one Fermi question - so the notification advertised a question
// and handed over a list of games to find it in, which is why this became
// "./#fermi". The body now names every live game's question, and the screen
// that lists exactly those games with their streaks is the home screen, so the
// fragment goes away again and for the first time the tap and the text agree.
//
// Still a constant rather than something read from the registry: a service
// worker cannot importScripts core/games.js without risking the fetch handler
// on every startup. sw.test.js pins this against REMINDER_GAMES, so naming one
// game in the body and opening another - in either direction - fails there.
//
// The path must stay exactly the precached start URL. A fragment costs
// nothing because it never reaches the network, which is why the app routes on
// a hash at all; a path or a query would miss the cache while offline.
var REMINDER_ROUTE = "./"

self.addEventListener("notificationclick", function (event) {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (windows) {
      // Reuse an already-open copy rather than stacking another window.
      // Matched on the literal string "estimation-gym-app" until the app got
      // its own address, where that substring does not appear at all -
      // "estimationgym.app" has no hyphens - so every reminder opened a new
      // window instead of focusing the one already there. The scope is the
      // right thing to compare against: it is whatever address this worker
      // was installed from, so it cannot go stale the next time that moves.
      for (var i = 0; i < windows.length; i++) {
        var client = windows[i]
        if (client.url.indexOf(self.registration.scope) !== 0 || !("focus" in client)) continue

        // Move it to the reminder's destination before showing it, rather
        // than showing whatever screen it was last left on. navigate() is not on every
        // WindowClient and can reject on its own, so a failure falls back to
        // the old behaviour rather than leaving the tap doing nothing at all.
        if (typeof client.navigate === "function") {
          return client.navigate(REMINDER_ROUTE)
            .then(function (navigated) { return (navigated || client).focus() })
            .catch(function () { return client.focus() })
        }
        return client.focus()
      }
      if (self.clients.openWindow) return self.clients.openWindow(REMINDER_ROUTE)
    })
  )
})
