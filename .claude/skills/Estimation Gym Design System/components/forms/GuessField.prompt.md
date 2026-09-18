The answer row for a question, and the labelled inputs everywhere else.

```jsx
<GuessField value={guess} onChange={setGuess} onSubmit={score} unit="bacteria" error={err} />
<TextField label="Question" placeholder="How many bricks are in the Great Wall of China?" />
<TextField label="Answer" numeric placeholder="3.9e9" trailing={<ExponentButton onClick={insertE} />} />
<TextField label="How would you work it out?" hint="(optional)" multiline rows={3} />
```

Guesses are always mono and always accept scientific notation. Validation is one short sentence under the row, never a modal; the source's wording is "Enter a positive number".
