repo: SidathPeiris/estimation-gym-app
branch: main

## Last sync

date: 2026-09-17T11:32:04Z

### Updated in this project

- Built the design system from the attached codebase: tokens, 20 components, two UI kits.
- Colour ramp, radii and spacing lifted from `app.css`; scoring bands and copy from `core/`.
- Vendored 39 lucide icons (`assets/icons/`) — the source has no icon set.
- Practice is now its own screen, following `practicePool()`: the 365-day reserve, past unplayed dailies, no points.
- Two templates consuming projects can copy: the daily question screen and the install page.

## Screen map

| Screen / file | Built from |
| --- | --- |
| `ui_kits/app/TodayScreen.jsx` | `index.html` (hero, `#guess-form`, `#result`, `#dist`), `presenter.js` (`resultView`, `distributionView`, `percentileView`) |
| `ui_kits/app/StatsScreen.jsx` | `index.html` (`#stats`, `#arch`, `#history`), `presenter.js` (`statsView`, `archetypeView`, `historyView`) |
| `ui_kits/app/GuideScreen.jsx` | `index.html` (`#howto`, `#suggest`), `core/Model.js` (`HOW_TO_PLAY`, `STRATEGIES`) |
| `ui_kits/app/PracticeScreen.jsx` | `index.html` (`#practice`), `app.js` (`nextPractice`, `submitPractice`, `renderPractice`), `core/Model.js` (`practicePool`, `pickPractice`, `PRACTICE_RESERVE_DAYS`) |
| `ui_kits/app/data.js` | `core/questions.js`, `core/Model.js` (`STRATEGIES`, `BAND_POINTS`) |
| `templates/daily-question/DailyQuestion.dc.html` | `index.html` (hero, `#guess-form`, `#result`, `#dist`), `core/Model.js` (`BAND_POINTS`, band thresholds) |
| `templates/install-page/InstallPage.dc.html` | `install/index.html` |
| `ui_kits/install/InstallPage.jsx` | `install/index.html` |
| `tokens/colors.css`, `tokens/radius.css`, `tokens/spacing.css` | `app.css` `:root`, `tools/og-card.html`, `install/index.html` |
| `assets/logo.svg` | `tools/og-card.html` `.mark` geometry |
| `assets/brand/*.png` | `icons/*.png`, `install/media/tour-poster.png` |
