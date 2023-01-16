import { useWalletConnectClient } from '@recoil/walletconnect';
import { useCallback } from 'react';
import {
  useWalletConnectClearAccountSessions,
  useWalletConnectSessions,
} from '@recoil/walletConnectSessions';
import { getSdkError } from '@walletconnect/utils';

/**
 * Hook that provides a function to accept a session request.
 */
export default function useWalletConnectCloseAccountSessions() {
  const wcClient = useWalletConnectClient();
  const sessions = useWalletConnectSessions();
  const clearAccountSessions = useWalletConnectClearAccountSessions();

  return useCallback(
    async (account: string) => {
      if (wcClient === undefined) {
        throw new Error('wallet connect client not initialized');
      }

      const promises = sessions[account].map((session) =>
        wcClient.client.disconnect({
          topic: session.topic,
          reason: getSdkError('USER_DISCONNECTED'),
        }),
      );

      await Promise.all(promises);
      clearAccountSessions(account);
    },
    [clearAccountSessions, sessions, wcClient],
  );
}