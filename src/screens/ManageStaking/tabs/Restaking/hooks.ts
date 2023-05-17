import { useLazyQuery } from '@apollo/client';
import GetAccountRedelegations from 'services/graphql/queries/GetAccountRedelegations';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import React from 'react';
import { FetchDataFunction } from 'hooks/usePaginatedData';
import { Redelegation } from 'types/distribution';
import { convertGraphQLRedelegation } from 'lib/GraphQLUtils';

/**
 * Hook that provides the function to fetch the paginated redelegations
 * of the current active user.
 */
export const useFetchAccountRedelegations = () => {
  const [getAccountRedelegations] = useLazyQuery(GetAccountRedelegations);
  const activeAccountAddress = useActiveAccountAddress()!;

  return React.useCallback<FetchDataFunction<Redelegation, undefined>>(
    async (offset, limit) => {
      const { data, error } = await getAccountRedelegations({
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
    [getAccountRedelegations, activeAccountAddress],
  );
};
