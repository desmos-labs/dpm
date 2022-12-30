import React from 'react';
import { View } from 'react-native';
import { makeStyle } from '../theming';
import { Typography } from './Typography';

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

export const LabeledValue: React.FC<LabeledValueProps> = (props) => {
  const { label, value } = props;
  const styles = useStyles();

  return (
    <View style={styles.root}>
      <Typography.Subtitle>{label}</Typography.Subtitle>
      <Typography.Body>{value}</Typography.Body>
    </View>
  );
};

const useStyles = makeStyle((theme) => ({
  root: {
    padding: theme.spacing.s,
  },
}));
