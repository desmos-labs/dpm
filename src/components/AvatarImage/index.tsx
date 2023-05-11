import React from 'react';
import { StyleProp, TouchableWithoutFeedback, View } from 'react-native';
import FastImage, { ImageStyle, Source } from 'react-native-fast-image';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import { defaultProfilePicture } from 'assets/images';
import useStyles from './useStyles';

export interface AvatarImageProps {
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
  /**
   * True if we should display a loading indicator over the image.
   */
  loading?: boolean;
  /**
   * Callback called if an error occurred while fetching the
   * avatar image.
   */
  onError?: () => void;
  style?: StyleProp<ImageStyle>;
}

const AvatarImage: React.FC<AvatarImageProps> = (props) => {
  const { source, onPress, style, loading, onError } = props;
  const styles = useStyles(props);

  const [fetching, setFetchingImage] = React.useState(false);
  const [picture, setPicture] = React.useState(source);
  React.useEffect(() => {
    setPicture(source);
  }, [source]);

  const onLoadError = React.useCallback(() => {
    if (onError) {
      onError();
    }
    setFetchingImage(false);
    setPicture(defaultProfilePicture);
  }, [onError]);

  const onLoadStart = React.useCallback(() => {
    setFetchingImage(true);
  }, []);

  const onLoadEnd = React.useCallback(() => {
    setFetchingImage(false);
  }, []);

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        <FastImage
          style={[style, styles.image]}
          source={picture}
          resizeMode="cover"
          onError={onLoadError}
          onLoadStart={onLoadStart}
          onLoadEnd={onLoadEnd}
        />
        {(loading || fetching) && <StyledActivityIndicator style={styles.indicator} />}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AvatarImage;
