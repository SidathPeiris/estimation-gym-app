# Developing the app

Everything here is for working on the app itself. Players need none of it — see
[README.md](README.md) for that.

## Relationship to the Omarchy plugin

The [plugin repo](https://github.com/SidathPeiris/estimation-gym-omarchy) is the
**source of truth** for scoring and the question bank. `core/` is copied from it
verbatim and is never edited here.

| | Widget (Omarchy) | App (this repo) |
| --- | --- | --- |
| Scoring, streaks, day selection | `Model.js` | **same file**, vendored into `core/` |
| Question bank | `content/questions.js` | **same file**, vendored into `core/` |
| UI | `Widget.qml` (Quickshell) | `index.html` + `app.js` |
| Storage | `~/.local/state/estimation-gym/state.json` | `localStorage` |

The stored JSON shape is identical to the widget's `state.json`, so a history
blob can be moved across by hand.

## Layout

```
core/            # vendored from the plugin repo - do not edit here
  Model.js         scoring, streaks, day selection, stats
  Model.test.js
  questions.js
presenter.js     # pure view-model logic, no DOM
storage.js       # persistence adapter
app.js           # DOM wiring
scripts/
  serve.mjs        local dev server
  sync-core.mjs    re-copy core/ from the plugin repo, then run the tests
```

`presenter.js` exists so the "what goes on screen" decisions are testable and
reusable: a React Native view can consume the same view model without any of
this repo's DOM code.

## Develop

```bash
npm test          # core, presenter and storage tests
npm run serve     # http://127.0.0.1:8123
```

## Debug resets

Two query parameters make the pre-answer screen reachable again without
clearing site data by hand:

| URL | Effect |
| --- | --- |
| `?reset=today` | Un-answers today only. Earlier days, and `bestStreak`, survive; the current streak is rebuilt around the gap. |
| `?reset=all` | Wipes history, streak and all, back to a first run. |

Both apply before the first render and then strip themselves from the address
bar, so a reload — or a URL that got bookmarked — cannot silently wipe again.
Any other value is ignored.

An installed copy opens at `start_url` with no query string, so use these from a
normal browser tab rather than from the home screen:

```
https://sidathpeiris.github.io/estimation-gym-app/?reset=today
```

## Install counter

Nothing about play is collected — not scores, not streaks, not answers — and
there is no way to see who has the app or on what device.

The one exception is an anonymous count of installs, which feeds the badge at
the top of the README. `INSTALL_PING_URL` in `app.js` holds the endpoint;
setting it to `""` disables the whole thing and the app then makes no outbound
request at all.

```js
var INSTALL_PING_URL = "https://abacus.jasoncameron.dev/hit/estimation-gym/app-installs"
```

What it sends is a bare GET plus a cache-buster. No identifier, no history, no
score. The only fact conveyed is that one more install exists.

It fires at most once per browser profile, guarded by a `localStorage` flag, on
whichever of two triggers comes first:

- the browser's `appinstalled` event, on Chrome and the desktop browsers;
- the first launch in standalone display mode, which is how iOS is caught,
  since Safari has never fired `appinstalled`.

Counting the first standalone *launch* is the better measure anyway: it counts
installs somebody actually opened rather than ones added and forgotten.

Caveats worth remembering:

- It counts **browser profiles, not people or devices** — one person with a
  phone and a laptop is two.
- Offline play never reports, which is rather the point of the app.
- The counter is **unauthenticated**: anyone who finds the endpoint can inflate
  it. It is a rough public figure, not an audited one.
- The Abacus key expires after roughly six months without traffic, which would
  reset the badge rather than hold the total.

## Staying current, and the day rollover

Two things an installed copy gets wrong unless handled, both because a PWA on a
phone is **resumed from memory rather than reloaded**, sometimes for weeks:

1. **The day never changes.** `today` used to be computed once when the page
   loaded. Left open overnight, the app would still show yesterday's question and
   would record an answer against yesterday. `refreshDay()` now recomputes on
   every `visibilitychange`, and re-renders only when the day actually moved.
2. **The build never changes.** A service worker only looks for a new version
   when the page loads. The app now calls `registration.update()` each time it
   comes to the foreground, and reloads on `controllerchange` so the new code
   actually takes effect - deferred while a guess is half-typed, so a background
   update cannot eat someone's input.

The line at the bottom of the screen reads e.g. `v12 · Thu 10 Sep`. The version
half is read from the **live service worker cache name**, not from a constant,
so it reports what is actually running rather than what the source claims. The
date half is the puzzle currently on screen. One glance confirms both.

## Comparison chart

Shows how everyone did on the same question, as a bar chart over the four
scoring bands, with your own band marked. Reachable from the result and from
any history row recorded since `questionId` began being stored.

**Off by default.** `DISTRIBUTION_URL` in `app.js` is empty, and with no
endpoint the app makes no request for it. Point it at a deployed Worker to
switch it on:

```js
var DISTRIBUTION_URL = "https://estimation-gym-distribution.<subdomain>.workers.dev"
```

### What is stored

Four counters per question, one per band. No guess, no answer, no identifier,
no play timestamp. The submission body is exactly:

```json
{ "questionId": "piano-tuners-chicago", "band": "Close" }
```

### Keyed on question id, never on the day

Growing the bank reshuffles which question falls on which date. A distribution
keyed by day number would silently attach itself to the wrong question later —
the same trap that once made the result panel show the wrong actual value. This
is why history entries now record `questionId`, and why rows written before
that cannot be compared: the question they asked is not recoverable.

### Deploying the Worker

```bash
cd worker
npm install -g wrangler          # once
wrangler login                   # your Cloudflare account
wrangler d1 create estimation-gym         # paste the id into wrangler.toml
wrangler d1 execute estimation-gym --remote --file=./schema.sql
wrangler deploy
```

Then set `DISTRIBUTION_URL` in `app.js` to the deployed URL and bump `CACHE`.

`node worker/worker.test.mjs` exercises the endpoint against an in-memory
stand-in for D1, so the logic is testable without deploying.

### Limits worth knowing

- **The breakdown is released from the first response** (`MIN_SAMPLE = 1` in the
  Worker). Everyone playing on a given calendar date gets the same question, so
  a day's responses land on **one** question id rather than spreading across the
  bank — the constraint is how many people play, not dilution. A question also
  recurs only about every 500 days and a returning player is not counted twice,
  so any floor above 1 keeps the chart hidden for a long time on a small
  audience.

  Presenting a tiny sample honestly is the **client's** job rather than the
  endpoint's. The chart only ever appears on a question the player has answered,
  so their own response is always inside the counts; at a total of one, that
  response is the only one there is. `distributionView` detects this and says
  "You are the first to answer this one" instead of reporting that they did
  better than 0% of them, which would be comparing someone against themselves.
- **Submissions are unauthenticated.** One per address per question is enforced,
  and the origin is checked, but a determined person could still skew a
  question. Treat the chart as indicative.
- **Offline play never reports**, so the counts under-represent installed users.
- The stored client key is a **hash of address plus question id**, so the table
  holds no bare IP addresses.

## Updating the app after deploy

The service worker is cache-first, so a returning visitor is served the cached
build until a new worker takes over. **Bump `CACHE` in `sw.js` whenever any
asset changes**, or people keep the old version indefinitely.

Bumping `CACHE` is necessary but not sufficient. The precache requests are made
with `{ cache: "reload" }` so they bypass the browser HTTP cache; without that,
`addAll` may satisfy them from the HTTP cache and fill the *new* cache version
with the *previous* build. The deploy then looks like it landed — new cache
name, new worker, new files on the origin — while the app quietly keeps running
old code. This was observed happening to `core/Model.js`, so do not remove it.

When checking a deploy, compare what the page is running against the origin
rather than trusting the cache name:

```js
const c = await caches.open("estimation-gym-vNN")
const cached = await (await c.match("./core/Model.js")).text()
const origin = await (await fetch("./core/Model.js?bust=" + Date.now())).text()
cached === origin   // false means the precache picked up a stale copy
```

Note that a plain `fetch(url, {cache: "reload"})` from the page does **not**
bypass the service worker — it is intercepted like any other request. Only a
URL the worker has no cache entry for (the `?bust=` above) reaches the origin.

Note the consequence when testing: immediately after a deploy the first load
still runs the *previous* bundle, and the new one takes effect on the reload
after that. A change that looks like it did not ship usually just needs a second
load.

The cache holds code only — play history lives in `localStorage` and is never
touched by a version bump.

## Updating the question bank

Edit questions in the **plugin repo**, then:

```bash
npm run sync-core ../estimation-gym-omarchy
```

That re-copies `Model.js`, `Model.test.js` and `questions.js`, reports the new
bank size, and runs every test before it will leave the tree changed.

## Testing offline behaviour

`CacheStorage` cannot be exercised in headless Chrome — every call fails with
`UnknownError: Unexpected internal error` regardless of headless mode or sandbox
flags. Offline changes have to be checked in a real browser; an automated
headless test reports a false failure.
