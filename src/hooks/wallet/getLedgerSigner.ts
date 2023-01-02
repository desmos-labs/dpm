import {LedgerApp as CosmosLedgerApp} from '@cosmjs/ledger-amino/build/ledgerapp';
import {LedgerSigner} from '@cosmjs/ledger-amino';
import {LedgerApp} from 'types/ledger';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import TerraLedgerApp from 'utilils/terra';
import {HdPath} from '@cosmjs/crypto';
import {OfflineSignerAdapter, Signer} from '@desmoslabs/desmjs';

/**
 * Hook allowing to generate a [Signer] instance that relies on a Ledger device to sign transactions.
 * @param prefix - Account prefix that should be used to generate the Bech32 address of the wallet.
 * @param hdPaths - HD paths that should be used to generate the wallet. If more than one is specified,
 * the getAccounts() method will return all the information for each account.
 * @param app - Ledger app that should be used to sign the transactions.
 * @param transport - Bluetooth Transport that should be used to connect to the Ledger device.
 */
const getLedgerSigner = (prefix: string, hdPaths:HdPath[], app: LedgerApp, transport: BluetoothTransport): Signer => {
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

export default getLedgerSigner;
