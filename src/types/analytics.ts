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

// Transaction events
export const EVENT_TRANSACTION_SIGNING = 'Signing Transaction';
export const EVENT_TRANSACTION_SIGNED = 'Transaction Signed';
export const EVENT_TRANSACTION_SIGN_FAILED = 'Transaction Sign Failed';
export const EVENT_TRANSACTION_BROADCASTING = 'Broadcasting Transaction';
export const EVENT_TRANSACTION_BROADCAST_SUCCESSFUL = 'Transaction Broadcasted Successfully';
export const EVENT_TRANSACTION_BROADCAST_FAILED = 'Transaction Broadcast Failed';

// Profile events
export const EVENT_SAVE_PROFILE = 'Save Profile';
export const EVENT_LINK_CHAIN = 'Link Chain Account';
export const EVENT_UNLINK_CHAIN = 'Unlink Chain Account';

// Bank events
export const EVENT_SEND_TOKENS = 'Send Tokens';

// Staking events
export const EVENT_DELEGATE_TOKENS = 'Delegate Tokens';
export const EVENT_UNDELEGATE_TOKENS = 'Undelegate Tokens';
export const EVENT_REDELEGATE_TOKENS = 'Redelegate Tokens';

// Distribution events
export const EVENT_WITHDRAW_REWARDS = 'Withdraw Rewards';

// Screen names
export enum Screens {
  Profile = 'Profile',
  ProfileEdit = 'Edit Profile',
  SendTokens = 'Send Tokens',
  BroadcastTransaction = 'Broadcast Transaction',
}
