import React from 'react';
import { Brandmark } from '../brand/Brandmark.jsx';
import { Icon } from '../brand/Icon.jsx';
import { bandColour } from './BandTag.jsx';

/* The squares a shared result is made of. Kept identical to presenter.js
   BAND_EMOJI / MISSED_EMOJI, because the text people paste has to match the
   card they were looking at. */
export const SHARE_EMOJI = { Bullseye: '🎯', Close: '🟢', Ballpark: '🟡', Off: '🔴', missed: '⬜' };

/* Seven calendar days, oldest to newest, as band squares. Calendar days rather
   than played days — a gap reads as a gap, because the streak is the point and
   closing the misses up would misrepresent it. Leading gaps are trimmed, so a
   first-ever day posts one square rather than six blanks and a square. */
export function BandRun({ run = [], size = 30, gap = 6, style, ...rest }) {
  const trimmed = run.slice();
  while (trimmed.length && !trimmed[0]) trimmed.shift();
  return (
    <div {...rest} style={{ display: 'flex', gap, flexWrap: 'wrap', ...style }}>
      {trimmed.map((band, i) => {
        const missed = !band;
        return (
          <span key={i} title={band || 'not played'} style={{
            width: size, height: size, borderRadius: 'var(--radius-sm)', flex: '0 0 auto',
            background: missed ? 'transparent' : 'color-mix(in srgb, ' + bandColour(band) + ' 22%, transparent)',
            border: '1px solid ' + (missed ? 'var(--border-default)' : 'color-mix(in srgb, ' + bandColour(band) + ' 65%, transparent)'),
            display: 'grid', placeItems: 'center'
          }}>
            {!missed && (
              <i style={{
                width: Math.round(size * 0.34), height: Math.round(size * 0.34),
                borderRadius: 'var(--radius-circle)', background: bandColour(band), display: 'block'
              }} />
            )}
          </span>
        );
      })}
    </div>
  );
}

/* The shareable result.
   Deliberately omits the guess, the true value and the question itself — a
   shared result has to be safe to post before anybody else has played, and the
   band conveys how it went without giving anything away. The mono block at the
   bottom is exactly what lands on the clipboard, shown so nobody has to guess
   what they are about to post. */
export function ShareCard({
  date, band = 'Close', decades = null, streak = 0, run = [],
  url = 'estimationgym.app', assisted = false, text = null,
  onShare, onCopy, copied = false, style, ...rest
}) {
  const tone = bandColour(band);
  const line = SHARE_EMOJI[band] + ' ' + band
    + (decades !== null && decades !== undefined ? ' · ' + Number(decades).toFixed(2) + ' decades off' : '')
    + (assisted ? ' · hint' : '');

  const squares = (() => {
    const t = run.slice();
    while (t.length && !t[0]) t.shift();
    return t.map((b) => (b ? SHARE_EMOJI[b] : SHARE_EMOJI.missed)).join('');
  })();

  const payload = text !== null ? text
    : ['Estimation Gym · ' + date, squares, line, 'Streak ' + streak, '', url].join('\n');

  return (
    <section {...rest} style={{
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: 'var(--shadow-raised)',
      padding: 'var(--card-pad)',
      animation: 'eg-rise var(--dur-base) var(--ease-out) both',
      ...style
    }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <Brandmark size={22} />
        <span style={{
          font: 'var(--type-label)', fontSize: 'var(--text-base)',
          fontFamily: 'var(--font-display)', color: 'var(--text-display)'
        }}>Estimation Gym</span>
        <span style={{
          marginLeft: 'auto', fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-2xs)', color: 'var(--text-faint)'
        }}>{date}</span>
      </header>

      <BandRun run={run} style={{ marginTop: 'var(--space-8)' }} />

      <p style={{
        margin: 'var(--space-8) 0 0', display: 'flex', alignItems: 'baseline',
        gap: 'var(--space-3)', flexWrap: 'wrap'
      }}>
        <span style={{
          font: 'var(--type-label)', fontSize: 'var(--text-xl)',
          fontFamily: 'var(--font-display)', color: tone
        }}>{band}</span>
        {decades !== null && decades !== undefined && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
            {Number(decades).toFixed(2)} decades off
          </span>
        )}
        {assisted && (
          <span style={{ font: 'var(--type-eyebrow)', fontSize: 'var(--text-2xs)', color: 'var(--text-faint)' }}>hint</span>
        )}
      </p>

      <p style={{
        margin: 'var(--space-2) 0 0', display: 'inline-flex', alignItems: 'center',
        gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-secondary)'
      }}>
        <Icon name="flame" size={13} color={streak > 0 ? 'var(--status-warn)' : 'var(--text-faint)'} />
        Streak <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-display)' }}>{streak}</span>
      </p>

      <pre style={{
        margin: 'var(--space-8) 0 0', padding: 'var(--space-5) var(--space-6)',
        background: 'var(--surface-sunken)', border: '1px solid var(--border-default)',
        borderRadius: 'var(--radius-md)', fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-2xs)', lineHeight: 'var(--leading-snug)',
        color: 'var(--text-muted)', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere'
      }}>{payload}</pre>

      <p style={{ margin: 'var(--space-3) 0 0', fontSize: 'var(--text-2xs)', color: 'var(--text-faint)' }}>
        Your guess, the answer and the question are all left out, so this is safe to post before anyone else has played.
      </p>

      <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-8)' }}>
        <button type="button" onClick={onShare} style={{
          flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          gap: 'var(--space-3)', minHeight: 'var(--tap-min)', padding: '13px 20px',
          background: 'var(--accent-wash-strong)', border: '1px solid var(--accent-edge)',
          borderRadius: 'var(--radius-lg)', color: 'var(--accent)',
          font: 'var(--type-label)', fontSize: 'var(--text-md)', cursor: 'pointer',
          transition: 'var(--transition-control)'
        }}>
          <Icon name="share-2" size={16} />Share
        </button>
        <button type="button" onClick={onCopy} style={{
          flex: '0 0 auto', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          gap: 'var(--space-3)', minHeight: 'var(--tap-min)', padding: '13px 18px',
          background: 'transparent',
          border: '1px solid ' + (copied ? 'color-mix(in srgb, var(--status-good) 55%, transparent)' : 'var(--border-default)'),
          borderRadius: 'var(--radius-lg)',
          color: copied ? 'var(--status-good)' : 'var(--text-muted)',
          font: 'var(--type-label)', fontSize: 'var(--text-md)', cursor: 'pointer',
          transition: 'var(--transition-control)'
        }}>
          <Icon name={copied ? 'check' : 'copy'} size={16} />{copied ? 'Copied' : 'Copy'}
        </button>
      </div>
    </section>
  );
}
