# Developing the app

Everything here is for working on the app itself. Players need none of it — see
[README.md](README.md) for that.

## The Omarchy plugin is finished

The [plugin repo](https://github.com/SidathPeiris/estimation-gym-omarchy) is
**frozen at `fc89147`** and takes no further changes. It works, it is done, and
the app is where the product goes from here.

So there is no longer a sync step, no shared source of truth to maintain, and
no second repository to keep in step. `core/` is simply this app's logic layer.
`scripts/sync-core.mjs` has been deleted along with its npm script; the two
codebases are independent copies now, and the widget's copy is final.

**`core/` is no longer copied from anywhere, and nothing copies out of it.**
Edit it freely.

### What the freeze releases

A great deal of the wording in `Model.js` and `presenter.js` is shaped by a
constraint that no longer binds: that a result had to be described in the same
words in a 300px shell bar as in the browser. `presenter.js` still says so in
places, and those comments are now history rather than rules. The strings are
good — keep them because they are good, not because something else depends on
them.

### The one thing the freeze breaks, and when

Both surfaces pick the day's question the same way: `bank[N - SCHEDULE_ORIGIN]`,
wrapping once the offset runs past the end. That agreement survives the freeze
**only while the two banks are the same length.**

The bank holds 1000 questions, and `SCHEDULE_ORIGIN` is 982, so **2029-06-04**
is the last day served straight from it and **2029-06-05** is the first that
wraps. Both dates are computed rather than remembered — `questionForDay(1981)`
is `balloons-inflated-per-year` and `questionForDay(1982)` is
`germs-on-a-phone-screen`, the first entry again.

Until 2029-06-05, appending here changes nothing either surface serves, so the
app and the frozen widget still show the same question on the same day. From
that date they agree only while both banks are the same length — which they
stop being the moment a question is added here. The widget restarts its
thousand; the app carries on into whatever has been added since.

That is fine — it is a consequence of finishing the widget, not a bug — but
`README.md` claims the two always agree, so that claim is now dated rather than
true, and it says so.

### What is still shared, and stays shared

The stored JSON shape is identical to the widget's `state.json`, so a history
blob can still be moved across by hand. Nothing needs to be done to keep that
working: both formats are frozen, one because the widget is finished and one
because `storage.js` has to keep reading what players already have.

## Layout

```
core/            # scoring, the question bank, and their tests
  Model.js         scoring, streaks, day selection, stats
  Model.test.js
  questions.js
presenter.js     # pure view-model logic, no DOM
storage.js       # persistence adapter
app.js           # DOM wiring
app.css          # design tokens, then one section per component
fonts/           # the three brand faces, self-hosted - see fonts/README.md
scripts/
  serve.mjs        local dev server
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
https://estimationgym.app/?reset=today
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

## Suggested questions

Players can suggest a question from inside the app. It posts to the Worker
and lands in the `suggestions` table as `pending`.

**Nothing submitted is ever served to a player.** The only path into the game
is being appended to the bank by hand. That is deliberate: the bank carries
the answers, so an unchecked question is worse than no question - it would
mark a correct guess as wrong and discredit the scoring.

Review them locally:

```bash
node scripts/suggestions.mjs list           # everything still pending
node scripts/suggestions.mjs show <id>
node scripts/suggestions.mjs accept <id>    # prints a bank entry to append
node scripts/suggestions.mjs reject <id>
```

`accept` marks the row and hands back a ready-shaped entry with the strategy
and the decomposition hint left as TODO. Check the answer against the source
before it goes anywhere near the bank; the number in that entry is the
submitter's claim and nothing more.

### Why there is no admin page

A hosted review screen would mean another public endpoint holding another
secret, guarding data only one person ever reads. The script reaches the same
rows through wrangler, which is already authenticated as you. The cost is that
review only happens at a desktop.

### What the endpoint refuses

This is the only place submissions are filtered, so the refusals are the
feature rather than an afterthought:

| Refused | Why |
| --- | --- |
| `<` or `>` anywhere | The widget renders prompts through Qt's `Text`, which treats HTML-shaped input as rich text unless pinned. The widget *is* pinned - this is the second line of defence |
| Control characters | No place in a sentence, and a standard way past a later check |
| An answer that is not a positive finite number | An unparseable answer is not a claim anyone can verify |
| A prompt under 15 or over 200 characters | |
| More than 5 a day from one address | Hashed, so the table never holds a bare IP |
| A foreign `Origin` | Same rule the rest of the Worker follows |

## Reading how far off people are

`Off` is every guess past 100x, so the band alone cannot separate a hard
question from someone who typed `5` meaning five billion. The whole number of
decades is counted alongside it:

```bash
cd worker && npx wrangler d1 execute estimation-gym --remote --command \
  "SELECT decade, SUM(tally) AS n FROM decade_errors GROUP BY decade ORDER BY decade"
```

A pile at 2-3 is the game working as intended. A pile at 6 or more is an input
problem wearing a difficulty costume, and worth fixing in the client rather
than in the question bank.

## Design tokens and type

`app.css` opens with the token block from the Estimation Gym Design System -
the colour ramp, the semantic aliases, type, spacing, radii, elevation and
motion - and every rule below it reads that layer. There are no raw hex values
and no per-section colour constants, so a colour changes in one place.

Two things about it are easy to get wrong:

- **The light theme repeats the whole alias layer, not just the base ramp.** A
  custom property is substituted where it is *declared*, so `--surface-page:
  var(--ink-900)` on `:root` computes to the literal dark hex and inherits down
  as that literal. Redefining `--ink-900` inside the light block never reaches
  it. Add an alias to `:root` and it has to be added to the light block too, or
  it silently stays dark.
- **`install/index.html` carries its own copy of the token block.** It does not
  link `app.css`, deliberately - that file is full of styles that only make
  sense inside the puzzle. The two blocks have to move together.

The three faces - Bricolage Grotesque for display, Schibsted Grotesk for prose,
JetBrains Mono for anything numeric - are **self-hosted in `fonts/`** rather
than fetched from a CDN. That is not a preference: `_headers` sets
`font-src 'self'` and `style-src 'self'`, so a Google Fonts link is refused
outright on the deployed site while working perfectly in local development.

**Adding or changing a font means touching three files**: the `@font-face`
rules at the top of `app.css`, the copy of them in `install/index.html`, and
the `ASSETS` precache list in `sw.js`. Miss the last one and the face is simply
absent offline. `fonts/README.md` has the refresh procedure.

## Brand assets

`tools/banner.html` is the source for the YouTube channel banner, rendered
with headless Chrome rather than hand-drawn so the wordmark uses a real
typeface. The render command is in the file. The same convention as the
plugin repo's `tools/preview.html`.

All three tools under `tools/` pull the brand faces out of `fonts/` with
`font-display: block`, so a headless screenshot waits for the real type rather
than capturing the fallback. Render them from the repository root, or the
relative `../fonts/` paths will not resolve.

Only the source is committed. The PNG is half a megabyte, nothing in the app
serves it, and this file reproduces it byte for byte.

**The part that is easy to get wrong:** YouTube crops a banner differently on
every device - 2560x1440 on a TV, 2560x423 on desktop, and only the centre
1546x423 on a phone. Everything legible has to live inside that centre box.
A longer tagline is exactly the kind of edit that silently pushes text out of
the mobile crop, so measure the render rather than eyeballing it.

The app icons under `icons/` are the other brand asset. They are referenced
by `manifest.webmanifest` at 192 and 512, in plain and maskable variants; the
maskable ones carry extra padding so Android can crop them to any shape.

## How the site deploys

Pushing to `main` builds and deploys the site. Cloudflare runs
`npx wrangler deploy` at the repository root, which picks up `wrangler.jsonc`
and uploads everything not listed in `.assetsignore`.

**Do not deploy the site by hand.** A bare `wrangler deploy` is ambiguous now
that two configs live here: run from `worker/` it picked up the ROOT config,
deployed the site under the Worker's name, and left the Worker untouched while
reporting success. That has already happened once, and the only symptom was a
request still being refused afterwards.

| File | Deploys | How |
| --- | --- | --- |
| `wrangler.jsonc` | the static site | automatically, on push to `main` |
| `worker/wrangler.toml` | the distribution Worker | `npm --prefix worker run deploy` |

The Worker command names its config explicitly, so it cannot pick up the wrong
one. The site needs no command at all.

### What each host publishes

Two hosts serve this repository at once and they decide differently. Workers
uploads everything under the repository root except what `.assetsignore` lists.
Pages publishes everything except what `_config.yml` lists — plus dotfiles and
top-level `_` entries, which Jekyll hides on its own without being told.

So the two lists have to say the same thing, and **`pages.test.js` is what
holds them together.** It also checks that nothing in the service worker's
precache list is excluded from either host, which is the expensive failure:
`cache.addAll` rejects the whole batch on one missing file, the worker never
activates, and the app stops being installable while the page carries on
working — so there is no visible symptom.

Both files claimed for a long time that this test existed when it did not.
Writing it found two files published by one host and hidden by the other.
`_headers` is the one deliberate exception: Cloudflare reads it as
configuration and never serves it, and Jekyll hides it for its underscore, so
it is absent from both while appearing in neither list.

## Versioning

`major.minor.patch`, declared once in `package.json`:

| Field | Bumped when |
| --- | --- |
| **major** | A full release - the app is meaningfully a new thing |
| **minor** | A feature is added within that release |
| **patch** | A fix or a small change within that feature set |

No padding. `01.02.03` reads tidily but is not a valid version: leading zeros
are forbidden, every field would cap at 99, and anything that parses versions
either rejects it or sorts it wrongly. `version.test.js` enforces the format.

### Bump the patch for every deploy, however small

The service worker cache is named `estimation-gym-v<version>`, and a changed
cache name is the entire mechanism by which a deploy replaces someone's old
copy instead of stranding them on stale files. Ship twice under one version
and everyone who already fetched the first one keeps it, silently.

`version.test.js` pins the cache name to `package.json` so the two cannot
drift, but it cannot know what is already live - that part is discipline.

This replaced a bare counter that reached v37 while `package.json` sat at
0.1.0 and never moved. The panel reads its build stamp out of the live cache
name rather than a constant, so it still reports what is actually running
rather than what a constant claims.

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

Edit `core/questions.js` and run `npm test`. That is the whole procedure now —
there is no second repository to propagate to.

Append to the **end** of the bank, never insert. The bank's order is the
calendar, and `questions.test.js` fails the build if existing entries move; see
"The daily schedule is the bank's own order" below. Every question added pushes
the wrap date out by another day.

## Testing offline behaviour

`CacheStorage` cannot be exercised in headless Chrome — every call fails with
`UnknownError: Unexpected internal error` regardless of headless mode or sandbox
flags. Offline changes have to be checked in a real browser; an automated
headless test reports a false failure.
