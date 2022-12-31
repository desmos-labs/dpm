import { format } from 'date-fns';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { DAppSession as DAppSessionType } from 'types/dapp';
import Typography from 'components/Typography';
import Button from 'components/Button';
import useStyles from './useStyles';

export type DAppSessionViewProps = {
  session: DAppSessionType;
  onRevoke: (session: DAppSessionType) => void;
};

const DAppSessionView = (props: DAppSessionViewProps) => {
  const { session, onRevoke } = props;
  const { t } = useTranslation();
  const styles = useStyles();

  const onRevokePressed = useCallback(() => {
    onRevoke(session);
  }, [props]);

  const appIcon = useMemo(() => {
    if (session.iconUri === undefined) {
      return require('assets/desmos-icon-orange.png');
    }
    return { uri: session.iconUri };
  }, [session.iconUri]);

  const dateString = useMemo(
    () => format(session.creationDate, 'MMM dd, yyyy'),
    [session.creationDate],
  );

  const permissionsString = useMemo(
    () => session.permissions.map((permission) => `#${permission.toString()}`).join(' '),
    [session.permissions],
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
};

export default DAppSessionView;
