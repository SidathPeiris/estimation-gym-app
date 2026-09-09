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

## Daily reminder

Opt-in Web Push. Off unless the player turns it on, and the toggle is hidden
entirely on a browser without push support.

### Payload-less on purpose

The push carries **no body**. That removes the AES128GCM content encryption a
normal Web Push needs, which in turn means the `p256dh`/`auth` keys a
subscription usually carries never have to be stored. The notification wording
lives in `sw.js` instead. Less code, and less held about anyone.

What is still required is VAPID — a signed assertion that the push came from
the holder of the application server key the browser subscribed with.
`worker/src/push.js` builds that JWT with WebCrypto: ES256 over P-256, whose
raw `r||s` output is already the shape JWS wants, so no DER unwrapping.

### Keys

- `VAPID_PUBLIC_KEY` is a plain var in `wrangler.toml` and inlined in `app.js`.
  It is meant to be public — it says who may push, and is useless alone.
- `VAPID_PRIVATE_KEY` is a Worker secret, set with
  `npx wrangler secret put VAPID_PRIVATE_KEY`, holding the key as JWK.

Rotating them invalidates every existing subscription; everyone would have to
turn the reminder back on.

### Timing, across timezones

The cron runs **hourly**. Each run pushes only to subscribers for whom it has
just turned `REMINDER_HOUR` (9am) locally, computed from the stored
`getTimezoneOffset()`. Every subscriber matches exactly once per UTC day
whatever their offset, so one schedule covers the world without waking anyone
at 3am. `push.test.mjs` pins that, including a half-hour offset.

A device also reports the day it last played, so someone who has already
answered is not told to go and answer.

### Dead subscriptions

A push service replying 404 or 410 means the subscription is gone for good, so
the row is deleted. Any other failure is left alone and retried tomorrow — a
transient 500 must not throw away someone's reminder.

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

### How often it refreshes

A distribution is fetched when the question first needs one, and cached. Coming
back to the app re-reads it if the cached copy is older than `DIST_MAX_AGE_MS`
(60s), so the count reflects people who answered while you were away instead of
freezing at whatever it was when the page loaded. Inside that window a resume
costs nothing, so flicking between apps does not produce a request per switch.

Submitting a result also refreshes it, since the POST returns the current
picture - answering costs one round trip rather than two.

### Keyed on question id, never on the day

A distribution keyed by day number would risk attaching itself to the wrong
question — the trap that once made the result panel show the wrong actual
value, back when growing the bank re-dealt every date. The schedule is frozen
now (see below), but keying on the question rather than the day is still the
honest way to store it: it says what was actually asked instead of relying on
the calendar never moving again. This is why history entries record
`questionId`, and why rows written before that cannot be compared — the
question they asked is not recoverable.

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

## The daily schedule is the bank's own order

Day *N* is served `QUESTIONS[N - SCHEDULE_ORIGIN]`, where the origin is
2026-09-09. There is no shuffle at read time.

It used to be a seeded shuffle keyed on the bank's length, and that was a bug
waiting to happen. Every input to it — the cycle, the position, and the
permutation itself — depended on how many questions existed, so **adding
questions re-dealt every single day**, past and future. Growing the bank from
500 to 1000 did exactly that: the question changed underneath anyone who had
the app open that day.

Reading the schedule straight off the array makes growth safe, but only while
the entries already scheduled stay where they are. Hence one rule:

> **`questions.js` is append-only.** New questions go at the end. Never
> insert, reorder or delete.

Appending extends the schedule by a day at the far end and moves nothing.
`core/questions.test.js` pins the order of the scheduled span by checksum, so
breaking the rule fails the tests instead of quietly rewriting every player's
calendar. Editing a question's *value*, prompt or source does not trip it —
only moving entries does.

Two consequences worth knowing:

- Days **before** the origin are not covered and fall back to wrapping. That is
  fine: past days are read from stored history, never recomputed.
- Once the bank has been worked all the way through — currently 2029-06-05 —
  the order repeats. Every question added pushes that out by another day.

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
