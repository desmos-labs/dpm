import { DesmosProfile } from '@desmoslabs/sdk-core';
import { useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import ProfileSource from '../sources/ProfileSource';

/**
 * Hook that provides a function to save a profile on the device disk so that can be
 * visible also if the user is not connected to the internet.
 */
export default function useSaveProfile(): (profile: DesmosProfile) => Promise<void> {
  const { setProfiles } = useAppContext();

  return useCallback(
    async (profile: DesmosProfile) => {
      const [cached, changed] = await ProfileSource.saveProfile(profile);
      if (changed) {
        setProfiles((profiles) => {
          const result = { ...profiles };
          result[cached.address] = cached;
          return result;
        });
      }
    },
    [setProfiles]
  );
}
