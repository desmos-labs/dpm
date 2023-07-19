import React from 'react';
import { usePostHog } from 'posthog-react-native';

/**
 * Hook that returns a function that can be used to track an event.
 * The returned function returns `true` if the event has been tracked
 * `false` otherwise.
 */
const useTrackEvent = () => {
  const postHog = usePostHog();

  return React.useCallback(
    (event: string, properties?: Record<string, any>) => {
      if (!postHog) {
        return false;
      }

      postHog.capture(event, properties);
      return true;
    },
    [postHog],
  );
};

export default useTrackEvent;
