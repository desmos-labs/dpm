import { useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import { DesmosProfile } from 'types/desmos';
import { useStoredProfiles, useStoreProfile } from '@recoil/profiles';

/**
 * Hook to retrieve the selected address profile data.
 */
const useProfileGivenAddress = (address?: string) => {
  const activeAccountAddress = useActiveAccountAddress();
  const userAddress = address || activeAccountAddress;
  const isForActiveUser = activeAccountAddress === userAddress;

  const [fetchedProfile, setFetchedProfile] = useState<DesmosProfile | undefined>();

  const storeProfile = useStoreProfile();
  const storedProfiles = useStoredProfiles();

  const { loading, refetch } = useQuery(GetProfileForAddress, {
    variables: { address: userAddress },
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      if (!data) {
        return;
      }

      const { profile } = data;
      const [firstProfile] = profile;
      switch (isForActiveUser) {
        case true:
          // Cache the profile of the active user
          storeProfile(userAddress!, firstProfile);
          break;

        default:
          // Set the fetched profile if the queried user is not the active user
          setFetchedProfile(firstProfile);
      }
    },
  });

  const userProfile = useMemo(
    // If the user we're getting the profile for is the active user, get the cached one.
    // Otherwise, get the one that will be downloaded from the server
    () => (isForActiveUser && userAddress ? storedProfiles[userAddress] : fetchedProfile),
    [fetchedProfile, isForActiveUser, storedProfiles, userAddress],
  );

  return {
    profile: userProfile,
    loading,
    refetch,
  };
};

export default useProfileGivenAddress;
