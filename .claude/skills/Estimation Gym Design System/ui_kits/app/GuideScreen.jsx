/* Guide: how to play, the scoring key, the reminder explainer, and the
   suggest-a-question form. All copy is the source app's own. */
function GuideScreen() {
  const NS = window.EstimationGymDesignSystem_4a01b0;
  const { Disclosure, StepList, ScoringTable, Callout, TextField, ExponentButton, Button, Eyebrow, FootNote, ReminderToggle } = NS;
  const D = window.EG_DATA;
  const [on, setOn] = React.useState(false);
  return (
    <div>
      <Eyebrow icon="info" style={{ marginBottom: 'var(--space-7)' }}>how it works</Eyebrow>
      <StepList steps={D.howToPlay} />
      <p style={{ margin: 'var(--space-7) 0 var(--space-5)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
        Being within a factor of ten of a hard question is the skill worth having, so scoring is measured in powers of
        ten rather than percentages.
      </p>
      <ScoringTable />
      <Callout title="Hints never break your streak" icon="lightbulb">
        Stuck? Hint tells you how to attack that shape of problem without giving anything away about the answer. It
        halves the day's points, but it never breaks your streak.
      </Callout>

      <Disclosure title="The daily reminder" icon="bell" summary={on ? 'on' : 'off'} defaultOpen>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
          <ReminderToggle on={on} onClick={() => setOn(!on)} />
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            One nudge a day, around 9am your time. Tap again to stop.
          </span>
        </div>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
          You will not be nudged on a day you have already played. It is a reminder, not a nag. Turning it off deletes
          the subscription — nothing about your guesses, scores or streak is ever sent with it.
        </p>
      </Disclosure>

      <Disclosure title="Suggest a question" icon="send">
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)' }}>
          Good questions can be reasoned out from things you roughly know, rather than recalled. Every suggestion is
          checked by hand before it can appear, so an answer and a source are both needed.
        </p>
        <TextField label="Question" placeholder="How many bricks are in the Great Wall of China?" />
        <TextField label="Answer" numeric placeholder="3.9e9" trailing={<ExponentButton />} />
        <TextField label="Unit" placeholder="bricks" />
        <TextField label="Source" placeholder="Wall length and typical brick dimensions" />
        <TextField label="How would you work it out?" hint="(optional)" multiline rows={3}
          placeholder="Length times cross-section, divided by the volume of one brick." />
        <Button variant="quiet" size="sm" icon="send" style={{ marginTop: 'var(--space-6)' }}>Send it in</Button>
      </Disclosure>

      <FootNote align="center">Free software — <a href="https://github.com/SidathPeiris/estimation-gym-app">source code</a> (AGPL-3.0)</FootNote>
    </div>
  );
}
window.GuideScreen = GuideScreen;
