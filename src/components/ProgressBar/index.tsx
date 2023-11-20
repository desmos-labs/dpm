import React from 'react';
import { StyleProp, TextStyle, View, ViewStyle } from 'react-native';
import Typography from 'components/Typography';
import { roundFloat } from 'lib/FormatUtils';
import useStyles from './useStyles';

interface ProgressBarProps {
  /**
   * The percentage value to display.
   * This value must be in the [0, 1] range.
   * If the value is greater than 1 will be rounded to 1 and if is lower
   * than 0 will be rounded to 0.
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
    /**
     * Bar color.
     */
    color?: string;
  };
  /**
   * Style that will be applied to the label text.
   */
  labelStyle?: StyleProp<TextStyle>;
  /**
   * Percentage label style.
   */
  percentageStyle?: StyleProp<TextStyle>;
}

/**
 * Component that displays a progressbar.
 */
const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage,
  style,
  labelStyle,
  percentageStyle,
}) => {
  const styles = useStyles();

  const percentageValue = React.useMemo(() => {
    if (value >= 1) {
      return '100%';
    }
    if (value <= 0) {
      return '0%';
    }

    return `${roundFloat(value * 100, 0)}%`;
  }, [value]);

  return (
    <View style={[styles.root, style]}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: style?.color,
            width: percentageValue,
          },
        ]}
      />
      <Typography.Regular14 style={[styles.text, labelStyle]}>{label ?? ''}</Typography.Regular14>
      <Typography.Regular14 style={[styles.text, percentageStyle]}>
        {showPercentage ? percentageValue : ''}
      </Typography.Regular14>
    </View>
  );
};

export default ProgressBar;
