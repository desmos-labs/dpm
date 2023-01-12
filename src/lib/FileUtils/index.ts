import { Platform } from 'react-native';
import RNFS from 'react-native-fs';

export const readAsset = async (asset: string) =>
  Platform.OS === 'android'
    ? RNFS.readFileAssets(asset).catch((e) => console.error(e))
    : RNFS.readFile(`${RNFS.MainBundlePath}${asset}`).catch((e) => console.error(e));
