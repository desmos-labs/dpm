import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import GetTransactionsByAddress from 'services/graphql/queries/GetTransactionsByAddress';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import { GroupedTransactions } from 'types/transactions';
import convertGQLTxsResponse from 'lib/TransactionUtils';

/**
 * Returns the variables that should be used inside the GetTransactionsByAddress query.
 * @param address - Address of the user for which to query the transactions.
 * @param page - Number of transactions page to be queried.
 */
const getQueryVariables = (address: string | undefined, page: number) => ({
  address: `{${address}}`,
  limit: 20,
  offset: 20 * page,
  types: '{}',
});

/**
 * Hook that allows to get the active account transactions from the chain.
 */
const useActiveAccountTransactions = () => {
  const address = useActiveAccountAddress();
  const [, setPage] = useState(0);

  const { data, loading, fetchMore, refetch } = useQuery(GetTransactionsByAddress, {
    variables: getQueryVariables(address, 0),
    fetchPolicy: 'cache-and-network',
  });

  const transactions: GroupedTransactions[] | undefined = React.useMemo(
    () => (data ? convertGQLTxsResponse(data.messages) : []),
    [data],
  );

  const fetchMoreTransactions = React.useCallback(async () => {
    setPage((curValue) => {
      // This trick is used to avoid having the fetchTransactions function depend on the value of the page.
      // If we did that, we would trigger the re-creation on that function each time the page changes,
      // which would trigger any callback that depends on this function (i.e. inside the Home page)
      fetchMore({
        variables: getQueryVariables(address, curValue + 1),
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prev;
          }
          return {
            ...prev,
            messages: [...prev.messages, ...fetchMoreResult.messages],
          };
        },
      });
      return curValue + 1;
    });
  }, [address, fetchMore]);

  const refetchTransactions = React.useCallback(async () => {
    setPage(0);
    await refetch();
  }, [refetch]);

  return {
    loading,
    transactions,
    fetchMore: fetchMoreTransactions,
    refetch: refetchTransactions,
  };
};

export default useActiveAccountTransactions;
