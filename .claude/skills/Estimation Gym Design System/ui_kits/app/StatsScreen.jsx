/* Stats: lifetime totals, band spread, which shapes of problem you are good
   at, and the history list with its per-question comparison. */
function StatsScreen() {
  const NS = window.EstimationGymDesignSystem_4a01b0;
  const { StatTile, BandBars, HistoryRow, ArchetypeRow, Callout, Button, Eyebrow, Disclosure } = NS;
  const D = window.EG_DATA;
  const [openRow, setOpenRow] = React.useState(null);
  return (
    <div>
      <Eyebrow icon="chart-column" style={{ marginBottom: 'var(--space-7)' }}>lifetime</Eyebrow>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-4)' }}>
        <StatTile label="Days played" value="12" />
        <StatTile label="Points" value="780" tone="var(--accent)" />
        <StatTile label="Best streak" value="14" sub="current 6" tone="var(--status-warn)" />
        <StatTile label="Median off" value="0.42" sub="decades" />
      </div>

      <div style={{ marginTop: 'var(--space-10)' }}>
        <BandBars rows={D.bands} />
      </div>

      <Callout title="You tend to guess low, by about 3.8×" icon="trending-down" tone="var(--status-warn)">
        Knowing your direction of error is the part you can actually correct.
      </Callout>

      <Disclosure title="Which shapes you are good at" icon="brain" defaultOpen>
        <p style={{ margin: '0 0 var(--space-5)', font: 'var(--type-label)', fontSize: 'var(--text-sm)' }}>
          Strongest on people times per-person rate. Weakest on count the doublings.
        </p>
        {D.archetypes.map((a) => (
          <ArchetypeRow key={a.label} label={a.label} played={a.played} median={a.median} thin={a.thin} />
        ))}
      </Disclosure>

      <Disclosure title="History" icon="clock" summary={D.history.length + ' days'} defaultOpen>
        <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {D.history.map((h) => (
            <HistoryRow
              key={h.date} {...h}
              open={openRow === h.date}
              onClick={() => setOpenRow(openRow === h.date ? null : h.date)}
            >
              <BandBars rows={D.distribution} mine={h.band} showTally={false} />
            </HistoryRow>
          ))}
        </ol>
        <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-7)', flexWrap: 'wrap' }}>
          <Button variant="quiet" size="sm" icon="copy">Copy my history</Button>
          <Button variant="quiet" size="sm" icon="send">Restore a history</Button>
        </div>
      </Disclosure>
    </div>
  );
}
window.StatsScreen = StatsScreen;
