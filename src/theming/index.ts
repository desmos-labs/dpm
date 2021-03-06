import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';
import NamedStyles = StyleSheet.NamedStyles;

export * from './theme';

export function makeStyle<T extends NamedStyles<T> | NamedStyles<any>>(
  styleProvider: (theme: ReactNativePaper.Theme) => T
): () => T {
  return () => {
    const theme = useTheme();
    return StyleSheet.create(styleProvider(theme));
  };
}

export function makeStyleWithProps<P, T extends NamedStyles<T> | NamedStyles<any>>(
  styleProvider: (props: P, theme: ReactNativePaper.Theme) => T
): (props: P) => T {
  return (props: P) => {
    const theme = useTheme();
    return useMemo(() => StyleSheet.create(styleProvider(props, theme)), [props, theme]);
  };
}
