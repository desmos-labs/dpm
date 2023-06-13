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

// Application events
export const EVENT_APPLICATION_OPENED = 'Application Opened';

// Wallet events
export const EVENT_ACCOUNT_CREATED = 'Wallet Created';
export const EVENT_ACCOUNT_IMPORTED = 'Wallet Imported';

// WalletConnect events
export const EVENT_WALLET_CONNECT_SESSION_ESTABLISHED = 'WalletConnect Session Established';

// Operations events
export const EVENT_SAVE_PROFILE = 'Save Profile';
export const EVENT_LINK_CHAIN = 'Link Chain Account';
export const EVENT_UNLINK_CHAIN = 'Unlink Chain Account';
export const EVENT_SEND_TOKENS = 'Send Tokens';
export const EVENT_DELEGATE_TOKENS = 'Delegate Tokens';
export const EVENT_UNDELEGATE_TOKENS = 'Undelegate Tokens';
export const EVENT_REDELEGATE_TOKENS = 'Redelegate Tokens';
export const EVENT_WITHDRAW_REWARDS = 'Withdraw Rewards';
