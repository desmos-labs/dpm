import React from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import useStyles from './useStyles';

export interface BadgeProps {
  /**
   * Text to display inside the badge.
   */
  text: string;
}

/**
 * Component that displays a badge with a text.
 */
const Badge: React.FC<BadgeProps> = ({ text }) => {
  const styles = useStyles();
  return (
    <View style={styles.root}>
      <Typography.Regular12 style={styles.text}>{text}</Typography.Regular12>
    </View>
  );
};

export default Badge;
