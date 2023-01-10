import { format } from 'date-fns';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Typography from 'components/Typography';
import Button from 'components/Button';
import { WalletConnectPermission, WalletConnectSession } from 'types/walletConnect';
import { desmosIconOrange } from 'assets/images';
import FastImage from 'react-native-fast-image';
import Spacer from 'components/Spacer';
import useStyles from './useStyles';

export type DAppSessionViewProps = {
  session: WalletConnectSession;
};

const SessionListItem = (props: DAppSessionViewProps) => {
  const { session } = props;
  const { t } = useTranslation('walletConnect');
  const styles = useStyles();

  const appIcon = useMemo(
    () => (session.icon ? { uri: session.icon } : desmosIconOrange),
    [session],
  );

  const date = useMemo(() => format(session.creationDate, 'PPP'), [session]);

  const permissionToString = useCallback(
    (permission: WalletConnectPermission): string => {
      switch (permission) {
        case WalletConnectPermission.SIGN_TX:
          return t('sign transaction');
        case WalletConnectPermission.BROADCAST_TX:
          return t('broadcast transaction');
        default:
          return '';
      }
    },
    [t],
  );
  const permissions = useMemo(
    () => session.permissions.map(permissionToString),
    [permissionToString, session.permissions],
  );

  const onRevokePressed = useCallback(() => {
    console.log('SessionListItem - onRevokePressed', session.name);
  }, [session.name]);

  return (
    <View style={styles.root}>
      <View style={styles.details}>
        {/* Icon and app name */}
        <View style={styles.title}>
          <FastImage style={styles.icon} source={appIcon} resizeMode="center" />
          <Spacer paddingHorizontal={4} />
          <Typography.Body1 style={styles.appName}>{session.name}</Typography.Body1>
        </View>

        <Spacer paddingVertical={4} />

        {/* Permissions and creation date */}
        <View style={styles.texts}>
          {permissions.map((permission) => (
            <Typography.Body style={styles.permissions}>{permission}</Typography.Body>
          ))}
          <Typography.Body style={styles.date}>{date}</Typography.Body>
        </View>
      </View>

      {/* Revoke button */}
      <Button mode="contained" onPress={onRevokePressed}>
        {t('revoke')}
      </Button>
    </View>
  );
};

export default SessionListItem;
