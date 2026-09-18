---
name: estimation-gym-design
description: Use this skill to generate well-branded interfaces and assets for Estimation Gym, either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, assets, and UI kit components for protoyping.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files.
If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view. If working on production code, you can copy assets and read the rules here to become an expert in designing with this brand.
If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

## What is in here, and what to use it for

- `readme.md` — the design guide. Read this first. Content fundamentals (voice), visual foundations, iconography, and the question-system rules every surface must respect.
- `styles.css` + `tokens/` — the real tokens. **Drop these into the app as-is.** `styles.css` is `@import` lines only; everything resolves from it.
- `assets/` — logo SVGs, PWA icons, the OG card, 39 lucide glyphs.
- `components/` — React primitives with `.d.ts` props contracts and `.prompt.md` usage notes. These are the source of truth for how a thing should look; read them and lift exact values.
- `ui_kits/` — full-screen recreations of the app and the install page, for reference.
- `templates/` — `.dc.html` starter files. **These only run inside Omelette**, not in a normal repo; read them for structure, do not copy them into the app.

## Applying this to the real app

The source app (`SidathPeiris/estimation-gym-app`) is vanilla JS with a single
`app.css` — no build step, no React. So:

1. **Tokens transfer directly.** Replace `app.css`'s `:root` block with
   `styles.css` + `tokens/`. That alone moves the app most of the way.
2. **Components do not transfer as code.** They are React; the app is not.
   Read each `.jsx` for its exact paddings, radii, colours and states, and write
   the equivalent CSS against the tokens.
3. **Never restyle away from the source's behaviour.** The question system, the
   scoring thresholds, the practice pool rules and the share-text format are all
   documented in `readme.md` — they are constraints, not suggestions.
