import { useLazyQuery } from '@apollo/client';
import React from 'react';
import { atom, useRecoilState } from 'recoil';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import { defaultDesmosProfile, DesmosProfile } from 'types/desmosTypes';
import activeAccountAddress from '@recoil/activeAccountState';

/**
 * An atom to hold account data of the user's selected profile
 * This should not be confused with the profiles atom, which contains data
 * for ALL of the profiles stored on the user's device
 */
export const activeProfileState = atom<DesmosProfile | undefined>({
  key: 'activeProfile',
  default: undefined,
});

const useActiveProfile = () => {
  const [address] = useRecoilState(activeAccountAddress);
  const [activeProfile, setActiveProfile] = useRecoilState(activeProfileState);
  const [, { loading, refetch }] = useLazyQuery(GetProfileForAddress, {
    variables: { address },
    fetchPolicy: 'no-cache',
  });

  const fetchActiveProfile = React.useCallback(async () => {
    const { data } = await refetch({ address });
    if (!data) {
      const profile = defaultDesmosProfile(address!);
      setActiveProfile(profile);
      return;
    }

    const { profile } = data;
    const [firstProfile] = profile;
    setActiveProfile(firstProfile);
  }, [address]);

  return {
    profile: activeProfile,
    loading,
    refetch: fetchActiveProfile,
  };
};

export default useActiveProfile;
