import GetTransactionsByAddress from 'services/graphql/queries/GetTransactionsByAddress';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import React from 'react';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { GQLGetTransactionsByAddress, Transaction } from 'types/transactions';
import { convertGqlMessageToTransaction } from 'lib/GraphQLUtils/transaction';
import { useApolloClient } from '@apollo/client';

/**
 * Hook that provides a {@link FetchDataFunction} for the {@link usePaginatedData}
 * hook to fetch the list of {@link Transaction} performed from the current active user.
 */
const useFetchCurrentUserTransactions = (): FetchDataFunction<Transaction, undefined> => {
  // Here we use useApolloClient instead of useLazyQuery
  // to force the returned callback to change when the client instance changes
  // so that the usePaginatedData hook can properly update the data.
  const client = useApolloClient();
  const activeAccountAddress = useActiveAccountAddress();

  return React.useCallback<FetchDataFunction<Transaction, undefined>>(
    async (offset, limit) => {
      const { data, error } = await client.query<GQLGetTransactionsByAddress>({
        query: GetTransactionsByAddress,
        fetchPolicy: 'network-only',
        variables: {
          addresses: `{${activeAccountAddress}}`,
          offset,
          limit,
        },
      });

      if (error) {
        throw error;
      }

      const convertedData =
        data?.messages?.map(convertGqlMessageToTransaction) ?? ([] as Transaction[]);

      return {
        data: convertedData,
        endReached: convertedData.length < limit,
      };
    },
    [activeAccountAddress, client],
  );
};

/**
 * Hook that provides the current active account transactions and the
 * functions to fetch the data in a paginated manner with a FlashList.
 */
export const useActiveAccountTransactions = () => {
  const fetchCurrentUserTransactions = useFetchCurrentUserTransactions();

  return usePaginatedData(fetchCurrentUserTransactions, {
    itemsPerPage: 20,
  });
};
