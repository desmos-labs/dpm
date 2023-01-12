import React, { useMemo, useState } from 'react';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import { useStoredApplicationLinks, useStoreUserApplicationLinks } from '@recoil/applicationLinks';
import { useLazyQuery } from '@apollo/client';
import GetAccountApplicationLinks from 'services/graphql/queries/GetAccountApplicationLinks';
import { convertGraphQLApplicationLink } from 'lib/GraphQLUtils';
import { ApplicationLink } from 'types/desmos';

/**
 * Hook to retrieve the application links for a user having a given address.
 * @param address {string} - Address of the user for which to get the application links.
 */
const useApplicationLinksGivenAddress = (address: string | undefined) => {
  const activeAccountAddress = useActiveAccountAddress()!;
  const userAddress = address || activeAccountAddress;
  const isForActiveUser = activeAccountAddress === userAddress;

  const [fetchedApplicationLinks, setFetchedApplicationLinks] = useState<ApplicationLink[]>([]);

  const storeUserApplicationLinks = useStoreUserApplicationLinks();
  const storedApplicationLinks = useStoredApplicationLinks();
  const userApplicationLinks = useMemo(
    // If the user we're getting the applications links for is the active user, get the cached ones.
    // Otherwise, get the ones that will be downloaded from the server
    () => (isForActiveUser ? storedApplicationLinks[userAddress] || [] : fetchedApplicationLinks),
    [isForActiveUser, fetchedApplicationLinks, storedApplicationLinks, userAddress],
  );

  const [, { loading, refetch }] = useLazyQuery(GetAccountApplicationLinks, {
    variables: { address: userAddress },
    fetchPolicy: 'no-cache',
  });

  const fetchProfileApplicationLinks = React.useCallback(async () => {
    if (!userAddress) {
      return;
    }

    const { data } = await refetch({ address: userAddress });
    if (!data) {
      return;
    }

    const { applicationLinks } = data;
    const retrievedApplicationLinks = applicationLinks.map(convertGraphQLApplicationLink);

    switch (isForActiveUser) {
      case true:
        // Cache the application links of the active user
        storeUserApplicationLinks(userAddress, retrievedApplicationLinks);
        break;

      default:
        // Set the fetched application links if the queried user is not the active account
        setFetchedApplicationLinks(retrievedApplicationLinks);
    }
  }, [isForActiveUser, refetch, storeUserApplicationLinks, userAddress]);

  return {
    applicationLinks: userApplicationLinks,
    loading,
    refetch: fetchProfileApplicationLinks,
  };
};

export default useApplicationLinksGivenAddress;
