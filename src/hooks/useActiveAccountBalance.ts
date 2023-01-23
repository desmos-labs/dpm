import { useQuery } from '@apollo/client';
import GetAccountBalance from 'services/graphql/queries/GetAccountBalance';
import { useMemo } from 'react';
import { coin, Coin } from '@cosmjs/amino';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import { useCurrentChainInfo } from '@recoil/settings';

/**
 * Hook that allows to get the account balance for the currently active account.
 */
const useActiveAccountBalance = () => {
  const address = useActiveAccountAddress();
  const currentChainInfo = useCurrentChainInfo();

  const { data, loading, refetch } = useQuery(GetAccountBalance, {
    variables: { address: address || 'undefined' },
    fetchPolicy: 'cache-and-network',
  });

  const balance = useMemo((): Coin[] => {
    const coins = data?.accountBalance?.coins ?? [];
    if (coins.length === 0) {
      return [coin('0', currentChainInfo.stakeCurrency.coinMinimalDenom)];
    }
    return coins;
  }, [currentChainInfo.stakeCurrency.coinMinimalDenom, data]);
  return {
    balance,
    loading,
    refetch,
  };
};

export default useActiveAccountBalance;
