import React from 'react';
import { TouchableWithoutFeedback } from 'react-native';
import FastImage from 'react-native-fast-image';
import useStyles from './useStyles';
import AvatarImageProps from './props';

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
