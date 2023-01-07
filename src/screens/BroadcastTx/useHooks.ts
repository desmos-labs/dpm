import { EncodeObject } from '@cosmjs/proto-signing';
import { useUnlockWallet } from 'hooks/useUnlockWallet';
import { useActiveAccount } from '@recoil/activeAccountState';
import { useCallback } from 'react';
import { DeliverTxResponse, DesmosClient } from '@desmoslabs/desmjs';
import { useCurrentChainGasPrice, useCurrentChainInfo } from '@recoil/settings';

/**
 * Hook that provide a function to broadcast a list of messages
 * to the chain of the current active account.
 * The function returns a [DeliverTxResponse] if the tx has been sent or
 * undefined if the user have cancelled the wallet unlock procedure.
 */
export const useBroadcastTx = () => {
  const activeAccount = useActiveAccount();
  const unlockWallet = useUnlockWallet(activeAccount!.address);
  const chainInfo = useCurrentChainInfo();
  const gasPrice = useCurrentChainGasPrice();

  return useCallback(
    async (messages: EncodeObject[], memo?: string): Promise<DeliverTxResponse | undefined> => {
      const wallet = await unlockWallet();

      if (wallet === undefined) {
        return undefined;
      }

      const client = await DesmosClient.connectWithSigner(chainInfo!.rpcUrl, wallet.signer, {
        gasPrice,
      });
      try {
        return await client.signAndBroadcast(activeAccount!.address, messages, 'auto', memo);
      } catch (e) {
        client.disconnect();
        throw e;
      }
    },
    [activeAccount, chainInfo, gasPrice, unlockWallet],
  );
};
