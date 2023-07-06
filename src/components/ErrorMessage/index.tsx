import React from 'react';
import { Image, View } from 'react-native';
import Typography from 'components/Typography';
import { infoIcon } from 'assets/images';
import useStyles from './useStyles';

export interface Props {
  /**
   * Message to display to the user.
   */
  readonly message?: string | null;
}

/**
 * Components to display and error message to the user.
 */
const ErrorMessage: React.FC<Props> = ({ message }) => {
  const styles = useStyles();
  const visible = React.useMemo(
    () => message !== undefined && message !== null && message !== '',
    [message],
  );

  return visible ? (
    <View style={styles.root}>
      <Image style={styles.icon} source={infoIcon} />
      <Typography.Regular16 style={styles.text}>{message}</Typography.Regular16>
    </View>
  ) : null;
};

export default ErrorMessage;
