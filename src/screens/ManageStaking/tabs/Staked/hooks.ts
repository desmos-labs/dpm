import { useApolloClient } from '@apollo/client';
import React from 'react';
import { FetchDataFunction } from 'hooks/usePaginatedData';
import { convertGraphQLDelegation } from 'lib/GraphQLUtils';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import GetAccountDelegations from 'services/graphql/queries/GetAccountDelegations';
import { Delegation } from 'types/distribution';

/**
 * Hook that provides the function to fetch the paginated delegations
 * that the current active account has performed.
 */
export const useFetchDelegations = () => {
  const activeAccountAddress = useActiveAccountAddress();
  // Here we use useApolloClient instead of useLazyQuery
  // to force the returned callback to change when the client instance changes
  // so that the usePaginatedData hook can properly update the data.
  const client = useApolloClient();

  return React.useCallback<FetchDataFunction<Delegation, undefined>>(
    async (offset: number, limit: number) => {
      if (activeAccountAddress === undefined) {
        throw new Error("Can't get delegations if no accounts are selected");
      }

      const { data, error } = await client.query({
        query: GetAccountDelegations,
        // We use network-only so that if the user refetch the data
        // with the pull to refresh gesture this function will provide the
        // most recent data and not the cached one.
        fetchPolicy: 'network-only',
        variables: {
          address: activeAccountAddress,
          offset,
          limit,
        },
      });

      if (error !== undefined) {
        throw error;
      }

      const serverData = data?.action_delegation?.delegations ?? [];
      const convertedData: Delegation[] = serverData
        .map(convertGraphQLDelegation)
        .filter(
          (delegation: Delegation) => delegation.coins.filter((c) => c.amount !== '0').length > 0,
        );

      return {
        data: convertedData,
        endReached: serverData.length < limit,
      };
    },
    [activeAccountAddress, client],
  );
};
