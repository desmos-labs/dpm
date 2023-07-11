import { useApolloClient } from '@apollo/client';
import GetAccountRedelegations from 'services/graphql/queries/GetAccountRedelegations';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import React from 'react';
import { FetchDataFunction } from 'hooks/usePaginatedData';
import { Redelegation } from 'types/distribution';
import { convertGraphQLRedelegation } from 'lib/GraphQLUtils';

/**
 * Hook that provides the function to fetch the paginated redelegations
 * of the current active account.
 */
export const useFetchAccountRedelegations = () => {
  const activeAccountAddress = useActiveAccountAddress()!;
  // Here we use useApolloClient instead of useLazyQuery
  // to force the returned callback to change when the client instance changes
  // so that the usePaginatedData hook can properly update the data.
  const client = useApolloClient();

  return React.useCallback<FetchDataFunction<Redelegation, undefined>>(
    async (offset, limit) => {
      const { data, error } = await client.query({
        query: GetAccountRedelegations,
        variables: {
          address: activeAccountAddress,
          offset,
          limit,
        },
        // We want network only so that if the user perform the pull to refresh
        // gesture this query will return the new redelegations.
        fetchPolicy: 'network-only',
      });

      if (error) {
        throw error;
      }

      const convertedData: Redelegation[] = data.action_redelegation.redelegations
        .map(convertGraphQLRedelegation)
        .flatMap((redelegations: Redelegation[]) => redelegations);

      return {
        data: convertedData,
        endReached: data.action_redelegation.redelegations.length < limit,
      };
    },
    [client, activeAccountAddress],
  );
};
