import useDelegationRewards from 'hooks/staking/useDelegationRewards';
import { useCurrentChainInfo } from '@recoil/settings';
import React from 'react';
import { coin } from '@cosmjs/amino';

const useValidatorRewards = (validatorOperatorAddress?: string) => {
  const chainInfo = useCurrentChainInfo();
  const { data: rewards, loading, error, refetch } = useDelegationRewards();

  const validatorRewards = React.useMemo(() => {
    if (rewards === undefined) {
      return undefined;
    }

    const pendingRewards = rewards.find(
      (r) => r.validatorAddress === validatorOperatorAddress,
    )?.coins;

    return (pendingRewards?.length ?? 0) === 0
      ? [coin(0, chainInfo.stakeCurrency.coinMinimalDenom)]
      : pendingRewards;
  }, [chainInfo.stakeCurrency.coinMinimalDenom, validatorOperatorAddress, rewards]);

  return {
    data: validatorRewards,
    loading,
    error,
    refetch,
  };
};

export default useValidatorRewards;
