import { useEffect, useState } from 'react';
import useAppContext from 'contexts/AppContext';
import ProfileSourceSingleton from 'sources/ProfileSource';
import { DesmosProfile } from 'types/desmos';
import useDesmosClient from './desmosclient/useDesmosClient';

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
        const fetchedProfile = await client?.getProfile(address);
        if (fetchedProfile) {
          const desmosProfile: DesmosProfile = {
            address,
            dtag: fetchedProfile.dtag,
            nickname: fetchedProfile.nickname,
            bio: fetchedProfile.bio,
            profilePicture: fetchedProfile.pictures?.profile,
            coverPicture: fetchedProfile.pictures?.cover,
          };
          const [cached, changed] = await ProfileSourceSingleton.saveProfile(desmosProfile);
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
