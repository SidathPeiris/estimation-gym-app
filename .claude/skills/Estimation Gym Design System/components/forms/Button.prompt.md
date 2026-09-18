Buttons, in the four weights the app uses. `soft` is the default and the one on screen most.

```jsx
<Button variant="soft" size="lg">Go</Button>
<Button variant="soft" block icon="share-2">Share result</Button>
<Button variant="solid" as="a" href="/">Play today's question</Button>
<Button variant="quiet" size="sm" icon="copy">Copy my history</Button>
<IconButton icon="settings" label="Settings" />
<ExponentButton onClick={insertE} />
```

Re-tone rather than re-style: `tone="var(--band-bullseye)"` gives a green soft button for a celebratory action. One `solid` per screen at most. Press state is the source's 1px nudge down — do not add scale or shadow.
