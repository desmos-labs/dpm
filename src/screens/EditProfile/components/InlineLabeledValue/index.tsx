import React from 'react';
import { StyleProp, TouchableOpacity, ViewStyle } from 'react-native';
import Typography from 'components/Typography';
import useStyles from './useStyles';

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

const InlineLabeledValue: React.FC<InlineLabeledValueProps> = (props) => {
  const { label, value, onPress, style } = props;
  const styles = useStyles();
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <Typography.Subtitle style={styles.label}>{label}</Typography.Subtitle>
      <Typography.Body1 style={styles.text}>{value}</Typography.Body1>
    </TouchableOpacity>
  );
};

export default InlineLabeledValue;
