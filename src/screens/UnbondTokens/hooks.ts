import { useActiveAccountAddress } from '@recoil/activeAccount';
import useBroadcastTx, { BroadcastTxCallbacks } from 'hooks/useBroadcastTx';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Coin, MsgUndelegateTypeUrl } from '@desmoslabs/desmjs';
import { MsgUndelegateEncodeObject } from '@cosmjs/stargate';
import { useCurrentChainInfo } from '@recoil/settings';

/**
 * Hook that provides a function to undelegate an amount of tokens
 * from a validator.
 */
export const useUndelegateTokes = () => {
  const { t } = useTranslation('staking');
  const chainInfo = useCurrentChainInfo();
  const activeAccountAddress = useActiveAccountAddress()!;
  const broadcastTx = useBroadcastTx();

  return React.useCallback(
    (validatorAddress: string, amount: Coin, memo?: string, callbacks?: BroadcastTxCallbacks) => {
      broadcastTx(
        [
          {
            typeUrl: MsgUndelegateTypeUrl,
            value: {
              amount,
              validatorAddress,
              delegatorAddress: activeAccountAddress,
            },
          } as MsgUndelegateEncodeObject,
        ],
        {
          memo,
          customSuccessMessage: t('your tokens has been unbonded successfully', {
            tokens: chainInfo.stakeCurrency.coinDenom,
          }),
          customFailedMessage: t("your tokens hasn't been unbonded successfully", {
            tokens: chainInfo.stakeCurrency.coinDenom,
          }),
          ...callbacks,
        },
      );
    },
    [t, activeAccountAddress, broadcastTx, chainInfo.stakeCurrency.coinDenom],
  );
};
