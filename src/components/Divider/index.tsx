import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import useStyles from './useStyles';

type DividerProps = {
  style?: StyleProp<ViewStyle>;
};

const Divider = (props: DividerProps) => {
  const { style } = props;
  const styles = useStyles();

  return <View style={StyleSheet.compose(styles.divider as StyleProp<ViewStyle>, style)} />;
};

export default Divider;
