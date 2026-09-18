/** The Estimation Gym bullseye, drawn in CSS at any size. */
export interface BrandmarkProps {
  /** Outer diameter in px. Default 44. Ring weight scales with it. */
  size?: number;
  /** "brand" uses the fixed three-blue ramp; "mono" inherits currentColor. */
  tone?: 'brand' | 'mono';
  /** Adds the slow expanding ring used on loading and celebration states. */
  ringPulse?: boolean;
  style?: React.CSSProperties;
}
export declare function Brandmark(props: BrandmarkProps): JSX.Element;

/** Mark plus "Estimation Gym", with Gym in the accent. */
export interface WordmarkProps {
  /** sm = header, md = default, lg = stacked hero/OG lockup. */
  size?: 'sm' | 'md' | 'lg';
  showMark?: boolean;
  /** Optional line under the name, e.g. the product promise. */
  tagline?: string | null;
  align?: 'left' | 'center';
  style?: React.CSSProperties;
}
export declare function Wordmark(props: WordmarkProps): JSX.Element;
