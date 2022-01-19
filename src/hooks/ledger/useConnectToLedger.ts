import {BleLedger, LedgerApp} from "../../types/ledger";
import {useCallback, useEffect, useState} from "react";
import TransportBLE from "@ledgerhq/react-native-hw-transport-ble";
import BluetoothTransport from "@ledgerhq/react-native-hw-transport-ble";
import {LaunchpadLedger} from "@cosmjs/ledger-amino";

export default function useConnectToLedger(ledger: BleLedger, ledgerApp: LedgerApp) {

    const [connecting, setConnecting] = useState(true);
    const [connected, setConnected] = useState(false);
    const [transport, setTransport] = useState<BluetoothTransport | undefined>();
    const [connectionError, setConnectionError] = useState<string | undefined>();

    const connectToLedger = useCallback(async (ledger: BleLedger, ledgerApp: LedgerApp) => {
        setConnecting(true);
        setConnected(false);
        setConnectionError(undefined);
        setTransport(undefined);

        try {
            const transport: BluetoothTransport = await TransportBLE.open(ledger.id);
            const launchpad = new LaunchpadLedger(transport, {
                ledgerAppName: ledgerApp.name,
            });
            await launchpad.getCosmosAppVersion().catch(async ex => {
                await transport.close();
                throw ex;
            });
            setTransport(transport);
            setConnected(true);
        } catch (e) {
            setConnectionError(e.toString());
        }

        setConnecting(false);
    }, [])

    const retry = useCallback(() => {
        connectToLedger(ledger, ledgerApp);
    }, [connectToLedger, ledger, ledgerApp])

    useEffect(() => {
        connectToLedger(ledger, ledgerApp);
    }, [connectToLedger, ledger, ledgerApp]);

    return {
        connecting,
        connected,
        transport,
        connectionError,
        retry,
    }

}