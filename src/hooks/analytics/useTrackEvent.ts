import React from 'react';
import { usePostHog } from 'posthog-react-native';

/**
 * Hook that returns a function that can be used to track an event.
 */
const useTrackEvent = () => {
  const postHog = usePostHog();

  return React.useCallback(
    (event: string, properties?: Record<string, any>) => {
      if (!postHog) {
        return;
      }

      postHog.capture(event, properties);
    },
    [postHog],
  );
};

export default useTrackEvent;
