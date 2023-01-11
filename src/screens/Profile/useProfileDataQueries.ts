import useActiveProfile from '@recoil/activeProfile';
import useProfileDataGivenAddress from 'hooks/useProfileDataGivenAddress';

const useProfileDataQueries = (visitingProfileAddress?: string) => {
  const {
    profile,
    refetch: refetchProfile,
    loading: loadingProfile,
  } = visitingProfileAddress
    ? useProfileDataGivenAddress(visitingProfileAddress)
    : useActiveProfile();

  return {
    profile,
    loadingProfile,
    refetchProfile,
  };
};

export default useProfileDataQueries;
