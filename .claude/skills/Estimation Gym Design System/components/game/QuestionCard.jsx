import React from 'react';
import { Icon } from '../brand/Icon.jsx';

const MODES = {
  daily: { tint: 'var(--mode-daily)', label: "Today's question", icon: 'calendar-days' },
  practice: { tint: 'var(--mode-practice)', label: 'Practice', icon: 'dumbbell' }
};

/* The question, in either of the product's two modes. Daily is the one
   everybody gets on the same calendar day; practice draws from the far end of
   the same queue. The eyebrow carries the mode, the rule down the left edge
   carries its colour, and — where the answer drifts with time — the "as of"
   year the bank records. */
export function QuestionCard({
  prompt, date = null, asOf = null, mode = 'daily', label = null, icon = null,
  number = null, archetype = null, badge = null, answered = false, children, style, ...rest
}) {
  const m = MODES[mode] || MODES.daily;
  return (
    <section {...rest} style={{
      position: 'relative', overflow: 'hidden',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-card)',
      padding: 'var(--card-pad)',
      animation: 'eg-rise var(--dur-reveal) var(--ease-out) both',
      ...style
    }}>
      <i style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: m.tint, opacity: answered ? 0.45 : 1
      }} />
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 'var(--space-5)', flexWrap: 'wrap'
      }}>
        {badge}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Icon name={icon || m.icon} size={14} color={m.tint} />
          <span style={{
            font: 'var(--type-eyebrow)', fontSize: 'var(--text-2xs)',
            letterSpacing: 'var(--track-label)', textTransform: 'uppercase',
            color: m.tint, fontWeight: 'var(--weight-semibold)'
          }}>{label || m.label}</span>
        </span>
        {(date || number !== null) && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)',
            color: 'var(--text-faint)', letterSpacing: '0.02em'
          }}>
            {date}{date && number !== null && ' · '}{number !== null && '#' + number}
          </span>
        )}
      </header>
      <p style={{
        marginTop: 'var(--space-6)',
        font: 'var(--type-prompt)', color: 'var(--text-display)',
        fontFamily: 'var(--font-display)', fontWeight: 'var(--weight-semibold)',
        letterSpacing: 'var(--track-tight)'
      }}>{prompt}</p>
      {(asOf || archetype) && (
        <p style={{
          marginTop: 'var(--space-2)', font: 'var(--type-eyebrow)',
          fontSize: 'var(--text-xs)', color: 'var(--text-muted)'
        }}>
          {asOf && <em style={{ fontStyle: 'italic' }}>as of {asOf}</em>}
          {asOf && archetype && ' · '}
          {archetype}
        </p>
      )}
      {children && <div style={{ marginTop: 'var(--space-9)' }}>{children}</div>}
    </section>
  );
}
