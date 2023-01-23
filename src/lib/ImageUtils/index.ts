import { ImageRequireSource, ImageSourcePropType, ImageURISource } from 'react-native';
import { Source } from 'react-native-fast-image';

const isImageURISource = (source: ImageSourcePropType): source is ImageURISource =>
  (source as ImageURISource).uri !== undefined;

const isImageRequireSource = (source: ImageSourcePropType): source is ImageRequireSource =>
  typeof source === 'number';

/**
 * Allows to convert the given {@link ImageSourcePropType} into a {@link Source} instance so that it
 * can be used with FastImage instances.
 * @param source {ImageSourcePropType} - The source to be converted.
 */
export const getImageSource = (source: ImageSourcePropType): Source | number => {
  if (isImageRequireSource(source)) {
    return source;
  }
  if (isImageURISource(source)) {
    return { uri: source.uri };
  }
  throw new Error('Invalid source type');
};
