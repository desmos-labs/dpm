import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import Typography from 'components/Typography';
import useStyles from './useStyles';

export type MnemonicWordBadgeProps = {
  /**
   * The word to display.
   */
  value: string;
  /**
   * An optional word index that will be displayed on the top right corner.
   */
  index?: number;
  /**
   * Function called when the badge is pressed.
   */
  onPress?: (word: string) => void;
  style?: StyleProp<ViewStyle>;
};

const MnemonicWordBadge: React.FC<MnemonicWordBadgeProps> = (props) => {
  const { value, index, onPress, style } = props;
  const styles = useStyles();

  return (
    <TouchableOpacity
      style={StyleSheet.compose(styles.root as StyleProp<ViewStyle>, style)}
      onPress={
        onPress
          ? () => {
              onPress!(value);
            }
          : undefined
      }
    >
      <Typography.Regular14>{value}</Typography.Regular14>
      <Text style={styles.index}>{index}</Text>
    </TouchableOpacity>
  );
};

export default MnemonicWordBadge;
