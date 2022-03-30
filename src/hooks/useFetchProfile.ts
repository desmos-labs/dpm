import { DesmosProfile } from '@desmoslabs/sdk-core';
import { useDesmosClient } from '@desmoslabs/sdk-react';
import { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import ProfileSourceSingleton from '../sources/ProfileSource';

/**
 * Hook that fetch a profile from the chain and cache it on the device storage.
 * If the application don't have network during the request will be provided a profile
 * fetched from the device storage.
 * @param address - Address of the profile of interest.
 */
export default function useFetchProfile(address: string): DesmosProfile | null {
  const client = useDesmosClient();
  const { profiles, setProfiles } = useAppContext();
  const [profile, setProfile] = useState<DesmosProfile | null>(profiles[address] ?? null);

  useEffect(() => {
    (async () => {
      try {
        await client.connect();
        const fetchedProfile = await client.getProfile(address);
        if (fetchedProfile !== null) {
          const [cached, changed] = await ProfileSourceSingleton.saveProfile(fetchedProfile);
          if (changed) {
            setProfiles((old) => {
              const newValue = { ...old };
              newValue[address] = cached;
              return newValue;
            });
            setProfile(cached);
          }
        }
      } catch (e) {
        console.error('Fetch profile', e);
      }
    })();
  }, [client, address, setProfile, setProfiles]);

  useEffect(() => {
    setProfile(profiles[address] ?? null);
  }, [profiles, setProfile, address]);

  return profile;
}
