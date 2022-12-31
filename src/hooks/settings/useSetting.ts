import { useMemo } from 'react';
import { AppSettings } from 'types/settings';
import useSettings from './useSettings';

/**
 * Hook that provides a stateful variable that represents
 * the value of the requested setting.
 * @param setting - The setting of interest.
 */
export default function useSetting<K extends keyof AppSettings>(setting: K): AppSettings[K] {
  const settings = useSettings();

  return useMemo(() => settings[setting], [setting, settings]);
}
