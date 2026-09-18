Past days, newest first, and the archetype breakdown under Stats.

```jsx
<ol style={{listStyle:'none'}}>
  <HistoryRow date="Mon 15 Sep" band="Bullseye" guess="1.2e6" actual="1.16e6" decades={0.01} comparable />
</ol>
<ArchetypeRow label="People times per-person rate" played={7} median={0.42} />
```

Never print the question text in a history row — it is not stored, and guessing it from the date would eventually name the wrong question. Rows are clickable only when `comparable`. Practice never appears in history.
