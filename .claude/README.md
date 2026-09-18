# .claude/

Tooling and design source for working on this app. **None of it is part of the
deployed site** — `.assetsignore` and `_config.yml` both exclude this directory,
and `pages.test.js` fails the build if either one stops doing so.

| | |
| --- | --- |
| `launch.json` | Dev server config, so the app can be previewed without remembering the port. Equivalent to `npm run serve`. |
| `skills/Estimation Gym Design System/` | The design system: tokens, components, icons, brand assets and the guide that explains them. |

## Why the design system is committed here

`app.css` opens with the token block lifted from it, `DEVELOPING.md` documents
the two traps in those tokens, and several comments across the codebase refer to
its components by name — `QuestionCard`, `ResultCard`, `Disclosure`, `Callout`.
Kept outside the repository, every one of those references points at something
that only exists on one machine.

It is reference material, not a build input. Nothing imports it, no script reads
it, and changing it changes nothing until someone applies it by hand. The
components are React and this app is vanilla JS with no build step, so they are
read for their exact paddings, radii, colours and states rather than consumed.
`readme.md` inside it is the guide worth reading first.

## Licence

This repository is AGPL-3.0-or-later, and committing the design system here
places it under the same licence. That is deliberate. The two halves of a
project should not disagree about their terms, and the app it describes has been
open from the start.

One flagged substitution, restated because it is easy to miss: the icons are
[lucide](https://github.com/lucide-icons/lucide), under the ISC licence, and
they are an addition rather than something the original app had. The source used
unicode glyphs.
