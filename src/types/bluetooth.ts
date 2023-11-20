import * as Permissions from 'react-native-permissions';

/**
 * List of permissions that Android requires
 * to perform a bluetooth scan.
 */
const AndroidBtScanPermissions = [
  Permissions.PERMISSIONS.ANDROID.BLUETOOTH_SCAN,
  Permissions.PERMISSIONS.ANDROID.BLUETOOTH_CONNECT,
  Permissions.PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
];

/**
 * Type that represents a permission required to perform a bt scan
 * on Android.
 */
type AndroidBtScanPermission = (typeof AndroidBtScanPermissions)[number];

/**
 * List of permissions that Ios requires
 * to perform a bluetooth scan.
 */
const IosBtScanPermissions = [Permissions.PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL];

/**
 * Type that represents a permission required to perform a bt scan
 * on Ios.
 */
type IosBtScanPermission = (typeof IosBtScanPermissions)[number];

/**
 * Type that represents a permission required to perform a bt scan.
 */
// ts-prune-ignore-next
export type BtScanPermission = AndroidBtScanPermission | IosBtScanPermission;
