import useBroadcastTx from 'hooks/useBroadcastTx';
import React from 'react';
import { Coin, MsgBeginRedelegateTypeUrl } from '@desmoslabs/desmjs';
import { MsgBeginRedelegateEncodeObject } from '@cosmjs/stargate';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import { useTranslation } from 'react-i18next';
import { useCurrentChainInfo } from '@recoil/settings';
import useResetToHomeScreen from 'hooks/navigation/useResetToHomeScreen';

/**
 * Hook that provides a function to build and broadcast the
 * MsgBeginRedelegate.
 */
export const useRedelegateTokes = () => {
  const broadcastTx = useBroadcastTx();
  const activeAccountAddress = useActiveAccountAddress()!;
  const { t } = useTranslation('staking');
  const chainInfo = useCurrentChainInfo();
  const resetToHome = useResetToHomeScreen();

  return React.useCallback(
    (amount: Coin | undefined, from: string, to: string, memo?: string) => {
      broadcastTx(
        [
          {
            typeUrl: MsgBeginRedelegateTypeUrl,
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
          onSuccess: resetToHome,
        },
      );
    },
    [activeAccountAddress, broadcastTx, chainInfo.stakeCurrency.coinDenom, t, resetToHome],
  );
};
