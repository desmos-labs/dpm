import { ChainId } from './chain';

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
  chainId: ChainId,
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
  chainId: 'desmos-mainnet'
};
