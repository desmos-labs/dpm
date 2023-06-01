import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { AppState, NativeEventSubscription } from 'react-native';

const APPLICATION_OPENED_EVENT = 'Application Opened';

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
        postHog.capture(APPLICATION_OPENED_EVENT);
        setAppStarted(true);
      } else {
        subscription = AppState.addEventListener('change', (state) => {
          if (state === 'active') {
            postHog.capture(APPLICATION_OPENED_EVENT);
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
