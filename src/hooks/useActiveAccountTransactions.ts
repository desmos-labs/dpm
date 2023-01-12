import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import GetTransactionsByAddress from 'services/graphql/queries/GetTransactionsByAddress';
import { useActiveAccount } from '@recoil/activeAccount';
import { GroupedTransactions } from 'types/transactions';
import convertGQLTxsResponse from 'lib/TransactionUtils';

/**
 * Returns the variables that should be used inside the GetTransactionsByAddress query.
 * @param address - Address of the user for which to query the transactions.
 * @param page - Number of transactions page to be queried.
 */
const getQueryVariables = (address: string, page: number) => ({
  address: `{${address}}`,
  limit: 20,
  offset: 20 * page,
  types: '{}',
});

/**
 * Hook that allows to get the active account transactions from the chain.
 */
const useActiveAccountTransactions = () => {
  const account = useActiveAccount()!;

  const [, setPage] = useState(0);

  const { data, loading, fetchMore, refetch } = useQuery(GetTransactionsByAddress, {
    variables: getQueryVariables(account.address, 0),
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
        variables: getQueryVariables(account.address, curValue + 1),
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
  }, [account.address, fetchMore]);

  return {
    loading,
    transactions,
    fetchMore: fetchMoreTransactions,
    refetch,
  };
};

export default useActiveAccountTransactions;
