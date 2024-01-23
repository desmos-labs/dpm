import { useRemoveSessionByTopic, useWalletConnectSessions } from '@recoil/walletConnectSessions';
import { getSdkError } from '@walletconnect/utils';
import { promiseToResult } from 'lib/NeverThrowUtils';
import { err } from 'neverthrow';
import React from 'react';
import useGetOrConnectWalletConnectClient from './useGetOrConnectWalletConnetClient';

/**
 * Hook that provides a function to close all WalletConnect sessions of a user.
 */
const useWalletConnectCloseAccountSessions = () => {
  const getClient = useGetOrConnectWalletConnectClient();
  const sessions = useWalletConnectSessions();
  const deleteSession = useRemoveSessionByTopic();

  return React.useCallback(
    async (account: string) => {
      const clientResult = await getClient();
      if (clientResult.isErr()) {
        return err(clientResult.error);
      }

      const client = clientResult.value;
      const userSessions = sessions[account] ?? [];
      const promises = userSessions.map((session) =>
        client
          .disconnect({
            topic: session.topic,
            reason: getSdkError('USER_DISCONNECTED'),
          })
          .then(() => deleteSession(session.topic)),
      );

      return promiseToResult(
        Promise.all(promises),
        'Unknown error while closing account sessions',
      ).then(() => undefined);
    },
    [deleteSession, getClient, sessions],
  );
};

export default useWalletConnectCloseAccountSessions;
