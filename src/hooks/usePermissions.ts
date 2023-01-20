import { AppPermissions, AppPermissionStatus } from 'types/permissions';
import { useCallback, useMemo } from 'react';
import { AppState, Platform } from 'react-native';
import * as Permissions from 'react-native-permissions';
import { PERMISSIONS } from 'react-native-permissions';
import {
  usePermissionsRequestCount,
  useSetPermissionsRequestCount,
} from '@recoil/permissionsRequestCount';
import { useSetAppState } from '@recoil/appState';

const isMultipleRejected = (permissions: Record<any, Permissions.PermissionStatus>): boolean =>
  Object.values(permissions).find(
    (permissionResult) => permissionResult === 'denied' || permissionResult === 'blocked',
  ) !== undefined;

/**
 * Function that opens the application settings to ask the user
 * to update the settings
 * @param permissionsCheck - Callback that checks the permissions status after
 * returning to the app from the settings screen.
 */
const openSettingsAndCheckPermissions = async (
  permissionsCheck: () => Promise<AppPermissionStatus>,
) => {
  // Prepare the promise that will check the settings after the application
  // come back to focus.
  const promise = new Promise<AppPermissionStatus>((resolve, reject) => {
    const subscription = AppState.addEventListener('change', async (state) => {
      if (state === 'active') {
        subscription.remove();
        permissionsCheck().then(resolve).catch(reject);
      }
    });
  });

  // Open the settings
  await Permissions.openSettings();
  return promise;
};

const usePermissions = (permission: AppPermissions) => {
  const requestsCount = usePermissionsRequestCount();
  const setRequestsCount = useSetPermissionsRequestCount();
  const setAppState = useSetAppState();

  const permissionsList = useMemo(() => {
    switch (permission) {
      case AppPermissions.Camera:
        return Platform.select({
          ios: [PERMISSIONS.IOS.CAMERA],
          android: [PERMISSIONS.ANDROID.CAMERA],
        })!;
      case AppPermissions.Bluetooth:
        return Platform.select({
          ios: [Permissions.PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL],
          android: [
            Permissions.PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
            Permissions.PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
            Permissions.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ],
        })!;

      default:
        throw new Error(`unsupported permission ${permission}`);
    }
  }, [permission]);

  const maxAllowedRequests = useMemo(
    () =>
      Platform.select({
        ios: 1,
        android: 2,
      })!,
    [],
  );

  const requestPermission = useCallback(async () => {
    const updatedCount = {
      ...requestsCount,
      [permission]: (requestsCount[permission] ?? 0) + 1,
    };

    if ((updatedCount[permission] ?? 0) <= maxAllowedRequests) {
      // Don't lock the app when displaying the permission popup.
      if (Platform.OS === 'ios') {
        setAppState((currentState) => ({ ...currentState, noSplashScreen: true }));
      } else {
        setAppState((currentState) => ({
          ...currentState,
          noLockOnBackground: true,
          noSplashScreen: true,
        }));
      }

      const permissionsRejected = await Permissions.requestMultiple(permissionsList).then(
        isMultipleRejected,
      );
      if (permissionsRejected) {
        setRequestsCount(updatedCount);
      }
      return permissionsRejected ? AppPermissionStatus.Denied : AppPermissionStatus.Granted;
    }

    // Already asked the user the permission to many times, open the settings.
    return openSettingsAndCheckPermissions(async () => {
      const rejected = await Permissions.requestMultiple(permissionsList).then(isMultipleRejected);
      return rejected ? AppPermissionStatus.Blocked : AppPermissionStatus.Granted;
    });
  }, [
    requestsCount,
    permission,
    maxAllowedRequests,
    setAppState,
    permissionsList,
    setRequestsCount,
  ]);

  const checkPermission = useCallback(async () => {
    const permissionsDenied = await Permissions.checkMultiple(permissionsList).then(
      isMultipleRejected,
    );
    const requestCount = requestsCount[permission] ?? 0;

    if (permissionsDenied) {
      return requestCount >= maxAllowedRequests
        ? AppPermissionStatus.Blocked
        : AppPermissionStatus.Denied;
    }
    return AppPermissionStatus.Granted;
  }, [maxAllowedRequests, permission, permissionsList, requestsCount]);

  return {
    requestPermission,
    checkPermission,
  };
};

export default usePermissions;
