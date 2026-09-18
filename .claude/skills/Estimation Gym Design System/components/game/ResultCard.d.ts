/**
 * The scored day: band, points, guess against actual, and the decade ruler.
 */
export interface ResultCardProps {
  band?: 'Bullseye' | 'Close' | 'Ballpark' | 'Off';
  points?: number;
  /** Pre-formatted guess, e.g. "24,000" — use Model.formatCompact. */
  guess: string;
  /** Pre-formatted true value. */
  actual: string;
  /** The question's unit. */
  unit?: string;
  /** Distance in powers of ten; drives the ruler and the printed figure. */
  decades?: number;
  /** Hinted day — halves points and shows "· hint". */
  assisted?: boolean;
  /** Practice result: no points, no streak, no shared distribution. */
  practice?: boolean;
  /** Share button, hint text or source line. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function ResultCard(props: ResultCardProps): JSX.Element;
