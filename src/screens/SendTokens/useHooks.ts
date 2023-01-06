import { useUnlockWallet } from 'hooks/useUnlockWallet';
import { useCallback } from 'react';
import { MsgSendEncodeObject } from '@cosmjs/stargate';
import { useCurrentChainInfo } from '@recoil/settings';
import useBroadcastTx, { BroadcastTxCallbacks } from 'hooks/useBroadcastTx';

const useSendTokens = (callbacks: BroadcastTxCallbacks) => {
  const chainInfo = useCurrentChainInfo();
  const unlockWallet = useUnlockWallet();
  const broadcastTx = useBroadcastTx();

  return useCallback(
    async (toAddress: string, amount: number, memo?: string) => {
      const wallet = await unlockWallet();
      if (!wallet || !chainInfo) {
        return;
      }

      // Build the message
      const msgSend: MsgSendEncodeObject = {
        typeUrl: '/cosmos.bank.v1beta1.MsgSend',
        value: {
          fromAddress: wallet.address,
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
    [unlockWallet, chainInfo, broadcastTx, callbacks],
  );
};

export default useSendTokens;
