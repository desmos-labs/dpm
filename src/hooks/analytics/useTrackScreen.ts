import React from 'react';
import { usePostHog } from 'posthog-react-native';

type ScreenProperties = Record<string, string | number | boolean>;

/**
 * Hook to track a screen view.
 * @param screenName - Name of the screen to track.
 * @param properties - Additional properties to track.
 */
const useTrackScreen = (screenName: string, properties?: ScreenProperties) => {
  const postHog = usePostHog();

  const memoizedProperties = React.useMemo(
    () => properties,
    // Safe to disable the eslint checks, the properties object can contain
    // only simple types, so we can safely use Object.keys and Object.values
    // to extract the deps to memoize the object.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [...Object.keys(properties ?? {}), ...Object.values(properties ?? {})],
  );

  React.useEffect(() => {
    if (!postHog) {
      return;
    }

    postHog.screen(screenName, memoizedProperties);
  }, [postHog, screenName, memoizedProperties]);
};

export default useTrackScreen;
