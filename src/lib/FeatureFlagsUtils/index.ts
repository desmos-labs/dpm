import {
  AppFeatureFlags,
  DefaultPostHogFeatureFlags,
  PostHogFeatureFlags,
} from 'types/appFeatureFlags';

/**
 * Function that converts the version received from PostHog into
 * a format that the application can use.
 * @param version - The version received from PostHog that should be converted.
 */
const convertPostHogVersion = (version?: string): string => {
  if (version === undefined) {
    return '';
  }

  // Here we replace the "_" with a "." because PostHog doesn't support variant keys with the "." char.
  return version.replace(/_/g, '.');
};

/**
 * Function to convert the feature flags received from posthog into
 * a format that the application can use.
 * @param featureFlags - The feature flags received from Posthog.
 */
export const convertPostHogFeatureFlags = (
  featureFlags: PostHogFeatureFlags | undefined,
): AppFeatureFlags => {
  const safeFeatureFlags = {
    ...DefaultPostHogFeatureFlags,
    ...featureFlags,
  };
  return {
    trackFeeEstimation: safeFeatureFlags.trackFeeEstimation,
    feeEstimationTimeoutMs: parseInt(safeFeatureFlags.feeEstimationTimeoutMs, 10),
    gasOnFeeEstimationTimeout: parseInt(safeFeatureFlags.gasOnFeeEstimationTimeout, 10),
    hideSocialLoginsOnVersion: convertPostHogVersion(safeFeatureFlags.hideSocialLoginsOnVersion),
  };
};
