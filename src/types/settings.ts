/**
 * Supported application themes.
 * - light: Light color schema.
 * - dark: Dark color schema.
 * - auto: Set the color schema according to the system.
 */
export type AppTheme = 'light' | 'dark' | 'auto';

/**
 * Identifies the type of chains that DPM can connect to.
 */
export enum ChainType {
  TESTNET,
  MAINNET,
}

/**
 * Type that represents the application settings.
 */
export type AppSettings = {
  theme: AppTheme;
  chainType: ChainType;
  balanceHidden: boolean;
  biometricSignature: boolean;
  biometricLogin: boolean;
};

/**
 * Key used to identify the application
 * settings stored into the AsyncStorage.
 */
export const AppSettingsStorageKey = 'dpm_app_settings';

/**
 * Default application settings.
 */
export const DefaultAppSettings: AppSettings = {
  theme: 'auto',
  chainType: ChainType.TESTNET,
  balanceHidden: false,
  biometricSignature: false,
  biometricLogin: false,
};
