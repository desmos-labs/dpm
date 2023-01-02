import {Signer} from '@desmoslabs/desmjs';
import {HdPath} from '@cosmjs/crypto';
import {LedgerApp} from 'types/ledger';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';

export const DESMOS_COIN_TYPE = 852;
export const COSMOS_COIN_TYPE = 118;
export const LUNA_COIN_TYPE = 330;
export const KAVA_COIN_TYPE = 459;
export const BAND_COIN_TYPE = 494;
export const CRO_COIN_TYPE = 394;

export const DesmosHdPath: HdPath = {
  coinType: DESMOS_COIN_TYPE,
  account: 0,
  change: 0,
  addressIndex: 0,
};

export const CosmosHdPath: HdPath = {
  coinType: COSMOS_COIN_TYPE,
  account: 0,
  change: 0,
  addressIndex: 0,
};

export const LunaHdPath: HdPath = {
  coinType: LUNA_COIN_TYPE,
  account: 0,
  change: 0,
  addressIndex: 0,
};

export const KavaHdPath: HdPath = {
  coinType: KAVA_COIN_TYPE,
  account: 0,
  change: 0,
  addressIndex: 0,
};

export const BandHdPath: HdPath = {
  coinType: BAND_COIN_TYPE,
  account: 0,
  change: 0,
  addressIndex: 0,
};

export const CroHdPath: HdPath = {
  coinType: CRO_COIN_TYPE,
  account: 0,
  change: 0,
  addressIndex: 0,
};

/**
 * Enum that represents the type of Wallet.
 */
export enum WalletType {
  /**
   * Wallet generated from a mnemonic of witch the key pair is stored
   * encrypted in the device storage.
   */
  Mnemonic,
  /**
   * Wallet imported from a Ledger device.
   */
  Ledger,
  /**
   * Wallet imported using Web3Auth.
   */
  Web3Auth,
}

/**
 * Interface to define the common fields of each wallet type.
 */
interface Wallet {
  /**
   * Type of the wallet.
   */
  type: WalletType;

  /**
   * Hardened derivation path(s) used to generate this wallet.
   */
  hdPaths: HdPath[],

  /**
   * Signer that can be used to sign and broadcast transactions.
   */
  signer: Signer;
}

export interface WalletData {
  readonly accountPrefix: string;
}

export interface MnemonicGenerationData extends WalletData {
  readonly type: WalletType.Mnemonic;
  readonly mnemonic: string;
}

export interface LedgerGenerationData extends WalletData {
  readonly type: WalletType.Ledger;
  readonly app: LedgerApp;
  readonly transport: BluetoothTransport;
}

export interface Web3AuthGenerationData extends WalletData {
  readonly type: WalletType.Web3Auth;
}

export type WalletGenerationData = MnemonicGenerationData | LedgerGenerationData | Web3AuthGenerationData

export default Wallet;
