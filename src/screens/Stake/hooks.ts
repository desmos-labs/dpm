import useBroadcastTx from 'hooks/useBroadcastTx';
import React from 'react';
import { MsgDelegateTypeUrl } from '@desmoslabs/desmjs';
import { MsgDelegateEncodeObject } from '@cosmjs/stargate';
import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import { useTranslation } from 'react-i18next';
import useResetToHomeScreen from 'hooks/navigation/useResetToHomeScreen';

export const useDelegateTokens = () => {
  const { t } = useTranslation('stake');
  const broadcastTx = useBroadcastTx();
  const resetToHome = useResetToHomeScreen();
  const currentAccountAddress = useActiveAccountAddress();

  return React.useCallback(
    (amount: Coin, validatorOperatorAddress: string, memo?: string) => {
      broadcastTx(
        [
          {
            typeUrl: MsgDelegateTypeUrl,
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
          onSuccess: resetToHome,
        },
      );
    },
    [broadcastTx, currentAccountAddress, t, resetToHome],
  );
};
