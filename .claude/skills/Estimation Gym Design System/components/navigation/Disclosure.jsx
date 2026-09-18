import React from 'react';
import { Icon } from '../brand/Icon.jsx';

/* Every secondary section of the app is one of these: Practice, How to play,
   History, Stats, Suggest a question. Title left, summary right, chevron
   turns. They share one separator rule so the run reads as a list. */
export function Disclosure({
  title, summary = null, icon = null, open: openProp, defaultOpen = false,
  onToggle, children, divider = true, style, ...rest
}) {
  const [openState, setOpenState] = React.useState(defaultOpen);
  const open = openProp === undefined ? openState : openProp;
  const toggle = () => {
    if (openProp === undefined) setOpenState(!open);
    if (onToggle) onToggle(!open);
  };
  return (
    <section {...rest} style={{
      marginTop: 'var(--space-11)',
      borderTop: divider ? '1px solid var(--border-default)' : 0,
      paddingTop: divider ? 'var(--space-8)' : 0, ...style
    }}>
      <button
        type="button" onClick={toggle} aria-expanded={open}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 'var(--space-5)', background: 'none', border: 0, padding: 'var(--space-1) 0',
          color: 'inherit', font: 'inherit', cursor: 'pointer', textAlign: 'left'
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <Icon
            name="chevron-right" size={14} color="var(--text-muted)"
            style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform var(--dur-fast) var(--ease-out)' }}
          />
          {icon && <Icon name={icon} size={15} color="var(--text-secondary)" />}
          <span style={{ font: 'var(--type-label)', fontSize: 'var(--text-base)', color: 'var(--text-display)' }}>{title}</span>
        </span>
        {summary && (
          <span style={{ font: 'var(--type-body)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>{summary}</span>
        )}
      </button>
      {open && (
        <div style={{ marginTop: 'var(--space-6)', animation: 'eg-rise var(--dur-base) var(--ease-out) both' }}>{children}</div>
      )}
    </section>
  );
}
