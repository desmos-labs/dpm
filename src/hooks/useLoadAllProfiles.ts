import { useCallback } from 'react';
import { DesmosProfile } from '@desmoslabs/sdk-core';
import ProfileSource from '../sources/ProfileSource';
import { useAppContext } from '../contexts/AppContext';

/**
 * Hooks that provide a function to load all the profiles cached
 * into the local storage.
 */
export default function useLoadAllProfiles(): () => Promise<DesmosProfile[]> {
  const { setProfiles } = useAppContext();

  return useCallback(async () => {
    const profiles = await ProfileSource.getAllProfiles();
    const profilesRecord: Record<string, DesmosProfile> = {};
    profiles.forEach((p) => {
      profilesRecord[p.address] = p;
    });
    setProfiles(profilesRecord);
    return profiles;
  }, [setProfiles]);
}
