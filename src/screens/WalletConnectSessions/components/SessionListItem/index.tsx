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
import useModal from 'hooks/useModal';
import ErrorModal from 'modals/ErrorModal';
import useStyles from './useStyles';

type DAppSessionViewProps = {
  session: WalletConnectSession;
};

const SessionListItem = (props: DAppSessionViewProps) => {
  const { session } = props;
  const { t } = useTranslation('walletConnect');
  const styles = useStyles();
  const [closingSession, setClosingSession] = React.useState(false);
  const closeSession = useWalletConnectCloseSession();
  const { showModal } = useModal();

  const appIcon = useMemo(() => walletConnectIconUriToImageSource(session.icon), [session]);

  const date = useMemo(() => {
    const creationDate = new Date(session.creationDate);
    return format(creationDate, 'PPP');
  }, [session]);

  const onRevokePressed = useCallback(async () => {
    setClosingSession(true);
    const closeSessionResult = await closeSession(session);
    if (closeSessionResult.isErr()) {
      showModal(ErrorModal, {
        text: t('error while closing session', { error: closeSessionResult.error.message }),
      });
    }
    setClosingSession(false);
  }, [closeSession, session, showModal, t]);

  return (
    <View style={styles.root}>
      <View style={styles.details}>
        {/* Icon and app name */}
        <View style={styles.title}>
          <FastImage style={styles.icon} source={appIcon} resizeMode="cover" />
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
      <Button
        mode="contained"
        onPress={onRevokePressed}
        loading={closingSession}
        disabled={closingSession}
      >
        {t('revoke')}
      </Button>
    </View>
  );
};

export default SessionListItem;
