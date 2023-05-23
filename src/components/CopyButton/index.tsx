import React, { useCallback } from 'react';
import IconButton, { IconButtonProps } from 'components/IconButton';
import Clipboard from '@react-native-community/clipboard';
import { useTranslation } from 'react-i18next';
import { useShowSnackBar } from 'lib/SnackBarProvider/recoil';
import useStyles from './useStyles';

export interface CopyButtonProps extends Omit<IconButtonProps, 'icon'> {
  /**
   * Value to be set in the clipboard when the user press on this component.
   */
  value: string;
}

/**
 * Component that shows a button with an icon that suggest the user
 * that can press on this component to copy the value in the clipboard.
 */
const CopyButton: React.FC<CopyButtonProps> = (props) => {
  const { t } = useTranslation();
  const { value } = props;
  const styles = useStyles();
  const showSnackBar = useShowSnackBar();

  const onCopyPressed = useCallback(() => {
    Clipboard.setString(value);
    showSnackBar(t('value copied'));
  }, [value, showSnackBar, t]);

  return (
    <IconButton
      style={styles.icon}
      icon="content-copy"
      size={16}
      onPress={onCopyPressed}
      {...props}
    />
  );
};

export default CopyButton;
