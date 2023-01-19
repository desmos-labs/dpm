import { useWalletConnectClient } from '@recoil/walletconnect';
import { useCallback } from 'react';
import { WalletConnectSession } from 'types/walletConnect';
import { useRemoveSessionByTopic } from '@recoil/walletConnectSessions';
import { getSdkError } from '@walletconnect/utils';

/**
 * Hook that provides a function to accept a session request.
 */
const useWalletConnectCloseSession = () => {
  const wcClient = useWalletConnectClient();
  const removeSessionByTopic = useRemoveSessionByTopic();

  return useCallback(
    async (session: WalletConnectSession) => {
      if (wcClient === undefined) {
        throw new Error('wallet connect client not initialized');
      }

      removeSessionByTopic(session.topic);
      await wcClient.client.disconnect({
        topic: session.topic,
        reason: getSdkError('USER_DISCONNECTED'),
      });
    },
    [removeSessionByTopic, wcClient],
  );
};

export default useWalletConnectCloseSession;
