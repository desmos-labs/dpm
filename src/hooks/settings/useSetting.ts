import { useMemo } from 'react';
import { AppSettings } from 'types/settings';
import { useRecoilValue } from 'recoil';
import appSettingsState from '@recoil/settings';

/**
 * Hook that provides a stateful variable that represents
 * the value of the requested setting.
 * @param setting - The setting of interest.
 */
export default function useSetting<K extends keyof AppSettings>(setting: K): AppSettings[K] {
  const settings = useRecoilValue(appSettingsState);

  return useMemo(() => settings[setting], [setting, settings]);
}
