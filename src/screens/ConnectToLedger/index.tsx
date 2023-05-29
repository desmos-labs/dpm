import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import DpmImage from 'components/DPMImage';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import ThemedLottieView from 'components/ThemedLottieView';
import Flexible from 'components/Flexible';
import Button from 'components/Button';
import { BLELedger, LedgerApp } from 'types/ledger';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { DPMAnimations, DPMImages } from 'types/images';
import ROUTES from 'navigation/routes';
import { ConnectToLedgerStackParamList } from 'navigation/RootNavigator/ConnectToLedgerStack';
import { LedgerConnectionPhase, useConnectToLedger } from './hooks';
import useStyles from './useStyles';

export interface ConnectToLedgerParams {
  readonly bleLedger: BLELedger;
  readonly ledgerApp: LedgerApp;
  readonly onConnect: (transport: BluetoothTransport) => any;
}

export type Props = StackScreenProps<ConnectToLedgerStackParamList, ROUTES.CONNECT_TO_LEDGER>;

const ConnectToLedger: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation('common');
  const styles = useStyles();

  const { bleLedger, ledgerApp, onConnect } = route.params;
  const { connecting, connectionPhase, connected, connectionError, transport, retry } =
    useConnectToLedger(bleLedger, ledgerApp);

  // -------- VARIABLES --------
  const connectionStatus = React.useMemo(() => {
    if (connecting) {
      switch (connectionPhase) {
        case LedgerConnectionPhase.OpeningTransport:
          return t('ledger:opening transport');
        case LedgerConnectionPhase.RequestingAppOpen:
          return t('ledger:please approve application open request');
        case LedgerConnectionPhase.RequestingAppClose:
          return t('ledger:closing wrong application');
        default:
          return t('connecting');
      }
    } else if (connected) {
      return t('connected');
    } else {
      return t('error');
    }
  }, [connected, connecting, connectionPhase, t]);
  const statusButton = connected ? t('next') : t('retry');
  const statusImage = connected ? (
    <DpmImage style={styles.image} source={DPMImages.Success} />
  ) : (
    <DpmImage style={styles.image} source={DPMImages.Fail} />
  );

  useEffect(() => {
    if (connected) {
      onConnect(transport!);
    }
  }, [connected, transport, onConnect, navigation]);

  const onButtonPressed = useCallback(() => {
    if (connected) {
      onConnect(transport!);
    } else {
      retry();
    }
  }, [connected, onConnect, retry, transport]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={{ navigation }} />}>
      {connecting ? (
        <ThemedLottieView
          style={styles.animation}
          source={DPMAnimations.ConnectToLedger}
          autoPlay
          loop
          autoSize
        />
      ) : (
        statusImage
      )}

      <Typography.Subtitle style={styles.status}>{connectionStatus}</Typography.Subtitle>

      <Typography.Body style={styles.errorMessage}>{connectionError}</Typography.Body>

      <Flexible.Padding flex={1} />
      <Button mode="contained" onPress={onButtonPressed} disabled={connecting} loading={connecting}>
        {connecting ? t('connecting') : statusButton}
      </Button>
    </StyledSafeAreaView>
  );
};

export default ConnectToLedger;
