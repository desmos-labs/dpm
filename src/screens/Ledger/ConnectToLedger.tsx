import React, { useCallback, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { ConnectToLedgerScreensStackParams } from '../../types/navigation';
import {
  Button,
  DpmImage,
  StyledSafeAreaView,
  ThemedLottieView,
  TopBar,
  Typography,
} from '../../components';
import useConnectToLedger from '../../hooks/ledger/useConnectToLedger';
import { makeStyle } from '../../theming';
import { FlexPadding } from '../../components/FlexPadding';

export type Props = StackScreenProps<ConnectToLedgerScreensStackParams, 'ConnectToLedger'>;

export const ConnectToLedger: React.FC<Props> = ({ navigation, route }) => {
  const { bleLedger, ledgerApp, onConnectionEstablished, onCancel, autoClose } = route.params;
  const { t } = useTranslation();
  const styles = useStyles();
  const { connecting, connected, connectionError, transport, retry } = useConnectToLedger(
    bleLedger,
    ledgerApp
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
    [navigation, connected, onCancel]
  );

  // FIXME remove nested ternary expressions
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
      ) : connected ? (
        <DpmImage style={styles.image} source="success" />
      ) : (
        <DpmImage style={styles.image} source="fail" />
      )}

      <Typography.Subtitle style={styles.status}>
        {connecting ? t('connecting') : connected ? t('connected') : t('error')}
      </Typography.Subtitle>

      <Typography.Body style={styles.errorMessage}>{connectionError}</Typography.Body>

      <FlexPadding flex={1} />
      <Button mode="contained" onPress={onButtonPressed} disabled={connecting} loading={connecting}>
        {connecting ? t('connecting') : connected ? t('next') : t('retry')}
      </Button>
    </StyledSafeAreaView>
  );
};

const useStyles = makeStyle((theme) => ({
  image: {
    width: '60%',
    height: '30%',
    alignSelf: 'center',
  },
  animation: {
    alignSelf: 'center',
  },
  status: {
    marginTop: theme.spacing.m,
    textAlign: 'center',
    alignSelf: 'center',
  },
  errorMessage: {
    marginTop: theme.spacing.m,
    color: theme.colors.error,
    textAlign: 'center',
    alignSelf: 'center',
  },
}));
