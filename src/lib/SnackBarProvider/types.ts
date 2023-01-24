/**
 * Interface that represents the SnackBar app state.
 */
export interface SnackBarState {
  /**
   * Tells if the SnackBar is visible or not.
   */
  visible: boolean;
  /**
   * SnackBar visible duration.
   */
  duration?: number;
  /**
   * SnackBar message.
   */
  text?: string;
  /**
   * Callback called when the SnackBar is dismissed.
   */
  onDismiss?: () => any;
}
