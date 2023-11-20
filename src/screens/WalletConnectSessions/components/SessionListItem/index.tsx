import { format } from 'date-fns';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Typography from 'components/Typography';
import Button from 'components/Button';
import { WalletConnectSession } from 'types/walletConnect';
import FastImage from 'react-native-fast-image';
import Spacer from 'components/Spacer';
import useWalletConnectCloseSession from 'hooks/walletconnect/useWalletConnectCloseSession';
import { walletConnectIconUriToImageSource } from 'lib/WalletConnectUtils';
import useStyles from './useStyles';

type DAppSessionViewProps = {
  session: WalletConnectSession;
};

const SessionListItem = (props: DAppSessionViewProps) => {
  const { session } = props;
  const { t } = useTranslation('walletConnect');
  const styles = useStyles();
  const closeSession = useWalletConnectCloseSession();

  const appIcon = useMemo(() => walletConnectIconUriToImageSource(session.icon), [session]);

  const date = useMemo(() => {
    const creationDate = new Date(session.creationDate);
    return format(creationDate, 'PPP');
  }, [session]);

  const onRevokePressed = useCallback(() => {
    closeSession(session);
  }, [closeSession, session]);

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

        {/* Creation date */}
        <View style={styles.texts}>
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
