import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, AppSettingsStorageKey, DefaultAppSettings } from '../../types/settings';
import { useAppContext } from '../../contexts/AppContext';

/**
 * Hook that provides a function to load the settings from the storage into
 * the application context.
 */
export default function useLoadSettings() {
  const { setSettings } = useAppContext();

  return useCallback(async () => {
    const jsonSettings = await AsyncStorage.getItem(AppSettingsStorageKey);
    let settings: AppSettings;
    try {
      if (jsonSettings !== null) {
        const parsedSettings = JSON.parse(jsonSettings);
        settings = {
          ...DefaultAppSettings,
          ...parsedSettings,
        };
      } else {
        settings = DefaultAppSettings;
      }
    } catch (e) {
      settings = DefaultAppSettings;
    }
    setSettings(settings);
  }, [setSettings]);
}
