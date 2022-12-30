import React from 'react';
import { View } from 'react-native';
import Typography from '../Typography';
import useStyles from './useStyles';

export type LabeledValueProps = {
  /**
   * Label that describe the value.
   */
  label: string;
  /**
   * The value to display to the user.
   */
  value?: string;
};

const LabeledValue: React.FC<LabeledValueProps> = (props) => {
  const { label, value } = props;
  const styles = useStyles();

  return (
    <View style={styles.root}>
      <Typography.Subtitle>{label}</Typography.Subtitle>
      <Typography.Body>{value}</Typography.Body>
    </View>
  );
};

export default LabeledValue;
