import { useLazyQuery } from '@apollo/client';
import GetTransactionsByAddress from 'services/graphql/queries/GetTransactionsByAddress';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import React from 'react';
import { FetchDataFunction, usePaginatedData } from 'hooks/usePaginatedData';
import { GQLGetTransactionsByAddress, Transaction } from 'types/transactions';
import { convertGqlMessageToTransaction } from 'lib/GraphQLUtils/transaction';

const useFetchCurrentUserTransactions = () => {
  const activeAccountAddress = useActiveAccountAddress();

  const [fetchTransactions] = useLazyQuery<GQLGetTransactionsByAddress>(GetTransactionsByAddress, {
    fetchPolicy: 'network-only',
  });

  return React.useCallback<FetchDataFunction<Transaction, undefined>>(
    async (offset, limit) => {
      const { data, error } = await fetchTransactions({
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
    [activeAccountAddress, fetchTransactions],
  );
};

export const useActiveAccountTransactions = () => {
  const fetchCurrentUserTransactions = useFetchCurrentUserTransactions();

  return usePaginatedData(fetchCurrentUserTransactions, {
    itemsPerPage: 20,
  });
};
