import React from 'react';
import { AppState, NativeEventSubscription } from 'react-native';
import useTrackEvent from 'hooks/analytics/useTrackEvent';
import { Events } from 'types/analytics';

/**
 * Hook to track when the user opens the applications.
 */
const useTrackAppOpened = () => {
  const trackEvent = useTrackEvent();
  const [appStarted, setAppStarted] = React.useState(false);

  React.useEffect(() => {
    let subscription: NativeEventSubscription | undefined;
    if (!appStarted) {
      if (AppState.currentState === 'active') {
        trackEvent(Events.ApplicationOpened);
        setAppStarted(true);
      } else {
        subscription = AppState.addEventListener('change', (state) => {
          if (state === 'active') {
            trackEvent(Events.ApplicationOpened);
          }
        });
      }
    }

    return () => {
      subscription?.remove();
    };
  }, [appStarted, trackEvent]);
};

export default useTrackAppOpened;
