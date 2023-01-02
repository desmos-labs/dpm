import Wallet, {WalletGenerationData, WalletType} from 'types/wallet';
import {OfflineSignerAdapter, Signer, SigningMode} from '@desmoslabs/desmjs';
import {HdPath} from '@cosmjs/crypto';
import {LedgerApp} from 'types/ledger';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import {LedgerApp as CosmosLedgerApp} from '@cosmjs/ledger-amino/build/ledgerapp';
import {LedgerSigner} from '@cosmjs/ledger-amino';
import TerraLedgerApp from '../../utilils/terra';

/**
 * Hook allowing to generate a [Signer] instance that relies on a Ledger device to sign transactions.
 * @param prefix - Account prefix that should be used to generate the Bech32 address of the wallet.
 * @param hdPaths - HD paths that should be used to generate the wallet. If more than one is specified,
 * the getAccounts() method will return all the information for each account.
 * @param app - Ledger app that should be used to sign the transactions.
 * @param transport - Bluetooth Transport that should be used to connect to the Ledger device.
 */
export const getLedgerSigner = (prefix: string, hdPaths:HdPath[], app: LedgerApp, transport: BluetoothTransport): Signer => {
  let ledgerApp: CosmosLedgerApp | undefined;
  if (app.name === 'Terra') {
    ledgerApp = new TerraLedgerApp(transport!);
  }

  return new OfflineSignerAdapter(new LedgerSigner(transport!, {
    minLedgerAppVersion: app.minVersion,
    ledgerAppName: app.name,
    prefix,
    hdPaths,
    ledgerApp,
  }));
};

/**
 * Hook allowing to get a [Signer] instance that relies on a mnemonic.
 * @param prefix - Account prefix that should be used to generate the Bech32 address of the wallet.
 * @param hdPaths - HD paths that should be used to generate the wallet. If more than one is specified,
 * the getAccounts() method will return all the information for each account.
 * @param mnemonic - Mnemonic from which to generate the wallet.
 */
export const getMnemonicSigner = async (prefix: string, hdPaths: HdPath[], mnemonic: string): Promise<Signer> => {
  return OfflineSignerAdapter.fromMnemonic(SigningMode.DIRECT, mnemonic, {
    prefix,
    hdPath: hdPaths,
  });
};

export const generateWallet = async (data: WalletGenerationData, hdPaths?: HdPath[]): Promise<Wallet> => {
  let signer: Signer;
  switch (data.type) {
    case WalletType.Ledger:
      if (!hdPaths || hdPaths.length === 0) {
        return Promise.reject(new Error('At least one HD path needs to be specified'));
      }
      signer = await getLedgerSigner(data.accountPrefix, hdPaths, data.app, data.transport);
      break;

    case WalletType.Mnemonic:
      if (!hdPaths || hdPaths.length === 0) {
        return Promise.reject(new Error('At least one HD path needs to be specified'));
      }
      signer = await getMnemonicSigner(data.accountPrefix, hdPaths, data.mnemonic);
      break;

    default:
      return Promise.reject(new Error(`Cannot generate wallet from HD path for import type ${data.type}`));
  }

  return {
    type: data.type,
    signer,
    hdPaths,
  } as Wallet;
};
