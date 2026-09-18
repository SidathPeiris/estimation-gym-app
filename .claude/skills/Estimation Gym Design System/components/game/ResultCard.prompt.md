Shown the moment a day is scored, in place of the guess row.

```jsx
<ResultCard band="Bullseye" points={100} guess="24,000" actual="17,000" unit="bacteria" decades={0.15}>
  <Button variant="soft" block icon="share-2">Share result</Button>
</ResultCard>
```

The ruler is capped at three decades — past that the bar is full and the number does the talking. Format numbers before passing them in; the card never rounds. Tone comes from the band, so never override the border or background.
