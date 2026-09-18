import React from 'react';
import { BandTag, PointsTag, bandColour } from './BandTag.jsx';

/* A scored day. Same information the source shows — band, points, your guess,
   the actual value, the distance in decades — with the decade distance drawn as
   a ruler instead of stated in prose, because "off by 0.42 orders of magnitude"
   is the one line every new player has to re-read. */
export function ResultCard({
  band = 'Close', points = 70, guess, actual, unit = '', decades = 0,
  assisted = false, practice = false, children, style, ...rest
}) {
  const tone = bandColour(band);
  const pct = Math.max(2, Math.min(100, (Math.min(decades, 3) / 3) * 100));
  return (
    <section {...rest} style={{
      borderRadius: 'var(--radius-xl)',
      border: '1px solid color-mix(in srgb, ' + tone + ' 45%, transparent)',
      background: 'color-mix(in srgb, ' + tone + ' 11%, transparent)',
      padding: 'var(--space-8) var(--card-pad)',
      animation: 'eg-pop var(--dur-base) var(--ease-spring) both',
      ...style
    }}>
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-5)' }}>
        <BandTag band={band} assisted={assisted} />
        <PointsTag points={points} band={band} practice={practice} size="lg" />
      </header>

      <dl style={{
        display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 'var(--space-2) var(--space-5)',
        margin: 'var(--space-7) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-base)'
      }}>
        <dt style={{ color: 'var(--text-muted)' }}>Your guess</dt>
        <dd style={{ fontFamily: 'var(--font-mono)', color: 'var(--result-guess)', margin: 0, textTransform: 'capitalize' }}>{guess} {unit}</dd>
        <dt style={{ color: 'var(--text-muted)' }}>Actual</dt>
        <dd style={{ fontFamily: 'var(--font-mono)', color: 'var(--result-actual)', margin: 0, fontWeight: 'var(--weight-bold)', textTransform: 'capitalize' }}>{actual} {unit}</dd>
      </dl>

      <div style={{ marginTop: 'var(--space-8)' }}>
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
          font: 'var(--type-eyebrow)', fontSize: 'var(--text-2xs)',
          letterSpacing: 'var(--track-label)', textTransform: 'uppercase', color: 'var(--text-muted)'
        }}>
          <span>Orders of magnitude off</span>
          <span style={{ fontFamily: 'var(--font-mono)', color: tone, letterSpacing: 0 }}>{Number(decades).toFixed(2)}</span>
        </div>
        <div style={{
          position: 'relative', marginTop: 'var(--space-3)', height: 8,
          borderRadius: 'var(--radius-xs)',
          background: 'color-mix(in srgb, var(--text-body) 14%, transparent)', overflow: 'hidden'
        }}>
          <i style={{
            position: 'absolute', inset: '0 auto 0 0', width: pct + '%',
            background: tone, borderRadius: 'var(--radius-xs)',
            transformOrigin: 'left', animation: 'eg-bar-grow var(--dur-slow) var(--ease-out) both'
          }} />
          {[33.3, 66.6].map((x) => (
            <i key={x} style={{ position: 'absolute', top: 0, bottom: 0, left: x + '%', width: 1, background: 'var(--surface-page)' }} />
          ))}
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-2)',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-faint)'
        }}>
          <span>exact</span><span>10×</span><span>100×</span><span>1000×</span>
        </div>
      </div>
      {children && <div style={{ marginTop: 'var(--space-8)' }}>{children}</div>}
    </section>
  );
}
