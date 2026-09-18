import React from 'react';

/* The bullseye. Drawn from the same geometry the source app uses in
   tools/og-card.html and install/index.html (three concentric rings, the
   innermost filled) rather than served from icons/*.png, because the PNGs have
   the page background baked into the plate. */
export function Brandmark({ size = 44, tone = 'brand', ringPulse = false, style, ...rest }) {
  const rings = tone === 'brand'
    ? ['var(--accent-ring)', 'var(--accent-deep)', 'var(--accent)']
    : ['color-mix(in srgb, currentColor 38%, transparent)', 'color-mix(in srgb, currentColor 68%, transparent)', 'currentColor'];
  const band = Math.max(2, Math.round(size * 0.0867));
  const ring = (i, d, colour) => (
    <i key={i} style={{
      position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
      borderRadius: 'var(--radius-circle)', display: 'block',
      width: d, height: d, border: band + 'px solid ' + colour
    }} />
  );
  return (
    <span {...rest} style={{ position: 'relative', display: 'inline-block', width: size, height: size, flex: '0 0 auto', ...style }}>
      {ring(0, size, rings[0])}
      {ring(1, Math.round(size * 0.667), rings[1])}
      <i style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)',
        borderRadius: 'var(--radius-circle)', display: 'block',
        width: Math.round(size * 0.267), height: Math.round(size * 0.267), background: rings[2]
      }} />
      {ringPulse && (
        <i style={{
          position: 'absolute', inset: 0, borderRadius: 'var(--radius-circle)',
          border: '2px solid var(--accent)', animation: 'eg-ring-out 2.4s var(--ease-out) infinite'
        }} />
      )}
    </span>
  );
}

/* Mark plus name, as it appears in the app header and on the install page. */
export function Wordmark({ size = 'md', showMark = true, tagline = null, align = 'left', style, ...rest }) {
  const scale = { sm: { mark: 26, text: 'var(--text-lg)' }, md: { mark: 38, text: 'var(--text-2xl)' }, lg: { mark: 84, text: 'var(--display-md)' } }[size] || {};
  const column = size === 'lg';
  return (
    <span {...rest} style={{
      display: 'flex', flexDirection: column ? 'column' : 'row',
      alignItems: column ? (align === 'center' ? 'center' : 'flex-start') : 'center',
      gap: column ? 'var(--space-7)' : 'var(--space-4)',
      textAlign: column && align === 'center' ? 'center' : 'left', ...style
    }}>
      {showMark && <Brandmark size={scale.mark} />}
      <span>
        <span style={{
          display: 'block', font: 'var(--type-title)', fontSize: scale.text,
          letterSpacing: 'var(--track-display)', color: 'var(--text-display)'
        }}>
          Estimation <span style={{ color: 'var(--accent)' }}>Gym</span>
        </span>
        {tagline && (
          <span style={{
            display: 'block', marginTop: 'var(--space-2)', font: 'var(--type-body)',
            fontSize: size === 'lg' ? 'var(--text-lg)' : 'var(--text-sm)', color: 'var(--text-secondary)'
          }}>{tagline}</span>
        )}
      </span>
    </span>
  );
}
