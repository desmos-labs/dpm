import React from 'react';
import { usePostHog } from 'posthog-react-native';

/**
 * Hook to track a screen view.
 * @param screenName - Name of the screen to track.
 * @param properties - Additional properties to track.
 */
const useTrackScreen = (screenName: string, properties?: any) => {
  const postHog = usePostHog();

  React.useEffect(() => {
    if (!postHog) {
      return;
    }

    postHog.screen(screenName, properties);
  }, [postHog, properties, screenName]);
};

export default useTrackScreen;
