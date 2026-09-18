/* @ds-bundle: {"format":4,"namespace":"EstimationGymDesignSystem_4a01b0","components":[{"name":"Brandmark","sourcePath":"components/brand/Brandmark.jsx"},{"name":"Wordmark","sourcePath":"components/brand/Brandmark.jsx"},{"name":"Icon","sourcePath":"components/brand/Icon.jsx"},{"name":"BandBars","sourcePath":"components/data/BandBars.jsx"},{"name":"StatTile","sourcePath":"components/data/BandBars.jsx"},{"name":"HistoryRow","sourcePath":"components/data/HistoryRow.jsx"},{"name":"ArchetypeRow","sourcePath":"components/data/HistoryRow.jsx"},{"name":"Chip","sourcePath":"components/display/Chip.jsx"},{"name":"Eyebrow","sourcePath":"components/display/Chip.jsx"},{"name":"StreakBadge","sourcePath":"components/display/Chip.jsx"},{"name":"Callout","sourcePath":"components/feedback/Callout.jsx"},{"name":"Banner","sourcePath":"components/feedback/Callout.jsx"},{"name":"FootNote","sourcePath":"components/feedback/Callout.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"IconButton","sourcePath":"components/forms/Button.jsx"},{"name":"ExponentButton","sourcePath":"components/forms/Button.jsx"},{"name":"GuessField","sourcePath":"components/forms/GuessField.jsx"},{"name":"TextField","sourcePath":"components/forms/GuessField.jsx"},{"name":"BANDS","sourcePath":"components/game/BandTag.jsx"},{"name":"BandTag","sourcePath":"components/game/BandTag.jsx"},{"name":"PointsTag","sourcePath":"components/game/BandTag.jsx"},{"name":"QuestionCard","sourcePath":"components/game/QuestionCard.jsx"},{"name":"ResultCard","sourcePath":"components/game/ResultCard.jsx"},{"name":"ScoringTable","sourcePath":"components/game/ScoringTable.jsx"},{"name":"StepList","sourcePath":"components/game/ScoringTable.jsx"},{"name":"SHARE_EMOJI","sourcePath":"components/game/ShareCard.jsx"},{"name":"BandRun","sourcePath":"components/game/ShareCard.jsx"},{"name":"ShareCard","sourcePath":"components/game/ShareCard.jsx"},{"name":"AppHeader","sourcePath":"components/navigation/AppHeader.jsx"},{"name":"ReminderToggle","sourcePath":"components/navigation/AppHeader.jsx"},{"name":"Disclosure","sourcePath":"components/navigation/Disclosure.jsx"}],"sourceHashes":{"components/brand/Brandmark.jsx":"a4b036085ee7","components/brand/Icon.jsx":"facb22577028","components/data/BandBars.jsx":"7ae6cef5c3f4","components/data/HistoryRow.jsx":"123aff21e95f","components/display/Chip.jsx":"40d8332bf1bd","components/feedback/Callout.jsx":"29abede2c5fa","components/forms/Button.jsx":"1a5c49452224","components/forms/GuessField.jsx":"18d718187b85","components/game/BandTag.jsx":"c26a7bd04652","components/game/QuestionCard.jsx":"db7bf408030a","components/game/ResultCard.jsx":"4ad5ce47f1b9","components/game/ScoringTable.jsx":"084a231f719b","components/game/ShareCard.jsx":"9e40066c77fb","components/navigation/AppHeader.jsx":"3c85ae4c4c5d","components/navigation/Disclosure.jsx":"3c5616050067","ui_kits/app/AppShell.jsx":"069e52bb0169","ui_kits/app/GuideScreen.jsx":"646e34a2e0d7","ui_kits/app/PracticeScreen.jsx":"368344b28c0c","ui_kits/app/StatsScreen.jsx":"1433bcebb695","ui_kits/app/TodayScreen.jsx":"a99cfb22063e","ui_kits/app/data.js":"7e1787f73d13","ui_kits/install/InstallPage.jsx":"ca10be9c2bba"},"inlinedExternals":[],"unexposedExports":[{"name":"bandColour","sourcePath":"components/game/BandTag.jsx"}]} */

(() => {

const __ds_ns = (window.EstimationGymDesignSystem_4a01b0 = window.EstimationGymDesignSystem_4a01b0 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Brandmark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The bullseye. Drawn from the same geometry the source app uses in
   tools/og-card.html and install/index.html (three concentric rings, the
   innermost filled) rather than served from icons/*.png, because the PNGs have
   the page background baked into the plate. */
function Brandmark({
  size = 44,
  tone = 'brand',
  ringPulse = false,
  style,
  ...rest
}) {
  const rings = tone === 'brand' ? ['var(--accent-ring)', 'var(--accent-deep)', 'var(--accent)'] : ['color-mix(in srgb, currentColor 38%, transparent)', 'color-mix(in srgb, currentColor 68%, transparent)', 'currentColor'];
  const band = Math.max(2, Math.round(size * 0.0867));
  const ring = (i, d, colour) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      borderRadius: 'var(--radius-circle)',
      display: 'block',
      width: d,
      height: d,
      border: band + 'px solid ' + colour
    }
  });
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      position: 'relative',
      display: 'inline-block',
      width: size,
      height: size,
      flex: '0 0 auto',
      ...style
    }
  }), ring(0, size, rings[0]), ring(1, Math.round(size * 0.667), rings[1]), /*#__PURE__*/React.createElement("i", {
    style: {
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%,-50%)',
      borderRadius: 'var(--radius-circle)',
      display: 'block',
      width: Math.round(size * 0.267),
      height: Math.round(size * 0.267),
      background: rings[2]
    }
  }), ringPulse && /*#__PURE__*/React.createElement("i", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 'var(--radius-circle)',
      border: '2px solid var(--accent)',
      animation: 'eg-ring-out 2.4s var(--ease-out) infinite'
    }
  }));
}

/* Mark plus name, as it appears in the app header and on the install page. */
function Wordmark({
  size = 'md',
  showMark = true,
  tagline = null,
  align = 'left',
  style,
  ...rest
}) {
  const scale = {
    sm: {
      mark: 26,
      text: 'var(--text-lg)'
    },
    md: {
      mark: 38,
      text: 'var(--text-2xl)'
    },
    lg: {
      mark: 84,
      text: 'var(--display-md)'
    }
  }[size] || {};
  const column = size === 'lg';
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: 'flex',
      flexDirection: column ? 'column' : 'row',
      alignItems: column ? align === 'center' ? 'center' : 'flex-start' : 'center',
      gap: column ? 'var(--space-7)' : 'var(--space-4)',
      textAlign: column && align === 'center' ? 'center' : 'left',
      ...style
    }
  }), showMark && /*#__PURE__*/React.createElement(Brandmark, {
    size: scale.mark
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      font: 'var(--type-title)',
      fontSize: scale.text,
      letterSpacing: 'var(--track-display)',
      color: 'var(--text-display)'
    }
  }, "Estimation ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "Gym")), tagline && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginTop: 'var(--space-2)',
      font: 'var(--type-body)',
      fontSize: size === 'lg' ? 'var(--text-lg)' : 'var(--text-sm)',
      color: 'var(--text-secondary)'
    }
  }, tagline)));
}
Object.assign(__ds_scope, { Brandmark, Wordmark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Brandmark.jsx", error: String((e && e.message) || e) }); }

// components/brand/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
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
function Icon({
  name,
  size = 18,
  color = 'currentColor',
  base,
  title,
  style,
  ...rest
}) {
  const root = base || typeof window !== 'undefined' && window.EG_ICON_BASE || FALLBACK_BASE;
  const url = root + '/' + name + '.svg';
  const [markup, setMarkup] = React.useState(CACHE[url] || '');
  React.useEffect(() => {
    if (CACHE[url]) {
      setMarkup(CACHE[url]);
      return undefined;
    }
    let live = true;
    fetch(url).then(r => r.ok ? r.text() : '').then(text => {
      const svg = clean(text);
      CACHE[url] = svg;
      if (live) setMarkup(svg);
    }).catch(() => {});
    return () => {
      live = false;
    };
  }, [url]);
  return /*#__PURE__*/React.createElement("span", _extends({
    className: "eg-icon",
    role: title ? 'img' : undefined,
    "aria-label": title,
    "aria-hidden": title ? undefined : 'true'
  }, rest, {
    dangerouslySetInnerHTML: {
      __html: markup
    },
    style: {
      display: 'inline-flex',
      flex: '0 0 auto',
      width: size,
      height: size,
      color: color,
      ...style
    }
  }));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Icon.jsx", error: String((e && e.message) || e) }); }

// components/display/Chip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The hairline pill from the install page's objection chips ("no account", "no
   ads", "works offline"). */
function Chip({
  children,
  icon = null,
  tone = null,
  style,
  ...rest
}) {
  const c = tone || 'var(--text-muted)';
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: '0.2rem 0.65rem',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid ' + (tone ? 'color-mix(in srgb, ' + tone + ' 45%, transparent)' : 'var(--border-default)'),
      background: tone ? 'color-mix(in srgb, ' + tone + ' 10%, transparent)' : 'transparent',
      font: 'var(--type-eyebrow)',
      fontSize: 'var(--text-xs)',
      color: c,
      ...style
    }
  }), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 12
  }), children);
}

/* Uppercase, letterspaced section label. The source's .asof and .lbl. */
function Eyebrow({
  children,
  tone = 'var(--text-muted)',
  icon = null,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("p", _extends({}, rest, {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      margin: 0,
      font: 'var(--type-eyebrow)',
      fontSize: 'var(--text-xs)',
      letterSpacing: 'var(--track-eyebrow)',
      textTransform: 'uppercase',
      color: tone,
      ...style
    }
  }), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 12
  }), children);
}

/* Streak and best, which the source prints as "Streak 4 · Best 11". The flame
   lights only when the streak is live. */
function StreakBadge({
  streak = 0,
  best = 0,
  size = 'md',
  style,
  ...rest
}) {
  const live = streak > 0;
  const lg = size === 'lg';
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      padding: lg ? '0.4rem 0.8rem' : '0.25rem 0.6rem',
      borderRadius: 'var(--radius-pill)',
      border: '1px solid ' + (live ? 'color-mix(in srgb, var(--status-warn) 40%, transparent)' : 'var(--border-default)'),
      background: live ? 'color-mix(in srgb, var(--status-warn) 10%, transparent)' : 'transparent',
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "flame",
    size: lg ? 16 : 13,
    color: live ? 'var(--status-warn)' : 'var(--text-faint)'
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontWeight: 'var(--weight-bold)',
      fontSize: lg ? 'var(--text-md)' : 'var(--text-sm)',
      color: live ? 'var(--status-warn)' : 'var(--text-muted)'
    }
  }, streak), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-2xs)',
      color: 'var(--streak-best)',
      textTransform: 'capitalize'
    }
  }, "best ", best));
}
Object.assign(__ds_scope, { Chip, Eyebrow, StreakBadge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Chip.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Callout.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The accent-washed note with a rule down its left edge — the source app's
   .strategy (hint guidance) and .calibration (which way you lean). Rounded on
   three corners only, exactly as app.css draws it. */
function Callout({
  title,
  children,
  tone = 'var(--accent)',
  icon = null,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      marginTop: 'var(--space-6)',
      padding: '0.7rem 0.85rem',
      borderLeft: '2px solid ' + tone,
      borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
      background: 'color-mix(in srgb, ' + tone + ' 8%, transparent)',
      animation: 'eg-rise var(--dur-base) var(--ease-out) both',
      ...style
    }
  }), title && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      font: 'var(--type-label)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-display)'
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 14,
    color: tone
  }), title), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: title ? 'var(--space-2) 0 0' : 0,
      font: 'var(--type-body)',
      fontSize: 'var(--text-sm)',
      lineHeight: 'var(--leading-relaxed)',
      color: 'var(--text-secondary)'
    }
  }, children));
}

/* The full-width bordered notice: the confession prompt and the domain-move
   banner in the source. Title in the accent, body in foreground, actions in a
   wrapping row. */
function Banner({
  title,
  children,
  actions = null,
  tone = 'var(--accent)',
  icon = null,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      padding: 'var(--space-7) var(--space-8)',
      border: '1px solid ' + tone,
      borderRadius: 'var(--radius-xl)',
      background: 'color-mix(in srgb, ' + tone + ' 9%, transparent)',
      animation: 'eg-rise var(--dur-base) var(--ease-out) both',
      ...style
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      font: 'var(--type-label)',
      fontSize: 'var(--text-md)',
      fontFamily: 'var(--font-display)',
      color: tone
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 16
  }), title), /*#__PURE__*/React.createElement("div", {
    style: {
      margin: 'var(--space-3) 0 0',
      font: 'var(--type-body)',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-normal)',
      color: 'var(--text-body)'
    }
  }, children), actions && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-6)'
    }
  }, actions));
}

/* One quiet line of small print: the build stamp, the source offer, the
   privacy note under a toggle. */
function FootNote({
  children,
  align = 'left',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("p", _extends({}, rest, {
    style: {
      margin: 'var(--space-7) 0 0',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)',
      textAlign: align,
      lineHeight: 'var(--leading-normal)',
      ...style
    }
  }), children);
}
Object.assign(__ds_scope, { Callout, Banner, FootNote });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Callout.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SIZES = {
  sm: {
    padding: '9px 14px',
    fontSize: 'var(--text-sm)',
    radius: 'var(--radius-md)',
    gap: 'var(--space-2)',
    icon: 15
  },
  md: {
    padding: '13px 20px',
    fontSize: 'var(--text-md)',
    radius: 'var(--radius-lg)',
    gap: 'var(--space-3)',
    icon: 17
  },
  lg: {
    padding: '14px 24px',
    fontSize: 'var(--text-lg)',
    radius: 'var(--radius-lg)',
    gap: 'var(--space-3)',
    icon: 19
  }
};

/* Four variants, all from the source app: `solid` is the install page's play
   button, `soft` is the tinted Go / Share button, `quiet` is the bordered
   export button, `ghost` is a bare text control. */
function look(variant, tone) {
  const t = tone === 'accent' ? 'var(--accent)' : tone;
  switch (variant) {
    case 'solid':
      return {
        background: t,
        color: 'var(--text-on-accent)',
        border: '1px solid transparent'
      };
    case 'quiet':
      return {
        background: 'transparent',
        color: 'var(--text-muted)',
        border: '1px solid var(--border-default)'
      };
    case 'ghost':
      return {
        background: 'transparent',
        color: t,
        border: '1px solid transparent'
      };
    default:
      return {
        background: 'color-mix(in srgb, ' + t + ' 16%, transparent)',
        color: t,
        border: '1px solid color-mix(in srgb, ' + t + ' 55%, transparent)'
      };
  }
}
function Button({
  children,
  variant = 'soft',
  size = 'md',
  tone = 'accent',
  icon = null,
  iconAfter = null,
  block = false,
  disabled = false,
  as = 'button',
  href,
  style,
  ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  const v = look(variant, tone);
  const Tag = as === 'a' ? 'a' : 'button';
  return /*#__PURE__*/React.createElement(Tag, _extends({}, Tag === 'a' ? {
    href
  } : {
    type: rest.type || 'button'
  }, {
    disabled: Tag === 'button' ? disabled : undefined
  }, rest, {
    style: {
      display: block ? 'flex' : 'inline-flex',
      width: block ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: s.gap,
      padding: s.padding,
      borderRadius: s.radius,
      font: 'var(--type-label)',
      fontSize: s.fontSize,
      fontWeight: 'var(--weight-bold)',
      textDecoration: 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.45 : 1,
      transition: 'var(--transition-control)',
      ...v,
      ...style
    },
    onMouseDown: e => {
      if (!disabled) e.currentTarget.style.transform = 'var(--press-shift)';
    },
    onMouseUp: e => {
      e.currentTarget.style.transform = 'none';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'none';
    }
  }), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.icon
  }), children, iconAfter && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconAfter,
    size: s.icon
  }));
}

/* The ×10ⁿ helper next to the guess field, and the icon-only controls in the
   header. Square, quiet, and never the primary action. */
function IconButton({
  icon,
  label,
  size = 38,
  tone = 'var(--text-muted)',
  active = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    "aria-label": label,
    title: label
  }, rest, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: size,
      height: size,
      flex: '0 0 auto',
      background: active ? 'var(--accent-wash)' : 'transparent',
      border: '1px solid ' + (active ? 'var(--accent-edge)' : 'var(--border-default)'),
      borderRadius: 'var(--radius-md)',
      color: active ? 'var(--accent)' : tone,
      cursor: 'pointer',
      transition: 'var(--transition-control)',
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.46)
  }));
}

/* Scientific notation, as a button. The phone keypad has no "e", so this puts
   one within reach without swapping to the full keyboard. */
function ExponentButton({
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    "aria-label": "Insert scientific notation, times ten to the power",
    title: "Scientific notation: 3 \xD710\u207F 12 is 3e12"
  }, rest, {
    style: {
      flex: '0 0 auto',
      padding: '0 0.7rem',
      background: 'transparent',
      border: '3px dashed var(--border-default)',
      borderRadius: 'var(--radius-md)',
      color: 'var(--text-muted)',
      font: 'inherit',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-base)',
      lineHeight: 1,
      cursor: 'pointer',
      transition: 'var(--transition-control)',
      ...style
    }
  }), "\xD710", /*#__PURE__*/React.createElement("sup", {
    style: {
      fontSize: '0.7em'
    }
  }, "n"));
}
Object.assign(__ds_scope, { Button, IconButton, ExponentButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/GuessField.jsx
try { (() => {
const FIELD = {
  width: '100%',
  minWidth: 0,
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
function GuessField({
  value = '',
  onChange,
  onSubmit,
  unit = '',
  placeholder,
  error = null,
  submitLabel = 'Go',
  disabled = false,
  showExponent = true,
  autoFocus = false,
  style
}) {
  const [focused, setFocused] = React.useState(false);
  const ref = React.useRef(null);
  const insertE = () => {
    const el = ref.current;
    if (onChange) onChange((value || '') + 'e');
    if (el) el.focus();
  };
  return /*#__PURE__*/React.createElement("div", {
    style: style
  }, /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      if (onSubmit) onSubmit(value);
    },
    style: {
      display: 'flex',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("input", {
    ref: ref,
    value: value,
    autoFocus: autoFocus,
    disabled: disabled,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    type: "text",
    inputMode: "decimal",
    autoComplete: "off",
    autoCapitalize: "off",
    spellCheck: "false",
    "aria-label": "Your estimate",
    placeholder: placeholder || (unit ? 'Guess (' + unit + ')' : 'Your estimate'),
    style: {
      ...FIELD,
      flex: 1,
      borderColor: error ? 'var(--status-urgent)' : focused ? 'var(--border-focus)' : 'var(--border-default)',
      boxShadow: focused && !error ? 'var(--ring-focus)' : 'none',
      outline: 'none'
    }
  }), showExponent && /*#__PURE__*/React.createElement(__ds_scope.ExponentButton, {
    onClick: insertE
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    type: "submit",
    size: "lg",
    disabled: disabled
  }, submitLabel)), error && /*#__PURE__*/React.createElement("p", {
    role: "alert",
    style: {
      margin: 'var(--space-4) 0 0',
      color: 'var(--status-urgent)',
      font: 'var(--type-body)',
      fontSize: 'var(--text-sm)'
    }
  }, error));
}

/* Everything else that takes typing: the suggestion form and the history
   restore box. Label above, hint in the label, mono only when numeric. */
function TextField({
  label,
  hint,
  value = '',
  onChange,
  placeholder,
  multiline = false,
  rows = 3,
  numeric = false,
  maxLength,
  trailing = null,
  style
}) {
  const [focused, setFocused] = React.useState(false);
  const Tag = multiline ? 'textarea' : 'input';
  const field = /*#__PURE__*/React.createElement(Tag, {
    value: value,
    rows: multiline ? rows : undefined,
    maxLength: maxLength,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    placeholder: placeholder,
    spellCheck: "false",
    autoComplete: "off",
    inputMode: numeric ? 'decimal' : undefined,
    style: {
      ...FIELD,
      padding: multiline ? '0.55rem 0.7rem' : '0.62rem 0.75rem',
      fontSize: numeric ? 'var(--text-md)' : 'var(--text-sm)',
      fontFamily: numeric ? 'var(--font-mono)' : 'var(--font-sans)',
      resize: multiline ? 'vertical' : undefined,
      borderColor: focused ? 'var(--border-focus)' : 'var(--border-default)',
      outline: 'none',
      flex: 1
    }
  });
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'block',
      marginTop: 'var(--space-5)',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      marginBottom: 'var(--space-2)',
      font: 'var(--type-eyebrow)',
      color: 'var(--text-muted)'
    }
  }, label, hint && /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'normal',
      opacity: 0.7
    }
  }, " ", hint)), trailing ? /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)'
    }
  }, field, trailing) : field);
}
Object.assign(__ds_scope, { GuessField, TextField });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/GuessField.jsx", error: String((e && e.message) || e) }); }

// components/game/BandTag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The four scoring bands, their hue, and the glyph that stands in for them in
   tight spaces. Names, order and thresholds are the Model's; the per-band
   colour is the redesign (source shares one blue across Bullseye and Close). */
const BANDS = {
  Bullseye: {
    colour: 'var(--band-bullseye)',
    icon: 'target',
    meaning: 'within about 2x',
    points: 100
  },
  Close: {
    colour: 'var(--band-close)',
    icon: 'circle-check-big',
    meaning: 'within 10x',
    points: 70
  },
  Ballpark: {
    colour: 'var(--band-ballpark)',
    icon: 'circle-alert',
    meaning: 'within 100x',
    points: 40
  },
  Off: {
    colour: 'var(--band-off)',
    icon: 'x',
    meaning: 'more than 100x out',
    points: 10
  }
};
function bandColour(band) {
  return (BANDS[band] || BANDS.Off).colour;
}

/* Band as a pill. `dot` for history rows, `pill` for a result head, `plain`
   for the scoring table where the colour carries it alone. */
function BandTag({
  band = 'Close',
  variant = 'pill',
  size = 'md',
  assisted = false,
  style,
  ...rest
}) {
  const meta = BANDS[band] || BANDS.Off;
  const sm = size === 'sm';
  if (variant === 'plain') {
    return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
      style: {
        font: 'var(--type-label)',
        fontSize: sm ? 'var(--text-sm)' : 'var(--text-base)',
        color: meta.colour,
        whiteSpace: 'nowrap',
        ...style
      }
    }), band, assisted && /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'var(--text-muted)',
        fontWeight: 400
      }
    }, " \xB7 hint"));
  }
  if (variant === 'dot') {
    return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
        ...style
      }
    }), /*#__PURE__*/React.createElement("i", {
      style: {
        width: 7,
        height: 7,
        borderRadius: 'var(--radius-circle)',
        background: meta.colour,
        flex: '0 0 auto'
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-label)',
        fontSize: 'var(--text-sm)',
        color: meta.colour
      }
    }, band), assisted && /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-eyebrow)',
        color: 'var(--text-faint)'
      }
    }, "hint"));
  }
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: sm ? '3px 9px' : '5px 12px 5px 10px',
      borderRadius: 'var(--radius-pill)',
      background: 'color-mix(in srgb, ' + meta.colour + ' 14%, transparent)',
      border: '1px solid color-mix(in srgb, ' + meta.colour + ' 45%, transparent)',
      color: meta.colour,
      font: 'var(--type-label)',
      fontSize: sm ? 'var(--text-xs)' : 'var(--text-base)',
      whiteSpace: 'nowrap',
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: meta.icon,
    size: sm ? 12 : 15
  }), band, assisted && /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.7,
      fontWeight: 400
    }
  }, "\xB7 hint"));
}

/* Points, always mono, always signed. Practice earns none, so the slot says so
   rather than showing a number — the source's own rule. */
function PointsTag({
  points = 0,
  band = 'Close',
  assisted = false,
  practice = false,
  size = 'md',
  style,
  ...rest
}) {
  if (practice) {
    return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
      style: {
        font: 'var(--type-eyebrow)',
        fontSize: 'var(--text-2xs)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: 'var(--text-muted)',
        opacity: 0.8,
        ...style
      }
    }), "practice");
  }
  return /*#__PURE__*/React.createElement("span", _extends({}, rest, {
    style: {
      font: 'var(--type-numeric)',
      fontSize: size === 'lg' ? 'var(--text-2xl)' : 'var(--text-md)',
      color: bandColour(band),
      whiteSpace: 'nowrap',
      ...style
    }
  }), "+", points, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: '0.7em',
      fontWeight: 500
    }
  }, " pts"), assisted && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-muted)',
      fontSize: '0.7em',
      fontWeight: 400
    }
  }, " \xB7 hint"));
}
Object.assign(__ds_scope, { BANDS, bandColour, BandTag, PointsTag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/game/BandTag.jsx", error: String((e && e.message) || e) }); }

// components/data/BandBars.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The band histogram, used for both your lifetime stats and "how everyone did"
   on the same question. Same visual language in both places, which is how the
   source builds it. */
function BandBars({
  rows = [],
  mine = null,
  showTally = true,
  style,
  ...rest
}) {
  const max = Math.max(...rows.map(r => r.fraction || 0), 0.0001);
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: 'grid',
      gap: 'var(--space-3)',
      ...style
    }
  }), rows.map(r => {
    const isMine = mine === r.band;
    const tone = __ds_scope.bandColour(r.band);
    return /*#__PURE__*/React.createElement("div", {
      key: r.band,
      style: {
        display: 'grid',
        gridTemplateColumns: '5.5rem 1fr 2rem',
        alignItems: 'center',
        gap: 'var(--space-4)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-body)',
        fontSize: 'var(--text-sm)',
        color: isMine ? 'var(--text-display)' : 'var(--text-muted)',
        fontWeight: isMine ? 'var(--weight-bold)' : 'var(--weight-regular)'
      }
    }, r.band), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'block',
        height: 8,
        borderRadius: 'var(--radius-xs)',
        background: 'color-mix(in srgb, var(--text-body) 14%, transparent)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("i", {
      style: {
        display: 'block',
        height: '100%',
        borderRadius: 'var(--radius-xs)',
        width: (r.fraction || 0) / max * 100 + '%',
        background: tone,
        opacity: mine && !isMine ? 0.55 : 1,
        transformOrigin: 'left',
        animation: 'eg-bar-grow var(--dur-slow) var(--ease-out) both'
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'var(--font-mono)',
        fontSize: 'var(--text-sm)',
        color: 'var(--text-muted)',
        textAlign: 'right'
      }
    }, showTally ? r.tally : Math.round((r.fraction || 0) * 100) + '%'));
  }));
}

/* A lifetime number with its label. Three or four across, above the bars. */
function StatTile({
  label,
  value,
  sub = null,
  tone = 'var(--text-display)',
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      padding: 'var(--space-6) var(--space-7)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-eyebrow)',
      fontSize: 'var(--text-2xs)',
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-2)',
      fontFamily: 'var(--font-mono)',
      fontWeight: 'var(--weight-bold)',
      fontSize: 'var(--text-2xl)',
      lineHeight: 1,
      color: tone
    }
  }, value), sub && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-2)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-faint)'
    }
  }, sub));
}
Object.assign(__ds_scope, { BandBars, StatTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/BandBars.jsx", error: String((e && e.message) || e) }); }

// components/data/HistoryRow.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* One past day. Only what was actually recorded is shown — date, band, guess,
   the value it was scored against. The question text is deliberately absent:
   it is not stored, and the day number cannot be used to look it up. */
function HistoryRow({
  date,
  band = 'Close',
  guess,
  actual,
  decades,
  assisted = false,
  comparable = false,
  open = false,
  onClick,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("li", _extends({
    onClick: comparable ? onClick : undefined,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest, {
    style: {
      display: 'grid',
      gridTemplateColumns: '5.5rem 1fr auto',
      alignItems: 'baseline',
      gap: 'var(--space-4)',
      padding: 'var(--space-3) var(--space-3)',
      margin: '0 calc(var(--space-3) * -1)',
      borderRadius: 'var(--radius-md)',
      borderBottom: '1px solid color-mix(in srgb, var(--border-default) 60%, transparent)',
      cursor: comparable ? 'pointer' : 'default',
      background: open || hover && comparable ? 'color-mix(in srgb, var(--text-body) 4%, transparent)' : 'transparent',
      transition: 'var(--transition-control)',
      listStyle: 'none',
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      color: hover && comparable ? 'var(--text-body)' : 'var(--text-muted)'
    }
  }, date), /*#__PURE__*/React.createElement(__ds_scope.BandTag, {
    band: band,
    variant: "plain",
    size: "sm",
    assisted: assisted
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-faint)',
      textAlign: 'right'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, guess, " \u2192 ", actual), decades !== undefined && decades !== null && /*#__PURE__*/React.createElement("span", {
    style: {
      whiteSpace: 'nowrap'
    }
  }, " \xB7 ", Number(decades).toFixed(2)), comparable && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: open ? 'chevron-down' : 'chevron-right',
    size: 12,
    style: {
      marginLeft: 6,
      verticalAlign: 'middle'
    }
  })), open && children && /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1 / -1',
      marginTop: 'var(--space-3)',
      paddingTop: 'var(--space-3)',
      borderTop: '1px solid var(--border-default)'
    }
  }, children));
}

/* Which shapes of problem you are good at. One row per reasoning archetype,
   labels straight from Model.STRATEGIES. */
function ArchetypeRow({
  label,
  played = 0,
  median = null,
  thin = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr auto auto',
      alignItems: 'baseline',
      gap: 'var(--space-3)',
      padding: 'var(--space-1) 0',
      fontSize: 'var(--text-sm)',
      ...style
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: thin ? 'var(--text-muted)' : 'var(--text-body)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)'
    }
  }, played, " played"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      textAlign: 'right',
      whiteSpace: 'nowrap',
      minWidth: '4.5rem'
    }
  }, median !== null ? Number(median).toFixed(2) + ' off' : '—'));
}
Object.assign(__ds_scope, { HistoryRow, ArchetypeRow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/data/HistoryRow.jsx", error: String((e && e.message) || e) }); }

// components/game/QuestionCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const MODES = {
  daily: {
    tint: 'var(--mode-daily)',
    label: "Today's question",
    icon: 'calendar-days'
  },
  practice: {
    tint: 'var(--mode-practice)',
    label: 'Practice',
    icon: 'dumbbell'
  }
};

/* The question, in either of the product's two modes. Daily is the one
   everybody gets on the same calendar day; practice draws from the far end of
   the same queue. The eyebrow carries the mode, the rule down the left edge
   carries its colour, and — where the answer drifts with time — the "as of"
   year the bank records. */
function QuestionCard({
  prompt,
  date = null,
  asOf = null,
  mode = 'daily',
  label = null,
  icon = null,
  number = null,
  archetype = null,
  badge = null,
  answered = false,
  children,
  style,
  ...rest
}) {
  const m = MODES[mode] || MODES.daily;
  return /*#__PURE__*/React.createElement("section", _extends({}, rest, {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      boxShadow: 'var(--shadow-card)',
      padding: 'var(--card-pad)',
      animation: 'eg-rise var(--dur-reveal) var(--ease-out) both',
      ...style
    }
  }), /*#__PURE__*/React.createElement("i", {
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: 3,
      background: m.tint,
      opacity: answered ? 0.45 : 1
    }
  }), /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-5)',
      flexWrap: 'wrap'
    }
  }, badge, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon || m.icon,
    size: 14,
    color: m.tint
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-eyebrow)',
      fontSize: 'var(--text-2xs)',
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: m.tint,
      fontWeight: 'var(--weight-semibold)'
    }
  }, label || m.label)), (date || number !== null) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)',
      letterSpacing: '0.02em'
    }
  }, date, date && number !== null && ' · ', number !== null && '#' + number)), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-6)',
      font: 'var(--type-prompt)',
      color: 'var(--text-display)',
      fontFamily: 'var(--font-display)',
      fontWeight: 'var(--weight-semibold)',
      letterSpacing: 'var(--track-tight)'
    }
  }, prompt), (asOf || archetype) && /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-2)',
      font: 'var(--type-eyebrow)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, asOf && /*#__PURE__*/React.createElement("em", {
    style: {
      fontStyle: 'italic'
    }
  }, "as of ", asOf), asOf && archetype && ' · ', archetype), children && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-9)'
    }
  }, children));
}
Object.assign(__ds_scope, { QuestionCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/game/QuestionCard.jsx", error: String((e && e.message) || e) }); }

// components/game/ResultCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* A scored day. Same information the source shows — band, points, your guess,
   the actual value, the distance in decades — with the decade distance drawn as
   a ruler instead of stated in prose, because "off by 0.42 orders of magnitude"
   is the one line every new player has to re-read. */
function ResultCard({
  band = 'Close',
  points = 70,
  guess,
  actual,
  unit = '',
  decades = 0,
  assisted = false,
  practice = false,
  children,
  style,
  ...rest
}) {
  const tone = __ds_scope.bandColour(band);
  const pct = Math.max(2, Math.min(100, Math.min(decades, 3) / 3 * 100));
  return /*#__PURE__*/React.createElement("section", _extends({}, rest, {
    style: {
      borderRadius: 'var(--radius-xl)',
      border: '1px solid color-mix(in srgb, ' + tone + ' 45%, transparent)',
      background: 'color-mix(in srgb, ' + tone + ' 11%, transparent)',
      padding: 'var(--space-8) var(--card-pad)',
      animation: 'eg-pop var(--dur-base) var(--ease-spring) both',
      ...style
    }
  }), /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-5)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BandTag, {
    band: band,
    assisted: assisted
  }), /*#__PURE__*/React.createElement(__ds_scope.PointsTag, {
    points: points,
    band: band,
    practice: practice,
    size: "lg"
  })), /*#__PURE__*/React.createElement("dl", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'auto 1fr',
      gap: 'var(--space-2) var(--space-5)',
      margin: 'var(--space-7) 0 0',
      font: 'var(--type-body)',
      fontSize: 'var(--text-base)'
    }
  }, /*#__PURE__*/React.createElement("dt", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Your guess"), /*#__PURE__*/React.createElement("dd", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--result-guess)',
      margin: 0,
      textTransform: 'capitalize'
    }
  }, guess, " ", unit), /*#__PURE__*/React.createElement("dt", {
    style: {
      color: 'var(--text-muted)'
    }
  }, "Actual"), /*#__PURE__*/React.createElement("dd", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--result-actual)',
      margin: 0,
      fontWeight: 'var(--weight-bold)',
      textTransform: 'capitalize'
    }
  }, actual, " ", unit)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      font: 'var(--type-eyebrow)',
      fontSize: 'var(--text-2xs)',
      letterSpacing: 'var(--track-label)',
      textTransform: 'uppercase',
      color: 'var(--text-muted)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "Orders of magnitude off"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: tone,
      letterSpacing: 0
    }
  }, Number(decades).toFixed(2))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginTop: 'var(--space-3)',
      height: 8,
      borderRadius: 'var(--radius-xs)',
      background: 'color-mix(in srgb, var(--text-body) 14%, transparent)',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("i", {
    style: {
      position: 'absolute',
      inset: '0 auto 0 0',
      width: pct + '%',
      background: tone,
      borderRadius: 'var(--radius-xs)',
      transformOrigin: 'left',
      animation: 'eg-bar-grow var(--dur-slow) var(--ease-out) both'
    }
  }), [33.3, 66.6].map(x => /*#__PURE__*/React.createElement("i", {
    key: x,
    style: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: x + '%',
      width: 1,
      background: 'var(--surface-page)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: 'var(--space-2)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)'
    }
  }, /*#__PURE__*/React.createElement("span", null, "exact"), /*#__PURE__*/React.createElement("span", null, "10\xD7"), /*#__PURE__*/React.createElement("span", null, "100\xD7"), /*#__PURE__*/React.createElement("span", null, "1000\xD7"))), children && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-8)'
    }
  }, children));
}
Object.assign(__ds_scope, { ResultCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/game/ResultCard.jsx", error: String((e && e.message) || e) }); }

// components/game/ScoringTable.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* How to play, scoring half. Rows are derived from the band table rather than
   written out, the same rule core/Model.js follows, so a repriced band cannot
   leave the guide saying something untrue. */
function ScoringTable({
  compact = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("table", _extends({}, rest, {
    style: {
      width: '100%',
      borderCollapse: 'collapse',
      font: 'var(--type-body)',
      fontSize: compact ? 'var(--text-sm)' : 'var(--text-base)',
      ...style
    }
  }), /*#__PURE__*/React.createElement("tbody", null, Object.keys(__ds_scope.BANDS).map((band, i, all) => /*#__PURE__*/React.createElement("tr", {
    key: band
  }, /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '0.45rem 0',
      verticalAlign: 'baseline',
      borderBottom: i === all.length - 1 ? 0 : '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.BandTag, {
    band: band,
    variant: "plain"
  })), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '0.45rem 0 0.45rem 0.6rem',
      color: 'var(--text-muted)',
      verticalAlign: 'baseline',
      borderBottom: i === all.length - 1 ? 0 : '1px solid var(--border-default)'
    }
  }, __ds_scope.BANDS[band].meaning), /*#__PURE__*/React.createElement("td", {
    style: {
      padding: '0.45rem 0',
      textAlign: 'right',
      whiteSpace: 'nowrap',
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-secondary)',
      verticalAlign: 'baseline',
      borderBottom: i === all.length - 1 ? 0 : '1px solid var(--border-default)'
    }
  }, __ds_scope.BANDS[band].points, " pts")))));
}

/* Numbered steps, as How to play uses them. */
function StepList({
  steps = [],
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("ol", _extends({}, rest, {
    style: {
      margin: 0,
      paddingLeft: '1.15rem',
      ...style
    }
  }), steps.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    style: {
      margin: '0 0 var(--space-4)',
      font: 'var(--type-body)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-body)'
    }
  }, s))));
}
Object.assign(__ds_scope, { ScoringTable, StepList });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/game/ScoringTable.jsx", error: String((e && e.message) || e) }); }

// components/game/ShareCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The squares a shared result is made of. Kept identical to presenter.js
   BAND_EMOJI / MISSED_EMOJI, because the text people paste has to match the
   card they were looking at. */
const SHARE_EMOJI = {
  Bullseye: '🎯',
  Close: '🟢',
  Ballpark: '🟡',
  Off: '🔴',
  missed: '⬜'
};

/* Seven calendar days, oldest to newest, as band squares. Calendar days rather
   than played days — a gap reads as a gap, because the streak is the point and
   closing the misses up would misrepresent it. Leading gaps are trimmed, so a
   first-ever day posts one square rather than six blanks and a square. */
function BandRun({
  run = [],
  size = 30,
  gap = 6,
  style,
  ...rest
}) {
  const trimmed = run.slice();
  while (trimmed.length && !trimmed[0]) trimmed.shift();
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    style: {
      display: 'flex',
      gap,
      flexWrap: 'wrap',
      ...style
    }
  }), trimmed.map((band, i) => {
    const missed = !band;
    return /*#__PURE__*/React.createElement("span", {
      key: i,
      title: band || 'not played',
      style: {
        width: size,
        height: size,
        borderRadius: 'var(--radius-sm)',
        flex: '0 0 auto',
        background: missed ? 'transparent' : 'color-mix(in srgb, ' + __ds_scope.bandColour(band) + ' 22%, transparent)',
        border: '1px solid ' + (missed ? 'var(--border-default)' : 'color-mix(in srgb, ' + __ds_scope.bandColour(band) + ' 65%, transparent)'),
        display: 'grid',
        placeItems: 'center'
      }
    }, !missed && /*#__PURE__*/React.createElement("i", {
      style: {
        width: Math.round(size * 0.34),
        height: Math.round(size * 0.34),
        borderRadius: 'var(--radius-circle)',
        background: __ds_scope.bandColour(band),
        display: 'block'
      }
    }));
  }));
}

/* The shareable result.
   Deliberately omits the guess, the true value and the question itself — a
   shared result has to be safe to post before anybody else has played, and the
   band conveys how it went without giving anything away. The mono block at the
   bottom is exactly what lands on the clipboard, shown so nobody has to guess
   what they are about to post. */
function ShareCard({
  date,
  band = 'Close',
  decades = null,
  streak = 0,
  run = [],
  url = 'estimationgym.app',
  assisted = false,
  text = null,
  onShare,
  onCopy,
  copied = false,
  style,
  ...rest
}) {
  const tone = __ds_scope.bandColour(band);
  const line = SHARE_EMOJI[band] + ' ' + band + (decades !== null && decades !== undefined ? ' · ' + Number(decades).toFixed(2) + ' decades off' : '') + (assisted ? ' · hint' : '');
  const squares = (() => {
    const t = run.slice();
    while (t.length && !t[0]) t.shift();
    return t.map(b => b ? SHARE_EMOJI[b] : SHARE_EMOJI.missed).join('');
  })();
  const payload = text !== null ? text : ['Estimation Gym · ' + date, squares, line, 'Streak ' + streak, '', url].join('\n');
  return /*#__PURE__*/React.createElement("section", _extends({}, rest, {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-2xl)',
      boxShadow: 'var(--shadow-raised)',
      padding: 'var(--card-pad)',
      animation: 'eg-rise var(--dur-base) var(--ease-out) both',
      ...style
    }
  }), /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Brandmark, {
    size: 22
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      fontSize: 'var(--text-base)',
      fontFamily: 'var(--font-display)',
      color: 'var(--text-display)'
    }
  }, "Estimation Gym"), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 'auto',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)'
    }
  }, date)), /*#__PURE__*/React.createElement(BandRun, {
    run: run,
    style: {
      marginTop: 'var(--space-8)'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-8) 0 0',
      display: 'flex',
      alignItems: 'baseline',
      gap: 'var(--space-3)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      fontSize: 'var(--text-xl)',
      fontFamily: 'var(--font-display)',
      color: tone
    }
  }, band), decades !== null && decades !== undefined && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, Number(decades).toFixed(2), " decades off"), assisted && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-eyebrow)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)'
    }
  }, "hint")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-2) 0 0',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "flame",
    size: 13,
    color: streak > 0 ? 'var(--status-warn)' : 'var(--text-faint)'
  }), "Streak ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      color: 'var(--text-display)'
    }
  }, streak)), /*#__PURE__*/React.createElement("pre", {
    style: {
      margin: 'var(--space-8) 0 0',
      padding: 'var(--space-5) var(--space-6)',
      background: 'var(--surface-sunken)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      lineHeight: 'var(--leading-snug)',
      color: 'var(--text-muted)',
      whiteSpace: 'pre-wrap',
      overflowWrap: 'anywhere'
    }
  }, payload), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-3) 0 0',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)'
    }
  }, "Your guess, the answer and the question are all left out, so this is safe to post before anyone else has played."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onShare,
    style: {
      flex: 1,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-3)',
      minHeight: 'var(--tap-min)',
      padding: '13px 20px',
      background: 'var(--accent-wash-strong)',
      border: '1px solid var(--accent-edge)',
      borderRadius: 'var(--radius-lg)',
      color: 'var(--accent)',
      font: 'var(--type-label)',
      fontSize: 'var(--text-md)',
      cursor: 'pointer',
      transition: 'var(--transition-control)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "share-2",
    size: 16
  }), "Share"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onCopy,
    style: {
      flex: '0 0 auto',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--space-3)',
      minHeight: 'var(--tap-min)',
      padding: '13px 18px',
      background: 'transparent',
      border: '1px solid ' + (copied ? 'color-mix(in srgb, var(--status-good) 55%, transparent)' : 'var(--border-default)'),
      borderRadius: 'var(--radius-lg)',
      color: copied ? 'var(--status-good)' : 'var(--text-muted)',
      font: 'var(--type-label)',
      fontSize: 'var(--text-md)',
      cursor: 'pointer',
      transition: 'var(--transition-control)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: copied ? 'check' : 'copy',
    size: 16
  }), copied ? 'Copied' : 'Copy')));
}
Object.assign(__ds_scope, { SHARE_EMOJI, BandRun, ShareCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/game/ShareCard.jsx", error: String((e && e.message) || e) }); }

// components/navigation/AppHeader.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* The app's one header: mark, name, the day, streak, and the reminder bell. */
function AppHeader({
  date = null,
  streak = 0,
  best = 0,
  reminderOn = false,
  onReminder,
  onMenu,
  compact = false,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("header", _extends({}, rest, {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-5)',
      flexWrap: 'wrap',
      ...style
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Brandmark, {
    size: compact ? 26 : 32
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: 'var(--type-title)',
      fontSize: compact ? 'var(--text-lg)' : 'var(--text-2xl)',
      color: 'var(--text-display)',
      letterSpacing: 'var(--track-display)'
    }
  }, "Estimation ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--accent)'
    }
  }, "Gym"))), date && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)',
      marginTop: 2
    }
  }, date)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StreakBadge, {
    streak: streak,
    best: best
  }), /*#__PURE__*/React.createElement(ReminderToggle, {
    on: reminderOn,
    onClick: onReminder
  }), onMenu && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onMenu,
    "aria-label": "Settings",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 32,
      height: 32,
      background: 'transparent',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-pill)',
      color: 'var(--text-muted)',
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "settings",
    size: 14
  }))));
}

/* The bell in the header corner. On is worth seeing at a glance; Off stays
   quiet — the source's own rule. */
function ReminderToggle({
  on = false,
  label = true,
  onClick,
  style,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    onClick: onClick,
    "data-on": on ? 'true' : 'false',
    "aria-label": "Daily reminder",
    title: "Daily reminder"
  }, rest, {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-2)',
      padding: label ? '0.3rem 0.6rem' : '0.35rem',
      background: on ? 'var(--accent-wash)' : 'transparent',
      border: '1px solid ' + (on ? 'var(--accent-edge)' : 'var(--border-default)'),
      borderRadius: 'var(--radius-pill)',
      color: on ? 'var(--accent)' : 'var(--text-muted)',
      font: 'var(--type-eyebrow)',
      fontSize: 'var(--text-xs)',
      lineHeight: 1,
      cursor: 'pointer',
      transition: 'var(--transition-control)',
      ...style
    }
  }), /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: on ? 'bell' : 'bell-off',
    size: 13,
    color: "var(--reminder-bell)"
  }), label && /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 'var(--weight-bold)',
      color: 'var(--reminder-bell)'
    }
  }, on ? 'On' : 'Off'));
}
Object.assign(__ds_scope, { AppHeader, ReminderToggle });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/AppHeader.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Disclosure.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Every secondary section of the app is one of these: Practice, How to play,
   History, Stats, Suggest a question. Title left, summary right, chevron
   turns. They share one separator rule so the run reads as a list. */
function Disclosure({
  title,
  summary = null,
  icon = null,
  open: openProp,
  defaultOpen = false,
  onToggle,
  children,
  divider = true,
  style,
  ...rest
}) {
  const [openState, setOpenState] = React.useState(defaultOpen);
  const open = openProp === undefined ? openState : openProp;
  const toggle = () => {
    if (openProp === undefined) setOpenState(!open);
    if (onToggle) onToggle(!open);
  };
  return /*#__PURE__*/React.createElement("section", _extends({}, rest, {
    style: {
      marginTop: 'var(--space-11)',
      borderTop: divider ? '1px solid var(--border-default)' : 0,
      paddingTop: divider ? 'var(--space-8)' : 0,
      ...style
    }
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: toggle,
    "aria-expanded": open,
    style: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-5)',
      background: 'none',
      border: 0,
      padding: 'var(--space-1) 0',
      color: 'inherit',
      font: 'inherit',
      cursor: 'pointer',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "chevron-right",
    size: 14,
    color: "var(--text-muted)",
    style: {
      transform: open ? 'rotate(90deg)' : 'none',
      transition: 'transform var(--dur-fast) var(--ease-out)'
    }
  }), icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 15,
    color: "var(--text-secondary)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-display)'
    }
  }, title)), summary && /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, summary)), open && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-6)',
      animation: 'eg-rise var(--dur-base) var(--ease-out) both'
    }
  }, children));
}
Object.assign(__ds_scope, { Disclosure });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Disclosure.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/AppShell.jsx
try { (() => {
/* The shell: header, the four destinations, and the state the click-through
   needs. There is exactly one daily answer per day — answering is idempotent,
   as recordAnswer() is in the Model. Practice keeps its own separate state. */
function AppShell() {
  const NS = window.EstimationGymDesignSystem_4a01b0;
  const {
    AppHeader,
    Icon
  } = NS;
  const D = window.EG_DATA;
  const [tab, setTab] = React.useState('today');
  const [answer, setAnswer] = React.useState(null);
  /* recordAnswer() bumps the streak, so the header and the share card have to
     read the same number — it lives here, not in either surface. */
  const [streak, setStreak] = React.useState(D.streak);
  const [best, setBest] = React.useState(D.best);
  const [practised, setPractised] = React.useState([]);
  const [practiceQuestion, setPracticeQuestion] = React.useState(null);
  const [practiceResult, setPracticeResult] = React.useState(null);
  const [reminder, setReminder] = React.useState(false);

  /* Drawn on arrival, and again after each answer — at random from whatever is
     left, the way Model.pickPractice() does it. */
  React.useEffect(() => {
    if (tab === 'practice' && !practiceQuestion && !practiceResult) {
      setPracticeQuestion(D.drawPractice(practised));
    }
  }, [tab, practiceQuestion, practiceResult, practised]);
  const nextPractice = () => {
    const done = practiceQuestion ? practised.concat([practiceQuestion.id]) : practised;
    setPractised(done);
    setPracticeResult(null);
    setPracticeQuestion(D.drawPractice(done));
  };
  const tabs = [{
    id: 'today',
    label: 'Today',
    icon: 'target'
  }, {
    id: 'practice',
    label: 'Practice',
    icon: 'dumbbell'
  }, {
    id: 'stats',
    label: 'Stats',
    icon: 'chart-column'
  }, {
    id: 'guide',
    label: 'Guide',
    icon: 'info'
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: '100vh',
      paddingBottom: 96
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "eg-app"
  }, /*#__PURE__*/React.createElement(AppHeader, {
    date: D.today,
    streak: streak,
    best: best,
    reminderOn: reminder,
    onReminder: () => setReminder(!reminder)
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-11)'
    }
  }, tab === 'today' && /*#__PURE__*/React.createElement(window.TodayScreen, {
    answer: answer,
    streak: streak,
    onAnswer: a => {
      setAnswer(a);
      const next = streak + 1;
      setStreak(next);
      if (next > best) setBest(next);
    },
    onPractice: () => setTab('practice')
  }), tab === 'practice' && /*#__PURE__*/React.createElement(window.PracticeScreen, {
    question: practiceQuestion,
    result: practiceResult,
    practised: practised.length,
    onAnswer: r => setPracticeResult(r),
    onNext: nextPractice
  }), tab === 'stats' && /*#__PURE__*/React.createElement(window.StatsScreen, null), tab === 'guide' && /*#__PURE__*/React.createElement(window.GuideScreen, null))), /*#__PURE__*/React.createElement("nav", {
    style: {
      position: 'fixed',
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      gap: 'var(--space-1)',
      padding: 'var(--space-3) var(--space-4) calc(var(--space-3) + env(safe-area-inset-bottom))',
      background: 'var(--surface-veil)',
      backdropFilter: 'blur(14px)',
      borderTop: '1px solid var(--border-default)'
    }
  }, tabs.map(t => {
    const active = tab === t.id;
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      type: "button",
      onClick: () => setTab(t.id),
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4,
        minWidth: 72,
        minHeight: 'var(--tap-min)',
        padding: 'var(--space-3) var(--space-5)',
        background: active ? 'var(--accent-wash)' : 'transparent',
        border: '1px solid ' + (active ? 'var(--accent-edge)' : 'transparent'),
        borderRadius: 'var(--radius-lg)',
        cursor: 'pointer',
        color: active ? 'var(--accent)' : 'var(--text-muted)',
        transition: 'var(--transition-control)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: t.icon,
      size: 17
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        font: 'var(--type-eyebrow)',
        fontSize: 'var(--text-2xs)',
        fontWeight: active ? 700 : 400
      }
    }, t.label));
  })));
}
window.AppShell = AppShell;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/AppShell.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/GuideScreen.jsx
try { (() => {
/* Guide: how to play, the scoring key, the reminder explainer, and the
   suggest-a-question form. All copy is the source app's own. */
function GuideScreen() {
  const NS = window.EstimationGymDesignSystem_4a01b0;
  const {
    Disclosure,
    StepList,
    ScoringTable,
    Callout,
    TextField,
    ExponentButton,
    Button,
    Eyebrow,
    FootNote,
    ReminderToggle
  } = NS;
  const D = window.EG_DATA;
  const [on, setOn] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    icon: "info",
    style: {
      marginBottom: 'var(--space-7)'
    }
  }, "how it works"), /*#__PURE__*/React.createElement(StepList, {
    steps: D.howToPlay
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-7) 0 var(--space-5)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Being within a factor of ten of a hard question is the skill worth having, so scoring is measured in powers of ten rather than percentages."), /*#__PURE__*/React.createElement(ScoringTable, null), /*#__PURE__*/React.createElement(Callout, {
    title: "Hints never break your streak",
    icon: "lightbulb"
  }, "Stuck? Hint tells you how to attack that shape of problem without giving anything away about the answer. It halves the day's points, but it never breaks your streak."), /*#__PURE__*/React.createElement(Disclosure, {
    title: "The daily reminder",
    icon: "bell",
    summary: on ? 'on' : 'off',
    defaultOpen: true
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      marginBottom: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(ReminderToggle, {
    on: on,
    onClick: () => setOn(!on)
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, "One nudge a day, around 9am your time. Tap again to stop.")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "You will not be nudged on a day you have already played. It is a reminder, not a nag. Turning it off deletes the subscription \u2014 nothing about your guesses, scores or streak is ever sent with it.")), /*#__PURE__*/React.createElement(Disclosure, {
    title: "Suggest a question",
    icon: "send"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Good questions can be reasoned out from things you roughly know, rather than recalled. Every suggestion is checked by hand before it can appear, so an answer and a source are both needed."), /*#__PURE__*/React.createElement(TextField, {
    label: "Question",
    placeholder: "How many bricks are in the Great Wall of China?"
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "Answer",
    numeric: true,
    placeholder: "3.9e9",
    trailing: /*#__PURE__*/React.createElement(ExponentButton, null)
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "Unit",
    placeholder: "bricks"
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "Source",
    placeholder: "Wall length and typical brick dimensions"
  }), /*#__PURE__*/React.createElement(TextField, {
    label: "How would you work it out?",
    hint: "(optional)",
    multiline: true,
    rows: 3,
    placeholder: "Length times cross-section, divided by the volume of one brick."
  }), /*#__PURE__*/React.createElement(Button, {
    variant: "quiet",
    size: "sm",
    icon: "send",
    style: {
      marginTop: 'var(--space-6)'
    }
  }, "Send it in")), /*#__PURE__*/React.createElement(FootNote, {
    align: "center"
  }, "Free software \u2014 ", /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/SidathPeiris/estimation-gym-app"
  }, "source code"), " (AGPL-3.0)"));
}
window.GuideScreen = GuideScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/GuideScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/PracticeScreen.jsx
try { (() => {
/* Practice: an extra question, drawn from the pool the daily is not about to
   use. Model.practicePool() defines the pool — the bank, minus the next 365
   days of scheduled dailies, minus the days you have already answered, minus
   the ones you have already practised. So a practice question is either more
   than a year away in the queue or a past daily you never played.

   No points, no streak, no stats, no shared distribution. Separate pool,
   separate verb. The draw itself is random — pickPractice() picks a random
   member of the pool rather than walking it in order. */
function PracticeScreen({
  question,
  result,
  practised = 0,
  onAnswer,
  onNext
}) {
  const NS = window.EstimationGymDesignSystem_4a01b0;
  const {
    QuestionCard,
    GuessField,
    ResultCard,
    Callout,
    Button,
    Eyebrow,
    Chip,
    FootNote,
    Icon
  } = NS;
  const D = window.EG_DATA;
  const q = question;
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(null);
  React.useEffect(() => {
    setValue('');
    setError(null);
  }, [q && q.id]);
  const submit = raw => {
    const scored = D.score(raw, q.answerValue, false);
    if (!scored) {
      setError('Enter a positive number');
      return;
    }
    setError(null);
    onAnswer(scored);
  };
  const left = D.practiceAvailable - practised;
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-5)',
      marginBottom: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)'
    }
  }, q ? left.toLocaleString('en-GB') + ' available' : '0 available')), q ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-8)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "A question the daily puzzle has not given you. Scored the same way, but it does not touch your streak, your stats, or what other players see."), /*#__PURE__*/React.createElement(QuestionCard, {
    mode: "practice",
    prompt: q.prompt,
    asOf: q.asOf,
    archetype: result ? q.archetype : null,
    answered: !!result,
    badge: !result ? /*#__PURE__*/React.createElement(Chip, {
      icon: "clock",
      tone: "var(--mode-practice)"
    }, q.origin) : null
  }, result ? /*#__PURE__*/React.createElement(ResultCard, {
    band: result.band,
    points: 0,
    practice: true,
    guess: result.guessLabel,
    actual: q.answerLabel,
    unit: q.unit,
    decades: result.decades
  }) : /*#__PURE__*/React.createElement(GuessField, {
    value: value,
    onChange: setValue,
    onSubmit: submit,
    unit: q.unit,
    error: error
  })), result && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Callout, {
    title: 'Approach: ' + q.archetype,
    icon: "lightbulb"
  }, q.guidance), /*#__PURE__*/React.createElement(Callout, {
    title: "How to think about it",
    icon: "brain",
    tone: "var(--text-muted)"
  }, q.hint), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-5)',
      flexWrap: 'wrap',
      marginTop: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "quiet",
    size: "sm",
    iconAfter: "arrow-right",
    onClick: onNext
  }, "Another question"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 'var(--text-xs)',
      color: 'var(--text-faint)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 12
  }), " this one will not come round again")), /*#__PURE__*/React.createElement(FootNote, {
    align: "right"
  }, "Source: ", q.source)), /*#__PURE__*/React.createElement(Callout, {
    title: "Where these come from",
    icon: "info",
    style: {
      marginTop: 'var(--space-10)'
    }
  }, "The next ", D.reserveDays, " days of daily puzzles are held back, so practice cannot spoil one. What is left is everything more than a year away in the queue, plus the days you never played. Questions you have practised do not come round again, and neither do ones you have already had as a daily.")) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: 'var(--type-label)',
      fontSize: 'var(--text-md)',
      color: 'var(--text-display)'
    }
  }, "Nothing left to practise on."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-4)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "You have worked through every question the daily puzzle has not used yet. Nothing left to practise on \u2014 which is quite the achievement."), /*#__PURE__*/React.createElement(Callout, {
    title: "More arrive with the bank",
    icon: "plus",
    style: {
      marginTop: 'var(--space-7)'
    }
  }, "Questions are only ever appended to the bank, so every one added becomes practisable straight away and extends the daily queue by another day. There is a form for suggesting one under Guide.")));
}
window.PracticeScreen = PracticeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/PracticeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/StatsScreen.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* Stats: lifetime totals, band spread, which shapes of problem you are good
   at, and the history list with its per-question comparison. */
function StatsScreen() {
  const NS = window.EstimationGymDesignSystem_4a01b0;
  const {
    StatTile,
    BandBars,
    HistoryRow,
    ArchetypeRow,
    Callout,
    Button,
    Eyebrow,
    Disclosure
  } = NS;
  const D = window.EG_DATA;
  const [openRow, setOpenRow] = React.useState(null);
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    icon: "chart-column",
    style: {
      marginBottom: 'var(--space-7)'
    }
  }, "lifetime"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(StatTile, {
    label: "Days played",
    value: "12"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Points",
    value: "780",
    tone: "var(--accent)"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Best streak",
    value: "14",
    sub: "current 6",
    tone: "var(--status-warn)"
  }), /*#__PURE__*/React.createElement(StatTile, {
    label: "Median off",
    value: "0.42",
    sub: "decades"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement(BandBars, {
    rows: D.bands
  })), /*#__PURE__*/React.createElement(Callout, {
    title: "You tend to guess low, by about 3.8\xD7",
    icon: "trending-down",
    tone: "var(--status-warn)"
  }, "Knowing your direction of error is the part you can actually correct."), /*#__PURE__*/React.createElement(Disclosure, {
    title: "Which shapes you are good at",
    icon: "brain",
    defaultOpen: true
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0 0 var(--space-5)',
      font: 'var(--type-label)',
      fontSize: 'var(--text-sm)'
    }
  }, "Strongest on people times per-person rate. Weakest on count the doublings."), D.archetypes.map(a => /*#__PURE__*/React.createElement(ArchetypeRow, {
    key: a.label,
    label: a.label,
    played: a.played,
    median: a.median,
    thin: a.thin
  }))), /*#__PURE__*/React.createElement(Disclosure, {
    title: "History",
    icon: "clock",
    summary: D.history.length + ' days',
    defaultOpen: true
  }, /*#__PURE__*/React.createElement("ol", {
    style: {
      listStyle: 'none',
      margin: 0,
      padding: 0
    }
  }, D.history.map(h => /*#__PURE__*/React.createElement(HistoryRow, _extends({
    key: h.date
  }, h, {
    open: openRow === h.date,
    onClick: () => setOpenRow(openRow === h.date ? null : h.date)
  }), /*#__PURE__*/React.createElement(BandBars, {
    rows: D.distribution,
    mine: h.band,
    showTally: false
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-4)',
      marginTop: 'var(--space-7)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "quiet",
    size: "sm",
    icon: "copy"
  }, "Copy my history"), /*#__PURE__*/React.createElement(Button, {
    variant: "quiet",
    size: "sm",
    icon: "send"
  }, "Restore a history"))));
}
window.StatsScreen = StatsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/StatsScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/TodayScreen.jsx
try { (() => {
/* Today: the one question in the queue for this calendar day, the same one
   everybody gets. Answered and scored inline, then the shared distribution.
   This is the screen the source app is, restyled. */
function TodayScreen({
  answer,
  streak = 0,
  onAnswer,
  onPractice
}) {
  const NS = window.EstimationGymDesignSystem_4a01b0;
  const {
    QuestionCard,
    GuessField,
    ResultCard,
    Callout,
    Banner,
    Button,
    BandBars,
    Chip,
    Eyebrow,
    Icon,
    FootNote,
    ShareCard
  } = NS;
  const D = window.EG_DATA;
  const q = D.daily;
  const [value, setValue] = React.useState('');
  const [error, setError] = React.useState(null);
  const [hint, setHint] = React.useState(false);
  const [sharing, setSharing] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  /* null until an exact-to-the-digit guess earns the question, then 'open'
     until it is answered one way or the other. */
  const [confess, setConfess] = React.useState(null);
  const submit = raw => {
    const scored = D.score(raw, q.answerValue, hint);
    if (!scored) {
      setError('Enter a positive number');
      return;
    }
    setError(null);
    if (Number(raw) === q.answerValue) setConfess('open');
    onAnswer(scored);
  };
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 'var(--space-5)',
      marginBottom: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    icon: "users"
  }, "everyone gets this one today"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-2xs)',
      color: 'var(--text-faint)',
      textTransform: 'capitalize'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--text-display)'
    }
  }, "one a day"))), /*#__PURE__*/React.createElement(QuestionCard, {
    prompt: q.prompt,
    date: D.today,
    number: D.puzzleNumber,
    asOf: q.asOf,
    archetype: answer ? q.archetype : null,
    answered: !!answer
  }, answer ? /*#__PURE__*/React.createElement(ResultCard, {
    band: answer.band,
    points: answer.points,
    guess: answer.guessLabel,
    actual: q.answerLabel,
    unit: q.unit,
    decades: answer.decades,
    assisted: answer.assisted
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "soft",
    block: true,
    icon: "share-2",
    onClick: () => setSharing(!sharing)
  }, sharing ? 'Hide share card' : 'Share result'), /*#__PURE__*/React.createElement(FootNote, {
    align: "right"
  }, "Source: ", q.source)) : /*#__PURE__*/React.createElement(GuessField, {
    value: value,
    onChange: setValue,
    onSubmit: submit,
    unit: q.unit,
    error: error
  })), answer && sharing && /*#__PURE__*/React.createElement(ShareCard, {
    style: {
      marginTop: 'var(--space-8)'
    },
    date: D.today,
    band: answer.band,
    decades: answer.decades,
    streak: streak,
    assisted: answer.assisted,
    run: D.shareRun.slice(0, -1).concat([answer.band]),
    url: "estimationgym.app",
    copied: copied,
    onCopy: () => setCopied(true),
    onShare: () => setCopied(false)
  }), confess === 'open' && /*#__PURE__*/React.createElement(Banner, {
    title: "Hold on.",
    icon: "circle-alert",
    style: {
      marginTop: 'var(--space-9)'
    },
    actions: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "soft",
      size: "sm",
      onClick: () => setConfess('yes')
    }, "Yes, I peeked"), /*#__PURE__*/React.createElement(Button, {
      variant: "quiet",
      size: "sm",
      onClick: () => setConfess('no')
    }, "No, I am just that good"))
  }, "You got it exactly right \u2014 ", q.answerLabel, " ", q.unit, ", to the digit. Either that is the finest estimating we have ever seen, or you found the answers in the code. Which was it?"), !answer && !hint && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setHint(true),
    style: {
      display: 'flex',
      width: '100%',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 'var(--space-5)',
      marginTop: 'var(--space-6)',
      padding: 0,
      background: 'none',
      border: 0,
      color: 'inherit',
      cursor: 'pointer',
      textAlign: 'left'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      font: 'var(--type-label)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-display)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lightbulb",
    size: 15,
    color: "var(--accent)"
  }), " Hint"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-body)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      textTransform: 'capitalize'
    }
  }, "scores half points")), (hint || answer) && /*#__PURE__*/React.createElement(Callout, {
    title: 'Approach: ' + q.archetype,
    icon: "lightbulb"
  }, q.guidance), answer && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Callout, {
    title: "How to think about it",
    icon: "brain",
    tone: "var(--text-muted)"
  }, q.hint), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-9)',
      padding: 'var(--space-7) var(--space-8)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      justifyContent: 'space-between',
      gap: 'var(--space-5)',
      marginBottom: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: 'var(--type-label)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-display)'
    }
  }, "How everyone did"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, "789 answered")), /*#__PURE__*/React.createElement(BandBars, {
    rows: D.distribution,
    mine: answer.band,
    showTally: false
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-6) 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--accent)'
    }
  }, "Closer than 61% of the 788 others who answered."), confess === 'yes' && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-4) 0 0',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      fontStyle: 'italic'
    }
  }, "4 people have owned up to looking this one up.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-10)',
      paddingTop: 'var(--space-8)',
      borderTop: '1px solid var(--border-default)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-label)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-display)'
    }
  }, "That is today's question done."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-3) 0 var(--space-6)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "A new one arrives tomorrow, the same one for everybody. If you want another go now, practice draws from questions the daily has not given you \u2014 it earns no points and does not touch your streak."), /*#__PURE__*/React.createElement(Button, {
    variant: "quiet",
    size: "sm",
    icon: "dumbbell",
    onClick: onPractice
  }, "Practice a question"))), !answer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      flexWrap: 'wrap',
      marginTop: 'var(--space-10)'
    }
  }, /*#__PURE__*/React.createElement(Chip, {
    icon: "users",
    style: {
      textTransform: 'capitalize'
    }
  }, "no account"), /*#__PURE__*/React.createElement(Chip, {
    icon: "wifi-off",
    style: {
      textTransform: 'capitalize'
    }
  }, "works offline"), /*#__PURE__*/React.createElement(Chip, {
    icon: "lock",
    style: {
      textTransform: 'capitalize',
      textAlign: 'justify'
    }
  }, "nothing leaves your device")));
}
window.TodayScreen = TodayScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/TodayScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/app/data.js
try { (() => {
/* Fake data for the click-through. Question text, units, hints, sources and
   archetype guidance are taken verbatim from core/questions.js and
   core/Model.js STRATEGIES in the source repo.

   The question system, as the code defines it:
   - The bank is append-only. Day N gets bank[N - SCHEDULE_ORIGIN], so everyone
     on the same calendar date gets the same question and growing the bank
     cannot re-deal a day already played.
   - There is exactly one daily question. Answering is idempotent per day.
   - Practice draws from practicePool(): the bank minus the questions the daily
     is scheduled to use within PRACTICE_RESERVE_DAYS (365), minus the ones you
     have already answered as a daily on this device, minus the ones you have
     already practised. So a practice question is either more than a year away
     in the queue or a past daily you never played.
   - Practice awards no points and touches neither streak, stats nor the shared
     distribution. */
const EG_DATA = {
  today: 'Tue 16 Sep',
  puzzleNumber: 8,
  streak: 6,
  best: 14,
  bankSize: 1000,
  reserveDays: 365,
  practiceAvailable: 621,
  daily: {
    prompt: 'How many bacteria live on an average mobile phone screen?',
    unit: 'bacteria',
    answerValue: 17000,
    answerLabel: '17,000',
    asOf: 2025,
    archetype: 'Area times density',
    guidance: 'Estimate how much area or volume is involved and how densely the thing is packed into it, then multiply. A handful of densities per square metre or per litre are worth memorising; they transfer to a lot of questions.',
    hint: 'About 100 square centimetres, handled constantly and cleaned rarely.',
    source: 'Microbiological swab studies of mobile devices'
  },
  /* Four draws from the pool. `origin` records why each one is practisable —
     the two cases practicePool() allows. */
  practice: [{
    id: 'stitches-in-a-pair-of-jeans',
    prompt: 'How many stitches are in a pair of jeans?',
    unit: 'stitches',
    answerValue: 12000,
    answerLabel: '12,000',
    archetype: 'Multiply a chain of estimates',
    guidance: 'This is a product of a few independent quantities. Write the chain out in units first and check that they cancel down to the unit you are asked for, then put a rough number on each link.',
    hint: 'Around 30 metres of seam at roughly eight stitches per centimetre.',
    source: 'Garment manufacturing specifications',
    origin: 'A daily from 4 March. You did not play that day.'
  }, {
    id: 'sleepers-in-a-kilometre-of-track',
    prompt: 'How many sleepers are laid under one kilometre of railway track?',
    unit: 'sleepers',
    answerValue: 1650,
    answerLabel: '1,650',
    archetype: 'Divide a total by one unit',
    guidance: 'Estimate a total you can actually picture — a mass, a volume, a length, a budget — then divide by the size of a single unit. The total is often much better known than the count you are being asked for.',
    hint: 'Spaced about 60 centimetres apart along the line.',
    source: 'Permanent way engineering standards',
    origin: 'Due as a daily in 2 years and 4 months.'
  }, {
    id: 'solar-panel-output-per-year',
    prompt: 'How many kilowatt hours does a single rooftop solar panel produce in a year?',
    unit: 'kilowatt hours',
    answerValue: 450,
    answerLabel: '450',
    archetype: 'Energy per unit times units',
    guidance: 'Find the energy per unit — per kilogram, per person, per event — and multiply by how many units there are. Checking the result against something familiar, like a home using about 10 kWh a day, catches most magnitude slips.',
    hint: 'A panel is roughly 400 watts peak, and a temperate site delivers something like 1,100 full-sun-equivalent hours a year.',
    source: 'Typical panel rating and capacity factor',
    origin: 'Due as a daily in 1 year and 8 months.'
  }, {
    id: 'coastline-length-of-the-world',
    prompt: "How many kilometres is the total coastline of all the world's land?",
    unit: 'kilometres',
    answerValue: 1160000,
    answerLabel: '1,160,000',
    archetype: 'Recall, then sanity-check',
    guidance: 'This one leans on a figure you have probably met before. Pull up whatever number you half-remember, then check its magnitude against a related quantity you are confident about before committing to it.',
    hint: 'The answer depends on the measuring scale, which is the classic coastline paradox.',
    source: 'World Resources Institute coastline data',
    origin: 'A daily from 19 January. You did not play that day.'
  }],
  bands: [{
    band: 'Bullseye',
    tally: 3,
    fraction: 0.25
  }, {
    band: 'Close',
    tally: 6,
    fraction: 0.50
  }, {
    band: 'Ballpark',
    tally: 2,
    fraction: 0.17
  }, {
    band: 'Off',
    tally: 1,
    fraction: 0.08
  }],
  distribution: [{
    band: 'Bullseye',
    tally: 112,
    fraction: 0.14
  }, {
    band: 'Close',
    tally: 331,
    fraction: 0.42
  }, {
    band: 'Ballpark',
    tally: 244,
    fraction: 0.31
  }, {
    band: 'Off',
    tally: 102,
    fraction: 0.13
  }],
  history: [{
    date: 'Mon 15 Sep',
    band: 'Bullseye',
    guess: '1.2e6',
    actual: '1.16e6',
    decades: 0.01,
    comparable: true
  }, {
    date: 'Sun 14 Sep',
    band: 'Close',
    guess: '35,000',
    actual: '29,000',
    decades: 0.08,
    comparable: true
  }, {
    date: 'Sat 13 Sep',
    band: 'Ballpark',
    guess: '900',
    actual: '29,000',
    decades: 1.51,
    assisted: true,
    comparable: true
  }, {
    date: 'Fri 12 Sep',
    band: 'Off',
    guess: '12',
    actual: '17,000',
    decades: 3.15,
    comparable: false
  }, {
    date: 'Thu 11 Sep',
    band: 'Close',
    guess: '420',
    actual: '450',
    decades: 0.03,
    comparable: true
  }],
  /* The seven calendar days behind the share card, oldest first. null is a day
     not played — calendar days, not played days, so a gap reads as a gap. */
  shareRun: ['Bullseye', 'Close', 'Ballpark', null, 'Off', 'Close', 'Close'],
  archetypes: [{
    label: 'People times per-person rate',
    played: 7,
    median: 0.42
  }, {
    label: 'Area times density',
    played: 5,
    median: 0.61
  }, {
    label: 'Stock equals flow times lifetime',
    played: 4,
    median: 1.08
  }, {
    label: 'Count the doublings',
    played: 1,
    median: null,
    thin: true
  }],
  howToPlay: ["Read today's question and estimate the answer. Nobody expects you to know it — work it out from things you do know.", 'Type your guess and submit. Scientific notation works for big numbers: 3e12 rather than counting zeroes.', 'You are scored on how close you get in powers of ten, not on being exact.', 'Come back tomorrow for a new question. Everyone gets the same one on the same day.']
};

/* The scoring the Model does: thresholds 0.3 / 1 / 2 decades. */
EG_DATA.score = function (raw, answerValue, assisted) {
  const guess = Number(raw);
  if (String(raw).trim() === '' || !isFinite(guess) || guess <= 0) return null;
  const decades = Math.abs(Math.log10(guess) - Math.log10(answerValue));
  const band = decades <= 0.3 ? 'Bullseye' : decades <= 1 ? 'Close' : decades <= 2 ? 'Ballpark' : 'Off';
  const base = {
    Bullseye: 100,
    Close: 70,
    Ballpark: 40,
    Off: 10
  }[band];
  return {
    band,
    decades,
    assisted: !!assisted,
    points: assisted ? Math.round(base * 0.5) : base,
    guessLabel: guess.toLocaleString('en-GB')
  };
};
window.EG_DATA = EG_DATA;
/* Practice draws at random from whatever is left in the pool, as
   Model.pickPractice() does. `practised` is the list of ids already drawn on
   this device; a question never comes round again. Returns null once the pool
   is empty, which the screen presents as having worked through everything. */
EG_DATA.drawPractice = function (practised) {
  const taken = practised || [];
  const pool = EG_DATA.practice.filter(q => taken.indexOf(q.id) < 0);
  if (!pool.length) return null;
  return pool[Math.floor(Math.random() * pool.length)];
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/app/data.js", error: String((e && e.message) || e) }); }

// ui_kits/install/InstallPage.jsx
try { (() => {
/* The install page at estimationgym.app/install, restyled. Copy is verbatim
   from install/index.html; the platform sections are all shown at once, the way
   the source does before platform.js narrows them. */
function InstallPage() {
  const NS = window.EstimationGymDesignSystem_4a01b0;
  const {
    Wordmark,
    Button,
    Chip,
    Eyebrow,
    Callout,
    Icon,
    BandTag,
    FootNote,
    Brandmark
  } = NS;
  const Step = ({
    children
  }) => /*#__PURE__*/React.createElement("li", {
    style: {
      margin: 'var(--space-2) 0',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, children);
  const Kbd = ({
    children
  }) => /*#__PURE__*/React.createElement("kbd", {
    style: {
      background: 'color-mix(in srgb, var(--text-body) 10%, transparent)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xs)',
      padding: '0.05rem 0.35rem',
      font: 'inherit',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.85em',
      whiteSpace: 'nowrap'
    }
  }, children);
  const Platform = ({
    icon,
    title,
    children,
    warn
  }) => /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 'var(--space-11)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-3)',
      font: 'var(--type-label)',
      fontSize: 'var(--text-md)',
      fontFamily: 'var(--font-display)',
      color: 'var(--text-display)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 16,
    color: "var(--accent)"
  }), title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-4)',
      padding: 'var(--space-7) var(--space-8)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)'
    }
  }, /*#__PURE__*/React.createElement("ol", {
    style: {
      paddingLeft: '1.2rem',
      margin: 0,
      color: 'var(--text-body)'
    }
  }, children), warn && /*#__PURE__*/React.createElement(Callout, null, warn)));
  return /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 'var(--prose-max)',
      margin: '0 auto',
      padding: 'var(--space-12) var(--app-pad) var(--space-16)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    size: "lg",
    align: "center"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 'var(--space-6) auto 0',
      maxWidth: '26rem',
      font: 'var(--type-body)',
      fontSize: 'var(--text-md)',
      color: 'var(--text-secondary)'
    }
  }, "One question a day, the same one for everyone. You do not have to be right \u2014", ' ', /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-display)'
    }
  }, "you have to be roughly right.")), /*#__PURE__*/React.createElement(Button, {
    variant: "solid",
    size: "lg",
    as: "a",
    href: "../app/index.html",
    block: true,
    style: {
      marginTop: 'var(--space-10)'
    }
  }, "Play now"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-4)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, "Takes about a minute. Nothing from an app store."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: 'var(--space-7)'
    }
  }, ['Free', 'No account', 'Works offline', 'No ads', 'Open source'].map(c => /*#__PURE__*/React.createElement(Chip, {
    key: c
  }, c)))), /*#__PURE__*/React.createElement(Platform, {
    icon: "target",
    title: "On iPhone or iPad",
    warn: /*#__PURE__*/React.createElement(React.Fragment, null, "It has to be Safari. Chrome and Firefox on iPhone cannot add apps to the home screen \u2014 that is an Apple restriction, not a fault in the game.")
  }, /*#__PURE__*/React.createElement(Step, null, "Open this page in ", /*#__PURE__*/React.createElement("strong", null, "Safari"), "."), /*#__PURE__*/React.createElement(Step, null, "Tap ", /*#__PURE__*/React.createElement("strong", null, "Play now"), " above."), /*#__PURE__*/React.createElement(Step, null, "Tap the ", /*#__PURE__*/React.createElement("strong", null, "Share"), " button \u2014 the square with an arrow pointing up, ", /*#__PURE__*/React.createElement(Kbd, null, "\u25A1\u2191"), "."), /*#__PURE__*/React.createElement(Step, null, "Scroll down and tap ", /*#__PURE__*/React.createElement("strong", null, "Add to Home Screen"), "."), /*#__PURE__*/React.createElement(Step, null, "Tap ", /*#__PURE__*/React.createElement("strong", null, "Add"), ".")), /*#__PURE__*/React.createElement(Platform, {
    icon: "plus",
    title: "On Android",
    warn: /*#__PURE__*/React.createElement(React.Fragment, null, "Chrome may offer to install it by itself, in a bar along the bottom. Taking that offer does the same thing.")
  }, /*#__PURE__*/React.createElement(Step, null, "Open this page in ", /*#__PURE__*/React.createElement("strong", null, "Chrome"), "."), /*#__PURE__*/React.createElement(Step, null, "Tap ", /*#__PURE__*/React.createElement("strong", null, "Play now"), " above."), /*#__PURE__*/React.createElement(Step, null, "Tap the ", /*#__PURE__*/React.createElement(Kbd, null, "\u22EE"), " menu, top right."), /*#__PURE__*/React.createElement(Step, null, "Tap ", /*#__PURE__*/React.createElement("strong", null, "Install app"), ", or ", /*#__PURE__*/React.createElement("strong", null, "Add to Home screen"), " if that is what yours says.")), /*#__PURE__*/React.createElement(Platform, {
    icon: "rocket",
    title: "On a computer"
  }, /*#__PURE__*/React.createElement(Step, null, "Just tap ", /*#__PURE__*/React.createElement("strong", null, "Play now"), " \u2014 it works in the browser."), /*#__PURE__*/React.createElement(Step, null, "In Chrome or Edge you can also click the ", /*#__PURE__*/React.createElement("strong", null, "install icon"), " in the address bar to keep it in its own window.")), /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginTop: 'var(--space-12)',
      marginBottom: 'var(--space-4)'
    }
  }, "what you are installing"), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-xl)',
      padding: 'var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      font: 'var(--type-prompt)',
      fontSize: 'var(--text-md)',
      fontFamily: 'var(--font-display)',
      color: 'var(--text-display)'
    }
  }, "How many jellybeans fit in a one-litre jar?"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-3)',
      marginTop: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-md)',
      padding: '0.55rem 0.65rem',
      fontFamily: 'var(--font-mono)',
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)',
      background: 'var(--surface-sunken)'
    }
  }, "Guess (jellybeans)"), /*#__PURE__*/React.createElement(Button, {
    size: "sm"
  }, "Go")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 'var(--space-2)',
      marginTop: 'var(--space-6)',
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(BandTag, {
    band: "Bullseye",
    size: "sm"
  }), /*#__PURE__*/React.createElement(BandTag, {
    band: "Close",
    size: "sm"
  }), /*#__PURE__*/React.createElement(BandTag, {
    band: "Ballpark",
    size: "sm"
  }), /*#__PURE__*/React.createElement(BandTag, {
    band: "Off",
    size: "sm"
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-6)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)',
      textAlign: 'center'
    }
  }, "An example \u2014 not one of the real questions.")), /*#__PURE__*/React.createElement(Eyebrow, {
    style: {
      marginTop: 'var(--space-12)',
      marginBottom: 'var(--space-4)'
    }
  }, "see it first"), /*#__PURE__*/React.createElement("figure", {
    style: {
      margin: 0,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/brand/tour-poster.png",
    alt: "A short tour of Estimation Gym",
    style: {
      width: '100%',
      maxWidth: 270,
      borderRadius: 'var(--radius-2xl)',
      border: '1px solid var(--border-default)',
      background: '#000'
    }
  }), /*#__PURE__*/React.createElement("figcaption", {
    style: {
      marginTop: 'var(--space-3)',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, "Fifty seconds, if you would rather see it than read about it.")), /*#__PURE__*/React.createElement("a", {
    href: "https://youtu.be/3xvcWVqtHKY",
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      display: 'flex',
      gap: 'var(--space-6)',
      alignItems: 'center',
      marginTop: 'var(--space-7)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-default)',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6) var(--space-7)',
      textDecoration: 'none',
      color: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 'var(--radius-md)',
      flex: '0 0 auto',
      display: 'grid',
      placeItems: 'center',
      background: 'var(--status-urgent)',
      color: '#fff'
    }
  }, "\u25B6"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 'var(--text-base)',
      color: 'var(--text-display)'
    }
  }, "Seven-minute walkthrough"), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      fontSize: 'var(--text-xs)',
      color: 'var(--text-muted)'
    }
  }, "On YouTube \u2014 why powers of ten make a better puzzle"))), /*#__PURE__*/React.createElement("section", {
    style: {
      marginTop: 'var(--space-14)',
      color: 'var(--text-secondary)'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: 'var(--type-label)',
      fontSize: 'var(--text-md)',
      fontFamily: 'var(--font-display)',
      color: 'var(--text-display)'
    }
  }, "Why bother installing?"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-5)',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "It opens like a normal app, with no browser bars, and it ", /*#__PURE__*/React.createElement("strong", {
    style: {
      color: 'var(--text-display)'
    }
  }, "works offline"), " \u2014 the questions travel with it, so it plays on a plane or underground."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-5)',
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--leading-relaxed)'
    }
  }, "Your streak and history stay on your own device. There is no account and no sign-up, and nothing about how you play leaves your phone.")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-14)',
      paddingTop: 'var(--space-7)',
      borderTop: '1px solid var(--border-default)',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement(Brandmark, {
    size: 22,
    tone: "mono",
    style: {
      color: 'var(--text-faint)'
    }
  }), /*#__PURE__*/React.createElement(FootNote, {
    align: "center",
    style: {
      marginTop: 'var(--space-3)'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://github.com/SidathPeiris/estimation-gym-app"
  }, "Source"), " \xB7 AGPL-3.0")));
}
window.InstallPage = InstallPage;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/install/InstallPage.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Brandmark = __ds_scope.Brandmark;

__ds_ns.Wordmark = __ds_scope.Wordmark;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.BandBars = __ds_scope.BandBars;

__ds_ns.StatTile = __ds_scope.StatTile;

__ds_ns.HistoryRow = __ds_scope.HistoryRow;

__ds_ns.ArchetypeRow = __ds_scope.ArchetypeRow;

__ds_ns.Chip = __ds_scope.Chip;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.StreakBadge = __ds_scope.StreakBadge;

__ds_ns.Callout = __ds_scope.Callout;

__ds_ns.Banner = __ds_scope.Banner;

__ds_ns.FootNote = __ds_scope.FootNote;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.ExponentButton = __ds_scope.ExponentButton;

__ds_ns.GuessField = __ds_scope.GuessField;

__ds_ns.TextField = __ds_scope.TextField;

__ds_ns.BANDS = __ds_scope.BANDS;

__ds_ns.BandTag = __ds_scope.BandTag;

__ds_ns.PointsTag = __ds_scope.PointsTag;

__ds_ns.QuestionCard = __ds_scope.QuestionCard;

__ds_ns.ResultCard = __ds_scope.ResultCard;

__ds_ns.ScoringTable = __ds_scope.ScoringTable;

__ds_ns.StepList = __ds_scope.StepList;

__ds_ns.SHARE_EMOJI = __ds_scope.SHARE_EMOJI;

__ds_ns.BandRun = __ds_scope.BandRun;

__ds_ns.ShareCard = __ds_scope.ShareCard;

__ds_ns.AppHeader = __ds_scope.AppHeader;

__ds_ns.ReminderToggle = __ds_scope.ReminderToggle;

__ds_ns.Disclosure = __ds_scope.Disclosure;

})();
