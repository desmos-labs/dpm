/**
 * Enum that represents a permission status
 */
export enum AppPermissionStatus {
  /**
   * Permission granted.
   */
  Granted,
  /**
   * The permission have been denied from the user.
   */
  Denied,
  /**
   * The permission have been asked to the user several times
   * and now the os don't allow to request the permission from
   * inside the app.
   */
  Blocked,
}

/**
 * Enum that represents the permissions that can be asked to the
 * user.
 */
export enum AppPermissions {
  Camera = 'camera',
  Bluetooth = 'bluetooth',
  Notifications = 'notifications',
}

/**
 * Type representing the number of time each permission
 * has been asked to the user, if undefined means 0.
 */
export type PermissionsRequestsCount = Record<AppPermissions, number | undefined>;
