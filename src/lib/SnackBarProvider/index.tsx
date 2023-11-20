import React, { FC, PropsWithChildren, useCallback } from 'react';
import { Snackbar, useTheme } from 'react-native-paper';
import { useSnackBarState } from 'lib/SnackBarProvider/recoil';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

interface SnackBarProviderProps {}

const SnackBarProvider: FC<PropsWithChildren<SnackBarProviderProps>> = ({ children }) => {
  const { visible, onDismiss, text, duration } = useSnackBarState();
  const { t } = useTranslation();
  const styles = useStyles();
  const theme = useTheme();

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
        theme={{ colors: { accent: theme.colors.primary } }}
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
