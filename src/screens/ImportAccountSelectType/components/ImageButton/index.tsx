import {ImageSourcePropType, StyleProp, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import Typography from 'components/Typography';
import { DPMImages } from 'types/images';
import DpmImage from 'components/DPMImage';
import useStyles from './useStyles';

type ImageButtonProps = {
  image: ImageSourcePropType | DPMImages;
  label: string;
  onPress?: () => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

const ImageButton: React.FC<ImageButtonProps> = ({ image, label, onPress, disabled, style }) => {
  const styles = useStyles();

  return (
    <TouchableOpacity style={[styles.root, style]} onPress={onPress} disabled={disabled}>
      <DpmImage source={image} />
      <Typography.Body1>{label}</Typography.Body1>
    </TouchableOpacity>
  );
};

export default ImageButton;
