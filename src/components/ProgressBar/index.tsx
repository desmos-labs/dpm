import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import Typography from 'components/Typography';
import { roundFloat } from 'lib/FormatUtils';
import useStyles from './useStyles';

export interface ProgressBarProps {
  /**
   * The percentage value to display.
   * This value must be in the [0, 1] range, all the values > 1 will be
   * rounded to 1.
   */
  value: number;
  /**
   * Optional label to display.
   */
  label?: string;
  /**
   * `true` if the component should display the percentage value.
   */
  showPercentage?: boolean;
  /**
   * View style.
   */
  style?: StyleProp<ViewStyle> & {
    color?: string;
  };
}

const ProgressBar: React.FC<ProgressBarProps> = ({ value, label, showPercentage, style }) => {
  const styles = useStyles();

  const percentageValue = React.useMemo(() => `${roundFloat(value * 100, 0)}%`, [value]);

  return (
    <View style={[styles.root, style]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: style?.color ?? styles.bar.backgroundColor,
            width: percentageValue,
          },
        ]}
      />
      <Typography.Regular14 style={styles.text}>{label ?? ''}</Typography.Regular14>
      <Typography.Regular14 style={styles.text}>
        {showPercentage ? percentageValue : ''}
      </Typography.Regular14>
    </View>
  );
};

export default ProgressBar;
