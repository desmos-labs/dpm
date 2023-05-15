/**
 * Represents what user behaviours have been tracked.
 */
export type AnalyticsStatus = {
  /**
   * Indicates whether the application tracked accounts created
   * before the analytics were added.
   */
  trackedOldCreatedAccount: boolean;
  /**
   * Indicates whether the application has identified the user
   * for the accounts created before the analytics were added.
   */
  userIdentified: boolean;
};
