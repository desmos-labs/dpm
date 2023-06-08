import { usePostHog } from 'posthog-react-native';
import { useSetting } from '@recoil/settings';
import React from 'react';

/**
 * Hook to sync the analytics status from the settings and posthog.
 */
const useSyncPosthog = () => {
  const analyticsEnabled = useSetting('analyticsEnabled');
  const postHog = usePostHog();

  React.useEffect(() => {
    if (!postHog) {
      return;
    }

    const posthogEnabled = !postHog.optedOut;
    if (posthogEnabled !== analyticsEnabled) {
      if (analyticsEnabled) {
        postHog.optIn();
      } else {
        postHog.optOut();
      }
    }

    // Safe to ignore analyticsEnabled, we want to update posthog
    // when it is ready.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postHog]);
};

export default useSyncPosthog;
