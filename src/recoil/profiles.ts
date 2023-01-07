import React from 'react';
import { atom, useRecoilState } from 'recoil';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { DesmosProfile } from 'types/desmosTypes';

/**
 * An atom that holds all the profiles stored inside the application.
 */
export const profilesAppState = atom<Record<string, DesmosProfile>>({
  key: 'profiles',
  default: getMMKV(MMKVKEYS.PROFILES),
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
    (profile: DesmosProfile) => {
      setProfiles((currVal) => {
        const newValue: Record<string, DesmosProfile> = {
          ...currVal,
        };
        newValue[profile.address] = profile;
        return newValue;
      });
    },
    [setProfiles],
  );
};