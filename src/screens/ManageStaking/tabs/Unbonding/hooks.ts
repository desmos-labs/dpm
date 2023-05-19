import { useLazyQuery } from '@apollo/client';
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
  const [getUnbondingDelegations] = useLazyQuery(GetAccountUnbondingDelegations, {
    fetchPolicy: 'network-only',
  });

  return React.useCallback<FetchDataFunction<UnbondingDelegation, undefined>>(
    async (offset: number, limit: number) => {
      const { data, error } = await getUnbondingDelegations({
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
    [activeAccountAddress, getUnbondingDelegations],
  );
};
