import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Linking, Platform } from 'react-native';
import { BleError, BleErrorCode } from 'react-native-ble-plx';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { BleLedger, Subscription } from '../../types/ledger';

export enum ScanErrorCause {
  PoweredOff,
  Unauthorized,
  Unknown,
}

export type ScanError = {
  cause: ScanErrorCause;
  message: string;
};

export default function useStartBleScan() {
  const { t } = useTranslation();
  const [subscription, setScanSubscription] = useState<Subscription | undefined>(undefined);
  const [stopScanTimeout, setStopStopScanTimeout] = useState<NodeJS.Timeout | undefined>(undefined);
  const [scanning, setScanning] = useState(false);
  const [devices, setDevices] = useState<BleLedger[]>([]);
  const [scanError, setScanError] = useState<ScanError | undefined>(undefined);

  // Clear the subscription when leaving the screen or when staring a new scan.
  useEffect(
    () => () => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    },
    [subscription]
  );

  // Clear the scan timeout
  useEffect(
    () => () => {
      if (stopScanTimeout !== undefined) {
        clearTimeout(stopScanTimeout);
      }
    },
    [stopScanTimeout]
  );

  const stopScan = useCallback(() => {
    setScanning(false);
    setScanSubscription(undefined);
  }, []);

  const scan = useCallback(
    async (durationMs = 10000) => {
      if (scanError?.cause === ScanErrorCause.PoweredOff) {
        if (Platform.OS === 'ios') {
          await Linking.openURL('App-Prefs:Bluetooth');
        } else {
          await BluetoothStateManager.openSettings();
        }
        setScanError(undefined);
      } else if (scanError?.cause === ScanErrorCause.Unauthorized) {
        if (Platform.OS === 'ios') {
          await Linking.openURL('app-settings:');
        } else {
          await Linking.openSettings();
        }
        setScanError(undefined);
      } else {
        setScanning(true);
        setDevices([]);
        setScanError(undefined);

        const state = await BluetoothStateManager.getState();

        if (state === 'PoweredOn') {
          setScanSubscription(
            TransportBLE.listen({
              complete: () => {
                setScanning(false);
              },
              next: (e: any) => {
                if (e.type === 'add') {
                  const { id, name } = e.descriptor;

                  setDevices((currentDevices) => {
                    const devicePresent = currentDevices.find((d) => d.id === id) !== undefined;
                    if (!devicePresent) {
                      return [
                        ...currentDevices,
                        {
                          id,
                          name,
                        },
                      ];
                    }
                    return currentDevices;
                  });
                }
              },
              error: (error: BleError) => {
                console.error('BLE scan error', error, error.errorCode, error.reason, error.name);
                const errorMessage = error.toString();
                if (
                  errorMessage.indexOf('not authorized') > 0 ||
                  error.errorCode === BleErrorCode.BluetoothUnauthorized ||
                  error.errorCode === BleErrorCode.ScanStartFailed
                ) {
                  let message: string;
                  if (Platform.OS === 'android') {
                    if (error.errorCode === BleErrorCode.ScanStartFailed) {
                      message = t('ble scan request nearby devices permission');
                    } else {
                      message = t('ble scan request location permission');
                    }
                  } else {
                    message = t('bluetooth access request');
                  }
                  setScanError({
                    cause: ScanErrorCause.Unauthorized,
                    message,
                  });
                } else {
                  setScanError({
                    cause: ScanErrorCause.Unknown,
                    message: errorMessage,
                  });
                }
                setScanning(false);
              },
            })
          );
          setStopStopScanTimeout(
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setTimeout(() => {
              stopScan();
            }, durationMs)
          );
        } else if (state === 'PoweredOff') {
          setScanError({
            cause: ScanErrorCause.PoweredOff,
            message: t('turn on bluetooth'),
          });
          setScanning(false);
        } else if (state === 'Unauthorized') {
          let message: string;
          if (Platform.OS === 'android') {
            message = t('ble scan request');
          } else {
            message = t('bluetooth access request');
          }
          setScanError({
            cause: ScanErrorCause.Unauthorized,
            message,
          });
          setScanning(false);
        } else {
          setScanError({
            cause: ScanErrorCause.Unknown,
            message: `Unknown bluetooth state ${state}`,
          });
          setScanning(false);
        }
      }
    },
    [stopScan, t, scanError]
  );

  return {
    scan,
    scanning,
    devices,
    scanError,
  };
}
