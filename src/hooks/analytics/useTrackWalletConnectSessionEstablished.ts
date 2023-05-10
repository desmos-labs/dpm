import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { SessionTypes } from '@walletconnect/types';

const EVENT_WALLET_CONNECT_SESSION_ESTABLISHED = 'WalletConnect Session Established';

/**
 * Hook that provides a function to track when a user approve a
 * WalletConnect session request.
 */
const useTrackWalletConnectSessionEstablished = () => {
  const postHog = usePostHog();

  return React.useCallback(
    (session: SessionTypes.Struct) => {
      if (!postHog) {
        return;
      }

      postHog.capture(EVENT_WALLET_CONNECT_SESSION_ESTABLISHED, {
        CreationTime: new Date().toISOString(),
        ApplicationName: session.peer.metadata.name,
        ApplicationDescription: session.peer.metadata.description,
        Namespaces: session.requiredNamespaces,
      });
    },
    [postHog],
  );
};

export default useTrackWalletConnectSessionEstablished;
