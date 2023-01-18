import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export const readAsset = async (asset: string) =>
  Platform.OS === 'android'
    ? RNFS.readFileAssets(asset).catch()
    : RNFS.readFile(`${RNFS.MainBundlePath}${asset}`).catch();
