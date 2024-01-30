import React from 'react';
import useTrackEvent from 'hooks/analytics/useTrackEvent';
import { Events } from 'types/analytics';

/**
 * Hook that provides a function to track when a user approve a
 * WalletConnect session request.
 */
const useTrackWalletConnectSessionEstablished = () => {
  const trackEvent = useTrackEvent();

  return React.useCallback(
    (appName: string, namespaces: any) => {
      trackEvent(Events.WalletConnectSessionEstablished, {
        CreationTime: new Date().toISOString(),
        ApplicationName: appName,
        Namespaces: namespaces,
      });
    },
    [trackEvent],
  );
};

export default useTrackWalletConnectSessionEstablished;
