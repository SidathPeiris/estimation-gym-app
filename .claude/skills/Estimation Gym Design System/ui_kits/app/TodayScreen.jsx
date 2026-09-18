/* Today: the one question in the queue for this calendar day, the same one
   everybody gets. Answered and scored inline, then the shared distribution.
   This is the screen the source app is, restyled. */
function TodayScreen({ answer, streak = 0, onAnswer, onPractice }) {
  const NS = window.EstimationGymDesignSystem_4a01b0;
  const { QuestionCard, GuessField, ResultCard, Callout, Banner, Button, BandBars, Chip, Eyebrow, Icon, FootNote, ShareCard } = NS;
  const D = window.EG_DATA;
  const q = D.daily;
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(null);
  const [hint, setHint] = React.useState(false);
  const [sharing, setSharing] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  /* null until an exact-to-the-digit guess earns the question, then 'open'
     until it is answered one way or the other. */
  const [confess, setConfess] = React.useState(null);

  const submit = (raw) => {
    const scored = D.score(raw, q.answerValue, hint);
    if (!scored) { setError('Enter a positive number'); return; }
    setError(null);
    if (Number(raw) === q.answerValue) setConfess('open');
    onAnswer(scored);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
        <Eyebrow icon="users">everyone gets this one today</Eyebrow>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-faint)', textTransform: 'capitalize' }}>
          <span style={{ color: 'var(--text-display)' }}>one a day</span>
        </span>
      </div>

      <QuestionCard
        prompt={q.prompt} date={D.today} number={D.puzzleNumber} asOf={q.asOf}
        archetype={answer ? q.archetype : null} answered={!!answer}
      >
        {answer ? (
          <ResultCard
            band={answer.band} points={answer.points} guess={answer.guessLabel}
            actual={q.answerLabel} unit={q.unit} decades={answer.decades} assisted={answer.assisted}
          >
            <Button variant="soft" block icon="share-2" onClick={() => setSharing(!sharing)}>
              {sharing ? 'Hide share card' : 'Share result'}
            </Button>
            <FootNote align="right">Source: {q.source}</FootNote>
          </ResultCard>
        ) : (
          <GuessField value={value} onChange={setValue} onSubmit={submit} unit={q.unit} error={error} />
        )}
      </QuestionCard>

      {answer && sharing && (
        <ShareCard
          style={{ marginTop: 'var(--space-8)' }}
          date={D.today} band={answer.band} decades={answer.decades}
          streak={streak} assisted={answer.assisted}
          run={D.shareRun.slice(0, -1).concat([answer.band])}
          url="estimationgym.app"
          copied={copied}
          onCopy={() => setCopied(true)}
          onShare={() => setCopied(false)}
        />
      )}

      {confess === 'open' && (
        <Banner
          title="Hold on." icon="circle-alert"
          style={{ marginTop: 'var(--space-9)' }}
          actions={<>
            <Button variant="soft" size="sm" onClick={() => setConfess('yes')}>Yes, I peeked</Button>
            <Button variant="quiet" size="sm" onClick={() => setConfess('no')}>No, I am just that good</Button>
          </>}
        >
          You got it exactly right — {q.answerLabel} {q.unit}, to the digit. Either that is the finest estimating we
          have ever seen, or you found the answers in the code. Which was it?
        </Banner>
      )}

      {!answer && !hint && (
        <button type="button" onClick={() => setHint(true)} style={{
          display: 'flex', width: '100%', alignItems: 'baseline', justifyContent: 'space-between',
          gap: 'var(--space-5)', marginTop: 'var(--space-6)', padding: 0,
          background: 'none', border: 0, color: 'inherit', cursor: 'pointer', textAlign: 'left'
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, font: 'var(--type-label)', fontSize: 'var(--text-base)', color: 'var(--text-display)' }}>
            <Icon name="lightbulb" size={15} color="var(--accent)" /> Hint
          </span>
          <span style={{ font: 'var(--type-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textTransform: 'capitalize' }}>scores half points</span>
        </button>
      )}

      {(hint || answer) && (
        <Callout title={'Approach: ' + q.archetype} icon="lightbulb">{q.guidance}</Callout>
      )}

      {answer && (
        <>
          <Callout title="How to think about it" icon="brain" tone="var(--text-muted)">{q.hint}</Callout>
          <div style={{
            marginTop: 'var(--space-9)', padding: 'var(--space-7) var(--space-8)',
            background: 'var(--surface-card)', border: '1px solid var(--border-default)',
            borderRadius: 'var(--radius-xl)'
          }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
              <span style={{ font: 'var(--type-label)', fontSize: 'var(--text-base)', color: 'var(--text-display)' }}>How everyone did</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>789 answered</span>
            </div>
            <BandBars rows={D.distribution} mine={answer.band} showTally={false} />
            <p style={{ margin: 'var(--space-6) 0 0', fontSize: 'var(--text-sm)', color: 'var(--accent)' }}>
              Closer than 61% of the 788 others who answered.
            </p>
            {confess === 'yes' && (
              <p style={{ margin: 'var(--space-4) 0 0', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                4 people have owned up to looking this one up.
              </p>
            )}
          </div>

          <div style={{
            marginTop: 'var(--space-10)', paddingTop: 'var(--space-8)',
            borderTop: '1px solid var(--border-default)'
          }}>
            <p style={{ font: 'var(--type-label)', fontSize: 'var(--text-base)', color: 'var(--text-display)' }}>
              That is today's question done.
            </p>
            <p style={{ margin: 'var(--space-3) 0 var(--space-6)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
              A new one arrives tomorrow, the same one for everybody. If you want another go now, practice draws from
              questions the daily has not given you — it earns no points and does not touch your streak.
            </p>
            <Button variant="quiet" size="sm" icon="dumbbell" onClick={onPractice}>Practice a question</Button>
          </div>
        </>
      )}
      {!answer && (
        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap', marginTop: 'var(--space-10)' }}>
          <Chip icon="users" style={{ textTransform: 'capitalize' }}>no account</Chip>
          <Chip icon="wifi-off" style={{ textTransform: 'capitalize' }}>works offline</Chip>
          <Chip icon="lock" style={{ textTransform: 'capitalize', textAlign: 'justify' }}>nothing leaves your device</Chip>
        </div>
      )}
    </div>
  );
}
window.TodayScreen = TodayScreen;
