import { useSetWalletConnectClient } from '@recoil/walletconnect';
import { useCallback } from 'react';
import SignClient from '@walletconnect/sign-client';
import { WALLET_CONNECT_PROJECT_ID } from '@env';
import { SignClientTypes } from '@walletconnect/types';
import * as WalletConnectMMKV from 'lib/MMKVStorage/walletconnect';

const useInitWalletConnectClient = () => {
  const setWalletConnectClient = useSetWalletConnectClient();

  const onSessionProposal = useCallback(
    (args: SignClientTypes.EventArguments['session_proposal']) => {
      console.log('new session proposal', args);
    },
    [],
  );

  const onSessionEvent = useCallback((args: SignClientTypes.EventArguments['session_event']) => {
    console.log('session_event', args);
  }, []);

  const onSessionRequest = useCallback(
    (args: SignClientTypes.EventArguments['session_request']) => {
      console.log('session_request', args);
    },
    [],
  );

  const onSessionDelete = useCallback((args: SignClientTypes.EventArguments['session_delete']) => {
    console.log('session_delete', args);
  }, []);

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

      signClient.on('session_proposal', onSessionProposal);
      signClient.on('session_event', onSessionEvent);
      signClient.on('session_request', onSessionRequest);
      signClient.on('session_delete', onSessionDelete);

      setWalletConnectClient({ client: signClient });
    } catch (e) {
      console.warn('Error initializing Wallet connect', e);
    }
  }, [
    onSessionDelete,
    onSessionEvent,
    onSessionProposal,
    onSessionRequest,
    setWalletConnectClient,
  ]);
};

export default useInitWalletConnectClient;
