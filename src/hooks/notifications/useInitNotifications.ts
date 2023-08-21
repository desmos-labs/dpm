import { useSetSetting, useSetting } from '@recoil/settings';
import usePermissions from 'hooks/permissions/usePermissions';
import { AppPermissions, AppPermissionStatus } from 'types/permissions';
import { usePermissionRequestCount } from '@recoil/permissionsRequestCount';
import React from 'react';
import messaging from '@react-native-firebase/messaging';
import { AppState } from 'react-native';
import notificationsHandler from 'hooks/notifications/notificationsHandler';

/**
 * Hook that initialize the notifications reception logic.
 */
const useInitNotifications = () => {
  const notificationsEnabled = useSetting('notifications');
  const setNotificationsEnabled = useSetSetting('notifications');
  const { requestPermission, checkPermission } = usePermissions(AppPermissions.Notifications);
  const permissionRequestCount = usePermissionRequestCount(AppPermissions.Notifications);

  React.useEffect(() => {
    // If we didn't have request the permission to post a notification
    // and the notifications are disabled, request the permission.
    if (permissionRequestCount === 0 && !notificationsEnabled) {
      (async () => {
        const result = await requestPermission();
        if (result === AppPermissionStatus.Granted) {
          // We have notifications post permission.
          setNotificationsEnabled(true);
        }
      })();
      return undefined;
    }

    // If the notifications are enabled, subscribe to the firebase reception logic.
    if (notificationsEnabled) {
      // In dev mode print the google messaging token.
      if (__DEV__) {
        messaging()
          .getToken()
          .then((token) => console.log('messaging token', token));
      }
      // The notifications are enabled, init the firebase notifications logic.
      return messaging().onMessage(notificationsHandler);
    }

    return undefined;
  }, [notificationsEnabled, permissionRequestCount, requestPermission, setNotificationsEnabled]);

  // Effect to disable the notifications if the user removes the notifications
  // permissions from outside the application.
  React.useEffect(() => {
    const subscription = AppState.addEventListener('change', async (state) => {
      if (state === 'active' && notificationsEnabled) {
        checkPermission().then((status) => {
          if (status !== AppPermissionStatus.Granted) {
            setNotificationsEnabled(false);
          }
        });
      }
    });
    return () => subscription.remove();
  }, [checkPermission, notificationsEnabled, setNotificationsEnabled]);
};

export default useInitNotifications;
