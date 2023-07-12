import { useCallback } from 'react';
import { MsgSendEncodeObject } from '@cosmjs/stargate';
import { useCurrentChainInfo } from '@recoil/settings';
import useBroadcastTx, { BroadcastTxCallbacks } from 'hooks/useBroadcastTx';
import { useActiveAccount } from '@recoil/activeAccount';
import { Bank } from '@desmoslabs/desmjs';

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
        typeUrl: Bank.v1beta1.MsgSendTypeUrl,
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
