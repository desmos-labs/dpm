import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { AppState, NativeEventSubscription } from 'react-native';
import { EVENT_APPLICATION_OPENED } from 'types/analytics';

/**
 * Hook to track when the user opens the applications.
 */
const useTrackAppOpened = () => {
  const [appStarted, setAppStarted] = React.useState(false);
  const postHog = usePostHog();

  React.useEffect(() => {
    let subscription: NativeEventSubscription | undefined;
    if (!appStarted && postHog) {
      if (AppState.currentState === 'active') {
        postHog.capture(EVENT_APPLICATION_OPENED);
        setAppStarted(true);
      } else {
        subscription = AppState.addEventListener('change', (state) => {
          if (state === 'active') {
            postHog.capture(EVENT_APPLICATION_OPENED);
          }
        });
      }
    }

    return () => {
      subscription?.remove();
    };
  }, [appStarted, postHog]);
};

export default useTrackAppOpened;
