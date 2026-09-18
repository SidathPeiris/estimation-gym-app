/**
 * The band histogram — lifetime stats and the shared distribution use the same
 * one.
 */
export interface BandBarsProps {
  /** One row per band, in BANDS order. fraction is 0–1. */
  rows?: Array<{ band: string; tally: number; fraction: number }>;
  /** Your own band — bolds the label and dims the others. */
  mine?: string | null;
  /** Show raw counts (stats) or percentages (distribution). Default counts. */
  showTally?: boolean;
  style?: React.CSSProperties;
}
export declare function BandBars(props: BandBarsProps): JSX.Element;

/** One lifetime figure: days played, points, best streak, median decades off. */
export interface StatTileProps {
  label: string;
  value: string | number;
  /** Small note under the number. */
  sub?: string | null;
  tone?: string;
  style?: React.CSSProperties;
}
export declare function StatTile(props: StatTileProps): JSX.Element;
