import { useLazyQuery } from '@apollo/client';
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

  const [getAccountDelegations] = useLazyQuery(GetAccountDelegations);

  return React.useCallback<FetchDataFunction<Delegation, undefined>>(
    async (offset: number, limit: number) => {
      if (activeAccountAddress === undefined) {
        throw new Error("Can't get delegations if no accounts are selected");
      }

      const { data, error } = await getAccountDelegations({
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

      const convertedData: Delegation[] =
        data.action_delegation.delegations.map(convertGraphQLDelegation);

      return {
        data: convertedData,
        endReached: convertedData.length < limit,
      };
    },
    [activeAccountAddress, getAccountDelegations],
  );
};
