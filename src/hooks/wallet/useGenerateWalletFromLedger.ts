import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import {LedgerApp} from 'types/ledger';
import {HdPath} from 'types/hdpath';
import {LedgerApp as CosmosLedgerApp} from '@cosmjs/ledger-amino/build/ledgerapp';
import {LedgerSigner} from '@cosmjs/ledger-amino';
import {ExternalWallet} from 'types/wallet';
import toCosmJSHdPath from '../../utilils/hdpath';
import TerraLedgerApp from '../../utilils/terra';

const useGenerateWalletsFromLedger = () => async (transport: BluetoothTransport, ledgerApp: LedgerApp, prefix: string, hdPaths: HdPath[]) => {
  const cosmJsPaths = hdPaths.map(toCosmJSHdPath);

  let cosmosLedgerApp: CosmosLedgerApp | undefined;
  if (ledgerApp!.name === 'Terra') {
    cosmosLedgerApp = new TerraLedgerApp(transport!);
  }

  const ledgerSigner = new LedgerSigner(transport, {
    ledgerAppName: ledgerApp.name,
    minLedgerAppVersion: ledgerApp.minVersion,
    hdPaths: cosmJsPaths,
    prefix,
    ledgerApp: cosmosLedgerApp,
  });

  const accounts = await ledgerSigner.getAccounts();
  return accounts.map((account, index) => ({
    signer: ledgerSigner,
    hdPath: hdPaths[index],
    address: account.address,
  } as ExternalWallet));
};

export default useGenerateWalletsFromLedger;
