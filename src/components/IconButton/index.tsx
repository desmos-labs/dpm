import React, { useMemo } from 'react';
import { IconButton as BaseIconButton, useTheme } from 'react-native-paper';

export type IconButtonProps = {
  icon: string;
  size?: number;
  color?: string | null;
  onPress?: (() => void) | undefined;
  style?: any;
};

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { size } = props;
  const theme = useTheme();
  const color = useMemo(() => {
    if (props.color === null) {
      return undefined;
    }
    return props.color ?? props.style.color ?? theme.colors.icon['1'];
  }, [props.color, props.style, theme]);

  return <BaseIconButton color={color} size={size ?? 28} {...props} />;
};

export default IconButton;
