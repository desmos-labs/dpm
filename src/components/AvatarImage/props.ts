import { ImageStyle, Source } from 'react-native-fast-image';
import { StyleProp } from 'react-native';

interface AvatarImageProps {
  /**
   * Image to display for the `Avatar`.
   */
  source: Source;
  /**
   * Size of the avatar.
   */
  size?: number;
  /**
   * Callback called when the user press on the avatar image.
   */
  onPress?: () => void;
  style?: StyleProp<ImageStyle>;
}

export default AvatarImageProps;
