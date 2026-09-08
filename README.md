# Estimation Gym (app)

The daily Fermi-estimation puzzle from the
[Omarchy bar widget](https://github.com/SidathPeiris/estimation-gym-omarchy),
as an installable web app for the phone.

Same question every calendar day, same order-of-magnitude scoring, same streak
rules — because it runs the **same code**. `core/` is copied verbatim from the
plugin repo and never edited here.

## Status

Working single screen: today's puzzle, guess entry, scored result with points,
and a collapsible lifetime stats panel. Ships a web manifest, icons and a
cache-first service worker, so it installs to the home screen and plays offline.

Live at <https://sidathpeiris.github.io/estimation-gym-app/>. Offline play is
confirmed on a real device (installed to the home screen, airplane mode, reload).

Note that `CacheStorage` cannot be exercised in headless Chrome — every call
fails there with `UnknownError: Unexpected internal error` regardless of
headless mode or sandbox flags. Offline changes therefore have to be checked on
a real browser; an automated headless test will report a false failure.

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

The two installs keep **independent streaks** by design — no account, no server,
no network, exactly like the widget. The stored JSON shape is identical to the
widget's `state.json`, so a history blob can be moved across by hand if you ever
want to.

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
