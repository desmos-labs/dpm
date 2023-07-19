import React from 'react';
import { AppState, NativeEventSubscription } from 'react-native';
import useTrackEvent from 'hooks/analytics/useTrackEvent';
import { Events } from 'types/analytics';

/**
 * Hook to track when the user opens the applications.
 */
const useTrackAppOpened = () => {
  const trackEvent = useTrackEvent();
  const [appStartTracked, setAppStartTracked] = React.useState(false);

  React.useEffect(() => {
    let subscription: NativeEventSubscription | undefined;
    if (!appStartTracked) {
      // If the application is active, track the application opened.
      if (AppState.currentState === 'active') {
        setAppStartTracked(trackEvent(Events.ApplicationOpened));
      } else {
        // Application not active, add a listener to listen when the application
        // starts.
        subscription = AppState.addEventListener('change', (state) => {
          if (state === 'active') {
            setAppStartTracked(trackEvent(Events.ApplicationOpened));
          }
        });
      }
    }

    return () => {
      subscription?.remove();
    };
  }, [appStartTracked, trackEvent]);
};

export default useTrackAppOpened;
