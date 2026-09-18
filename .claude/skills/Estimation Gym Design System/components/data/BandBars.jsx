import React from 'react';
import { bandColour } from '../game/BandTag.jsx';

/* The band histogram, used for both your lifetime stats and "how everyone did"
   on the same question. Same visual language in both places, which is how the
   source builds it. */
export function BandBars({ rows = [], mine = null, showTally = true, style, ...rest }) {
  const max = Math.max(...rows.map((r) => r.fraction || 0), 0.0001);
  return (
    <div {...rest} style={{ display: 'grid', gap: 'var(--space-3)', ...style }}>
      {rows.map((r) => {
        const isMine = mine === r.band;
        const tone = bandColour(r.band);
        return (
          <div key={r.band} style={{
            display: 'grid', gridTemplateColumns: '5.5rem 1fr 2rem',
            alignItems: 'center', gap: 'var(--space-4)'
          }}>
            <span style={{
              font: 'var(--type-body)', fontSize: 'var(--text-sm)',
              color: isMine ? 'var(--text-display)' : 'var(--text-muted)',
              fontWeight: isMine ? 'var(--weight-bold)' : 'var(--weight-regular)'
            }}>{r.band}</span>
            <span style={{
              display: 'block', height: 8, borderRadius: 'var(--radius-xs)',
              background: 'color-mix(in srgb, var(--text-body) 14%, transparent)', overflow: 'hidden'
            }}>
              <i style={{
                display: 'block', height: '100%', borderRadius: 'var(--radius-xs)',
                width: ((r.fraction || 0) / max) * 100 + '%',
                background: tone, opacity: mine && !isMine ? 0.55 : 1,
                transformOrigin: 'left', animation: 'eg-bar-grow var(--dur-slow) var(--ease-out) both'
              }} />
            </span>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
              color: 'var(--text-muted)', textAlign: 'right'
            }}>{showTally ? r.tally : Math.round((r.fraction || 0) * 100) + '%'}</span>
          </div>
        );
      })}
    </div>
  );
}

/* A lifetime number with its label. Three or four across, above the bars. */
export function StatTile({ label, value, sub = null, tone = 'var(--text-display)', style, ...rest }) {
  return (
    <div {...rest} style={{
      padding: 'var(--space-6) var(--space-7)',
      background: 'var(--surface-card)', border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)', ...style
    }}>
      <div style={{
        font: 'var(--type-eyebrow)', fontSize: 'var(--text-2xs)', letterSpacing: 'var(--track-label)',
        textTransform: 'uppercase', color: 'var(--text-muted)'
      }}>{label}</div>
      <div style={{
        marginTop: 'var(--space-2)', fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-bold)',
        fontSize: 'var(--text-2xl)', lineHeight: 1, color: tone
      }}>{value}</div>
      {sub && <div style={{ marginTop: 'var(--space-2)', fontSize: 'var(--text-xs)', color: 'var(--text-faint)' }}>{sub}</div>}
    </div>
  );
}
