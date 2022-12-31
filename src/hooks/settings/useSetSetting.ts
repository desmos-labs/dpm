import { useCallback } from 'react';
import { AppSettings } from 'types/settings';
import useSetSettings from './useSetSettings';

/**
 * Hook that provides a function to update the value of a setting.
 * @param settingKey - Key of the setting of interest.
 */
export default function useSetSetting<K extends keyof AppSettings>(settingKey: K) {
  const setSettings = useSetSettings();

  return useCallback(
    (setting: AppSettings[K]) => {
      const settings: Partial<AppSettings> = {};
      settings[settingKey] = setting;
      setSettings(settings);
    },
    [settingKey, setSettings],
  );
}
