import React from 'react';
import { AppState, NativeEventSubscription } from 'react-native';
import { EVENT_APPLICATION_OPENED } from 'types/analytics';
import useTrackEvent from 'hooks/analytics/useTrackEvent';

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
        trackEvent(EVENT_APPLICATION_OPENED);
        setAppStarted(true);
      } else {
        subscription = AppState.addEventListener('change', (state) => {
          if (state === 'active') {
            trackEvent(EVENT_APPLICATION_OPENED);
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
