// Cache-first service worker. The whole app is static and offline play is the
// point, so every asset is precached on install and served from the cache
// thereafter. Bump CACHE whenever any asset changes -- with a versioned cache
// name plus skipWaiting/claim, a deploy replaces the old copy on next launch
// rather than stranding people on a stale build.
//
// Bumping CACHE is necessary but not sufficient: the precache itself has to
// bypass the HTTP cache, or the new version is filled with old files. See the
// install handler.
//
// Note this caches code only. Play history lives in localStorage, which the
// cache never touches, so a version bump can never cost anyone their streak.

var CACHE = "estimation-gym-v32"

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
          return name === CACHE ? null : caches.delete(name)
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
self.addEventListener("push", function (event) {
  event.waitUntil(
    self.registration.showNotification("Estimation Gym", {
      body: "Today's question is ready.",
      icon: "./icons/icon-192.png",
      badge: "./icons/icon-192.png",
      // A single reminder replaces an unread one rather than stacking, so
      // missing a few days never leaves a pile of notifications.
      tag: "estimation-gym-daily",
      renotify: false
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
