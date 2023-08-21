import { useSetSetting, useSetting } from '@recoil/settings';
import usePermissions from 'hooks/permissions/usePermissions';
import { AppPermissions, AppPermissionStatus } from 'types/permissions';
import React from 'react';

/**
 * Hooks that provides a function to enable or disable the reception of
 * notifications and if the notification reception is enabled.
 */
const useToggleNotifications = () => {
  const notificationsEnabled = useSetting('notifications');
  const setNotificationsEnabled = useSetSetting('notifications');
  const { checkPermission, requestPermission } = usePermissions(AppPermissions.Notifications);

  const toggleNotifications = React.useCallback(async () => {
    if (!notificationsEnabled) {
      let permissionStatus = await checkPermission();
      if (permissionStatus !== AppPermissionStatus.Granted) {
        permissionStatus = await requestPermission();
      }

      if (permissionStatus === AppPermissionStatus.Granted) {
        setNotificationsEnabled(true);
      }
    } else {
      setNotificationsEnabled(false);
    }
  }, [checkPermission, notificationsEnabled, requestPermission, setNotificationsEnabled]);

  return { notificationsEnabled, toggleNotifications };
};

export default useToggleNotifications;
