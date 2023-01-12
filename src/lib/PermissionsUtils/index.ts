import { AppPermissionStatus } from 'types/permissions';
import { AppState } from 'react-native';
import * as Permissions from 'react-native-permissions';

/**
 * Function that opens the application settings to ask the user
 * to update the settings
 * @param permissionsCheck - Callback that checks the permissions status after
 * returning to the app from the settings screen.
 */
export const openSettingsAndCheckPermissions = async (
  permissionsCheck: () => Promise<AppPermissionStatus>,
) => {
  // Prepare the promise that will check the settings after the application
  // come back to focus.
  const promise = new Promise<AppPermissionStatus>((resolve, reject) => {
    const subscription = AppState.addEventListener('focus', async () => {
      subscription.remove();
      permissionsCheck().then(resolve).catch(reject);
    });
  });

  // Open the settings
  await Permissions.openSettings();
  return promise;
};
