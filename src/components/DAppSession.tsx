import { format } from 'date-fns';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { makeStyle } from '../theming';
import { DAppSession as DAppSessionType } from '../types/dapp';
import { Button } from './Button';
import { Typography } from './typography';

export type Props = {
  session: DAppSessionType;
  onRevoke: (session: DAppSessionType) => void;
};

export function DAppSession(props: Props) {
  const { session, onRevoke } = props;
  const { t } = useTranslation();
  const styles = useStyles();

  const onRevokePressed = useCallback(() => {
    onRevoke(session);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props]);

  const appIcon = useMemo(() => {
    if (session.iconUri === undefined) {
      return require('../assets/desmos-icon-orange.png');
    }
    return { uri: session.iconUri };
  }, [session.iconUri]);

  const dateString = useMemo(
    () => format(session.creationDate, 'MMM dd, yyyy'),
    [session.creationDate]
  );

  const permissionsString = useMemo(
    () => session.permissions.map((permission) => `#${permission.toString()}`).join(' '),
    [session.permissions]
  );

  return (
    <View style={styles.root}>
      <Image style={styles.icon} source={appIcon} resizeMode="center" />
      <Typography.Title style={styles.appName}>{session.name}</Typography.Title>
      <Typography.Body>{dateString}</Typography.Body>
      <Typography.Body style={styles.permissions}>{permissionsString}</Typography.Body>
      <Button style={styles.revokeButton} mode="contained" onPress={onRevokePressed}>
        {t('revoke')}
      </Button>
    </View>
  );
}

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: theme.roundness,
    backgroundColor: theme.colors.background,
    padding: 32,
  },
  icon: {
    width: 60,
    height: 60,
  },
  appName: {
    marginTop: theme.spacing.s,
  },
  permissions: {
    textAlign: 'center',
    color: theme.colors.primary,
    marginTop: theme.spacing.s,
  },
  revokeButton: {
    marginTop: theme.spacing.l,
  },
}));
