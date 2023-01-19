import React, { useCallback, useState } from 'react';
import IconButton, { IconButtonProps } from 'components/IconButton';
import Clipboard from '@react-native-community/clipboard';
import { useTranslation } from 'react-i18next';
import { Snackbar } from 'react-native-paper';
import Typography from 'components/Typography';
import { Modal, Pressable } from 'react-native';
import useStyles from './useStyles';

export interface CopyButtonProps extends Omit<IconButtonProps, 'icon'> {
  value: string;
}

const CopyButton = (props: CopyButtonProps) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { value } = props;

  const [showHint, setShowHint] = useState<boolean>(false);

  const onCopyPressed = useCallback(() => {
    Clipboard.setString(value);
    setShowHint(true);
  }, [value]);

  const onDismiss = useCallback(() => {
    setShowHint(false);
  }, []);

  return (
    <>
      <IconButton
        icon="content-copy"
        color="#ffffff"
        size={16}
        onPress={onCopyPressed}
        {...props}
      />

      {/* Snackbar */}
      <Modal style={styles.root} visible={showHint} transparent={true}>
        <Pressable onPress={onDismiss} style={{ flex: 1, justifyContent: 'center' }}>
          <Snackbar
            visible={showHint}
            style={styles.snackbar}
            onDismiss={onDismiss}
            action={{ label: t('hide') }}
            duration={Snackbar.DURATION_SHORT}
          >
            <Typography.Body>{t('value copied')}</Typography.Body>
          </Snackbar>
        </Pressable>
      </Modal>
    </>
  );
};

export default CopyButton;
