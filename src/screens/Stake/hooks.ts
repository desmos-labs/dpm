import useBroadcastTx from 'hooks/useBroadcastTx';
import React from 'react';
import { Staking } from '@desmoslabs/desmjs';
import { MsgDelegateEncodeObject } from '@cosmjs/stargate';
import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import { useTranslation } from 'react-i18next';

/**
 * Hook that provides a function to delegate an amount of Coin
 * to a validator.
 */
export const useDelegateTokens = () => {
  const { t } = useTranslation('stake');
  const broadcastTx = useBroadcastTx();
  const currentAccountAddress = useActiveAccountAddress();

  return React.useCallback(
    (amount: Coin, validatorOperatorAddress: string, memo?: string, onSuccess?: () => any) => {
      broadcastTx(
        [
          {
            typeUrl: Staking.v1beta1.MsgDelegateTypeUrl,
            value: {
              amount,
              validatorAddress: validatorOperatorAddress,
              delegatorAddress: currentAccountAddress,
            },
          } as MsgDelegateEncodeObject,
        ],
        {
          memo,
          customSuccessMessage: t('your DSM has been staked'),
          customFailedMessage: t("your DSM hasn't been staked"),
          onSuccess,
        },
      );
    },
    [broadcastTx, currentAccountAddress, t],
  );
};
