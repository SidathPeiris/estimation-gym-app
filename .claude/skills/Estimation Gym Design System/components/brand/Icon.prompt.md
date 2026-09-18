One lucide glyph from `assets/icons`, tinted with `currentColor`.

```jsx
<Icon name="flame" size={16} color="var(--status-warn)" />
<Icon name="bell" title="Daily reminder" />
```

Set `window.EG_ICON_BASE = '../../assets/icons'` once per page (or pass `base`) so the mask URL resolves. Only the 39 stems in `assets/icons` exist; add more by copying them out of lucide rather than inlining paths. Decorative by default — pass `title` when the icon is the only label.
