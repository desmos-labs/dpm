import useAppContext from 'contexts/GraphQLClientProvider';
import { DesmosProfile } from 'types/desmos';

/**
 * Hooks that provides a stateful variable that contains
 * all the profiles of each user's account.
 */
export default function useProfiles(): Record<string, DesmosProfile> {
  const { profiles } = useAppContext();
  return profiles;
}
