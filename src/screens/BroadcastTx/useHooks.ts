import { EncodeObject } from '@cosmjs/proto-signing';
import { useUnlockWallet } from 'hooks/useUnlockWallet';
import { useActiveAccount } from '@recoil/activeAccountState';
import { useCallback } from 'react';
import { DeliverTxResponse } from '@desmoslabs/desmjs';
import useSignTx, { SignAndBroadcastResult, SignMode } from 'hooks/useSignTx';

/**
 * Hook that provide a function to broadcast a list of messages
 * to the chain of the current active account.
 * The function returns a [DeliverTxResponse] if the tx has been sent or
 * undefined if the user have cancelled the wallet unlock procedure.
 */
export const useBroadcastTx = () => {
  const activeAccount = useActiveAccount();
  const unlockWallet = useUnlockWallet(activeAccount!.address);
  const signTx = useSignTx();

  return useCallback(
    async (messages: EncodeObject[], memo?: string): Promise<DeliverTxResponse | undefined> => {
      const wallet = await unlockWallet();

      if (wallet === undefined) {
        return undefined;
      }

      const result = <SignAndBroadcastResult>await signTx(wallet, {
        mode: SignMode.SignAndBroadcast,
        messages,
        memo,
      });

      return result.deliverTxResponse;
    },
    [signTx, unlockWallet],
  );
};
