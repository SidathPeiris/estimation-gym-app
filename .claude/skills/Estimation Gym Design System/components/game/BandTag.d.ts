/** The four scoring bands with their hue, glyph, meaning and points. */
export declare const BANDS: Record<'Bullseye' | 'Close' | 'Ballpark' | 'Off', {
  colour: string; icon: string; meaning: string; points: number;
}>;
/** The CSS var for a band name; falls back to Off. */
export declare function bandColour(band: string): string;

/**
 * A scoring band, in three densities.
 */
export interface BandTagProps {
  band?: 'Bullseye' | 'Close' | 'Ballpark' | 'Off';
  /** pill = result head; dot = history row; plain = scoring table. */
  variant?: 'pill' | 'dot' | 'plain';
  size?: 'sm' | 'md';
  /** Marks a hinted day — the source appends "· hint". */
  assisted?: boolean;
  style?: React.CSSProperties;
}
export declare function BandTag(props: BandTagProps): JSX.Element;

/** Points earned, mono and band-coloured. Practice shows no number. */
export interface PointsTagProps {
  points?: number;
  band?: 'Bullseye' | 'Close' | 'Ballpark' | 'Off';
  assisted?: boolean;
  /** Practice earns no points — renders the word "practice" instead. */
  practice?: boolean;
  size?: 'md' | 'lg';
  style?: React.CSSProperties;
}
export declare function PointsTag(props: PointsTagProps): JSX.Element;
