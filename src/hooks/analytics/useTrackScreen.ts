import React from 'react';
import { usePostHog } from 'posthog-react-native';

/**
 * Hook to track a screen view.
 * @param screenName - Name of the screen to track.
 */
const useTrackScreen = (screenName: string) => {
  const postHog = usePostHog();

  React.useEffect(() => {
    if (!postHog) {
      return;
    }

    postHog.screen(screenName);
  }, [postHog, screenName]);
};

export default useTrackScreen;
