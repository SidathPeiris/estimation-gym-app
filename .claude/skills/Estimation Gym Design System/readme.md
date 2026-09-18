# Estimation Gym — Design System

**Estimation Gym is a daily Fermi-estimation puzzle.** Every calendar day
everyone gets the same question — a real-world quantity you have to estimate,
like *"how many piano tuners work in Chicago?"* — and you are scored on
**order-of-magnitude closeness**, not the exact value, because getting within a
factor of ten of a hard question is a genuinely useful skill and getting the
number exactly right is not the point.

No account. No sign-up. Works offline.

This design system holds the brand's visual foundations, the reusable UI
primitives, and recreations of both product surfaces — restyled to be warmer
and less severe, and with the **practice** pool given a screen of its own
rather than a collapsed section at the bottom of the daily.

## Sources this was built from

| Source | What was taken from it |
| --- | --- |
| Codebase `estimation-gym-app/` (attached, read-only) | `app.css` colour and radius tokens, `index.html` screen structure, `core/Model.js` scoring bands / reasoning archetypes / how-to-play copy, `presenter.js` result and stats wording, `core/questions.js` question text, `install/index.html` landing page, `tools/og-card.html` logo geometry |
| GitHub <https://github.com/SidathPeiris/estimation-gym-app> | Same codebase, canonical remote. Worth exploring further — `presenter.js` and `core/Model.js` are where every user-facing string lives |
| GitHub <https://github.com/SidathPeiris/estimation-gym-omarchy> (referenced, not read) | The Omarchy desktop-bar widget. Shares `core/` with the app and must describe a result in identical words |
| Uploaded `uploads/*.png` | Shipped PWA icons and the OG card, copied into `assets/brand/` |
| <https://github.com/lucide-icons/lucide> | The icon set. See ICONOGRAPHY — this is a substitution, flagged below |

Anyone picking this up should read those two repositories directly before
building anything substantial: the product's voice lives in its source strings,
not in a style guide.

## The question system

Every surface has to respect this, so it is documented here rather than only in
`core/Model.js`:

- **One question a day, the same one for everyone.** Day N gets
  `bank[N - SCHEDULE_ORIGIN]`, read straight off an append-only bank of ~1,000
  questions. Adding questions extends the queue; it never re-deals a day
  already played. Answering is idempotent per day — there is no second daily.
- **Practice is a separate pool and a separate verb.** `practicePool()` is the
  bank minus the next 365 days of scheduled dailies, minus the days you have
  already answered, minus the ones you have already practised. So a practice
  question is either more than a year away in the queue or a past daily you
  never played — it cannot spoil an upcoming puzzle.
- **Practice scores but does not count.** Same bands, no points (the slot reads
  `practice`), no streak, no stats, no shared distribution, and a practised
  question never comes round again.
- **Scoring:** 0.3 / 1 / 2 decades → Bullseye / Close / Ballpark / Off →
  100 / 70 / 40 / 10 points, halved when a hint was taken.

## The products

1. **The app** (`ui_kits/app/`) — a PWA at <https://estimationgym.app/>. One
   column, no chrome, installable, fully offline. Today's question, a guess row,
   a scored result, a shared distribution, and collapsible Practice / How to
   play / History / Stats / Suggest sections.
2. **The install page** (`ui_kits/install/`) — a single marketing and
   how-to-install page at `/install/`. The only page in the product that carries
   analytics, and the only growth loop besides the share card.
3. **The Omarchy widget** — a desktop-bar version of the same puzzle, kept in a
   separate repository. Not recreated here; it shares `core/` and must say the
   same things in the same words, so any copy change here has to survive being
   read in a 300px-wide shell bar.

---

# CONTENT FUNDAMENTALS

The voice is the strongest thing this product already has. It is dry, plain,
British, and unusually honest about its own limits. Keep it.

**Person.** Second person for the player ("your streak", "you tend to guess
low"), third person for the app ("the app remembers your timezone"). Never
first-person plural — there is no "we" anywhere in the product, and adding one
would sound like a company.

**Register.** Full sentences, no exclamation marks, no hype. Contractions are
mostly avoided: the source writes "does not", "cannot", "you are" rather than
"doesn't", "can't", "you're". The one place contractions appear is short UI
asides ("doesn't affect your streak"), and they stay rare.

**Casing.** Sentence case everywhere — headings, buttons, labels. Uppercase
only via CSS letterspaced eyebrows (`as of 2025`, `WHAT YOU ARE INSTALLING`).
Band names are the four proper nouns of the game and are always capitalised:
Bullseye, Close, Ballpark, Off.

**Numbers.** Always mono, always formatted the way the Model formats them:
`17,000`, `1.16e6`, `0.15 decades`, `+70 pts`, `×10ⁿ`. Multipliers use `×` or
`x` as the source does (`within 10x`, `low by about 3.8×`). Never round a value
in copy that the Model prints exactly.

**Honesty as a tone.** The product routinely tells you when a number is not
worth trusting, and that is a feature of the writing:

> "1 person has answered this one so far - too few to compare against yet."
>
> "Play a few more days and this will tell you which kinds of question you are
> best and worst at."
>
> "The answer depends on the measuring scale, which is the classic coastline
> paradox."

**Teach, do not flatter.** Feedback names the method, not the player:
"Approach: Stock equals flow times lifetime", "You tend to guess low, by about
3.8×. Knowing your direction of error is the part you can actually correct."
There is no "Great job!" anywhere in this product and there should not be.

**Jokes are dry and small.** The confession dialog is the whole comedic budget:
title "Hold on.", buttons "Yes, I peeked" / "No, I am just that good", and the
tally reads "3 people have owned up to looking this one up." Nothing winks
harder than that.

**Explain restrictions without blaming the player.** "It has to be Safari.
Chrome and Firefox on iPhone cannot add apps to the home screen — that is an
Apple restriction, not a fault in the game."

**Reassure about privacy in specifics, not slogans.** The source lists exactly
what leaves the device, item by item, and says "It is a reminder, not a nag."

**Emoji.** Used sparingly and only in the source's own places: 🔔 for the
reminder in running copy, and 📱 / 🤖 / 💻 as section markers on the install
page. The redesign replaces those three section markers with lucide icons; do
not add emoji anywhere new, and never use emoji in the game itself.

**Punctuation.** Em dashes are used, but as the source uses them — one per
sentence at most. Interpuncts separate metadata: `Streak 6 · Best 14`,
`12 played · 780 pts`, `+35 pts · hint`. Summaries inside collapsible headers
are lowercase with no full stop: `scores half points`, `doesn't affect your
streak`.

**Question text is content, not copy.** Prompts, units, hints and sources come
from `core/questions.js` verbatim. Never reword a question to fit a layout.

---

# VISUAL FOUNDATIONS

## Where the look comes from

The source app is a Tokyo Night terminal palette rendered entirely in
monospace, with no shadows, no animation and no imagery. It reads as a precise
instrument — which is right — but flat, which is what this redesign addresses.
The move is: **keep the palette and the restraint, add typographic contrast,
give each scoring band its own colour, and let things arrive rather than
appear.**

## Colour

- **Ground.** `#1a1b26` page, `#1f2335` cards, `#252a41` raised, `#13141c` at
  the very bottom of the page gradient. Dark is the default; a light theme
  exists as the opt-in class `.theme-light` (the source switches on
  `prefers-color-scheme`). Note its structure: `.theme-light` re-declares
  **both** the base ramp and the whole semantic alias layer. It has to — a custom
  property is substituted where it is *declared*, so `--surface-page:
  var(--ink-900)` on `:root` computes to the literal dark hex and inherits down
  as that literal, and redefining `--ink-900` in a narrower scope never reaches
  it. **Add an alias to `:root` and you must add it to `.theme-light` too**, or
  it silently stays dark. `guidelines/theme-light.card.html` renders both side
  by side so a regression shows.
- **Ink.** Four weights only: display `#e8edff`, body `#c0caf5`, secondary
  `#8d96b8`, muted `#7681a8`, with `#565f89` for genuine small print. Body text
  never drops below `--text-muted` on card grounds.
- **Accent.** `#7aa2f7`, with `#5872ae` and `#414868` as its ring tones — those
  two exist because they are the middle and outer rings of the logo.
- **Bands.** Bullseye green `#9ece6a`, Close blue `#7aa2f7`, Ballpark yellow
  `#e0af68`, Off red `#f7768e`. *(Source shares the accent across Bullseye and
  Close and uses plain foreground for Ballpark; the split is deliberate — a
  shared result card should be legible without reading the label.)*
- **Modes.** The product has exactly two: the daily question (accent blue) and
  practice (cyan `#7dcfff`). Practice is visibly a different mode — its own
  eyebrow colour and card rule — because it earns no points and touches no
  stats. There is no third mode and no topic split: one question a day, the
  same one for everyone.
- **Outside the bands.** Four tokens sit apart from the band hues because they
  are not scores: `--result-guess` (`#ff6900`) for what you said and
  `--result-actual` (`#edd800`) for what it actually was, so the pair reads as a
  comparison; `--streak-best` (`#8b9cf0`) for your best streak and
  `--reminder-bell` (`#ff8000`) for the daily nudge. All four have darker
  light-theme values.
- **Tinted fills, not solid ones.** The source's recipe is a colour at 8–16%
  over the page with a border of the same colour at 45–55%. Every result card,
  soft button, callout and pill follows it. Only one thing on a screen is ever
  solid accent: the install page's Play now.

## Type

- **Display: Bricolage Grotesque** (700/800, tracking −0.03em) for the
  wordmark, headings and question prompts. It carries the
  friendliness the brief asked for without becoming cute.
- **Body: Schibsted Grotesk** (400/500, 1.5–1.6 line height) for prose, labels
  and explanations.
- **Mono: JetBrains Mono** with `tabular-nums` for everything numeric — guesses,
  points, decades, dates, streaks, `×10ⁿ`. This is the strongest single carrier
  of the brand: if it is a number, it is mono.
- Sizes at the small end are the source's own rem values (0.72 / 0.75 / 0.8125
  / 0.875 / 1 / 1.0625 / 1.1875 / 1.5rem), not a rounded scale.

### The three faces, and where they came from

The source app ships **no font binaries**: it asks for
`ui-monospace, "Cascadia Mono", "JetBrains Mono", Menlo, Consolas` and lets the
device pick, and the OG card falls back to `Segoe UI Variable Display`. Three
Google Fonts are pinned here instead, **confirmed and settled**, so the brand
renders identically on every machine:

| Role | Pinned here | Relationship to the source |
| --- | --- | --- |
| Mono | **JetBrains Mono** | The first named preference in `app.css` — a true match, not a substitution |
| Body | **Schibsted Grotesk** | Replaces `Segoe UI` / system UI, which rendered differently on every device |
| Display | **Bricolage Grotesque** | An addition — the source has no display face, and the all-mono setting is what made it read flat |

They load from the Google Fonts CDN in `tokens/fonts.css`. Treat these three as
the brand's type, not as placeholders. To self-host later, swap the `@import` in
`tokens/fonts.css` for `@font-face` rules pointing at the binaries — nothing
else in the system needs to change, because every surface reads
`--font-display` / `--font-sans` / `--font-mono` rather than naming a family.

## Backgrounds and texture

No photography, no illustration, no gradient mesh. Two things only:

1. A **radial ring wash** in the accent at 15% → 0%, pinned behind the top of
   the page (`--ring-wash`). It is the logo, blown up and nearly invisible.
2. A **hairline ring watermark** available for cards that need texture: one
   10px-stroke circle at 7% opacity, cropped by the card's top-right corner.

Both derive from the bullseye. Nothing else decorates a surface.

## Cards, borders and shadows

Hairline borders do the work: `1px solid #2f3550` on `#1f2335`, radius 12.
Shadows are optional and nearly imperceptible — `--shadow-card` is a 10px
spread at 28px blur, dropped to almost nothing, plus a 3% inset highlight. The
source has no shadows at all, so if in doubt, leave them off. Never use a
coloured left border *and* rounded corners on a full card; the left-rule
treatment belongs to `Callout` only (and comes straight from `app.css`
`.strategy`, which rounds the right two corners only).

## Radii

4 / 6 / 8 / 10 / 12 / 16 / 20 / 999. Callouts 6, small controls and inputs
8–10, cards 12, media 16, pills 999. Nothing in this product is rounder than
20px.

## Spacing and layout

One 640px column, 20px side padding, `env(safe-area-inset-*)` respected top and
bottom — the app is installed to a home screen more often than not. The install
page narrows to 34rem. Sections are separated by a 28px gap and a hairline rule,
which is how the source stacks Practice / How to play / History / Stats /
Suggest. Controls are 52px tall; nothing tappable is under 44px. Only the
bottom navigation is fixed.

## Transparency and blur

Almost never. The one blur in the system is the bottom navigation's
`backdrop-filter: blur(14px)` over `--surface-veil` (72% page colour), because
content scrolls underneath it. Everything else is opaque or a flat tint. Do not
use glass panels.

## Animation

Short, eased-out, and only on things that have just arrived:

- 140ms on control hovers and the disclosure chevron.
- 220ms `eg-rise` (6px up, fade) when a section opens; 220ms `eg-pop` on a
  scored result, with the one spring in the system (`cubic-bezier(.34,1.4,.64,1)`).
- 360ms `eg-bar-grow` — bars scale from the left, never fade in.
- 520ms on today's card.
- `eg-ring-out` (a ring expanding outward from the mark) is reserved for waiting
  and celebration. Never idle.

`prefers-reduced-motion` zeroes every duration.

## Interaction states

- **Hover:** borders brighten from `--border-default` to the tone at 45%, text
  from muted to body, and tinted fills gain ~4 points of opacity. Nothing
  changes size.
- **Press:** `translateY(1px)`. That is the source's press and it is the whole
  press language — no scale, no shadow, no ripple.
- **Focus:** `0 0 0 3px` of the accent at 25%, with the border going solid
  accent. Straight from `app.css`.
- **Disabled:** 45% opacity, `not-allowed`. No greyscale filter.
- **Answered:** the state, not a disabled control — the guess row is replaced by
  the result, and the card's mode rule dims to 45%.

---

# ICONOGRAPHY

**What the source has.** No icon system at all. The app uses unicode glyphs
inline — `▸` for disclosure chevrons, `🔔` for the reminder, `×10ⁿ` built from
`&times;10<sup>n</sup>`, `⚠️` on the migration banner, and `📱 🤖 💻` as install
page section markers. The only real assets are the PWA icon PNGs and the OG
card, all of which are the bullseye on a plate.

**What this system uses — flagged substitution.** A friendlier app
needs a real icon set, so **lucide** (2px stroke, 24px grid, rounded caps) is
substituted and vendored: 42 SVGs in `assets/icons/`, chosen for the product's
actual vocabulary. Lucide's weight and roundness sit closest to the source's
hairline-border, rounded-corner drawing. **Flagging it plainly: this is an
addition, not something the codebase had.** If the product has a preferred icon
set, replacing it is a matter of dropping different SVGs into `assets/icons/`
under the same names.

**How icons are rendered.** `Icon` fetches the SVG once, caches it, and inlines
it, so the glyph is real DOM and inherits `currentColor` — that survives being
screenshotted, printed and re-themed. Set `window.EG_ICON_BASE` per page.

**One quirk worth knowing.** The `.svg` files in `assets/icons/` each carry a
~7.7KB C2PA signing manifest in a `<metadata>` block — not present in lucide
upstream; it is added on write and cannot be stripped on disk here. Left inline
it put ~123KB of base64 into a single screen's DOM and made `textContent`
useless (a button labelled "Copy" read 7,695 characters). `Icon` therefore
strips `<metadata>…</metadata>` once per URL before caching, taking a glyph from
8,089 to 353 characters. **If you re-copy or add icons, keep that strip** — or
the bloat returns on every screen and every specimen card.

**Rules.** 12–19px next to text, never larger than the text's cap height by
much; muted by default, tone-coloured only when the icon carries state (band,
mode, streak flame, live reminder bell). Icons never appear alone as the only
label except in `IconButton`, which requires a `label`. `×10ⁿ` stays typeset
text, not an icon — it is a mathematical notation, and drawing it would make it
less legible.

**Brand assets.** `assets/logo.svg` (three concentric rings, from
`tools/og-card.html` geometry), `assets/logo-mono.svg` (same, `currentColor`),
and `assets/brand/` — `icon-192.png`, `icon-512.png`, both maskable variants,
`badge-96.png` for the reminder, `og-card.png` for link previews, and
`tour-poster.png` for the video still. There is no wordmark file: the name is
set in Bricolage Grotesque, with "Gym" in the accent, which is how the OG card
does it.

---

# Index

## Root

| File | What it is |
| --- | --- |
| `readme.md` | This guide |
| `SKILL.md` | Agent-skill front matter, for use in Claude Code |
| `github.md` | Source-repo association and sync record |
| `styles.css` | The one stylesheet consumers link. `@import` lines only |
| `thumbnail.html` | The system's homepage tile |

## Tokens — `tokens/`

`fonts.css` (webfont imports) · `colors.css` (base ramp, semantic aliases,
bands, modes, `.theme-light`) · `typography.css` (families, scale, composed
roles) · `spacing.css` (ladder + layout) · `radius.css` · `elevation.css`
(shadows, rings, washes, ring wash) · `motion.css` (durations, easings,
keyframes) · `base.css` (reset, page ground, link colours, `.eg-app`,
`.eg-icon`).

## Components — `components/`

| Directory | Exports |
| --- | --- |
| `brand/` | `Brandmark`, `Wordmark`, `Icon` |
| `forms/` | `Button`, `IconButton`, `ExponentButton`, `GuessField`, `TextField` |
| `game/` | `QuestionCard`, `ResultCard`, `BandTag`, `PointsTag`, `ScoringTable`, `StepList`, `ShareCard`, `BandRun`, `BANDS`, `SHARE_EMOJI`, `bandColour` |
| `data/` | `BandBars`, `StatTile`, `HistoryRow`, `ArchetypeRow` |
| `feedback/` | `Callout`, `Banner`, `FootNote` |
| `display/` | `Chip`, `Eyebrow`, `StreakBadge` |
| `navigation/` | `AppHeader`, `ReminderToggle`, `Disclosure` |

Each directory has at least one `*.card.html` showing its states, and each
component a `.d.ts` props contract and a `.prompt.md` usage note. Cards are
kept under ~400px tall and their `@dsCard viewport` height is measured, not
guessed — a declared height that undershoots silently clips the specimen in the
Design System tab, so split a card rather than declaring a tall one.

### Component inventory, and where it came from

Every family above has a counterpart in the source app: `Button` (the Go /
Share / export / install buttons), `ExponentButton` (`.exp`), `GuessField`
(`#guess-form`), `TextField` (`.restore-input`, the suggestion form),
`QuestionCard` (`.asof` + `.prompt`), `ResultCard` (`.result`), `BandTag` /
`PointsTag` (`.band`, `.points`), `ScoringTable` (`.howto-scoring`), `BandBars`
(`.bar-row`), `StatTile` (`.stats-summary` / `.stats-footer` figures),
`HistoryRow` (`.history-row`), `ArchetypeRow` (`.arch-row`), `Callout`
(`.strategy`, `.calibration`), `Banner` (`.confess`, `.moved`), `FootNote`
(`.build`, `.source-offer`), `Chip` (install page `.chip`), `Eyebrow` (`.asof`,
`.lbl`), `StreakBadge` (`.streak`), `AppHeader` (`.hero`), `ReminderToggle`
(`.remind`), `Disclosure` (`.stats-toggle`), `ShareCard` / `BandRun`
(`presenter.js shareText` / `shareRun`).

**Intentional additions**

- `Icon` — a wrapper for the vendored lucide set. The source has no icon system;
  see ICONOGRAPHY.
- `Wordmark` — a lockup component, because the name-plus-mark arrangement is
  repeated in three places in the source but written out each time.

## UI kits — `ui_kits/`

These are the reference recreations — read them to see how the pieces go
together. To *start* a design, use a template below instead.

- `app/` — the PWA, four destinations, click-through. `README.md` maps each
  screen to the source files it recreates, documents how the daily queue and
  the practice pool work, and lists the deliberate departures.
- `install/` — the install and landing page, copy verbatim.

## Templates — `templates/`

What a consuming project copies to start something. Each is a Design Component,
so the markup is directly click-editable and the design-system components are
live imports rather than pasted code.

| Template | Entry | What it gives you |
| --- | --- | --- |
| Daily question | `templates/daily-question/DailyQuestion.dc.html` | The daily puzzle screen, working: type a guess, get a real band and score, the decade ruler, the shared distribution. Tweaks for the answer value, the reasoning archetype, and whether the distribution shows |
| Install page | `templates/install-page/InstallPage.dc.html` | The install and landing page, all copy verbatim and all of it editable in place |

Each folder has its own `ds-base.js`, which is the one file to edit when the
template moves into a consuming project — point its `base` at the bound
`_ds/<folder>` tree and everything else resolves.

## Guidelines — `guidelines/`

22 specimen cards behind the Design System tab: colour (surfaces, text, accent,
bands, status, result & personal, light theme × 2), type (display, body, mono,
scale, eyebrows), spacing (ladder, layout column), and brand (radii, elevation,
motion, logo, app icons).
