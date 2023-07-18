import { useQuery } from '@apollo/client';
import React from 'react';
import GetAccountChainLinks from 'services/graphql/queries/GetAccountChainLinks';
import { useStoredChainLinks, useStoreUserChainLinks } from '@recoil/chainLinks';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import { ChainLink } from 'types/desmos';
import { convertGraphQLChainLink } from 'lib/GraphQLUtils';

/**
 * Hook to retrieve the chain links for a user having a given address.
 * @param address {string} - Address of the user for which to get the chain links.
 */
const useChainLinksGivenAddress = (address: string | undefined) => {
  const activeAccountAddress = useActiveAccountAddress()!;
  const userAddress = address || activeAccountAddress;
  const isForActiveUser = activeAccountAddress === userAddress;

  const [fetchedChainLinks, setFetchedChainLinks] = React.useState<ChainLink[]>([]);

  const storeUserChainLinks = useStoreUserChainLinks();
  const storedChainLinks = useStoredChainLinks();

  const { refetch, loading } = useQuery(GetAccountChainLinks, {
    variables: { address: userAddress },
    fetchPolicy: 'cache-and-network',
    onCompleted: React.useCallback(
      (data) => {
        if (!data) {
          return;
        }

        const { chainLinks } = data;
        const retrievedChainLinks = chainLinks.map(convertGraphQLChainLink);

        switch (isForActiveUser) {
          case true:
            // Cache the chain links of the active user
            storeUserChainLinks(userAddress, retrievedChainLinks, false);
            break;

          default:
            // Set the fetched chain links if the queried user is not the active one
            setFetchedChainLinks(retrievedChainLinks);
        }
      },
      [isForActiveUser, storeUserChainLinks, userAddress],
    ),
  });

  const fetchUserChainLinks = React.useCallback(() => {
    refetch({ address: userAddress });
  }, [refetch, userAddress]);

  const userChainLinks = React.useMemo(
    // If the user we're getting the chains links for is the active user, get the cached ones.
    // Otherwise, get the ones that will be downloaded from the server
    () => (isForActiveUser ? storedChainLinks[userAddress] ?? [] : fetchedChainLinks),
    [isForActiveUser, fetchedChainLinks, storedChainLinks, userAddress],
  );

  return {
    chainLinks: userChainLinks,
    loading,
    refetch: fetchUserChainLinks,
  };
};

export default useChainLinksGivenAddress;
