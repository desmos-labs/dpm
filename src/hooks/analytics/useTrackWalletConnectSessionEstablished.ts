import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { SessionTypes } from '@walletconnect/types';
import useIsTestnetEvent from 'hooks/analytics/useIsTestnetEvent';

const EVENT_WALLET_CONNECT_SESSION_ESTABLISHED = 'WalletConnect Session Established';

/**
 * Hook that provides a function to track when a user approve a
 * WalletConnect session request.
 */
const useTrackWalletConnectSessionEstablished = () => {
  const postHog = usePostHog();
  const isTestnetEvent = useIsTestnetEvent();

  return React.useCallback(
    (session: SessionTypes.Struct) => {
      if (!postHog || isTestnetEvent) {
        return;
      }

      postHog.capture(EVENT_WALLET_CONNECT_SESSION_ESTABLISHED, {
        CreationTime: new Date().toISOString(),
        ApplicationName: session.peer.metadata.name,
        Namespaces: session.requiredNamespaces,
      });
    },
    [postHog, isTestnetEvent],
  );
};

export default useTrackWalletConnectSessionEstablished;
