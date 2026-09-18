import React from 'react';
import { Icon } from '../brand/Icon.jsx';

/* The four scoring bands, their hue, and the glyph that stands in for them in
   tight spaces. Names, order and thresholds are the Model's; the per-band
   colour is the redesign (source shares one blue across Bullseye and Close). */
export const BANDS = {
  Bullseye: { colour: 'var(--band-bullseye)', icon: 'target', meaning: 'within about 2x', points: 100 },
  Close: { colour: 'var(--band-close)', icon: 'circle-check-big', meaning: 'within 10x', points: 70 },
  Ballpark: { colour: 'var(--band-ballpark)', icon: 'circle-alert', meaning: 'within 100x', points: 40 },
  Off: { colour: 'var(--band-off)', icon: 'x', meaning: 'more than 100x out', points: 10 }
};

export function bandColour(band) {
  return (BANDS[band] || BANDS.Off).colour;
}

/* Band as a pill. `dot` for history rows, `pill` for a result head, `plain`
   for the scoring table where the colour carries it alone. */
export function BandTag({ band = 'Close', variant = 'pill', size = 'md', assisted = false, style, ...rest }) {
  const meta = BANDS[band] || BANDS.Off;
  const sm = size === 'sm';
  if (variant === 'plain') {
    return (
      <span {...rest} style={{
        font: 'var(--type-label)', fontSize: sm ? 'var(--text-sm)' : 'var(--text-base)',
        color: meta.colour, whiteSpace: 'nowrap', ...style
      }}>{band}{assisted && <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}> · hint</span>}</span>
    );
  }
  if (variant === 'dot') {
    return (
      <span {...rest} style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', ...style }}>
        <i style={{ width: 7, height: 7, borderRadius: 'var(--radius-circle)', background: meta.colour, flex: '0 0 auto' }} />
        <span style={{ font: 'var(--type-label)', fontSize: 'var(--text-sm)', color: meta.colour }}>{band}</span>
        {assisted && <span style={{ font: 'var(--type-eyebrow)', color: 'var(--text-faint)' }}>hint</span>}
      </span>
    );
  }
  return (
    <span {...rest} style={{
      display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)',
      padding: sm ? '3px 9px' : '5px 12px 5px 10px',
      borderRadius: 'var(--radius-pill)',
      background: 'color-mix(in srgb, ' + meta.colour + ' 14%, transparent)',
      border: '1px solid color-mix(in srgb, ' + meta.colour + ' 45%, transparent)',
      color: meta.colour, font: 'var(--type-label)',
      fontSize: sm ? 'var(--text-xs)' : 'var(--text-base)', whiteSpace: 'nowrap', ...style
    }}>
      <Icon name={meta.icon} size={sm ? 12 : 15} />
      {band}
      {assisted && <span style={{ opacity: 0.7, fontWeight: 400 }}>· hint</span>}
    </span>
  );
}

/* Points, always mono, always signed. Practice earns none, so the slot says so
   rather than showing a number — the source's own rule. */
export function PointsTag({ points = 0, band = 'Close', assisted = false, practice = false, size = 'md', style, ...rest }) {
  if (practice) {
    return (
      <span {...rest} style={{
        font: 'var(--type-eyebrow)', fontSize: 'var(--text-2xs)', letterSpacing: '0.06em',
        textTransform: 'uppercase', color: 'var(--text-muted)', opacity: 0.8, ...style
      }}>practice</span>
    );
  }
  return (
    <span {...rest} style={{
      font: 'var(--type-numeric)', fontSize: size === 'lg' ? 'var(--text-2xl)' : 'var(--text-md)',
      color: bandColour(band), whiteSpace: 'nowrap', ...style
    }}>
      +{points}<span style={{ fontSize: '0.7em', fontWeight: 500 }}> pts</span>
      {assisted && <span style={{ color: 'var(--text-muted)', fontSize: '0.7em', fontWeight: 400 }}> · hint</span>}
    </span>
  );
}
