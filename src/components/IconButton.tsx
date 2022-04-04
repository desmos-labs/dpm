import React from 'react';
import { IconButton as BaseIconButton, useTheme } from 'react-native-paper';

type IconButtonProps = {
  icon: string;
  size?: number;
  color?: string;
  onPress?: (() => void) | undefined;
  style?: any;
};

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { icon, size } = props;
  const theme = useTheme();

  return <BaseIconButton icon={icon} color={theme.colors.icon['1']} size={size ?? 28} {...props} />;
};

export default IconButton;
