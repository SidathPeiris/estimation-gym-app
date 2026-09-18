/**
 * One past day in the History list; expands to show that question's shared
 * distribution when it can be compared.
 */
export interface HistoryRowProps {
  /** Formatted date, e.g. "Mon 15 Sep". */
  date: string;
  band?: 'Bullseye' | 'Close' | 'Ballpark' | 'Off';
  /** Pre-formatted guess. */
  guess: string;
  /** Pre-formatted value it was scored against. */
  actual: string;
  decades?: number | null;
  assisted?: boolean;
  /** Row can open a distribution chart (only days with a stored questionId). */
  comparable?: boolean;
  open?: boolean;
  onClick?: () => void;
  /** The expanded content, usually BandBars. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function HistoryRow(props: HistoryRowProps): JSX.Element;

/** One reasoning archetype in the strengths breakdown. */
export interface ArchetypeRowProps {
  /** Label from Model.STRATEGIES, e.g. "Stock equals flow times lifetime". */
  label: string;
  played?: number;
  /** Median decades off; null when too few plays. */
  median?: number | null;
  /** Too few plays to rank — shown, but visibly out of the comparison. */
  thin?: boolean;
  style?: React.CSSProperties;
}
export declare function ArchetypeRow(props: ArchetypeRowProps): JSX.Element;
