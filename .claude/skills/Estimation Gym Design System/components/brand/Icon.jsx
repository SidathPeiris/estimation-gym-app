import React from 'react';

/* Lucide SVGs, copied into assets/icons/ from lucide-icons/lucide. The file is
   fetched once, cached, and inlined so the glyph is real DOM — that way it
   inherits currentColor and survives being screenshotted or printed. Set
   window.EG_ICON_BASE on the page (or pass `base`) to point at assets/icons
   from wherever the page lives. */
const FALLBACK_BASE = 'assets/icons';
const CACHE = {};

/* The vendored files carry a ~7.7KB C2PA signing manifest each, added when they
   were copied in (it is not in lucide upstream). Inlining that verbatim put
   ~123KB of base64 into a single screen's DOM, dragged it into the clipboard on
   any text selection, and made textContent useless for tests and a11y tooling.
   Stripped once per URL, before caching. */
function clean(svg) {
  return svg.replace(/<metadata>[\s\S]*?<\/metadata>/gi, '');
}

export function Icon({ name, size = 18, color = 'currentColor', base, title, style, ...rest }) {
  const root = base || (typeof window !== 'undefined' && window.EG_ICON_BASE) || FALLBACK_BASE;
  const url = root + '/' + name + '.svg';
  const [markup, setMarkup] = React.useState(CACHE[url] || '');

  React.useEffect(() => {
    if (CACHE[url]) { setMarkup(CACHE[url]); return undefined; }
    let live = true;
    fetch(url)
      .then((r) => (r.ok ? r.text() : ''))
      .then((text) => { const svg = clean(text); CACHE[url] = svg; if (live) setMarkup(svg); })
      .catch(() => {});
    return () => { live = false; };
  }, [url]);

  return (
    <span
      className="eg-icon"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
      {...rest}
      dangerouslySetInnerHTML={{ __html: markup }}
      style={{
        display: 'inline-flex', flex: '0 0 auto',
        width: size, height: size, color: color,
        ...style
      }}
    />
  );
}
