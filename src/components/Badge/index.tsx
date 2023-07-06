import React from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import useStyles from './useStyles';
import BadgeProps from './props';

/**
 * Component that displays a badge with a text.
 */
const Badge: React.FC<BadgeProps> = (props) => {
  const styles = useStyles(props);
  const { text } = props;

  return (
    <View style={[styles.root, props.style]}>
      <Typography.Regular12 style={[styles.text, props.textStyle]}>{text}</Typography.Regular12>
    </View>
  );
};

export default Badge;
