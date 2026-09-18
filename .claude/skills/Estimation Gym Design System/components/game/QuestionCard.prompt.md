The hero of every screen: one question and the row you answer it in.

```jsx
<QuestionCard prompt="How many bacteria live on an average mobile phone screen?" date="Tue 16 Sep" asOf={2025}>
  <GuessField unit="bacteria" onSubmit={score} />
</QuestionCard>

<QuestionCard mode="practice" prompt="How many stitches are in a pair of jeans?">
  <GuessField unit="stitches" onSubmit={score} />
</QuestionCard>
```

Question text is content, not copy — show it exactly as the bank stores it. Daily cards carry the calendar date (the day number is meaningless to a new player); practice cards carry no date, because a practice question is not scheduled for anyone. One question card per screen, and never more than one daily a day.
