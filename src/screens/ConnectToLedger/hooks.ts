import { LedgerConnector } from '@cosmjs/ledger-amino';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import React, { useCallback, useEffect, useState } from 'react';
import { BLELedger, LedgerApp, LedgerError } from 'types/ledger';
import { err, ok, Result, ResultAsync } from 'neverthrow';
import {
  convertErrorToLedgerError,
  isNoApplicationOpenedError,
  isWrongApplicationError,
} from 'lib/LedgerUtils/errors';
import { closeApp, openApp, openLedgerTransport } from 'lib/LedgerUtils/commands';

/**
 * Enum that describe the current phase of the
 * Ledger connection.
 */
export enum LedgerConnectionPhase {
  /**
   * Unknown connection phase.
   */
  Unknown,
  /**
   * The application is opening the bluetooth transport to
   * communicate with the Ledger device.
   */
  OpeningTransport,
  /**
   * The user don't have an application opened, request to the
   * user to open the correct application.
   */
  RequestingAppOpen,
  /**
   * The user have opened a wrong application, closing it to
   * open the correct one.
   */
  RequestingAppClose,
}

/**
 * Function that returns a function that can be used in a Promise.then
 * to close a {@link BluetoothTransport} in case the returned
 * {@link Result} is an error.
 * @param transport
 */
function closeTransportOnError<R, E>(transport: BluetoothTransport) {
  return async (result: Result<R, E>) => {
    if (result.isErr()) {
      await transport.close();
    }
    return result;
  };
}

/**
 * Hook that provides a function to connect to a Ledger device.
 * @param ledger - The Ledger device to connect to.
 * @param ledgerApp - The app that the Ledger device should have opened.
 */
export function useConnectToLedger(ledger: BLELedger, ledgerApp: LedgerApp) {
  const [connecting, setConnecting] = useState(true);
  const [connectionPhase, setConnectionPhase] = React.useState(LedgerConnectionPhase.Unknown);
  const [connected, setConnected] = useState(false);
  const [transport, setTransport] = useState<BluetoothTransport | undefined>();
  const [connectionError, setConnectionError] = useState<LedgerError | undefined>();

  const performConnection = React.useCallback(
    async (ledgerToConnect: BLELedger, ledgerAppToUse: LedgerApp) => {
      setConnectionPhase(LedgerConnectionPhase.OpeningTransport);
      const openTransportResult = await openLedgerTransport(ledgerToConnect.id);

      if (openTransportResult.isErr()) {
        return err(openTransportResult.error);
      }
      const openedTransport = openTransportResult.value;
      const launchpad = new LedgerConnector(openedTransport, {
        ledgerAppName: ledgerAppToUse.name,
      });

      const appVersionResult = await ResultAsync.fromPromise(launchpad.getCosmosAppVersion(), (e) =>
        convertErrorToLedgerError(e, 'Failed to communicate with the Ledger'),
      );

      if (appVersionResult.isErr()) {
        // No application opened, request the user to open the application.
        if (isNoApplicationOpenedError(appVersionResult.error)) {
          // Request to open the expected application
          setConnectionPhase(LedgerConnectionPhase.RequestingAppOpen);
          return openApp(openedTransport, ledgerAppToUse.name).then(
            closeTransportOnError(openedTransport),
          );
        }

        // Wrong application opened, request the user to close the application
        // and open the expected one.
        if (isWrongApplicationError(appVersionResult.error)) {
          setConnectionPhase(LedgerConnectionPhase.RequestingAppClose);
          const closeAppResult = await closeApp(openedTransport).then(
            closeTransportOnError(openedTransport),
          );
          // An error occurred while closing the application, return the error.
          if (closeAppResult.isErr()) {
            return closeAppResult;
          }

          // Request to open the expected application
          setConnectionPhase(LedgerConnectionPhase.RequestingAppOpen);
          return openApp(closeAppResult.value, ledgerAppToUse.name).then(
            closeTransportOnError(openedTransport),
          );
        }

        // Unknown error, close the transport and return the error.
        openedTransport.close();
        return err(appVersionResult.error);
      }

      return ok(openedTransport);
    },
    [],
  );

  const connectToLedger = useCallback(
    async (ledgerToConnect: BLELedger, ledgerAppToUse: LedgerApp) => {
      setConnecting(true);
      setConnectionPhase(LedgerConnectionPhase.Unknown);
      setConnected(false);
      setConnectionError(undefined);
      setTransport(undefined);

      const connectResult = await performConnection(ledgerToConnect, ledgerAppToUse);

      if (connectResult.isErr()) {
        setConnectionError(connectResult.error);
      } else {
        setTransport(connectResult.value);
        setConnected(true);
      }

      setConnecting(false);
      setConnectionPhase(LedgerConnectionPhase.Unknown);
    },
    [performConnection],
  );

  const retry = useCallback(
    () => connectToLedger(ledger, ledgerApp),
    [connectToLedger, ledger, ledgerApp],
  );

  useEffect(() => {
    connectToLedger(ledger, ledgerApp);
  }, [connectToLedger, ledger, ledgerApp]);

  return {
    connecting,
    connectionPhase,
    connected,
    transport,
    connectionError,
    retry,
  };
}
