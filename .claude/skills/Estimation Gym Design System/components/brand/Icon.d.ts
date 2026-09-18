/**
 * A lucide glyph from assets/icons, painted with currentColor via CSS mask.
 */
export interface IconProps {
  /** File stem in assets/icons, e.g. "target", "flame", "bell". */
  name: string;
  /** Square size in px. Default 18. */
  size?: number;
  /** Any CSS colour or var(). Default currentColor. */
  color?: string;
  /** Path to the icons folder, if window.EG_ICON_BASE is not set. */
  base?: string;
  /** Accessible label. Omit for decorative icons (renders aria-hidden). */
  title?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
