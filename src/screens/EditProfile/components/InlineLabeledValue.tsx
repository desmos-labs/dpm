import React from 'react';
import { StyleProp, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { Typography } from '../../../components/Typography';

export type InlineLabeledValueProps = {
  /**
   * Label displayed on the left of the input
   */
  label: string;
  /**
   * Value that will be displayed to the user.
   */
  value?: string;
  /**
   * Function called when the user press the field.
   * This function is called only when the field is in read
   * only mode.
   */
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export const InlineLabeledValue: React.FC<InlineLabeledValueProps> = (props) => {
  const { label, value, onPress, style } = props;
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Typography.Subtitle style={styles.label}>{label}</Typography.Subtitle>
      <Typography.Body1 style={styles.text}>{value}</Typography.Body1>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 4,
  },
  label: {
    flex: 2,
    paddingTop: 8,
  },
  text: {
    flex: 7,
    marginStart: 2,
    paddingTop: 8,
    paddingBottom: 0,
  },
});

export default InlineLabeledValue;
