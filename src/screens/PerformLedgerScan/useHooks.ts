import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import { useCallback, useEffect, useState } from 'react';
import { BleError } from 'react-native-ble-plx';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { BLELedger, Subscription } from 'types/ledger';

/**
 * Enum that define the possible cause of scan failure.
 */
export enum ScanErrorType {
  BtOff,
  Unauthorized,
  Unknown,
}

/**
 * Interface that represents a scan error caused by the bluetooth
 * adapter being off.
 */
export interface ScanErrorBtOff {
  readonly type: ScanErrorType.BtOff;
}

/**
 * Interface that represents a scan error caused by some an
 * unknown error.
 */
export interface ScanErrorUnknown {
  readonly type: ScanErrorType.Unknown;
  readonly message: string;
}

export type ScanError = ScanErrorBtOff | ScanErrorUnknown;

/**
 * Hook that provide a function to enable the bluetooth adapter.
 */
export function useRequestEnableBt() {
  return useCallback(
    () =>
      BluetoothStateManager.requestToEnable()
        .then(() => true)
        .catch(() => false),
    [],
  );
}

/**
 * Hook that provide functions to:
 * - Request the bluetooth permissions
 * - Enable the bluetooth adapter
 * - Start a bluetooth scan
 */
export function useBleScan() {
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<BLELedger[]>([]);
  const [scanError, setScanError] = useState<ScanError>();
  const [subscription, setScanSubscription] = useState<Subscription | undefined>(undefined);
  const [stopScanTimeout, setStopStopScanTimeout] = useState<NodeJS.Timeout | undefined>(undefined);
  const requestEnableBt = useRequestEnableBt();

  // Clear the subscription when leaving the screen or when staring a new scan.
  useEffect(
    () => () => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
        setScanning(false);
      }
    },
    [subscription],
  );

  // Clear the scan timeout
  useEffect(
    () => () => {
      if (stopScanTimeout !== undefined) {
        clearTimeout(stopScanTimeout);
      }
    },
    [stopScanTimeout],
  );

  const stopBtScan = useCallback(() => {
    setScanSubscription(undefined);
  }, []);

  const scan = useCallback(
    async (durationMs = 10000) => {
      const btOn = (await BluetoothStateManager.getState()) === 'PoweredOn';
      if (!btOn) {
        const btEnableResult = await requestEnableBt().catch(() => false);
        if (!btEnableResult) {
          setScanError({ type: ScanErrorType.BtOff });
          return;
        }
      }

      setScanning(true);
      setScanError(undefined);
      setDevices([]);

      setScanSubscription(
        TransportBLE.listen({
          complete: () => {
            setScanning(false);
          },
          next: (e: any) => {
            if (e.type === 'add') {
              const bleLedger: BLELedger = {
                id: e.descriptor.id,
                name: e.descriptor.name,
              };
              setDevices((currValue) => {
                const deviceExists = currValue.find((d) => d.id === bleLedger.id) !== undefined;
                if (!deviceExists) {
                  return [...currValue, bleLedger];
                }
                return currValue;
              });
            }
          },
          error: (error: BleError) => {
            setScanError({
              type: ScanErrorType.Unknown,
              message: error.message,
            });
            setScanning(false);
          },
        }),
      );

      setStopStopScanTimeout(
        setTimeout(() => {
          stopBtScan();
        }, durationMs),
      );
    },
    [requestEnableBt, stopBtScan],
  );

  return {
    scan,
    scanning,
    devices,
    scanError,
  };
}
