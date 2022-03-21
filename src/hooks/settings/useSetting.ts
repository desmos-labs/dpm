import { AppSettings } from '../../types/settings';
import { useMemo } from 'react';
import useSettings from './useSettings';

/**
 * Hook that provides a stateful variable that represents
 * the value of the requested setting.
 * @param setting - The setting of interest.
 */
export default function useSetting<K extends keyof AppSettings>(
	setting: K
): AppSettings[K] {
	const settings = useSettings();

	return useMemo(() => {
		return settings[setting];
	}, [setting, settings]);
}
