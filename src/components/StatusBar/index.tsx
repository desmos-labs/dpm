import { useTheme } from 'react-native-paper';
import React from 'react';
import { StatusBar as NativeStatusBar } from 'react-native';

const StatusBar = () => {
  const theme = useTheme();
  const statusBarVariant = theme.dark ? 'light-content' : 'dark-content';

  return <NativeStatusBar barStyle={statusBarVariant} backgroundColor="transparent" />;
};

export default StatusBar;
