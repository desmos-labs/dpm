import React from 'react';
import { Image, ImageProps } from 'react-native';

export type TabIconProps = ImageProps & {
  size?: number;
};

const TabIcon: React.FC<TabIconProps> = ({ size, ...rest }) => (
  <Image
    {...rest}
    style={[rest.style, { width: size ?? 24, height: size ?? 24 }]}
    resizeMode="cover"
  />
);

export default TabIcon;
