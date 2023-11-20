import { HdPath } from '@cosmjs/crypto';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { LedgerApp } from 'types/ledger';
import { Web3AuthLoginProvider } from 'types/web3auth';

export enum WalletPickerMode {
  Mnemonic,
  Ledger,
  Web3Auth,
}

interface BaseWalletPickerParams {
  readonly mode: WalletPickerMode;
  readonly addressPrefix: string;
  /**
   * List of addresses that shouldn't be displayed in the
   * list.
   */
  readonly ignoreAddresses?: string[];
  /**
   * If true the UI will allow the user to select multiple accounts.
   */
  readonly allowMultiSelect?: boolean;
}

interface WalletPickerMnemonicParams extends BaseWalletPickerParams {
  readonly mode: WalletPickerMode.Mnemonic;
  readonly masterHdPath: HdPath;
  readonly mnemonic: string;
  readonly allowCoinTypeEdit?: boolean;
}

interface WalletPickerLedgerParams extends BaseWalletPickerParams {
  readonly mode: WalletPickerMode.Ledger;
  readonly masterHdPath: HdPath;
  readonly transport: BluetoothTransport;
  readonly ledgerApp: LedgerApp;
}

interface WalletPickerWeb3AuthParams extends BaseWalletPickerParams {
  readonly mode: WalletPickerMode.Web3Auth;
  readonly loginProvider: Web3AuthLoginProvider;
  readonly privateKey: Uint8Array;
}

export type AccountPickerParams =
  | WalletPickerMnemonicParams
  | WalletPickerLedgerParams
  | WalletPickerWeb3AuthParams;
