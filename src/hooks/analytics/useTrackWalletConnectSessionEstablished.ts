import React from 'react';
import { SessionTypes } from '@walletconnect/types';
import { EVENT_WALLET_CONNECT_SESSION_ESTABLISHED } from 'types/analytics';
import useTrackEvent from 'hooks/analytics/useTrackEvent';

/**
 * Hook that provides a function to track when a user approve a
 * WalletConnect session request.
 */
const useTrackWalletConnectSessionEstablished = () => {
  const trackEvent = useTrackEvent();

  return React.useCallback(
    (session: SessionTypes.Struct) => {
      trackEvent(EVENT_WALLET_CONNECT_SESSION_ESTABLISHED, {
        CreationTime: new Date().toISOString(),
        ApplicationName: session.peer.metadata.name,
        Namespaces: session.requiredNamespaces,
      });
    },
    [trackEvent],
  );
};

export default useTrackWalletConnectSessionEstablished;
