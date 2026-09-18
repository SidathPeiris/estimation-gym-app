/** Band squares as the shared text uses them, matching presenter.js BAND_EMOJI. */
export declare const SHARE_EMOJI: Record<'Bullseye' | 'Close' | 'Ballpark' | 'Off' | 'missed', string>;

/** Seven calendar days as band squares, oldest to newest. */
export interface BandRunProps {
  /** One entry per calendar day; null or '' for a day not played. Leading gaps are trimmed. */
  run?: Array<string | null>;
  /** Square edge in px. Default 30. */
  size?: number;
  gap?: number;
  style?: React.CSSProperties;
}
export declare function BandRun(props: BandRunProps): JSX.Element;

/**
 * The shareable result. Shows the day, the seven-day run, today's band and the
 * streak — and never the guess, the true value or the question, so it is safe
 * to post before anyone else has played.
 */
export interface ShareCardProps {
  /** Formatted calendar date, e.g. "Tue 16 Sep". */
  date: string;
  band?: 'Bullseye' | 'Close' | 'Ballpark' | 'Off';
  decades?: number | null;
  streak?: number;
  /** The seven-day run, oldest first. */
  run?: Array<string | null>;
  /** Link appended to the shared text. */
  url?: string;
  /** Hinted day — appends "· hint", as the source does. */
  assisted?: boolean;
  /** Override the generated clipboard text. Omit to build it from the props. */
  text?: string | null;
  /** Native share sheet. */
  onShare?: () => void;
  onCopy?: () => void;
  /** Flips the copy button to a green "Copied". */
  copied?: boolean;
  style?: React.CSSProperties;
}
export declare function ShareCard(props: ShareCardProps): JSX.Element;
