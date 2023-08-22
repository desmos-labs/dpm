import { AppPermissions, AppPermissionStatus } from 'types/permissions';
import { useCallback, useMemo } from 'react';
import { AppState, Platform } from 'react-native';
import * as Permissions from 'react-native-permissions';
import { Permission, PERMISSIONS } from 'react-native-permissions';
import {
  usePermissionsRequestCount,
  useSetPermissionsRequestCount,
} from '@recoil/permissionsRequestCount';
import { useSetAppState } from '@recoil/appState';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import AuthorizationStatus = FirebaseMessagingTypes.AuthorizationStatus;

/**
 * Type that represents an object that provides the functions
 * to check and request a specific permission.
 */
type PermissionsFunctions = {
  /**
   * Functions that checks if a permission has been granted or not.
   */
  check: () => Promise<boolean>;
  /**
   * Functions that prompt to the user the permission request and returns if the
   * permission has been granted.
   */
  request: () => Promise<boolean>;
};

/**
 * Utility function that checks whether the object returned from a
 * {@link Permissions.checkMultiple} or {@link Permissions.requestMultiple}
 * represents a granted permission or a denied permission.
 * @param permissions - The object to be checked.
 */
const isMultipleGranted = (permissions: Record<any, Permissions.PermissionStatus>): boolean =>
  Object.values(permissions).find(
    (permissionResult) => permissionResult === 'denied' || permissionResult === 'blocked',
  ) === undefined;

/**
 * Utility function that creates a {@link PermissionsFunctions} object for
 * checking and requesting the provided permissions.
 * @param permissions - List of permissions to be checked and requested.
 */
const permissionsFunctionsFromPermissionsList = (
  permissions: Permission[],
): PermissionsFunctions => {
  const check = async () => Permissions.checkMultiple(permissions).then(isMultipleGranted);
  const request = async () => Permissions.requestMultiple(permissions).then(isMultipleGranted);

  return { check, request };
};

/**
 * Utility function that creates a {@link PermissionsFunctions} object for
 * checking and requesting permissions to post notifications.
 */
const notificationsPermissionsFunctions = (): PermissionsFunctions => {
  const check = async () => {
    const result = await messaging().hasPermission();
    return result === AuthorizationStatus.AUTHORIZED || result === AuthorizationStatus.EPHEMERAL;
  };
  const request = async () => {
    const result = await messaging().requestPermission({
      alert: true,
      badge: true,
      sound: true,
      carPlay: true,
    });
    return result === AuthorizationStatus.AUTHORIZED || result === AuthorizationStatus.EPHEMERAL;
  };

  return {
    check,
    request,
  };
};

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

  const { check, request } = useMemo(() => {
    switch (permission) {
      case AppPermissions.Camera:
        return permissionsFunctionsFromPermissionsList(
          Platform.select({
            ios: [PERMISSIONS.IOS.CAMERA],
            android: [PERMISSIONS.ANDROID.CAMERA],
          })!,
        );
      case AppPermissions.Bluetooth:
        return permissionsFunctionsFromPermissionsList(
          Platform.select({
            ios: [Permissions.PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL],
            android: [
              Permissions.PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
              Permissions.PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
              Permissions.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ],
          })!,
        );
      case AppPermissions.Notifications:
        return notificationsPermissionsFunctions();

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

      const permissionsApproved = await request();
      if (!permissionsApproved) {
        setRequestsCount(updatedCount);
      }
      return permissionsApproved ? AppPermissionStatus.Granted : AppPermissionStatus.Denied;
    }

    // Already asked the user the permission to many times, open the settings.
    return openSettingsAndCheckPermissions(async () => {
      const approved = await request();
      return approved ? AppPermissionStatus.Granted : AppPermissionStatus.Blocked;
    });
  }, [requestsCount, permission, maxAllowedRequests, setAppState, request, setRequestsCount]);

  const checkPermission = useCallback(async () => {
    const permissionsApproved = await check();
    const requestCount = requestsCount[permission] ?? 0;

    if (!permissionsApproved) {
      return requestCount >= maxAllowedRequests
        ? AppPermissionStatus.Blocked
        : AppPermissionStatus.Denied;
    }
    return AppPermissionStatus.Granted;
  }, [maxAllowedRequests, permission, check, requestsCount]);

  return {
    requestPermission,
    checkPermission,
  };
};

export default usePermissions;
