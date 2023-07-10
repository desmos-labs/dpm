import { useApolloClient } from '@apollo/client';
import GetAccountUnbondingDelegations from 'services/graphql/queries/GetAccountUnbondingDelegations';
import React from 'react';
import { FetchDataFunction } from 'hooks/usePaginatedData';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import { convertGraphQLUnbondingDelegation } from 'lib/GraphQLUtils';
import { UnbondingDelegation } from 'types/distribution';

/**
 * Hook that provides the function to fetch the paginated current
 * active account's unbonding delegations.
 */
export const useGetFetchUnbondingDelegations = () => {
  const activeAccountAddress = useActiveAccountAddress()!;
  // Here we use useApolloClient instead of useLazyQuery
  // to force the returned callback to change when the client instance changes
  // so that the usePaginatedData hook can properly update the data.
  const client = useApolloClient();

  return React.useCallback<FetchDataFunction<UnbondingDelegation, undefined>>(
    async (offset: number, limit: number) => {
      const { data, error } = await client.query({
        query: GetAccountUnbondingDelegations,
        fetchPolicy: 'network-only',
        variables: {
          address: activeAccountAddress,
          limit,
          offset,
        },
      });

      if (error) {
        throw error;
      }

      const converted: UnbondingDelegation[] =
        data.action_unbonding_delegation.unbonding_delegations
          .map(convertGraphQLUnbondingDelegation)
          .flatMap((d: UnbondingDelegation[]) => d);

      return {
        data: converted,
        endReached: data.action_unbonding_delegation.unbonding_delegations.length < limit,
      };
    },
    [activeAccountAddress, client],
  );
};
