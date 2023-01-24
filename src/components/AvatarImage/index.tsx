import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import useStyles from './useStyles';
import AvatarImageProps from './props';

const AvatarImage: React.FC<AvatarImageProps> = (props) => {
  const { source, onPress, style, loading } = props;
  const styles = useStyles(props);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <FastImage style={[style, styles.image]} source={source} resizeMode="cover" />
        {loading === true && <StyledActivityIndicator style={styles.indicator} />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AvatarImage;
