import React from 'react';
import { Icon } from '../brand/Icon.jsx';

/* The hairline pill from the install page's objection chips ("no account", "no
   ads", "works offline"). */
export function Chip({ children, icon = null, tone = null, style, ...rest }) {
  const c = tone || 'var(--text-muted)';
  return (
    <span {...rest} style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
      padding: '0.2rem 0.65rem', borderRadius: 'var(--radius-pill)',
      border: '1px solid ' + (tone ? 'color-mix(in srgb, ' + tone + ' 45%, transparent)' : 'var(--border-default)'),
      background: tone ? 'color-mix(in srgb, ' + tone + ' 10%, transparent)' : 'transparent',
      font: 'var(--type-eyebrow)', fontSize: 'var(--text-xs)', color: c, ...style
    }}>
      {icon && <Icon name={icon} size={12} />}{children}
    </span>
  );
}

/* Uppercase, letterspaced section label. The source's .asof and .lbl. */
export function Eyebrow({ children, tone = 'var(--text-muted)', icon = null, style, ...rest }) {
  return (
    <p {...rest} style={{
      display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
      margin: 0, font: 'var(--type-eyebrow)', fontSize: 'var(--text-xs)',
      letterSpacing: 'var(--track-eyebrow)', textTransform: 'uppercase',
      color: tone, ...style
    }}>
      {icon && <Icon name={icon} size={12} />}{children}
    </p>
  );
}

/* Streak and best, which the source prints as "Streak 4 · Best 11". The flame
   lights only when the streak is live. */
export function StreakBadge({ streak = 0, best = 0, size = 'md', style, ...rest }) {
  const live = streak > 0;
  const lg = size === 'lg';
  return (
    <span {...rest} style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)',
      padding: lg ? '0.4rem 0.8rem' : '0.25rem 0.6rem',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid ' + (live ? 'color-mix(in srgb, var(--status-warn) 40%, transparent)' : 'var(--border-default)'),
      background: live ? 'color-mix(in srgb, var(--status-warn) 10%, transparent)' : 'transparent',
      ...style
    }}>
      <Icon name="flame" size={lg ? 16 : 13} color={live ? 'var(--status-warn)' : 'var(--text-faint)'} />
      <span style={{
        fontFamily: 'var(--font-mono)', fontWeight: 'var(--weight-bold)',
        fontSize: lg ? 'var(--text-md)' : 'var(--text-sm)',
        color: live ? 'var(--status-warn)' : 'var(--text-muted)'
      }}>{streak}</span>
      <span style={{ fontSize: 'var(--text-2xs)', color: 'var(--streak-best)', textTransform: 'capitalize' }}>best {best}</span>
    </span>
  );
}
