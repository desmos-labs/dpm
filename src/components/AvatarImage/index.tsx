import React from 'react';
import { StyleProp, TouchableWithoutFeedback } from 'react-native';
import FastImage, { ImageStyle, Source } from 'react-native-fast-image';
import useStyles from './useStyles';

export type AvatarImageProps = {
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
};

const AvatarImage: React.FC<AvatarImageProps> = (props) => {
  const { source, onPress, style } = props;
  const styles = useStyles(props);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <FastImage style={[style, styles.image]} source={source} resizeMode="cover" />
    </TouchableWithoutFeedback>
  );
};

export default AvatarImage;
