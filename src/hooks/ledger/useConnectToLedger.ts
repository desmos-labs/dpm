import { LedgerConnector } from '@cosmjs/ledger-amino';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { useCallback, useEffect, useState } from 'react';
import { BLELedger, LedgerApp } from 'types/ledger';

export default function useConnectToLedger(ledger: BLELedger, ledgerApp: LedgerApp) {
  const [connecting, setConnecting] = useState(true);
  const [connected, setConnected] = useState(false);
  const [transport, setTransport] = useState<BluetoothTransport | undefined>();
  const [connectionError, setConnectionError] = useState<string | undefined>();

  const connectToLedger = useCallback(
    async (ledgerToConnect: BLELedger, ledgerAppToUse: LedgerApp) => {
      setConnecting(true);
      setConnected(false);
      setConnectionError(undefined);
      setTransport(undefined);

      try {
        const transportToUse: BluetoothTransport = await BluetoothTransport.open(
          ledgerToConnect.id,
        );
        const launchpad = new LedgerConnector(transportToUse, {
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
    [],
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
