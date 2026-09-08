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

## Updating the app after deploy

The service worker is cache-first, so a returning visitor is served the cached
build until a new worker takes over. **Bump `CACHE` in `sw.js` whenever any
asset changes**, or people keep the old version indefinitely.

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
