import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { EncodeObject } from '@cosmjs/proto-signing';

const EVENT_TRANSACTION_PERFORMED = 'Transaction Performed';

/**
 * Hook that provides a function to track a transaction that has been
 * performed from the user.
 */
const useTrackTransactionPerformed = () => {
  const postHog = usePostHog();

  return React.useCallback(
    async (msgs: EncodeObject[]) => {
      if (!postHog) {
        return;
      }

      postHog.capture(EVENT_TRANSACTION_PERFORMED, {
        CreationTime: new Date().toISOString(),
        MsgTypes: msgs.map((m) => m.typeUrl),
      });
    },
    [postHog],
  );
};

export default useTrackTransactionPerformed;
