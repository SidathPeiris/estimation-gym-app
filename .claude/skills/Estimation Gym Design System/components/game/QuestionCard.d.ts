/**
 * The question, in one of the product's two modes: the daily puzzle everybody
 * gets on the same calendar day, or a practice draw from the far end of the
 * same queue.
 */
export interface QuestionCardProps {
  /** The question, verbatim from the bank. Never reworded. */
  prompt: string;
  /** Formatted calendar date, e.g. "Tue 16 Sep" — never the day number. Omit for practice. */
  date?: string | null;
  /** Year the answer was true, for quantities that drift. */
  asOf?: string | number | null;
  /** daily = the one everyone gets; practice = unscheduled, unscored. */
  mode?: 'daily' | 'practice';
  /** Overrides the eyebrow text. Defaults to "Today's question" / "Practice". */
  label?: string | null;
  /** Overrides the eyebrow icon stem. */
  icon?: string | null;
  /** Puzzle number, shown after the date. */
  number?: number | null;
  /** Reasoning archetype label from Model.STRATEGIES, shown after answering. */
  archetype?: string | null;
  /** Node placed first in the card header, e.g. a Chip saying where a practice
   *  question came from. */
  badge?: React.ReactNode;
  /** Dims the mode rule once the question is scored. */
  answered?: boolean;
  /** The guess row, or the result once answered. */
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function QuestionCard(props: QuestionCardProps): JSX.Element;
