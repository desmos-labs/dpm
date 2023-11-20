/**
 * Supported application themes.
 * - light: Light color schema.
 * - dark: Dark color schema.
 * - auto: Set the color schema according to the system.
 */
type AppTheme = 'light' | 'dark' | 'auto';

/**
 * Enum that represents the supported biometrics
 * authorizations types.
 */
export enum BiometricAuthorizations {
  /**
   * Use biometrics to unlock the application at the first open.
   */
  Login = 'BiometricsLogin',
  /**
   * Use biometrics to unlock the user wallet.
   */
  UnlockWallet = 'BiometricsUnlockWallet',
}

/**
 * Type that represents the application settings.
 */
export type AppSettings = {
  theme: AppTheme;
  chainName: string;
  balanceHidden: boolean;
  loginWithBiometrics: boolean;
  unlockWalletWithBiometrics: boolean;
  notifications: boolean;
  dataInitialized: boolean;
  currentTimezone: '';
  analyticsEnabled: boolean;
  hideBalance: boolean;
  /**
   * Indicates whether the application will be locked when started and whether it will be
   * automatically locked when it loses focus.
   */
  autoAppLock: boolean;
};
