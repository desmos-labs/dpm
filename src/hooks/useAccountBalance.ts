import { useQuery } from '@apollo/client';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';
import { useMemo } from 'react';
import { Coin } from '@cosmjs/amino';

/**
 * Hook that allows to get the account balance for the given address.
 * @param address - Address for which to get the account balance.
 */
const useAccountBalance = (address: string) => {
  const { data, loading, refetch } = useQuery(GetAccountBalance, {
    variables: { address },
    fetchPolicy: 'no-cache',
  });

  const balance = useMemo((): Coin[] => data?.accountBalance?.coins || [], [data]);
  return {
    balance,
    loading,
    refetch,
  };
};

export default useAccountBalance;
