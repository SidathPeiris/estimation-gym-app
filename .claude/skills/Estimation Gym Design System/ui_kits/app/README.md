# Estimation Gym — app UI kit

A recreation of the PWA at <https://estimationgym.app/>, restyled against this
design system.

Open `index.html`. Four destinations in the bottom bar:

| Screen | File | Source it recreates |
| --- | --- | --- |
| Today | `TodayScreen.jsx` | `index.html` hero + `#guess-form` + `#result` + `#dist`, `presenter.js resultView/distributionView/percentileView` |
| Practice | `PracticeScreen.jsx` | `#practice` section, `app.js nextPractice/submitPractice/renderPractice`, `core/Model.js practicePool/pickPractice` |
| Stats | `StatsScreen.jsx` | `#stats`, `#arch`, `#history`, `presenter.js statsView/archetypeView/historyView` |
| Guide | `GuideScreen.jsx` | `#howto`, `#suggest`, `core/Model.js HOW_TO_PLAY`, reminder explainer |

## How the question system works

Taken from `core/Model.js` — the kit follows it rather than inventing rules.

- **One question a day, the same one for everyone.** Day N is served
  `bank[N - SCHEDULE_ORIGIN]`, read straight off the append-only bank, so
  adding questions extends the queue instead of re-dealing days already played.
  There is no way to play a second daily; answering is idempotent per day.
- **Practice is a separate pool and a separate verb.** `practicePool()` is the
  bank minus three sets: the questions the daily is scheduled to use within
  `PRACTICE_RESERVE_DAYS` (365), the days you have already answered on this
  device, and the questions you have already practised. So every practice
  question is either more than a year away in the queue or a past daily you
  never played, and it cannot spoil an upcoming puzzle.
- **Practice scores but does not count.** Same bands and thresholds, no points
  (the slot reads `practice`), and it touches neither streak, stats nor the
  shared distribution. A practised question does not come round again.
- **Scoring:** 0.3 / 1 / 2 decades → Bullseye / Close / Ballpark / Off →
  100 / 70 / 40 / 10 points, halved when a hint was taken.

`data.js` holds the fake state and the real scoring function. Question text,
units, hints, sources and archetype guidance are copied verbatim from
`core/questions.js` and `core/Model.js STRATEGIES`.

What is click-through: type a guess (try `2.4e4`), submit to see the scored
result and the shared distribution, guess the answer exactly (`17000`) to earn
the confession question, take a hint before answering to see the half-points
path, go to Practice and work through the four draws — drawn at random, as
`pickPractice()` does — to reach the "nothing left to practise on" state, open
any history row to compare that day, toggle the reminder bell.

What is faked: no scheduling, no storage, no network.

## Departures from the source, on purpose

- **Bottom navigation.** The source is one scrolling column of disclosures;
  Practice, Stats and Guide are collapsed sections in it. Splitting them into
  four destinations keeps today's question at the top of an empty screen.
  Everything inside each destination still uses the source's disclosure
  pattern.
- **Per-band colour** instead of one accent across Bullseye and Close.
- **Display type** on headings and prompts; the source is monospace throughout.
- **A decade ruler** on the result instead of the sentence "Off by 0.15 orders
  of magnitude".
- **Practice states its origin** ("a daily from 4 March, you did not play that
  day" / "due as a daily in 2 years and 4 months"). The source does not say
  where a practice question came from; it is derivable from the same rotation
  the pool is built with.
