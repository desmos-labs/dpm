import React from 'react';
import { SessionTypes } from '@walletconnect/types';
import useTrackEvent from 'hooks/analytics/useTrackEvent';
import { Events } from 'types/analytics';

/**
 * Hook that provides a function to track when a user approve a
 * WalletConnect session request.
 */
const useTrackWalletConnectSessionEstablished = () => {
  const trackEvent = useTrackEvent();

  return React.useCallback(
    (session: SessionTypes.Struct) => {
      trackEvent(Events.WalletConnectSessionEstablished, {
        CreationTime: new Date().toISOString(),
        ApplicationName: session.peer.metadata.name,
        Namespaces: session.requiredNamespaces,
      });
    },
    [trackEvent],
  );
};

export default useTrackWalletConnectSessionEstablished;
