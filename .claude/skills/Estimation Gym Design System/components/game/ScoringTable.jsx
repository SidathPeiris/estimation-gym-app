import React from 'react';
import { BANDS, BandTag } from './BandTag.jsx';

/* How to play, scoring half. Rows are derived from the band table rather than
   written out, the same rule core/Model.js follows, so a repriced band cannot
   leave the guide saying something untrue. */
export function ScoringTable({ compact = false, style, ...rest }) {
  return (
    <table {...rest} style={{
      width: '100%', borderCollapse: 'collapse',
      font: 'var(--type-body)', fontSize: compact ? 'var(--text-sm)' : 'var(--text-base)', ...style
    }}>
      <tbody>
        {Object.keys(BANDS).map((band, i, all) => (
          <tr key={band}>
            <td style={{
              padding: '0.45rem 0', verticalAlign: 'baseline',
              borderBottom: i === all.length - 1 ? 0 : '1px solid var(--border-default)'
            }}>
              <BandTag band={band} variant="plain" />
            </td>
            <td style={{
              padding: '0.45rem 0 0.45rem 0.6rem', color: 'var(--text-muted)', verticalAlign: 'baseline',
              borderBottom: i === all.length - 1 ? 0 : '1px solid var(--border-default)'
            }}>{BANDS[band].meaning}</td>
            <td style={{
              padding: '0.45rem 0', textAlign: 'right', whiteSpace: 'nowrap',
              fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', verticalAlign: 'baseline',
              borderBottom: i === all.length - 1 ? 0 : '1px solid var(--border-default)'
            }}>{BANDS[band].points} pts</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* Numbered steps, as How to play uses them. */
export function StepList({ steps = [], style, ...rest }) {
  return (
    <ol {...rest} style={{ margin: 0, paddingLeft: '1.15rem', ...style }}>
      {steps.map((s, i) => (
        <li key={i} style={{
          margin: '0 0 var(--space-4)', font: 'var(--type-body)', fontSize: 'var(--text-sm)',
          color: 'var(--text-secondary)'
        }}>
          <span style={{ color: 'var(--text-body)' }}>{s}</span>
        </li>
      ))}
    </ol>
  );
}
