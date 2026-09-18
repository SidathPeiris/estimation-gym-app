# Install page UI kit

A recreation of <https://estimationgym.app/install/> (source:
`install/index.html`), restyled against this design system.

`InstallPage.jsx` — one file, one column, 34rem wide, matching the source's
`main { max-width: 34rem }`. All copy is verbatim: the tagline, the five
install steps for iOS, the Safari restriction note, the Android and desktop
paths, the jellybean demo (deliberately not a real question — `install.test.js`
fails if it ever becomes one), the video captions, and the "why bother"
section.

Departures from the source, on purpose:

- **Section headings use lucide icons** where the source uses 📱 / 🤖 / 💻
  emoji. The rest of the page follows the source exactly.
- The tour video is shown as its poster still (`assets/brand/tour-poster.png`);
  the real page plays `media/tour.mp4`.
- **Play now** links to the app kit rather than to `../`.
