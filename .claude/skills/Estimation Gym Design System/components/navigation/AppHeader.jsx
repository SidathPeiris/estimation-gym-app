import React from 'react';
import { Brandmark } from '../brand/Brandmark.jsx';
import { StreakBadge } from '../display/Chip.jsx';
import { Icon } from '../brand/Icon.jsx';

/* The app's one header: mark, name, the day, streak, and the reminder bell. */
export function AppHeader({
  date = null, streak = 0, best = 0, reminderOn = false, onReminder, onMenu, compact = false, style, ...rest
}) {
  return (
    <header {...rest} style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 'var(--space-5)', flexWrap: 'wrap', ...style
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', minWidth: 0 }}>
        <Brandmark size={compact ? 26 : 32} />
        <div style={{ minWidth: 0 }}>
          <div style={{
            font: 'var(--type-title)', fontSize: compact ? 'var(--text-lg)' : 'var(--text-2xl)',
            color: 'var(--text-display)', letterSpacing: 'var(--track-display)'
          }}>
            Estimation <span style={{ color: 'var(--accent)' }}>Gym</span>
          </div>
        </div>
        {date && (
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)',
            color: 'var(--text-faint)', marginTop: 2
          }}>{date}</div>
        )}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <StreakBadge streak={streak} best={best} />
        <ReminderToggle on={reminderOn} onClick={onReminder} />
        {onMenu && (
          <button type="button" onClick={onMenu} aria-label="Settings" style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 32, height: 32, background: 'transparent',
            border: '1px solid var(--border-default)', borderRadius: 'var(--radius-pill)',
            color: 'var(--text-muted)', cursor: 'pointer'
          }}>
            <Icon name="settings" size={14} />
          </button>
        )}
      </div>
    </header>
  );
}

/* The bell in the header corner. On is worth seeing at a glance; Off stays
   quiet — the source's own rule. */
export function ReminderToggle({ on = false, label = true, onClick, style, ...rest }) {
  return (
    <button
      type="button" onClick={onClick} data-on={on ? 'true' : 'false'}
      aria-label="Daily reminder" title="Daily reminder" {...rest}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
        padding: label ? '0.3rem 0.6rem' : '0.35rem',
        background: on ? 'var(--accent-wash)' : 'transparent',
        border: '1px solid ' + (on ? 'var(--accent-edge)' : 'var(--border-default)'),
        borderRadius: 'var(--radius-pill)',
        color: on ? 'var(--accent)' : 'var(--text-muted)',
        font: 'var(--type-eyebrow)', fontSize: 'var(--text-xs)', lineHeight: 1,
        cursor: 'pointer', transition: 'var(--transition-control)', ...style
      }}
    >
      <Icon name={on ? 'bell' : 'bell-off'} size={13} color="var(--reminder-bell)" />
      {label && <span style={{ fontWeight: 'var(--weight-bold)', color: 'var(--reminder-bell)' }}>{on ? 'On' : 'Off'}</span>}
    </button>
  );
}
