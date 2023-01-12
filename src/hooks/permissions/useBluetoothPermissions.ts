import {
  usePermissionsRequestCount,
  useSetPermissionsRequestCount,
} from '@recoil/permissionsRequestCount';
import { useCallback } from 'react';
import * as Permissions from 'react-native-permissions';
import { Platform } from 'react-native';
import { AndroidBtScanPermissions, IosBtScanPermissions } from 'types/bluetooth';
import { AppPermissionStatus } from 'types/permissions';
import { openSettingsAndCheckPermissions } from 'lib/PermissionsUtils';

function isMultipleRejected(permissions: Record<any, Permissions.PermissionStatus>): boolean {
  return (
    Object.values(permissions).find(
      (permissionResult) => permissionResult === 'denied' || permissionResult === 'blocked',
    ) !== undefined
  );
}

/**
 * Hook that provides a function to check if the user have granted the
 * permissions to access the bluetooth.
 */
export const useCheckBluetoothPermission = () => {
  const requestsCount = usePermissionsRequestCount();

  return useCallback(async () => {
    const permissions = Platform.OS === 'android' ? AndroidBtScanPermissions : IosBtScanPermissions;
    const permissionsDenied = await Permissions.checkMultiple(permissions).then(isMultipleRejected);
    const requestCount = requestsCount.bluetooth ?? 0;

    if (permissionsDenied) {
      return requestCount >= 2 ? AppPermissionStatus.Blocked : AppPermissionStatus.Denied;
    }
    return AppPermissionStatus.Granted;
  }, [requestsCount]);
};

/**
 * Hook that provides a function to request the bluetooth permissions.
 */
export const useRequestBluetoothPermissions = () => {
  const requestsCount = usePermissionsRequestCount();
  const setRequestsCount = useSetPermissionsRequestCount();

  return useCallback(async () => {
    const updatedCount = {
      ...requestsCount,
      bluetooth: (requestsCount.bluetooth ?? 0) + 1,
    };
    const permissions = Platform.OS === 'android' ? AndroidBtScanPermissions : IosBtScanPermissions;

    if (updatedCount.bluetooth <= 2) {
      const permissionsRejected = await Permissions.requestMultiple(permissions).then(
        isMultipleRejected,
      );
      if (permissionsRejected) {
        setRequestsCount(updatedCount);
      }
      return permissionsRejected ? AppPermissionStatus.Denied : AppPermissionStatus.Granted;
    }

    // Already asked the user the permission to many times, open the settings.
    return openSettingsAndCheckPermissions(async () => {
      const rejected = await Permissions.requestMultiple(permissions).then(isMultipleRejected);
      return rejected ? AppPermissionStatus.Blocked : AppPermissionStatus.Granted;
    });
  }, [setRequestsCount, requestsCount]);
};
