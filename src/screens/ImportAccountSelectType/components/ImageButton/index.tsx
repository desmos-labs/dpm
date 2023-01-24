import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import React from 'react';
import Typography from 'components/Typography';
import DpmImage, { DPMImageProps } from 'components/DPMImage';
import useStyles from './useStyles';

type ImageButtonProps = {
  image: DPMImageProps['source'];
  imageStyle?: DPMImageProps['style'];
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const ImageButton: React.FC<ImageButtonProps> = ({
  image,
  imageStyle,
  label,
  onPress,
  disabled,
  style,
}) => {
  const styles = useStyles();

  return (
    <TouchableOpacity style={[styles.root, style]} onPress={onPress} disabled={disabled}>
      <DpmImage source={image} style={imageStyle} resizeMode={'contain'} />
      <Typography.Body1>{label}</Typography.Body1>
    </TouchableOpacity>
  );
};

export default ImageButton;
