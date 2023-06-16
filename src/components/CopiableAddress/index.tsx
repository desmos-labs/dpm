import React from 'react';
import { useTranslation } from 'react-i18next';
import Clipboard from '@react-native-community/clipboard';
import { useShowSnackBar } from 'lib/SnackBarProvider/recoil';
import Typography from 'components/Typography';
import useStyles from './useStyles';

export interface Props {
  /**
   * The address to display.
   */
  readonly address?: string;
}

/**
 * Component that shows a address that when clicked copy the
 * value into the clipboard.
 */
const CopiableAddress: React.FC<Props> = ({ address }) => {
  const { t } = useTranslation();
  const showSnackBar = useShowSnackBar();
  const styles = useStyles();

  const onPress = React.useCallback(() => {
    if (address !== undefined) {
      Clipboard.setString(address);
      showSnackBar(t('value copied'));
    }
  }, [t, address, showSnackBar]);

  return (
    <Typography.Regular14
      style={styles.text}
      numberOfLines={1}
      ellipsizeMode={'middle'}
      onPress={onPress}
    >
      {address}
    </Typography.Regular14>
  );
};

export default CopiableAddress;
