# Estimation Gym

[![app installs](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fabacus.jasoncameron.dev%2Fget%2Festimation-gym%2Fapp-installs&query=%24.value&label=app%20installs&color=blue&style=flat-square)](https://sidathpeiris.github.io/estimation-gym-app/)

**A daily Fermi-estimation puzzle. One question a day, scored on how close you
get in powers of ten.**

### ▶ [Play it](https://sidathpeiris.github.io/estimation-gym-app/)

Every calendar day everyone gets the same question — a real-world quantity you
have to estimate, like *"how many piano tuners work in Chicago?"* You are scored
on **order-of-magnitude closeness**, not the exact value, because getting within
a factor of ten of a hard question is a genuinely useful skill and getting the
number exactly right is not the point.

No account. No sign-up. Works offline.

## Install it on your phone

- **iPhone / Safari:** open the link above, then Share → **Add to Home Screen**.
  iOS never shows an install prompt, so this has to be done by hand.
- **Android / Chrome:** open the link above, then **Install app** from the menu.

Once installed it plays fully offline — the questions travel with the app.

## How scoring works

| Band | How close | Points |
| --- | --- | --- |
| **Bullseye** | within ~2× | 100 |
| **Close** | within 10× | 70 |
| **Ballpark** | within 100× | 40 |
| **Off** | more than 100× out | 10 |

Anything better than **Off** extends your streak. An **Off** resets it to zero.
Your best streak is kept alongside your current one.

Scientific notation works for big numbers — type `3e12` rather than counting
zeroes.

## Hints

Stuck? **Hint** tells you how to attack that *shape* of problem — "stock equals
flow times lifetime", "people times per-person rate", "mass to moles to
molecules" — without saying anything about the answer, so you still do the
estimating.

Taking it:

- **halves that day's points**, and the result is marked `· hint`;
- **leaves it out of your calibration**, since a hinted guess measures the hint
  as much as it measures you;
- **does not break your streak.** The streak is for showing up, and charging
  you for wanting to learn the method would be the wrong incentive.

## Stats

Expand **Stats** for lifetime totals: how your guesses are distributed across
the bands, days played, best streak, median distance off, and — once you have
played ten days — which way you lean, e.g. *"You tend to guess low, by about
3.8×"*. Knowing your direction of error is the part you can actually correct.

**History** lists your past days, newest first.

## Updates

The app updates itself. A new version is fetched in the background and takes
effect the next time you open it, so if something looks stale, close it and
reopen once. Your history and streak are never touched by an update.

## Privacy

Your play history — guesses, scores, streaks, answers — **never leaves your
device**. It lives in your browser's local storage. There is no account, no
server storing your results, and no way for anyone to see how you are doing.

Two things do leave the device, both anonymous, and neither carries an
identifier or anything that could single you out:

- **An install count** — one request the first time the app is installed, which
  feeds the counter at the top of this page.
- **Which band you landed in** — *if* the comparison chart is switched on. That
  is the question's id and one of the four band names, so the app can show you
  how everyone did on the same question. **Not** your guess, **not** the answer,
  **not** when you played.

The comparison chart is **off unless a collection endpoint is configured**; with
none set the app makes no request for it at all.

## Also for the Omarchy desktop bar

The same puzzle runs as a widget in the [Omarchy](https://omarchy.org) shell
bar, which is where the question bank is maintained:

**<https://github.com/SidathPeiris/estimation-gym-omarchy>**

```bash
omarchy plugin add https://github.com/SidathPeiris/estimation-gym-omarchy.git --enable
```

Both show the same question on the same day and score it identically, but
**streaks are kept separately on each device** — nothing syncs between them, and
the desktop widget makes no network connection whatsoever.

## License

MIT

