import React from 'react';
import { StyleProp, TouchableWithoutFeedback } from 'react-native';
import FastImage, { ImageStyle, Source } from 'react-native-fast-image';
import { makeStyleWithProps } from '../theming';

export type Props = {
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

export const AvatarImage: React.FC<Props> = (props) => {
  const { source, size, onPress, style } = props;
  const styles = useStyles(props);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <FastImage style={[style, styles.image]} source={source} resizeMode="cover" />
    </TouchableWithoutFeedback>
  );
};

const useStyles = makeStyleWithProps((props: Props, theme) => ({
  image: {
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    borderRadius: 100,
    height: props.size ?? 24,
    width: props.size ?? 24,
  },
}));
