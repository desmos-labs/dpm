import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';
import { StdFee } from '@cosmjs/amino';
import useIsTestnetEvent from 'hooks/analytics/useIsTestnetEvent';

const EVENT_TRANSACTION_PERFORMED = 'Transaction Performed';

/**
 * Hook that provides a function to track a transaction that has been
 * performed from the user.
 */
const useTrackTransactionPerformed = () => {
  const postHog = usePostHog();
  const isTestnetEvent = useIsTestnetEvent();

  return React.useCallback(
    async (msgs: EncodeObject[], fees: StdFee) => {
      if (!postHog || isTestnetEvent) {
        return;
      }

      postHog.capture(EVENT_TRANSACTION_PERFORMED, {
        CreationTime: new Date().toISOString(),
        MsgTypes: msgs.map((m) => m.typeUrl),
        Fees: fees,
      });
    },
    [postHog, isTestnetEvent],
  );
};

export default useTrackTransactionPerformed;
