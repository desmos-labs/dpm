import {
  usePermissionsRequestCount,
  useSetPermissionsRequestCount,
} from '@recoil/permissionsRequestCount';
import { useCallback } from 'react';
import { Camera } from 'react-native-vision-camera';
import { AppPermissionStatus } from 'types/permissions';
import { openSettingsAndCheckPermissions } from 'lib/PermissionsUtils';
import { Platform } from 'react-native';

// How many times we can ask the camera permissions before the system
// automatically tells us that the user have rejected the permission request.
const MAX_ALLOWED_CAMERA_REQUESTS = Platform.select({
  ios: 1,
  android: 2,
})!;

export const useCheckCameraPermission = () => {
  const requestsCount = usePermissionsRequestCount();

  return useCallback(async () => {
    const result = await Camera.getCameraPermissionStatus();
    const authorized = result === 'authorized';
    const cameraRequestCount = requestsCount.camera ?? 0;
    if (!authorized) {
      return cameraRequestCount >= MAX_ALLOWED_CAMERA_REQUESTS
        ? AppPermissionStatus.Blocked
        : AppPermissionStatus.Denied;
    }
    return AppPermissionStatus.Granted;
  }, [requestsCount]);
};

export const useRequestCameraPermission = () => {
  const requestsCount = usePermissionsRequestCount();
  const setRequestsCount = useSetPermissionsRequestCount();

  return useCallback(async () => {
    const updatedCount = {
      ...requestsCount,
      camera: (requestsCount.camera ?? 0) + 1,
    };

    if (updatedCount.camera <= MAX_ALLOWED_CAMERA_REQUESTS) {
      const result = await Camera.requestCameraPermission();
      if (result === 'denied') {
        setRequestsCount(updatedCount);
        return AppPermissionStatus.Denied;
      }
      return AppPermissionStatus.Granted;
    }

    // Already asked the user the permission to many times, open the app settings.
    return openSettingsAndCheckPermissions(async () => {
      const granted = (await Camera.getCameraPermissionStatus()) === 'authorized';
      return granted ? AppPermissionStatus.Granted : AppPermissionStatus.Blocked;
    });
  }, [setRequestsCount, requestsCount]);
};
