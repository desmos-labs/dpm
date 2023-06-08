import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { err, Result, ResultAsync } from 'neverthrow';
import { convertErrorToLedgerError, isUnknownLedgerError } from 'lib/LedgerUtils/errors';
import { ApplicationOpenRejectedError, LedgerError } from 'types/ledger';
import { delay } from 'lib/PromiseUtils';

/**
 * Establish a connection to a Ledger device.
 * @param id - Device mac address.
 */
export async function openLedgerTransport(
  id: string,
): Promise<Result<BluetoothTransport, LedgerError>> {
  return ResultAsync.fromPromise(BluetoothTransport.open(id), (e) =>
    convertErrorToLedgerError(e, 'Failed to open Bluetooth transport'),
  );
}

/**
 * Request to open an application.
 * NOTE: after executing this command the provided transport will be closed,
 * to keep sending commands to the device use the returned Transport object.
 * @param transport - Ledger transport.
 * @param appName - Name of the application to open.
 */
export async function openApp(
  transport: BluetoothTransport,
  appName: string,
): Promise<Result<BluetoothTransport, LedgerError>> {
  // Request to open the expected application
  const openAppResult = await ResultAsync.fromPromise(
    transport.send(0xe0, 0xd8, 0x00, 0x00, Buffer.from(appName, 'ascii')),
    (e) => convertErrorToLedgerError(e, 'Failed to open application'),
  );

  if (openAppResult.isOk()) {
    // After the application is opened the ledger close the bluetooth transport.
    // give some time to the device to be ready again.
    await delay(6000);
    return openLedgerTransport(transport.id);
  }

  if (isUnknownLedgerError(openAppResult.error)) {
    // Application open rejected from the user.
    return err(new ApplicationOpenRejectedError());
  }

  return err(openAppResult.error);
}

/**
 * Close the current opened application.
 * @param transport - Ledger transport.
 * NOTE: after executing this command the provided transport will be closed,
 * to keep sending commands to the device use the returned Transport object.
 */
export async function closeApp(transport: BluetoothTransport) {
  // Request to open the expected application
  const closeAppResult = await ResultAsync.fromPromise(
    transport.send(0xb0, 0xa7, 0x00, 0x00),
    (e) => convertErrorToLedgerError(e, 'Failed to close the application'),
  );

  if (closeAppResult.isOk()) {
    // After the application is closed the ledger close the bluetooth transport.
    // give some time to the device to be ready again.
    await delay(6000);
    return openLedgerTransport(transport.id);
  }
  // Application could not be opened.
  return err(closeAppResult.error);
}
