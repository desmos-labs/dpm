import { useLazyQuery } from '@apollo/client';
import React from 'react';
import { FetchDataFunction } from 'hooks/usePaginatedData';
import { convertGraphQLDelegation } from 'lib/GraphQLUtils';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import GetAccountDelegations from 'services/graphql/queries/GetAccountDelegations';
import { Delegation } from 'types/distribution';

export const useFetchDelegations = () => {
  const activeAccountAddress = useActiveAccountAddress();

  const [getAccountDelegations] = useLazyQuery(GetAccountDelegations);

  return React.useCallback<FetchDataFunction<Delegation, undefined>>(
    async (offset: number, limit: number) => {
      if (activeAccountAddress === undefined) {
        throw new Error("Can't get delegations if no accounts are selected");
      }

      const { data, error } = await getAccountDelegations({
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
