import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import { DeliverTxResponse } from '@desmoslabs/desmjs';
import { StdFee } from '@cosmjs/amino';

const EVENT_TRANSACTION_PERFORMED = 'Transaction Performed';

/**
 * Hook that provides a function to track a transaction that has been
 * performed from the user.
 */
const useTrackTransactionPerformed = () => {
  const postHog = usePostHog();

  return React.useCallback(
    async (
      walletAddress: string,
      msgs: EncodeObject[],
      memo: string | undefined,
      fees: StdFee,
      txResponse: DeliverTxResponse,
    ) => {
      if (postHog === undefined) {
        return;
      }

      postHog.capture(EVENT_TRANSACTION_PERFORMED, {
        CreationTime: new Date().toISOString(),
        WalletAddress: walletAddress,
        TxHash: txResponse.transactionHash,
        MsgType: msgs.map((m) => m.typeUrl),
        Msg: msgs,
        Memo: memo ?? '',
        BlockHeight: txResponse.height,
        GasSpent: txResponse.gasUsed,
        Fees: fees,
      });
    },
    [postHog],
  );
};

export default useTrackTransactionPerformed;
