import React, { FC, PropsWithChildren, useCallback } from 'react';
import { Snackbar } from 'react-native-paper';
import { useSnackBarState } from 'lib/SnackBarProvider/recoil';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

export interface SnackBarProviderProps {}

const SnackBarProvider: FC<PropsWithChildren<SnackBarProviderProps>> = ({ children }) => {
  const { visible, onDismiss, text, duration } = useSnackBarState();
  const { t } = useTranslation();
  const styles = useStyles();

  const onDismissAction = useCallback(() => {
    if (onDismiss) {
      onDismiss();
    }
  }, [onDismiss]);

  return (
    <>
      {children}
      <Snackbar
        style={styles.snackbar}
        visible={visible}
        onDismiss={onDismissAction}
        action={{ label: t('hide') }}
        duration={duration ?? Snackbar.DURATION_SHORT}
      >
        <Typography.Body>{text}</Typography.Body>
      </Snackbar>
    </>
  );
};

export default SnackBarProvider;
