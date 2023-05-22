import React from 'react';
import useAccountPendingStakingRewards from 'hooks/staking/useAccountPendingStakingRewards';
import { Coin } from '@desmoslabs/desmjs';
import { sumCoins } from 'lib/CoinsUtils';
import { useCurrentChainInfo } from '@recoil/settings';
import { coin } from '@cosmjs/amino';

/**
 * Hook that provides the total amount of pending staking rewards of a user.
 * @param accountAddress - Address of the account for which to get the
 * pending rewards. If its undefined, the current active account address
 * will be used instead.
 */
const useTotalAccountPendingStakingRewards = (accountAddress?: string) => {
  const chainInfo = useCurrentChainInfo();
  const { data, loading, error, refetch } = useAccountPendingStakingRewards(accountAddress);

  const converted = React.useMemo<Coin[]>(() => {
    if (data === undefined) {
      return [];
    }

    const sum = sumCoins(data.flatMap((d) => d.coins));
    if (sum.length === 0) {
      sum.push(coin(0, chainInfo.stakeCurrency.coinMinimalDenom));
    }

    return sum;
  }, [chainInfo.stakeCurrency.coinMinimalDenom, data]);

  return {
    data: converted,
    loading,
    error,
    refetch,
  };
};

export default useTotalAccountPendingStakingRewards;
