import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import Typography from '../Typography';

export type LabeledValueProps = {
  /**
   * Label that describe the value.
   */
  label: string;
  /**
   * The value to display to the user.
   */
  value?: string;
  /**
   * Tels if the value is being loaded.
   */
  loading?: boolean;
  /**
   * View style.
   */
  style?: StyleProp<ViewStyle> | undefined;
};

const LabeledValue: React.FC<LabeledValueProps> = ({ label, value, loading, style }) => (
  <View style={style}>
    <Typography.SemiBold14>{label}</Typography.SemiBold14>
    {loading === true ? (
      <StyledActivityIndicator />
    ) : (
      <Typography.Regular14>{value}</Typography.Regular14>
    )}
  </View>
);

export default LabeledValue;
