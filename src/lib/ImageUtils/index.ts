import { ImageRequireSource, ImageSourcePropType, ImageURISource } from 'react-native';
import { Source } from 'react-native-fast-image';

function isImageURISource(source: ImageSourcePropType): source is ImageURISource {
  return (source as ImageURISource).uri !== undefined;
}

function isImageRequireSource(source: ImageSourcePropType): source is ImageRequireSource {
  return typeof source === 'number';
}

export const getImageSource = (source: ImageSourcePropType): Source | number => {
  if (isImageRequireSource(source)) {
    return source;
  }
  if (isImageURISource(source)) {
    return { uri: source.uri };
  }
  throw new Error('Invalid source type');
};
