import React from 'react';
import { usePostHog } from 'posthog-react-native';

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
