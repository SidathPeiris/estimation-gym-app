/** The four-row scoring key, derived from BANDS so it cannot drift. */
export interface ScoringTableProps {
  /** Smaller type for use inside a disclosure. */
  compact?: boolean;
  style?: React.CSSProperties;
}
export declare function ScoringTable(props: ScoringTableProps): JSX.Element;

/** Numbered how-to steps. */
export interface StepListProps {
  steps?: string[];
  style?: React.CSSProperties;
}
export declare function StepList(props: StepListProps): JSX.Element;
