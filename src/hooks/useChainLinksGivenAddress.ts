import { ChainLink } from 'types/chains';
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import GetChainLinks from 'services/graphql/queries/GetChainLinks';

const convertChainLink = (chainLink: any): ChainLink => ({
  chainName: chainLink.chain_config.name,
  externalAddress: chainLink.external_address,
  userAddress: chainLink.user_address,
  creationTime: new Date(`${chainLink.creation_time}Z`),
});

/**
 * Hook to retrieve the selected address profile data.
 */
const useChainLinksGivenAddress = (address: string | undefined) => {
  const { data, loading, refetch } = useQuery(GetChainLinks, {
    variables: { address: address || 'undefined' },
    fetchPolicy: 'no-cache',
  });

  const chainLinks = useMemo(() => (data?.chainLinks || []).map(convertChainLink), [data]);
  return {
    chainLinks,
    loading,
    refetch,
  };
};

export default useChainLinksGivenAddress;
