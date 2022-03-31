import React from 'react';
import { IconButton as BaseIconButton, useTheme } from 'react-native-paper';

type Props = React.ComponentProps<typeof BaseIconButton>;

// eslint-disable-next-line import/prefer-default-export
export const IconButton: React.FC<Props> = (props) => {
  const theme = useTheme();

  // eslint-disable-next-line react/destructuring-assignment,react/prop-types
  return <BaseIconButton color={theme.colors.icon['1']} {...props} size={props.size ?? 28} />;
};
