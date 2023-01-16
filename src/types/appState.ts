/**
 * Interface that represents the information about the
 * application state.
 */
export interface AppState {
  /**
   * Tells if the application is locked and should be displayed a screen
   * that force the user to provide the password or to authenticate
   * with the biometrics.
   */
  readonly locked: boolean;
  /**
   * Last time the application went on blur state.
   */
  readonly lastObBlur?: Date;
}
