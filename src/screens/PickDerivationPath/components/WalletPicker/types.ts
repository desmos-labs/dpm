import { HdPath } from '@cosmjs/crypto';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { LedgerApp } from 'types/ledger';

export enum WalletPickerMode {
  Mnemonic,
  Ledger,
}

export interface BaseWalletPickerParams {
  readonly mode: WalletPickerMode;
  readonly masterHdPath: HdPath;
  readonly addressPrefix: string;
  /**
   * HdPath to be ignored during the generation.
   */
  readonly ignorePaths?: HdPath[];
}

export interface WalletPickerMnemonicParams extends BaseWalletPickerParams {
  mode: WalletPickerMode.Mnemonic;
  mnemonic: string;
  allowCoinTypeEdit?: boolean;
}

export interface WalletPickerLedgerParams extends BaseWalletPickerParams {
  mode: WalletPickerMode.Ledger;
  transport: BluetoothTransport;
  ledgerApp: LedgerApp;
}

export type WalletPickerParams = WalletPickerMnemonicParams | WalletPickerLedgerParams;
