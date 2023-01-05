import { HdPath } from '@cosmjs/crypto';
import { LedgerApp } from 'types/ledger';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { Signer } from '@desmoslabs/desmjs';

export enum WalletSerializationVersion {
  Mnemonic = 1,
  Ledger = 1,
  Web3Auth = 1,
}

/**
 * Enum that represents the type of wallet that the app supports.
 */
export enum WalletType {
  /**
   * Wallet generated from a mnemonic of witch the key pair is stored
   * encrypted in the device storage.
   */
  Mnemonic = 'mnemonic',
  /**
   * Wallet imported from a Ledger device.
   */
  Ledger = 'ledger',
  /**
   * Wallet imported using Web3Auth.
   */
  Web3Auth = 'web3auth',
}

/**
 * Interface holding the common fields between each wallet type.
 */
interface BaseWallet {
  /**
   * Wallet bech32 address.
   */
  readonly address: string;
  /**
   * Signer that can be used with the DesmosClient to sign transactions.
   */
  readonly signer: Signer;
}

/**
 * Interface that represents a wallet created from a mnemonic.
 */
export interface MnemonicWallet extends BaseWallet {
  readonly type: WalletType.Mnemonic;
  /**
   * HD Derivation path used to generate the user
   * private key.
   */
  readonly hdPath: HdPath;
  /**
   * secp256k1 private key derived from the mnemonic with the hdPath.
   */
  readonly privateKey: Uint8Array;
}

/**
 * [MnemonicWallet] that can be serialized to JSON.
 */
export type SerializableMnemonicWallet = Omit<
  MnemonicWallet,
  'signer' | 'privateKey' | 'hdPath'
> & {
  readonly version: WalletSerializationVersion.Mnemonic;
  /**
   * HD Derivation path used to generate the user
   * private key.
   */
  readonly hdPath: string;
  /**
   * Hex encoded private key.
   */
  readonly privateKey: string;
};

/**
 * Interface representing a wallet imported through a Ledger device.
 */
export interface LedgerWallet extends BaseWallet {
  readonly type: WalletType.Ledger;
  /**
   * HD Derivation path used to generate the user
   * private key.
   */
  readonly hdPath: HdPath;
}

/**
 * [LedgerWallet] that can be serialized to JSON.
 */
export type SerializableLedgerWallet = Omit<LedgerWallet, 'signer' | 'hdPath'> & {
  version: WalletSerializationVersion.Ledger;
  /**
   * HD Derivation path used to generate the user
   * private key.
   */
  readonly hdPath: string;
};

/**
 * Interface representing a wallet imported through Web3Auth.
 */
export interface Web3AuthWallet extends BaseWallet {
  readonly type: WalletType.Web3Auth;
  /**
   * Login method used from the user.
   */
  readonly loginProvider: string;
  /**
   * secp256k1 private key obtained from Web3Auth.
   */
  readonly privateKey: Uint8Array;
}

/**
 * [Web3AuthWallet] that can be serialized to JSON.
 */
export type SerializableWeb3AuthWallet = Omit<Web3AuthWallet, 'signer' | 'privateKey'> & {
  version: WalletSerializationVersion.Web3Auth;
  /**
   * Hex encoded private key.
   */
  privateKey: string;
};

/**
 * Type representing all the supported wallets.
 */
export type Wallet = MnemonicWallet | LedgerWallet | Web3AuthWallet;

/**
 * Type representing a wallet that can be serialized to JSON and
 * stored in the device storage.
 */
export type SerializableWallet =
  | SerializableMnemonicWallet
  | SerializableLedgerWallet
  | SerializableWeb3AuthWallet;

export interface BaseWalletGenerationData {
  readonly accountPrefix: string;
}

export interface MnemonicGenerationData extends BaseWalletGenerationData {
  readonly type: WalletType.Mnemonic;
  readonly mnemonic: string;
  readonly hdPaths: HdPath[];
}

export interface LedgerGenerationData extends BaseWalletGenerationData {
  readonly type: WalletType.Ledger;
  readonly app: LedgerApp;
  readonly transport: BluetoothTransport;
  readonly hdPaths: HdPath[];
}

export interface Web3AuthGenerationData extends BaseWalletGenerationData {
  readonly type: WalletType.Web3Auth;
  readonly privateKey: Uint8Array;
  readonly loginProvider: string;
}

export type WalletGenerationData =
  | MnemonicGenerationData
  | LedgerGenerationData
  | Web3AuthGenerationData;
