import { AppSettings } from '../../types/settings';
import { useAppContext } from '../../contexts/AppContext';

/**
 * Hook that provides a stateful variable that represents
 * the current application settings.
 */
export default function useSettings(): AppSettings {
  const { settings } = useAppContext();

  return settings;
}
