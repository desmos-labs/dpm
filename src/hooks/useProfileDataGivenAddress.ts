import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import GetProfileForAddress from 'services/graphql/queries/GetProfileForAddress';
import { defaultDesmosProfile } from 'types/desmosTypes';

/**
 * Hook to retrieve the selected address profile data.
 */
const useProfileDataGivenAddress = (address: string) => {
  const { data, loading, refetch } = useQuery(GetProfileForAddress, {
    variables: { address },
    fetchPolicy: 'no-cache',
  });

  const profile = useMemo(() => data?.profile[0] || undefined, [data]);
  return {
    profile,
    loading,
    refetch,
  };
};

export default useProfileDataGivenAddress;
