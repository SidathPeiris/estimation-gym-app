What a player posts after answering. Opens from the Share button on a scored result.

```jsx
<ShareCard
  date="Tue 16 Sep" band="Close" decades={0.42} streak={6}
  run={['Bullseye','Close','Ballpark',null,'Off','Close','Close']}
  onShare={nativeShare} onCopy={copy} copied={copied} />

<BandRun run={['Close', null, 'Bullseye']} size={22} />
```

**Never add the guess, the answer or the question text.** `presenter.test.js` asserts all three are absent — a result gets posted before other people have played, and leaking any of them spoils that day for everyone who sees it. The band and the decade figure are the whole payload.

The run is seven *calendar* days, not seven played days, so a missed day shows as an empty square. Leading gaps are trimmed by the component. The mono block is shown deliberately: people should see exactly what they are about to paste.
