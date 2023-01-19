import * as Permissions from 'react-native-permissions';

/**
 * List of permissions that Android requires
 * to perform a bluetooth scan.
 */
export const AndroidBtScanPermissions = [
  Permissions.PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  Permissions.PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  Permissions.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
];

/**
 * Type that represents a permission required to perform a bt scan
 * on Android.
 */
export type AndroidBtScanPermission = typeof AndroidBtScanPermissions[number];

/**
 * List of permissions that Ios requires
 * to perform a bluetooth scan.
 */
export const IosBtScanPermissions = [Permissions.PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL];

/**
 * Type that represents a permission required to perform a bt scan
 * on Ios.
 */
export type IosBtScanPermission = typeof IosBtScanPermissions[number];

/**
 * Type that represents a permission required to perform a bt scan.
 */
export type BtScanPermission = AndroidBtScanPermission | IosBtScanPermission;
