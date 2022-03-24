import { useAppContext } from '../../contexts/AppContext';
import { AppSettings } from '../../types/settings';

/**
 * Hook that provides a stateful variable that represents
 * the current application settings.
 */
export default function useSettings(): AppSettings {
  const { settings } = useAppContext();

  return settings;
}
