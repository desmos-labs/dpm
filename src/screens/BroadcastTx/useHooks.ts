import { EncodeObject } from '@cosmjs/proto-signing';
import useUnlockWallet from 'hooks/useUnlockWallet';
import { useActiveAccount } from '@recoil/activeAccount';
import { useCallback, useState } from 'react';
import { DeliverTxResponse, DesmosClient, OfflineSignerAdapter } from '@desmoslabs/desmjs';
import useSignTx, { SignAndBroadcastResult, SignMode } from 'hooks/useSignTx';
import { AccountData, StdFee } from '@cosmjs/amino';
import { useCurrentChainGasPrice, useCurrentChainInfo } from '@recoil/settings';
import { Account } from 'types/account';

const dummyOfflineSigner = (account: Account): OfflineSignerAdapter =>
  new OfflineSignerAdapter({
    getAccounts(): Promise<readonly AccountData[]> {
      return Promise.resolve([
        {
          address: account.address,
          algo: account.algo,
          pubkey: account.pubKey,
        },
      ]);
    },
    signDirect: () => Promise.reject(new Error('not implemented')),
  });

export const useEstimateFees = () => {
  const [estimatingFees, setEstimatingFees] = useState(false);
  const [estimatedFees, setEstimatedFees] = useState<StdFee>();
  const activeAccount = useActiveAccount()!;
  const chainInfo = useCurrentChainInfo();
  const gasPrice = useCurrentChainGasPrice();

  const estimateFees = useCallback(
    async (messages: EncodeObject[], memo: string = '') => {
      setEstimatingFees(true);
      setEstimatedFees(undefined);
      let client: DesmosClient | undefined;

      try {
        client = await DesmosClient.connectWithSigner(
          chainInfo.rpcUrl,
          dummyOfflineSigner(activeAccount),
          {
            gasPrice,
          },
        );

        const fees = await client.estimateTxFee(activeAccount.address, messages, memo);
        setEstimatedFees(fees);
      } finally {
        client?.disconnect();
        setEstimatingFees(false);
      }
    },
    [activeAccount, chainInfo.rpcUrl, gasPrice],
  );

  return {
    estimateFees,
    estimatingFees,
    estimatedFees,
  };
};

/**
 * Hook that provide a function to broadcast a list of messages
 * to the chain of the current active account.
 * The function returns a [DeliverTxResponse] if the tx has been sent or
 * undefined if the user have cancelled the wallet unlock procedure.
 */
export const useBroadcastTx = () => {
  const activeAccount = useActiveAccount();
  const unlockWallet = useUnlockWallet();
  const signTx = useSignTx();

  return useCallback(
    async (
      messages: EncodeObject[],
      fees?: StdFee | 'auto',
      memo?: string,
    ): Promise<DeliverTxResponse | undefined> => {
      const wallet = await unlockWallet(activeAccount!.address);

      if (wallet === undefined) {
        return undefined;
      }

      const result = <SignAndBroadcastResult>await signTx(wallet, {
        mode: SignMode.SignAndBroadcast,
        messages,
        memo,
        fees,
      });

      return result.deliverTxResponse;
    },
    [activeAccount, signTx, unlockWallet],
  );
};
