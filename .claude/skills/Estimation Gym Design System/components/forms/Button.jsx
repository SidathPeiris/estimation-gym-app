import React from 'react';
import { Icon } from '../brand/Icon.jsx';

const SIZES = {
  sm: { padding: '9px 14px', fontSize: 'var(--text-sm)', radius: 'var(--radius-md)', gap: 'var(--space-2)', icon: 15 },
  md: { padding: '13px 20px', fontSize: 'var(--text-md)', radius: 'var(--radius-lg)', gap: 'var(--space-3)', icon: 17 },
  lg: { padding: '14px 24px', fontSize: 'var(--text-lg)', radius: 'var(--radius-lg)', gap: 'var(--space-3)', icon: 19 }
};

/* Four variants, all from the source app: `solid` is the install page's play
   button, `soft` is the tinted Go / Share button, `quiet` is the bordered
   export button, `ghost` is a bare text control. */
function look(variant, tone) {
  const t = tone === 'accent' ? 'var(--accent)' : tone;
  switch (variant) {
    case 'solid':
      return { background: t, color: 'var(--text-on-accent)', border: '1px solid transparent' };
    case 'quiet':
      return { background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-default)' };
    case 'ghost':
      return { background: 'transparent', color: t, border: '1px solid transparent' };
    default:
      return {
        background: 'color-mix(in srgb, ' + t + ' 16%, transparent)',
        color: t,
        border: '1px solid color-mix(in srgb, ' + t + ' 55%, transparent)'
      };
  }
}

export function Button({
  children, variant = 'soft', size = 'md', tone = 'accent', icon = null, iconAfter = null,
  block = false, disabled = false, as = 'button', href, style, ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const v = look(variant, tone);
  const Tag = as === 'a' ? 'a' : 'button';
  return (
    <Tag
      {...(Tag === 'a' ? { href } : { type: rest.type || 'button' })}
      disabled={Tag === 'button' ? disabled : undefined}
      {...rest}
      style={{
        display: block ? 'flex' : 'inline-flex', width: block ? '100%' : undefined,
        alignItems: 'center', justifyContent: 'center', gap: s.gap,
        padding: s.padding, borderRadius: s.radius,
        font: 'var(--type-label)', fontSize: s.fontSize, fontWeight: 'var(--weight-bold)',
        textDecoration: 'none', cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        transition: 'var(--transition-control)',
        ...v, ...style
      }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'var(--press-shift)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'none'; }}
    >
      {icon && <Icon name={icon} size={s.icon} />}
      {children}
      {iconAfter && <Icon name={iconAfter} size={s.icon} />}
    </Tag>
  );
}

/* The ×10ⁿ helper next to the guess field, and the icon-only controls in the
   header. Square, quiet, and never the primary action. */
export function IconButton({ icon, label, size = 38, tone = 'var(--text-muted)', active = false, style, ...rest }) {
  return (
    <button
      type="button" aria-label={label} title={label} {...rest}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: size, height: size, flex: '0 0 auto',
        background: active ? 'var(--accent-wash)' : 'transparent',
        border: '1px solid ' + (active ? 'var(--accent-edge)' : 'var(--border-default)'),
        borderRadius: 'var(--radius-md)',
        color: active ? 'var(--accent)' : tone,
        cursor: 'pointer', transition: 'var(--transition-control)', ...style
      }}
    >
      <Icon name={icon} size={Math.round(size * 0.46)} />
    </button>
  );
}

/* Scientific notation, as a button. The phone keypad has no "e", so this puts
   one within reach without swapping to the full keyboard. */
export function ExponentButton({ onClick, style, ...rest }) {
  return (
    <button
      type="button" onClick={onClick}
      aria-label="Insert scientific notation, times ten to the power"
      title="Scientific notation: 3 ×10ⁿ 12 is 3e12"
      {...rest}
      style={{
        flex: '0 0 auto', padding: '0 0.7rem',
        background: 'transparent', border: '3px dashed var(--border-default)',
        borderRadius: 'var(--radius-md)', color: 'var(--text-muted)',
        font: 'inherit', fontFamily: 'var(--font-mono)', fontSize: 'var(--text-base)',
        lineHeight: 1, cursor: 'pointer', transition: 'var(--transition-control)', ...style
      }}
    >
      ×10<sup style={{ fontSize: '0.7em' }}>n</sup>
    </button>
  );
}
