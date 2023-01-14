import { useSetWalletConnectClient, useWalletConnectClient } from '@recoil/walletconnect';
import { useCallback, useEffect } from 'react';
import SignClient from '@walletconnect/sign-client';
import { WALLET_CONNECT_PROJECT_ID } from '@env';
import * as WalletConnectMMKV from 'lib/MMKVStorage/walletconnect';
import {
  useGetSessionByTopic,
  useRemoveSessionByTopic,
  useWalletConnectSessions,
} from '@recoil/walletConnectSessions';
import useOnSessionRequestCallback from 'hooks/walletconnect/useOnSessionRequestCallback';
import { decodeSessionRequest } from 'lib/WalletConnectUtils';
import { getSdkError } from '@walletconnect/utils';
import { useStoreWalletConnectSessionRequest } from '@recoil/walletConnectRequests';
import useOnSessionDeleteCallback from './useOnSessionDeleteCallback';

const useInitWalletConnectClient = () => {
  const setWalletConnectClient = useSetWalletConnectClient();
  const client = useWalletConnectClient();
  const onSessionRequest = useOnSessionRequestCallback(client?.client);
  const onSessionDelete = useOnSessionDeleteCallback();
  const deleteSessionByTopic = useRemoveSessionByTopic();
  const savedSessions = useWalletConnectSessions();
  const getSessionByTopic = useGetSessionByTopic();
  const storeSessionRequest = useStoreWalletConnectSessionRequest();

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

      signClient.pendingRequest.values.forEach((pendingRequest) => {
        const session = getSessionByTopic(pendingRequest.topic);
        if (session === undefined) {
          signClient.respond({
            topic: pendingRequest.topic,
            response: {
              id: pendingRequest.id,
              jsonrpc: '2.0',
              error: getSdkError('USER_DISCONNECTED'),
            },
          });
          return;
        }

        const decoded = decodeSessionRequest(pendingRequest, session.accountAddress);
        if (decoded.isError()) {
          signClient.respond({
            topic: pendingRequest.topic,
            response: {
              id: pendingRequest.id,
              jsonrpc: '2.0',
              error: getSdkError('INVALID_METHOD'),
            },
          });
        } else {
          storeSessionRequest(decoded.value);
        }
      });
    } catch (e) {
      console.warn('Error initializing Wallet connect', e);
    }
  }, [
    deleteSessionByTopic,
    getSessionByTopic,
    savedSessions,
    setWalletConnectClient,
    storeSessionRequest,
  ]);
};

export default useInitWalletConnectClient;
