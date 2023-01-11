import { useCallback } from 'react';
import { MsgSendEncodeObject } from '@cosmjs/stargate';
import { useCurrentChainInfo } from '@recoil/settings';
import useBroadcastTx, { BroadcastTxCallbacks } from 'hooks/useBroadcastTx';
import { useActiveAccount } from '@recoil/activeAccount';

const useSendTokens = (callbacks: BroadcastTxCallbacks) => {
  const chainInfo = useCurrentChainInfo();
  const activeAccount = useActiveAccount();
  const broadcastTx = useBroadcastTx();

  return useCallback(
    async (toAddress: string, amount: number, memo?: string) => {
      if (!activeAccount || !chainInfo) {
        return;
      }

      // Build the message
      const msgSend: MsgSendEncodeObject = {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: {
          fromAddress: activeAccount.address,
          toAddress,
          amount: [
            {
              amount: amount.toString(),
              denom: chainInfo.stakeCurrency.coinMinimalDenom,
            },
          ],
        },
      };

      // Broadcast transaction
      await broadcastTx([msgSend], { memo, ...callbacks });
    },
    [activeAccount, chainInfo, broadcastTx, callbacks],
  );
};

export default useSendTokens;
