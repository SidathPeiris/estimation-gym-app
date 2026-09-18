/* Practice: an extra question, drawn from the pool the daily is not about to
   use. Model.practicePool() defines the pool — the bank, minus the next 365
   days of scheduled dailies, minus the days you have already answered, minus
   the ones you have already practised. So a practice question is either more
   than a year away in the queue or a past daily you never played.

   No points, no streak, no stats, no shared distribution. Separate pool,
   separate verb. The draw itself is random — pickPractice() picks a random
   member of the pool rather than walking it in order. */
function PracticeScreen({ question, result, practised = 0, onAnswer, onNext }) {
  const NS = window.EstimationGymDesignSystem_4a01b0;
  const { QuestionCard, GuessField, ResultCard, Callout, Button, Eyebrow, Chip, FootNote, Icon } = NS;
  const D = window.EG_DATA;
  const q = question;
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(null);

  React.useEffect(() => { setValue(''); setError(null); }, [q && q.id]);

  const submit = (raw) => {
    const scored = D.score(raw, q.answerValue, false);
    if (!scored) { setError('Enter a positive number'); return; }
    setError(null);
    onAnswer(scored);
  };

  const left = D.practiceAvailable - practised;

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-faint)' }}>
          {q ? left.toLocaleString('en-GB') + ' available' : '0 available'}
        </span>
      </div>

      {q ? (
        <>
          <p style={{ margin: '0 0 var(--space-8)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
            A question the daily puzzle has not given you. Scored the same way, but it does not touch your streak,
            your stats, or what other players see.
          </p>

          <QuestionCard
            mode="practice" prompt={q.prompt} asOf={q.asOf}
            archetype={result ? q.archetype : null} answered={!!result}
            badge={!result ? <Chip icon="clock" tone="var(--mode-practice)">{q.origin}</Chip> : null}
          >
            {result ? (
              <ResultCard
                band={result.band} points={0} practice guess={result.guessLabel}
                actual={q.answerLabel} unit={q.unit} decades={result.decades}
              />
            ) : (
              <GuessField value={value} onChange={setValue} onSubmit={submit} unit={q.unit} error={error} />
            )}
          </QuestionCard>

          {result && (
            <>
              <Callout title={'Approach: ' + q.archetype} icon="lightbulb">{q.guidance}</Callout>
              <Callout title="How to think about it" icon="brain" tone="var(--text-muted)">{q.hint}</Callout>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', flexWrap: 'wrap', marginTop: 'var(--space-8)' }}>
                <Button variant="quiet" size="sm" iconAfter="arrow-right" onClick={onNext}>Another question</Button>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-xs)', color: 'var(--text-faint)' }}>
                  <Icon name="check" size={12} /> this one will not come round again
                </span>
              </div>
              <FootNote align="right">Source: {q.source}</FootNote>
            </>
          )}

          <Callout title="Where these come from" icon="info" style={{ marginTop: 'var(--space-10)' }}>
            The next {D.reserveDays} days of daily puzzles are held back, so practice cannot spoil one. What is left is
            everything more than a year away in the queue, plus the days you never played. Questions you have
            practised do not come round again, and neither do ones you have already had as a daily.
          </Callout>
        </>
      ) : (
        <div>
          <p style={{ margin: 0, font: 'var(--type-label)', fontSize: 'var(--text-md)', color: 'var(--text-display)' }}>
            Nothing left to practise on.
          </p>
          <p style={{ marginTop: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
            You have worked through every question the daily puzzle has not used yet. Nothing left to practise on —
            which is quite the achievement.
          </p>
          <Callout title="More arrive with the bank" icon="plus" style={{ marginTop: 'var(--space-7)' }}>
            Questions are only ever appended to the bank, so every one added becomes practisable straight away and
            extends the daily queue by another day. There is a form for suggesting one under Guide.
          </Callout>
        </div>
      )}
    </div>
  );
}
window.PracticeScreen = PracticeScreen;
