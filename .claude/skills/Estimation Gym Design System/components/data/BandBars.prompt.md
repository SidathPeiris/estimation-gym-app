The histogram behind Stats and behind "How everyone did".

```jsx
<BandBars rows={[{band:'Bullseye',tally:3,fraction:0.25},{band:'Close',tally:6,fraction:0.5},
  {band:'Ballpark',tally:2,fraction:0.17},{band:'Off',tally:1,fraction:0.08}]} mine="Close" />
<StatTile label="Best streak" value="14" sub="current 6" />
```

Pass `mine` on the shared distribution so a player can find themselves; leave it off for lifetime stats. Use `showTally={false}` for percentages when the sample is other people. Bars are always band-coloured — never a single accent.
