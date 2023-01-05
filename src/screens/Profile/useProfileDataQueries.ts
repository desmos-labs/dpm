import React, { useMemo } from 'react';
import useActiveProfile from '@recoil/activeProfileState';
import useProfileDataGivenAddress from 'hooks/useProfileDataGivenAddress';

const useProfileDataQueries = (visitingProfileAddress?: string) => {
  const {
    profile,
    refetch: refetchProfile,
    loading: loadingProfile,
  } = visitingProfileAddress
    ? useProfileDataGivenAddress(visitingProfileAddress)
    : useActiveProfile();

  const screenMode = useMemo(() => {
    if (visitingProfileAddress) {
      return visitingProfileAddress ? 'guestProfile' : 'myProfile';
    }
    return 'myProfile';
  }, [visitingProfileAddress]);

  // Refetch the data
  React.useEffect(() => {
    refetchProfile();
  });

  return {
    profile,
    loadingProfile,
    refetchProfile,
    screenMode,
  };
};

export default useProfileDataQueries;
