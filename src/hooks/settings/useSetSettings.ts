import { useCallback } from 'react';
import { AppSettings } from 'types/settings';
import { useRecoilState } from 'recoil';
import appSettingsState from '@recoil/settings';

/**
 * Hook that provides a function to update the application settings.
 */
export default function useSetSettings() {
  const [settings, setSettings] = useRecoilState(appSettingsState);

  return useCallback(
    (newSettings: Partial<AppSettings>) => {
      const updatedSettings = {
        ...settings,
        ...newSettings,
      };
      setSettings(updatedSettings);
    },
    [settings, setSettings],
  );
}
