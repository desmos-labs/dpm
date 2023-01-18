import { useCallback } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { ImagePickerResponse } from 'react-native-image-picker/src/types';
import { useSetAppState } from '@recoil/appState';

export const usePickPicture = () => {
  const setAppState = useSetAppState();

  return useCallback(
    (callback: (value: string | undefined) => void) => {
      // Don't block the app when returning after picking the
      // image
      setAppState((currentState) => ({
        ...currentState,
        noLockOnBackground: true,
      }));

      launchImageLibrary(
        {
          quality: 1,
          mediaType: 'photo',
          selectionLimit: 1,
          includeBase64: false,
        },
        (response: ImagePickerResponse) => {
          const assets = response.assets ?? [];
          if (assets.length > 0) {
            callback(assets[0].uri);
          }
        },
      );
    },
    [setAppState],
  );
};

export default usePickPicture;
