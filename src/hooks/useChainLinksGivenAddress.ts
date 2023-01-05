import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import GetChainLinks from 'services/graphql/queries/GetChainLinks';
import { convertGraphQLChainLink } from 'lib/ChainsUtils';
/**
 * Hook to retrieve the selected address profile data.
 */
const useChainLinksGivenAddress = (address: string | undefined) => {
  const { data, loading, refetch } = useQuery(GetChainLinks, {
    variables: { address: address || 'undefined' },
    fetchPolicy: 'no-cache',
  });

  const chainLinks = useMemo(() => (data?.chainLinks || []).map(convertGraphQLChainLink), [data]);
  return {
    chainLinks,
    loading,
    refetch,
  };
};

export default useChainLinksGivenAddress;
