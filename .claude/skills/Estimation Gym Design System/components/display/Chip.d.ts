/**
 * Hairline pill for facts about the product, not actions.
 */
export interface ChipProps {
  children?: React.ReactNode;
  icon?: string | null;
  /** Colour token; omit for the default hairline-on-transparent look. */
  tone?: string | null;
  style?: React.CSSProperties;
}
export declare function Chip(props: ChipProps): JSX.Element;

/** Uppercase letterspaced section label. */
export interface EyebrowProps {
  children?: React.ReactNode;
  tone?: string;
  icon?: string | null;
  style?: React.CSSProperties;
}
export declare function Eyebrow(props: EyebrowProps): JSX.Element;

/** Current streak and best, with a flame that only lights when live. */
export interface StreakBadgeProps {
  streak?: number;
  best?: number;
  size?: 'md' | 'lg';
  style?: React.CSSProperties;
}
export declare function StreakBadge(props: StreakBadgeProps): JSX.Element;
