/**
 * The app's one button. Variants map to the four treatments the source app
 * actually uses.
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** soft = tinted (Go, Share); solid = filled (install CTA); quiet = bordered (Copy my history); ghost = bare. */
  variant?: 'soft' | 'solid' | 'quiet' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  /** Any colour token. Use a band or mode colour to re-tone in place. */
  tone?: string;
  /** Icon stem from assets/icons, before the label. */
  icon?: string;
  /** Icon stem after the label. */
  iconAfter?: string;
  /** Full width, as the Share button is. */
  block?: boolean;
  disabled?: boolean;
  as?: 'button' | 'a';
  href?: string;
  type?: 'button' | 'submit';
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;

/** Square, quiet, icon-only control. Always needs a label. */
export interface IconButtonProps {
  icon: string;
  label: string;
  size?: number;
  tone?: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;

/** The ×10ⁿ helper that sits inside a guess row. */
export interface ExponentButtonProps {
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export declare function ExponentButton(props: ExponentButtonProps): JSX.Element;
