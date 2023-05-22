import React from 'react';
import useAccountPendingStakingRewards from 'hooks/staking/useAccountPendingStakingRewards';
import { Coin } from '@desmoslabs/desmjs';
import { sumCoins } from 'lib/CoinsUtils';

/**
 * Hook that provides the total amount of pending staking rewards of a user.
 * @param accountAddress - Address of the account for which to get the
 * pending rewards. If its undefined, the current active account address
 * will be used instead.
 */
const useTotalAccountPendingStakingRewards = (accountAddress?: string) => {
  const { data, loading, error, refetch } = useAccountPendingStakingRewards(accountAddress);

  const converted = React.useMemo<Coin[]>(() => {
    if (data === undefined) {
      return [];
    }

    return sumCoins(data.flatMap((d) => d.coins));
  }, [data]);

  return {
    data: converted,
    loading,
    error,
    refetch,
  };
};

export default useTotalAccountPendingStakingRewards;
