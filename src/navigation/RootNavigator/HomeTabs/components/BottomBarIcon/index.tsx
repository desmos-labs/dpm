import React from 'react';
import { Image, ImageProps } from 'react-native';

export type BottomBarIconProps = ImageProps & {
  size?: number;
};

const BottomBarIcon: React.FC<BottomBarIconProps> = ({ size, ...rest }) => (
  <Image
    {...rest}
    style={[rest.style, { width: size ?? 24, height: size ?? 24 }]}
    resizeMode="cover"
  />
);

export default BottomBarIcon;
