import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings, AppSettingsStorageKey } from '../../types/settings';
import { useAppContext } from '../../contexts/AppContext';

/**
 * Hook that provides a function to update the application settings.
 */
export default function useSetSettings() {
  const { settings, setSettings } = useAppContext();

  return useCallback(
    (newSettings: Partial<AppSettings>) => {
      const updatedSettings = {
        ...settings,
        ...newSettings,
      };
      setSettings(updatedSettings);
      AsyncStorage.setItem(AppSettingsStorageKey, JSON.stringify(updatedSettings));
    },
    [settings, setSettings]
  );
}
