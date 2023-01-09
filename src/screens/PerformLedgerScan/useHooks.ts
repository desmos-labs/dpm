import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { BleError } from 'react-native-ble-plx';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import { BLELedger, Subscription } from 'types/ledger';
import * as Permissions from 'react-native-permissions';
import { AndroidBtScanPermissions, BtScanPermission, IosBtScanPermissions } from 'types/bluetooth';

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
 * Interface that represents a scan error caused by some missing
 * authorizations.
 */
export interface ScanErrorUnauthorized {
  readonly type: ScanErrorType.Unauthorized;
  /**
   * Map that contains the permissions check result.
   * The key of Record is the permission id and the value is it's current status.
   */
  readonly checkResult: Record<BtScanPermission, Permissions.PermissionStatus>;
  /**
   * List of the permissions that are required and currently not allowed.
   */
  readonly missingPermissions: BtScanPermission[];
  /**
   * Tells if to grant the permissions the user should go into the
   * application settings screen.
   */
  readonly requiresSettingsOpen: boolean;
}

/**
 * Interface that represents a scan error caused by some an
 * unknown error.
 */
export interface ScanErrorUnknown {
  readonly type: ScanErrorType.Unknown;
  readonly message: string;
}

export type ScanError = ScanErrorBtOff | ScanErrorUnauthorized | ScanErrorUnknown;

/**
 * Hook that provide a function to enable the bluetooth adapter.
 */
function useRequestEnableBt() {
  return useCallback(
    () =>
      BluetoothStateManager.requestToEnable()
        .then(() => true)
        .catch(() => false),
    [],
  );
}

/**
 * Hook that provide a function to check the current missing bluetooth
 * permissions.
 */
function useCheckBtPermissions() {
  return useCallback(async () => {
    const permissions = Platform.OS === 'android' ? AndroidBtScanPermissions : IosBtScanPermissions;
    const checkResult = await Permissions.checkMultiple(permissions);

    // Check if the user have blocked some permissions, in this case
    // the user need to open the app settings to change the permissions
    const requiresSettingsOpen =
      Object.values(checkResult).find((v) => v === 'blocked') !== undefined;

    // Check the missing permissions list.
    const missingPermissions = <BtScanPermission[]>Object.keys(checkResult).filter(
      (permissionKey) =>
        // @ts-ignore
        checkResult[permissionKey] === 'denied' || checkResult[permissionKey] === 'blocked',
    );

    return {
      checkResult,
      requiresSettingsOpen,
      missingPermissions,
    };
  }, []);
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
  const [scanError, setScanError] = useState<ScanError | undefined>(undefined);
  const [subscription, setScanSubscription] = useState<Subscription | undefined>(undefined);
  const [stopScanTimeout, setStopStopScanTimeout] = useState<NodeJS.Timeout | undefined>(undefined);
  const checkBtPermissions = useCheckBtPermissions();
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

  const requestPermissions = useCallback(async () => {
    if (scanError?.type === ScanErrorType.Unauthorized) {
      await Permissions.requestMultiple(scanError.missingPermissions);
      const { checkResult, requiresSettingsOpen, missingPermissions } = await checkBtPermissions();
      if (missingPermissions.length === 0) {
        setScanError(undefined);
      } else {
        setScanError({
          type: ScanErrorType.Unauthorized,
          missingPermissions,
          checkResult,
          requiresSettingsOpen,
        });
      }
    }
  }, [checkBtPermissions, scanError]);

  const scan = useCallback(
    async (durationMs = 10000) => {
      const btOn = (await BluetoothStateManager.getState()) === 'PoweredOn';
      const { requiresSettingsOpen, checkResult, missingPermissions } = await checkBtPermissions();

      if (missingPermissions.length !== 0) {
        setScanError({
          type: ScanErrorType.Unauthorized,
          checkResult,
          missingPermissions,
          requiresSettingsOpen,
        });
        return;
      }

      if (!btOn) {
        const btEnableResult = await requestEnableBt();
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
    [checkBtPermissions, requestEnableBt, stopBtScan],
  );

  return {
    requestPermissions,
    requestEnableBt,
    scan,
    scanning,
    devices,
    scanError,
  };
}
