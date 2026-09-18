import React from 'react';
import { ExponentButton, Button } from './Button.jsx';

const FIELD = {
  width: '100%', minWidth: 0,
  background: 'var(--surface-card)',
  border: '1px solid var(--border-default)',
  borderRadius: 'var(--radius-lg)',
  padding: '14px 16px',
  font: 'var(--type-body)',
  fontFamily: 'var(--font-mono)',
  fontSize: 'var(--text-lg)',
  color: 'var(--text-body)',
  transition: 'var(--transition-control)'
};

/* The daily guess row: a mono numeric field, the ×10ⁿ helper, and Go. Reused
   verbatim by Practice and by the answer field on the suggestion form. */
export function GuessField({
  value = '', onChange, onSubmit, unit = '', placeholder, error = null,
  submitLabel = 'Go', disabled = false, showExponent = true, autoFocus = false, style
}) {
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef(null);
  const insertE = () => {
    const el = ref.current;
    if (onChange) onChange((value || '') + 'e');
    if (el) el.focus();
  };
  return (
    <div style={style}>
      <form
        onSubmit={(e) => { e.preventDefault(); if (onSubmit) onSubmit(value); }}
        style={{ display: 'flex', gap: 'var(--space-4)' }}
      >
        <input
          ref={ref} value={value} autoFocus={autoFocus} disabled={disabled}
          onChange={(e) => onChange && onChange(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          type="text" inputMode="decimal" autoComplete="off" autoCapitalize="off" spellCheck="false"
          aria-label="Your estimate"
          placeholder={placeholder || (unit ? 'Guess (' + unit + ')' : 'Your estimate')}
          style={{
            ...FIELD, flex: 1,
            borderColor: error ? 'var(--status-urgent)' : focused ? 'var(--border-focus)' : 'var(--border-default)',
            boxShadow: focused && !error ? 'var(--ring-focus)' : 'none',
            outline: 'none'
          }}
        />
        {showExponent && <ExponentButton onClick={insertE} />}
        <Button type="submit" size="lg" disabled={disabled}>{submitLabel}</Button>
      </form>
      {error && (
        <p role="alert" style={{
          margin: 'var(--space-4) 0 0', color: 'var(--status-urgent)',
          font: 'var(--type-body)', fontSize: 'var(--text-sm)'
        }}>{error}</p>
      )}
    </div>
  );
}

/* Everything else that takes typing: the suggestion form and the history
   restore box. Label above, hint in the label, mono only when numeric. */
export function TextField({
  label, hint, value = '', onChange, placeholder, multiline = false, rows = 3,
  numeric = false, maxLength, trailing = null, style
}) {
  const [focused, setFocused] = React.useState(false);
  const Tag = multiline ? 'textarea' : 'input';
  const field = (
    <Tag
      value={value} rows={multiline ? rows : undefined} maxLength={maxLength}
      onChange={(e) => onChange && onChange(e.target.value)}
      onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
      placeholder={placeholder} spellCheck="false" autoComplete="off"
      inputMode={numeric ? 'decimal' : undefined}
      style={{
        ...FIELD,
        padding: multiline ? '0.55rem 0.7rem' : '0.62rem 0.75rem',
        fontSize: numeric ? 'var(--text-md)' : 'var(--text-sm)',
        fontFamily: numeric ? 'var(--font-mono)' : 'var(--font-sans)',
        resize: multiline ? 'vertical' : undefined,
        borderColor: focused ? 'var(--border-focus)' : 'var(--border-default)',
        outline: 'none', flex: 1
      }}
    />
  );
  return (
    <label style={{ display: 'block', marginTop: 'var(--space-5)', ...style }}>
      {label && (
        <span style={{
          display: 'block', marginBottom: 'var(--space-2)',
          font: 'var(--type-eyebrow)', color: 'var(--text-muted)'
        }}>
          {label}{hint && <em style={{ fontStyle: 'normal', opacity: 0.7 }}> {hint}</em>}
        </span>
      )}
      {trailing
        ? <span style={{ display: 'flex', gap: 'var(--space-4)' }}>{field}{trailing}</span>
        : field}
    </label>
  );
}
