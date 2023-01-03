/**
 * Supported application themes.
 * - light: Light color schema.
 * - dark: Dark color schema.
 * - auto: Set the color schema according to the system.
 */
export type AppTheme = 'light' | 'dark' | 'auto';

/**
 * Type that represents the application settings.
 */
export type AppSettings = {
  theme: AppTheme;
  chainName: string;
  balanceHidden: boolean;
  biometrics: boolean;
  notifications: boolean;
  dataInitialized: false,
  currentTimezone: '',
};

