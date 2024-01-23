import { useCallback } from 'react';
import { WalletConnectSession } from 'types/walletConnect';
import { useRemoveSessionByTopic } from '@recoil/walletConnectSessions';
import { getSdkError } from '@walletconnect/utils';
import { err } from 'neverthrow';
import { promiseToResult } from 'lib/NeverThrowUtils';
import useGetOrConnectWalletConnectClient from './useGetOrConnectWalletConnetClient';

/**
 * Hook that provides a function to accept a session request.
 */
const useWalletConnectCloseSession = () => {
  const getClient = useGetOrConnectWalletConnectClient();
  const removeSessionByTopic = useRemoveSessionByTopic();

  return useCallback(
    async (session: WalletConnectSession) => {
      const getClientResult = await getClient();
      if (getClientResult.isErr()) {
        return err(getClientResult.error);
      }
      const client = getClientResult.value;
      return promiseToResult(
        client
          .disconnect({
            topic: session.topic,
            reason: getSdkError('USER_DISCONNECTED'),
          })
          .then(() => removeSessionByTopic(session.topic)),
        `Unknown error while closing session ${session.topic}`,
      );
    },
    [getClient, removeSessionByTopic],
  );
};

export default useWalletConnectCloseSession;
