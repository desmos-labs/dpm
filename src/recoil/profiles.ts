import React from 'react';
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { DesmosProfile } from 'types/desmos';

/**
 * An atom that holds all the profiles stored inside the application.
 */
export const profilesAppState = atom<Record<string, DesmosProfile>>({
  key: 'profiles',
  default: getMMKV(MMKVKEYS.PROFILES) || {},
  effects: [
    ({ onSet }) => {
      onSet((newProfiles) => {
        setMMKV(MMKVKEYS.PROFILES, newProfiles);
      });
    },
  ],
});

/**
 * Hook that allows to easily store a new profile inside the profilesAppState Atom.
 */
export const useStoreProfile = () => {
  const [, setProfiles] = useRecoilState(profilesAppState);
  return React.useCallback(
    (address: string, profile: DesmosProfile | undefined) => {
      setProfiles((exitingProfiles) => {
        const profiles: Record<string, DesmosProfile> = {
          ...exitingProfiles,
        };

        switch (profile) {
          case undefined:
            // If the given profile is undefined, delete the profile from the stored profiles map
            delete profiles[address];
            break;
          default:
            // If the profile is not undefined, store it inside the cache
            profiles[profile.address] = profile;
            break;
        }

        return profiles;
      });
    },
    [setProfiles],
  );
};

/**
 * Hook that allows to get the profiles stored on the device.
 */
export const useGetProfiles = () => useRecoilValue(profilesAppState);

/**
 * Hook that allows to update the profiles stored on the device.
 */
export const useSetProfiles = () => useSetRecoilState(profilesAppState);
