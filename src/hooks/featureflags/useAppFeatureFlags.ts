import { useFeatureFlags } from 'posthog-react-native';
import React from 'react';
import { convertPostHogFeatureFlags } from 'components/FeatureFlags';

/**
 * Hook that provides the application feature flags.
 */
const useAppFeatureFlags = () => {
  const postHogFeatureFlags = useFeatureFlags();

  return React.useMemo(
    () => convertPostHogFeatureFlags(postHogFeatureFlags),
    [postHogFeatureFlags],
  );
};

export default useAppFeatureFlags;
