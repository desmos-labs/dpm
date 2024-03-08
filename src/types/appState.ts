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
   * Tells if the application is ready to and the
   * splash screen has been hidden.
   */
  readonly ready: boolean;
  /**
   * Tells if the application shouldn't lock when receiving the next on
   * background AppState event.
   */
  readonly noLockOnBackground: boolean;
  /**
   * Tells if the application shouldn't visualize the splash screen.
   */
  readonly noSplashScreen: boolean;
  /**
   * Last time the application went on blur state.
   */
  readonly lastObBlur?: Date;
}
