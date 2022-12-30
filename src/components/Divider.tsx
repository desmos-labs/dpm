import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { makeStyle } from '../theming';

export type DividerProps = {
  style?: StyleProp<ViewStyle>;
};

export const Divider: (props: DividerProps) => JSX.Element | null = (props) => {
  // eslint-disable-next-line react/prop-types
  const { style } = props;
  const styles = useStyles();

  return <View style={StyleSheet.compose(styles.divider as StyleProp<ViewStyle>, style)} />;
};

const useStyles = makeStyle((theme) => ({
  divider: {
    height: 1,
    backgroundColor: theme.colors.line,
  },
}));
