import React from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';
import { useTheme } from 'react-native-paper';

const StyledRefreshControl: React.FC<RefreshControlProps> = (props) => {
  const theme = useTheme();
  return (
    <RefreshControl {...props} colors={[theme.colors.primary]} tintColor={theme.colors.primary} />
  );
};

export default StyledRefreshControl;
