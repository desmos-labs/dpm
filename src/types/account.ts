import { Algo } from '@cosmjs/amino';
import { Wallet, WalletType } from 'types/wallet';
import { HdPath } from '@cosmjs/crypto';

export enum AccountSerializationVersion {
  Mnemonic = 1,
  Ledger = 1,
  Web3Auth = 1,
}

/**
 * Interface representing a base user account.
 */
export interface BaseAccount {
  /**
   * Type of the wallet associated with this account.
   */
  readonly walletType: WalletType;
  /**
   * Account bech32 address.
   */
  readonly address: string;
  /**
   * Account public key.
   */
  readonly pubKey: Uint8Array;
  /**
   * Account public key type.
   */
  readonly algo: Algo;
}

/**
 * Interface representing an account created with a mnemonic.
 */
export interface MnemonicAccount extends BaseAccount {
  readonly walletType: WalletType.Mnemonic;
  /**
   * HdPath used to derive the user's private key.
   */
  readonly hdPath: HdPath;
}

export type SerializableMnemonicAccount = Omit<MnemonicAccount, 'pubKey' | 'hdPath'> & {
  readonly version: AccountSerializationVersion.Mnemonic;
  /**
   * hex encoded public key.
   */
  readonly pubKey: string;
  /**
   * String representation of the hd derivation path used to derive the user
   * private key.
   */
  readonly hdPath: string;
};

/**
 * Interface representing an account imported through a Ledger device.
 */
export interface LedgerAccount extends BaseAccount {
  readonly walletType: WalletType.Ledger;
  /**
   * HdPath used to derive the user's private key.
   */
  readonly hdPath: HdPath;
  /**
   * Name of the ledger app used to import this account.
   */
  readonly ledgerAppName: string;
}

export type SerializableLedgerAccount = Omit<LedgerAccount, 'pubKey' | 'hdPath'> & {
  readonly version: AccountSerializationVersion.Ledger;
  /**
   * hex encoded public key.
   */
  readonly pubKey: string;
  /**
   * String representation of the hd derivation path used to derive the user
   * private key.
   */
  readonly hdPath: string;
};

/**
 * Interface representing an account imported through Web3Auth.
 */
export interface Web3AuthAccount extends BaseAccount {
  readonly walletType: WalletType.Web3Auth;
  /**
   * Login provider used to obtain the user's private key.
   */
  readonly loginProvider: string;
}

export type SerializableWeb3AuthAccount = Omit<Web3AuthAccount, 'pubKey' | 'hdPath'> & {
  readonly version: AccountSerializationVersion.Web3Auth;
  /**
   * hex encoded public key.
   */
  readonly pubKey: string;
};

export type Account = MnemonicAccount | LedgerAccount | Web3AuthAccount;

export interface AccountWithWallet {
  readonly account: Account;
  readonly wallet: Wallet;
}

export type SerializableAccount =
  | SerializableMnemonicAccount
  | SerializableLedgerAccount
  | SerializableWeb3AuthAccount;
