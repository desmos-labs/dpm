import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { makeStyle } from '../theming';
import { Typography } from './typography';

export type Props = {
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

export const MnemonicWordBadge: React.FC<Props> = (props) => {
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
      <Typography.Subtitle>{value}</Typography.Subtitle>
      <Text style={styles.index}>{index}</Text>
    </TouchableOpacity>
  );
};

const useStyles = makeStyle((theme) => ({
  root: {
    backgroundColor: theme.colors.surface,
    borderRadius: 4,
    padding: theme.spacing.s,
  },
  index: {
    position: 'absolute',
    top: theme.spacing.s,
    right: theme.spacing.s,
    fontSize: 8,
    color: theme.colors.text,
  },
}));
