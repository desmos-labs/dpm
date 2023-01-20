import { useCallback } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { ImagePickerResponse } from 'react-native-image-picker/src/types';
import { useSetAppState } from '@recoil/appState';
import { Platform } from 'react-native';

export const usePickPicture = () => {
  const setAppState = useSetAppState();

  return useCallback(
    (callback: (value: string | undefined) => void) => {
      if (Platform.OS === 'android') {
        setAppState((currentState) => ({
          ...currentState,
          noSplashScreen: true,
        }));
      }
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
