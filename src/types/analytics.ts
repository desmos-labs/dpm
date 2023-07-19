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

export enum Events {
  // Application events
  ApplicationOpened = 'Application Opened',

  // Wallet events
  AccountCreated = 'Wallet Created',
  AccountImported = 'Wallet Imported',

  // WalletConnect events
  WalletConnectSessionEstablished = 'WalletConnect Session Established',

  // Transaction events
  TransactionSigning = 'Signing Transaction',
  TransactionSignFailed = 'Transaction Sign Failed',
  TransactionBroadcasting = 'Broadcasting Transaction',
  TransactionBroadcastSuccess = 'Transaction Broadcasted Successfully',
  TransactionBroadcastFail = 'Transaction Broadcast Failed',

  // Profile events
  SaveProfile = 'Save Profile',
  LinkChain = 'Link Chain Account',
  UnlinkChain = 'Unlink Chain Account',

  // Bank events
  EventSendTokens = 'Send Tokens',

  // Staking events
  DelegateTokens = 'Delegate Tokens',
  UndelegateTokens = 'Undelegate Tokens',
  RedelegateTokens = 'Redelegate Tokens',

  // Distribution events
  WithdrawRewards = 'Withdraw Rewards',
}

// Screen names
export enum Screens {
  Profile = 'Profile',
  ProfileEdit = 'Edit Profile',
  SendTokens = 'Send Tokens',
  BroadcastTransaction = 'Broadcast Transaction',
}
