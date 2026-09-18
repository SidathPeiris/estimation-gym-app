How a result is named. Bullseye / Close / Ballpark / Off, each with its own hue so a shared card reads without the label.

```jsx
<BandTag band="Bullseye" />
<BandTag band="Ballpark" variant="dot" assisted />
<PointsTag points={70} band="Close" size="lg" />
```

Never re-order or rename the bands — they come from `core/Model.js` and the Omarchy widget shows the same four. `variant="plain"` when the row is already dense (history, scoring table). Points always carry the `+` and always sit in mono.
