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

var CACHE = "estimation-gym-v1.6.3"

// A second cache, deliberately unversioned, holding one small record the
// service worker needs but cannot otherwise reach: the streak.
//
// The streak lives in localStorage, which a service worker cannot read, and
// when a push arrives the app is closed so there are no clients to ask. This
// is the smallest place both sides can see. It survives version bumps - the
// activate handler below exempts it - because it is state, not an asset.
var STATE_CACHE = "estimation-gym-progress"

var ASSETS = [
  "./",
  "./index.html",
  "./app.css",
  "./app.js",
  "./presenter.js",
  "./storage.js",
  "./core/Model.js",
  "./core/questions.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/badge-96.png",
  "./icons/icon-192-maskable.png",
  "./icons/icon-512-maskable.png"
]

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function (cache) {
        // { cache: "reload" } bypasses the browser HTTP cache for each
        // precache request. Without it, addAll is free to satisfy these from
        // the HTTP cache, which means a fresh cache version can be populated
        // with the *previous* build - the deploy then looks like it landed
        // (new cache name, new service worker) while the app quietly keeps
        // running old code. Observed happening to core/Model.js.
        return cache.addAll(ASSETS.map(function (url) {
          return new Request(url, { cache: "reload" })
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
        if (event.request.mode === "navigate") return caches.match("./index.html")
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
// The day the schedule was frozen, and the arithmetic that turns a date into
// a day number. Both are duplicated from Model.js because a service worker
// cannot import it - importScripts would run on every worker startup and take
// the fetch handler down with it if it ever failed, which would cost offline
// play to save a notification. sw.test.mjs pins these to Model.js so the copy
// cannot drift.
var SCHEDULE_ORIGIN = 982
var EPOCH_MS = Date.UTC(2024, 0, 1)
var DAY_MS = 24 * 60 * 60 * 1000

function todayIndex() {
  var d = new Date()
  return Math.floor((Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) - EPOCH_MS) / DAY_MS)
}

// Today's question, read out of the cached bank.
//
// The push carries no payload - that is deliberate, and it is why no
// encryption keys are stored for any subscriber - so the text has to be built
// here. Naming the actual question turns the reminder from an errand into a
// hook, and it gives nothing away: seeing the question early is no help,
// because the whole game is working the number out.
function todaysQuestion() {
  return caches.open(CACHE)
    .then(function (cache) { return cache.match("./core/questions.js") })
    .then(function (res) { return res ? res.text() : null })
    .then(function (text) {
      if (!text) return null
      // The bank is written as `var QUESTIONS = [ ...json... ]`, so the array
      // slices out as valid JSON. Parsed, never evaluated - this is untrusted
      // in principle and eval in a service worker is not worth the risk.
      var start = text.indexOf("[")
      var end = text.lastIndexOf("]")
      if (start < 0 || end <= start) return null
      var bank = JSON.parse(text.slice(start, end + 1))
      if (!bank.length) return null
      var offset = todayIndex() - SCHEDULE_ORIGIN
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

// The title carries where they are, the body carries the question.
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
function reminderTitle(state, today) {
  if (!state || typeof state.streak !== "number" || state.streak < 2) {
    return "Today's question"
  }
  if (state.lastPlayedDay !== today - 1) return "Today's question"
  return "Day " + (state.streak + 1)
}

self.addEventListener("push", function (event) {
  event.waitUntil(
    Promise.all([todaysQuestion(), progress()]).then(function (both) {
      var q = both[0]
      var title = reminderTitle(both[1], todayIndex())
      // The question goes in the body rather than the title: the median prompt
      // is 61 characters and Android truncates a title at roughly 40, while a
      // body wraps to two lines and expands. The title stays short and is not
      // the app name, which Android already prints in the header above it.
      return self.registration.showNotification(title, {
        body: q ? q.prompt : "One question, about a minute.",
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

self.addEventListener("notificationclick", function (event) {
  event.notification.close()
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (windows) {
      // Reuse an already-open copy rather than stacking another window.
      for (var i = 0; i < windows.length; i++) {
        if (windows[i].url.indexOf("estimation-gym-app") >= 0 && "focus" in windows[i]) {
          return windows[i].focus()
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow("./")
    })
  )
})
