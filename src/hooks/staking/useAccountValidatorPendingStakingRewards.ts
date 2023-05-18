import useAccountPendingStakingRewards from 'hooks/staking/useAccountPendingStakingRewards';
import { useCurrentChainInfo } from '@recoil/settings';
import React from 'react';
import { coin } from '@cosmjs/amino';

/**
 * Gets the pending staking rewards of an account that can be claimed from
 * a specific validator.
 * @param validatorOperatorAddress - Validator from which the rewards can be
 * claimed.
 * @param accountAddress - Address of the account that can claim the
 * rewards, if undefined will be used the current active account address.
 */
const useAccountValidatorPendingStakingRewards = (
  validatorOperatorAddress: string,
  accountAddress?: string,
) => {
  const chainInfo = useCurrentChainInfo();
  const {
    data: rewards,
    loading,
    error,
    refetch,
  } = useAccountPendingStakingRewards(accountAddress);

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

export default useAccountValidatorPendingStakingRewards;
