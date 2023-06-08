import { EncodeObject } from '@cosmjs/proto-signing';
import useUnlockWallet from 'hooks/useUnlockWallet';
import { useActiveAccount } from '@recoil/activeAccount';
import { useCallback, useState } from 'react';
import { DeliverTxResponse, DesmosClient } from '@desmoslabs/desmjs';
import useSignTx, { SignMode } from 'hooks/tx/useSignTx';
import { StdFee } from '@cosmjs/amino';
import { useCurrentChainGasPrice, useCurrentChainInfo } from '@recoil/settings';
import { err, ok, Result } from 'neverthrow';
import useBroadcastTx from 'hooks/tx/useBroadcastTx';
import useTrackTransactionPerformed from 'hooks/analytics/useTrackTransactionPerformed';
import { calculateFee } from '@cosmjs/stargate';
import { PromiseTimeout } from 'lib/PromiseUtils';

export const useEstimateFees = () => {
  const [estimatingFees, setEstimatingFees] = useState(false);
  const [areFeeApproximated, setAreFeeApproximated] = useState(false);
  const [estimatedFees, setEstimatedFees] = useState<StdFee>();
  const activeAccount = useActiveAccount()!;
  const chainInfo = useCurrentChainInfo();
  const gasPrice = useCurrentChainGasPrice();

  const estimateFees = useCallback(
    async (messages: EncodeObject[], memo: string = '') => {
      setEstimatingFees(true);
      setAreFeeApproximated(false);
      setEstimatedFees(undefined);

      // Compute a fallback fee amount.
      const fallbackFee = calculateFee(200000, gasPrice!);

      const feeEstimationPromise = DesmosClient.connect(chainInfo.rpcUrl, {
        gasPrice,
      }).then((c) =>
        c.estimateTxFee(activeAccount.address, messages, {
          publicKey: {
            algo: activeAccount.algo,
            bytes: activeAccount.pubKey,
          },
          memo,
        }),
      );

      const computedFee = await PromiseTimeout.wrap(feeEstimationPromise, 5000).onTimeoutFallback(
        fallbackFee,
        true,
      );

      setEstimatedFees(computedFee);
      setAreFeeApproximated(computedFee === fallbackFee);
      setEstimatingFees(false);
    },
    [activeAccount, chainInfo.rpcUrl, gasPrice],
  );

  return {
    estimateFees,
    estimatingFees,
    areFeeApproximated,
    estimatedFees,
  };
};

/**
 * Hook that provide a function to broadcast a list of messages
 * to the chain of the current active account.
 * The function returns a [DeliverTxResponse] if the tx has been sent or
 * undefined if the user have cancelled the wallet unlock procedure.
 */
export const useSignAndBroadcastTx = () => {
  const activeAccount = useActiveAccount();
  const unlockWallet = useUnlockWallet();
  const signTx = useSignTx();
  const broadcastTx = useBroadcastTx();
  const trackTransactionPerformed = useTrackTransactionPerformed();

  return useCallback(
    async (
      messages: EncodeObject[],
      fees: StdFee,
      memo?: string,
    ): Promise<Result<DeliverTxResponse | undefined, Error>> => {
      const wallet = await unlockWallet(activeAccount!.address);

      if (wallet === undefined) {
        return ok(undefined);
      }

      const signResult = await signTx(wallet, {
        mode: SignMode.Online,
        messages,
        memo,
        fees,
      });

      if (signResult.isErr()) {
        return err(signResult.error);
      }

      const broadcastResult = await broadcastTx(wallet, signResult.value);
      if (broadcastResult.isOk()) {
        trackTransactionPerformed(messages, fees);
      }

      return broadcastResult;
    },
    [activeAccount, broadcastTx, signTx, unlockWallet, trackTransactionPerformed],
  );
};
