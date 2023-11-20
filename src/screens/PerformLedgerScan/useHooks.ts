import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import { useCallback, useEffect, useState } from 'react';
import { BleError } from 'react-native-ble-plx';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { BLELedger, Subscription } from 'types/ledger';
import { AppState, Linking, Platform } from 'react-native';
import { useSetAppState } from '@recoil/appState';

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
interface ScanErrorBtOff {
  readonly type: ScanErrorType.BtOff;
}

/**
 * Interface that represents a scan error caused by some an
 * unknown error.
 */
interface ScanErrorUnknown {
  readonly type: ScanErrorType.Unknown;
  readonly message: string;
}

type ScanError = ScanErrorBtOff | ScanErrorUnknown;

const iOSOpenSettingsAndCheckBtStatus = async () => {
  // Prepare the promise that will check the settings after the application
  // come back to focus.
  const promise = new Promise<boolean>((resolve) => {
    const subscription = AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        subscription.remove();
        const btState = await BluetoothStateManager.getState();
        resolve(btState === 'PoweredOn');
      }
    });
  });

  // Open the settings
  await Linking.openURL('App-Prefs:Bluetooth');
  return promise;
};

/**
 * Hook that provide a function to enable the bluetooth adapter.
 */
export function useRequestEnableBt() {
  const setAppState = useSetAppState();

  return useCallback(() => {
    if (Platform.OS === 'ios') {
      return iOSOpenSettingsAndCheckBtStatus();
    }

    // Don't block the app and show the splash screen
    // after showing the turn on bluetooth dialog
    setAppState((currentState) => ({
      ...currentState,
      noSplashScreen: true,
      noLockOnBackground: true,
    }));

    return BluetoothStateManager.requestToEnable()
      .then(() => true)
      .catch(() => false);
  }, [setAppState]);
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

  // Disable the next line warning as the NodeJS namespace will be provided by React
  // eslint-disable-next-line no-undef
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
        let btEnableResult;
        if (Platform.OS === 'ios') {
          // Don't request the bluetooth enable in iOS since
          // can be enabled only from the settings, just fail
          // and show an error that tells the user to enable
          // the bluetooth
          btEnableResult = false;
        } else {
          btEnableResult = await requestEnableBt().catch(() => false);
        }

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
