import {
  AppFeatureFlags,
  DefaultPosthogFeatureFlags,
  PostHogFeatureFlags,
} from 'types/appFeatureFlags';

/**
 * Function to convert the feature flags received from posthog into
 * a format that the application can use.
 * @param featureFlags - The feature flags received from Posthog.
 */
export const convertPostHogFeatureFlags = (
  featureFlags: PostHogFeatureFlags | undefined,
): AppFeatureFlags => {
  const safeFeatureFlags = {
    ...DefaultPosthogFeatureFlags,
    ...featureFlags,
  };
  return {
    trackFeeEstimation: safeFeatureFlags.trackFeeEstimation,
    feeEstimationTimeoutMs: parseInt(safeFeatureFlags.feeEstimationTimeoutMs, 10),
    gasOnFeeEstimationTimeout: parseInt(safeFeatureFlags.gasOnFeeEstimationTimeout, 10),
  };
};
