import { useCallback } from 'react';
import useAppContext from 'contexts/GraphQLClientProvider';
import ProfileSourceSingleton from 'sources/ProfileSource';
import { DesmosProfile } from 'types/desmos';

/**
 * Hook that provides a function to save a profile on the device disk so that can be
 * visible also if the user is not connected to the internet.
 */
export default function useSaveProfile(): (profile: DesmosProfile) => Promise<void> {
  const { setProfiles } = useAppContext();

  return useCallback(
    async (profile: DesmosProfile) => {
      const [cached, changed] = await ProfileSourceSingleton.saveProfile(profile);
      if (changed) {
        setProfiles((profiles) => {
          const result = { ...profiles };
          result[cached.address] = cached;
          return result;
        });
      }
    },
    [setProfiles],
  );
}
