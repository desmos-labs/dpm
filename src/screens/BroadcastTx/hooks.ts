import { EncodeObject } from '@cosmjs/proto-signing';
import useUnlockWallet from 'hooks/useUnlockWallet';
import { useActiveAccount } from '@recoil/activeAccount';
import { useCallback, useState } from 'react';
import { DeliverTxResponse, DesmosClient } from '@desmoslabs/desmjs';
import useSignTx, { SignMode } from 'hooks/tx/useSignTx';
import { StdFee } from '@cosmjs/amino';
import { useCurrentChainGasPrice, useCurrentChainInfo } from '@recoil/settings';
import { err, ok, Result, ResultAsync } from 'neverthrow';
import useBroadcastTx from 'hooks/tx/useBroadcastTx';
import useTrackTransactionPerformed from 'hooks/analytics/useTrackTransactionPerformed';
import { calculateFee } from '@cosmjs/stargate';
import { PromiseTimeout } from 'lib/PromiseUtils';
import useAppFeatureFlags from 'hooks/featureflags/useAppFeatureFlags';
import { usePostHog } from 'posthog-react-native';
import { Timer } from 'lib/Timer';
import useTrackEvent from 'hooks/analytics/useTrackEvent';
import { Events } from 'types/analytics';
import useTransactionProperties from 'hooks/analytics/useTransactionProperties';

export const useEstimateFee = () => {
  const [estimatingFee, setEstimatingFee] = useState(false);
  const [areFeeApproximated, setAreFeeApproximated] = useState(false);
  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const activeAccount = useActiveAccount()!;
  const chainInfo = useCurrentChainInfo();
  const gasPrice = useCurrentChainGasPrice();
  const { feeEstimationTimeoutMs, gasOnFeeEstimationTimeout, trackFeeEstimation } =
    useAppFeatureFlags();
  const postHog = usePostHog();

  const estimateFees = useCallback(
    async (messages: EncodeObject[], memo: string = '') => {
      setEstimatingFee(true);
      setAreFeeApproximated(false);
      setEstimatedFee(undefined);

      // Compute a fallback fee amount.
      const fallbackFee = calculateFee(gasOnFeeEstimationTimeout, gasPrice!.toString());

      const feeEstimationPromise = PromiseTimeout.wrap(
        DesmosClient.connect(chainInfo.rpcUrl, {
          gasPrice,
          gasAdjustment: 1.8,
        }).then((c) =>
          c.estimateTxFee(activeAccount.address, messages, {
            publicKey: {
              algo: activeAccount.algo,
              bytes: activeAccount.pubKey,
            },
            memo,
          }),
        ),
        feeEstimationTimeoutMs,
      );

      // Create a new time to track the estimation fee execution time.
      const timer = new Timer();
      const feeEstimationResult = await ResultAsync.fromPromise(feeEstimationPromise, (e) =>
        Error(`Error while estimating the fees: ${e}`),
      );
      // Get the current timer value in ms.
      const executionTime = timer.currentMs();

      let computedFee: StdFee;
      if (feeEstimationResult.isOk()) {
        // The fee estimation completed without errors.
        const timeoutResult = feeEstimationResult.value;

        // Check if the estimation has completed in the required amount of
        // time or if it has exced the allowed execution time.
        if (timeoutResult.isCompleted()) {
          if (trackFeeEstimation) {
            postHog?.capture('Transaction Fee Estimated', {
              'Estimation Time Milliseconds': executionTime,
            });
          }
          computedFee = timeoutResult.data;
        } else {
          if (trackFeeEstimation) {
            postHog?.capture('Transaction Fee Estimation Timeout');
          }
          computedFee = fallbackFee;
        }
      } else {
        computedFee = fallbackFee;
      }

      setEstimatedFee(computedFee);
      setAreFeeApproximated(computedFee === fallbackFee);
      setEstimatingFee(false);
    },
    [
      trackFeeEstimation,
      activeAccount,
      chainInfo.rpcUrl,
      feeEstimationTimeoutMs,
      gasOnFeeEstimationTimeout,
      gasPrice,
      postHog,
    ],
  );

  return {
    estimateFees,
    estimatingFee,
    areFeeApproximated,
    estimatedFee,
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

  const transactionProperties = useTransactionProperties();
  const trackEvent = useTrackEvent();
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

      trackEvent(Events.TransactionSigning, {
        ...transactionProperties,
        'Wallet Type': wallet.type,
      });
      const signResult = await signTx(wallet, {
        mode: SignMode.Online,
        messages,
        memo,
        fees,
      });

      if (signResult.isErr()) {
        trackEvent(Events.TransactionSignFailed, {
          ...transactionProperties,
          Error: signResult.error,
        });
        return err(signResult.error);
      }

      trackEvent(Events.TransactionBroadcasting, transactionProperties);
      const broadcastResult = await broadcastTx(wallet, signResult.value);
      if (broadcastResult.isOk()) {
        trackEvent(Events.TransactionBroadcastSuccess, transactionProperties);
        trackTransactionPerformed(messages);
      } else {
        trackEvent(Events.TransactionBroadcastFail, {
          ...transactionProperties,
          Error: broadcastResult.error,
        });
      }

      return broadcastResult;
    },
    [
      unlockWallet,
      activeAccount,
      trackEvent,
      transactionProperties,
      signTx,
      broadcastTx,
      trackTransactionPerformed,
    ],
  );
};
