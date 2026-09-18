import React from 'react';
import { Icon } from '../brand/Icon.jsx';

/* The accent-washed note with a rule down its left edge — the source app's
   .strategy (hint guidance) and .calibration (which way you lean). Rounded on
   three corners only, exactly as app.css draws it. */
export function Callout({ title, children, tone = 'var(--accent)', icon = null, style, ...rest }) {
  return (
    <div {...rest} style={{
      marginTop: 'var(--space-6)',
      padding: '0.7rem 0.85rem',
      borderLeft: '2px solid ' + tone,
      borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
      background: 'color-mix(in srgb, ' + tone + ' 8%, transparent)',
      animation: 'eg-rise var(--dur-base) var(--ease-out) both',
      ...style
    }}>
      {title && (
        <p style={{
          margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-2)',
          font: 'var(--type-label)', fontSize: 'var(--text-base)', color: 'var(--text-display)'
        }}>
          {icon && <Icon name={icon} size={14} color={tone} />}{title}
        </p>
      )}
      <div style={{
        margin: title ? 'var(--space-2) 0 0' : 0,
        font: 'var(--type-body)', fontSize: 'var(--text-sm)',
        lineHeight: 'var(--leading-relaxed)', color: 'var(--text-secondary)'
      }}>{children}</div>
    </div>
  );
}

/* The full-width bordered notice: the confession prompt and the domain-move
   banner in the source. Title in the accent, body in foreground, actions in a
   wrapping row. */
export function Banner({ title, children, actions = null, tone = 'var(--accent)', icon = null, style, ...rest }) {
  return (
    <div {...rest} style={{
      padding: 'var(--space-7) var(--space-8)',
      border: '1px solid ' + tone,
      borderRadius: 'var(--radius-xl)',
      background: 'color-mix(in srgb, ' + tone + ' 9%, transparent)',
      animation: 'eg-rise var(--dur-base) var(--ease-out) both',
      ...style
    }}>
      <p style={{
        margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--space-3)',
        font: 'var(--type-label)', fontSize: 'var(--text-md)',
        fontFamily: 'var(--font-display)', color: tone
      }}>
        {icon && <Icon name={icon} size={16} />}{title}
      </p>
      <div style={{
        margin: 'var(--space-3) 0 0', font: 'var(--type-body)', fontSize: 'var(--text-base)',
        lineHeight: 'var(--leading-normal)', color: 'var(--text-body)'
      }}>{children}</div>
      {actions && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-4)', marginTop: 'var(--space-6)' }}>{actions}</div>
      )}
    </div>
  );
}

/* One quiet line of small print: the build stamp, the source offer, the
   privacy note under a toggle. */
export function FootNote({ children, align = 'left', style, ...rest }) {
  return (
    <p {...rest} style={{
      margin: 'var(--space-7) 0 0', fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)', textAlign: align, lineHeight: 'var(--leading-normal)', ...style
    }}>{children}</p>
  );
}
