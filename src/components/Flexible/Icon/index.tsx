import React from 'react';
import { useTheme } from 'react-native-paper';
import DesmosIcon from '../../DesmosIcon';

export type Props = {
  name: string;
  color?: string;
  size?: number;
};

const Icon: React.FC<Props> = ({ name, color, size }) => {
  const theme = useTheme();
  return <DesmosIcon name={name} color={color ?? theme.colors.icon['3']} size={size ?? 20} />;
};

export default Icon;
