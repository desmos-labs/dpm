import { LaunchpadLedger } from '@cosmjs/ledger-amino';
// eslint-disable-next-line import/no-duplicates
// eslint-disable-next-line import/no-duplicates
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import { useCallback, useEffect, useState } from 'react';
import { BleLedger, LedgerApp } from '../../types/ledger';

export default function useConnectToLedger(ledger: BleLedger, ledgerApp: LedgerApp) {
  const [connecting, setConnecting] = useState(true);
  const [connected, setConnected] = useState(false);
  const [transport, setTransport] = useState<BluetoothTransport | undefined>();
  const [connectionError, setConnectionError] = useState<string | undefined>();

  const connectToLedger = useCallback(
    async (ledgerToConnect: BleLedger, ledgerAppToUse: LedgerApp) => {
      setConnecting(true);
      setConnected(false);
      setConnectionError(undefined);
      setTransport(undefined);

      try {
        const transportToUse: BluetoothTransport = await TransportBLE.open(ledgerToConnect.id);
        const launchpad = new LaunchpadLedger(transportToUse, {
          ledgerAppName: ledgerAppToUse.name,
        });
        await launchpad.getCosmosAppVersion().catch(async (ex) => {
          await transportToUse.close();
          throw ex;
        });
        setTransport(transportToUse);
        setConnected(true);
      } catch (e) {
        setConnectionError(e.toString());
      }

      setConnecting(false);
    },
    []
  );

  const retry = useCallback(() => {
    connectToLedger(ledger, ledgerApp);
  }, [connectToLedger, ledger, ledgerApp]);

  useEffect(() => {
    connectToLedger(ledger, ledgerApp);
  }, [connectToLedger, ledger, ledgerApp]);

  return {
    connecting,
    connected,
    transport,
    connectionError,
    retry,
  };
}
