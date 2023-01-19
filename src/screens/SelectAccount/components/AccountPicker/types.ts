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
   * List of addresses that shouldn't be displayed in the
   * list.
   */
  readonly ignoreAddresses?: string[];
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

export type AccountPickerParams = WalletPickerMnemonicParams | WalletPickerLedgerParams;
