/**
 * The app header: mark, wordmark, date, streak and the reminder bell.
 */
export interface AppHeaderProps {
  /** Formatted calendar date under the wordmark. */
  date?: string | null;
  streak?: number;
  best?: number;
  reminderOn?: boolean;
  onReminder?: () => void;
  /** Pass to show the settings button. */
  onMenu?: () => void;
  /** Tighter mark and wordmark, for inner screens. */
  compact?: boolean;
  style?: React.CSSProperties;
}
export declare function AppHeader(props: AppHeaderProps): JSX.Element;

/** The daily-reminder bell. Blue and "On" when subscribed, quiet when off. */
export interface ReminderToggleProps {
  on?: boolean;
  /** Show the On/Off word beside the bell. Default true. */
  label?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function ReminderToggle(props: ReminderToggleProps): JSX.Element;
