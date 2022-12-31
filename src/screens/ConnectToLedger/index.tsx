import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import useConnectToLedger from 'hooks/ledger/useConnectToLedger';
import { ConnectToLedgerScreensStackParams } from 'types/navigation';
import Typography from 'components/Typography';
import DpmImage from 'components/DPMImage';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import ThemedLottieView from 'components/ThemedLottieView';
import Flexible from 'components/Flexible';
import Button from 'components/Button';
import useStyles from './useStyles';

export type Props = StackScreenProps<ConnectToLedgerScreensStackParams, 'ConnectToLedger'>;

const ConnectToLedger: React.FC<Props> = ({ navigation, route }) => {
  const { bleLedger, ledgerApp, onConnectionEstablished, onCancel, autoClose } = route.params;
  const { t } = useTranslation();
  const styles = useStyles();
  const { connecting, connected, connectionError, transport, retry } = useConnectToLedger(
    bleLedger,
    ledgerApp,
  );

  const status = connected ? t('connected') : t('error');
  const statusButton = connected ? t('next') : t('retry');
  const statusImage = connected ? (
    <DpmImage style={styles.image} source="success" />
  ) : (
    <DpmImage style={styles.image} source="fail" />
  );

  useEffect(() => {
    if (connected && autoClose === true) {
      navigation.goBack();
      onConnectionEstablished(transport!);
    }
  }, [connected, autoClose, onConnectionEstablished, transport, navigation]);

  const onButtonPressed = useCallback(() => {
    if (connected) {
      navigation.goBack();
      onConnectionEstablished(transport!);
    } else {
      retry();
    }
  }, [connected, navigation, onConnectionEstablished, retry, transport]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (e.data.action.type === 'GO_BACK' && !connected && onCancel !== undefined) {
          onCancel();
        }
      }),
    [navigation, connected, onCancel],
  );

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={{ navigation }} />}>
      {connecting ? (
        <ThemedLottieView
          style={styles.animation}
          source="connect-to-ledger"
          autoPlay
          loop
          autoSize
        />
      ) : (
        statusImage
      )}

      <Typography.Subtitle style={styles.status}>
        {connecting ? t('connecting') : status}
      </Typography.Subtitle>

      <Typography.Body style={styles.errorMessage}>{connectionError}</Typography.Body>

      <Flexible.Padding flex={1} />
      <Button mode="contained" onPress={onButtonPressed} disabled={connecting} loading={connecting}>
        {connecting ? t('connecting') : statusButton}
      </Button>
    </StyledSafeAreaView>
  );
};

export default ConnectToLedger;
