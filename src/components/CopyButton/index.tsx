import React, { useCallback } from 'react';
import IconButton, { IconButtonProps } from 'components/IconButton';
import Clipboard from '@react-native-community/clipboard';
import { useTranslation } from 'react-i18next';
import { useShowSnackBar } from 'lib/SnackBarProvider/recoil';

export interface CopyButtonProps extends Omit<IconButtonProps, 'icon'> {
  value: string;
}

const CopyButton = (props: CopyButtonProps) => {
  const { t } = useTranslation();
  const { value } = props;
  const showSnackBar = useShowSnackBar();

  const onCopyPressed = useCallback(() => {
    Clipboard.setString(value);
    showSnackBar(t('value copied'));
  }, [value, showSnackBar, t]);

  return (
    <IconButton icon="content-copy" color="#ffffff" size={16} onPress={onCopyPressed} {...props} />
  );
};

export default CopyButton;
