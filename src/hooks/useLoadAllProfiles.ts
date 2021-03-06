import { DesmosProfile } from '@desmoslabs/sdk-core';
import { useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';
import ProfileSourceSingleton from '../sources/ProfileSource';

/**
 * Hooks that provide a function to load all the profiles cached
 * into the local storage.
 */
export default function useLoadAllProfiles(): () => Promise<DesmosProfile[]> {
  const { setProfiles } = useAppContext();

  return useCallback(async () => {
    const profiles = await ProfileSourceSingleton.getAllProfiles();
    const profilesRecord: Record<string, DesmosProfile> = {};
    profiles.forEach((p) => {
      profilesRecord[p.address] = p;
    });
    setProfiles(profilesRecord);
    return profiles;
  }, [setProfiles]);
}
