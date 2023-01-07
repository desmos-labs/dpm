import { useCallback } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { ImagePickerResponse } from 'react-native-image-picker/src/types';

export const usePickPicture = () =>
  useCallback((callback: (value: string | undefined) => void) => {
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
  }, []);

export default usePickPicture;
