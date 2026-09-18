/* The shell: header, the four destinations, and the state the click-through
   needs. There is exactly one daily answer per day — answering is idempotent,
   as recordAnswer() is in the Model. Practice keeps its own separate state. */
function AppShell() {
  const NS = window.EstimationGymDesignSystem_4a01b0;
  const { AppHeader, Icon } = NS;
  const D = window.EG_DATA;
  const [tab, setTab] = React.useState('today');
  const [answer, setAnswer] = React.useState(null);
  /* recordAnswer() bumps the streak, so the header and the share card have to
     read the same number — it lives here, not in either surface. */
  const [streak, setStreak] = React.useState(D.streak);
  const [best, setBest] = React.useState(D.best);
  const [practised, setPractised] = React.useState([]);
  const [practiceQuestion, setPracticeQuestion] = React.useState(null);
  const [practiceResult, setPracticeResult] = React.useState(null);
  const [reminder, setReminder] = React.useState(false);

  /* Drawn on arrival, and again after each answer — at random from whatever is
     left, the way Model.pickPractice() does it. */
  React.useEffect(() => {
    if (tab === 'practice' && !practiceQuestion && !practiceResult) {
      setPracticeQuestion(D.drawPractice(practised));
    }
  }, [tab, practiceQuestion, practiceResult, practised]);

  const nextPractice = () => {
    const done = practiceQuestion ? practised.concat([practiceQuestion.id]) : practised;
    setPractised(done);
    setPracticeResult(null);
    setPracticeQuestion(D.drawPractice(done));
  };

  const tabs = [
    { id: 'today', label: 'Today', icon: 'target' },
    { id: 'practice', label: 'Practice', icon: 'dumbbell' },
    { id: 'stats', label: 'Stats', icon: 'chart-column' },
    { id: 'guide', label: 'Guide', icon: 'info' }
  ];

  return (
    <div style={{ minHeight: '100vh', paddingBottom: 96 }}>
      <div className="eg-app">
        <AppHeader
          date={D.today} streak={streak} best={best}
          reminderOn={reminder} onReminder={() => setReminder(!reminder)}
        />
        <div style={{ marginTop: 'var(--space-11)' }}>
          {tab === 'today' && (
            <window.TodayScreen
              answer={answer} streak={streak}
              onAnswer={(a) => {
                setAnswer(a);
                const next = streak + 1;
                setStreak(next);
                if (next > best) setBest(next);
              }}
              onPractice={() => setTab('practice')}
            />
          )}
          {tab === 'practice' && (
            <window.PracticeScreen
              question={practiceQuestion} result={practiceResult} practised={practised.length}
              onAnswer={(r) => setPracticeResult(r)}
              onNext={nextPractice}
            />
          )}
          {tab === 'stats' && <window.StatsScreen />}
          {tab === 'guide' && <window.GuideScreen />}
        </div>
      </div>

      <nav style={{
        position: 'fixed', left: 0, right: 0, bottom: 0,
        display: 'flex', justifyContent: 'center', gap: 'var(--space-1)',
        padding: 'var(--space-3) var(--space-4) calc(var(--space-3) + env(safe-area-inset-bottom))',
        background: 'var(--surface-veil)', backdropFilter: 'blur(14px)',
        borderTop: '1px solid var(--border-default)'
      }}>
        {tabs.map((t) => {
          const active = tab === t.id;
          return (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              minWidth: 72, minHeight: 'var(--tap-min)', padding: 'var(--space-3) var(--space-5)',
              background: active ? 'var(--accent-wash)' : 'transparent',
              border: '1px solid ' + (active ? 'var(--accent-edge)' : 'transparent'),
              borderRadius: 'var(--radius-lg)', cursor: 'pointer',
              color: active ? 'var(--accent)' : 'var(--text-muted)',
              transition: 'var(--transition-control)'
            }}>
              <Icon name={t.icon} size={17} />
              <span style={{ font: 'var(--type-eyebrow)', fontSize: 'var(--text-2xs)', fontWeight: active ? 700 : 400 }}>{t.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
window.AppShell = AppShell;
