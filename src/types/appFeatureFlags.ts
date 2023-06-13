/**
 * Interface that represents the feature flags supported from the application.
 */
export interface AppFeatureFlags {
  /**
   * Feature flag that tells if the application should track
   * the fee estimation procedure.
   */
  trackFeeEstimation: boolean;
  /**
   * Max amount of milliseconds that we wait
   * to compute the fees of a transaction before
   * falling back to a default value.
   */
  feeEstimationTimeoutMs: number;
  /**
   * Gas that will be used to estimate the fees
   * of a transaction if the estimation procedure
   * times out.
   */
  gasOnFeeEstimationTimeout: number;
}

/**
 * Interface that represents the feature flags returned
 * from posthog.
 */
export interface PostHogFeatureFlags extends Record<string, string | boolean> {
  trackFeeEstimation: boolean;
  feeEstimationTimeoutMs: string;
  gasOnFeeEstimationTimeout: string;
}

/**
 * Default feature flags values if not provided from posthog.
 */
export const DefaultPosthogFeatureFlags: PostHogFeatureFlags = {
  trackFeeEstimation: false,
  feeEstimationTimeoutMs: '5000',
  gasOnFeeEstimationTimeout: '200000',
};
