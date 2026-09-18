import React from 'react';
import { BandTag } from '../game/BandTag.jsx';
import { Icon } from '../brand/Icon.jsx';

/* One past day. Only what was actually recorded is shown — date, band, guess,
   the value it was scored against. The question text is deliberately absent:
   it is not stored, and the day number cannot be used to look it up. */
export function HistoryRow({
  date, band = 'Close', guess, actual, decades, assisted = false,
  comparable = false, open = false, onClick, children, style, ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return (
    <li
      onClick={comparable ? onClick : undefined}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      {...rest}
      style={{
        display: 'grid', gridTemplateColumns: '5.5rem 1fr auto',
        alignItems: 'baseline', gap: 'var(--space-4)',
        padding: 'var(--space-3) var(--space-3)',
        margin: '0 calc(var(--space-3) * -1)',
        borderRadius: 'var(--radius-md)',
        borderBottom: '1px solid color-mix(in srgb, var(--border-default) 60%, transparent)',
        cursor: comparable ? 'pointer' : 'default',
        background: open || (hover && comparable) ? 'color-mix(in srgb, var(--text-body) 4%, transparent)' : 'transparent',
        transition: 'var(--transition-control)',
        listStyle: 'none', ...style
      }}
    >
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)',
        color: hover && comparable ? 'var(--text-body)' : 'var(--text-muted)'
      }}>
        {date}
      </span>
      <BandTag band={band} variant="plain" size="sm" assisted={assisted} />
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
        color: 'var(--text-faint)', textAlign: 'right'
      }}>
        <span style={{ whiteSpace: 'nowrap' }}>{guess} → {actual}</span>
        {decades !== undefined && decades !== null && <span style={{ whiteSpace: 'nowrap' }}> · {Number(decades).toFixed(2)}</span>}
        {comparable && <Icon name={open ? 'chevron-down' : 'chevron-right'} size={12} style={{ marginLeft: 6, verticalAlign: 'middle' }} />}
      </span>
      {open && children && <div style={{
        gridColumn: '1 / -1', marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)',
        borderTop: '1px solid var(--border-default)'
      }}>{children}</div>}
    </li>
  );
}

/* Which shapes of problem you are good at. One row per reasoning archetype,
   labels straight from Model.STRATEGIES. */
export function ArchetypeRow({ label, played = 0, median = null, thin = false, style, ...rest }) {
  return (
    <div {...rest} style={{
      display: 'grid', gridTemplateColumns: '1fr auto auto',
      alignItems: 'baseline', gap: 'var(--space-3)',
      padding: 'var(--space-1) 0', fontSize: 'var(--text-sm)', ...style
    }}>
      <span style={{ color: thin ? 'var(--text-muted)' : 'var(--text-body)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', color: 'var(--text-faint)' }}>{played} played</span>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)',
        textAlign: 'right', whiteSpace: 'nowrap', minWidth: '4.5rem'
      }}>{median !== null ? Number(median).toFixed(2) + ' off' : '—'}</span>
    </div>
  );
}
