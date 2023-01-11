import { useLazyQuery } from '@apollo/client';
import React, { useMemo } from 'react';
import GetAccountChainLinks from 'services/graphql/queries/GetAccountChainLinks';
import { convertGraphQLChainLink } from 'lib/ChainsUtils';
import { useStoredChainLinks, useStoreUserChainLinks } from '@recoil/chainLinks';
import { useActiveAccountAddress } from '@recoil/activeAccount';

/**
 * Hook to retrieve the selected address profile data.
 */
const useChainLinksGivenAddress = (address: string | undefined) => {
  const activeAccountAddress = useActiveAccountAddress();
  const userAddress = address || activeAccountAddress;

  const storeUserChainLinks = useStoreUserChainLinks();
  const storedChainLinks = useStoredChainLinks();
  const userChainLinks = useMemo(
    () => (userAddress ? storedChainLinks[userAddress] || [] : []),
    [storedChainLinks, userAddress],
  );

  const [, { loading, refetch }] = useLazyQuery(GetAccountChainLinks, {
    variables: { address: userAddress },
    fetchPolicy: 'no-cache',
  });

  const fetchProfileChainLinks = React.useCallback(async () => {
    if (!userAddress) {
      return;
    }

    const { data } = await refetch({ address: userAddress });
    if (!data) {
      return;
    }

    const { chainLinks } = data;
    if (userAddress === activeAccountAddress) {
      // Cache the chain links of the active user
      storeUserChainLinks(userAddress, chainLinks.map(convertGraphQLChainLink));
    }
  }, [userAddress, refetch, storeUserChainLinks, activeAccountAddress]);

  return {
    chainLinks: userChainLinks,
    loading,
    refetch: fetchProfileChainLinks,
  };
};

export default useChainLinksGivenAddress;
