import { DesmosProfile } from '@desmoslabs/sdk-core';
import { useAppContext } from '../contexts/AppContext';

/**
 * Hooks that provides a stateful variable that contains
 * all the profiles of each user's account.
 */
export default function useProfiles(): Record<string, DesmosProfile> {
  const { profiles } = useAppContext();
  return profiles;
}
