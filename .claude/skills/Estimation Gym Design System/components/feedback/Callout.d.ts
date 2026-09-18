/**
 * The left-ruled accent note: hint guidance, calibration readings, asides.
 */
export interface CalloutProps {
  /** Bold first line, e.g. the archetype label. */
  title?: string;
  children?: React.ReactNode;
  /** Rule and wash colour. Accent by default; use a band or status token. */
  tone?: string;
  /** Icon stem beside the title. */
  icon?: string | null;
  style?: React.CSSProperties;
}
export declare function Callout(props: CalloutProps): JSX.Element;

/** Full-width bordered notice with optional actions — confession, migration. */
export interface BannerProps {
  title: string;
  children?: React.ReactNode;
  /** Buttons, in a wrapping row. */
  actions?: React.ReactNode;
  tone?: string;
  icon?: string | null;
  style?: React.CSSProperties;
}
export declare function Banner(props: BannerProps): JSX.Element;

/** One line of quiet small print. */
export interface FootNoteProps {
  children?: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  style?: React.CSSProperties;
}
export declare function FootNote(props: FootNoteProps): JSX.Element;
