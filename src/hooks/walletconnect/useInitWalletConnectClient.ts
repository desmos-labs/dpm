import { useSetWalletConnectClient, useWalletConnectClient } from '@recoil/walletconnect';
import { useCallback, useEffect } from 'react';
import SignClient from '@walletconnect/sign-client';
import { WALLET_CONNECT_PROJECT_ID } from '@env';
import * as WalletConnectMMKV from 'lib/MMKVStorage/walletconnect';
import { useRemoveSessionByTopic, useWalletConnectSessions } from '@recoil/walletConnectSessions';
import useOnSessionRequestCallback from 'hooks/walletconnect/useOnSessionRequestCallback';
import useOnSessionDeleteCallback from './useOnSessionDeleteCallback';

const useInitWalletConnectClient = () => {
  const setWalletConnectClient = useSetWalletConnectClient();
  const client = useWalletConnectClient();
  const onSessionRequest = useOnSessionRequestCallback(client?.client);
  const onSessionDelete = useOnSessionDeleteCallback();
  const deleteSessionByTopic = useRemoveSessionByTopic();
  const savedSessions = useWalletConnectSessions();

  // Effect to subscribe and unsubscribe to session_request
  useEffect(() => {
    client?.client.on('session_request', onSessionRequest);
    return () => {
      client?.client.off('session_request', onSessionRequest);
    };
  }, [onSessionRequest, client]);

  // Effect to subscribe and unsubscribe to session_delete
  useEffect(() => {
    client?.client.on('session_delete', onSessionDelete);
    return () => {
      client?.client.off('session_delete', onSessionDelete);
    };
  }, [onSessionDelete, client]);

  return useCallback(async () => {
    try {
      const signClient = await SignClient.init({
        projectId: WALLET_CONNECT_PROJECT_ID,
        metadata: {
          name: 'Desmos Profile Manager',
          description: 'Desmos Profile Manager',
          url: 'https://dpm.desmos.network',
          icons: [],
        },
        storage: WalletConnectMMKV,
      });

      setWalletConnectClient({ client: signClient });

      // Remove all the inactive sessions from the device storage
      const activeSessions = signClient.session.values;
      Object.values(savedSessions)
        .flatMap((s) => s)
        .filter((s) => !activeSessions.find((as) => as.topic === s.topic))
        .forEach(({ topic }) => deleteSessionByTopic(topic));

      signClient.pendingRequest.values.forEach((pendingRequest, index, array) => {
        onSessionRequest(pendingRequest, array.length - 1 === index);
      });
    } catch (e) {
      console.warn('Error initializing Wallet connect', e);
    }
  }, [deleteSessionByTopic, onSessionRequest, savedSessions, setWalletConnectClient]);
};

export default useInitWalletConnectClient;
