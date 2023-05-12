/**
 * Represents what user behaviours have been tracked.
 */
export type AnalyticsStatus = {
  /**
   * Indicates whether the application tracked accounts created
   * before the analytics were added.
   */
  trackedOldCreatedAccount: boolean;
};
