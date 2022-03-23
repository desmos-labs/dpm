import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { format } from 'date-fns';
import { DAppSession as DAppSessionType } from '../types/dapp';
import { makeStyle } from '../theming';
import { Button, Typography } from './index';

export type Props = {
  session: DAppSessionType;
  onRevoke: (session: DAppSessionType) => void;
};

export function DAppSession(props: Props) {
  const { session } = props;
  const { t } = useTranslation();
  const styles = useStyles();

  const onRevokePressed = useCallback(() => {
    props.onRevoke(props.session);
  }, [props]);

  const appIcon = useMemo(() => {
    if (props.session.iconUri === undefined) {
      return require('../assets/desmos-icon-orange.png');
    }
    return { uri: props.session.iconUri };
  }, [props.session.iconUri]);

  const dateString = useMemo(
    () => format(props.session.creationDate, 'MMM dd, yyyy'),
    [props.session.creationDate]
  );

  const permissionsString = useMemo(
    () => props.session.permissions.map((permission) => `#${permission.toString()}`).join(' '),
    [props.session.permissions]
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
