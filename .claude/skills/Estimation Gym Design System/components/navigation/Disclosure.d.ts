/**
 * The collapsible section every secondary panel uses.
 */
export interface DisclosureProps {
  title: string;
  /** Right-aligned aside, e.g. "doesn't affect your streak" or "12 played". */
  summary?: string | null;
  /** Icon stem between the chevron and the title. */
  icon?: string | null;
  /** Controlled open state; omit to let the component own it. */
  open?: boolean;
  defaultOpen?: boolean;
  onToggle?: (next: boolean) => void;
  children?: React.ReactNode;
  /** Top separator rule. True except for the first in a run. */
  divider?: boolean;
  style?: React.CSSProperties;
}
export declare function Disclosure(props: DisclosureProps): JSX.Element;
