import React from 'react';
import { useLazyQuery } from '@apollo/client';
import { selector, useRecoilValue } from 'recoil';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import { DesmosProfile } from 'types/desmos';
import { activeAccountAddressAppState, useActiveAccountAddress } from '@recoil/activeAccount';
import { profilesAppState, useStoreProfile } from '@recoil/profiles';

/**
 * An atom to hold profile data of the user's selected account.
 * This should not be confused with the profiles' atom, which contains data
 * for ALL the profiles stored on the user's device
 */
const activeProfileAppState = selector<DesmosProfile | undefined>({
  key: 'activeProfile',
  get: ({ get }) => {
    const profiles = get(profilesAppState);
    const selectedAccountAddress = get(activeAccountAddressAppState);
    return selectedAccountAddress && profiles ? profiles[selectedAccountAddress] : undefined;
  },
});

const useActiveProfile = () => {
  const activeAddress = useActiveAccountAddress();
  const storeProfile = useStoreProfile();
  const activeProfile = useRecoilValue(activeProfileAppState);

  const [, { loading, refetch }] = useLazyQuery(GetProfileForAddress, {
    variables: { address: activeAddress },
    fetchPolicy: 'no-cache',
  });

  const fetchActiveProfile = React.useCallback(async () => {
    if (!activeAddress) {
      return;
    }

    const { data } = await refetch({ address: activeAddress });
    if (!data) {
      return;
    }

    const { profile } = data;
    const [firstProfile] = profile;
    storeProfile(firstProfile);
  }, [activeAddress, refetch, storeProfile]);

  return {
    profile: activeProfile,
    loading,
    refetch: fetchActiveProfile,
  };
};

export default useActiveProfile;
