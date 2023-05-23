import useAccountPendingStakingRewards from 'hooks/staking/useAccountPendingStakingRewards';
import React from 'react';
import useBroadcastTx from 'hooks/useBroadcastTx';
import { MsgWithdrawDelegatorRewardEncodeObject } from '@cosmjs/stargate';
import { MsgWithdrawDelegatorRewardTypeUrl } from '@desmoslabs/desmjs';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import { useTranslation } from 'react-i18next';

/**
 * Hook that provides a function to claim all the current active user's
 * pending staking rewards.
 */
export const useClaimAllRewards = () => {
  const { t } = useTranslation('staking');
  const activeAccountAddress = useActiveAccountAddress()!;
  const { data: pendingRewards, loading } = useAccountPendingStakingRewards();
  const broadcastTx = useBroadcastTx();

  return React.useCallback(
    (onSuccess?: () => any) => {
      if (pendingRewards === undefined || loading || pendingRewards.length === 0) {
        return;
      }

      broadcastTx(
        pendingRewards.map(
          (p) =>
            ({
              typeUrl: MsgWithdrawDelegatorRewardTypeUrl,
              value: {
                delegatorAddress: activeAccountAddress,
                validatorAddress: p.validatorAddress,
              },
            } as MsgWithdrawDelegatorRewardEncodeObject),
        ),
        {
          onSuccess,
          customSuccessMessage: t('rewards claimed successfully'),
        },
      );
    },
    [activeAccountAddress, broadcastTx, loading, pendingRewards, t],
  );
};
