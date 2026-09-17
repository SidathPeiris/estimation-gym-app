# Fonts

The three faces the design system pins, self-hosted so the app makes no
third-party requests and renders in its own type on a cold, offline launch.

| File | Family | Axes | Source |
| --- | --- | --- | --- |
| `bricolage-grotesque-latin.woff2`, `-latin-ext` | Bricolage Grotesque | `opsz` 12–96, `wght` 400–800 | [Google Fonts](https://fonts.google.com/specimen/Bricolage+Grotesque) |
| `schibsted-grotesk-latin.woff2`, `-latin-ext` | Schibsted Grotesk | `wght` 400–700 | [Google Fonts](https://fonts.google.com/specimen/Schibsted+Grotesk) |
| `jetbrains-mono-latin.woff2`, `-latin-ext` | JetBrains Mono | `wght` 400–700 | [Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono) |

All three are licensed under the [SIL Open Font License 1.1](https://openfontlicense.org/),
which permits bundling and redistribution with this app. The OFL is a separate
licence from the app's AGPL-3.0 and applies only to these files.

Each is a **variable** font covering its whole weight range in one file, so
adding a weight to the stylesheet costs no extra request. Only the `latin` and
`latin-ext` subsets are kept; a character outside those ranges falls back to
the device face named after the family in `--font-display` / `--font-sans` /
`--font-mono`, which is a graceful miss rather than a blank glyph.

The `@font-face` rules live at the top of `app.css`, and the install page
repeats them in its own `<style>` block because it does not link `app.css`.
Both point at these same files, so the browser downloads each once.

## Replacing or adding a weight

These came from the Google Fonts CSS API, which serves the subset files above
and the `unicode-range` declarations copied alongside them. To refresh them,
request the family with a weight *range* rather than fixed weights so the
variable file is returned:

```
https://fonts.googleapis.com/css2?family=Schibsted+Grotesk:wght@400..700&display=swap
```

Fetch that with a current browser's user agent — the API serves older formats
to user agents it does not recognise — then download the `latin` and
`latin-ext` `woff2` URLs it names.

Anything added here has to be added to the `ASSETS` list in `sw.js` too, or it
will not be there offline.
