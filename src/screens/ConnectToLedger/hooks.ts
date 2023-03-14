import { LedgerConnector } from '@cosmjs/ledger-amino';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import React, { useCallback, useEffect, useState } from 'react';
import { BLELedger, LedgerApp, LedgerErrorType } from 'types/ledger';
import { err, ok, ResultAsync } from 'neverthrow';
import {
  convertErrorToLedgerError,
  isNoApplicationOpenedError,
  isWrongApplicationError,
} from 'lib/LedgerUtils/errors';
import { closeApp, openApp, openLedgerTransport } from 'lib/LedgerUtils/commands';
import { useTranslation } from 'react-i18next';

/**
 * Hook that provides a function to connect to a Ledger device.
 * @param ledger - The Ledger device to connect to.
 * @param ledgerApp - The app that the Ledger device should have opened.
 */
export function useConnectToLedger(ledger: BLELedger, ledgerApp: LedgerApp) {
  const { t } = useTranslation('connectToLedger');
  const [connecting, setConnecting] = useState(true);
  const [connected, setConnected] = useState(false);
  const [transport, setTransport] = useState<BluetoothTransport | undefined>();
  const [connectionError, setConnectionError] = useState<string | undefined>();

  const performConnection = React.useCallback(
    async (ledgerToConnect: BLELedger, ledgerAppToUse: LedgerApp) => {
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
          const expectedApp = appVersionResult.error.expectedAppName;
          return openApp(openedTransport, expectedApp);
        }

        // Wrong application opened, request the user to close the application
        // and open the expected one.
        if (isWrongApplicationError(appVersionResult.error)) {
          const closeAppResult = await closeApp(openedTransport);
          // An error occurred while closing the application, return the error.
          if (closeAppResult.isErr()) {
            return closeAppResult;
          }

          // Request to open the expected application
          return openApp(closeAppResult.value, appVersionResult.error.expectedAppName);
        }

        // Unknown error, return the error.
        return err(appVersionResult.error);
      }

      return ok(openedTransport);
    },
    [],
  );

  const connectToLedger = useCallback(
    async (ledgerToConnect: BLELedger, ledgerAppToUse: LedgerApp) => {
      setConnecting(true);
      setConnected(false);
      setConnectionError(undefined);
      setTransport(undefined);

      const connectResult = await performConnection(ledgerToConnect, ledgerAppToUse);

      if (connectResult.isErr()) {
        switch (connectResult.error.name) {
          case LedgerErrorType.ConnectionFailed:
            setConnectionError(t('connection failed'));
            break;
          case LedgerErrorType.DeviceDisconnected:
            setConnectionError(t('device disconnected'));
            break;
          case LedgerErrorType.ApplicationOpenRejected:
            setConnectionError(
              t('please open the application', { application: ledgerAppToUse.name }),
            );
            break;
          default:
            setConnectionError(connectResult.error.message);
            break;
        }
      } else {
        setTransport(connectResult.value);
        setConnected(true);
      }
      setConnecting(false);
    },
    [performConnection, t],
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
    connected,
    transport,
    connectionError,
    retry,
  };
}
