import {LedgerApp as CosmosLedgerApp} from '@cosmjs/ledger-amino/build/ledgerapp';
import {LedgerSigner} from '@cosmjs/ledger-amino';
import {LedgerApp} from 'types/ledger';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import {HdPath} from 'types/hdpath';
import toCosmJSHdPath from '../../utilils/hdpath';
import TerraLedgerApp from '../../utilils/terra';

const useGetLedgerSigner = () => (chainPrefix: string, hdPath: HdPath, ledgerApp?: LedgerApp, ledgerTransport?: BluetoothTransport) => {
  if (!ledgerApp || !ledgerTransport) {
    return null;
  }

  let cosmosLedgerApp: CosmosLedgerApp | undefined;
  if (ledgerApp.name === 'Terra') {
    cosmosLedgerApp = new TerraLedgerApp(ledgerTransport!);
  }
  return new LedgerSigner(ledgerTransport!, {
    minLedgerAppVersion: ledgerApp.minVersion,
    ledgerAppName: ledgerApp.name,
    hdPaths: [toCosmJSHdPath(hdPath)],
    prefix: chainPrefix,
    ledgerApp: cosmosLedgerApp,
  });
};

export default useGetLedgerSigner;
