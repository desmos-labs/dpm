import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import GetTransactionsByAddress from 'services/graphql/queries/GetTransactionsByAddress';
import { useActiveAccount } from '@recoil/activeAccount';
import { GroupedTransactions, Message, Transaction } from 'types/transactions';
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

const mergeMessages = (current?: Message[], fetched?: Message[]): Message[] => {
  if (!current && !fetched) {
    throw new Error('Cannot merge two undefined messages');
  }

  if (!current) {
    return fetched!;
  }

  if (!fetched) {
    return current!;
  }

  // Get all the indexes
  const indexes: Set<number> = new Set<number>();
  current.map((msg) => msg.index).forEach((index) => indexes.add(index));
  fetched.map((msg) => msg.index).forEach((index) => indexes.add(index));

  // Merge the messages based on their indexes
  const merged = Array.from(indexes).map((index) => {
    const currentMsg = current.find((msg) => msg.index === index);
    const fetchedMsg = fetched.find((msg) => msg.index === index);
    return currentMsg || fetchedMsg;
  });

  // Remove undefined values
  return merged.filter((value) => value !== undefined) as Message[];
};

const mergeTransactions = (
  current?: GroupedTransactions,
  fetched?: GroupedTransactions,
): GroupedTransactions => {
  if (!current && !fetched) {
    throw new Error('Cannot merge two undefined grouped transactions');
  }

  if (!current) {
    return fetched!;
  }

  if (!fetched) {
    return current!;
  }

  // Get all the hashes
  const hashes: Set<string> = new Set<string>();
  current.transactions.map((tx) => tx.hash).forEach((hash) => hashes.add(hash));
  fetched.transactions.map((tx) => tx.hash).forEach((hash) => hashes.add(hash));

  // Merge the messages of the transactions having the same address
  const merged = Array.from(hashes).map((hash) => {
    const currentTx = current.transactions.find((tx) => tx.hash === hash);
    const fetchedTx = fetched.transactions.find((tx) => tx.hash === hash);
    return {
      hash: currentTx?.hash || fetchedTx?.hash,
      success: currentTx?.success || fetchedTx?.success,
      timestamp: currentTx?.timestamp || fetchedTx?.success,
      messages: mergeMessages(currentTx?.messages, fetchedTx?.messages),
    } as Transaction;
  });

  return {
    date: current.date,
    transactions: merged,
  };
};

const mergeGroupedTransactions = (
  current: GroupedTransactions[],
  fetched: GroupedTransactions[],
) => {
  if (current.length === 0) {
    return fetched;
  }

  // Get all the dates
  const dates: Set<string> = new Set<string>();
  current.map((groupedTx) => groupedTx.date).forEach((value) => dates.add(value));
  fetched.map((groupedTx) => groupedTx.date).forEach((value) => dates.add(value));

  // Merge the grouped transactions based on the dates
  return Array.from(dates).map((date) => {
    const currentGroupedTxs = current.find((groupedTx) => groupedTx.date === date);
    const fetchedGroupedTxs = fetched.find((groupedTx) => groupedTx.date === date);
    return mergeTransactions(currentGroupedTxs, fetchedGroupedTxs);
  });
};

/**
 * Hook that allows to get the active account transactions from the chain.
 */
const useActiveAccountTransactions = () => {
  const account = useActiveAccount()!;

  const [transactions, setTransactions] = useState<GroupedTransactions[]>([]);
  const [, setPage] = useState(0);

  const [, { loading, refetch }] = useLazyQuery(GetTransactionsByAddress, {
    pollInterval: 1000,
    fetchPolicy: 'no-cache',
    variables: getQueryVariables(account.address, 0),
  });

  const fetchTransactions = React.useCallback(
    async (fetchPage: number, isRefetch: boolean = false) => {
      const { data } = await refetch(getQueryVariables(account.address, fetchPage));
      if (!data) return;

      const fetched = convertGQLTxsResponse(data.messages);
      setTransactions((currentTxs) =>
        isRefetch ? fetched : mergeGroupedTransactions(currentTxs, fetched),
      );
    },
    [account, refetch],
  );

  const fetchMore = React.useCallback(async () => {
    setPage((curValue) => {
      // This trick is used to avoid having the fetchTransactions function depend on the value of the page.
      // If we did that, we would trigger the re-creation on that function each time the page changes,
      // which would trigger any callback that depends on this function (i.e. inside the Home page)
      fetchTransactions(curValue + 1);
      return curValue + 1;
    });
  }, [fetchTransactions]);

  const refetchTransactions = React.useCallback(() => {
    setPage(0);
    fetchTransactions(0, true);
  }, [fetchTransactions]);

  return {
    loading,
    transactions,
    fetchMore,
    refetch: refetchTransactions,
  };
};

export default useActiveAccountTransactions;
