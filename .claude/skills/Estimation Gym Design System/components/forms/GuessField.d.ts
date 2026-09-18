/**
 * The daily answer row — mono field + ×10ⁿ + Go — with inline validation.
 */
export interface GuessFieldProps {
  value?: string;
  onChange?: (next: string) => void;
  /** Fired on submit with the current value. */
  onSubmit?: (value: string) => void;
  /** The question's unit; seeds the placeholder, e.g. "bacteria". */
  unit?: string;
  placeholder?: string;
  /** Validation message, e.g. "Enter a positive number". Reds the border. */
  error?: string | null;
  submitLabel?: string;
  disabled?: boolean;
  /** Hide the ×10ⁿ helper where it is not wanted. Default true. */
  showExponent?: boolean;
  autoFocus?: boolean;
  style?: React.CSSProperties;
}
export declare function GuessField(props: GuessFieldProps): JSX.Element;

/** Labelled text or textarea, for the suggestion form and history restore. */
export interface TextFieldProps {
  label?: string;
  /** Muted aside inside the label, e.g. "(optional)". */
  hint?: string;
  value?: string;
  onChange?: (next: string) => void;
  placeholder?: string;
  multiline?: boolean;
  rows?: number;
  /** Mono + decimal keypad, for answer values. */
  numeric?: boolean;
  maxLength?: number;
  /** Node rendered to the right of the field, e.g. an ExponentButton. */
  trailing?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function TextField(props: TextFieldProps): JSX.Element;
