Small read-only labels.

```jsx
<Chip icon="wifi-off">works offline</Chip>
<Chip tone="var(--mode-practice)" icon="dumbbell">practice</Chip>
<Eyebrow>as of 2025</Eyebrow>
<StreakBadge streak={6} best={14} size="lg" />
```

Chips state facts ("no account", "works offline") and never take a click — if it acts, it is a Button. Eyebrow copy is lowercase-sentence in source and uppercased by CSS.
