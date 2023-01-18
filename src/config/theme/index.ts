/* Disable the no-undef lint as the ReactNativePaper namespace will be provided at runtime */
/* eslint-disable no-undef */
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import NamedStyles = StyleSheet.NamedStyles;

export function makeStyle<T extends NamedStyles<T> | NamedStyles<any>>(
  styleProvider: (theme: ReactNativePaper.Theme) => T,
): () => T {
  return () => {
    const theme = useTheme();
    return StyleSheet.create(styleProvider(theme));
  };
}

export function makeStyleWithProps<P, T extends NamedStyles<T> | NamedStyles<any>>(
  styleProvider: (props: P, theme: ReactNativePaper.Theme) => T,
): (props: P) => T {
  return (props: P) => {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(styleProvider(props, theme)), [props, theme]);
  };
}
