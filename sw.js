// Cache-first service worker. The whole app is static and offline play is the
// point, so every asset is precached on install and served from the cache
// thereafter. Bump CACHE whenever any asset changes -- with a versioned cache
// name plus skipWaiting/claim, a deploy replaces the old copy on next launch
// rather than stranding people on a stale build.
//
// Note this caches code only. Play history lives in localStorage, which the
// cache never touches, so a version bump can never cost anyone their streak.

var CACHE = "estimation-gym-v8"

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
      .then(function (cache) { return cache.addAll(ASSETS) })
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
