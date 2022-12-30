import React from 'react';
import MaterialCommunityIcon from 'react-native-paper/src/components/MaterialCommunityIcon';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import icoMoonConfig from './selection.json';

const desmosIcons = [
  'authorization',
  'profile',
  'back',
  'camera',
  'settings',
  'edit',
  'more',
  'delete',
  'show',
  'hide',
  'arrow-right',
  'menu',
  'home',
];

const CustomIcon = createIconSetFromIcoMoon(icoMoonConfig);

export type DesmosIconProps = {
  name: string;
  color: string;
  size: number;
  direction?: 'rtl' | 'ltr';
  allowFontScaling?: boolean;
};

const DesmosIcon: React.FC<DesmosIconProps> = ({ name, color, size, direction, allowFontScaling }) => {
  if (desmosIcons.indexOf(name) >= 0) {
    return (
      <CustomIcon
        name={name}
        color={color}
        // Our icons have less padding so make it a bit smaller
        // to keep a size similar to MaterialCommunityIcon
        size={size - 4}
        allowFontScaling={allowFontScaling}
      />
    );
  }
  return (
    <MaterialCommunityIcon
      name={name}
      color={color}
      size={size}
      direction={direction ?? 'ltr'}
      allowFontScaling={allowFontScaling}
    />
  );
};

export default DesmosIcon;
