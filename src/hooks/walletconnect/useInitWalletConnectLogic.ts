import { useWalletConnectClientState } from '@recoil/walletconnect';
import { useEffect } from 'react';
import { useRemoveSessionByTopic, useWalletConnectSessions } from '@recoil/walletConnectSessions';
import { WalletConnectClientStatus } from 'types/walletConnect';
import { SignClientTypes } from '@walletconnect/types';
import useWalletConnectOnSessionExpire from './useWalletConnectOnSessionExpire';
import useWalletConnectOnSessionRequest from './useWalletConnectOnSessionRequest';
import useWalletConnectOnSessionDelete from './useWalletConnectOnSessionDelete';

const useInitWalletConnectLogic = () => {
  const state = useWalletConnectClientState();
  const onSessionRequest = useWalletConnectOnSessionRequest();
  const onSessionDelete = useWalletConnectOnSessionDelete();
  const onSessionExpire = useWalletConnectOnSessionExpire();
  const deleteSessionByTopic = useRemoveSessionByTopic();
  const savedSessions = useWalletConnectSessions();

  // Effect to subscribe and unsubscribe to session_request
  useEffect(() => {
    if (state.status === WalletConnectClientStatus.Connected) {
      const onSessionRequestWithClient = (
        args: SignClientTypes.EventArguments['session_request'],
      ) => {
        onSessionRequest(state.client, args);
      };
      state.client.on('session_request', onSessionRequestWithClient);
      return () => {
        state.client.off('session_request', onSessionRequestWithClient);
      };
    }
    return () => {};
  }, [onSessionRequest, state]);

  // Effect to subscribe and unsubscribe to session_delete
  useEffect(() => {
    if (state.status === WalletConnectClientStatus.Connected) {
      state.client.on('session_delete', onSessionDelete);
      return () => {
        state.client.off('session_delete', onSessionDelete);
      };
    }
    return () => {};
  }, [onSessionDelete, state]);

  // Effect to subscribe and unsubscribe to session_expire
  useEffect(() => {
    if (state.status === WalletConnectClientStatus.Connected) {
      state.client.on('session_expire', onSessionExpire);
      return () => {
        state.client.off('session_expire', onSessionExpire);
      };
    }
    return () => {};
  }, [onSessionExpire, state]);

  // Effect to remove the inactive sessions on connect.
  useEffect(() => {
    if (state.status === WalletConnectClientStatus.Connected) {
      // Remove all the inactive sessions from the device storage
      const activeSessions = state.client.session.values;
      Object.values(savedSessions)
        .flatMap((s) => s)
        .filter((s) => !activeSessions.find((as) => as.topic === s.topic))
        .forEach(({ topic }) => deleteSessionByTopic(topic));

      state.client.pendingRequest.values.forEach((pendingRequest, index, array) => {
        onSessionRequest(state.client, pendingRequest, array.length - 1 === index);
      });
    }
  }, [deleteSessionByTopic, onSessionRequest, savedSessions, state]);
};

export default useInitWalletConnectLogic;
