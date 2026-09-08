# Estimation Gym (app)

The daily Fermi-estimation puzzle from the
[Omarchy bar widget](https://github.com/SidathPeiris/estimation-gym-omarchy),
as an installable web app for the phone.

Same question every calendar day, same order-of-magnitude scoring, same streak
rules — because it runs the **same code**. `core/` is copied verbatim from the
plugin repo and never edited here.

## Status

Working single screen: today's puzzle, guess entry, an optional hint, scored
result with points, and collapsible history and lifetime stats panels. Ships a web manifest, icons and a
cache-first service worker, so it installs to the home screen and plays offline.

Live at <https://sidathpeiris.github.io/estimation-gym-app/>. Offline play is
confirmed on a real device (installed to the home screen, airplane mode, reload).

Note that `CacheStorage` cannot be exercised in headless Chrome — every call
fails there with `UnknownError: Unexpected internal error` regardless of
headless mode or sandbox flags. Offline changes therefore have to be checked on
a real browser; an automated headless test will report a false failure.

## Hints

Stuck on a question, **Hint** names the *shape* of the problem and how to
attack it — "stock equals flow times lifetime", "people times per-person rate",
"mass to moles to molecules" — without saying anything about the answer, so you
still have to do the estimating.

Every question carries one of fifteen reasoning archetypes, and the guidance is
written once per archetype in `Model.js` rather than once per question. That is
both less to keep correct and more useful to learn: recognising that a problem
is population-times-rate helps with every such problem, not just today's.

Taking the hint:

- **halves the day's points**, and the result and share text both say `· hint`
  so a shared score stays honest;
- **excludes the day from calibration**, since a hinted guess measures the hint
  as much as it measures you;
- **does not touch your streak.** The streak measures showing up daily, and
  charging someone for wanting to learn the method would be exactly the wrong
  incentive.

The archetype is named on the result afterwards either way, hint or no hint.

## The Omarchy plugin

This started life as a bar widget for the [Omarchy](https://omarchy.org) shell,
which is still where the logic and the question bank are maintained:

- **Repo:** <https://github.com/SidathPeiris/estimation-gym-omarchy>
- **Marketplace listing:** <https://plugins.omarchy.org/plugin.html?id=sidath.estimation-gym>

```bash
omarchy plugin add https://github.com/SidathPeiris/estimation-gym-omarchy.git --enable
```

## How it relates to the widget

| | Widget (Omarchy) | App (this repo) |
| --- | --- | --- |
| Scoring, streaks, day selection | `Model.js` | **same file**, vendored into `core/` |
| Question bank | `content/questions.js` | **same file**, vendored into `core/` |
| UI | `Widget.qml` (Quickshell) | `index.html` + `app.js` |
| Storage | `~/.local/state/estimation-gym/state.json` | `localStorage` |

The two installs keep **independent streaks** by design — no account and no
server. The stored JSON shape is identical to the widget's `state.json`, so a
history blob can be moved across by hand if you ever want to.

Your play history never leaves the device on either surface. The widget makes
no network calls at all; this app makes one optional, anonymous request when it
is installed, described below, and it is off by default.

## Layout

```
core/            # vendored from the plugin repo - do not edit here
  Model.js         scoring, streaks, day selection, stats
  Model.test.js
  questions.js     the question bank
presenter.js     # pure state -> view model, shared with a future native build
storage.js       # localStorage adapter behind a two-method interface
index.html
app.css
app.js           # thin DOM renderer
scripts/
  serve.mjs        local dev server
  sync-core.mjs    re-copy core/ from the plugin repo, then run the tests
```

`presenter.js` exists so the "what goes on screen" decisions are testable and
reusable: a React Native view can consume the same view model without any of
this repo's DOM code.

### Debug resets

Two query parameters make the pre-answer screen reachable again without
clearing site data by hand:

| URL | Effect |
| --- | --- |
| `?reset=today` | Un-answers today only. Earlier days, and `bestStreak`, survive; the current streak is rebuilt around the gap. |
| `?reset=all` | Wipes history, streak and all, back to a first run. |

Both apply before the first render and then strip themselves from the address
bar, so a reload — or a URL that got bookmarked — cannot silently wipe again.
Any other value is ignored.

An installed copy opens at `start_url` with no query string, so use these from
a normal browser tab rather than from the home screen:

```
https://sidathpeiris.github.io/estimation-gym-app/?reset=today
```

## Install counter

Nothing about play is collected — not scores, not streaks, not answers — and
there is no way to see who has the app or on what device.

There is one optional exception: an anonymous count of installs. It is
**disabled by default**, and while `INSTALL_PING_URL` in `app.js` is empty the
app makes no outbound request whatsoever. Set it to a counter endpoint to turn
it on:

```js
var INSTALL_PING_URL = "https://YOURCODE.goatcounter.com/count?p=/installed"
```

What it sends is a bare GET to that URL plus a cache-buster. No identifier, no
history, no score, no query about the player at all. The only fact conveyed is
that one more install exists.

It fires at most once per browser profile, guarded by a `localStorage` flag, on
whichever of two triggers comes first:

- the browser's `appinstalled` event, on Chrome and the desktop browsers;
- the first launch in standalone display mode, which is how iOS is caught,
  since Safari has never fired `appinstalled`.

Counting the first standalone *launch* is the better measure anyway: it counts
installs somebody actually opened rather than ones added and forgotten.

Two things it cannot tell you. It counts **browser profiles, not people or
devices** — one person with a phone and a laptop is two. And offline play never
reports, which is rather the point of the app.

## Develop

```bash
npm test          # core, presenter and storage tests
npm run serve     # http://127.0.0.1:8123
```

Use a real origin rather than opening `index.html` from disk — `localStorage` is
unreliable on `file://` URLs and service workers will not register there at all.

## Install on a phone

- **Android / Chrome:** open the hosted URL, then "Install app" from the menu.
- **iOS / Safari:** open the hosted URL, then Share → Add to Home Screen. iOS
  gives no install prompt, so it has to be done by hand.

There are deliberately **no notifications**. A daily reminder needs reliable
scheduled local notifications, which iOS web apps do not provide — that is the
reason to wrap this in a native shell later, not something to fake here.

## Updating the app after deploy

The service worker is cache-first, so a returning visitor is served the cached
build until a new worker takes over. Bump `CACHE` in `sw.js` whenever any asset
changes, or people keep the old version indefinitely. The cache holds code only
— play history lives in `localStorage` and is never touched by a version bump.

## Updating the question bank

Edit questions in the **plugin repo**, then:

```bash
npm run sync-core ../estimation-gym-omarchy
```

That re-copies `Model.js`, `Model.test.js` and `questions.js`, reports the new
bank size, and runs every test before it will leave the tree changed.

## License

MIT
