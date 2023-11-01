import { usePostHog } from 'posthog-react-native';
import React from 'react';
import { useSetCachedFeatureFlags } from '@recoil/featureFlags';
import { convertPostHogFeatureFlags } from 'lib/FeatureFlagsUtils';
import { PostHogFeatureFlags } from 'types/appFeatureFlags';
import { promiseToResult } from 'lib/NeverThrowUtils';

/**
 * Hook that provides a function to fetch the application feature flags.
 * The function returns a boolean that indicates if the feature flags
 * have been loaded.
 */
const useFetchAppFeatureFlags = () => {
  const posthog = usePostHog();
  const setAppFeatureFlags = useSetCachedFeatureFlags();

  return React.useCallback(async () => {
    if (!posthog) {
      console.log('PostHog not found');
      return false;
    }

    const featureFlagsFetchResult = await promiseToResult(
      posthog.reloadFeatureFlagsAsync(),
      'Unknown error while fetching feature flags',
    );
    console.log(featureFlagsFetchResult);

    if (featureFlagsFetchResult.isOk()) {
      setAppFeatureFlags(
        convertPostHogFeatureFlags(posthog.getFeatureFlagPayloads() as PostHogFeatureFlags),
      );
    }

    return featureFlagsFetchResult.isOk();
  }, [posthog, setAppFeatureFlags]);
};

export default useFetchAppFeatureFlags;
