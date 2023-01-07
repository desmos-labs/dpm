import { useQuery } from '@apollo/client';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';
import { useMemo } from 'react';
import { Coin } from '@cosmjs/amino';
import { useActiveAccountAddress } from '@recoil/activeAccountState';

/**
 * Hook that allows to get the account balance for the currently active account.
 */
const useActiveAccountBalance = () => {
  const address = useActiveAccountAddress();
  const { data, loading, refetch } = useQuery(GetAccountBalance, {
    variables: { address: address || 'undefined' },
    fetchPolicy: 'no-cache',
  });

  const balance = useMemo((): Coin[] => data?.accountBalance?.coins || [], [data]);
  return {
    balance,
    loading,
    refetch,
  };
};

export default useActiveAccountBalance;
