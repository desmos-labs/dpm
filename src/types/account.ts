import { Algo } from '@cosmjs/amino';
import { WalletType } from 'types/wallet';
import { HdPath } from '@cosmjs/crypto';

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

export type Account = MnemonicAccount | LedgerAccount | Web3AuthAccount;
