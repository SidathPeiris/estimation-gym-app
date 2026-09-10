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

**Step-by-step instructions for your device:**
**<https://sidathpeiris.github.io/estimation-gym-app/install/>**

The short version:

- **iPhone / Safari:** open the link above, then Share → **Add to Home Screen**.
  It has to be Safari — Chrome and Firefox on iOS cannot add apps to the home
  screen, which is an Apple restriction rather than a fault in the app.
- **Android / Chrome:** open the link above, then **Install app** from the menu.

Once installed it plays fully offline — the questions travel with the app.

## A longer walkthrough

<a href="https://youtu.be/3xvcWVqtHKY">
  <img src="https://img.youtube.com/vi/3xvcWVqtHKY/maxresdefault.jpg"
       alt="Estimation Gym: a daily Fermi estimation puzzle, explained"
       width="480">
</a>

Seven minutes on what the game is, why scoring in powers of ten makes a
better puzzle than scoring exactly, and how to reason a question out. Not
needed to play — the game explains itself in about a minute.

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

## Practice

One question a day is the point, but it is a slow way to find out whether you
like something. **Practice** gives you a question the daily puzzle has not used
yet, scored exactly the same way — and it does not touch your streak, your
stats, or what other players see.

Questions you have practised do not come round again, and neither do ones you
have already had as a daily.

## Stats

Expand **Stats** for lifetime totals: how your guesses are distributed across
the bands, days played, best streak, median distance off, and — once you have
played ten days — which way you lean, e.g. *"You tend to guess low, by about
3.8×"*. Knowing your direction of error is the part you can actually correct.

**History** lists your past days, newest first.

**Copy my history** and **Restore a history** move a streak between devices, or
bring one back after clearing your browser data. Restoring only ever *adds*
days — anything already on the device is kept exactly as it is, so restoring an
old copy cannot wipe out days you have played since.

## Updates

The app updates itself. A new version is fetched in the background and takes
effect the next time you open it, so if something looks stale, close it and
reopen once. Your history and streak are never touched by an update.

## Privacy

Your play history — guesses, scores, streaks, answers — **never leaves your
device**. It lives in your browser's local storage. There is no account, no
server storing your results, and no way for anyone to see how you are doing.

Three things do leave the device. None carries your guesses, your scores or
your history:

- **An install count** — one request the first time the app is installed, which
  feeds the counter at the top of this page.
- **Which band you landed in, and roughly how far off** — the question's id,
  one of the four band names, and the whole number of powers of ten between
  your guess and the answer. Not your guess, not the answer, not when you
  played. The second number exists because "Off" covers everything past 100x,
  which cannot tell a hard question from a mistyped one.
- **A reminder subscription** — *only if you turn the daily reminder on.* This
  is the one thing that identifies a device: the push address your browser
  generates, plus your timezone offset so the nudge arrives in the morning
  rather than at 3am, plus the day number you last played so you are not
  reminded to do something you have already done. Turning the reminder off
  deletes it.

The three above are the whole of it **for the app**. One page is different: the
[install page](https://sidathpeiris.github.io/estimation-gym-app/install/),
which explains how to add the app to a phone, carries Cloudflare Web Analytics.
It counts page views and where visitors arrived from, sets no cookies, and
Cloudflare states it does not track individual people across sites. It is there
so it is possible to tell whether anyone is finding the app at all.

That script is on the install page and nowhere else. Once you are playing, it
is not loaded and never has been.

The reminder is **off unless you switch it on**, and the comparison chart is
off unless a collection endpoint is configured.

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

[GNU Affero General Public License v3.0 or later](LICENSE).

You are free to use, study, share and modify this. If you run a modified
version as a service that other people can use, the AGPL requires you to offer
them its source too.

`core/` is vendored from the [Omarchy plugin
repo](https://github.com/SidathPeiris/estimation-gym-omarchy), which is MIT
licensed. MIT code may be included in an AGPL project, so the combined work is
AGPL while those files remain available under MIT at their source.

