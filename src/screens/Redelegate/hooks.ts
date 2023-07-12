import useBroadcastTx from 'hooks/useBroadcastTx';
import React from 'react';
import { Coin, Staking } from '@desmoslabs/desmjs';
import { MsgBeginRedelegateEncodeObject } from '@cosmjs/stargate';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import { useTranslation } from 'react-i18next';
import { useCurrentChainInfo } from '@recoil/settings';

/**
 * Hook that provides a function to build and broadcast the
 * MsgBeginRedelegate.
 */
export const useRedelegateTokes = () => {
  const broadcastTx = useBroadcastTx();
  const activeAccountAddress = useActiveAccountAddress()!;
  const { t } = useTranslation('staking');
  const chainInfo = useCurrentChainInfo();

  return React.useCallback(
    (amount: Coin | undefined, from: string, to: string, memo?: string, onSuccess?: () => any) => {
      broadcastTx(
        [
          {
            typeUrl: Staking.v1beta1.MsgBeginRedelegateTypeUrl,
            value: {
              amount,
              delegatorAddress: activeAccountAddress,
              validatorSrcAddress: from,
              validatorDstAddress: to,
            },
          } as MsgBeginRedelegateEncodeObject,
        ],
        {
          memo,
          customSuccessMessage: t('your tokens has been restaked successfully', {
            tokens: chainInfo.stakeCurrency.coinDenom,
          }),
          customFailedMessage: t("your tokens hasn't been restaked successfully", {
            tokens: chainInfo.stakeCurrency.coinDenom,
          }),
          onSuccess,
        },
      );
    },
    [broadcastTx, activeAccountAddress, t, chainInfo.stakeCurrency.coinDenom],
  );
};
